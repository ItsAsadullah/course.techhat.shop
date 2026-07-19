require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

const runMigration = async () => {
  try {
    await client.connect();
    
    // Check and add payment_method
    await client.query(`
      ALTER TABLE admissions 
      ADD COLUMN IF NOT EXISTS payment_method VARCHAR(255);
    `);
    console.log('Added payment_method column');

    // Check and add payment_number
    await client.query(`
      ALTER TABLE admissions 
      ADD COLUMN IF NOT EXISTS payment_number VARCHAR(255);
    `);
    console.log('Added payment_number column');

    // Check and add trx_id
    await client.query(`
      ALTER TABLE admissions 
      ADD COLUMN IF NOT EXISTS trx_id VARCHAR(255);
    `);
    console.log('Added trx_id column');

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
};

runMigration();
