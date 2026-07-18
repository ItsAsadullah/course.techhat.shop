-- 1. Create a table to track running sequences per year
CREATE TABLE IF NOT EXISTS public.system_sequences (
    sequence_name VARCHAR(50) PRIMARY KEY,
    last_value INT NOT NULL DEFAULT 0
);

-- 2. Add enrollment_code to course_enrollments if it doesn't exist
ALTER TABLE public.course_enrollments
  ADD COLUMN IF NOT EXISTS enrollment_code VARCHAR(20) UNIQUE;

-- 3. Function and Trigger for Student Code (YY + 4 digit serial)
CREATE OR REPLACE FUNCTION public.generate_student_code()
RETURNS TRIGGER AS $$
DECLARE
    v_year_prefix VARCHAR(2);
    v_sequence_name VARCHAR(50);
    v_next_val INT;
BEGIN
    IF NEW.student_code IS NULL OR NEW.student_code = '' THEN
        -- Get current 2-digit year (e.g., '26' for 2026)
        v_year_prefix := to_char(CURRENT_DATE, 'YY');
        v_sequence_name := 'student_' || v_year_prefix;

        -- Get next value for this year
        INSERT INTO public.system_sequences (sequence_name, last_value)
        VALUES (v_sequence_name, 1)
        ON CONFLICT (sequence_name)
        DO UPDATE SET last_value = system_sequences.last_value + 1
        RETURNING last_value INTO v_next_val;

        -- Format as YY + 4 digits (e.g., 260101)
        NEW.student_code := v_year_prefix || LPAD(v_next_val::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_student_code ON public.students;
CREATE TRIGGER trg_generate_student_code
    BEFORE INSERT ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_student_code();

-- Backfill missing student codes
DO $$
DECLARE
    rec RECORD;
    v_year_prefix VARCHAR(2);
    v_sequence_name VARCHAR(50);
    v_next_val INT;
BEGIN
    FOR rec IN SELECT id, created_at FROM public.students WHERE student_code IS NULL OR student_code = '' ORDER BY created_at ASC LOOP
        v_year_prefix := to_char(COALESCE(rec.created_at, CURRENT_DATE), 'YY');
        v_sequence_name := 'student_' || v_year_prefix;
        
        INSERT INTO public.system_sequences (sequence_name, last_value)
        VALUES (v_sequence_name, 1)
        ON CONFLICT (sequence_name)
        DO UPDATE SET last_value = system_sequences.last_value + 1
        RETURNING last_value INTO v_next_val;

        UPDATE public.students 
        SET student_code = v_year_prefix || LPAD(v_next_val::TEXT, 4, '0')
        WHERE id = rec.id;
    END LOOP;
END $$;


-- 4. Function and Trigger for Enrollment Code (EN-YYYY-Serial)
CREATE OR REPLACE FUNCTION public.generate_enrollment_code()
RETURNS TRIGGER AS $$
DECLARE
    v_year_prefix VARCHAR(4);
    v_sequence_name VARCHAR(50);
    v_next_val INT;
BEGIN
    IF NEW.enrollment_code IS NULL OR NEW.enrollment_code = '' THEN
        -- Get current 4-digit year (e.g., '2026')
        v_year_prefix := to_char(CURRENT_DATE, 'YYYY');
        v_sequence_name := 'enrollment_' || v_year_prefix;

        -- Get next value for this year
        INSERT INTO public.system_sequences (sequence_name, last_value)
        VALUES (v_sequence_name, 1)
        ON CONFLICT (sequence_name)
        DO UPDATE SET last_value = system_sequences.last_value + 1
        RETURNING last_value INTO v_next_val;

        -- Format as EN-YYYY-6 digits (e.g., EN-2026-000001)
        NEW.enrollment_code := 'EN-' || v_year_prefix || '-' || LPAD(v_next_val::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_enrollment_code ON public.course_enrollments;
CREATE TRIGGER trg_generate_enrollment_code
    BEFORE INSERT ON public.course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_enrollment_code();

-- Backfill missing enrollment codes
DO $$
DECLARE
    rec RECORD;
    v_year_prefix VARCHAR(4);
    v_sequence_name VARCHAR(50);
    v_next_val INT;
BEGIN
    FOR rec IN SELECT id, enrolled_at FROM public.course_enrollments WHERE enrollment_code IS NULL OR enrollment_code = '' ORDER BY enrolled_at ASC LOOP
        v_year_prefix := to_char(COALESCE(rec.enrolled_at, CURRENT_DATE), 'YYYY');
        v_sequence_name := 'enrollment_' || v_year_prefix;
        
        INSERT INTO public.system_sequences (sequence_name, last_value)
        VALUES (v_sequence_name, 1)
        ON CONFLICT (sequence_name)
        DO UPDATE SET last_value = system_sequences.last_value + 1
        RETURNING last_value INTO v_next_val;

        UPDATE public.course_enrollments 
        SET enrollment_code = 'EN-' || v_year_prefix || '-' || LPAD(v_next_val::TEXT, 6, '0')
        WHERE id = rec.id;
    END LOOP;
END $$;
