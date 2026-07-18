"use server";

import { createClient } from "@/lib/admin/supabase/server";
import { revalidatePath } from "next/cache";

export async function getSetting(key: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error || !data) return null;
  return data.value;
}

export async function updateSetting(key: string, value: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) {
    return { error: error.message };
  }
  
  revalidatePath("/admin/settings");
  return { success: true };
}
