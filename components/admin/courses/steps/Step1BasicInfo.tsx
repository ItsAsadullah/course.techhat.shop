"use client";

import type { CourseWizardValues } from "@/lib/schema/course.schema";
import type { CourseCategory } from "@/types/course";
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

const COURSE_TYPES = [
  { value: "offline", label: "অফলাইন (Offline)" },
  { value: "online", label: "অনলাইন (Online)" },
  { value: "hybrid", label: "হাইব্রিড (Hybrid)" },
  { value: "workshop", label: "ওয়ার্কশপ (Workshop)" },
  { value: "seminar", label: "সেমিনার (Seminar)" },
  { value: "bootcamp", label: "বুটক্যাম্প (Bootcamp)" },
  { value: "live_class", label: "লাইভ ক্লাস (Live Class)" },
  { value: "recorded", label: "রেকর্ডেড (Recorded)" },
];

const COURSE_LEVELS = [
  { value: "beginner", label: "শিক্ষানবিস (Beginner)" },
  { value: "intermediate", label: "মধ্যবর্তী (Intermediate)" },
  { value: "advanced", label: "উন্নত (Advanced)" },
  { value: "all_levels", label: "সব স্তর (All Levels)" },
];

const STATUSES = [
  { value: "draft", label: "ড্রাফট (Draft)" },
  { value: "published", label: "প্রকাশিত (Published)" },
  { value: "archived", label: "আর্কাইভড (Archived)" },
];

interface Step1Props {
  form: UseFormReturn<CourseWizardValues>;
  categories: CourseCategory[];
}

function generateSlug(text: string, bn = false) {
  if (bn) {
    return `course-${Date.now()}`;
  }
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function generateCode(name: string) {
  const prefix = name.toUpperCase().split(" ").map(w => w[0]).join("").slice(0, 4);
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${suffix}`;
}

const inputCls = "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all placeholder:text-slate-400";
const labelCls = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
const errorCls = "text-red-500 text-xs mt-1";

export default function Step1BasicInfo({ form, categories }: Step1Props) {
  const { register, watch, setValue, formState: { errors } } = form;
  const nameEn = watch("step1.name_en");

  // Auto-generate slug and code when name changes
  useEffect(() => {
    if (nameEn) {
      setValue("step1.slug_en", generateSlug(nameEn));
      const code = watch("step1.course_code");
      if (!code) setValue("step1.course_code", generateCode(nameEn));
    }
  }, [nameEn]);

  const step1Errors = errors.step1 || {};

  return (
    <div className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>কোর্সের নাম (Bangla) *</label>
          <input {...register("step1.name_bn")} placeholder="যেমন: গ্রাফিক ডিজাইন কোর্স" className={inputCls} />
          {step1Errors.name_bn && <p className={errorCls}>{step1Errors.name_bn.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Course Name (English) *</label>
          <input {...register("step1.name_en")} placeholder="e.g. Graphic Design Course" className={inputCls} />
          {step1Errors.name_en && <p className={errorCls}>{step1Errors.name_en.message}</p>}
        </div>
      </div>

      {/* Slugs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>স্লাগ (Bangla URL) *</label>
          <input {...register("step1.slug_bn")} placeholder="যেমন: graphic-design-course-bn" className={inputCls} />
          {step1Errors.slug_bn && <p className={errorCls}>{step1Errors.slug_bn.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Slug (English URL) *</label>
          <div className="relative">
            <input {...register("step1.slug_en")} placeholder="e.g. graphic-design-course" className={inputCls} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">auto</span>
          </div>
          {step1Errors.slug_en && <p className={errorCls}>{step1Errors.slug_en.message}</p>}
        </div>
      </div>

      {/* Code & Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className={labelCls}>কোর্স কোড *</label>
          <input {...register("step1.course_code")} placeholder="e.g. GD-1023" className={`${inputCls} font-mono`} />
          {step1Errors.course_code && <p className={errorCls}>{step1Errors.course_code.message}</p>}
        </div>
        <div>
          <label className={labelCls}>ক্যাটাগরি *</label>
          <select {...register("step1.category_id")} className={inputCls}>
            <option value="">ক্যাটাগরি বাছুন</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name_bn} / {cat.name_en}</option>
            ))}
          </select>
          {step1Errors.category_id && <p className={errorCls}>{step1Errors.category_id.message}</p>}
        </div>
        <div>
          <label className={labelCls}>সাব-ক্যাটাগরি</label>
          <select {...register("step1.sub_category_id")} className={inputCls}>
            <option value="">সাব-ক্যাটাগরি (ঐচ্ছিক)</option>
          </select>
        </div>
      </div>

      {/* Type & Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>কোর্সের ধরন *</label>
          <select {...register("step1.course_type")} className={inputCls}>
            {COURSE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>কোর্স লেভেল *</label>
          <select {...register("step1.course_level")} className={inputCls}>
            {COURSE_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className={labelCls}>স্ট্যাটাস *</label>
          <select {...register("step1.status")} className={inputCls}>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Toggles */}
      <div>
        <label className={`${labelCls} mb-3`}>বিশেষ ট্যাগ</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { field: "step1.is_featured" as const, label: "⭐ ফিচার্ড", desc: "হোমপেজে দেখাবে" },
            { field: "step1.is_popular" as const, label: "🔥 জনপ্রিয়", desc: "Popular ব্যাজ" },
            { field: "step1.is_trending" as const, label: "📈 ট্রেন্ডিং", desc: "Trending ব্যাজ" },
            { field: "step1.is_new" as const, label: "🆕 নতুন", desc: "New ব্যাজ" },
          ].map(({ field, label, desc }) => {
            const checked = watch(field);
            return (
              <label key={field} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${checked ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"}`}>
                <input type="checkbox" {...register(field)} className="sr-only" />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${checked ? "border-blue-500 bg-blue-50 dark:bg-blue-900/200" : "border-slate-300 dark:border-slate-600"}`}>
                  {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

