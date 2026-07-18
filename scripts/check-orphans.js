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
    
    // Check which ones are not in legacy_courses
    const res1 = await client.query(`
      SELECT course_id FROM legacy_students 
      WHERE course_id IS NOT NULL 
      AND course_id NOT IN (SELECT id FROM legacy_courses)
    `);
    console.log("Orphaned from legacy_courses:", res1.rows);

    // Check which ones are not in courses
    const res2 = await client.query(`
      SELECT course_id FROM legacy_students 
      WHERE course_id IS NOT NULL 
      AND course_id NOT IN (SELECT id FROM courses)
    `);
    console.log("Orphaned from courses:", res2.rows);

  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await client.end();
  }
}

run();
