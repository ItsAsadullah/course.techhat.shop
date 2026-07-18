"use server";

import { createClient } from "@/lib/admin/supabase/server";
import { revalidatePath } from "next/cache";
import { trainingLabSchema } from "@/lib/schema/training.schema";
import { TrainingActionResult, TrainingLab, TrainingLabCapacity } from "@/types/admin/training";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.app_metadata?.app_role ?? user?.user_metadata?.role;

  if (!user || String(role).toLowerCase() !== "admin") {
    return { user: null, error: "UNAUTHORIZED" as const };
  }
  return { user, error: null };
}

function nullIfEmpty(val: unknown) {
  if (val === "" || val === undefined || val === null) return null;
  return val;
}

export async function getTrainingLabs(): Promise<TrainingLab[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("training_labs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch training labs:", error);
    return [];
  }

  return data as TrainingLab[];
}

export async function getTrainingLabById(id: string): Promise<TrainingLab | null> {
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

  return data as TrainingLab;
}

export async function getTrainingLabCapacity(id: string): Promise<TrainingLabCapacity | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_training_lab_capacity', { p_lab_id: id });
  
  if (error || !data) {
    console.error("Failed to fetch lab capacity:", error);
    return null;
  }
  return data as TrainingLabCapacity;
}

export async function createTrainingLab(rawValues: unknown): Promise<{ success: true; data: { labId: string } } | { success: false; error: { code: string; message: string } }> {
  try {
    const access = await requireAdmin();
    if (access.error) return { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } };

    const values = trainingLabSchema.parse(rawValues);
    const supabase = await createClient();

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

    const { data, error } = await supabase
      .from("training_labs")
      .insert(payload)
      .select("id")
      .single();
      
    if (error) {
      console.error("createTrainingLab insert error", error);
      return { success: false, error: { code: "DATABASE_ERROR", message: "Failed to create training lab" } };
    }

    revalidatePath("/admin/training");
    revalidatePath("/admin/training/labs");
    
    return { success: true, data: { labId: data.id } };
  } catch (error: unknown) {
    console.error("createTrainingLab error:", error);
    return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid input data" } };
  }
}

export async function updateTrainingLab(id: string, rawValues: unknown): Promise<{ success: true; data: { labId: string } } | { success: false; error: { code: string; message: string } }> {
  try {
    const access = await requireAdmin();
    if (access.error) return { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } };

    if (!id) return { success: false, error: { code: "INVALID_INPUT", message: "Lab ID is required" } };

    const values = trainingLabSchema.parse(rawValues);
    const supabase = await createClient();

    const { data: existing, error: fetchError } = await supabase
      .from("training_labs")
      .select("id, status")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.error("updateTrainingLab fetch error", fetchError);
      return { success: false, error: { code: "DATABASE_ERROR", message: "Failed to verify lab existence" } };
    }
    if (!existing) {
      return { success: false, error: { code: "LAB_NOT_FOUND", message: "The specified training lab does not exist" } };
    }

    if (existing.status === "active" && (values.status === "maintenance" || values.status === "inactive")) {
      const { data: activeShifts, error: shiftError } = await supabase
        .from("training_shifts")
        .select("id")
        .eq("lab_id", id)
        .eq("status", "active")
        .limit(1);

      if (shiftError) {
        console.error("updateTrainingLab check shifts error", shiftError);
        return { success: false, error: { code: "DATABASE_ERROR", message: "Failed to check active shifts" } };
      }

      if (activeShifts && activeShifts.length > 0) {
        return { success: false, error: { code: "LAB_HAS_ACTIVE_SHIFTS", message: "এই ল্যাবে সক্রিয় ট্রেনিং শিফট রয়েছে। আগে শিফটগুলো নিষ্ক্রিয় বা অন্য ল্যাবে স্থানান্তর করুন।" } };
      }
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
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("training_labs")
      .update(payload)
      .eq("id", id);
      
    if (error) {
      console.error("updateTrainingLab update error", error);
      return { success: false, error: { code: "DATABASE_ERROR", message: "Failed to update training lab" } };
    }

    revalidatePath("/admin/training");
    revalidatePath("/admin/training/labs");
    revalidatePath(`/admin/training/labs/${id}`);
    
    return { success: true, data: { labId: id } };
  } catch (error: unknown) {
    console.error("updateTrainingLab error:", error);
    return { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid input data" } };
  }
}

export async function archiveTrainingLab(id: string): Promise<{ success: true; data: boolean } | { success: false; error: { code: string; message: string } }> {
  try {
    const access = await requireAdmin();
    if (access.error) return { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } };

    if (!id) return { success: false, error: { code: "INVALID_INPUT", message: "Lab ID is required" } };

    const supabase = await createClient();

    const { data, error } = await supabase.rpc('archive_training_lab', { p_lab_id: id });
    
    if (error) {
       return { success: false, error: { code: "DB_ARCHIVE_ERROR", message: "Database error occurred while archiving lab" } };
    }
    
    if (!data.success) {
      const errorMap: Record<string, string> = {
        LAB_NOT_FOUND: "ল্যাবটি খুঁজে পাওয়া যায়নি।",
        ALREADY_ARCHIVED: "ল্যাবটি ইতোমধ্যে আর্কাইভ করা হয়েছে।",
        LAB_HAS_ACTIVE_SHIFTS: "এই ল্যাবে সক্রিয় ট্রেনিং শিফট রয়েছে। আগে শিফটগুলো নিষ্ক্রিয় বা অন্য ল্যাবে স্থানান্তর করুন।",
        LAB_HAS_ACTIVE_BATCHES: "এই ল্যাবের সাথে সংযুক্ত সক্রিয় ব্যাচ রয়েছে। আগে ব্যাচগুলো আর্কাইভ বা স্থানান্তর করুন।",
        LAB_HAS_ACTIVE_ENROLLMENTS: "এই ল্যাবের সাথে সংযুক্ত সক্রিয় এনরোলমেন্ট রয়েছে।",
        DATABASE_ERROR: "ল্যাব আর্কাইভ করতে ডেটাবেস এরর হয়েছে।"
      };
      
      const message = errorMap[data.error] || "Failed to archive lab";
      return { success: false, error: { code: data.error, message } };
    }

    revalidatePath("/admin/training");
    revalidatePath("/admin/training/labs");
    revalidatePath(`/admin/training/labs/${id}`);

    return { success: true, data: true };
  } catch (error: unknown) {
    console.error("archiveTrainingLab error:", error);
    return { success: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred" } };
  }
}
