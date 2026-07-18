ALTER TABLE admissions DROP CONSTRAINT IF EXISTS admissions_course_id_fkey;
ALTER TABLE admissions ADD CONSTRAINT admissions_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL;

ALTER TABLE legacy_students DROP CONSTRAINT IF EXISTS students_course_id_fkey;
ALTER TABLE legacy_students DROP CONSTRAINT IF EXISTS legacy_students_course_id_fkey;
