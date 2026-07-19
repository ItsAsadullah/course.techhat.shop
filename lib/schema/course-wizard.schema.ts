import { z } from "zod";

// =====================================================
// Course Wizard v2 — schema
// Phase 1 validates: general, content, seo.
// Steps 4–12 are added in later phases.
// Arrays are structured string[] (ArrayListEditor);
// the server action serializes them to JSON in TEXT columns.
// =====================================================

export const COURSE_TYPES = [
  "offline",
  "online",
  "hybrid",
  "workshop",
  "bootcamp",
  "certification",
  "seminar",
  "live_class",
  "recorded",
] as const;

export const COURSE_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
  "all_levels",
] as const;

export const COURSE_STATUSES = ["draft", "published", "archived"] as const;
export const COURSE_VISIBILITIES = ["public", "private", "password"] as const;
export const TWITTER_CARDS = ["summary", "summary_large_image"] as const;
export const SCHEMA_TYPES = ["Course", "EducationalOccupationalProgram"] as const;
export const VIDEO_TYPES = ["youtube", "vimeo", "direct"] as const;
export const CERTIFICATE_OPTIONS = ["included", "optional", "none"] as const;
export const SESSIONS = ["morning", "evening", "weekend", "custom"] as const;
export const BATCH_STATUSES = ["upcoming", "running", "completed", "cancelled"] as const;
export const ACCESS_TYPES = ["lifetime", "duration"] as const;
export const LESSON_TYPES = ["video", "article", "assignment", "quiz", "coding", "download"] as const;
export const TRAINER_ROLES = ["trainer", "co_trainer", "mentor", "guest"] as const;

const optionalUuid = z.string().uuid().optional().or(z.literal(""));
const strList = z.array(z.string().min(1)).default([]);
const optionalUrl = z.string().url().optional().or(z.literal("")).default("");
const optionalDate = z.string().optional().or(z.literal("")).default("");
const optionalTime = z.string().optional().or(z.literal("")).default("");
const money = z.preprocess((v) => (v === "" || v == null || Number.isNaN(Number(v)) ? 0 : Number(v)), z.number().min(0).default(0));

// ---------- STEP 1: GENERAL ----------
export const generalSchema = z.object({
  name_en: z.string().min(1, "Course name (EN) is required"),
  name_bn: z.string().optional().default(""),
  slug_en: z
    .string()
    .min(1, "Slug (EN) is required")
    .regex(/^[a-z0-9-]*$/, "Only lowercase letters, numbers and hyphens"),
  slug_bn: z.string().optional().default(""),
  course_code: z.string().min(1, "Course code is required"),
  category_id: z.string().uuid("Please select a category"),
  sub_category_id: optionalUuid,
  tags: strList,
  course_type: z.enum(COURSE_TYPES),
  course_level: z.enum(COURSE_LEVELS),
  status: z.enum(COURSE_STATUSES).default("draft"),
  visibility: z.enum(COURSE_VISIBILITIES).default("public"),
  password: z.string().optional().default(""),
});

// ---------- STEP 2: CONTENT ----------
export const contentSchema = z.object({
  short_description_en: z.string().min(20, "Short description (EN) ≥ 20 chars"),
  short_description_bn: z.string().min(20, "সংক্ষিপ্ত বিবরণ (BN) ≥ ২০ অক্ষর"),
  long_description_en: z.string().optional().default(""),
  long_description_bn: z.string().optional().default(""),
  learning_outcomes_en: strList,
  learning_outcomes_bn: strList,
  benefits_en: strList,
  benefits_bn: strList,
  requirements_en: strList,
  requirements_bn: strList,
  who_should_join_en: strList,
  who_should_join_bn: strList,
  career_opportunities_en: strList,
  career_opportunities_bn: strList,
  skills_en: z.array(z.object({ name: z.string().default(""), image_url: z.string().optional().default("") })).default([]),
  skills_bn: z.array(z.object({ name: z.string().default(""), image_url: z.string().optional().default("") })).default([]),
  software_used_en: z.array(z.object({ name: z.string().default(""), image_url: z.string().optional().default("") })).default([]),
  software_used_bn: z.array(z.object({ name: z.string().default(""), image_url: z.string().optional().default("") })).default([]),
  projects_en: strList,
  projects_bn: strList,
  target_audience_en: z.string().optional().default(""),
  target_audience_bn: z.string().optional().default(""),
  faqs: z
    .array(
      z.object({
        question_en: z.string().default(""),
        question_bn: z.string().default(""),
        answer_en: z.string().default(""),
        answer_bn: z.string().default(""),
      })
    )
    .default([]),
  testimonials: z
    .array(
      z.object({
        author_name: z.string().default(""),
        author_image_url: z.string().optional().default(""),
        rating: z.coerce.number().min(1).max(5).default(5),
        body_en: z.string().default(""),
        body_bn: z.string().default(""),
      })
    )
    .default([]),
  features: z.object({
    has_certificate: z.boolean().default(false),
    has_lifetime_support: z.boolean().default(false),
    has_community_access: z.boolean().default(false),
    has_private_group: z.boolean().default(false),
    has_live_qa: z.boolean().default(false),
    has_projects: z.boolean().default(false),
    has_assignments: z.boolean().default(false),
    has_exam: z.boolean().default(false),
    has_final_project: z.boolean().default(false),
    has_job_guideline: z.boolean().default(false),
    has_internship_support: z.boolean().default(false),
    has_career_support: z.boolean().default(false),
    has_freelancing_guide: z.boolean().default(false),
    has_cv_review: z.boolean().default(false),
    has_portfolio_review: z.boolean().default(false),
  }).default({
    has_certificate: false, has_lifetime_support: false, has_community_access: false,
    has_private_group: false, has_live_qa: false, has_projects: false, has_assignments: false,
    has_exam: false, has_final_project: false, has_job_guideline: false,
    has_internship_support: false, has_career_support: false, has_freelancing_guide: false,
    has_cv_review: false, has_portfolio_review: false,
  }),
});

// ---------- STEP 3: SEO (per language) ----------
export const seoLangSchema = z.object({
  meta_title: z.string().optional().default(""),
  meta_description: z.string().optional().default(""),
  meta_keywords: z.string().optional().default(""),
  focus_keyword: z.string().optional().default(""),
  canonical_url: z.string().url().optional().or(z.literal("")).default(""),
  og_title: z.string().optional().default(""),
  og_description: z.string().optional().default(""),
  og_image_url: z.string().url().optional().or(z.literal("")).default(""),
  twitter_card: z.enum(TWITTER_CARDS).default("summary_large_image"),
  robots_index: z.boolean().default(true),
  schema_type: z.enum(SCHEMA_TYPES).default("Course"),
});

export const seoSchema = z.object({
  en: seoLangSchema,
  bn: seoLangSchema,
});

// ---------- STEP 4: MEDIA ----------
export const mediaSchema = z.object({
  thumbnail_url: optionalUrl,
  banner_url: optionalUrl,
  gallery_urls: z.array(z.string().url().or(z.literal(""))).default([]),
  intro_video_type: z.enum(VIDEO_TYPES).optional().or(z.literal("")).default("youtube"),
  intro_video_url: optionalUrl,
  demo_video_url: optionalUrl,
  preview_video_url: optionalUrl,
  preview_pdf_url: optionalUrl,
  brochure_pdf_url: optionalUrl,
  course_pdf_url: optionalUrl,
  certificate_sample_url: optionalUrl,
});

// ---------- STEP 5: SCHEDULE ----------
export const scheduleBatchSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")).default(""),
  shift_id: z.string().uuid().optional().or(z.literal("")).default(""),
  name_en: z.string().optional().default(""),
  name_bn: z.string().optional().default(""),
  session: z.enum(SESSIONS).optional().or(z.literal("")).default("morning"),
  start_date: optionalDate,
  end_date: optionalDate,
  admission_deadline: optionalDate,
  orientation_date: optionalDate,
  class_days: strList,
  class_time_start: optionalTime,
  class_time_end: optionalTime,
  room: z.string().optional().default(""),
  seat_limit: money.optional().default(0),
  waitlist_enabled: z.boolean().default(false),
  access_type: z.enum(ACCESS_TYPES).default("lifetime"),
  access_duration_days: z.coerce.number().min(0).optional().default(0),
  release_date: optionalDate,
  drip_enabled: z.boolean().default(false),
  status: z.enum(BATCH_STATUSES).default("upcoming"),
});

export const scheduleSchema = z.object({
  duration_text_en: z.string().optional().default(""),
  duration_text_bn: z.string().optional().default(""),
  session: z.enum(SESSIONS).optional().or(z.literal("")).default("morning"),
  class_days: strList,
  class_time_start: optionalTime,
  class_time_end: optionalTime,
  start_date: optionalDate,
  end_date: optionalDate,
  admission_deadline: optionalDate,
  application_deadline: optionalDate,
  orientation_date: optionalDate,
  total_classes: money.optional().default(0),
  total_hours: money.optional().default(0),
  is_lifetime_access: z.boolean().default(false),
  access_duration_days: money.optional().default(0),
  batches: z.array(scheduleBatchSchema).default([]),
});

// ---------- STEP 6: PRICING ----------
export const pricingSchema = z.object({
  course_fee: money,
  admission_fee: money,
  monthly_fee: money,
  is_free: z.boolean().default(false),
  discount_amount: money,
  discount_percent: z.preprocess((v) => (v === "" || v == null || Number.isNaN(Number(v)) ? 0 : Number(v)), z.number().min(0).max(100).default(0)),
  discount_fee: money,
  offer_start: optionalDate,
  offer_end: optionalDate,
  scholarship_available: z.boolean().default(false),
  installment_available: z.boolean().default(false),
  installment_count: money.default(0),
  coupon_support: z.boolean().default(false),
  certificate_option: z.enum(CERTIFICATE_OPTIONS).default("included"),
  certificate_fee: money,
  board_registration_fee: money,
  board_certificate_fee: money,
  institute_certificate_fee: money,
  supports_board_certificate: z.boolean().default(false),
  board_registration_required: z.boolean().default(false),
  currency: z.string().default("BDT"),
});

// ---------- STEP 7: CURRICULUM ----------
export const lessonSchema = z.object({
  title_en: z.string().optional().default(""),
  title_bn: z.string().optional().default(""),
  lesson_type: z.enum(LESSON_TYPES).default("video"),
  content_url: z.string().optional().default(""),
  video_url: z.string().optional().default(""),
  duration_minutes: money.default(0),
  is_preview: z.boolean().default(false),
  is_locked: z.boolean().default(true),
});

export const curriculumModuleSchema = z.object({
  title_en: z.string().optional().default(""),
  title_bn: z.string().optional().default(""),
  description_en: z.string().optional().default(""),
  description_bn: z.string().optional().default(""),
  estimated_minutes: money.default(0),
  lessons: z.array(lessonSchema).default([]),
});

export const curriculumSchema = z.object({
  modules: z.array(curriculumModuleSchema).default([]),
});

// ---------- STEP 8: TRAINERS ----------
export const trainerSchema = z.object({
  slug: z.string().optional().default(""),
  name_en: z.string().optional().default(""),
  name_bn: z.string().optional().default(""),
  designation_en: z.string().optional().default(""),
  designation_bn: z.string().optional().default(""),
  bio_en: z.string().optional().default(""),
  bio_bn: z.string().optional().default(""),
  image_url: optionalUrl,
  expertise: strList,
  facebook_url: optionalUrl,
  linkedin_url: optionalUrl,
  website_url: optionalUrl,
  role: z.enum(TRAINER_ROLES).default("trainer"),
});

export const trainersSchema = z.object({
  trainers: z.array(trainerSchema).default([]),
});

// ---------- STEP 9: HOMEPAGE ----------
export const homepageSchema = z.object({
  is_featured: z.boolean().default(false),
  is_popular: z.boolean().default(false),
  is_trending: z.boolean().default(false),
  is_new: z.boolean().default(true),
  is_recommended: z.boolean().default(false),
  homepage_visible: z.boolean().default(true),
  homepage_order: money.default(0),
  show_in_slider: z.boolean().default(false),
  show_in_category: z.boolean().default(true),
  hero_banner: z.boolean().default(false),
});

// ---------- STEP 10: GOOGLE SEARCH ----------
export const searchSchema = z.object({
  auto_generate: z.boolean().default(true),
  enable_course: z.boolean().default(true),
  enable_breadcrumb: z.boolean().default(true),
  enable_faq: z.boolean().default(true),
  enable_organization: z.boolean().default(true),
  manual_jsonld: z.string().optional().default(""),
});

// ---------- STEP 11: ANALYTICS ----------
export const analyticsSchema = z.object({
  ga4_measurement_id: z.string().optional().default(""),
  fb_pixel_id: z.string().optional().default(""),
  event_config: z.string().optional().default(""),
});

// ---------- FULL FORM ----------
export const courseWizardSchemaV2 = z.object({
  general: generalSchema,
  content: contentSchema,
  seo: seoSchema,
  media: mediaSchema,
  schedule: scheduleSchema,
  pricing: pricingSchema,
  curriculum: curriculumSchema,
  trainers: trainersSchema,
  homepage: homepageSchema,
  search: searchSchema,
  analytics: analyticsSchema,
});

export type GeneralValues = z.infer<typeof generalSchema>;
export type ContentValues = z.infer<typeof contentSchema>;
export type SeoLangValues = z.infer<typeof seoLangSchema>;
export type SeoValues = z.infer<typeof seoSchema>;
export type CourseFormValues = z.infer<typeof courseWizardSchemaV2>;

// ---------- DEFAULTS ----------
const emptySeoLang: SeoLangValues = {
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  focus_keyword: "",
  canonical_url: "",
  og_title: "",
  og_description: "",
  og_image_url: "",
  twitter_card: "summary_large_image",
  robots_index: true,
  schema_type: "Course",
};

export const defaultCourseFormValues: CourseFormValues = {
  general: {
    name_en: "",
    name_bn: "",
    slug_en: "",
    slug_bn: "",
    course_code: "",
    category_id: "",
    sub_category_id: "",
    tags: [],
    course_type: "offline",
    course_level: "beginner",
    status: "draft",
    visibility: "public",
    password: "",
  },
  content: {
    short_description_en: "",
    short_description_bn: "",
    long_description_en: "",
    long_description_bn: "",
    learning_outcomes_en: [],
    learning_outcomes_bn: [],
    benefits_en: [],
    benefits_bn: [],
    requirements_en: [],
    requirements_bn: [],
    who_should_join_en: [],
    who_should_join_bn: [],
    career_opportunities_en: [],
    career_opportunities_bn: [],
    skills_en: [],
    skills_bn: [],
    software_used_en: [],
    software_used_bn: [],
    projects_en: [],
    projects_bn: [],
    target_audience_en: "",
    target_audience_bn: "",
    faqs: [],
    testimonials: [],
    features: {
      has_certificate: false,
      has_lifetime_support: false,
      has_community_access: false,
      has_private_group: false,
      has_live_qa: false,
      has_projects: false,
      has_assignments: false,
      has_exam: false,
      has_final_project: false,
      has_job_guideline: false,
      has_internship_support: false,
      has_career_support: false,
      has_freelancing_guide: false,
      has_cv_review: false,
      has_portfolio_review: false,
    },
  },
  seo: { en: { ...emptySeoLang }, bn: { ...emptySeoLang } },
  media: {
    thumbnail_url: "",
    banner_url: "",
    gallery_urls: [],
    intro_video_type: "youtube",
    intro_video_url: "",
    demo_video_url: "",
    preview_video_url: "",
    preview_pdf_url: "",
    brochure_pdf_url: "",
    course_pdf_url: "",
    certificate_sample_url: "",
  },
  schedule: {
    duration_text_en: "",
    duration_text_bn: "",
    session: "morning",
    class_days: [],
    class_time_start: "",
    class_time_end: "",
    start_date: "",
    end_date: "",
    admission_deadline: "",
    application_deadline: "",
    orientation_date: "",
    total_classes: 0,
    total_hours: 0,
    is_lifetime_access: false,
    access_duration_days: 0,
    batches: [],
  },
  pricing: {
    course_fee: 0,
    admission_fee: 0,
    monthly_fee: 0,
    is_free: false,
    discount_amount: 0,
    discount_percent: 0,
    discount_fee: 0,
    offer_start: "",
    offer_end: "",
    scholarship_available: false,
    installment_available: false,
    installment_count: 0,
    coupon_support: false,
    certificate_option: "included",
    certificate_fee: 0,
    board_registration_fee: 0,
    board_certificate_fee: 0,
    institute_certificate_fee: 0,
    supports_board_certificate: false,
    board_registration_required: false,
    currency: "BDT",
  },
  curriculum: { modules: [] },
  trainers: { trainers: [] },
  homepage: {
    is_featured: false,
    is_popular: false,
    is_trending: false,
    is_new: true,
    is_recommended: false,
    homepage_visible: true,
    homepage_order: 0,
    show_in_slider: false,
    show_in_category: true,
    hero_banner: false,
  },
  search: {
    auto_generate: true,
    enable_course: true,
    enable_breadcrumb: true,
    enable_faq: true,
    enable_organization: true,
    manual_jsonld: "",
  },
  analytics: {
    ga4_measurement_id: "",
    fb_pixel_id: "",
    event_config: "",
  },
};

// ---------- WIZARD STEP METADATA (all 12; 1–3 active in Phase 1) ----------
export interface WizardStepMeta {
  key: string;
  index: number;
  labelEn: string;
  labelBn: string;
  icon: string; // lucide icon name
  active: boolean; // built in Phase 1?
}

export const WIZARD_STEPS: WizardStepMeta[] = [
  { key: "general", index: 1, labelEn: "General Information", labelBn: "সাধারণ তথ্য", icon: "Info", active: true },
  { key: "content", index: 2, labelEn: "Course Content", labelBn: "কোর্স কনটেন্ট", icon: "FileText", active: true },
  { key: "seo", index: 3, labelEn: "SEO Optimization", labelBn: "এসইও অপটিমাইজেশন", icon: "Search", active: true },
  { key: "media", index: 4, labelEn: "Media", labelBn: "মিডিয়া", icon: "Image", active: false },
  { key: "schedule", index: 5, labelEn: "Schedule", labelBn: "সময়সূচি", icon: "Calendar", active: false },
  { key: "pricing", index: 6, labelEn: "Pricing", labelBn: "মূল্য", icon: "DollarSign", active: false },
  { key: "curriculum", index: 7, labelEn: "Curriculum", labelBn: "কারিকুলাম", icon: "ListTree", active: false },
  { key: "trainers", index: 8, labelEn: "Trainers", labelBn: "প্রশিক্ষক", icon: "Users", active: false },
  { key: "homepage", index: 9, labelEn: "Homepage", labelBn: "হোমপেজ", icon: "Home", active: false },
  { key: "search", index: 10, labelEn: "Google Search", labelBn: "গুগল সার্চ", icon: "Globe", active: false },
  { key: "analytics", index: 11, labelEn: "Analytics", labelBn: "অ্যানালিটিক্স", icon: "BarChart3", active: false },
  { key: "review", index: 12, labelEn: "Review & Publish", labelBn: "রিভিউ ও প্রকাশ", icon: "Rocket", active: true },
];

/** Which top-level form key each step validates against (for step completion state). */
export const STEP_FIELD_MAP: Record<string, keyof CourseFormValues | null> = {
  general: "general",
  content: "content",
  seo: "seo",
  media: "media",
  schedule: "schedule",
  pricing: "pricing",
  curriculum: "curriculum",
  trainers: "trainers",
  homepage: "homepage",
  search: "search",
  analytics: "analytics",
  review: null,
};
