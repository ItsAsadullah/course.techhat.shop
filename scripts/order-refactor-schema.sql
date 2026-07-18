-- =========================================================================
-- ORDER AND PAYMENT REFACTOR MIGRATION
-- =========================================================================

-- 1. Create the `orders` table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    student_id UUID REFERENCES public.students(id),
    course_id UUID REFERENCES public.courses(id) NOT NULL,
    batch_id UUID REFERENCES public.course_batches(id),
    admission_id UUID REFERENCES public.admissions(id),
    
    subtotal_minor INTEGER NOT NULL DEFAULT 0,
    discount_minor INTEGER NOT NULL DEFAULT 0,
    total_minor INTEGER NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'BDT',
    
    order_status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT', -- DRAFT, PENDING_PAYMENT, PAID, EXPIRED, CANCELLED, REFUNDED
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
    DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders
    FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));


-- 2. Modify `payment_sessions`
-- Add order_id (nullable initially for migration, then should be used going forward)
ALTER TABLE public.payment_sessions ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders(id);
-- Add index
CREATE INDEX IF NOT EXISTS idx_payment_sessions_order_id ON public.payment_sessions(order_id);


-- 3. Modify `course_enrollments`
-- Add student_id
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES public.students(id);
-- Add unique constraint to prevent duplicate enrollments
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'course_enrollments_user_course_key'
    ) THEN
        ALTER TABLE public.course_enrollments ADD CONSTRAINT course_enrollments_user_course_key UNIQUE (user_id, course_id);
    END IF;
END $$;


-- 4. Create `finalize_course_payment` RPC
CREATE OR REPLACE FUNCTION public.finalize_course_payment(
    p_order_id UUID,
    p_payment_event_id UUID DEFAULT NULL,
    p_manual_review_id UUID DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_payment_session RECORD;
    v_enrollment_id UUID;
    v_result JSONB;
BEGIN
    -- Lock order row
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
    
    IF v_order IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'ORDER_NOT_FOUND');
    END IF;

    IF v_order.order_status = 'PAID' THEN
        RETURN jsonb_build_object('success', true, 'status', 'ALREADY_FINALIZED');
    END IF;

    -- Lock payment session
    SELECT * INTO v_payment_session FROM public.payment_sessions WHERE order_id = p_order_id FOR UPDATE;

    -- Mark Order as PAID
    UPDATE public.orders 
    SET order_status = 'PAID', paid_at = NOW() 
    WHERE id = p_order_id;

    -- Update Payment Session
    IF v_payment_session IS NOT NULL THEN
        UPDATE public.payment_sessions 
        SET status = 'PAID', updated_at = NOW() 
        WHERE id = v_payment_session.id;
    END IF;

    -- Update Admission if exists
    IF v_order.admission_id IS NOT NULL THEN
        UPDATE public.admissions
        SET status = 'approved'
        WHERE id = v_order.admission_id;
    END IF;

    -- Create or Activate Course Enrollment
    INSERT INTO public.course_enrollments (user_id, student_id, course_id, batch_id, status, enrolled_at)
    VALUES (v_order.user_id, v_order.student_id, v_order.course_id, v_order.batch_id, 'active', NOW())
    ON CONFLICT (user_id, course_id) 
    DO UPDATE SET status = 'active', updated_at = NOW()
    RETURNING id INTO v_enrollment_id;

    -- Claim payment event if auto
    IF p_payment_event_id IS NOT NULL THEN
        UPDATE public.payment_events_inbox
        SET status = 'PROCESSED'
        WHERE id = p_payment_event_id;
    END IF;

    -- Resolve manual review if manual
    IF p_manual_review_id IS NOT NULL THEN
        UPDATE public.manual_payment_reviews
        SET status = 'APPROVED', reviewed_at = NOW()
        WHERE id = p_manual_review_id;
    END IF;

    RETURN jsonb_build_object('success', true, 'enrollment_id', v_enrollment_id);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
