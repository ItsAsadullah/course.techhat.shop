-- =====================================================
-- TechHat IT Institute — Updated Batch Capacity RPCs
-- Reads from course_batch_shifts junction table.
-- Idempotent (CREATE OR REPLACE). Safe to re-run.
-- =====================================================

-- =====================================================
-- 1. SINGLE BATCH CAPACITY (multi-shift aware)
-- =====================================================

CREATE OR REPLACE FUNCTION get_training_batch_capacity(p_batch_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_batch RECORD;
    v_shift_row RECORD;
    v_shift_capacity_res JSONB;
    v_combined_shift_capacity INT := 0;
    v_selected_shift_count INT := 0;
    v_effective_batch_capacity INT;
    v_occupied INT;
    v_available INT;
    v_utilization NUMERIC;
BEGIN
    SELECT * INTO v_batch FROM course_batches WHERE id = p_batch_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'BATCH_NOT_FOUND');
    END IF;

    -- Iterate over all assigned shifts from the junction table
    FOR v_shift_row IN
        SELECT cbs.shift_id
        FROM course_batch_shifts cbs
        WHERE cbs.batch_id = p_batch_id
        ORDER BY cbs.sort_order, cbs.created_at
    LOOP
        v_shift_capacity_res := get_training_shift_capacity(v_shift_row.shift_id);

        IF NOT (v_shift_capacity_res->>'success')::BOOLEAN THEN
            -- Fail closed: if any assigned shift has invalid capacity,
            -- the batch capacity cannot be trusted.
            RETURN jsonb_build_object(
                'success', false,
                'error', 'SHIFT_CAPACITY_INVALID',
                'details', jsonb_build_object(
                    'shift_id', v_shift_row.shift_id,
                    'shift_error', v_shift_capacity_res->>'error'
                )
            );
        END IF;

        v_combined_shift_capacity := v_combined_shift_capacity
            + (v_shift_capacity_res->>'effective_shift_capacity')::INT;

        v_selected_shift_count := v_selected_shift_count + 1;
    END LOOP;



    -- Determine effective batch capacity
    IF v_batch.seat_limit IS NOT NULL AND v_combined_shift_capacity > 0 THEN
        v_effective_batch_capacity := LEAST(v_batch.seat_limit, v_combined_shift_capacity);
    ELSIF v_batch.seat_limit IS NOT NULL THEN
        v_effective_batch_capacity := v_batch.seat_limit;
    ELSIF v_combined_shift_capacity > 0 THEN
        v_effective_batch_capacity := v_combined_shift_capacity;
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
        v_utilization := ROUND(
            (v_occupied::NUMERIC * 100.0) / v_effective_batch_capacity::NUMERIC,
            2
        );
    ELSE
        v_utilization := 0;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'batch_id', v_batch.id,
        'selected_shift_count', v_selected_shift_count,
        'effective_shift_capacity', v_combined_shift_capacity,
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
-- 2. BULK BATCH CAPACITY (multi-shift aware)
-- =====================================================

CREATE OR REPLACE FUNCTION get_training_batches_capacity()
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_batch RECORD;
    v_capacity_result JSONB;
BEGIN
    FOR v_batch IN
        SELECT id FROM course_batches
        WHERE status NOT IN ('archived')
        ORDER BY sort_order, created_at DESC
    LOOP
        v_capacity_result := get_training_batch_capacity(v_batch.id);
        RETURN NEXT v_capacity_result;
    END LOOP;
END;
$$;


-- =====================================================
-- 3. UPDATED ARCHIVE: archive_training_lab
--    Checks course_batch_shifts instead of
--    course_batches.shift_id for active batch detection.
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
    SELECT status INTO v_lab_status FROM training_labs WHERE id = p_lab_id;
    IF v_lab_status IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'LAB_NOT_FOUND',
            'message', 'The specified training lab does not exist');
    END IF;

    IF v_lab_status = 'archived' THEN
        RETURN jsonb_build_object('success', false, 'error', 'ALREADY_ARCHIVED',
            'message', 'Lab is already archived');
    END IF;

    -- Check for active shifts in this lab
    SELECT COUNT(*) INTO v_active_shifts
    FROM training_shifts
    WHERE lab_id = p_lab_id AND status = 'active';

    IF v_active_shifts > 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'LAB_HAS_ACTIVE_SHIFTS',
            'message', 'এই ল্যাবে সক্রিয় ট্রেনিং শিফট রয়েছে। আগে শিফটগুলো নিষ্ক্রিয় বা অন্য ল্যাবে স্থানান্তর করুন।');
    END IF;

    -- Check for active batches via junction table
    SELECT COUNT(DISTINCT cb.id) INTO v_active_batches
    FROM course_batch_shifts cbs
    JOIN training_shifts ts ON cbs.shift_id = ts.id
    JOIN course_batches cb ON cbs.batch_id = cb.id
    WHERE ts.lab_id = p_lab_id
      AND cb.status NOT IN ('archived', 'completed', 'cancelled');



    IF v_active_batches > 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'LAB_HAS_ACTIVE_BATCHES',
            'message', 'এই ল্যাবের সাথে সংযুক্ত সক্রিয় ব্যাচ রয়েছে। আগে ব্যাচগুলো আর্কাইভ বা স্থানান্তর করুন।');
    END IF;

    -- Check for active enrollments
    SELECT COUNT(*) INTO v_active_enrollments
    FROM course_enrollments ce
    JOIN training_shifts ts ON ce.shift_id = ts.id
    WHERE ts.lab_id = p_lab_id
      AND ce.status IN ('pending', 'active', 'suspended');

    IF v_active_enrollments > 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'LAB_HAS_ACTIVE_ENROLLMENTS',
            'message', 'এই ল্যাবের সাথে সংযুক্ত সক্রিয় এনরোলমেন্ট রয়েছে।');
    END IF;

    UPDATE training_labs SET status = 'archived', archived_at = NOW() WHERE id = p_lab_id;

    RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', 'DATABASE_ERROR');
END;
$$;


-- =====================================================
-- 4. UPDATED ARCHIVE: archive_training_shift
--    Checks course_batch_shifts instead of
--    course_batches.shift_id for active batch detection.
-- =====================================================

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
    SELECT status INTO v_shift_status FROM training_shifts WHERE id = p_shift_id;
    IF v_shift_status IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'SHIFT_NOT_FOUND',
            'message', 'The specified training shift does not exist');
    END IF;

    IF v_shift_status = 'archived' THEN
        RETURN jsonb_build_object('success', false, 'error', 'ALREADY_ARCHIVED',
            'message', 'Shift is already archived');
    END IF;

    -- Check for active batches via junction table
    SELECT COUNT(DISTINCT cb.id) INTO v_active_batches
    FROM course_batch_shifts cbs
    JOIN course_batches cb ON cbs.batch_id = cb.id
    WHERE cbs.shift_id = p_shift_id
      AND cb.status NOT IN ('archived', 'completed', 'cancelled');



    IF v_active_batches > 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'SHIFT_HAS_ACTIVE_BATCHES',
            'message', 'এই শিফটের সাথে সংযুক্ত সক্রিয় ব্যাচ রয়েছে। আগে ব্যাচগুলো আর্কাইভ বা স্থানান্তর করুন।');
    END IF;

    -- Check for seat-reserving enrollments directly on shift
    SELECT COUNT(*) INTO v_active_enrollments
    FROM course_enrollments
    WHERE shift_id = p_shift_id
      AND status IN ('pending', 'active', 'suspended');

    IF v_active_enrollments > 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'SHIFT_HAS_ACTIVE_ENROLLMENTS',
            'message', 'এই শিফটের সাথে সংযুক্ত সক্রিয় এনরোলমেন্ট রয়েছে।');
    END IF;

    UPDATE training_shifts SET status = 'archived', archived_at = NOW() WHERE id = p_shift_id;

    RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', 'DATABASE_ERROR');
END;
$$;
