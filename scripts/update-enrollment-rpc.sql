-- =====================================================
-- TechHat IT Institute — Update Enrollment Schema for Multi-Shift
-- Add shift checking to admin_direct_enroll
-- Idempotent (CREATE OR REPLACE). Safe to re-run.
-- =====================================================

CREATE OR REPLACE FUNCTION admin_direct_enroll(
    p_student_id UUID,
    p_course_id UUID,
    p_batch_id UUID,
    p_shift_id UUID, -- MUST be an active shift on the batch (if batch provided)
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
    v_shift_capacity_res JSONB;
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

        -- For multi-shift batches, a specific shift_id MUST be chosen if the batch has shifts
        -- Check if the batch has shifts
        IF EXISTS (SELECT 1 FROM course_batch_shifts WHERE batch_id = p_batch_id) THEN
            IF p_shift_id IS NULL THEN
                RETURN jsonb_build_object('success', false, 'code', 'SHIFT_REQUIRED', 'message', 'Please select a specific shift for this batch.');
            END IF;

            -- Validate the chosen shift actually belongs to this batch
            IF NOT EXISTS (SELECT 1 FROM course_batch_shifts WHERE batch_id = p_batch_id AND shift_id = p_shift_id) THEN
                RETURN jsonb_build_object('success', false, 'code', 'INVALID_SHIFT_FOR_BATCH', 'message', 'The selected shift is not assigned to this batch.');
            END IF;

            -- Validate specific shift capacity
            v_shift_capacity_res := get_training_shift_capacity(p_shift_id);
            IF NOT (v_shift_capacity_res->>'success')::BOOLEAN THEN
                RETURN jsonb_build_object('success', false, 'code', 'SHIFT_CAPACITY_CHECK_FAILED', 'message', 'Failed to verify shift capacity.');
            END IF;

            IF (v_shift_capacity_res->>'is_full')::BOOLEAN THEN
                 RETURN jsonb_build_object('success', false, 'code', 'SHIFT_FULL', 'message', 'The selected shift is fully booked.');
            END IF;
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
