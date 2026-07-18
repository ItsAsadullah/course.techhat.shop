-- =====================================================
-- TechHat IT Institute - Training Operations Production Upgrade
-- Idempotent & additive. Safe to re-run.
-- =====================================================

-- 1. ADD MISSING ARCHIVE COLUMNS
ALTER TABLE training_labs ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE training_shifts ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE course_batches ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Ensure missing unique indexes for code 
CREATE UNIQUE INDEX IF NOT EXISTS idx_training_labs_code ON training_labs(code);
CREATE UNIQUE INDEX IF NOT EXISTS idx_training_shifts_code ON training_shifts(code) WHERE code IS NOT NULL AND code != '';

-- =====================================================
-- 2. LAB CAPACITY FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION get_training_lab_capacity(p_lab_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_lab RECORD;
    v_computer_capacity INT;
    v_effective_capacity INT;
BEGIN
    SELECT * INTO v_lab FROM training_labs WHERE id = p_lab_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'LAB_NOT_FOUND');
    END IF;

    -- calculate computer capacity
    v_computer_capacity := v_lab.usable_computers * v_lab.students_per_computer;
    
    -- effective capacity respects manual limit
    IF v_lab.manual_capacity_limit IS NOT NULL THEN
        v_effective_capacity := LEAST(v_computer_capacity, v_lab.manual_capacity_limit);
    ELSE
        v_effective_capacity := v_computer_capacity;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'lab_id', v_lab.id,
        'computer_capacity', v_computer_capacity,
        'manual_capacity_limit', v_lab.manual_capacity_limit,
        'effective_capacity', v_effective_capacity
    );
END;
$$;

-- =====================================================
-- 3. SHIFT CAPACITY FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION get_training_shift_capacity(p_shift_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_shift RECORD;
    v_lab_capacity_res JSONB;
    v_effective_lab_capacity INT;
    v_effective_shift_capacity INT;
BEGIN
    SELECT * INTO v_shift FROM training_shifts WHERE id = p_shift_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'SHIFT_NOT_FOUND');
    END IF;

    v_lab_capacity_res := get_training_lab_capacity(v_shift.lab_id);
    IF NOT (v_lab_capacity_res->>'success')::BOOLEAN THEN
        RETURN v_lab_capacity_res;
    END IF;
    
    v_effective_lab_capacity := (v_lab_capacity_res->>'effective_capacity')::INT;

    -- effective shift capacity respects override
    IF v_shift.capacity_override IS NOT NULL THEN
        IF v_shift.capacity_override > v_effective_lab_capacity THEN
             RETURN jsonb_build_object('success', false, 'error', 'SHIFT_CAPACITY_EXCEEDS_LAB');
        END IF;
        v_effective_shift_capacity := v_shift.capacity_override;
    ELSE
        v_effective_shift_capacity := v_effective_lab_capacity;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'shift_id', v_shift.id,
        'lab_id', v_shift.lab_id,
        'effective_lab_capacity', v_effective_lab_capacity,
        'capacity_override', v_shift.capacity_override,
        'effective_shift_capacity', v_effective_shift_capacity
    );
END;
$$;

-- =====================================================
-- 4. BATCH CAPACITY FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION get_training_batch_capacity(p_batch_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_batch RECORD;
    v_shift_capacity_res JSONB;
    v_effective_shift_capacity INT;
    v_effective_batch_capacity INT;
    v_occupied INT;
    v_available INT;
    v_utilization NUMERIC;
BEGIN
    SELECT * INTO v_batch FROM course_batches WHERE id = p_batch_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'BATCH_NOT_FOUND');
    END IF;

    IF v_batch.shift_id IS NOT NULL THEN
        v_shift_capacity_res := get_training_shift_capacity(v_batch.shift_id);
        IF (v_shift_capacity_res->>'success')::BOOLEAN THEN
            v_effective_shift_capacity := (v_shift_capacity_res->>'effective_shift_capacity')::INT;
        ELSE
            v_effective_shift_capacity := NULL;
        END IF;
    ELSE
        -- Legacy batch with no shift
        v_effective_shift_capacity := NULL;
    END IF;

    -- Effective batch capacity respects batch seat limit
    IF v_batch.seat_limit IS NOT NULL AND v_effective_shift_capacity IS NOT NULL THEN
        v_effective_batch_capacity := LEAST(v_batch.seat_limit, v_effective_shift_capacity);
    ELSIF v_batch.seat_limit IS NOT NULL THEN
        v_effective_batch_capacity := v_batch.seat_limit;
    ELSIF v_effective_shift_capacity IS NOT NULL THEN
        v_effective_batch_capacity := v_effective_shift_capacity;
    ELSE
        RETURN jsonb_build_object('success', false, 'error', 'BATCH_CAPACITY_NOT_CONFIGURED');
    END IF;

    -- Calculate occupied (seat-reserving statuses)
    SELECT COUNT(*) INTO v_occupied
    FROM course_enrollments
    WHERE batch_id = p_batch_id
      AND status IN ('pending', 'active', 'suspended');

    v_available := GREATEST(v_effective_batch_capacity - v_occupied, 0);

    IF v_effective_batch_capacity > 0 THEN
        v_utilization := ROUND((v_occupied::NUMERIC * 100.0) / v_effective_batch_capacity::NUMERIC, 2);
    ELSE
        v_utilization := 0;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'batch_id', v_batch.id,
        'effective_shift_capacity', v_effective_shift_capacity,
        'seat_limit', v_batch.seat_limit,
        'effective_batch_capacity', v_effective_batch_capacity,
        'occupied', v_occupied,
        'available', v_available,
        'utilization_percent', v_utilization,
        'is_full', v_available = 0
    );
END;
$$;


-- =====================================================
-- 5. ARCHIVE FUNCTIONS (SAFE DELETES)
-- =====================================================
CREATE OR REPLACE FUNCTION archive_training_lab(p_lab_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_lab_status VARCHAR;
    v_active_shifts INT;
    v_active_batches INT;
    v_active_enrollments INT;
BEGIN
    -- Verify Lab Exists
    SELECT status INTO v_lab_status FROM training_labs WHERE id = p_lab_id;
    IF v_lab_status IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'LAB_NOT_FOUND', 'message', 'The specified training lab does not exist');
    END IF;

    IF v_lab_status = 'archived' THEN
        RETURN jsonb_build_object('success', false, 'error', 'ALREADY_ARCHIVED', 'message', 'Lab is already archived');
    END IF;

    -- Check for active shifts
    SELECT COUNT(*) INTO v_active_shifts FROM training_shifts WHERE lab_id = p_lab_id AND status = 'active';
    IF v_active_shifts > 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'LAB_HAS_ACTIVE_SHIFTS', 'message', 'এই ল্যাবে সক্রিয় ট্রেনিং শিফট রয়েছে। আগে শিফটগুলো নিষ্ক্রিয় বা অন্য ল্যাবে স্থানান্তর করুন।');
    END IF;

    -- Check for active batches using this lab
    SELECT COUNT(*) INTO v_active_batches 
    FROM course_batches cb
    JOIN training_shifts ts ON cb.shift_id = ts.id
    WHERE ts.lab_id = p_lab_id AND cb.status NOT IN ('archived', 'completed', 'cancelled');
    
    IF v_active_batches > 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'LAB_HAS_ACTIVE_BATCHES', 'message', 'এই ল্যাবের সাথে সংযুক্ত সক্রিয় ব্যাচ রয়েছে। আগে ব্যাচগুলো আর্কাইভ বা স্থানান্তর করুন।');
    END IF;

    -- Check for active enrollments
    SELECT COUNT(*) INTO v_active_enrollments
    FROM course_enrollments ce
    JOIN training_shifts ts ON ce.shift_id = ts.id
    WHERE ts.lab_id = p_lab_id AND ce.status IN ('pending', 'active', 'suspended');

    IF v_active_enrollments > 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'LAB_HAS_ACTIVE_ENROLLMENTS', 'message', 'এই ল্যাবের সাথে সংযুক্ত সক্রিয় এনরোলমেন্ট রয়েছে।');
    END IF;

    -- Archive
    UPDATE training_labs SET status = 'archived', archived_at = NOW() WHERE id = p_lab_id;

    RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', 'DATABASE_ERROR');
END;
$$;

CREATE OR REPLACE FUNCTION archive_training_shift(p_shift_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_shift_status VARCHAR;
    v_active_batches INT;
    v_active_enrollments INT;
BEGIN
    -- Verify Shift Exists
    SELECT status INTO v_shift_status FROM training_shifts WHERE id = p_shift_id;
    IF v_shift_status IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'SHIFT_NOT_FOUND', 'message', 'The specified training shift does not exist');
    END IF;

    IF v_shift_status = 'archived' THEN
        RETURN jsonb_build_object('success', false, 'error', 'ALREADY_ARCHIVED', 'message', 'Shift is already archived');
    END IF;

    -- Check for active batches
    SELECT COUNT(*) INTO v_active_batches 
    FROM course_batches 
    WHERE shift_id = p_shift_id AND status NOT IN ('archived', 'completed', 'cancelled');
    
    IF v_active_batches > 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'SHIFT_HAS_ACTIVE_BATCHES', 'message', 'এই শিফটের সাথে সংযুক্ত সক্রিয় ব্যাচ রয়েছে। আগে ব্যাচগুলো আর্কাইভ বা স্থানান্তর করুন।');
    END IF;

    -- Check for seat-reserving enrollments directly on shift
    SELECT COUNT(*) INTO v_active_enrollments
    FROM course_enrollments
    WHERE shift_id = p_shift_id AND status IN ('pending', 'active', 'suspended');

    IF v_active_enrollments > 0 THEN
         RETURN jsonb_build_object('success', false, 'error', 'SHIFT_HAS_ACTIVE_ENROLLMENTS', 'message', 'এই শিফটের সাথে সংযুক্ত সক্রিয় এনরোলমেন্ট রয়েছে।');
    END IF;

    -- Archive
    UPDATE training_shifts SET status = 'archived', archived_at = NOW() WHERE id = p_shift_id;

    RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', 'DATABASE_ERROR');
END;
$$;
