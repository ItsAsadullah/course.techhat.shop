import dns from 'dns';
import fs from 'fs';
import path from 'path';
import postgres from 'postgres';
import dotenv from 'dotenv';

dns.setDefaultResultOrder('ipv6first');

// Load .env.local
dotenv.config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('Error: DATABASE_URL is not set in .env.local');
  process.exit(1);
}

const sql = postgres(dbUrl, { ssl: 'require' });

async function runSqlFile(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }

    console.log(`Reading SQL file: ${fullPath}`);
    const query = fs.readFileSync(fullPath, 'utf8');

    console.log('Executing SQL...');
    // We execute the entire file as a single raw query
    const result = await sql.unsafe(query);
    console.log('SQL executed successfully!');
    if (result && result.length) {
      console.log(result);
    }
  } catch (error) {
    console.error('Failed to execute SQL:', error);
  } finally {
    await sql.end();
  }
}

const targetFile = process.argv[2];
if (!targetFile) {
  console.error('Usage: node scripts/run-sql.mjs <path-to-sql-file>');
  process.exit(1);
}

runSqlFile(targetFile);
