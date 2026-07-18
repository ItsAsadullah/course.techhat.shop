import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const envLocal = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf-8");
const urlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.*)/);

const supabase = createClient(urlMatch![1].trim(), keyMatch![1].trim());

async function run() {
  const { data, error } = await supabase
    .from("course_lessons")
    .select("id, title_bn, title_en, video_url, is_preview, is_locked");
  console.log(JSON.stringify({ data, error }, null, 2));
}

run();
