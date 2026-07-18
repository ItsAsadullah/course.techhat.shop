-- ============================================================================
-- TechHat IT Institute: Admin direct course enrollment
-- Apply after course-schema-v2.sql, order-refactor-schema.sql and
-- unify-students-migration.sql.
--
-- This migration extends the existing enrollment/payment domain. It does not
-- create orders or payment sessions for administrator-managed enrollments.
-- ============================================================================

BEGIN;

-- 1. Extend the existing authoritative enrollment table.
ALTER TABLE public.course_enrollments
  ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS start_date DATE,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS course_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS final_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE public.course_enrollments
  ALTER COLUMN status SET DEFAULT 'pending',
  ALTER COLUMN progress SET DEFAULT 0,
  ALTER COLUMN enrolled_at SET DEFAULT NOW();

-- Backfill financial values for already-finalized public orders without
-- overwriting any enrollment that has already been financially configured.
UPDATE public.course_enrollments enrollment
SET
  course_fee = COALESCE(order_row.subtotal_minor, 0) / 100.0,
  discount_amount = COALESCE(order_row.discount_minor, 0) / 100.0,
  final_fee = COALESCE(order_row.total_minor, 0) / 100.0,
  source = COALESCE(enrollment.source, 'public_checkout'),
  updated_at = NOW()
FROM public.orders order_row
WHERE order_row.course_id = enrollment.course_id
  AND (
    (order_row.student_id IS NOT NULL AND order_row.student_id = enrollment.student_id)
    OR (order_row.student_id IS NULL AND order_row.user_id = enrollment.user_id)
  )
  AND order_row.order_status = 'PAID'
  AND enrollment.final_fee = 0
  AND enrollment.course_fee = 0;

-- 2. Make manual payments enrollment-aware while retaining legacy records.
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS reference TEXT,
  ADD COLUMN IF NOT EXISTS received_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- 3. Enforce sane values, keeping the checks idempotent.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_enrollments_amounts_nonnegative') THEN
    ALTER TABLE public.course_enrollments
      ADD CONSTRAINT course_enrollments_amounts_nonnegative
      CHECK (course_fee >= 0 AND discount_amount >= 0 AND final_fee >= 0 AND progress >= 0 AND progress <= 100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payments_amount_positive') THEN
    ALTER TABLE public.payments
      ADD CONSTRAINT payments_amount_positive CHECK (amount > 0);
  END IF;
END $$;

-- The historical unconditional user/course constraints prevent legitimate
-- re-enrolment after completion/cancellation and do not protect students with
-- no auth user. Remove only these redundant constraints before using the
-- student-aware partial unique index below.
ALTER TABLE public.course_enrollments
  DROP CONSTRAINT IF EXISTS course_enrollments_course_id_user_id_key,
  DROP CONSTRAINT IF EXISTS course_enrollments_user_course_key;

-- Fail safely rather than silently changing historical enrollment records.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.course_enrollments
    WHERE student_id IS NOT NULL AND status IN ('pending', 'active', 'suspended')
    GROUP BY student_id, course_id
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION
      'Cannot create enrollment duplicate guard: duplicate active enrollment records exist. Resolve them before rerunning this migration.';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS course_enrollments_active_student_course_unique
  ON public.course_enrollments (student_id, course_id)
  WHERE student_id IS NOT NULL AND status IN ('pending', 'active', 'suspended');

CREATE INDEX IF NOT EXISTS idx_course_enrollments_student_id ON public.course_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON public.course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_batch_id ON public.course_enrollments(batch_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_status ON public.course_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student_status ON public.course_enrollments(student_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_enrollment_id ON public.payments(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON public.payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON public.payments(payment_date);

-- 4. One transaction creates the direct enrollment and optional first payment.
-- Execution is restricted to service_role; the Next.js action authenticates and
-- authorizes the administrator before calling it.
DROP FUNCTION IF EXISTS public.admin_direct_enroll(
  UUID, UUID, UUID, DATE, DATE, TEXT, NUMERIC, NUMERIC, NUMERIC, TEXT, DATE, TEXT, TEXT, TEXT, UUID
);



-- Record subsequent course-fee payments with the same server-side due check.
CREATE OR REPLACE FUNCTION public.record_enrollment_payment(
  p_enrollment_id UUID,
  p_amount NUMERIC,
  p_payment_date DATE DEFAULT CURRENT_DATE,
  p_payment_method TEXT DEFAULT NULL,
  p_transaction_id TEXT DEFAULT NULL,
  p_reference TEXT DEFAULT NULL,
  p_remarks TEXT DEFAULT NULL,
  p_received_by UUID DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_enrollment public.course_enrollments%ROWTYPE;
  v_total_paid NUMERIC(12,2);
  v_payment_id UUID;
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 OR p_payment_method IS NULL OR BTRIM(p_payment_method) = '' THEN
    RETURN jsonb_build_object('success', false, 'code', 'INVALID_PAYMENT');
  END IF;

  SELECT * INTO v_enrollment FROM public.course_enrollments WHERE id = p_enrollment_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'code', 'ENROLLMENT_NOT_FOUND');
  END IF;
  IF v_enrollment.status IN ('cancelled', 'completed') THEN
    RETURN jsonb_build_object('success', false, 'code', 'ENROLLMENT_NOT_PAYABLE');
  END IF;

  SELECT COALESCE(SUM(amount), 0) INTO v_total_paid
  FROM public.payments WHERE enrollment_id = p_enrollment_id;
  IF ROUND(p_amount, 2) > GREATEST(v_enrollment.final_fee - v_total_paid, 0) THEN
    RETURN jsonb_build_object('success', false, 'code', 'PAYMENT_EXCEEDS_DUE');
  END IF;

  INSERT INTO public.payments (
    student_id, enrollment_id, amount, payment_date, payment_method,
    transaction_id, reference, remarks, received_by, created_at, updated_at
  ) VALUES (
    v_enrollment.student_id, p_enrollment_id, ROUND(p_amount, 2),
    COALESCE(p_payment_date, CURRENT_DATE), p_payment_method,
    NULLIF(BTRIM(p_transaction_id), ''), NULLIF(BTRIM(p_reference), ''),
    NULLIF(BTRIM(p_remarks), ''), p_received_by, NOW(), NOW()
  ) RETURNING id INTO v_payment_id;

  RETURN jsonb_build_object(
    'success', true,
    'payment_id', v_payment_id,
    'current_due', GREATEST(v_enrollment.final_fee - (v_total_paid + p_amount), 0)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.record_enrollment_payment(UUID, NUMERIC, DATE, TEXT, TEXT, TEXT, TEXT, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_enrollment_payment(UUID, NUMERIC, DATE, TEXT, TEXT, TEXT, TEXT, UUID) TO service_role;

-- 5. Preserve the public checkout architecture while adapting it to the new
-- enrollment uniqueness rule and ensuring its payment becomes enrollment-aware.
CREATE OR REPLACE FUNCTION public.finalize_course_payment(
  p_order_id UUID,
  p_payment_event_id UUID DEFAULT NULL,
  p_manual_review_id UUID DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_payment_session public.payment_sessions%ROWTYPE;
  v_enrollment_id UUID;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'ORDER_NOT_FOUND');
  END IF;
  IF v_order.order_status = 'PAID' THEN
    RETURN jsonb_build_object('success', true, 'status', 'ALREADY_FINALIZED');
  END IF;

  SELECT * INTO v_payment_session FROM public.payment_sessions WHERE order_id = p_order_id FOR UPDATE;
  UPDATE public.orders SET order_status = 'PAID', paid_at = NOW() WHERE id = p_order_id;
  IF FOUND AND v_payment_session.id IS NOT NULL THEN
    UPDATE public.payment_sessions SET status = 'PAID', updated_at = NOW() WHERE id = v_payment_session.id;
  END IF;
  IF v_order.admission_id IS NOT NULL THEN
    UPDATE public.admissions SET status = 'approved' WHERE id = v_order.admission_id;
  END IF;

  SELECT id INTO v_enrollment_id
  FROM public.course_enrollments
  WHERE course_id = v_order.course_id
    AND status IN ('pending', 'active', 'suspended')
    AND (
      (v_order.student_id IS NOT NULL AND student_id = v_order.student_id)
      OR (v_order.student_id IS NULL AND user_id = v_order.user_id)
    )
  FOR UPDATE;

  IF v_enrollment_id IS NULL THEN
    INSERT INTO public.course_enrollments (
      user_id, student_id, course_id, batch_id, status, source, enrolled_at,
      course_fee, discount_amount, final_fee, created_at, updated_at
    ) VALUES (
      v_order.user_id, v_order.student_id, v_order.course_id, v_order.batch_id,
      'active', 'public_checkout', NOW(),
      v_order.subtotal_minor / 100.0, v_order.discount_minor / 100.0,
      v_order.total_minor / 100.0, NOW(), NOW()
    ) RETURNING id INTO v_enrollment_id;
  ELSE
    UPDATE public.course_enrollments
    SET status = 'active', source = COALESCE(source, 'public_checkout'),
        course_fee = CASE WHEN course_fee = 0 THEN v_order.subtotal_minor / 100.0 ELSE course_fee END,
        discount_amount = CASE WHEN discount_amount = 0 THEN v_order.discount_minor / 100.0 ELSE discount_amount END,
        final_fee = CASE WHEN final_fee = 0 THEN v_order.total_minor / 100.0 ELSE final_fee END,
        updated_at = NOW()
    WHERE id = v_enrollment_id;
  END IF;

  IF v_order.total_minor > 0 THEN
    INSERT INTO public.payments (
      student_id, enrollment_id, order_id, payment_date, amount, payment_method,
      remarks, created_at, updated_at
    ) VALUES (
      v_order.student_id, v_enrollment_id, v_order.id, CURRENT_DATE,
      v_order.total_minor / 100.0, 'Online', v_order.order_number, NOW(), NOW()
    );
  END IF;

  IF p_payment_event_id IS NOT NULL THEN
    UPDATE public.payment_events_inbox SET status = 'PROCESSED' WHERE id = p_payment_event_id;
  END IF;
  IF p_manual_review_id IS NOT NULL THEN
    UPDATE public.manual_payment_reviews SET status = 'APPROVED', reviewed_at = NOW() WHERE id = p_manual_review_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'enrollment_id', v_enrollment_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

COMMIT;
