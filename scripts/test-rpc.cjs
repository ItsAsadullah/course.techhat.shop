const { Client } = require('pg');
const url = "postgresql://postgres.nlzouivkdqurfmjmqicj:TechHat%40321@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

async function main() {
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    const res = await client.query(`SELECT finalize_course_payment('ef161bbb-b8fd-4902-a957-6ccc4f6b8daf')`);
    console.log(res.rows[0]);
  } catch(e) {
    console.error(e);
  } finally {
    client.end();
  }
}
main();
