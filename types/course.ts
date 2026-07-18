// =====================================================
// Enterprise Course Management System — TypeScript Types
// TechHat IT Institute
// =====================================================

export type CourseType =
  | "offline"
  | "online"
  | "hybrid"
  | "workshop"
  | "seminar"
  | "bootcamp"
  | "live_class"
  | "recorded";

export type CourseLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "all_levels";

export type CourseStatus = "draft" | "published" | "archived";

export type CertificateOption = "included" | "optional" | "none";

export type VideoType = "youtube" | "vimeo" | "direct";

export type Lang = "en" | "bn";

export type CourseVisibility = "public" | "private" | "password";

export type TrainerRole = "trainer" | "co_trainer" | "mentor" | "guest";

export type LessonType =
  | "video"
  | "article"
  | "assignment"
  | "quiz"
  | "coding"
  | "download";

export type EnrollmentStatus = "pending" | "active" | "completed" | "cancelled";

// ===== CATEGORY =====
export interface CourseCategory {
  id: string;
  name_en: string;
  name_bn: string;
  slug: string;
  parent_id: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// ===== COURSE (Main) =====
export interface Course {
  id: string;
  course_code: string;
  category_id: string | null;
  sub_category_id: string | null;
  course_type: CourseType;
  course_level: CourseLevel;
  status: CourseStatus;
  is_featured: boolean;
  is_popular: boolean;
  is_trending: boolean;
  is_new: boolean;
  visibility: CourseVisibility;
  password_hash: string | null;
  is_recommended: boolean;
  author_id: string | null;
  sort_order: number;
  total_enrolled: number;
  average_rating: number;
  total_reviews: number;
  published_at: string | null;
  publish_at: string | null;
  last_indexed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ===== COURSE TRANSLATION =====
export interface CourseTranslation {
  id: string;
  course_id: string;
  lang: Lang;
  name: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  objectives: string[] | null;
  learning_outcomes: string[] | null;
  benefits: string[] | null;
  who_should_join: string[] | null;
  requirements: string[] | null;
  target_audience: string | null;
  skills_covered: string[] | null;
  career_opportunities: string[] | null;
  software_used: string[] | null;
  projects: string[] | null;
  tagline: string | null;
}

// ===== COURSE MEDIA =====
export interface CourseMedia {
  id: string;
  course_id: string;
  thumbnail_url: string | null;
  banner_url: string | null;
  gallery_urls: string[];
  intro_video_type: VideoType | null;
  intro_video_url: string | null;
  demo_video_url: string | null;
  preview_pdf_url: string | null;
  brochure_pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

// ===== COURSE PRICING =====
export interface CoursePricing {
  id: string;
  course_id: string;
  course_fee: number;
  admission_fee: number;
  monthly_fee: number;
  is_free: boolean;
  discount_amount: number;
  discount_percent: number;
  scholarship_available: boolean;
  installment_available: boolean;
  installment_count: number;
  coupon_support: boolean;
  certificate_option: CertificateOption;
  certificate_fee: number;
  created_at: string;
  updated_at: string;
}

// ===== COURSE DURATION =====
export interface CourseDuration {
  id: string;
  course_id: string;
  session: "morning" | "evening" | "weekend" | "custom" | null;
  class_days: string[];
  class_time_start: string | null;
  class_time_end: string | null;
  start_date: string | null;
  end_date: string | null;
  admission_deadline: string | null;
  application_deadline: string | null;
  orientation_date: string | null;
  total_classes: number | null;
  total_hours: number | null;
  duration_text_en: string | null;
  duration_text_bn: string | null;
  is_lifetime_access: boolean;
  access_duration_days: number | null;
  created_at: string;
  updated_at: string;
}

// ===== COURSE FEATURES =====
export interface CourseFeatures {
  id: string;
  course_id: string;
  has_certificate: boolean;
  has_lifetime_support: boolean;
  has_community_access: boolean;
  has_private_group: boolean;
  has_live_qa: boolean;
  has_projects: boolean;
  has_assignments: boolean;
  has_exam: boolean;
  has_final_project: boolean;
  has_job_guideline: boolean;
  has_internship_support: boolean;
  has_career_support: boolean;
  has_freelancing_guide: boolean;
  has_cv_review: boolean;
  has_portfolio_review: boolean;
}

// ===== COURSE SEO (per-language row: one per (course_id, lang)) =====
export type TwitterCard = "summary" | "summary_large_image";

export interface CourseSeo {
  id: string;
  course_id: string;
  lang: Lang;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null; // comma separated
  focus_keyword: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  twitter_card: TwitterCard;
  robots_index: boolean;
  schema_type: string;
  seo_score: number;
  readability_score: number;
  keyword_density: number;
  created_at?: string;
  updated_at?: string;
}

// ===== COURSE FAQ =====
export interface CourseFaq {
  id: string;
  course_id: string;
  question_en: string;
  question_bn: string;
  answer_en: string;
  answer_bn: string;
  sort_order: number;
}

// ===== FULL COURSE WITH RELATIONS =====
export interface CourseWithRelations extends Course {
  en: CourseTranslation | null;
  bn: CourseTranslation | null;
  translations?: CourseTranslation[];
  category: CourseCategory | null;
  media: CourseMedia | null;
  pricing: CoursePricing | null;
  duration: CourseDuration | null;
  features: CourseFeatures | null;
  seo: CourseSeo[]; // one row per language
  settings?: CourseSettings | null;
  schema?: CourseSchemaConfig | null;
  tags?: CourseTag[];
  faqs: CourseFaq[];
  // Computed
  slug: string;      // from active lang translation
  name: string;      // from active lang translation
  thumbnail: string | null;
}

/** SEO row helper: pick a language, falling back to the other. */
export function pickSeo(seo: CourseSeo[] | undefined | null, lang: Lang): CourseSeo | null {
  if (!seo || seo.length === 0) return null;
  return seo.find((s) => s.lang === lang) ?? seo[0] ?? null;
}

// ===== COURSE SETTINGS (homepage / marketing) =====
export interface CourseSettings {
  course_id: string;
  is_featured: boolean;
  is_popular: boolean;
  is_trending: boolean;
  is_new: boolean;
  is_recommended: boolean;
  homepage_visible: boolean;
  homepage_order: number;
  show_in_slider: boolean;
  show_in_category: boolean;
  hero_banner: boolean;
  updated_at?: string;
}

// ===== STRUCTURED DATA TOGGLES =====
export interface CourseSchemaConfig {
  course_id: string;
  auto_generate: boolean;
  enable_course: boolean;
  enable_breadcrumb: boolean;
  enable_faq: boolean;
  enable_organization: boolean;
  manual_jsonld: unknown | null;
  updated_at?: string;
}

// ===== TAG (global) =====
export interface CourseTag {
  id: string;
  slug: string;
  name_en: string;
  name_bn: string | null;
  created_at?: string;
}

// ===== BATCH (schedule) =====
export interface CourseBatch {
  id: string;
  course_id: string;
  name_en: string | null;
  name_bn: string | null;
  session: "morning" | "evening" | "weekend" | "custom" | null;
  start_date: string | null;
  end_date: string | null;
  admission_deadline: string | null;
  orientation_date: string | null;
  class_days: string[] | null;
  class_time_start: string | null;
  class_time_end: string | null;
  room: string | null;
  seat_limit: number | null;
  available_seats: number | null;
  waitlist_enabled: boolean;
  access_type: "lifetime" | "duration";
  access_duration_days: number | null;
  release_date: string | null;
  drip_enabled: boolean;
  status: "upcoming" | "running" | "completed" | "cancelled";
  sort_order: number;
}

// ===== CURRICULUM =====
export interface CourseModule {
  id: string;
  course_id: string;
  title_en: string | null;
  title_bn: string | null;
  description_en: string | null;
  description_bn: string | null;
  estimated_minutes: number;
  sort_order: number;
  lessons?: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title_en: string | null;
  title_bn: string | null;
  lesson_type: LessonType;
  content_url: string | null;
  video_url: string | null;
  duration_minutes: number;
  is_preview: boolean;
  is_locked: boolean;
  attachments: { name: string; url: string; size?: number }[] | null;
  sort_order: number;
}

// ===== TRAINER =====
export interface CourseTrainer {
  id: string;
  slug: string | null;
  name_en: string;
  name_bn: string | null;
  designation_en: string | null;
  designation_bn: string | null;
  bio_en: string | null;
  bio_bn: string | null;
  image_url: string | null;
  expertise: string[] | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
}

export interface CourseTrainerAssignment {
  course_id: string;
  trainer_id: string;
  role: TrainerRole;
  sort_order: number;
  trainer?: CourseTrainer;
}

// ===== REVIEW / TESTIMONIAL =====
export interface CourseReview {
  id: string;
  course_id: string;
  user_id: string | null;
  author_name: string | null;
  author_image_url: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  is_approved: boolean;
  is_testimonial: boolean;
  is_featured: boolean;
  created_at: string;
}

// ===== ENROLLMENT =====
export interface CourseEnrollment {
  id: string;
  course_id: string;
  batch_id: string | null;
  user_id: string | null;
  status: EnrollmentStatus;
  progress: number;
  source: string | null;
  enrolled_at: string;
}

// ===== ANALYTICS =====
export interface CourseAnalytics {
  course_id: string;
  ga4_measurement_id: string | null;
  fb_pixel_id: string | null;
  event_config: unknown | null;
  view_count: number;
  enroll_count: number;
  wishlist_count: number;
  share_count: number;
}

// ===== ADMIN LIST VIEW =====
export interface CourseListItem {
  id: string;
  course_code: string;
  course_type: CourseType;
  status: CourseStatus;
  is_featured: boolean;
  is_popular: boolean;
  is_trending: boolean;
  total_enrolled: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
  name_en: string;
  name_bn: string;
  slug_en: string;
  slug_bn: string;
  thumbnail_url: string | null;
  course_fee: number;
  category_name_en: string | null;
  category_name_bn: string | null;
}

// ===== WIZARD FORM DATA =====
export interface CourseWizardStep1 {
  name_en: string;
  name_bn: string;
  slug_en: string;
  slug_bn: string;
  course_code: string;
  category_id: string;
  sub_category_id?: string;
  course_type: CourseType;
  course_level: CourseLevel;
  is_featured: boolean;
  is_popular: boolean;
  is_trending: boolean;
  is_new: boolean;
  status: CourseStatus;
}

export interface CourseWizardStep2 {
  short_description_en: string;
  short_description_bn: string;
  long_description_en: string;
  long_description_bn: string;
  objectives_en: string;
  objectives_bn: string;
  learning_outcomes_en: string;
  learning_outcomes_bn: string;
  benefits_en: string;
  benefits_bn: string;
  who_should_join_en: string;
  who_should_join_bn: string;
  requirements_en: string;
  requirements_bn: string;
  skills_covered_en: string;
  skills_covered_bn: string;
  career_opportunities_en: string;
  career_opportunities_bn: string;
}

export interface CourseWizardStep3 {
  thumbnail_url?: string;
  banner_url?: string;
  intro_video_type?: VideoType;
  intro_video_url?: string;
  demo_video_url?: string;
  brochure_pdf_url?: string;
}

export interface CourseWizardStep4 {
  duration_text_en: string;
  duration_text_bn: string;
  // Offline
  session?: "morning" | "evening" | "weekend" | "custom";
  class_days?: string[];
  class_time_start?: string;
  class_time_end?: string;
  start_date?: string;
  end_date?: string;
  admission_deadline?: string;
  total_classes?: number;
  total_hours?: number;
  // Online
  is_lifetime_access?: boolean;
  access_duration_days?: number;
}

export interface CourseWizardStep5 {
  course_fee: number;
  admission_fee: number;
  monthly_fee: number;
  is_free: boolean;
  discount_percent: number;
  scholarship_available: boolean;
  installment_available: boolean;
  installment_count: number;
  certificate_option: CertificateOption;
  certificate_fee: number;
}

export interface CourseWizardData {
  step1: CourseWizardStep1;
  step2: CourseWizardStep2;
  step3: CourseWizardStep3;
  step4: CourseWizardStep4;
  step5: CourseWizardStep5;
}
