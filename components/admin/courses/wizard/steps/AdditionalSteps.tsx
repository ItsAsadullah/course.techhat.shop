"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, ListTree, Users, CalendarClock } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/admin/supabase/client";
import { useLang } from "@/context/GlobalLangContext";
import { courseWizardT, type CourseWizardTKey } from "@/lib/i18n/course-wizard";
import { ArrayEditor } from "../fields/ArrayEditor";
import { BilingualInput } from "../fields/BilingualInput";
import { BilingualTextarea } from "../fields/BilingualTextarea";
import { SelectField } from "../fields/SelectField";
import { SwitchField } from "../fields/SwitchField";
import { FileUploadField } from "../fields/FileUploadField";
import { StepHeader, EmptyState, SectionHeader } from "../fields/StepScaffold";
import { cardCls, inputCls, labelCls } from "../shared";

// ---------- option lists (value/label pairs for the polished SelectField) ----------
const titleCase = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const opts = (arr: readonly string[]) => arr.map((v) => ({ value: v, label: titleCase(v) }));

const sessionOptions = opts(["morning", "evening", "weekend", "custom"]);
const batchStatusOptions = opts(["upcoming", "running", "completed", "cancelled"]);
const accessTypeOptions = opts(["lifetime", "duration"]);
const lessonTypeOptions = opts(["video", "article", "assignment", "quiz", "coding", "download"]);
const trainerRoleOptions = opts(["trainer", "co_trainer", "mentor", "guest"]);
const videoTypeOptions = opts(["youtube", "vimeo", "direct"]);
const certificateOptions = opts(["included", "optional", "none"]);

/** Small labelled input for scalar (date/time/number/text) fields via register(). */
function Field({
  name,
  label,
  type = "text",
}: {
  name: string;
  label: string;
  type?: string;
}) {
  const { register } = useFormContext();
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        {...register(name, type === "number" ? { valueAsNumber: true } : undefined)}
        type={type}
        className={inputCls}
      />
    </div>
  );
}

/** i18n hook shared by every step below. */
function useT() {
  const { lang } = useLang();
  return (k: CourseWizardTKey) => courseWizardT[lang][k];
}

// =====================================================================
// STEP 4 — MEDIA
// =====================================================================
export function Step4Media() {
  const t = useT();
  return (
    <div className="space-y-7">
      <StepHeader title={t("mediaTitle")} description={t("mediaDesc")} />

      <div>
        <SectionHeader title={t("imagesSection")} />
        <div className="grid gap-4 sm:grid-cols-3">
          <FileUploadField name="media.thumbnail_url" label={t("thumbnail")} folder="courses" />
          <FileUploadField name="media.banner_url" label={t("banner")} folder="courses" />
          <FileUploadField name="media.certificate_sample_url" label={t("certificateSample")} folder="courses" />
        </div>
        <div className="mt-4">
          <label className={labelCls}>{t("gallery")}</label>
          <ArrayEditor name="media.gallery_urls" placeholder="https://…" isImage={true} />
        </div>
      </div>

      <div>
        <SectionHeader title={t("videosSection")} />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField name="media.intro_video_type" label={t("introVideoType")} options={videoTypeOptions} />
          <Field name="media.intro_video_url" label={t("introVideo")} />
          <Field name="media.demo_video_url" label={t("demoVideo")} />
          <Field name="media.preview_video_url" label={t("previewVideo")} />
        </div>
      </div>

      <div>
        <SectionHeader title={t("filesSection")} />
        <div className="grid gap-4 sm:grid-cols-3">
          <FileUploadField name="media.preview_pdf_url" label={t("previewPdf")} folder="courses" accept="application/pdf" maxSizeMB={10} />
          <FileUploadField name="media.brochure_pdf_url" label={t("brochurePdf")} folder="courses" accept="application/pdf" maxSizeMB={10} />
          <FileUploadField name="media.course_pdf_url" label={t("coursePdf")} folder="courses" accept="application/pdf" maxSizeMB={10} />
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// STEP 5 — SCHEDULE
// =====================================================================
export function Step5Schedule() {
  const t = useT();
  const { control } = useFormContext();
  const batches = useFieldArray({ control, name: "schedule.batches" });
  const [shiftOptions, setShiftOptions] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    async function loadShifts() {
      const supabase = createClient();
      const { data } = await supabase
        .from("training_shifts")
        .select("id, name_en, start_time, end_time")
        .eq("status", "active")
        .order("sort_order", { ascending: true });
        
      if (data) {
        setShiftOptions([
          { value: "", label: "No Shift (Legacy/Online)" },
          ...data.map((s) => ({ value: s.id, label: `${s.name_en} (${s.start_time.slice(0,5)} - ${s.end_time.slice(0,5)})` }))
        ]);
      }
    }
    loadShifts();
  }, []);

  const addBatch = () =>
    batches.append({
      name_en: "",
      name_bn: "",
      session: "morning",
      class_days: [],
      access_type: "lifetime",
      status: "upcoming",
      shift_id: "",
    });

  return (
    <div className="space-y-7">
      <StepHeader title={t("scheduleTitle")} description={t("scheduleDesc")} />

      <BilingualInput
        label={t("durationText")}
        nameEn="schedule.duration_text_en"
        nameBn="schedule.duration_text_bn"
        placeholderEn="3 months"
        placeholderBn="৩ মাস"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField name="schedule.session" label={t("session")} options={sessionOptions} />
        <Field name="schedule.total_classes" label={t("totalClasses")} type="number" />
        <Field name="schedule.total_hours" label={t("totalHours")} type="number" />
        <Field name="schedule.class_time_start" label={t("classStart")} type="time" />
        <Field name="schedule.class_time_end" label={t("classEnd")} type="time" />
        <Field name="schedule.access_duration_days" label={t("accessDays")} type="number" />
        <Field name="schedule.start_date" label={t("startDate")} type="date" />
        <Field name="schedule.end_date" label={t("endDate")} type="date" />
        <Field name="schedule.admission_deadline" label={t("admissionDeadline")} type="date" />
        <Field name="schedule.application_deadline" label={t("applicationDeadline")} type="date" />
        <Field name="schedule.orientation_date" label={t("orientationDate")} type="date" />
      </div>

      <SwitchField name="schedule.is_lifetime_access" label={t("lifetimeAccess")} />
      <ArrayEditor name="schedule.class_days" label={t("classDays")} placeholder="Saturday" />

      <div>
        <SectionHeader
          title={t("batches")}
          action={
            <button
              type="button"
              onClick={addBatch}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-blue-300"
            >
              <Plus className="h-3.5 w-3.5" /> {t("addBatch")}
            </button>
          }
        />
        {batches.fields.length === 0 ? (
          <EmptyState
            icon={<CalendarClock className="h-8 w-8" />}
            message={t("noBatches")}
            action={
              <button
                type="button"
                onClick={addBatch}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" /> {t("addBatch")}
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {batches.fields.map((field, i) => (
              <div key={field.id} className={cardCls + " !p-4"}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{t("batches")} #{i + 1}</span>
                  <button type="button" onClick={() => batches.remove(i)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <BilingualInput
                    label={t("batchName")}
                    nameEn={`schedule.batches.${i}.name_en`}
                    nameBn={`schedule.batches.${i}.name_bn`}
                  />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <SelectField name={`schedule.batches.${i}.shift_id`} label={"Assigned Shift"} options={shiftOptions} />
                    <SelectField name={`schedule.batches.${i}.session`} label={t("session")} options={sessionOptions} />
                    <SelectField name={`schedule.batches.${i}.status`} label={t("batchStatus")} options={batchStatusOptions} />
                    <SelectField name={`schedule.batches.${i}.access_type`} label={t("accessType")} options={accessTypeOptions} />
                    <Field name={`schedule.batches.${i}.start_date`} label={t("startDate")} type="date" />
                    <Field name={`schedule.batches.${i}.end_date`} label={t("endDate")} type="date" />
                    <Field name={`schedule.batches.${i}.admission_deadline`} label={t("admissionDeadline")} type="date" />
                    <Field name={`schedule.batches.${i}.class_time_start`} label={t("classStart")} type="time" />
                    <Field name={`schedule.batches.${i}.class_time_end`} label={t("classEnd")} type="time" />
                    <Field name={`schedule.batches.${i}.room`} label={t("room")} />
                    <Field name={`schedule.batches.${i}.seat_limit`} label={t("seatLimit")} type="number" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Available seats are calculated automatically from current enrollments.</p>
                  <ArrayEditor name={`schedule.batches.${i}.class_days`} label={t("classDays")} placeholder="Saturday" />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <SwitchField name={`schedule.batches.${i}.waitlist_enabled`} label={t("waitlistEnabled")} />
                    <SwitchField name={`schedule.batches.${i}.drip_enabled`} label={t("dripEnabled")} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// STEP 6 — PRICING
// =====================================================================
export function Step6Pricing() {
  const t = useT();
  return (
    <div className="space-y-7">
      <StepHeader title={t("pricingTitle")} description={t("pricingDesc")} />

      <div>
        <SectionHeader title={t("feesSection")} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field name="pricing.course_fee" label={t("courseFee")} type="number" />
          <Field name="pricing.admission_fee" label={t("admissionFee")} type="number" />
          <Field name="pricing.monthly_fee" label={t("monthlyFee")} type="number" />
          <SelectField name="pricing.currency" label={t("currency")} options={opts(["BDT", "USD"])} />
        </div>
        <div className="mt-3">
          <SwitchField name="pricing.is_free" label={t("isFree")} />
        </div>
      </div>

      <div>
        <SectionHeader title={t("discountsSection")} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field name="pricing.discount_amount" label={t("discountAmount")} type="number" />
          <Field name="pricing.discount_percent" label={t("discountPercent")} type="number" />
          <Field name="pricing.discount_fee" label={t("finalOfferFee")} type="number" />
          <Field name="pricing.offer_start" label={t("offerStart")} type="date" />
          <Field name="pricing.offer_end" label={t("offerEnd")} type="date" />
          <Field name="pricing.installment_count" label={t("installmentCount")} type="number" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <SwitchField name="pricing.scholarship_available" label={t("scholarship")} />
          <SwitchField name="pricing.installment_available" label={t("installments")} />
          <SwitchField name="pricing.coupon_support" label={t("couponSupport")} />
        </div>
      </div>

      <div>
        <SectionHeader title={t("certificatesSection")} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField name="pricing.certificate_option" label={t("certificateOption")} options={certificateOptions} />
          <Field name="pricing.certificate_fee" label={t("certificateFee")} type="number" />
          <Field name="pricing.institute_certificate_fee" label={t("instituteCertificateFee")} type="number" />
        </div>
        <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
          <h4 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">Board / Govt. Certification</h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            <SwitchField name="pricing.supports_board_certificate" label={t("supportsBoardCertificate")} />
            <SwitchField name="pricing.board_registration_required" label={t("boardRegistrationRequired")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field name="pricing.board_registration_fee" label={t("boardRegistrationFee")} type="number" />
            <Field name="pricing.board_certificate_fee" label={t("boardCertificateFee")} type="number" />
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// STEP 7 — CURRICULUM
// =====================================================================
export function Step7Curriculum() {
  const t = useT();
  const { control } = useFormContext();
  const modules = useFieldArray({ control, name: "curriculum.modules" });

  const addModule = () =>
    modules.append({ title_en: "", title_bn: "", description_en: "", description_bn: "", estimated_minutes: 0, lessons: [] });

  return (
    <div className="space-y-5">
      <StepHeader title={t("curriculumTitle")} description={t("curriculumDesc")} />

      <SectionHeader
        title={t("curriculumTitle")}
        action={
          <button
            type="button"
            onClick={addModule}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-blue-300"
          >
            <Plus className="h-3.5 w-3.5" /> {t("addModule")}
          </button>
        }
      />

      {modules.fields.length === 0 ? (
        <EmptyState
          icon={<ListTree className="h-8 w-8" />}
          message={t("noModules")}
          action={
            <button
              type="button"
              onClick={addModule}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> {t("addModule")}
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {modules.fields.map((module, i) => (
            <div key={module.id} className={cardCls + " !p-4"}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t("module")} #{i + 1}</span>
                <button type="button" onClick={() => modules.remove(i)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <BilingualInput label={t("moduleTitle")} nameEn={`curriculum.modules.${i}.title_en`} nameBn={`curriculum.modules.${i}.title_bn`} />
                <BilingualTextarea label={t("moduleDescription")} nameEn={`curriculum.modules.${i}.description_en`} nameBn={`curriculum.modules.${i}.description_bn`} rows={2} />
                <div className="max-w-xs">
                  <Field name={`curriculum.modules.${i}.estimated_minutes`} label={t("estimatedMinutes")} type="number" />
                </div>
              </div>
              <Lessons moduleIndex={i} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Lessons({ moduleIndex }: { moduleIndex: number }) {
  const t = useT();
  const { control } = useFormContext();
  const lessons = useFieldArray({ control, name: `curriculum.modules.${moduleIndex}.lessons` });

  const addLesson = () =>
    lessons.append({ title_en: "", title_bn: "", lesson_type: "video", duration_minutes: 0, is_preview: false, is_locked: true });

  return (
    <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
      <SectionHeader
        title={t("lessons")}
        action={
          <button type="button" onClick={addLesson} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:text-blue-500">
            <Plus className="h-4 w-4" /> {t("addLesson")}
          </button>
        }
      />
      {lessons.fields.length === 0 ? (
        <p className="text-xs text-slate-400">{t("noLessons")}</p>
      ) : (
        <div className="space-y-3">
          {lessons.fields.map((lesson, j) => (
            <div key={lesson.id} className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">#{j + 1}</span>
                <button type="button" onClick={() => lessons.remove(j)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-3">
                <BilingualInput label={t("lessonTitle")} nameEn={`curriculum.modules.${moduleIndex}.lessons.${j}.title_en`} nameBn={`curriculum.modules.${moduleIndex}.lessons.${j}.title_bn`} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <SelectField name={`curriculum.modules.${moduleIndex}.lessons.${j}.lesson_type`} label={t("lessonType")} options={lessonTypeOptions} />
                  <Field name={`curriculum.modules.${moduleIndex}.lessons.${j}.duration_minutes`} label={t("minutes")} type="number" />
                  <Field name={`curriculum.modules.${moduleIndex}.lessons.${j}.video_url`} label={t("videoUrl")} />
                  <Field name={`curriculum.modules.${moduleIndex}.lessons.${j}.content_url`} label={t("contentUrl")} />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <SwitchField name={`curriculum.modules.${moduleIndex}.lessons.${j}.is_preview`} label={t("previewLesson")} />
                  <SwitchField name={`curriculum.modules.${moduleIndex}.lessons.${j}.is_locked`} label={t("locked")} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================================
// STEP 8 — TRAINERS
// =====================================================================
export function Step8Trainers() {
  const t = useT();
  const { control } = useFormContext();
  const trainers = useFieldArray({ control, name: "trainers.trainers" });

  const addTrainer = () => trainers.append({ name_en: "", name_bn: "", role: "trainer", expertise: [] });

  return (
    <div className="space-y-5">
      <StepHeader title={t("trainersTitle")} description={t("trainersDesc")} />

      <SectionHeader
        title={t("trainersTitle")}
        action={
          <button
            type="button"
            onClick={addTrainer}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-blue-300"
          >
            <Plus className="h-3.5 w-3.5" /> {t("addTrainer")}
          </button>
        }
      />

      {trainers.fields.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          message={t("noTrainers")}
          action={
            <button
              type="button"
              onClick={addTrainer}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> {t("addTrainer")}
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {trainers.fields.map((trainer, i) => (
            <div key={trainer.id} className={cardCls + " !p-4"}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t("trainer")} #{i + 1}</span>
                <button type="button" onClick={() => trainers.remove(i)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                  <FileUploadField name={`trainers.trainers.${i}.image_url`} label={t("trainerImage")} folder="trainers" />
                  <div className="space-y-4">
                    <BilingualInput label={t("trainerName")} nameEn={`trainers.trainers.${i}.name_en`} nameBn={`trainers.trainers.${i}.name_bn`} />
                    <BilingualInput label={t("designation")} nameEn={`trainers.trainers.${i}.designation_en`} nameBn={`trainers.trainers.${i}.designation_bn`} />
                  </div>
                </div>
                <BilingualTextarea label={t("bio")} nameEn={`trainers.trainers.${i}.bio_en`} nameBn={`trainers.trainers.${i}.bio_bn`} rows={2} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField name={`trainers.trainers.${i}.role`} label={t("role")} options={trainerRoleOptions} />
                </div>
                <ArrayEditor name={`trainers.trainers.${i}.expertise`} label={t("expertise")} placeholder="React" />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field name={`trainers.trainers.${i}.facebook_url`} label="Facebook URL" />
                  <Field name={`trainers.trainers.${i}.linkedin_url`} label="LinkedIn URL" />
                  <Field name={`trainers.trainers.${i}.website_url`} label="Website URL" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================================
// STEP 9 — HOMEPAGE
// =====================================================================
export function Step9Homepage() {
  const t = useT();
  return (
    <div className="space-y-6">
      <StepHeader title={t("homepageTitle")} description={t("homepageDesc")} />
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <SwitchField name="homepage.homepage_visible" label={t("homepageVisible")} />
        <SwitchField name="homepage.is_featured" label={t("featured")} />
        <SwitchField name="homepage.is_popular" label={t("popular")} />
        <SwitchField name="homepage.is_trending" label={t("trending")} />
        <SwitchField name="homepage.is_new" label={t("isNew")} />
        <SwitchField name="homepage.is_recommended" label={t("recommended")} />
        <SwitchField name="homepage.show_in_slider" label={t("showInSlider")} />
        <SwitchField name="homepage.show_in_category" label={t("showInCategory")} />
        <SwitchField name="homepage.hero_banner" label={t("heroBanner")} />
      </div>
      <div className="max-w-xs">
        <Field name="homepage.homepage_order" label={t("homepageOrder")} type="number" />
      </div>
    </div>
  );
}

// =====================================================================
// STEP 10 — GOOGLE SEARCH / STRUCTURED DATA
// =====================================================================
export function Step10Search() {
  const t = useT();
  const { register } = useFormContext();
  return (
    <div className="space-y-6">
      <StepHeader title={t("searchTitle")} description={t("searchDesc")} />
      <div className="grid gap-2 sm:grid-cols-2">
        <SwitchField name="search.auto_generate" label={t("autoGenerate")} />
        <SwitchField name="search.enable_course" label={t("courseSchema")} />
        <SwitchField name="search.enable_breadcrumb" label={t("breadcrumbSchema")} />
        <SwitchField name="search.enable_faq" label={t("faqSchema")} />
        <SwitchField name="search.enable_organization" label={t("organizationSchema")} />
      </div>
      <div>
        <label className={labelCls}>{t("manualJsonld")}</label>
        <textarea
          {...register("search.manual_jsonld")}
          rows={8}
          className={inputCls + " font-mono text-xs"}
          placeholder='{"@context":"https://schema.org","@type":"Course"}'
        />
      </div>
    </div>
  );
}

// =====================================================================
// STEP 11 — ANALYTICS
// =====================================================================
export function Step11Analytics() {
  const t = useT();
  const { register } = useFormContext();
  return (
    <div className="space-y-6">
      <StepHeader title={t("analyticsTitle")} description={t("analyticsDesc")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="analytics.ga4_measurement_id" label={t("ga4Id")} />
        <Field name="analytics.fb_pixel_id" label={t("fbPixelId")} />
      </div>
      <div>
        <label className={labelCls}>{t("eventConfig")}</label>
        <textarea
          {...register("analytics.event_config")}
          rows={8}
          className={inputCls + " font-mono text-xs"}
          placeholder='{"lead":"generate_lead"}'
        />
      </div>
    </div>
  );
}
