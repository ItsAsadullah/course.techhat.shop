-- ==============================================================================
-- ENTERPRISE SETTINGS MANAGEMENT SYSTEM SCHEMA
-- ==============================================================================

CREATE TABLE IF NOT EXISTS enterprise_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_group VARCHAR(50) NOT NULL, -- e.g., 'general', 'organization', 'website'
    setting_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'org_name_en'
    value_en TEXT,
    value_bn TEXT,
    type VARCHAR(20) DEFAULT 'string', -- 'string', 'boolean', 'number', 'json'
    is_public BOOLEAN DEFAULT false,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID -- REFERENCES auth.users(id)
);

-- Index for fast retrieval by group
CREATE INDEX IF NOT EXISTS idx_enterprise_settings_group ON enterprise_settings(setting_group);

-- Enable RLS
ALTER TABLE enterprise_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read for public settings" 
ON enterprise_settings FOR SELECT 
USING (is_public = true);

CREATE POLICY "Allow all access to authenticated admins" 
ON enterprise_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert Default General Settings
INSERT INTO enterprise_settings (setting_group, setting_key, value_en, value_bn, type, is_public, description)
VALUES 
('general', 'org_name', 'TechHat IT Institute', 'টেকহ্যাট আইটি ইন্সটিটিউট', 'string', true, 'Organization Name'),
('general', 'short_name', 'TechHat', 'টেকহ্যাট', 'string', true, 'Short Name'),
('general', 'tagline', 'Empowering Your Tech Career', 'আপনার টেক ক্যারিয়ারের ক্ষমতায়ন', 'string', true, 'Tagline'),
('general', 'primary_color', '#2563eb', '#2563eb', 'string', true, 'Primary Brand Color'),
('general', 'support_email', 'support@techhat.com', 'support@techhat.com', 'string', true, 'Support Email'),
('general', 'support_phone', '+880 1234 567890', '+880 1234 567890', 'string', true, 'Support Phone'),
('general', 'timezone', 'Asia/Dhaka', 'Asia/Dhaka', 'string', true, 'System Timezone'),
('general', 'currency', 'BDT', 'BDT', 'string', true, 'Primary Currency'),

('organization', 'institute_type', 'Private Training Center', 'প্রাইভেট ট্রেনিং সেন্টার', 'string', true, 'Type of Institute'),
('organization', 'trade_license', '', '', 'string', false, 'Trade License Number'),
('organization', 'address', 'Dhaka, Bangladesh', 'ঢাকা, বাংলাদেশ', 'string', true, 'HQ Address'),

('website', 'maintenance_mode', 'false', 'false', 'boolean', true, 'Is the website under maintenance?'),
('advanced', 'debug_mode', 'false', 'false', 'boolean', false, 'Enable detailed debug logging')
ON CONFLICT (setting_key) DO NOTHING;
