-- Migration: Fix get_training_shift_capacity silent clamping
-- This replaces the existing RPC to return an error if capacity_override > effective_lab_capacity

CREATE OR REPLACE FUNCTION public.get_training_shift_capacity(p_shift_id UUID)
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
    SELECT * INTO v_shift FROM public.training_shifts WHERE id = p_shift_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'SHIFT_NOT_FOUND');
    END IF;

    v_lab_capacity_res := public.get_training_lab_capacity(v_shift.lab_id);
    
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
