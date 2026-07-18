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

    const res1 = await client.query(`
      SELECT id FROM courses WHERE id = 'fca16206-55b0-4190-b8c6-3e7099ee839e';
    `);
    console.log("Found in courses:", res1.rows);

    const res2 = await client.query(`
      SELECT id FROM legacy_courses WHERE id = 'fca16206-55b0-4190-b8c6-3e7099ee839e';
    `);
    console.log("Found in legacy_courses:", res2.rows);

  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await client.end();
  }
}

run();
