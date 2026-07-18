-- =====================================================
-- Enterprise Course Management System — Schema v2
-- TechHat IT Institute
-- Idempotent & additive. Safe to re-run.
-- Apply with:  node scripts/run-sql.mjs scripts/course-schema-v2.sql
-- Then run:    node scripts/run-sql.mjs scripts/course-rls-v2.sql
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- EXTEND EXISTING TABLES (non-destructive)
-- =====================================================

-- ----- course_categories -----
ALTER TABLE course_categories ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE course_categories ADD COLUMN IF NOT EXISTS description_bn TEXT;
ALTER TABLE course_categories ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE course_categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ----- courses -----
-- visibility lives on the row so RLS can gate it cheaply (no join).
ALTER TABLE courses ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) NOT NULL DEFAULT 'public';
  -- public | private | password
ALTER TABLE courses ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN DEFAULT FALSE;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS author_id UUID;             -- auth.users.id (FK omitted; auth schema)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS publish_at TIMESTAMPTZ;      -- scheduled publish
ALTER TABLE courses ADD COLUMN IF NOT EXISTS last_indexed_at TIMESTAMPTZ;

-- ----- course_translations (add new content fields as TEXT storing JSON strings) -----
ALTER TABLE course_translations ADD COLUMN IF NOT EXISTS software_used TEXT;   -- JSON array
ALTER TABLE course_translations ADD COLUMN IF NOT EXISTS projects TEXT;        -- JSON array
ALTER TABLE course_translations ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE course_translations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ----- course_media (add missing fields) -----
ALTER TABLE course_media ADD COLUMN IF NOT EXISTS preview_video_url TEXT;
ALTER TABLE course_media ADD COLUMN IF NOT EXISTS course_pdf_url TEXT;
ALTER TABLE course_media ADD COLUMN IF NOT EXISTS certificate_sample_url TEXT;

-- ----- course_pricing (offers + certificate tiers) -----
ALTER TABLE course_pricing ADD COLUMN IF NOT EXISTS discount_fee NUMERIC(12,2) DEFAULT 0;
ALTER TABLE course_pricing ADD COLUMN IF NOT EXISTS offer_start TIMESTAMPTZ;
ALTER TABLE course_pricing ADD COLUMN IF NOT EXISTS offer_end TIMESTAMPTZ;
ALTER TABLE course_pricing ADD COLUMN IF NOT EXISTS board_certificate_fee NUMERIC(12,2) DEFAULT 0;
ALTER TABLE course_pricing ADD COLUMN IF NOT EXISTS institute_certificate_fee NUMERIC(12,2) DEFAULT 0;
ALTER TABLE course_pricing ADD COLUMN IF NOT EXISTS currency VARCHAR(8) DEFAULT 'BDT';

-- =====================================================
-- REDESIGN course_seo -> per-(course_id, lang) rows
-- (current table is unused; safe to drop & recreate)
-- =====================================================
DROP TABLE IF EXISTS course_seo CASCADE;
CREATE TABLE course_seo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lang VARCHAR(5) NOT NULL DEFAULT 'en',          -- 'en' | 'bn'
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,                              -- comma separated
  focus_keyword VARCHAR(150),
  canonical_url TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  og_image_url TEXT,
  twitter_card VARCHAR(30) DEFAULT 'summary_large_image',
  robots_index BOOLEAN DEFAULT TRUE,               -- true = index, false = noindex
  schema_type VARCHAR(50) DEFAULT 'Course',        -- Course | EducationalOccupationalProgram ...
  seo_score INT DEFAULT 0,                          -- 0..100 (computed client-side, cached)
  readability_score INT DEFAULT 0,                 -- 0..100
  keyword_density NUMERIC(5,2) DEFAULT 0,          -- percent
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, lang)
);

-- =====================================================
-- REDESIGN course_tags -> global tags + M:N map
-- (current per-course table is unused; safe to drop)
-- =====================================================
DROP TABLE IF EXISTS course_tags CASCADE;
CREATE TABLE course_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(120) UNIQUE NOT NULL,
  name_en VARCHAR(120) NOT NULL,
  name_bn VARCHAR(120),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_tag_map (
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES course_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, tag_id)
);

-- =====================================================
-- NEW: course_settings (homepage / marketing — 1:1)
-- =====================================================
CREATE TABLE IF NOT EXISTS course_settings (
  course_id UUID PRIMARY KEY REFERENCES courses(id) ON DELETE CASCADE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT TRUE,
  is_recommended BOOLEAN DEFAULT FALSE,
  homepage_visible BOOLEAN DEFAULT TRUE,
  homepage_order INT DEFAULT 0,
  show_in_slider BOOLEAN DEFAULT FALSE,
  show_in_category BOOLEAN DEFAULT TRUE,
  hero_banner BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NEW: course_schema (structured-data toggles + overrides)
-- =====================================================
CREATE TABLE IF NOT EXISTS course_schema (
  course_id UUID PRIMARY KEY REFERENCES courses(id) ON DELETE CASCADE,
  auto_generate BOOLEAN DEFAULT TRUE,
  enable_course BOOLEAN DEFAULT TRUE,
  enable_breadcrumb BOOLEAN DEFAULT TRUE,
  enable_faq BOOLEAN DEFAULT TRUE,
  enable_organization BOOLEAN DEFAULT TRUE,
  manual_jsonld JSONB,                              -- optional manual override
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NEW: course_batches (schedule / seats — 1:N)
-- =====================================================
CREATE TABLE IF NOT EXISTS course_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name_en VARCHAR(150),
  name_bn VARCHAR(150),
  session VARCHAR(30),                              -- morning | evening | weekend | custom
  start_date DATE,
  end_date DATE,
  admission_deadline DATE,
  orientation_date DATE,
  class_days TEXT,                                  -- JSON array
  class_time_start TIME,
  class_time_end TIME,
  room VARCHAR(100),
  seat_limit INT,
  available_seats INT,
  waitlist_enabled BOOLEAN DEFAULT FALSE,
  -- online
  access_type VARCHAR(20) DEFAULT 'lifetime',      -- lifetime | duration
  access_duration_days INT,
  release_date DATE,
  drip_enabled BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'upcoming',            -- upcoming | running | completed | cancelled
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NEW: curriculum — course_modules -> course_lessons
-- =====================================================
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title_en VARCHAR(255),
  title_bn VARCHAR(255),
  description_en TEXT,
  description_bn TEXT,
  estimated_minutes INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title_en VARCHAR(255),
  title_bn VARCHAR(255),
  lesson_type VARCHAR(30) DEFAULT 'video',          -- video | article | assignment | quiz | coding | download
  content_url TEXT,
  video_url TEXT,
  duration_minutes INT DEFAULT 0,
  is_preview BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT TRUE,
  attachments JSONB,                                -- [{name,url,size}]
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NEW: trainers (global) + M:N map
-- =====================================================
CREATE TABLE IF NOT EXISTS course_trainers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(150) UNIQUE,
  name_en VARCHAR(150) NOT NULL,
  name_bn VARCHAR(150),
  designation_en VARCHAR(150),
  designation_bn VARCHAR(150),
  bio_en TEXT,
  bio_bn TEXT,
  image_url TEXT,
  expertise TEXT,                                   -- JSON array
  facebook_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_trainer_map (
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES course_trainers(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'trainer',               -- trainer | co_trainer | mentor | guest
  sort_order INT DEFAULT 0,
  PRIMARY KEY (course_id, trainer_id, role)
);

-- =====================================================
-- NEW: reviews / testimonials (1:N)
-- =====================================================
CREATE TABLE IF NOT EXISTS course_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID,                                     -- auth.users.id (nullable for seeded testimonials)
  author_name VARCHAR(150),
  author_image_url TEXT,
  rating SMALLINT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(255),
  body TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  is_testimonial BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NEW: enrollments (1:N)
-- =====================================================
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES course_batches(id) ON DELETE SET NULL,
  user_id UUID,                                     -- auth.users.id
  status VARCHAR(20) DEFAULT 'pending',             -- pending | active | completed | cancelled
  progress NUMERIC(5,2) DEFAULT 0,
  source VARCHAR(50),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- =====================================================
-- NEW: per-course analytics overrides + counters (1:1)
-- =====================================================
CREATE TABLE IF NOT EXISTS course_analytics (
  course_id UUID PRIMARY KEY REFERENCES courses(id) ON DELETE CASCADE,
  ga4_measurement_id VARCHAR(50),
  fb_pixel_id VARCHAR(50),
  event_config JSONB,
  view_count BIGINT DEFAULT 0,
  enroll_count BIGINT DEFAULT 0,
  wishlist_count BIGINT DEFAULT 0,
  share_count BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NEW: revision history (1:N) — Undo / Revision History
-- =====================================================
CREATE TABLE IF NOT EXISTS course_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,
  created_by UUID,
  note VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_courses_visibility ON courses(visibility);
CREATE INDEX IF NOT EXISTS idx_courses_published_at ON courses(published_at);
CREATE INDEX IF NOT EXISTS idx_course_seo_course_lang ON course_seo(course_id, lang);
CREATE INDEX IF NOT EXISTS idx_course_tag_map_tag ON course_tag_map(tag_id);
CREATE INDEX IF NOT EXISTS idx_course_batches_course ON course_batches(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON course_modules(course_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module ON course_lessons(module_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_course_trainer_map_course ON course_trainer_map(course_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_course ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON course_enrollments(user_id);

-- =====================================================
-- BACKFILL: mirror existing marketing flags into course_settings
-- =====================================================
INSERT INTO course_settings (course_id, is_featured, is_popular, is_trending, is_new, homepage_order)
SELECT id, is_featured, is_popular, is_trending, is_new, sort_order FROM courses
ON CONFLICT (course_id) DO NOTHING;
