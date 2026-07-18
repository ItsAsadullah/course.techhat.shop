-- =====================================================
-- Enterprise Admission System Schema
-- =====================================================

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Backup legacy tables to avoid conflicts
ALTER TABLE IF EXISTS students RENAME TO legacy_students;
ALTER TABLE IF EXISTS payments RENAME TO legacy_payments;

-- 1. COURSES & BATCHES
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  duration TEXT NOT NULL,
  fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  shift VARCHAR(50),
  trainer_name VARCHAR(255),
  start_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADMISSIONS (Core Admission Application)
CREATE TABLE IF NOT EXISTS admissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admission_id VARCHAR(50) UNIQUE, -- Auto generated e.g. ADM-2026-001
  user_id UUID, -- If logged in user submitted
  status VARCHAR(20) DEFAULT 'draft', -- draft, submitted, approved, rejected, hold
  course_id UUID REFERENCES courses(id),
  batch_id UUID REFERENCES batches(id),
  shift VARCHAR(50),
  admission_date DATE,
  discount NUMERIC(12, 2) DEFAULT 0,
  scholarship NUMERIC(12, 2) DEFAULT 0,
  referral VARCHAR(255),
  source_of_admission VARCHAR(100),
  expected_start_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STUDENTS (Personal Details linked to Admission)
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admission_id UUID REFERENCES admissions(id) ON DELETE CASCADE,
  full_name_en VARCHAR(255),
  full_name_bn VARCHAR(255),
  father_name VARCHAR(255),
  mother_name VARCHAR(255),
  gender VARCHAR(20),
  religion VARCHAR(50),
  dob DATE,
  blood_group VARCHAR(10),
  nationality VARCHAR(50) DEFAULT 'Bangladeshi',
  nid VARCHAR(50),
  birth_cert_no VARCHAR(50),
  passport_no VARCHAR(50),
  marital_status VARCHAR(20),
  mobile VARCHAR(20),
  guardian_mobile VARCHAR(20),
  email VARCHAR(255),
  emergency_contact VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STUDENT_ADDRESSES
CREATE TABLE IF NOT EXISTS student_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  address_type VARCHAR(20), -- present, permanent
  division VARCHAR(100),
  district VARCHAR(100),
  upazila VARCHAR(100),
  union_municipality VARCHAR(100),
  ward VARCHAR(50),
  post_office VARCHAR(100),
  post_code VARCHAR(20),
  village VARCHAR(255),
  road VARCHAR(255),
  house VARCHAR(255),
  area VARCHAR(255),
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STUDENT_EDUCATION
CREATE TABLE IF NOT EXISTS student_education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  exam_name VARCHAR(100),
  board VARCHAR(100),
  institute VARCHAR(255),
  passing_year INTEGER,
  roll_no VARCHAR(50),
  registration_no VARCHAR(50),
  group_subject VARCHAR(100),
  result_type VARCHAR(20), -- GPA, CGPA, Division, Class
  result_value VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GUARDIANS
CREATE TABLE IF NOT EXISTS guardians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  guardian_type VARCHAR(50), -- Father, Mother, Brother, etc
  name VARCHAR(255),
  occupation VARCHAR(100),
  monthly_income NUMERIC(12, 2),
  mobile VARCHAR(20),
  relationship VARCHAR(50),
  guardian_address TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STUDENT_DOCUMENTS
CREATE TABLE IF NOT EXISTS student_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  document_type VARCHAR(50), -- photo, birth_cert, nid, academic, signature
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MEDICAL_INFO
CREATE TABLE IF NOT EXISTS medical_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  blood_group VARCHAR(10),
  disability BOOLEAN DEFAULT FALSE,
  special_needs TEXT,
  medical_notes TEXT,
  allergies TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. DECLARATION (Terms accepted)
CREATE TABLE IF NOT EXISTS declarations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admission_id UUID REFERENCES admissions(id) ON DELETE CASCADE,
  terms_accepted BOOLEAN DEFAULT FALSE,
  privacy_accepted BOOLEAN DEFAULT FALSE,
  signature_url TEXT,
  ip_address VARCHAR(50),
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert for admissions" ON admissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for students" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for addresses" ON student_addresses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for education" ON student_education FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for guardians" ON guardians FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for docs" ON student_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for medical" ON medical_info FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for declarations" ON declarations FOR INSERT WITH CHECK (true);

-- Admins can read all (assuming users with role='admin' exist or relying on service key)
CREATE POLICY "Allow admin full access" ON admissions FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow admin full access" ON students FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow admin full access" ON student_addresses FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow admin full access" ON student_education FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow admin full access" ON guardians FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow admin full access" ON student_documents FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow admin full access" ON medical_info FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow admin full access" ON declarations FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow admin full access" ON batches FOR ALL USING (auth.uid() IS NOT NULL);
