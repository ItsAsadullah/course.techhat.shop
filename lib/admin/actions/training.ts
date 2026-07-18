"use server";

import { createClient } from "@/lib/admin/supabase/server";
import { revalidatePath } from "next/cache";
import { 
  trainingLabSchema, 
  TrainingLabValues,
  trainingShiftSchema,
  TrainingShiftValues
} from "@/lib/schema/training.schema";

function nullIfEmpty(val: any) {
  if (val === "" || val === undefined || val === null) return null;
  return val;
}

// =====================================================
// TRAINING LABS
// =====================================================

export async function getTrainingLabs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("training_labs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch training labs:", error);
    return [];
  }

  return data;
}

export async function getTrainingLab(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("training_labs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch training lab:", error);
    return null;
  }

  return data;
}

export async function saveTrainingLab(id: string | null, rawValues: unknown) {
  try {
    const values = trainingLabSchema.parse(rawValues);
    const supabase = await createClient();
    
    // Validate that usable <= total
    if (values.usable_computers > values.total_computers) {
      return { error: "Usable computers cannot exceed total computers" };
    }

    const payload = {
      name: values.name,
      code: values.code,
      description: nullIfEmpty(values.description),
      room: nullIfEmpty(values.room),
      location: nullIfEmpty(values.location),
      total_computers: values.total_computers,
      usable_computers: values.usable_computers,
      students_per_computer: values.students_per_computer,
      manual_capacity_limit: values.manual_capacity_limit ?? null,
      status: values.status,
    };

    if (id) {
      const { error } = await supabase
        .from("training_labs")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", id);
      
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase
        .from("training_labs")
        .insert(payload);
        
      if (error) return { error: error.message };
    }

    revalidatePath("/admin/training/labs");
    return { success: true };
  } catch (error: any) {
    console.error("saveTrainingLab error:", error);
    return { error: error.message || "Failed to save lab" };
  }
}

export async function deleteTrainingLab(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("training_labs").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/training/labs");
  return { success: true };
}

// =====================================================
// TRAINING SHIFTS
// =====================================================

export async function getTrainingShifts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("training_shifts")
    .select(`
      *,
      lab:lab_id (
        id,
        name,
        code,
        usable_computers,
        students_per_computer,
        manual_capacity_limit
      )
    `)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch training shifts:", error);
    return [];
  }

  return data;
}

export async function getTrainingShiftsForLab(labId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("training_shifts")
    .select("*")
    .eq("lab_id", labId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch lab shifts:", error);
    return [];
  }

  return data;
}

export async function getTrainingShift(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("training_shifts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch training shift:", error);
    return null;
  }

  return data;
}

export async function saveTrainingShift(id: string | null, rawValues: unknown) {
  try {
    const values = trainingShiftSchema.parse(rawValues);
    const supabase = await createClient();

    const payload = {
      lab_id: values.lab_id,
      name_en: values.name_en,
      name_bn: nullIfEmpty(values.name_bn),
      code: nullIfEmpty(values.code),
      start_time: values.start_time,
      end_time: values.end_time,
      class_days: values.class_days.length ? JSON.stringify(values.class_days) : null,
      capacity_override: values.capacity_override ?? null,
      status: values.status,
      sort_order: values.sort_order,
    };

    if (id) {
      const { error } = await supabase
        .from("training_shifts")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", id);
      
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase
        .from("training_shifts")
        .insert(payload);
        
      if (error) return { error: error.message };
    }

    revalidatePath("/admin/training/shifts");
    return { success: true };
  } catch (error: any) {
    console.error("saveTrainingShift error:", error);
    return { error: error.message || "Failed to save shift" };
  }
}

export async function deleteTrainingShift(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("training_shifts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/training/shifts");
  return { success: true };
}
