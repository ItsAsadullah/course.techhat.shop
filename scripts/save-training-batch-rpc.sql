-- =====================================================
-- TechHat IT Institute — Atomic Batch Save with Shifts
-- Idempotent (CREATE OR REPLACE). Safe to re-run.
-- =====================================================

CREATE OR REPLACE FUNCTION save_training_batch_with_shifts(
    p_batch_id      UUID,        -- NULL for create
    p_payload       JSONB,       -- batch column values
    p_shift_ids     UUID[]       -- array of shift IDs to assign
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_batch_id      UUID;
    v_shift_id      UUID;
    v_sort_order    INT := 0;
BEGIN
    -- ─── 1. Upsert the course_batches row ───
    IF p_batch_id IS NOT NULL THEN
        -- UPDATE
        UPDATE course_batches SET
            course_id          = (p_payload->>'course_id')::UUID,
            name_en            = p_payload->>'name_en',
            name_bn            = NULLIF(p_payload->>'name_bn', ''),
            session            = NULLIF(p_payload->>'session', ''),
            start_date         = NULLIF(p_payload->>'start_date', '')::DATE,
            end_date           = NULLIF(p_payload->>'end_date', '')::DATE,
            admission_deadline = NULLIF(p_payload->>'admission_deadline', '')::DATE,
            orientation_date   = NULLIF(p_payload->>'orientation_date', '')::DATE,
            seat_limit         = NULLIF(p_payload->>'seat_limit', '')::INT,
            waitlist_enabled   = COALESCE((p_payload->>'waitlist_enabled')::BOOLEAN, FALSE),
            status             = p_payload->>'status',
            sort_order         = COALESCE((p_payload->>'sort_order')::INT, 0),
            updated_at         = NOW()
        WHERE id = p_batch_id;

        IF NOT FOUND THEN
            RETURN jsonb_build_object('success', false, 'code', 'BATCH_NOT_FOUND');
        END IF;

        v_batch_id := p_batch_id;
    ELSE
        -- INSERT
        INSERT INTO course_batches (
            course_id, name_en, name_bn, session,
            start_date, end_date, admission_deadline, orientation_date,
            seat_limit, waitlist_enabled, status, sort_order
        ) VALUES (
            (p_payload->>'course_id')::UUID,
            p_payload->>'name_en',
            NULLIF(p_payload->>'name_bn', ''),
            NULLIF(p_payload->>'session', ''),
            NULLIF(p_payload->>'start_date', '')::DATE,
            NULLIF(p_payload->>'end_date', '')::DATE,
            NULLIF(p_payload->>'admission_deadline', '')::DATE,
            NULLIF(p_payload->>'orientation_date', '')::DATE,
            NULLIF(p_payload->>'seat_limit', '')::INT,
            COALESCE((p_payload->>'waitlist_enabled')::BOOLEAN, FALSE),
            COALESCE(p_payload->>'status', 'draft'),
            COALESCE((p_payload->>'sort_order')::INT, 0)
        )
        RETURNING id INTO v_batch_id;
    END IF;

    -- ─── 2. Synchronize course_batch_shifts ───

    -- Remove assignments that are no longer selected
    DELETE FROM course_batch_shifts
    WHERE batch_id = v_batch_id
      AND shift_id != ALL(p_shift_ids);

    -- Upsert selected shifts (preserving existing rows)
    FOREACH v_shift_id IN ARRAY p_shift_ids
    LOOP
        INSERT INTO course_batch_shifts (batch_id, shift_id, sort_order)
        VALUES (v_batch_id, v_shift_id, v_sort_order)
        ON CONFLICT (batch_id, shift_id)
        DO UPDATE SET sort_order = v_sort_order, updated_at = NOW();

        v_sort_order := v_sort_order + 1;
    END LOOP;



    RETURN jsonb_build_object(
        'success', true,
        'batch_id', v_batch_id
    );

EXCEPTION WHEN unique_violation THEN
    RETURN jsonb_build_object('success', false, 'code', 'BATCH_ALREADY_EXISTS');
WHEN foreign_key_violation THEN
    RETURN jsonb_build_object('success', false, 'code', 'BATCH_REFERENCE_INVALID');
WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'code', 'DATABASE_ERROR');
END;
$$;
