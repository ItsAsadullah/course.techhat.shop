import { z } from "zod";

// ===== STEP 1: Basic Information =====
export const step1Schema = z.object({
  name_en: z.string().min(3, "Course name (EN) is required"),
  name_bn: z.string().min(3, "কোর্সের নাম (BN) আবশ্যিক"),
  slug_en: z.string().min(3, "Slug (EN) is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens"),
  slug_bn: z.string().min(3, "স্লাগ (BN) আবশ্যিক"),
  course_code: z.string().min(2, "Course code is required"),
  category_id: z.string().uuid("Please select a valid category"),
  sub_category_id: z.string().uuid().optional().or(z.literal("")),
  course_type: z.enum(["offline", "online", "hybrid", "workshop", "seminar", "bootcamp", "live_class", "recorded"]),
  course_level: z.enum(["beginner", "intermediate", "advanced", "all_levels"]),
  is_featured: z.boolean().default(false),
  is_popular: z.boolean().default(false),
  is_trending: z.boolean().default(false),
  is_new: z.boolean().default(true),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

// ===== STEP 2: Course Information =====
export const step2Schema = z.object({
  short_description_en: z.string().min(20, "Short description (EN) must be at least 20 characters"),
  short_description_bn: z.string().min(20, "সংক্ষিপ্ত বিবরণ (BN) কমপক্ষে ২০ অক্ষর হতে হবে"),
  long_description_en: z.string().optional().default(""),
  long_description_bn: z.string().optional().default(""),
  objectives_en: z.string().optional().default(""),
  objectives_bn: z.string().optional().default(""),
  learning_outcomes_en: z.string().optional().default(""),
  learning_outcomes_bn: z.string().optional().default(""),
  benefits_en: z.string().optional().default(""),
  benefits_bn: z.string().optional().default(""),
  who_should_join_en: z.string().optional().default(""),
  who_should_join_bn: z.string().optional().default(""),
  requirements_en: z.string().optional().default(""),
  requirements_bn: z.string().optional().default(""),
  skills_covered_en: z.string().optional().default(""),
  skills_covered_bn: z.string().optional().default(""),
  career_opportunities_en: z.string().optional().default(""),
  career_opportunities_bn: z.string().optional().default(""),
});

// ===== STEP 3: Media =====
export const step3Schema = z.object({
  thumbnail_url: z.string().url().optional().or(z.literal("")),
  banner_url: z.string().url().optional().or(z.literal("")),
  intro_video_type: z.enum(["youtube", "vimeo", "direct"]).optional(),
  intro_video_url: z.string().optional().default(""),
  demo_video_url: z.string().optional().default(""),
  brochure_pdf_url: z.string().optional().default(""),
});

// ===== STEP 4: Duration =====
export const step4Schema = z.object({
  duration_text_en: z.string().min(1, "Duration is required"),
  duration_text_bn: z.string().min(1, "সময়কাল আবশ্যিক"),
  // Offline
  session: z.enum(["morning", "evening", "weekend", "custom"]).optional(),
  class_days: z.array(z.string()).optional().default([]),
  class_time_start: z.string().optional().default(""),
  class_time_end: z.string().optional().default(""),
  start_date: z.string().optional().default(""),
  end_date: z.string().optional().default(""),
  admission_deadline: z.string().optional().default(""),
  total_classes: z.coerce.number().int().min(0).optional(),
  total_hours: z.coerce.number().int().min(0).optional(),
  // Online
  is_lifetime_access: z.boolean().default(false),
  access_duration_days: z.coerce.number().int().min(0).optional(),
});

// ===== STEP 5: Pricing =====
export const step5Schema = z.object({
  course_fee: z.coerce.number().min(0, "Course fee must be 0 or more"),
  admission_fee: z.coerce.number().min(0).default(0),
  monthly_fee: z.coerce.number().min(0).default(0),
  is_free: z.boolean().default(false),
  discount_percent: z.coerce.number().min(0).max(100).default(0),
  scholarship_available: z.boolean().default(false),
  installment_available: z.boolean().default(false),
  installment_count: z.coerce.number().int().min(0).default(0),
  certificate_option: z.enum(["included", "optional", "none"]).default("included"),
  certificate_fee: z.coerce.number().min(0).default(0),
});

// ===== FULL WIZARD SCHEMA =====
export const courseWizardSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
  step5: step5Schema,
});

export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;
export type Step3Values = z.infer<typeof step3Schema>;
export type Step4Values = z.infer<typeof step4Schema>;
export type Step5Values = z.infer<typeof step5Schema>;
export type CourseWizardValues = z.infer<typeof courseWizardSchema>;
