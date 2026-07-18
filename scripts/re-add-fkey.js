import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { Client } = pkg;

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("Connected to DB.");

    await client.query(`
      ALTER TABLE legacy_students DROP CONSTRAINT IF EXISTS legacy_students_course_id_fkey;
      ALTER TABLE legacy_students DROP CONSTRAINT IF EXISTS students_course_id_fkey;
      ALTER TABLE legacy_students 
      ADD CONSTRAINT legacy_students_course_id_fkey 
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL;
    `);

    console.log("Foreign key to courses successfully added!");
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await client.end();
  }
}

run();
