"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase-server";
type CourseCategoryInsert = {
  name_en: string;
  name_bn: string;
  slug: string;
  parent_id?: string | null;
  is_active?: boolean;
};

type CourseCategoryUpdate = Partial<CourseCategoryInsert>;

export async function createCourseCategory(data: CourseCategoryInsert) {
  const supabase = await createServerClient();

  const { error } = await supabase.from("course_categories").insert({
    ...data,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to create course category:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/settings/categories");
  revalidatePath("/admin/courses/new");
  return { success: true };
}

export async function updateCourseCategory(id: string, data: CourseCategoryUpdate) {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("course_categories")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to update course category:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/settings/categories");
  revalidatePath("/admin/courses/new");
  return { success: true };
}

export async function deleteCourseCategory(id: string) {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("course_categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete course category:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/settings/categories");
  revalidatePath("/admin/courses/new");
  return { success: true };
}
