-- =====================================================
-- TechHat IT Institute — Batch ↔ Shift Junction Table
-- Idempotent & additive. Safe to re-run.
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. JUNCTION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS course_batch_shifts (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id   UUID        NOT NULL REFERENCES course_batches(id) ON DELETE CASCADE,
  shift_id   UUID        NOT NULL REFERENCES training_shifts(id) ON DELETE RESTRICT,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_course_batch_shift UNIQUE (batch_id, shift_id)
);

CREATE INDEX IF NOT EXISTS idx_cbs_batch_id
  ON course_batch_shifts(batch_id);

CREATE INDEX IF NOT EXISTS idx_cbs_shift_id
  ON course_batch_shifts(shift_id);

-- =====================================================
-- 2. UPDATED_AT TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION trg_course_batch_shifts_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_course_batch_shifts_updated_at
  ON course_batch_shifts;

CREATE TRIGGER set_course_batch_shifts_updated_at
  BEFORE UPDATE ON course_batch_shifts
  FOR EACH ROW
  EXECUTE FUNCTION trg_course_batch_shifts_updated_at();

-- =====================================================
-- 3. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE course_batch_shifts ENABLE ROW LEVEL SECURITY;

-- Read access: any authenticated user (consistent with
-- existing course_batches and training_shifts policies).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'course_batch_shifts'
      AND policyname = 'read_batch_shifts'
  ) THEN
    CREATE POLICY "read_batch_shifts"
      ON course_batch_shifts
      FOR SELECT
      USING (true);
  END IF;
END $$;

-- Mutation access: admin only (via auth.uid is not null,
-- consistent with training_shifts admin policy).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'course_batch_shifts'
      AND policyname = 'admin_all_batch_shifts'
  ) THEN
    CREATE POLICY "admin_all_batch_shifts"
      ON course_batch_shifts
      FOR ALL
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

