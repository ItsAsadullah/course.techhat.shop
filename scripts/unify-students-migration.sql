-- ============================================================
-- Student Data Unification Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── Step 1: Add missing columns to students table ────────────
ALTER TABLE students 
  ADD COLUMN IF NOT EXISTS total_course_fee numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Ensure admission_date column exists (may already exist via admission_id relation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'students' AND column_name = 'admission_date'
  ) THEN
    ALTER TABLE students ADD COLUMN admission_date date DEFAULT CURRENT_DATE;
  END IF;
END $$;

-- ── Step 2: Create unified payments table ────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  payment_method text NOT NULL DEFAULT 'Cash',
  remarks text,
  order_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to see their own payments
CREATE POLICY "Students can view own payments" ON payments
  FOR SELECT TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Allow service role full access (for admin operations)
CREATE POLICY "Service role full access on payments" ON payments
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ── Step 3: Migrate legacy_students → students ──────────────
-- Only migrate those that don't already exist by mobile number
INSERT INTO students (full_name_en, mobile, total_course_fee, admission_date, created_at)
SELECT 
  ls.name, 
  ls.phone, 
  COALESCE(ls.total_course_fee, 0),
  COALESCE(ls.admission_date::date, ls.created_at::date),
  ls.created_at
FROM legacy_students ls
WHERE ls.phone IS NOT NULL 
  AND ls.phone != ''
  AND NOT EXISTS (
    SELECT 1 FROM students s WHERE s.mobile = ls.phone
  );

-- ── Step 4: Migrate legacy_payments → payments ──────────────
INSERT INTO payments (student_id, amount, payment_date, payment_method, remarks, created_at)
SELECT 
  s.id,
  lp.amount,
  lp.payment_date,
  lp.payment_method,
  lp.remarks,
  lp.created_at
FROM legacy_payments lp
JOIN legacy_students ls ON lp.student_id = ls.id
JOIN students s ON s.mobile = ls.phone
WHERE ls.phone IS NOT NULL AND ls.phone != '';

-- ── Step 5: Clean up duplicate students ─────────────────────
-- Keep the record with most complete data for each mobile number
-- First, identify and rank duplicates
WITH ranked_students AS (
  SELECT id, mobile,
         ROW_NUMBER() OVER (
           PARTITION BY mobile 
           ORDER BY 
             (CASE WHEN father_name IS NOT NULL AND father_name != '' THEN 1 ELSE 0 END +
              CASE WHEN dob IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN gender IS NOT NULL AND gender != '' THEN 1 ELSE 0 END +
              CASE WHEN full_name_bn IS NOT NULL AND full_name_bn != '' THEN 1 ELSE 0 END +
              CASE WHEN religion IS NOT NULL AND religion != '' THEN 1 ELSE 0 END +
              CASE WHEN nid IS NOT NULL AND nid != '' THEN 1 ELSE 0 END +
              CASE WHEN blood_group IS NOT NULL AND blood_group != '' THEN 1 ELSE 0 END) DESC,
             created_at ASC
         ) as rn
  FROM students
  WHERE mobile IS NOT NULL AND mobile != ''
),
-- Find mappings from duplicate ID -> primary ID
duplicate_mappings AS (
  SELECT 
    d.id as duplicate_id, 
    p.id as primary_id
  FROM ranked_students d
  JOIN ranked_students p ON d.mobile = p.mobile AND p.rn = 1
  WHERE d.rn > 1
)
-- Update all dependent tables to point to primary student
UPDATE orders SET student_id = dm.primary_id FROM duplicate_mappings dm WHERE orders.student_id = dm.duplicate_id;
-- Re-run to handle student_addresses, guardians, student_education, student_documents, admissions
WITH ranked_students AS (
  SELECT id, mobile,
         ROW_NUMBER() OVER (
           PARTITION BY mobile 
           ORDER BY 
             (CASE WHEN father_name IS NOT NULL AND father_name != '' THEN 1 ELSE 0 END +
              CASE WHEN dob IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN gender IS NOT NULL AND gender != '' THEN 1 ELSE 0 END +
              CASE WHEN full_name_bn IS NOT NULL AND full_name_bn != '' THEN 1 ELSE 0 END +
              CASE WHEN religion IS NOT NULL AND religion != '' THEN 1 ELSE 0 END +
              CASE WHEN nid IS NOT NULL AND nid != '' THEN 1 ELSE 0 END +
              CASE WHEN blood_group IS NOT NULL AND blood_group != '' THEN 1 ELSE 0 END) DESC,
             created_at ASC
         ) as rn
  FROM students
  WHERE mobile IS NOT NULL AND mobile != ''
), duplicate_mappings AS (
  SELECT d.id as duplicate_id, p.id as primary_id
  FROM ranked_students d
  JOIN ranked_students p ON d.mobile = p.mobile AND p.rn = 1
  WHERE d.rn > 1
)
UPDATE student_addresses SET student_id = dm.primary_id FROM duplicate_mappings dm WHERE student_addresses.student_id = dm.duplicate_id;

WITH ranked_students AS (
  SELECT id, mobile, ROW_NUMBER() OVER (PARTITION BY mobile ORDER BY created_at ASC) as rn FROM students WHERE mobile IS NOT NULL AND mobile != ''
), duplicate_mappings AS (
  SELECT d.id as duplicate_id, p.id as primary_id FROM ranked_students d JOIN ranked_students p ON d.mobile = p.mobile AND p.rn = 1 WHERE d.rn > 1
)
UPDATE guardians SET student_id = dm.primary_id FROM duplicate_mappings dm WHERE guardians.student_id = dm.duplicate_id;

WITH ranked_students AS (
  SELECT id, mobile, ROW_NUMBER() OVER (PARTITION BY mobile ORDER BY created_at ASC) as rn FROM students WHERE mobile IS NOT NULL AND mobile != ''
), duplicate_mappings AS (
  SELECT d.id as duplicate_id, p.id as primary_id FROM ranked_students d JOIN ranked_students p ON d.mobile = p.mobile AND p.rn = 1 WHERE d.rn > 1
)
UPDATE student_education SET student_id = dm.primary_id FROM duplicate_mappings dm WHERE student_education.student_id = dm.duplicate_id;

WITH ranked_students AS (
  SELECT id, mobile, ROW_NUMBER() OVER (PARTITION BY mobile ORDER BY created_at ASC) as rn FROM students WHERE mobile IS NOT NULL AND mobile != ''
), duplicate_mappings AS (
  SELECT d.id as duplicate_id, p.id as primary_id FROM ranked_students d JOIN ranked_students p ON d.mobile = p.mobile AND p.rn = 1 WHERE d.rn > 1
)
UPDATE student_documents SET student_id = dm.primary_id FROM duplicate_mappings dm WHERE student_documents.student_id = dm.duplicate_id;

-- (Removed admissions update because students table has admission_id, not vice versa)

-- Delete the duplicates now that constraints are handled
WITH ranked_students AS (
  SELECT id, mobile,
         ROW_NUMBER() OVER (
           PARTITION BY mobile 
           ORDER BY 
             (CASE WHEN father_name IS NOT NULL AND father_name != '' THEN 1 ELSE 0 END +
              CASE WHEN dob IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN gender IS NOT NULL AND gender != '' THEN 1 ELSE 0 END +
              CASE WHEN full_name_bn IS NOT NULL AND full_name_bn != '' THEN 1 ELSE 0 END +
              CASE WHEN religion IS NOT NULL AND religion != '' THEN 1 ELSE 0 END +
              CASE WHEN nid IS NOT NULL AND nid != '' THEN 1 ELSE 0 END +
              CASE WHEN blood_group IS NOT NULL AND blood_group != '' THEN 1 ELSE 0 END) DESC,
             created_at ASC
         ) as rn
  FROM students
  WHERE mobile IS NOT NULL AND mobile != ''
)
DELETE FROM students 
WHERE id IN (
  SELECT id FROM ranked_students WHERE rn > 1
);

-- ── Step 6: Add unique constraint on mobile ─────────────────
-- First remove any remaining nulls/empties that could cause issues
-- Then add the constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'students_mobile_unique'
  ) THEN
    -- Only add if no violations exist
    ALTER TABLE students 
      ADD CONSTRAINT students_mobile_unique UNIQUE (mobile);
  END IF;
EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE 'Unique constraint could not be added - duplicates still exist. Please clean up manually.';
END $$;

-- ── Step 7: Grant access for anon/authenticated ─────────────
-- Ensure the payments table is accessible
GRANT SELECT ON payments TO authenticated;
GRANT ALL ON payments TO service_role;
