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
