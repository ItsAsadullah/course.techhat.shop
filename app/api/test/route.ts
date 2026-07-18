import { NextResponse } from "next/server";
import { createClient } from "@/lib/admin/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_schema_info");
  
  // if no rpc, let's try raw query using postgrest directly
  const res = await supabase.from("course_translations").select("*").limit(1);
  return NextResponse.json({
    data: res.data,
    error: res.error,
  });
}
