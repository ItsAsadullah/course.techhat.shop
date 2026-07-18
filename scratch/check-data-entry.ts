import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nlzouivkdqurfmjmqicj.supabase.co";
const supabaseKey = "sb_publishable_KQUNdgP_VCAE9_xUoRwJuA_0LJmeXfD";
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from("course_lessons")
    .select("title_bn, video_url");
  console.log("Result:", JSON.stringify(data, null, 2));
}
check();
