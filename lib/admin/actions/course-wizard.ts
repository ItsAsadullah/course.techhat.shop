"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/admin/supabase/server";
import {
  courseWizardSchemaV2,
  defaultCourseFormValues,
  type CourseFormValues,
} from "@/lib/schema/course-wizard.schema";
import { computeSeoScore } from "@/lib/seo/score";

// ===================== helpers =====================

function generateCourseCode(nameEn: string): string {
  const base = (nameEn || "course").toUpperCase().replace(/[^A-Z0-9 ]/g, "");
  const prefix =
    base
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 4) || "CRS";
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${suffix}`;
}

function slugify(input: string): string {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ঀ-৿\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Serialize a string[] to a JSON string for TEXT columns (null when empty). */
function jsonArray(arr?: string[] | null): string | null {
  if (!arr || arr.length === 0) return null;
  const clean = arr.map((s) => (s ?? "").trim()).filter(Boolean);
  return clean.length ? JSON.stringify(clean) : null;
}

function jsonObjectArray(arr?: any[] | null): string | null {
  if (!arr || arr.length === 0) return null;
  return JSON.stringify(arr);
}

function jsonObject(input?: string | null): unknown | null {
  if (!input?.trim()) return null;
  try {
    return JSON.parse(input);
  } catch {
    return input;
  }
}

function nullIfEmpty<T>(value: T | "" | null | undefined): T | null {
  return value === "" || value === undefined ? null : value;
}

async function requireAdmin(noCookieUpdate = false) {
  const supabase = await createClient(noCookieUpdate);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== "admin") {
    return { supabase, error: "Unauthorized" as const };
  }
  return { supabase, user, error: null };
}

// ===================== CREATE DRAFT =====================
// Creates a minimal published-later course so the wizard has a
// stable id to autosave against (Udemy pattern).
export async function createCourseDraft() {
  const { supabase, user, error } = await requireAdmin(true);
  if (error) return { error };

  const courseCode = generateCourseCode("New Course");

  const { data: course, error: cErr } = await supabase
    .from("courses")
    .insert({
      course_code: courseCode,
      course_type: "offline",
      course_level: "beginner",
      status: "draft",
      visibility: "public",
      author_id: user?.id ?? null,
    })
    .select("id, course_code")
    .single();

  if (cErr || !course) return { error: `Failed to create draft: ${cErr?.message}` };

  const id = course.id as string;
  const suffix = id.slice(0, 8);

  // Seed the two translation rows with unique placeholder slugs.
  const { error: tErr } = await supabase.from("course_translations").insert([
    { course_id: id, lang: "en", name: "Untitled course", slug: `draft-${suffix}` },
    { course_id: id, lang: "bn", name: "শিরোনামহীন কোর্স", slug: `khosra-${suffix}` },
  ]);
  if (tErr) return { error: `Failed to seed translations: ${tErr.message}` };

  // Ensure satellite rows exist for clean upserts later.
  await supabase.from("course_settings").upsert({ course_id: id }, { onConflict: "course_id" });
  await supabase.from("course_seo").insert([
    { course_id: id, lang: "en" },
    { course_id: id, lang: "bn" },
  ]);

  return { success: true, courseId: id, courseCode: course.course_code as string };
}

// ===================== SAVE (autosave + manual) =====================
export async function saveCourse(id: string, values: CourseFormValues) {
  const { supabase, error } = await requireAdmin(true);
  if (error) return { error };

  const g = values.general;
  const c = values.content;

  // 1) main course row (never flips to published here — that's publishCourse)
  await supabase
    .from("courses")
    .update({
      category_id: g.category_id || null,
      sub_category_id: g.sub_category_id || null,
      course_type: g.course_type,
      course_level: g.course_level,
      visibility: g.visibility,
      password_hash: g.visibility === "password" ? g.password || null : null,
      is_featured: values.homepage.is_featured,
      is_popular: values.homepage.is_popular,
      is_trending: values.homepage.is_trending,
      is_new: values.homepage.is_new,
      is_recommended: values.homepage.is_recommended,
      sort_order: values.homepage.homepage_order,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  // 2) translations (content core, no slug — slug handled separately to avoid unique clashes)
  for (const lang of ["en", "bn"] as const) {
    const isEn = lang === "en";
    await supabase
      .from("course_translations")
      .update({
        name: isEn ? g.name_en : g.name_bn,
        short_description: isEn ? c.short_description_en : c.short_description_bn,
        long_description: isEn ? c.long_description_en : c.long_description_bn,
        learning_outcomes: jsonArray(isEn ? c.learning_outcomes_en : c.learning_outcomes_bn),
        requirements: jsonArray(isEn ? c.requirements_en : c.requirements_bn),
        who_should_join: jsonArray(isEn ? c.who_should_join_en : c.who_should_join_bn),
        benefits: jsonArray(isEn ? c.benefits_en : c.benefits_bn),
        career_opportunities: jsonArray(isEn ? c.career_opportunities_en : c.career_opportunities_bn),
        skills_covered: jsonObjectArray(isEn ? c.skills_en : c.skills_bn),
        software_used: jsonObjectArray(isEn ? c.software_used_en : c.software_used_bn),
        projects: jsonArray(isEn ? c.projects_en : c.projects_bn),
        target_audience: (isEn ? c.target_audience_en : c.target_audience_bn) || null,
        updated_at: new Date().toISOString(),
      })
      .eq("course_id", id)
      .eq("lang", lang);

    // slug (best-effort; ignore unique conflicts so autosave never breaks)
    const slug = slugify(isEn ? g.slug_en : g.slug_bn);
    if (slug) {
      const { error: slugErr } = await supabase
        .from("course_translations")
        .update({ slug })
        .eq("course_id", id)
        .eq("lang", lang);
      if (slugErr && slugErr.code !== "23505") {
        // non-unique error — surface but don't abort the whole save
        console.error("slug update:", slugErr.message);
      }
    }
  }

  // 3) SEO rows (+ computed scores)
  for (const lang of ["en", "bn"] as const) {
    const s = values.seo[lang];
    const density = computeSeoScore({
      metaTitle: s.meta_title,
      metaDescription: s.meta_description,
      slug: lang === "en" ? g.slug_en : g.slug_bn,
      focusKeyword: s.focus_keyword,
      content: (lang === "en" ? c.long_description_en : c.long_description_bn) || "",
    });
    await supabase.from("course_seo").upsert(
      {
        course_id: id,
        lang,
        meta_title: s.meta_title || null,
        meta_description: s.meta_description || null,
        meta_keywords: s.meta_keywords || null,
        focus_keyword: s.focus_keyword || null,
        canonical_url: s.canonical_url || null,
        og_title: s.og_title || null,
        og_description: s.og_description || null,
        og_image_url: s.og_image_url || null,
        twitter_card: s.twitter_card,
        robots_index: s.robots_index,
        schema_type: s.schema_type,
        seo_score: density.score,
        readability_score: density.readability,
        keyword_density: density.keywordDensity,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "course_id,lang" }
    );
  }

  // 4) FAQs (replace)
  await supabase.from("course_faq").delete().eq("course_id", id);
  const faqRows = (c.faqs || [])
    .filter((f) => f.question_en?.trim() || f.question_bn?.trim())
    .map((f, i) => ({
      course_id: id,
      question_en: f.question_en || "",
      question_bn: f.question_bn || "",
      answer_en: f.answer_en || "",
      answer_bn: f.answer_bn || "",
      sort_order: i,
    }));
  if (faqRows.length) await supabase.from("course_faq").insert(faqRows);

  // 5) Tags (global upsert + M:N map replace)
  const tagNames = Array.from(new Set((g.tags || []).map((t) => t.trim()).filter(Boolean)));
  await supabase.from("course_tag_map").delete().eq("course_id", id);
  if (tagNames.length) {
    const tagRows = tagNames.map((name) => ({ slug: slugify(name) || name, name_en: name, name_bn: name }));
    await supabase.from("course_tags").upsert(tagRows, { onConflict: "slug", ignoreDuplicates: false });
    const { data: tags } = await supabase
      .from("course_tags")
      .select("id, slug")
      .in(
        "slug",
        tagRows.map((t) => t.slug)
      );
    if (tags?.length) {
      await supabase
        .from("course_tag_map")
        .insert(tags.map((t) => ({ course_id: id, tag_id: t.id })));
    }
  }

  // 6) Testimonials -> course_reviews (replace testimonial rows)
  await supabase.from("course_reviews").delete().eq("course_id", id).eq("is_testimonial", true);
  const testimonialRows = (c.testimonials || [])
    .filter((t) => t.author_name?.trim() && (t.body_en?.trim() || t.body_bn?.trim()))
    .map((t) => ({
      course_id: id,
      author_name: t.author_name,
      author_image_url: t.author_image_url || null,
      rating: t.rating || 5,
      body: t.body_en || t.body_bn || "",
      is_testimonial: true,
      is_approved: true,
      is_featured: true,
    }));
  if (testimonialRows.length) await supabase.from("course_reviews").insert(testimonialRows);

  // 7) Media
  const m = values.media;
  await supabase.from("course_media").upsert(
    {
      course_id: id,
      thumbnail_url: m.thumbnail_url || null,
      banner_url: m.banner_url || null,
      gallery_urls: jsonArray(m.gallery_urls),
      intro_video_type: m.intro_video_type || null,
      intro_video_url: m.intro_video_url || null,
      demo_video_url: m.demo_video_url || null,
      preview_video_url: m.preview_video_url || null,
      preview_pdf_url: m.preview_pdf_url || null,
      brochure_pdf_url: m.brochure_pdf_url || null,
      course_pdf_url: m.course_pdf_url || null,
      certificate_sample_url: m.certificate_sample_url || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "course_id" }
  );

  // 7b) Features
  if (c.features) {
    await supabase.from("course_features").upsert({
      course_id: id,
      has_certificate: c.features.has_certificate,
      has_lifetime_support: c.features.has_lifetime_support,
      has_community_access: c.features.has_community_access,
      has_private_group: c.features.has_private_group,
      has_live_qa: c.features.has_live_qa,
      has_projects: c.features.has_projects,
      has_assignments: c.features.has_assignments,
      has_exam: c.features.has_exam,
      has_final_project: c.features.has_final_project,
      has_job_guideline: c.features.has_job_guideline,
      has_internship_support: c.features.has_internship_support,
      has_career_support: c.features.has_career_support,
      has_freelancing_guide: c.features.has_freelancing_guide,
      has_cv_review: c.features.has_cv_review,
      has_portfolio_review: c.features.has_portfolio_review,
    }, { onConflict: "course_id" });
  }

  const s = values.schedule;
  await supabase.from("course_duration").upsert(
    {
      course_id: id,
      session: s.session || null,
      class_days: jsonArray(s.class_days),
      class_time_start: nullIfEmpty(s.class_time_start),
      class_time_end: nullIfEmpty(s.class_time_end),
      start_date: nullIfEmpty(s.start_date),
      end_date: nullIfEmpty(s.end_date),
      admission_deadline: nullIfEmpty(s.admission_deadline),
      application_deadline: nullIfEmpty(s.application_deadline),
      orientation_date: nullIfEmpty(s.orientation_date),
      total_classes: s.total_classes || null,
      total_hours: s.total_hours || null,
      duration_text_en: s.duration_text_en || null,
      duration_text_bn: s.duration_text_bn || null,
      is_lifetime_access: s.is_lifetime_access,
      access_duration_days: s.access_duration_days || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "course_id" }
  );
  const batchRows = (s.batches || [])
    .filter((b) => b.name_en?.trim() || b.name_bn?.trim() || b.start_date)
    .map((b, i) => ({
      id: b.id || null,
      shift_id: b.shift_id || null,
      name_en: b.name_en || null,
      name_bn: b.name_bn || null,
      session: b.session || null,
      start_date: nullIfEmpty(b.start_date),
      end_date: nullIfEmpty(b.end_date),
      admission_deadline: nullIfEmpty(b.admission_deadline),
      orientation_date: nullIfEmpty(b.orientation_date),
      class_days: jsonArray(b.class_days),
      class_time_start: nullIfEmpty(b.class_time_start),
      class_time_end: nullIfEmpty(b.class_time_end),
      room: b.room || null,
      seat_limit: b.seat_limit || null,
      waitlist_enabled: b.waitlist_enabled,
      access_type: b.access_type,
      access_duration_days: b.access_duration_days || null,
      release_date: nullIfEmpty(b.release_date),
      drip_enabled: b.drip_enabled,
      status: b.status,
      sort_order: i,
    }));
  
  if (batchRows.length > 0) {
    const { error: batchErr } = await supabase.rpc("safe_sync_course_batches", {
      p_course_id: id,
      p_batches: batchRows,
    });
    if (batchErr) {
      console.error("Batch sync error:", batchErr);
    }
  } else {
    // If empty, delete all those with no enrollments
    await supabase.rpc("safe_sync_course_batches", { p_course_id: id, p_batches: [] });
  }

  const p = values.pricing;
  await supabase.from("course_pricing").upsert(
    {
      course_id: id,
      course_fee: p.is_free ? 0 : p.course_fee,
      admission_fee: p.admission_fee,
      monthly_fee: p.monthly_fee,
      is_free: p.is_free,
      discount_amount: p.discount_amount,
      discount_percent: p.discount_percent,
      discount_fee: p.discount_fee,
      offer_start: nullIfEmpty(p.offer_start),
      offer_end: nullIfEmpty(p.offer_end),
      scholarship_available: p.scholarship_available,
      installment_available: p.installment_available,
      installment_count: p.installment_count,
      coupon_support: p.coupon_support,
      certificate_option: p.certificate_option,
      certificate_fee: p.certificate_fee,
      board_registration_fee: p.board_registration_fee,
      board_certificate_fee: p.board_certificate_fee,
      institute_certificate_fee: p.institute_certificate_fee,
      supports_board_certificate: p.supports_board_certificate,
      board_registration_required: p.board_registration_required,
      currency: p.currency || "BDT",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "course_id" }
  );

  await supabase.from("course_modules").delete().eq("course_id", id);
  for (const [moduleIndex, module] of (values.curriculum.modules || []).entries()) {
    const lessonRows = (module.lessons || [])
      .filter(
        (lesson) =>
          lesson.title_en?.trim() ||
          lesson.title_bn?.trim() ||
          lesson.video_url?.trim() ||
          lesson.content_url?.trim()
      )
      .map((lesson, lessonIndex) => ({
        title_en: lesson.title_en || null,
        title_bn: lesson.title_bn || null,
        lesson_type: lesson.lesson_type,
        content_url: lesson.content_url || null,
        video_url: lesson.video_url || null,
        duration_minutes: lesson.duration_minutes || 0,
        is_preview: lesson.is_preview,
        is_locked: lesson.is_locked,
        sort_order: lessonIndex,
      }));

    if (!module.title_en?.trim() && !module.title_bn?.trim() && lessonRows.length === 0) continue;
    const { data: moduleRow } = await supabase
      .from("course_modules")
      .insert({
        course_id: id,
        title_en: module.title_en || null,
        title_bn: module.title_bn || null,
        description_en: module.description_en || null,
        description_bn: module.description_bn || null,
        estimated_minutes: module.estimated_minutes || 0,
        sort_order: moduleIndex,
      })
      .select("id")
      .single();
    if (!moduleRow) continue;
    const lessons = lessonRows.map((lesson) => ({ ...lesson, module_id: moduleRow.id }));
    if (lessons.length) await supabase.from("course_lessons").insert(lessons);
  }

  await supabase.from("course_trainer_map").delete().eq("course_id", id);
  for (const [trainerIndex, trainer] of (values.trainers.trainers || []).entries()) {
    if (!trainer.name_en?.trim() && !trainer.name_bn?.trim()) continue;
    const trainerSlug = slugify(trainer.slug || trainer.name_en || trainer.name_bn || `trainer-${trainerIndex}`);
    await supabase.from("course_trainers").upsert(
      {
        slug: trainerSlug,
        name_en: trainer.name_en || trainer.name_bn || "Trainer",
        name_bn: trainer.name_bn || null,
        designation_en: trainer.designation_en || null,
        designation_bn: trainer.designation_bn || null,
        bio_en: trainer.bio_en || null,
        bio_bn: trainer.bio_bn || null,
        image_url: trainer.image_url || null,
        expertise: jsonArray(trainer.expertise),
        facebook_url: trainer.facebook_url || null,
        linkedin_url: trainer.linkedin_url || null,
        website_url: trainer.website_url || null,
      },
      { onConflict: "slug" }
    );
    const { data: trainerRow } = await supabase.from("course_trainers").select("id").eq("slug", trainerSlug).single();
    if (trainerRow) {
      await supabase.from("course_trainer_map").insert({
        course_id: id,
        trainer_id: trainerRow.id,
        role: trainer.role,
        sort_order: trainerIndex,
      });
    }
  }

  await supabase.from("course_settings").upsert(
    { course_id: id, ...values.homepage, updated_at: new Date().toISOString() },
    { onConflict: "course_id" }
  );
  await supabase.from("course_schema").upsert(
    {
      course_id: id,
      auto_generate: values.search.auto_generate,
      enable_course: values.search.enable_course,
      enable_breadcrumb: values.search.enable_breadcrumb,
      enable_faq: values.search.enable_faq,
      enable_organization: values.search.enable_organization,
      manual_jsonld: jsonObject(values.search.manual_jsonld),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "course_id" }
  );
  await supabase.from("course_analytics").upsert(
    {
      course_id: id,
      ga4_measurement_id: values.analytics.ga4_measurement_id || null,
      fb_pixel_id: values.analytics.fb_pixel_id || null,
      event_config: jsonObject(values.analytics.event_config),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "course_id" }
  );

  revalidatePath("/");
  revalidatePath("/courses");
  if (g.slug_en) revalidatePath(`/courses/${g.slug_en}`);
  if (g.slug_bn) revalidatePath(`/courses/${g.slug_bn}`);

  return { success: true, savedAt: Date.now() };
}

// ===================== PUBLISH =====================
export async function publishCourse(id: string, values?: CourseFormValues) {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  if (values) {
    // Validate the full form before going live.
    const parsed = courseWizardSchemaV2.safeParse(values);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { error: `Cannot publish: ${first?.message ?? "validation failed"}` };
    }
    const saved = await saveCourse(id, parsed.data);
    if ("error" in saved && saved.error) return saved;
  }

  const { error: pErr } = await supabase
    .from("courses")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (pErr) return { error: pErr.message };

  revalidatePath("/admin/courses");
  revalidatePath("/");
  revalidatePath("/courses");
  return { success: true };
}

// ===================== SET STATUS (draft/archived) =====================
export async function setCourseStatus(id: string, status: "draft" | "archived") {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };
  const { error: e } = await supabase
    .from("courses")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (e) return { error: e.message };
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { success: true };
}

// ===================== LOAD FOR EDIT =====================
export async function getCourseForEdit(
  id: string
): Promise<{ values: CourseFormValues; status: string; courseCode: string } | null> {
  const { supabase, error } = await requireAdmin();
  if (error) return null;

  const { data, error: qErr } = await supabase
    .from("courses")
    .select(
      `*,
       translations:course_translations(*),
       seo:course_seo(*),
       faqs:course_faq(*),
       reviews:course_reviews(*),
       tag_map:course_tag_map(tag:course_tags(name_en)),
       media:course_media(*),
       duration:course_duration(*),
       pricing:course_pricing(*),
       settings:course_settings(*),
       schema:course_schema(*),
       batches:course_batches(*),
       modules:course_modules(*, lessons:course_lessons(*)),
       trainer_map:course_trainer_map(role, sort_order, trainer:course_trainers(*)),
       analytics:course_analytics(*),
       features:course_features(*)`
    )
    .eq("id", id)
    .single();

  if (qErr || !data) {
    console.error("GET COURSE FOR EDIT ERROR:", qErr);
    return null;
  }

  const parseArr = (v: unknown): string[] => {
    if (Array.isArray(v)) return v as string[];
    if (typeof v === "string" && v.trim()) {
      try {
        const p = JSON.parse(v);
        return Array.isArray(p) ? p : v.split("\n").filter(Boolean);
      } catch {
        return v.split("\n").filter(Boolean);
      }
    }
    return [];
  };

  const parseObjArr = (v: unknown): any[] => {
    let arr: any[] = [];
    if (Array.isArray(v)) {
      arr = v;
    } else if (typeof v === "string" && v.trim()) {
      try {
        const p = JSON.parse(v);
        if (Array.isArray(p)) arr = p;
      } catch {
        arr = [];
      }
    }
    return arr.map(item => {
      if (typeof item === "string") {
        return { name: item, image_url: "" };
      }
      return item;
    });
  };

  // DB DATE/TIMESTAMPTZ -> "YYYY-MM-DD" for <input type="date">
  const toDate = (v: unknown): string => {
    if (!v) return "";
    const s = String(v);
    return s.length >= 10 ? s.slice(0, 10) : s;
  };
  // DB TIME ("HH:MM:SS") -> "HH:MM" for <input type="time">
  const toTime = (v: unknown): string => {
    if (!v) return "";
    const s = String(v);
    return s.length >= 5 ? s.slice(0, 5) : s;
  };
  // JSONB object -> pretty string for the manual-override textareas
  const toJsonText = (v: unknown): string => {
    if (v == null || v === "") return "";
    if (typeof v === "string") return v;
    try {
      return JSON.stringify(v, null, 2);
    } catch {
      return "";
    }
  };
  const num = (v: unknown, fallback = 0): number =>
    v == null || v === "" || Number.isNaN(Number(v)) ? fallback : Number(v);

  const extract1to1 = (val: any) => (Array.isArray(val) ? val[0] : val) || {};
  const media0: any = extract1to1(data.media);
  const dur0: any = extract1to1(data.duration);
  const pricing0: any = extract1to1(data.pricing);
  const settings0: any = extract1to1(data.settings);
  const schema0: any = extract1to1(data.schema);
  const analytics0: any = extract1to1(data.analytics);
  const features0: any = extract1to1(data.features);

  const translations: any[] = data.translations || [];
  const en = translations.find((t) => t.lang === "en") || {};
  const bn = translations.find((t) => t.lang === "bn") || {};
  const seoRows: any[] = data.seo || [];
  const seoEn = seoRows.find((s) => s.lang === "en") || {};
  const seoBn = seoRows.find((s) => s.lang === "bn") || {};
  const tags: string[] = (data.tag_map || [])
    .map((m: any) => m.tag?.name_en)
    .filter(Boolean);
  const testimonials = (data.reviews || [])
    .filter((r: any) => r.is_testimonial)
    .map((r: any) => ({
      author_name: r.author_name || "",
      author_image_url: r.author_image_url || "",
      rating: r.rating || 5,
      body_en: r.body || "",
      body_bn: "",
    }));

  const seoOf = (row: any) => ({
    meta_title: row.meta_title || "",
    meta_description: row.meta_description || "",
    meta_keywords: row.meta_keywords || "",
    focus_keyword: row.focus_keyword || "",
    canonical_url: row.canonical_url || "",
    og_title: row.og_title || "",
    og_description: row.og_description || "",
    og_image_url: row.og_image_url || "",
    twitter_card: row.twitter_card || "summary_large_image",
    robots_index: row.robots_index ?? true,
    schema_type: row.schema_type || "Course",
  });

  const values: CourseFormValues = {
    general: {
      name_en: en.name && en.name !== "Untitled course" ? en.name : "",
      name_bn: bn.name && bn.name !== "শিরোনামহীন কোর্স" ? bn.name : "",
      slug_en: en.slug?.startsWith("draft-") ? "" : en.slug || "",
      slug_bn: bn.slug?.startsWith("khosra-") ? "" : bn.slug || "",
      course_code: data.course_code || "",
      category_id: data.category_id || "",
      sub_category_id: data.sub_category_id || "",
      tags,
      course_type: data.course_type || "offline",
      course_level: data.course_level || "beginner",
      status: data.status || "draft",
      visibility: data.visibility || "public",
      password: "",
    },
    content: {
      short_description_en: en.short_description || "",
      short_description_bn: bn.short_description || "",
      long_description_en: en.long_description || "",
      long_description_bn: bn.long_description || "",
      learning_outcomes_en: parseArr(en.learning_outcomes),
      learning_outcomes_bn: parseArr(bn.learning_outcomes),
      benefits_en: parseArr(en.benefits),
      benefits_bn: parseArr(bn.benefits),
      requirements_en: parseArr(en.requirements),
      requirements_bn: parseArr(bn.requirements),
      who_should_join_en: parseArr(en.who_should_join),
      who_should_join_bn: parseArr(bn.who_should_join),
      career_opportunities_en: parseArr(en.career_opportunities),
      career_opportunities_bn: parseArr(bn.career_opportunities),
      skills_en: parseObjArr(en.skills_covered),
      skills_bn: parseObjArr(bn.skills_covered),
      software_used_en: parseObjArr(en.software_used),
      software_used_bn: parseObjArr(bn.software_used),
      projects_en: parseArr(en.projects),
      projects_bn: parseArr(bn.projects),
      target_audience_en: en.target_audience || "",
      target_audience_bn: bn.target_audience || "",
      faqs: (data.faqs || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((f: any) => ({
          question_en: f.question_en || "",
          question_bn: f.question_bn || "",
          answer_en: f.answer_en || "",
          answer_bn: f.answer_bn || "",
        })),
      testimonials,
      features: {
        has_certificate: features0.has_certificate ?? false,
        has_lifetime_support: features0.has_lifetime_support ?? false,
        has_community_access: features0.has_community_access ?? false,
        has_private_group: features0.has_private_group ?? false,
        has_live_qa: features0.has_live_qa ?? false,
        has_projects: features0.has_projects ?? false,
        has_assignments: features0.has_assignments ?? false,
        has_exam: features0.has_exam ?? false,
        has_final_project: features0.has_final_project ?? false,
        has_job_guideline: features0.has_job_guideline ?? false,
        has_internship_support: features0.has_internship_support ?? false,
        has_career_support: features0.has_career_support ?? false,
        has_freelancing_guide: features0.has_freelancing_guide ?? false,
        has_cv_review: features0.has_cv_review ?? false,
        has_portfolio_review: features0.has_portfolio_review ?? false,
      },
    },
    seo: { en: seoOf(seoEn), bn: seoOf(seoBn) },

    media: {
      thumbnail_url: media0.thumbnail_url || "",
      banner_url: media0.banner_url || "",
      gallery_urls: parseArr(media0.gallery_urls),
      intro_video_type: media0.intro_video_type || "youtube",
      intro_video_url: media0.intro_video_url || "",
      demo_video_url: media0.demo_video_url || "",
      preview_video_url: media0.preview_video_url || "",
      preview_pdf_url: media0.preview_pdf_url || "",
      brochure_pdf_url: media0.brochure_pdf_url || "",
      course_pdf_url: media0.course_pdf_url || "",
      certificate_sample_url: media0.certificate_sample_url || "",
    },

    schedule: {
      duration_text_en: dur0.duration_text_en || "",
      duration_text_bn: dur0.duration_text_bn || "",
      session: dur0.session || "morning",
      class_days: parseArr(dur0.class_days),
      class_time_start: toTime(dur0.class_time_start),
      class_time_end: toTime(dur0.class_time_end),
      start_date: toDate(dur0.start_date),
      end_date: toDate(dur0.end_date),
      admission_deadline: toDate(dur0.admission_deadline),
      application_deadline: toDate(dur0.application_deadline),
      orientation_date: toDate(dur0.orientation_date),
      total_classes: num(dur0.total_classes),
      total_hours: num(dur0.total_hours),
      is_lifetime_access: dur0.is_lifetime_access ?? false,
      access_duration_days: num(dur0.access_duration_days),
      batches: (data.batches || [])
        .slice()
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((b: any) => ({
          id: b.id || "",
          shift_id: b.shift_id || "",
          name_en: b.name_en || "",
          name_bn: b.name_bn || "",
          session: b.session || "morning",
          start_date: toDate(b.start_date),
          end_date: toDate(b.end_date),
          admission_deadline: toDate(b.admission_deadline),
          orientation_date: toDate(b.orientation_date),
          class_days: parseArr(b.class_days),
          class_time_start: toTime(b.class_time_start),
          class_time_end: toTime(b.class_time_end),
          room: b.room || "",
          seat_limit: num(b.seat_limit),
          waitlist_enabled: b.waitlist_enabled ?? false,
          access_type: b.access_type || "lifetime",
          access_duration_days: num(b.access_duration_days),
          release_date: toDate(b.release_date),
          drip_enabled: b.drip_enabled ?? false,
          status: b.status || "upcoming",
        })),
    },

    pricing: {
      course_fee: num(pricing0.course_fee),
      admission_fee: num(pricing0.admission_fee),
      monthly_fee: num(pricing0.monthly_fee),
      is_free: pricing0.is_free ?? false,
      discount_amount: num(pricing0.discount_amount),
      discount_percent: num(pricing0.discount_percent),
      discount_fee: num(pricing0.discount_fee),
      offer_start: toDate(pricing0.offer_start),
      offer_end: toDate(pricing0.offer_end),
      scholarship_available: pricing0.scholarship_available ?? false,
      installment_available: pricing0.installment_available ?? false,
      installment_count: num(pricing0.installment_count),
      coupon_support: pricing0.coupon_support ?? false,
      certificate_option: pricing0.certificate_option || "included",
      certificate_fee: num(pricing0.certificate_fee),
      board_registration_fee: num(pricing0.board_registration_fee),
      board_certificate_fee: num(pricing0.board_certificate_fee),
      institute_certificate_fee: num(pricing0.institute_certificate_fee),
      supports_board_certificate: pricing0.supports_board_certificate ?? false,
      board_registration_required: pricing0.board_registration_required ?? false,
      currency: pricing0.currency || "BDT",
    },

    curriculum: {
      modules: (data.modules || [])
        .slice()
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((m: any) => ({
          title_en: m.title_en || "",
          title_bn: m.title_bn || "",
          description_en: m.description_en || "",
          description_bn: m.description_bn || "",
          estimated_minutes: num(m.estimated_minutes),
          lessons: (m.lessons || [])
            .slice()
            .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((l: any) => ({
              title_en: l.title_en || "",
              title_bn: l.title_bn || "",
              lesson_type: l.lesson_type || "video",
              content_url: l.content_url || "",
              video_url: l.video_url || "",
              duration_minutes: num(l.duration_minutes),
              is_preview: l.is_preview ?? false,
              is_locked: l.is_locked ?? true,
            })),
        })),
    },

    trainers: {
      trainers: (data.trainer_map || [])
        .slice()
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((tm: any) => {
          const tr = tm.trainer || {};
          return {
            slug: tr.slug || "",
            name_en: tr.name_en || "",
            name_bn: tr.name_bn || "",
            designation_en: tr.designation_en || "",
            designation_bn: tr.designation_bn || "",
            bio_en: tr.bio_en || "",
            bio_bn: tr.bio_bn || "",
            image_url: tr.image_url || "",
            expertise: parseArr(tr.expertise),
            facebook_url: tr.facebook_url || "",
            linkedin_url: tr.linkedin_url || "",
            website_url: tr.website_url || "",
            role: tm.role || "trainer",
          };
        }),
    },

    homepage: {
      is_featured: settings0.is_featured ?? false,
      is_popular: settings0.is_popular ?? false,
      is_trending: settings0.is_trending ?? false,
      is_new: settings0.is_new ?? true,
      is_recommended: settings0.is_recommended ?? false,
      homepage_visible: settings0.homepage_visible ?? true,
      homepage_order: num(settings0.homepage_order),
      show_in_slider: settings0.show_in_slider ?? false,
      show_in_category: settings0.show_in_category ?? true,
      hero_banner: settings0.hero_banner ?? false,
    },

    search: {
      auto_generate: schema0.auto_generate ?? true,
      enable_course: schema0.enable_course ?? true,
      enable_breadcrumb: schema0.enable_breadcrumb ?? true,
      enable_faq: schema0.enable_faq ?? true,
      enable_organization: schema0.enable_organization ?? true,
      manual_jsonld: toJsonText(schema0.manual_jsonld),
    },

    analytics: {
      ga4_measurement_id: analytics0.ga4_measurement_id || "",
      fb_pixel_id: analytics0.fb_pixel_id || "",
      event_config: toJsonText(analytics0.event_config),
    },
  };

  // Fill any missing keys with defaults (schema evolution safety).
  const merged: CourseFormValues = {
    general: { ...defaultCourseFormValues.general, ...values.general },
    content: { ...defaultCourseFormValues.content, ...values.content },
    seo: {
      en: { ...defaultCourseFormValues.seo.en, ...values.seo.en },
      bn: { ...defaultCourseFormValues.seo.bn, ...values.seo.bn },
    },
    media: { ...defaultCourseFormValues.media, ...values.media },
    schedule: { ...defaultCourseFormValues.schedule, ...values.schedule },
    pricing: { ...defaultCourseFormValues.pricing, ...values.pricing },
    curriculum: { ...defaultCourseFormValues.curriculum, ...values.curriculum },
    trainers: { ...defaultCourseFormValues.trainers, ...values.trainers },
    homepage: { ...defaultCourseFormValues.homepage, ...values.homepage },
    search: { ...defaultCourseFormValues.search, ...values.search },
    analytics: { ...defaultCourseFormValues.analytics, ...values.analytics },
  };

  return { values: merged, status: data.status || "draft", courseCode: data.course_code || "" };
}
