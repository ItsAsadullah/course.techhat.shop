const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    
    console.log("Adding columns...");
    await client.query(`
      ALTER TABLE students ADD COLUMN IF NOT EXISTS student_code VARCHAR UNIQUE;
      ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS enrollment_code VARCHAR UNIQUE;
    `);

    console.log("Creating generate_student_code function...");
    await client.query(`
      CREATE OR REPLACE FUNCTION generate_student_code() RETURNS TRIGGER AS $$
      DECLARE
          v_year VARCHAR;
          v_count INT;
          v_new_serial VARCHAR;
      BEGIN
          v_year := to_char(CURRENT_DATE, 'YY');
          
          SELECT COALESCE(MAX(SUBSTRING(student_code FROM 3 FOR 4)::INT), 0)
          INTO v_count
          FROM students
          WHERE student_code LIKE v_year || '%';
          
          v_new_serial := LPAD((v_count + 1)::TEXT, 4, '0');
          NEW.student_code := v_year || v_new_serial;
          
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log("Creating generate_enrollment_code function...");
    await client.query(`
      CREATE OR REPLACE FUNCTION generate_enrollment_code() RETURNS TRIGGER AS $$
      DECLARE
          v_year VARCHAR;
          v_count INT;
          v_new_serial VARCHAR;
      BEGIN
          v_year := to_char(CURRENT_DATE, 'YYYY');
          
          SELECT COALESCE(MAX(SUBSTRING(enrollment_code FROM 9 FOR 6)::INT), 0)
          INTO v_count
          FROM course_enrollments
          WHERE enrollment_code LIKE 'EN-' || v_year || '-%';
          
          v_new_serial := LPAD((v_count + 1)::TEXT, 6, '0');
          NEW.enrollment_code := 'EN-' || v_year || '-' || v_new_serial;
          
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log("Dropping existing triggers if any...");
    await client.query(`
      DROP TRIGGER IF EXISTS before_insert_students ON students;
      DROP TRIGGER IF EXISTS before_insert_course_enrollments ON course_enrollments;
    `);

    console.log("Creating triggers...");
    await client.query(`
      CREATE TRIGGER before_insert_students
      BEFORE INSERT ON students
      FOR EACH ROW
      WHEN (NEW.student_code IS NULL)
      EXECUTE FUNCTION generate_student_code();

      CREATE TRIGGER before_insert_course_enrollments
      BEFORE INSERT ON course_enrollments
      FOR EACH ROW
      WHEN (NEW.enrollment_code IS NULL)
      EXECUTE FUNCTION generate_enrollment_code();
    `);

    console.log("Backfilling existing students...");
    const { rows: students } = await client.query(`SELECT id, created_at FROM students WHERE student_code IS NULL ORDER BY created_at ASC`);
    let studentYearCounts = {};
    for (const st of students) {
      const year = new Date(st.created_at).getFullYear().toString().slice(-2); // e.g., '26'
      if (!studentYearCounts[year]) studentYearCounts[year] = 0;
      studentYearCounts[year]++;
      
      const newCode = year + studentYearCounts[year].toString().padStart(4, '0');
      await client.query(`UPDATE students SET student_code = $1 WHERE id = $2`, [newCode, st.id]);
    }
    console.log(`Backfilled ${students.length} students.`);

    console.log("Backfilling existing enrollments...");
    const { rows: enrollments } = await client.query(`SELECT id, created_at FROM course_enrollments WHERE enrollment_code IS NULL ORDER BY created_at ASC`);
    let enrollmentYearCounts = {};
    for (const en of enrollments) {
      const year = new Date(en.created_at).getFullYear().toString(); // e.g., '2026'
      if (!enrollmentYearCounts[year]) enrollmentYearCounts[year] = 0;
      enrollmentYearCounts[year]++;
      
      const newCode = 'EN-' + year + '-' + enrollmentYearCounts[year].toString().padStart(6, '0');
      await client.query(`UPDATE course_enrollments SET enrollment_code = $1 WHERE id = $2`, [newCode, en.id]);
    }
    console.log(`Backfilled ${enrollments.length} enrollments.`);

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
  }
}

migrate();
