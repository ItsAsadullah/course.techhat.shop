"use client";

import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import type { Path } from "react-hook-form";
import type { CourseFormValues } from "@/lib/schema/course-wizard.schema";
import { Plus, Trash2 } from "lucide-react";
import { useLang } from "@/context/GlobalLangContext";
import { courseWizardT } from "@/lib/i18n/course-wizard";
import { BilingualTextarea } from "../fields/BilingualTextarea";
import { BilingualArray, BilingualSkillArray } from "../fields/ArrayEditor";
import { FileUploadField } from "../fields/FileUploadField";
import { AiAssistButton } from "../fields/AiAssistButton";
import { inputCls, cardCls } from "../shared";
import { generateDescriptions, generateFaq } from "@/lib/admin/actions/ai-course";

export function Step2Content() {
  const { lang } = useLang();
  const t = (k: keyof typeof courseWizardT["en"]) => courseWizardT[lang][k];
  const { register, control, setValue } = useFormContext<CourseFormValues>();

  const nameEn = useWatch({ control, name: "general.name_en" });
  const nameBn = useWatch({ control, name: "general.name_bn" });
  const shortEn = useWatch({ control, name: "content.short_description_en" });

  const faqs = useFieldArray({ control, name: "content.faqs" });
  const testimonials = useFieldArray({ control, name: "content.testimonials" });

  const applyDescriptions = (d: Record<string, unknown>) => {
    const map: Record<string, string> = {
      short_description_en: d.short_description_en as string,
      short_description_bn: d.short_description_bn as string,
      long_description_en: d.long_description_en as string,
      long_description_bn: d.long_description_bn as string,
    };
    Object.entries(map).forEach(([k, v]) => v && setValue(`content.${k}` as Path<CourseFormValues>, v, { shouldDirty: true }));
    const arrays = [
      "learning_outcomes_en", "learning_outcomes_bn",
      "requirements_en", "requirements_bn",
      "who_should_join_en", "who_should_join_bn",
      "career_opportunities_en", "career_opportunities_bn",
    ];
    arrays.forEach((k) => Array.isArray(d[k]) && setValue(`content.${k}` as Path<CourseFormValues>, d[k], { shouldDirty: true }));
  };

  const aiCtx = { name: nameEn || nameBn, shortDescription: shortEn };

  return (
    <div className="space-y-7">
      <div className="flex justify-end">
        <AiAssistButton
          label="Generate all content with AI"
          action={() => generateDescriptions(aiCtx)}
          onResult={(d) => {
            const result = d as Record<string, unknown>;
            applyDescriptions(result);
          }}
        />
      </div>

      <BilingualTextarea
        label={t("shortDescription")}
        nameEn="content.short_description_en"
        nameBn="content.short_description_bn"
        rows={3}
        required
        hint="Recommended 20–160 characters. Used in cards, meta descriptions and search snippets."
      />

      <BilingualTextarea
        label={t("longDescription")}
        nameEn="content.long_description_en"
        nameBn="content.long_description_bn"
        rows={8}
      />

      <BilingualArray label={t("learningOutcomes")} nameEn="content.learning_outcomes_en" nameBn="content.learning_outcomes_bn" placeholder="e.g. Build responsive websites" />
      <BilingualArray label={t("requirements")} nameEn="content.requirements_en" nameBn="content.requirements_bn" placeholder="e.g. Basic computer skills" iconType="requirements" />
      <BilingualArray label={t("whoShouldJoin")} nameEn="content.who_should_join_en" nameBn="content.who_should_join_bn" placeholder="e.g. Students & job seekers" iconType="whoJoin" />
      <BilingualArray label={t("careerOpportunities")} nameEn="content.career_opportunities_en" nameBn="content.career_opportunities_bn" placeholder="e.g. Frontend Developer" />
      <BilingualSkillArray label={t("skills")} nameEn="content.skills_en" nameBn="content.skills_bn" placeholder="e.g. React" />
      <BilingualSkillArray label={t("softwareUsed")} nameEn="content.software_used_en" nameBn="content.software_used_bn" placeholder="e.g. VS Code" />
      <BilingualArray label={t("projects")} nameEn="content.projects_en" nameBn="content.projects_bn" placeholder="e.g. E-commerce site" iconType="projects" />

      <BilingualTextarea
        label={t("targetAudience")}
        nameEn="content.target_audience_en"
        nameBn="content.target_audience_bn"
        rows={2}
      />

      {/* FAQs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t("faqs")}</h3>
          <div className="flex gap-2">
            <AiAssistButton
              action={() => generateFaq(aiCtx)}
              onResult={(d) => {
                const result = d as { faqs?: Array<{ question_en: string; question_bn: string; answer_en: string; answer_bn: string }> } | null;
                if (result?.faqs) setValue("content.faqs", result.faqs, { shouldDirty: true });
              }}
            />
            <button
              type="button"
              onClick={() => faqs.append({ question_en: "", question_bn: "", answer_en: "", answer_bn: "" })}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-blue-300"
            >
              <Plus className="h-3.5 w-3.5" /> {t("addFaq")}
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {faqs.fields.map((f, i) => (
            <div key={f.id} className={cardCls + " !p-4"}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">#{i + 1}</span>
                <button type="button" onClick={() => faqs.remove(i)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <input {...register(`content.faqs.${i}.question_en`)} placeholder="Question (EN)" className={inputCls} />
                <input {...register(`content.faqs.${i}.question_bn`)} placeholder="প্রশ্ন (BN)" className={inputCls + " font-bn"} />
                <textarea {...register(`content.faqs.${i}.answer_en`)} rows={2} placeholder="Answer (EN)" className={inputCls} />
                <textarea {...register(`content.faqs.${i}.answer_bn`)} rows={2} placeholder="উত্তর (BN)" className={inputCls + " font-bn"} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t("testimonials")}</h3>
          <button
            type="button"
            onClick={() => testimonials.append({ author_name: "", author_image_url: "", rating: 5, body_en: "", body_bn: "" })}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-blue-300"
          >
            <Plus className="h-3.5 w-3.5" /> {t("addTestimonial")}
          </button>
        </div>
        <div className="space-y-3">
          {testimonials.fields.map((f, i) => (
            <div key={f.id} className={cardCls + " !p-4"}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">#{i + 1}</span>
                <button type="button" onClick={() => testimonials.remove(i)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                  <FileUploadField name={`content.testimonials.${i}.author_image_url`} label="Author Image" folder="courses" />
                  <div className="grid gap-2 sm:grid-cols-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Student Name</label>
                      <input {...register(`content.testimonials.${i}.author_name`)} placeholder="Student name" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Rating 1-5</label>
                      <input {...register(`content.testimonials.${i}.rating`, { valueAsNumber: true })} type="number" min={1} max={5} placeholder="Rating 1-5" className={inputCls} />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 mt-2">
                  <textarea {...register(`content.testimonials.${i}.body_en`)} rows={2} placeholder="Testimonial (EN)" className={inputCls} />
                  <textarea {...register(`content.testimonials.${i}.body_bn`)} rows={2} placeholder="মতামত (BN)" className={inputCls + " font-bn"} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Features */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">এই কোর্সে আপনি পাচ্ছেন:</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[
            { key: "has_certificate", label: "সার্টিফিকেট" },
            { key: "has_lifetime_support", label: "লাইফটাইম সাপোর্ট" },
            { key: "has_community_access", label: "কমিউনিটি এক্সেস" },
            { key: "has_private_group", label: "প্রাইভেট গ্রুপ" },
            { key: "has_live_qa", label: "লাইভ প্রশ্নোত্তর" },
            { key: "has_projects", label: "প্রজেক্টস" },
            { key: "has_assignments", label: "অ্যাসাইনমেন্ট" },
            { key: "has_exam", label: "ফাইনাল এক্সাম" },
            { key: "has_final_project", label: "ফাইনাল প্রজেক্ট" },
            { key: "has_job_guideline", label: "জব গাইডলাইন" },
            { key: "has_internship_support", label: "ইন্টার্নশিপ সাপোর্ট" },
            { key: "has_career_support", label: "ক্যারিয়ার সাপোর্ট" },
            { key: "has_freelancing_guide", label: "ফ্রিল্যান্সিং গাইডলাইন" },
            { key: "has_cv_review", label: "সিভি রিভিউ" },
            { key: "has_portfolio_review", label: "পোর্টফোলিও রিভিউ" },
          ].map((feature) => (
            <label key={feature.key} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-bn select-none cursor-pointer p-2 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 dark:hover:bg-slate-900 transition-colors">
              <input
                type="checkbox"
                {...register(`content.features.${feature.key}` as Path<CourseFormValues>)}
                className="w-4 h-4 text-blue-600 dark:text-blue-400 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500"
              />
              {feature.label}
            </label>
          ))}
        </div>
      </div>

      {/* Extra Features (Manual) */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">অতিরিক্ত সুবিধা (ম্যানুয়াল টাইপিং):</h3>
        <BilingualArray
          label=""
          nameEn="content.benefits_en"
          nameBn="content.benefits_bn"
          placeholder="e.g. 24/7 Support"
          iconType="whoJoin"
        />
      </div>
    </div>
  );
}
