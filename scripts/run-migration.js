import { readFileSync } from 'fs';
import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

const sqlContent = readFileSync(path.resolve(process.cwd(), 'scripts/unify-students-migration.sql'), 'utf-8');

const sql = postgres(dbUrl, {
  max: 1, // Only need 1 connection for this
});

async function run() {
  try {
    console.log('Running migration...');
    // postgres.js doesn't easily run multiple statements separated by semicolons if they aren't structured safely
    // The safest way is to execute it as a simple raw query using sql.unsafe
    await sql.unsafe(sqlContent);
    console.log('Migration successfully completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sql.end();
  }
}

run();
