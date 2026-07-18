"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/admin/supabase/server";
import type { CourseListItem, CourseWithRelations } from "@/types/course";
import type { CourseWizardValues } from "@/lib/schema/course.schema";

// ===== GENERATE COURSE CODE =====
function generateCourseCode(nameEn: string): string {
  const prefix = nameEn
    .toUpperCase()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 4);
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${suffix}`;
}

// ===== GET CATEGORIES =====
export async function getCourseCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
  return data || [];
}

// ===== GET COURSES LIST (Admin) =====
export async function getCourses(filters?: {
  search?: string;
  status?: string;
  type?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("courses")
    .select(`
      id, course_code, course_type, status, is_featured, is_popular,
      is_trending, total_enrolled, average_rating, created_at, updated_at,
      translations:course_translations(name, slug, lang),
      media:course_media(thumbnail_url),
      pricing:course_pricing(course_fee),
      category:course_categories!category_id(name_en, name_bn)
    `)
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.type) query = query.eq("course_type", filters.type);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch courses: ${error.message}`);

  // Flatten and normalize
  return ((data || []).map((row: any) => {
    const translations: any[] = Array.isArray(row.translations) ? row.translations : [];
    const enT = translations.find((t: any) => t.lang === "en") || {};
    const bnT = translations.find((t: any) => t.lang === "bn") || {};

    return {
      id: row.id,
      course_code: row.course_code,
      course_type: row.course_type,
      status: row.status,
      is_featured: row.is_featured,
      is_popular: row.is_popular,
      is_trending: row.is_trending,
      total_enrolled: row.total_enrolled,
      average_rating: row.average_rating,
      created_at: row.created_at,
      updated_at: row.updated_at,
      name_en: enT.name || "",
      name_bn: bnT.name || "",
      slug_en: enT.slug || "",
      slug_bn: bnT.slug || "",
      thumbnail_url: Array.isArray(row.media) ? row.media[0]?.thumbnail_url : row.media?.thumbnail_url || null,
      course_fee: Array.isArray(row.pricing) ? (row.pricing[0]?.course_fee ?? 0) : (row.pricing?.course_fee ?? 0),
      category_name_en: Array.isArray(row.category) ? row.category[0]?.name_en : row.category?.name_en || null,
      category_name_bn: Array.isArray(row.category) ? row.category[0]?.name_bn : row.category?.name_bn || null,
    };
  }) as CourseListItem[]).filter((c) => {
    if (!filters?.search) return true;
    const s = filters.search.toLowerCase();
    return c.name_en.toLowerCase().includes(s) || c.name_bn.includes(s) || c.course_code.toLowerCase().includes(s);
  });
}

// ===== GET SINGLE COURSE (Admin Edit) =====
export async function getCourseById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      translations:course_translations(*),
      media:course_media(*),
      pricing:course_pricing(*),
      duration:course_duration(*),
      features:course_features(*),
      seo:course_seo(*),
      faqs:course_faq(*)
    `)
    .eq("id", id)
    .single();

  if (error) throw new Error(`Course not found: ${error.message}`);
  return data;
}

// ===== GET COURSE BY SLUG (Public) =====
export async function getCourseBySlug(slug: string, _lang: "en" | "bn" = "en") {
  const supabase = await createClient();

  // Slugs are globally unique across languages — match either.
  const { data: translation, error: tErr } = await supabase
    .from("course_translations")
    .select("course_id, lang")
    .eq("slug", slug)
    .maybeSingle();

  if (tErr || !translation) return null;

  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      translations:course_translations(*),
      category:course_categories!category_id(*),
      media:course_media(*),
      pricing:course_pricing(*),
      duration:course_duration(*),
      features:course_features(*),
      seo:course_seo(*),
      faqs:course_faq(*),
      modules:course_modules(*, lessons:course_lessons(*)),
      trainers:course_trainer_map(role, sort_order, trainer:course_trainers(*)),
      reviews:course_reviews(*)
    `)
    .eq("id", translation.course_id)
    .eq("status", "published")
    .single();

  if (error) return null;

  // Security: Strip locked content from non-enrolled users and non-admins
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.user_metadata?.role === "admin";
    let isEnrolled = false;

    if (user && !isAdmin) {
      const { data: enrollment } = await supabase
        .from("course_enrollments")
        .select("id")
        .eq("course_id", data.id)
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();
      if (enrollment) isEnrolled = true;
    }

    const hasFullAccess = isAdmin || isEnrolled;

    if (!hasFullAccess && data.modules) {
      data.modules = data.modules.map((mod: any) => ({
        ...mod,
        lessons: mod.lessons?.map((lesson: any) => ({
          ...lesson,
          video_url: lesson.is_preview ? lesson.video_url : null,
          content_url: lesson.is_preview ? lesson.content_url : null,
          attachments: lesson.is_preview ? lesson.attachments : null,
          _hasAccess: !!lesson.is_preview,
        })) || []
      }));
    } else if (data.modules) {
      data.modules = data.modules.map((mod: any) => ({
        ...mod,
        lessons: mod.lessons?.map((lesson: any) => ({
          ...lesson,
          _hasAccess: true,
        })) || []
      }));
    }
  } catch (err) {
    console.error("Error checking course access:", err);
    // On error, fail-safe: strip content
    if (data.modules) {
      data.modules = data.modules.map((mod: any) => ({
        ...mod,
        lessons: mod.lessons?.map((lesson: any) => ({
          ...lesson,
          video_url: lesson.is_preview ? lesson.video_url : null,
          content_url: lesson.is_preview ? lesson.content_url : null,
          attachments: lesson.is_preview ? lesson.attachments : null,
          _hasAccess: !!lesson.is_preview,
        })) || []
      }));
    }
  }

  return data as CourseWithRelations;
}

// ===== GET HOMEPAGE COURSES (Public) =====
export async function getHomepageCourses() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(`
      id, course_code, course_type, is_featured, is_popular, is_trending, is_new,
      total_enrolled, average_rating, status,
      translations:course_translations(*),
      media:course_media(thumbnail_url),
      pricing:course_pricing(course_fee, monthly_fee, discount_percent, certificate_fee, certificate_option),
      duration:course_duration(duration_text_en, duration_text_bn),
      features:course_features(has_certificate),
      category:course_categories!category_id(name_en, name_bn)
    `)
    .eq("status", "published")
    .order("sort_order")
    .limit(20);

  if (error) {
    console.error("Failed to fetch homepage courses:", error.message);
    return { featured: [], popular: [], online: [], offline: [] };
  }

  const courses = data || [];

  const normalize = (row: any) => {
    const translations: any[] = Array.isArray(row.translations) ? row.translations : [];
    const enT = translations.find((t: any) => t.lang === "en");
    const bnT = translations.find((t: any) => t.lang === "bn");
    const media = Array.isArray(row.media) ? row.media[0] : row.media;
    const pricing = Array.isArray(row.pricing) ? row.pricing[0] : row.pricing;
    const duration = Array.isArray(row.duration) ? row.duration[0] : row.duration;
    const features = Array.isArray(row.features) ? row.features[0] : row.features;
    const category = Array.isArray(row.category) ? row.category[0] : row.category;

    return {
      id: row.id,
      course_code: row.course_code,
      course_type: row.course_type,
      is_featured: row.is_featured,
      is_popular: row.is_popular,
      is_trending: row.is_trending,
      is_new: row.is_new,
      total_enrolled: row.total_enrolled,
      average_rating: row.average_rating,
      name_en: enT?.name || "",
      name_bn: bnT?.name || "",
      slug_en: enT?.slug || "",
      slug_bn: bnT?.slug || "",
      short_desc_en: enT?.short_description || "",
      short_desc_bn: bnT?.short_description || "",
      thumbnail_url: media?.thumbnail_url || null,
      course_fee: pricing?.course_fee ?? 0,
      monthly_fee: pricing?.monthly_fee ?? 0,
      discount_percent: pricing?.discount_percent ?? 0,
      certificate_fee: pricing?.certificate_fee ?? 0,
      certificate_option: pricing?.certificate_option || "free",
      duration_en: duration?.duration_text_en || "",
      duration_bn: duration?.duration_text_bn || "",
      has_certificate: features?.has_certificate ?? false,
      category_name_en: category?.name_en || "",
      category_name_bn: category?.name_bn || "",
    };
  };

  const all = courses.map(normalize);

  return {
    featured: all.filter((c) => c.is_featured),
    popular: all.filter((c) => c.is_popular),
    online: all.filter((c) => c.course_type === "online" || c.course_type === "live_class" || c.course_type === "recorded"),
    offline: all.filter((c) => c.course_type === "offline" || c.course_type === "hybrid"),
    all,
  };
}

// ===== CREATE COURSE (Wizard) =====
export async function createCourseWizard(data: CourseWizardValues) {
  const supabase = await createClient();

  const courseCode = data.step1.course_code || generateCourseCode(data.step1.name_en);

  // 1. Insert main course
  const { data: course, error: courseErr } = await supabase
    .from("courses")
    .insert({
      course_code: courseCode,
      category_id: data.step1.category_id || null,
      sub_category_id: data.step1.sub_category_id || null,
      course_type: data.step1.course_type,
      course_level: data.step1.course_level,
      status: data.step1.status,
      is_featured: data.step1.is_featured,
      is_popular: data.step1.is_popular,
      is_trending: data.step1.is_trending,
      is_new: data.step1.is_new,
      published_at: data.step1.status === "published" ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (courseErr) return { error: `Failed to create course: ${courseErr.message}` };

  const courseId = course.id;

  // 2. Insert translations
  await supabase.from("course_translations").insert([
    {
      course_id: courseId,
      lang: "en",
      name: data.step1.name_en,
      slug: data.step1.slug_en,
      short_description: data.step2.short_description_en || null,
      long_description: data.step2.long_description_en || null,
      objectives: data.step2.objectives_en ? data.step2.objectives_en.split("\n").filter(Boolean) : null,
      learning_outcomes: data.step2.learning_outcomes_en ? data.step2.learning_outcomes_en.split("\n").filter(Boolean) : null,
      benefits: data.step2.benefits_en ? data.step2.benefits_en.split("\n").filter(Boolean) : null,
      who_should_join: data.step2.who_should_join_en ? data.step2.who_should_join_en.split("\n").filter(Boolean) : null,
      requirements: data.step2.requirements_en ? data.step2.requirements_en.split("\n").filter(Boolean) : null,
      skills_covered: data.step2.skills_covered_en ? data.step2.skills_covered_en.split("\n").filter(Boolean) : null,
      career_opportunities: data.step2.career_opportunities_en ? data.step2.career_opportunities_en.split("\n").filter(Boolean) : null,
    },
    {
      course_id: courseId,
      lang: "bn",
      name: data.step1.name_bn,
      slug: data.step1.slug_bn,
      short_description: data.step2.short_description_bn || null,
      long_description: data.step2.long_description_bn || null,
      objectives: data.step2.objectives_bn ? data.step2.objectives_bn.split("\n").filter(Boolean) : null,
      learning_outcomes: data.step2.learning_outcomes_bn ? data.step2.learning_outcomes_bn.split("\n").filter(Boolean) : null,
      benefits: data.step2.benefits_bn ? data.step2.benefits_bn.split("\n").filter(Boolean) : null,
      who_should_join: data.step2.who_should_join_bn ? data.step2.who_should_join_bn.split("\n").filter(Boolean) : null,
      requirements: data.step2.requirements_bn ? data.step2.requirements_bn.split("\n").filter(Boolean) : null,
      skills_covered: data.step2.skills_covered_bn ? data.step2.skills_covered_bn.split("\n").filter(Boolean) : null,
      career_opportunities: data.step2.career_opportunities_bn ? data.step2.career_opportunities_bn.split("\n").filter(Boolean) : null,
    },
  ]);

  // 3. Insert media
  await supabase.from("course_media").insert({
    course_id: courseId,
    thumbnail_url: data.step3.thumbnail_url || null,
    banner_url: data.step3.banner_url || null,
    intro_video_type: data.step3.intro_video_type || null,
    intro_video_url: data.step3.intro_video_url || null,
    demo_video_url: data.step3.demo_video_url || null,
    brochure_pdf_url: data.step3.brochure_pdf_url || null,
  });

  // 4. Insert duration
  await supabase.from("course_duration").insert({
    course_id: courseId,
    duration_text_en: data.step4.duration_text_en,
    duration_text_bn: data.step4.duration_text_bn,
    session: data.step4.session || null,
    class_days: data.step4.class_days || [],
    class_time_start: data.step4.class_time_start || null,
    class_time_end: data.step4.class_time_end || null,
    start_date: data.step4.start_date || null,
    end_date: data.step4.end_date || null,
    admission_deadline: data.step4.admission_deadline || null,
    total_classes: data.step4.total_classes || null,
    total_hours: data.step4.total_hours || null,
    is_lifetime_access: data.step4.is_lifetime_access || false,
    access_duration_days: data.step4.access_duration_days || null,
  });

  // 5. Insert pricing
  await supabase.from("course_pricing").insert({
    course_id: courseId,
    course_fee: data.step5.course_fee,
    admission_fee: data.step5.admission_fee,
    monthly_fee: data.step5.monthly_fee,
    is_free: data.step5.is_free,
    discount_percent: data.step5.discount_percent,
    scholarship_available: data.step5.scholarship_available,
    installment_available: data.step5.installment_available,
    installment_count: data.step5.installment_count,
    certificate_option: data.step5.certificate_option,
    certificate_fee: data.step5.certificate_fee,
  });

  revalidatePath("/admin/courses");
  revalidatePath("/");
  revalidatePath("/courses");

  return { success: true, courseId, courseCode };
}

// ===== UPDATE COURSE (Wizard) =====
export async function updateCourseWizard(id: string, data: CourseWizardValues) {
  const supabase = await createClient();

  // 1. Update main course
  await supabase.from("courses").update({
    course_type: data.step1.course_type,
    course_level: data.step1.course_level,
    status: data.step1.status,
    is_featured: data.step1.is_featured,
    is_popular: data.step1.is_popular,
    is_trending: data.step1.is_trending,
    is_new: data.step1.is_new,
    updated_at: new Date().toISOString(),
    published_at: data.step1.status === "published" ? new Date().toISOString() : null,
  }).eq("id", id);

  // 2. Upsert translations
  for (const lang of ["en", "bn"] as const) {
    const isEn = lang === "en";
    await supabase.from("course_translations").upsert({
      course_id: id,
      lang,
      name: isEn ? data.step1.name_en : data.step1.name_bn,
      slug: isEn ? data.step1.slug_en : data.step1.slug_bn,
      short_description: isEn ? data.step2.short_description_en : data.step2.short_description_bn,
      long_description: isEn ? data.step2.long_description_en : data.step2.long_description_bn,
    }, { onConflict: "course_id,lang" });
  }

  // 3. Upsert media
  await supabase.from("course_media").upsert({
    course_id: id,
    thumbnail_url: data.step3.thumbnail_url || null,
    banner_url: data.step3.banner_url || null,
    intro_video_type: data.step3.intro_video_type || null,
    intro_video_url: data.step3.intro_video_url || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "course_id" });

  // 4. Upsert duration
  await supabase.from("course_duration").upsert({
    course_id: id,
    duration_text_en: data.step4.duration_text_en,
    duration_text_bn: data.step4.duration_text_bn,
    session: data.step4.session || null,
    class_days: data.step4.class_days || [],
    start_date: data.step4.start_date || null,
    end_date: data.step4.end_date || null,
    total_classes: data.step4.total_classes || null,
    is_lifetime_access: data.step4.is_lifetime_access || false,
    access_duration_days: data.step4.access_duration_days || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "course_id" });

  // 5. Upsert pricing
  await supabase.from("course_pricing").upsert({
    course_id: id,
    course_fee: data.step5.course_fee,
    admission_fee: data.step5.admission_fee,
    monthly_fee: data.step5.monthly_fee,
    is_free: data.step5.is_free,
    discount_percent: data.step5.discount_percent,
    installment_available: data.step5.installment_available,
    certificate_option: data.step5.certificate_option,
    certificate_fee: data.step5.certificate_fee,
    updated_at: new Date().toISOString(),
  }, { onConflict: "course_id" });

  revalidatePath("/admin/courses");
  revalidatePath("/");
  revalidatePath("/courses");

  return { success: true };
}

// ===== TOGGLE FEATURED =====
export async function toggleCourseFeatured(id: string, current: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("courses").update({ is_featured: !current }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/courses");
  revalidatePath("/");
  return { success: true };
}

// ===== TOGGLE POPULAR =====
export async function toggleCoursePopular(id: string, current: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("courses").update({ is_popular: !current }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/courses");
  return { success: true };
}

// ===== TOGGLE STATUS =====
export async function toggleCourseStatus(id: string, status: "draft" | "published" | "archived") {
  const supabase = await createClient();
  const { error } = await supabase.from("courses").update({
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/courses");
  revalidatePath("/");
  return { success: true };
}

// ===== DUPLICATE COURSE =====
export async function duplicateCourse(id: string) {
  const supabase = await createClient();
  const original = await getCourseById(id);
  if (!original) return { error: "Course not found" };

  const translations: any[] = original.translations || [];
  const enT = translations.find((t: any) => t.lang === "en");
  const bnT = translations.find((t: any) => t.lang === "bn");

  const newCode = generateCourseCode(enT?.name || "COPY");

  const { data: newCourse, error } = await supabase
    .from("courses")
    .insert({ ...original, id: undefined, course_code: newCode, status: "draft", published_at: null, created_at: undefined, updated_at: undefined })
    .select()
    .single();

  if (error) return { error: error.message };

  if (enT) {
    await supabase.from("course_translations").insert({
      ...enT, id: undefined, course_id: newCourse.id,
      name: `${enT.name} (Copy)`,
      slug: `${enT.slug}-copy-${Date.now()}`,
    });
  }
  if (bnT) {
    await supabase.from("course_translations").insert({
      ...bnT, id: undefined, course_id: newCourse.id,
      name: `${bnT.name} (কপি)`,
      slug: `${bnT.slug}-copy-${Date.now()}`,
    });
  }

  revalidatePath("/admin/courses");
  return { success: true, newId: newCourse.id };
}

// ===== DELETE COURSE =====
export async function deleteCourse(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) return { error: `Failed to delete: ${error.message}` };
  revalidatePath("/admin/courses");
  revalidatePath("/");
  return { success: true };
}
