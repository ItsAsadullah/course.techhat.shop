-- =====================================================
-- Course Module RLS v2 — TechHat IT Institute
-- Real admin gating via public.is_admin(); public reads
-- gated through the published + public parent course.
-- Apply AFTER course-schema-v2.sql:
--   node scripts/run-sql.mjs scripts/course-rls-v2.sql
-- =====================================================

-- ----- Admin predicate (reads auth.users; runs as owner) -----
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT (raw_user_meta_data ->> 'role') = 'admin'
       FROM auth.users
      WHERE id = auth.uid()),
    false
  );
$$;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- ----- Helper: is a course publicly visible? -----
CREATE OR REPLACE FUNCTION public.course_is_public(cid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = cid AND c.status = 'published' AND c.visibility = 'public'
  );
$$;
GRANT EXECUTE ON FUNCTION public.course_is_public(uuid) TO anon, authenticated, service_role;

-- =====================================================
-- Enable RLS on all course tables (idempotent)
-- =====================================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'courses','course_categories','course_translations','course_media','course_pricing',
    'course_duration','course_features','course_seo','course_faq','course_tags','course_tag_map',
    'course_settings','course_schema','course_batches','course_modules','course_lessons',
    'course_trainers','course_trainer_map','course_reviews','course_enrollments',
    'course_analytics','course_revisions'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
  END LOOP;
END $$;

-- =====================================================
-- Drop legacy policies we are replacing
-- =====================================================
DROP POLICY IF EXISTS "Public read published courses" ON courses;
DROP POLICY IF EXISTS "Admin full access courses" ON courses;
DROP POLICY IF EXISTS "Public read translations" ON course_translations;
DROP POLICY IF EXISTS "Admin full access translations" ON course_translations;
DROP POLICY IF EXISTS "Public read categories" ON course_categories;
DROP POLICY IF EXISTS "Admin full access categories" ON course_categories;
DROP POLICY IF EXISTS "Public read media" ON course_media;
DROP POLICY IF EXISTS "Admin full access media" ON course_media;
DROP POLICY IF EXISTS "Public read pricing" ON course_pricing;
DROP POLICY IF EXISTS "Admin full access pricing" ON course_pricing;
DROP POLICY IF EXISTS "Public read duration" ON course_duration;
DROP POLICY IF EXISTS "Admin full access duration" ON course_duration;
DROP POLICY IF EXISTS "Public read features" ON course_features;
DROP POLICY IF EXISTS "Admin full access features" ON course_features;
DROP POLICY IF EXISTS "Admin full access seo" ON course_seo;
DROP POLICY IF EXISTS "Public read faq" ON course_faq;
DROP POLICY IF EXISTS "Admin full access faq" ON course_faq;
DROP POLICY IF EXISTS "Admin full access tags" ON course_tags;

-- =====================================================
-- COURSES
-- =====================================================
CREATE POLICY "public_read_courses" ON courses
  FOR SELECT USING (status = 'published' AND visibility = 'public');
CREATE POLICY "admin_all_courses" ON courses
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =====================================================
-- GLOBAL LOOKUP TABLES (categories, tags, trainers)
-- =====================================================
CREATE POLICY "public_read_categories" ON course_categories
  FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_categories" ON course_categories
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_tags" ON course_tags FOR SELECT USING (true);
CREATE POLICY "admin_all_tags" ON course_tags
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_trainers" ON course_trainers FOR SELECT USING (true);
CREATE POLICY "admin_all_trainers" ON course_trainers
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =====================================================
-- CHILD TABLES — public read gated by published+public parent,
-- admin full access. (course_id column present on each.)
-- =====================================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'course_translations','course_media','course_pricing','course_duration',
    'course_features','course_seo','course_faq','course_tag_map','course_settings',
    'course_schema','course_batches','course_modules','course_trainer_map'
  ] LOOP
    EXECUTE format('CREATE POLICY %I ON %I FOR SELECT USING (public.course_is_public(course_id));',
                   'public_read_' || t, t);
    EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());',
                   'admin_all_' || t, t);
  END LOOP;
END $$;

-- course_lessons: parent is a module -> course
CREATE POLICY "public_read_course_lessons" ON course_lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_modules m
      WHERE m.id = course_lessons.module_id AND public.course_is_public(m.course_id)
    )
  );
CREATE POLICY "admin_all_course_lessons" ON course_lessons
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =====================================================
-- REVIEWS — public read approved reviews of public courses;
-- authenticated users may submit their own; admin full access.
-- =====================================================
CREATE POLICY "public_read_reviews" ON course_reviews
  FOR SELECT USING (is_approved = true AND public.course_is_public(course_id));
CREATE POLICY "user_insert_reviews" ON course_reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
CREATE POLICY "admin_all_reviews" ON course_reviews
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =====================================================
-- ENROLLMENTS — users read/insert their own; admin full access.
-- =====================================================
CREATE POLICY "user_read_enrollments" ON course_enrollments
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "user_insert_enrollments" ON course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admin_all_enrollments" ON course_enrollments
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =====================================================
-- ANALYTICS + REVISIONS — admin only (no public read)
-- =====================================================
CREATE POLICY "admin_all_analytics" ON course_analytics
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_all_revisions" ON course_revisions
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
