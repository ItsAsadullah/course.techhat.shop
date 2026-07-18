-- =====================================================
-- TechHat IT Institute - Offline Training ERP Schema Upgrade
-- Idempotent & additive. Safe to re-run.
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. COURSE PRICING EXTENSION
-- =====================================================
ALTER TABLE course_pricing ADD COLUMN IF NOT EXISTS board_registration_fee NUMERIC(12,2) DEFAULT 0;
ALTER TABLE course_pricing ADD COLUMN IF NOT EXISTS supports_board_certificate BOOLEAN DEFAULT FALSE;
ALTER TABLE course_pricing ADD COLUMN IF NOT EXISTS board_registration_required BOOLEAN DEFAULT FALSE;

-- =====================================================
-- 2. TRAINING LABS DOMAIN
-- =====================================================
CREATE TABLE IF NOT EXISTS training_labs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  room VARCHAR(100),
  location TEXT,
  total_computers INT NOT NULL DEFAULT 0,
  usable_computers INT NOT NULL DEFAULT 0,
  students_per_computer INT NOT NULL DEFAULT 1,
  manual_capacity_limit INT,
  status VARCHAR(20) DEFAULT 'active', -- active | maintenance | inactive
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_computers_positive CHECK (total_computers >= 0 AND usable_computers >= 0),
  CONSTRAINT chk_usable_leq_total CHECK (usable_computers <= total_computers),
  CONSTRAINT chk_students_per_computer CHECK (students_per_computer >= 1)
);

CREATE INDEX IF NOT EXISTS idx_training_labs_status ON training_labs(status);
ALTER TABLE training_labs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active labs" ON training_labs FOR SELECT USING (status = 'active');
CREATE POLICY "Admin full access labs" ON training_labs FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 3. TRAINING SHIFTS DOMAIN
-- =====================================================
CREATE TABLE IF NOT EXISTS training_shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id UUID NOT NULL REFERENCES training_labs(id) ON DELETE CASCADE,
  name_en VARCHAR(150) NOT NULL,
  name_bn VARCHAR(150),
  code VARCHAR(50),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  class_days TEXT, -- JSON array
  capacity_override INT,
  status VARCHAR(20) DEFAULT 'active', -- active | inactive | archived
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_training_shifts_lab ON training_shifts(lab_id);
CREATE INDEX IF NOT EXISTS idx_training_shifts_status ON training_shifts(status);
ALTER TABLE training_shifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active shifts" ON training_shifts FOR SELECT USING (status = 'active');
CREATE POLICY "Admin full access shifts" ON training_shifts FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 4. BATCH EXTENSION
-- =====================================================
ALTER TABLE course_batches ADD COLUMN IF NOT EXISTS shift_id UUID REFERENCES training_shifts(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_course_batches_shift ON course_batches(shift_id);
CREATE INDEX IF NOT EXISTS idx_course_batches_status ON course_batches(course_id, status);

-- =====================================================
-- 5. COURSE ENROLLMENTS EXTENSION
-- =====================================================
-- Certification and Financial Snapshot Fields
ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS certificate_type VARCHAR(30) DEFAULT 'none'; -- institute | board | none
ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS institute_certificate_fee NUMERIC(12,2) DEFAULT 0;
ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS board_registration_fee NUMERIC(12,2) DEFAULT 0;
ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS board_certificate_fee NUMERIC(12,2) DEFAULT 0;
ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS fee_override_amount NUMERIC(12,2);
ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS fee_override_reason TEXT;
ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS shift_id UUID REFERENCES training_shifts(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_course_enrollments_batch_status ON course_enrollments(batch_id, status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_shift_status ON course_enrollments(shift_id, status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student_status ON course_enrollments(student_id, status);

-- =====================================================
-- 6. ENROLLMENT SHIFT MIGRATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS enrollment_shift_migrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  from_shift_id UUID REFERENCES training_shifts(id) ON DELETE SET NULL,
  to_shift_id UUID NOT NULL REFERENCES training_shifts(id) ON DELETE CASCADE,
  from_batch_id UUID REFERENCES course_batches(id) ON DELETE SET NULL,
  to_batch_id UUID REFERENCES course_batches(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  migrated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shift_migrations_enrollment ON enrollment_shift_migrations(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_shift_migrations_student ON enrollment_shift_migrations(student_id);
CREATE INDEX IF NOT EXISTS idx_shift_migrations_to_shift ON enrollment_shift_migrations(to_shift_id);
ALTER TABLE enrollment_shift_migrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access shift migrations" ON enrollment_shift_migrations FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 7. ENROLLMENT FINANCIAL CHANGES
-- =====================================================
CREATE TABLE IF NOT EXISTS enrollment_financial_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  change_type VARCHAR(50) NOT NULL, -- fee_override | discount_change | certificate_change | pricing_correction
  previous_values JSONB NOT NULL,
  new_values JSONB NOT NULL,
  reason TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_financial_changes_enrollment ON enrollment_financial_changes(enrollment_id);
ALTER TABLE enrollment_financial_changes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access financial changes" ON enrollment_financial_changes FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 8. POSTGRESQL RPCs
-- =====================================================

-- RPC: safe_sync_course_batches
-- Implements ID-aware sync for course batches, avoiding destructive deletes.
CREATE OR REPLACE FUNCTION safe_sync_course_batches(
    p_course_id UUID,
    p_batches JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_batch_record JSONB;
    v_submitted_ids UUID[] := '{}';
    v_existing_id UUID;
    v_new_id UUID;
BEGIN
    -- 1. Insert or Update submitted batches
    FOR v_batch_record IN SELECT * FROM jsonb_array_elements(p_batches)
    LOOP
        IF (v_batch_record->>'id') IS NOT NULL AND (v_batch_record->>'id') != '' THEN
            -- Attempt update
            v_existing_id := (v_batch_record->>'id')::UUID;
            UPDATE course_batches
            SET
                name_en = v_batch_record->>'name_en',
                name_bn = v_batch_record->>'name_bn',
                session = v_batch_record->>'session',
                start_date = NULLIF(v_batch_record->>'start_date', '')::DATE,
                end_date = NULLIF(v_batch_record->>'end_date', '')::DATE,
                admission_deadline = NULLIF(v_batch_record->>'admission_deadline', '')::DATE,
                orientation_date = NULLIF(v_batch_record->>'orientation_date', '')::DATE,
                class_days = v_batch_record->>'class_days',
                class_time_start = NULLIF(v_batch_record->>'class_time_start', '')::TIME,
                class_time_end = NULLIF(v_batch_record->>'class_time_end', '')::TIME,
                room = v_batch_record->>'room',
                seat_limit = NULLIF(v_batch_record->>'seat_limit', '')::INT,
                waitlist_enabled = (v_batch_record->>'waitlist_enabled')::BOOLEAN,
                access_type = v_batch_record->>'access_type',
                access_duration_days = NULLIF(v_batch_record->>'access_duration_days', '')::INT,
                release_date = NULLIF(v_batch_record->>'release_date', '')::DATE,
                drip_enabled = (v_batch_record->>'drip_enabled')::BOOLEAN,
                status = v_batch_record->>'status',
                sort_order = (v_batch_record->>'sort_order')::INT,
                shift_id = NULLIF(v_batch_record->>'shift_id', '')::UUID
            WHERE id = v_existing_id AND course_id = p_course_id;
            
            v_submitted_ids := array_append(v_submitted_ids, v_existing_id);
        ELSE
            -- Insert new
            INSERT INTO course_batches (
                course_id, name_en, name_bn, session, start_date, end_date, 
                admission_deadline, orientation_date, class_days, class_time_start, class_time_end, 
                room, seat_limit, waitlist_enabled, access_type, access_duration_days, 
                release_date, drip_enabled, status, sort_order, shift_id
            ) VALUES (
                p_course_id,
                v_batch_record->>'name_en',
                v_batch_record->>'name_bn',
                v_batch_record->>'session',
                NULLIF(v_batch_record->>'start_date', '')::DATE,
                NULLIF(v_batch_record->>'end_date', '')::DATE,
                NULLIF(v_batch_record->>'admission_deadline', '')::DATE,
                NULLIF(v_batch_record->>'orientation_date', '')::DATE,
                v_batch_record->>'class_days',
                NULLIF(v_batch_record->>'class_time_start', '')::TIME,
                NULLIF(v_batch_record->>'class_time_end', '')::TIME,
                v_batch_record->>'room',
                NULLIF(v_batch_record->>'seat_limit', '')::INT,
                COALESCE((v_batch_record->>'waitlist_enabled')::BOOLEAN, FALSE),
                v_batch_record->>'access_type',
                NULLIF(v_batch_record->>'access_duration_days', '')::INT,
                NULLIF(v_batch_record->>'release_date', '')::DATE,
                COALESCE((v_batch_record->>'drip_enabled')::BOOLEAN, FALSE),
                v_batch_record->>'status',
                (v_batch_record->>'sort_order')::INT,
                NULLIF(v_batch_record->>'shift_id', '')::UUID
            ) RETURNING id INTO v_new_id;
            
            v_submitted_ids := array_append(v_submitted_ids, v_new_id);
        END IF;
    END LOOP;

    -- 2. Handle missing existing batches
    -- For any batch belonging to this course that was NOT in the submitted list:
    -- If it has enrollments, mark as 'cancelled' (if it was active/upcoming) or 'archived'. Do not delete.
    -- If it has NO enrollments, safe to delete.
    
    DELETE FROM course_batches 
    WHERE course_id = p_course_id 
      AND id != ALL(v_submitted_ids)
      AND NOT EXISTS (
          SELECT 1 FROM course_enrollments WHERE batch_id = course_batches.id
      );
      
    UPDATE course_batches
    SET status = 'cancelled'
    WHERE course_id = p_course_id 
      AND id != ALL(v_submitted_ids)
      AND EXISTS (
          SELECT 1 FROM course_enrollments WHERE batch_id = course_batches.id
      );

    RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- RPC: migrate_enrollment_shift
CREATE OR REPLACE FUNCTION migrate_enrollment_shift(
    p_enrollment_id UUID,
    p_target_shift_id UUID,
    p_target_batch_id UUID,
    p_reason TEXT,
    p_effective_date DATE,
    p_migrated_by UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_enrollment RECORD;
    v_student_id UUID;
    v_source_shift_id UUID;
    v_source_batch_id UUID;
    v_target_capacity INT;
    v_target_occupied INT;
BEGIN
    -- Validate enrollment
    SELECT * INTO v_enrollment FROM course_enrollments WHERE id = p_enrollment_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Enrollment not found');
    END IF;

    v_student_id := v_enrollment.student_id;
    v_source_shift_id := v_enrollment.shift_id;
    v_source_batch_id := v_enrollment.batch_id;

    -- Validate target shift exists
    IF NOT EXISTS (SELECT 1 FROM training_shifts WHERE id = p_target_shift_id) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Target shift does not exist');
    END IF;

    -- Prevent migrating to the exact same assignment
    IF COALESCE(v_source_shift_id, '00000000-0000-0000-0000-000000000000'::UUID) = p_target_shift_id 
       AND COALESCE(v_source_batch_id, '00000000-0000-0000-0000-000000000000'::UUID) = COALESCE(p_target_batch_id, '00000000-0000-0000-0000-000000000000'::UUID) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Target shift and batch are the same as current');
    END IF;

    -- TODO: Add rigorous capacity validation (will depend on lab effective capacity calculation)
    -- For now, allow migration (capacity check logic to be refined)

    -- Insert audit log
    INSERT INTO enrollment_shift_migrations (
        enrollment_id, student_id, from_shift_id, to_shift_id, from_batch_id, to_batch_id, reason, effective_date, migrated_by
    ) VALUES (
        p_enrollment_id, v_student_id, v_source_shift_id, p_target_shift_id, v_source_batch_id, p_target_batch_id, p_reason, p_effective_date, p_migrated_by
    );

    -- Update enrollment
    UPDATE course_enrollments
    SET shift_id = p_target_shift_id,
        batch_id = p_target_batch_id
    WHERE id = p_enrollment_id;

    RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- REPLACE admin_direct_enroll to utilize new pricing snapshot fields and validate capacity
CREATE OR REPLACE FUNCTION admin_direct_enroll(
    p_student_id UUID,
    p_course_id UUID,
    p_batch_id UUID,
    p_shift_id UUID,
    p_status VARCHAR,
    p_source VARCHAR,
    p_enrolled_at TIMESTAMPTZ,
    p_start_date DATE,
    p_fee_override_enabled BOOLEAN,
    p_override_course_fee NUMERIC,
    p_fee_override_reason TEXT,
    p_certificate_type VARCHAR,
    p_discount_amount NUMERIC,
    p_discount_reason TEXT,
    p_initial_paid NUMERIC,
    p_payment_method VARCHAR,
    p_payment_reference TEXT,
    p_payment_remarks TEXT,
    p_admin_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_pricing RECORD;
    v_enrollment_id UUID;
    v_payment_id UUID;
    v_final_fee NUMERIC;
    v_base_course_fee NUMERIC;
    v_inst_fee NUMERIC := 0;
    v_board_reg_fee NUMERIC := 0;
    v_board_cert_fee NUMERIC := 0;

    v_total_paid NUMERIC;
    v_current_due NUMERIC;
    v_capacity_res JSONB;
    v_batch course_batches%ROWTYPE;
BEGIN
    -- 1. Lock capacity transactionally if batch is provided
    IF p_batch_id IS NOT NULL THEN
        SELECT * INTO v_batch FROM course_batches WHERE id = p_batch_id FOR UPDATE;
        IF NOT FOUND OR v_batch.course_id <> p_course_id THEN
            RETURN jsonb_build_object('success', false, 'code', 'INVALID_BATCH');
        END IF;
        IF v_batch.status IN ('cancelled', 'completed', 'archived') THEN
            RETURN jsonb_build_object('success', false, 'code', 'INVALID_BATCH');
        END IF;

        v_capacity_res := get_training_batch_capacity(p_batch_id);
        IF NOT (v_capacity_res->>'success')::BOOLEAN THEN
            RETURN jsonb_build_object('success', false, 'code', COALESCE(v_capacity_res->>'code', v_capacity_res->>'error', 'BATCH_CAPACITY_NOT_CONFIGURED'));
        END IF;
        IF (v_capacity_res->>'is_full')::BOOLEAN THEN
            RETURN jsonb_build_object('success', false, 'code', 'BATCH_FULL');
        END IF;
    END IF;
    -- 2. Load Course Pricing
    SELECT * INTO v_pricing FROM course_pricing WHERE course_id = p_course_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'code', 'COURSE_PRICING_NOT_FOUND');
    END IF;

    -- 3. Determine Base Course Fee
    IF p_fee_override_enabled THEN
        IF p_override_course_fee IS NULL OR p_override_course_fee < 0 THEN
            RETURN jsonb_build_object('success', false, 'code', 'INVALID_FEE_OVERRIDE');
        END IF;
        v_base_course_fee := p_override_course_fee;
    ELSE
        v_base_course_fee := v_pricing.course_fee;
    END IF;

    IF p_discount_amount < 0 THEN
        RETURN jsonb_build_object('success', false, 'code', 'INVALID_DISCOUNT');
    END IF;

    IF p_initial_paid < 0 THEN
        RETURN jsonb_build_object('success', false, 'code', 'INVALID_INITIAL_PAYMENT');
    END IF;

    -- 4. Calculate Certificate Fees
    IF p_certificate_type = 'institute' THEN
        v_inst_fee := COALESCE(v_pricing.institute_certificate_fee, 0);
    ELSIF p_certificate_type = 'board' THEN
        -- Validate if board certificate is supported
        IF NOT COALESCE(v_pricing.supports_board_certificate, FALSE) THEN
            RETURN jsonb_build_object('success', false, 'code', 'BOARD_CERTIFICATE_NOT_SUPPORTED');
        END IF;
        v_board_reg_fee := COALESCE(v_pricing.board_registration_fee, 0);
        v_board_cert_fee := COALESCE(v_pricing.board_certificate_fee, 0);
    END IF;

    -- 5. Calculate Final Fee
    v_final_fee := v_base_course_fee + v_inst_fee + v_board_reg_fee + v_board_cert_fee - COALESCE(p_discount_amount, 0);
    
    IF v_final_fee < 0 THEN
        RETURN jsonb_build_object('success', false, 'code', 'INVALID_FEE_OVERRIDE');
    END IF;

    IF p_initial_paid > v_final_fee THEN
        RETURN jsonb_build_object('success', false, 'code', 'PAYMENT_EXCEEDS_DUE');
    END IF;

    IF p_initial_paid > 0 AND (p_payment_method IS NULL OR BTRIM(p_payment_method) = '') THEN
        RETURN jsonb_build_object('success', false, 'code', 'INVALID_PAYMENT_METHOD');
    END IF;

    -- 6. Insert Enrollment Snapshot
    INSERT INTO course_enrollments (
        student_id, course_id, batch_id, shift_id, status, source, enrolled_at, start_date,
        course_fee, discount_amount, final_fee,
        certificate_type, institute_certificate_fee, board_registration_fee, board_certificate_fee,
        fee_override_amount, fee_override_reason
    ) VALUES (
        p_student_id, p_course_id, p_batch_id, p_shift_id, p_status, p_source, p_enrolled_at, p_start_date,
        v_base_course_fee, COALESCE(p_discount_amount, 0), v_final_fee,
        p_certificate_type, v_inst_fee, v_board_reg_fee, v_board_cert_fee,
        CASE WHEN p_fee_override_enabled THEN p_override_course_fee ELSE NULL END,
        CASE WHEN p_fee_override_enabled THEN p_fee_override_reason ELSE NULL END
    ) RETURNING id INTO v_enrollment_id;

    -- 7. Audit log if fee override occurred
    IF p_fee_override_enabled THEN
        INSERT INTO enrollment_financial_changes (
            enrollment_id, change_type, previous_values, new_values, reason, changed_by
        ) VALUES (
            v_enrollment_id, 'fee_override', 
            jsonb_build_object('course_fee', v_pricing.course_fee),
            jsonb_build_object('course_fee', p_override_course_fee),
            COALESCE(p_fee_override_reason, 'Manual override during enrollment'),
            p_admin_id
        );
    END IF;

    -- 8. Record Initial Payment
    IF p_initial_paid > 0 THEN
        INSERT INTO payments (
            student_id, enrollment_id, payment_date, amount, payment_method, 
            transaction_id, remarks, received_by
        ) VALUES (
            p_student_id, v_enrollment_id, p_enrolled_at, p_initial_paid, p_payment_method,
            p_payment_reference, p_payment_remarks, p_admin_id
        ) RETURNING id INTO v_payment_id;
    END IF;

    SELECT COALESCE(SUM(amount), 0) INTO v_total_paid FROM payments WHERE enrollment_id = v_enrollment_id;
    v_current_due := GREATEST(v_final_fee - v_total_paid, 0);

    RETURN jsonb_build_object(
        'success', true, 
        'enrollment_id', v_enrollment_id,
        'payment_id', v_payment_id,
        'final_fee', v_final_fee,
        'total_paid', v_total_paid,
        'current_due', v_current_due
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'code', 'DATABASE_ERROR');
END;
$$;
