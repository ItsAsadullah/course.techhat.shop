import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixForeignKey() {
  console.log("Adding foreign key to legacy_students...");
  
  // We can execute SQL using supabase RPC if we have an exec function, but we don't.
  // Instead, since it's a small project, can we do it? 
  // No, supabase JS client cannot run raw SQL directly unless we use an RPC.
  console.log("Please run this SQL in Supabase SQL Editor:");
  console.log(`
ALTER TABLE legacy_students 
ADD CONSTRAINT legacy_students_course_id_fkey 
FOREIGN KEY (course_id) REFERENCES legacy_courses(id) ON DELETE SET NULL;
  `);
}

fixForeignKey();
