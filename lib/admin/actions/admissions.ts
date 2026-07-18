"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function getPendingAdmissions() {
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data, error } = await supabaseAdmin
    .from("admissions")
    .select(`
      id,
      admission_id,
      status,
      payment_method,
      payment_number,
      trx_id,
      admission_date,
      students (
        full_name_en,
        mobile
      )
    `)
    .eq("status", "pending_payment")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending admissions:", error);
    return [];
  }
  return data || [];
}

export async function approveAdmission(id: string) {
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { error } = await supabaseAdmin
    .from("admissions")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/admissions");
  revalidatePath("/admin/students");
  return { success: true };
}
