import { createClient } from "@supabase/supabase-js";

export async function fixMissingAdmissionIds() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: students } = await supabase.from("students").select("id, admission_id").order("created_at", { ascending: true });
  
  if (!students) return;

  let currentId = 1;
  for (const student of students) {
    if (!student.admission_id || isNaN(parseInt(student.admission_id, 10))) {
      const paddedId = currentId.toString().padStart(6, "0");
      await supabase.from("students").update({ admission_id: paddedId }).eq("id", student.id);
      currentId++;
    } else {
      currentId = Math.max(currentId, parseInt(student.admission_id, 10) + 1);
    }
  }
  console.log("Finished updating students");
}
