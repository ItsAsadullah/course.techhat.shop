-- =====================================================
-- TechHat Computer Training Center
-- Student Management & Accounting System
-- Supabase PostgreSQL Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. COURSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  duration TEXT NOT NULL, -- e.g., "3 months", "6 months"
  fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. STUDENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_course_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash', 'Mobile Banking')),
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_students_course_id ON students(course_id);
CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);

-- =====================================================
-- HELPER FUNCTION: Calculate total paid & current due
-- =====================================================
CREATE OR REPLACE FUNCTION get_student_due(student_uuid UUID)
RETURNS TABLE (
  total_fee NUMERIC,
  total_paid NUMERIC,
  current_due NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.total_course_fee AS total_fee,
    COALESCE(SUM(p.amount), 0) AS total_paid,
    s.total_course_fee - COALESCE(SUM(p.amount), 0) AS current_due
  FROM students s
  LEFT JOIN payments p ON p.student_id = s.id
  WHERE s.id = student_uuid
  GROUP BY s.id, s.total_course_fee;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow full access to authenticated users
-- (For admin-only access, restrict to a specific role or use Supabase Auth)
CREATE POLICY "Allow full access to authenticated users" ON courses
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow full access to authenticated users" ON students
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow full access to authenticated users" ON payments
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- AUTO-UPDATE updated_at TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Sample Courses
INSERT INTO courses (name, duration, fee) VALUES
  ('Basic Computing', '3 months', 3000),
  ('Graphic Design', '4 months', 5000),
  ('Web Development', '6 months', 12000),
  ('Microsoft Office', '2 months', 2500),
  ('Digital Marketing', '3 months', 4500);

-- Sample Students
INSERT INTO students (name, phone, address, course_id, admission_date, total_course_fee)
SELECT
  'Rahim Ahmed',
  '01711111111',
  'Dhaka, Bangladesh',
  id,
  '2025-06-15',
  fee
FROM courses WHERE name = 'Web Development';

INSERT INTO students (name, phone, address, course_id, admission_date, total_course_fee)
SELECT
  'Karim Hossain',
  '01822222222',
  'Chittagong, Bangladesh',
  id,
  '2025-06-20',
  fee
FROM courses WHERE name = 'Graphic Design';

-- Sample Payments
INSERT INTO payments (student_id, payment_date, amount, payment_method, remarks)
SELECT
  id,
  '2025-06-15',
  5000,
  'Cash',
  'Admission fee'
FROM students WHERE name = 'Rahim Ahmed';

INSERT INTO payments (student_id, payment_date, amount, payment_method, remarks)
SELECT
  id,
  '2025-06-20',
  2000,
  'Mobile Banking',
  'First installment'
FROM students WHERE name = 'Karim Hossain';
