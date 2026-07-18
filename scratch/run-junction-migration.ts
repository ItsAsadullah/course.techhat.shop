import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  db: { schema: "public" },
});

async function runMigration() {
  const sqlPath = resolve(__dirname, "../scripts/batch-shifts-junction.sql");
  const sql = readFileSync(sqlPath, "utf-8");

  console.log("Running batch-shifts-junction.sql...");

  const { error } = await supabase.rpc("exec_sql", { sql_text: sql });

  if (error) {
    // If exec_sql RPC doesn't exist, try via REST
    console.log("exec_sql RPC not available, trying direct SQL via pg...");
    console.error("Error:", error.message);
    console.log("\nPlease run this SQL manually in the Supabase SQL Editor:");
    console.log(sqlPath);
    process.exit(1);
  }

  console.log("Migration completed successfully!");

  // Verify
  const { data, error: verifyError } = await supabase
    .from("course_batch_shifts")
    .select("*")
    .limit(5);

  console.log("Verify error:", verifyError);
  console.log("Verify data:", JSON.stringify(data, null, 2));
}

runMigration();
