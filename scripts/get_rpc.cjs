const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function getRpc() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();

  const res = await client.query(`
    SELECT pg_get_functiondef(p.oid) AS definition
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE proname = 'admin_direct_enroll';
  `);
  
  if (res.rows.length > 0) {
    console.log(res.rows[0].definition);
  } else {
    console.log("Function not found.");
  }
  await client.end();
}
getRpc();
