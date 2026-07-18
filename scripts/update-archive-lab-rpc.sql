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
