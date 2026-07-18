-- =====================================================
-- Enterprise Settings Management System Schema
-- =====================================================

-- ===== 1. SETTING GROUPS =====
CREATE TABLE IF NOT EXISTS setting_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(150) UNIQUE NOT NULL,
  "nameEn" VARCHAR(255) NOT NULL,
  "nameBn" VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  "sortOrder" INT DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 2. SYSTEM SETTINGS =====
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "groupId" UUID NOT NULL REFERENCES setting_groups(id) ON DELETE CASCADE,
  key VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'string', 'boolean', 'number', 'json', 'file', 'color', 'password'
  value TEXT,
  "defaultValue" TEXT,
  "isPublic" BOOLEAN DEFAULT false,
  
  -- Multilingual support
  "valueBn" TEXT,
  
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_setting_groups_slug ON setting_groups(slug);
CREATE INDEX IF NOT EXISTS idx_system_settings_group_id ON system_settings("groupId");
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);

-- ===== RLS POLICIES =====
ALTER TABLE setting_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Admins full access
CREATE POLICY "Admin full access setting_groups" ON setting_groups FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access system_settings" ON system_settings FOR ALL USING (auth.uid() IS NOT NULL);

-- Public read access for public settings
CREATE POLICY "Public read public system_settings" ON system_settings FOR SELECT USING ("isPublic" = true);
CREATE POLICY "Public read setting_groups for public settings" ON setting_groups FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM system_settings WHERE "groupId" = setting_groups.id AND "isPublic" = true
  )
);

-- ===== SEED DATA: Default Setting Groups =====
INSERT INTO setting_groups (id, slug, "nameEn", "nameBn", description, icon, "sortOrder") VALUES
  (uuid_generate_v4(), 'general', 'General Settings', 'সাধারণ সেটিংস', 'Manage basic organization details, name, logo, etc.', 'settings', 10),
  (uuid_generate_v4(), 'organization', 'Organization', 'প্রতিষ্ঠান', 'Business and legal information', 'building-2', 20),
  (uuid_generate_v4(), 'website', 'Website Settings', 'ওয়েবসাইট সেটিংস', 'Manage homepage, SEO, and banners', 'globe', 30),
  (uuid_generate_v4(), 'admissions', 'Admission Settings', 'ভর্তি সেটিংস', 'Configure online admission rules', 'user-plus', 40),
  (uuid_generate_v4(), 'courses', 'Course Settings', 'কোর্স সেটিংস', 'Course defaults and limits', 'book-open', 50),
  (uuid_generate_v4(), 'students', 'Student Settings', 'শিক্ষার্থী সেটিংস', 'Manage student requirements and formats', 'users', 60),
  (uuid_generate_v4(), 'attendance', 'Attendance Settings', 'উপস্থিতি সেটিংস', 'Manage attendance methods and timings', 'clock', 70),
  (uuid_generate_v4(), 'examinations', 'Examination Settings', 'পরীক্ষা সেটিংস', 'Grading systems and transcripts', 'file-text', 80),
  (uuid_generate_v4(), 'certificates', 'Certificate Settings', 'সার্টিফিকেট সেটিংস', 'Certificate templates and generation', 'award', 90),
  (uuid_generate_v4(), 'payments', 'Payment Settings', 'পেমেন্ট সেটিংস', 'Currencies, gateways, and taxes', 'credit-card', 100),
  (uuid_generate_v4(), 'sms_email', 'SMS & Email', 'এসএমএস ও ইমেইল', 'Gateway configuration and templates', 'mail', 110),
  (uuid_generate_v4(), 'notifications', 'Notifications', 'নোটিফিকেশন', 'App and push notification settings', 'bell', 120),
  (uuid_generate_v4(), 'users_roles', 'Users & Roles', 'ব্যবহারকারী ও ভূমিকা', 'Role permissions and management', 'shield', 130),
  (uuid_generate_v4(), 'security', 'Security', 'নিরাপত্তা', '2FA, password policies, sessions', 'lock', 140),
  (uuid_generate_v4(), 'localization', 'Localization', 'স্থানীয়করণ', 'Language, date, and time formats', 'languages', 150),
  (uuid_generate_v4(), 'appearance', 'Appearance', 'থিম ও রং', 'Colors, modes, and layouts', 'palette', 160),
  (uuid_generate_v4(), 'analytics', 'Analytics', 'অ্যানালিটিক্স', 'Tracking and pixel codes', 'line-chart', 170),
  (uuid_generate_v4(), 'integrations', 'Integrations', 'ইন্টিগ্রেশন', 'Third party API keys and connections', 'plug', 180),
  (uuid_generate_v4(), 'storage', 'Storage', 'স্টোরেজ', 'File storage drivers and limits', 'database', 190),
  (uuid_generate_v4(), 'backup_restore', 'Backup & Restore', 'ব্যাকআপ ও রিস্টোর', 'System backup configurations', 'archive', 200),
  (uuid_generate_v4(), 'audit_logs', 'Audit Logs', 'অডিট লগ', 'Tracking system changes', 'history', 210),
  (uuid_generate_v4(), 'developer', 'Developer Options', 'ডেভেলপার অপশন', 'Advanced debug and hooks', 'code', 220)
ON CONFLICT (slug) DO NOTHING;

-- Seed initial settings
DO $$
DECLARE
  general_group_id UUID;
  integrations_group_id UUID;
BEGIN
  SELECT id INTO general_group_id FROM setting_groups WHERE slug = 'general' LIMIT 1;
  SELECT id INTO integrations_group_id FROM setting_groups WHERE slug = 'integrations' LIMIT 1;
  
  IF general_group_id IS NOT NULL THEN
    INSERT INTO system_settings ("groupId", key, type, value, "defaultValue", "isPublic", "valueBn") VALUES
      (general_group_id, 'org_name', 'string', 'TechHat IT Institute', 'TechHat IT Institute', true, 'টেকহ্যাট আইটি ইন্সটিটিউট'),
      (general_group_id, 'org_short_name', 'string', 'TechHat', 'TechHat', true, 'টেকহ্যাট'),
      (general_group_id, 'org_email', 'string', 'support@techhat.com', 'support@techhat.com', true, null),
      (general_group_id, 'org_phone', 'string', '+8801700000000', '+8801700000000', true, null),
      (general_group_id, 'primary_color', 'color', '#0f172a', '#0f172a', true, null)
    ON CONFLICT (key) DO NOTHING;
  END IF;

  IF integrations_group_id IS NOT NULL THEN
    -- Migrate legacy gemini API key
    INSERT INTO system_settings ("groupId", key, type, value, "defaultValue", "isPublic", "valueBn") VALUES
      (integrations_group_id, 'gemini_api_key', 'password', '', '', false, null)
    ON CONFLICT (key) DO NOTHING;
  END IF;
END $$;
