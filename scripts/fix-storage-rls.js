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
      DROP POLICY IF EXISTS "Give public access to public bucket" ON storage.objects;
      CREATE POLICY "Give public access to public bucket" 
      ON storage.objects FOR ALL 
      USING (bucket_id = 'public') 
      WITH CHECK (bucket_id = 'public');
    `);

    console.log("Storage RLS policy successfully added!");
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await client.end();
  }
}

run();
