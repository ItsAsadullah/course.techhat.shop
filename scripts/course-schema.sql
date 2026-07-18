-- =====================================================
-- Enterprise Course Management System Schema
-- TechHat IT Institute
-- =====================================================

-- Backup old courses table
ALTER TABLE IF EXISTS courses RENAME TO legacy_courses;

-- ===== 1. COURSE CATEGORIES =====
CREATE TABLE IF NOT EXISTS course_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en VARCHAR(150) NOT NULL,
  name_bn VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  parent_id UUID REFERENCES course_categories(id) ON DELETE SET NULL,
  icon VARCHAR(100),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 2. COURSES (Main) =====
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_code VARCHAR(50) UNIQUE NOT NULL,
  category_id UUID REFERENCES course_categories(id) ON DELETE SET NULL,
  sub_category_id UUID REFERENCES course_categories(id) ON DELETE SET NULL,
  course_type VARCHAR(50) NOT NULL DEFAULT 'offline',
  -- offline | online | hybrid | workshop | seminar | bootcamp | live_class | recorded
  course_level VARCHAR(50) DEFAULT 'beginner',
  -- beginner | intermediate | advanced | all_levels
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  -- draft | published | archived
  is_featured BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  total_enrolled INT DEFAULT 0,
  average_rating NUMERIC(3, 2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 3. COURSE TRANSLATIONS (BN + EN) =====
CREATE TABLE IF NOT EXISTS course_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lang VARCHAR(5) NOT NULL DEFAULT 'en', -- 'en' or 'bn'
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT,
  long_description TEXT,
  objectives TEXT,        -- JSON array of strings
  learning_outcomes TEXT, -- JSON array of strings
  benefits TEXT,          -- JSON array of strings
  who_should_join TEXT,   -- JSON array of strings
  requirements TEXT,      -- JSON array of strings
  target_audience TEXT,
  skills_covered TEXT,    -- JSON array of strings
  career_opportunities TEXT, -- JSON array of strings
  UNIQUE(course_id, lang)
);

-- ===== 4. COURSE MEDIA =====
CREATE TABLE IF NOT EXISTS course_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE UNIQUE,
  thumbnail_url TEXT,
  banner_url TEXT,
  gallery_urls TEXT,   -- JSON array of URLs
  intro_video_type VARCHAR(20), -- 'youtube' | 'vimeo' | 'direct'
  intro_video_url TEXT,
  demo_video_url TEXT,
  preview_pdf_url TEXT,
  brochure_pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 5. COURSE PRICING =====
CREATE TABLE IF NOT EXISTS course_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE UNIQUE,
  course_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  admission_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  monthly_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  is_free BOOLEAN DEFAULT FALSE,
  discount_amount NUMERIC(12, 2) DEFAULT 0,
  discount_percent NUMERIC(5, 2) DEFAULT 0,
  scholarship_available BOOLEAN DEFAULT FALSE,
  installment_available BOOLEAN DEFAULT FALSE,
  installment_count INT DEFAULT 0,
  coupon_support BOOLEAN DEFAULT FALSE,
  certificate_option VARCHAR(30) DEFAULT 'included',
  -- 'included' | 'optional' | 'none'
  certificate_fee NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 6. COURSE DURATION / SCHEDULE =====
CREATE TABLE IF NOT EXISTS course_duration (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE UNIQUE,
  -- For Offline/Hybrid
  session VARCHAR(50),    -- 'morning' | 'evening' | 'weekend' | 'custom'
  class_days TEXT,        -- JSON array: ["sat","sun","mon"]
  class_time_start TIME,
  class_time_end TIME,
  start_date DATE,
  end_date DATE,
  admission_deadline DATE,
  application_deadline DATE,
  orientation_date DATE,
  total_classes INT,
  total_hours INT,
  duration_text_en VARCHAR(100), -- e.g. "3 Months"
  duration_text_bn VARCHAR(100), -- e.g. "৩ মাস"
  -- For Online
  is_lifetime_access BOOLEAN DEFAULT FALSE,
  access_duration_days INT, -- 30 | 60 | 90 | 180 | 365
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 7. COURSE FEATURES =====
CREATE TABLE IF NOT EXISTS course_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE UNIQUE,
  has_certificate BOOLEAN DEFAULT FALSE,
  has_lifetime_support BOOLEAN DEFAULT FALSE,
  has_community_access BOOLEAN DEFAULT FALSE,
  has_private_group BOOLEAN DEFAULT FALSE,
  has_live_qa BOOLEAN DEFAULT FALSE,
  has_projects BOOLEAN DEFAULT FALSE,
  has_assignments BOOLEAN DEFAULT FALSE,
  has_exam BOOLEAN DEFAULT FALSE,
  has_final_project BOOLEAN DEFAULT FALSE,
  has_job_guideline BOOLEAN DEFAULT FALSE,
  has_internship_support BOOLEAN DEFAULT FALSE,
  has_career_support BOOLEAN DEFAULT FALSE,
  has_freelancing_guide BOOLEAN DEFAULT FALSE,
  has_cv_review BOOLEAN DEFAULT FALSE,
  has_portfolio_review BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 8. COURSE SEO =====
CREATE TABLE IF NOT EXISTS course_seo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE UNIQUE,
  meta_title_en VARCHAR(255),
  meta_title_bn VARCHAR(255),
  meta_description_en TEXT,
  meta_description_bn TEXT,
  keywords TEXT, -- comma separated
  canonical_url TEXT,
  og_image_url TEXT,
  twitter_card_type VARCHAR(30) DEFAULT 'summary_large_image',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 9. COURSE FAQ =====
CREATE TABLE IF NOT EXISTS course_faq (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  question_en TEXT NOT NULL,
  question_bn TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  answer_bn TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 10. COURSE TAGS =====
CREATE TABLE IF NOT EXISTS course_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  UNIQUE(course_id, tag)
);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_type ON courses(course_type);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON courses(is_featured);
CREATE INDEX IF NOT EXISTS idx_courses_popular ON courses(is_popular);
CREATE INDEX IF NOT EXISTS idx_course_translations_slug ON course_translations(slug);
CREATE INDEX IF NOT EXISTS idx_course_translations_lang ON course_translations(course_id, lang);

-- ===== RLS POLICIES =====
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_duration ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_tags ENABLE ROW LEVEL SECURITY;

-- Public can read published courses
CREATE POLICY "Public read published courses" ON courses FOR SELECT USING (status = 'published');
CREATE POLICY "Public read translations" ON course_translations FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON course_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read media" ON course_media FOR SELECT USING (true);
CREATE POLICY "Public read pricing" ON course_pricing FOR SELECT USING (true);
CREATE POLICY "Public read duration" ON course_duration FOR SELECT USING (true);
CREATE POLICY "Public read features" ON course_features FOR SELECT USING (true);
CREATE POLICY "Public read faq" ON course_faq FOR SELECT USING (true);
CREATE POLICY "Public read tags" ON course_tags FOR SELECT USING (true);

-- Admins full access
CREATE POLICY "Admin full access courses" ON courses FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access translations" ON course_translations FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access categories" ON course_categories FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access media" ON course_media FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access pricing" ON course_pricing FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access duration" ON course_duration FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access features" ON course_features FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access seo" ON course_seo FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access faq" ON course_faq FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access tags" ON course_tags FOR ALL USING (auth.uid() IS NOT NULL);

-- ===== SEED: Default Categories =====
INSERT INTO course_categories (name_en, name_bn, slug) VALUES
  ('Graphics & Design', 'গ্রাফিক্স ও ডিজাইন', 'graphics-design'),
  ('Web Development', 'ওয়েব ডেভেলপমেন্ট', 'web-development'),
  ('Programming', 'প্রোগ্রামিং', 'programming'),
  ('Networking', 'নেটওয়ার্কিং', 'networking'),
  ('Digital Marketing', 'ডিজিটাল মার্কেটিং', 'digital-marketing'),
  ('Video Editing', 'ভিডিও এডিটিং', 'video-editing'),
  ('Accounting', 'অ্যাকাউন্টিং', 'accounting'),
  ('Microsoft Office', 'মাইক্রোসফট অফিস', 'microsoft-office')
ON CONFLICT (slug) DO NOTHING;
