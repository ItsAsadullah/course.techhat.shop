"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseWizardSchema, CourseWizardValues } from "@/lib/schema/course.schema";
import { CourseCategory } from "@/types/course";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCourseWizard, updateCourseWizard } from "@/lib/admin/actions/courses";
import { generateCourseWithAI } from "@/lib/admin/actions/ai";
import { AiModel } from "@/components/settings/IntegrationsSettingsForm";
import {
  Save, Loader2, Sparkles, AlertCircle, LayoutDashboard, Settings
} from "lucide-react";
import Link from "next/link";

const inputCls = "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all placeholder:text-slate-400";
const labelCls = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
const sectionTitle = "text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2";

interface SingleCourseFormProps {
  categories: CourseCategory[];
  courseId?: string;
  defaultValues?: Partial<CourseWizardValues>;
  aiModels?: AiModel[];
  defaultAiModelId?: string;
}

const defaultWizardValues: CourseWizardValues = {
  step1: {
    name_en: "", name_bn: "", slug_en: "", slug_bn: "", course_code: "",
    category_id: "", sub_category_id: "",
    course_type: "offline", course_level: "beginner", status: "draft",
    is_featured: false, is_popular: false, is_trending: false, is_new: true,
  },
  step2: {
    short_description_en: "", short_description_bn: "",
    long_description_en: "", long_description_bn: "",
    objectives_en: "", objectives_bn: "",
    learning_outcomes_en: "", learning_outcomes_bn: "",
    benefits_en: "", benefits_bn: "",
    who_should_join_en: "", who_should_join_bn: "",
    requirements_en: "", requirements_bn: "",
    skills_covered_en: "", skills_covered_bn: "",
    career_opportunities_en: "", career_opportunities_bn: "",
  },
  step3: { thumbnail_url: "", banner_url: "", intro_video_url: "", demo_video_url: "", brochure_pdf_url: "" },
  step4: {
    duration_text_en: "", duration_text_bn: "",
    class_days: [], is_lifetime_access: false,
    class_time_start: "", class_time_end: "",
    start_date: "", end_date: "", admission_deadline: "",
  },
  step5: {
    course_fee: 0, admission_fee: 0, monthly_fee: 0,
    is_free: false, discount_percent: 0,
    scholarship_available: false,
    installment_available: false, installment_count: 0,
    certificate_option: "included", certificate_fee: 0,
  },
};

export default function SingleCourseForm({ categories, courseId, defaultValues, aiModels = [], defaultAiModelId = "" }: SingleCourseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [selectedAiModel, setSelectedAiModel] = useState(defaultAiModelId || aiModels[0]?.id || "");
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<CourseWizardValues>({
    // @ts-expect-error — Zod infers sub_category_id as string|undefined but resolver types differ slightly
    resolver: zodResolver(courseWizardSchema),
    defaultValues: defaultValues ?? defaultWizardValues,
    mode: "onChange",
  });

  const { register, watch, setValue, getValues, formState: { errors } } = form;

  const onSubmit = async (data: CourseWizardValues) => {
    setIsSubmitting(true);
    
    try {
      const result = courseId
        ? await updateCourseWizard(courseId, data)
        : await createCourseWizard(data);

      if (result && "error" in result && result.error) {
        toast.error(result.error);
      } else {
        toast.success(courseId ? "কোর্স আপডেট হয়েছে!" : "কোর্স সফলভাবে তৈরি হয়েছে!");
        router.push("/admin/courses");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (formErrors: import("react-hook-form").FieldErrors) => {
    console.log("Validation Errors:", formErrors);
    
    const getFirstError = (obj: unknown): string | null => {
      if (!obj || typeof obj !== "object") return null;
      const record = obj as Record<string, unknown>;
      if (record.message && typeof record.message === "string") return record.message;
      for (const key in record) {
        const val = getFirstError(record[key]);
        if (val) return val;
      }
      return null;
    };
    
    const msg = getFirstError(formErrors);
    toast.error(msg ? `ভুল তথ্য: ${msg}` : "ফর্মের কিছু তথ্য ভুল বা অসম্পূর্ণ আছে। লাল দাগ দেয়া ফিল্ডগুলো চেক করুন।");
  };

  const handleAIGenerate = async () => {
    if (!aiTopic.trim()) {
      toast.error("দয়া করে একটি টপিক লিখুন (যেমন: Graphic Design, Python etc)");
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading("AI দিয়ে কোর্সের তথ্য তৈরি করা হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন...");
    
    try {
      const result = await generateCourseWithAI(aiTopic, selectedAiModel);
      if (result.error) {
        toast.error(result.error, { id: toastId });
      } else if (result.data) {
        // Auto Fill the fields
        const d = result.data;
        
        setValue("step1.name_en", d.name_en || "");
        setValue("step1.name_bn", d.name_bn || "");
        setValue("step1.slug_en", generateSlug(d.name_en || ""));
        setValue("step1.slug_bn", generateSlug(d.name_bn || "", true));
        if (!getValues("step1.course_code")) setValue("step1.course_code", generateCode(d.name_en || ""));

        setValue("step2.short_description_en", d.short_description_en || "");
        setValue("step2.short_description_bn", d.short_description_bn || "");
        setValue("step2.long_description_en", d.long_description_en || "");
        setValue("step2.long_description_bn", d.long_description_bn || "");
        setValue("step2.objectives_en", d.objectives_en || "");
        setValue("step2.objectives_bn", d.objectives_bn || "");
        setValue("step2.learning_outcomes_en", d.learning_outcomes_en || "");
        setValue("step2.learning_outcomes_bn", d.learning_outcomes_bn || "");
        setValue("step2.who_should_join_en", d.who_should_join_en || "");
        setValue("step2.who_should_join_bn", d.who_should_join_bn || "");
        setValue("step2.requirements_en", d.requirements_en || "");
        setValue("step2.requirements_bn", d.requirements_bn || "");
        setValue("step2.career_opportunities_en", d.career_opportunities_en || "");
        setValue("step2.career_opportunities_bn", d.career_opportunities_bn || "");

        toast.success("সফলভাবে কোর্সের তথ্য অটো-ফিল করা হয়েছে!", { id: toastId });
      }
    } catch (e) {
      toast.error("AI জেনারেশন ফেইল হয়েছে", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  function generateSlug(text: string, bn = false) {
    if (bn) return `course-${Date.now()}`;
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").trim();
  }

  function generateCode(name: string) {
    const prefix = name.toUpperCase().split(" ").map((w: string) => w[0]).join("").slice(0, 4);
    const suffix = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${suffix}`;
  }

  const e1 = errors.step1 || {};
  const e2 = errors.step2 || {};
  const e3 = errors.step3 || {};
  const e4 = errors.step4 || {};
  const e5 = errors.step5 || {};

  return (
    // @ts-expect-error — SubmitHandler type mismatch from Zod schema inference, safe at runtime
    <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6 max-w-[1400px]">
      
      {/* AI Generate Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 shadow-lg border border-blue-800">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/200/20 text-blue-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">AI Course Generator</h3>
            <p className="text-sm text-blue-200">কোর্সের টপিক লিখুন, AI আপনার হয়ে বাকি সব ডেটা (বাংলা এবং ইংরেজি) পূরণ করে দেবে।</p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2">
            <select 
              className="px-3 py-2.5 rounded-xl border-0 bg-black/20 text-white w-full md:w-40 focus:ring-2 focus:ring-blue-400 outline-none text-sm appearance-none cursor-pointer"
              value={selectedAiModel}
              onChange={(e) => setSelectedAiModel(e.target.value)}
            >
              {aiModels.length === 0 ? (
                <option value="">No Models</option>
              ) : (
                aiModels.map(m => (
                  <option key={m.id} value={m.id} className="text-black bg-white dark:bg-slate-900">
                    {m.provider.toUpperCase()} - {m.modelName}
                  </option>
                ))
              )}
            </select>
            <input 
              type="text" 
              placeholder="e.g. Graphic Design Masterclass" 
              className="px-4 py-2.5 rounded-xl border-0 bg-black/20 text-white placeholder:text-blue-300/50 w-full md:w-64 focus:ring-2 focus:ring-blue-400 outline-none"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/200 hover:bg-blue-600 disabled:opacity-50 text-white font-bold transition-all whitespace-nowrap"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "জেনোরেট করুন"}
            </button>
          </div>
        </div>
      </div>

      {/* Global Settings / Common */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className={sectionTitle}>গ্লোবাল সেটিংস (Global Settings)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div>
            <label className={labelCls}>ক্যাটাগরি *</label>
            <select {...register("step1.category_id")} className={inputCls}>
              <option value="">ক্যাটাগরি বাছুন</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name_bn} / {cat.name_en}</option>
              ))}
            </select>
            {e1.category_id && <p className="text-red-500 text-xs mt-1">{e1.category_id.message}</p>}
          </div>
          <div>
            <label className={labelCls}>কোর্স কোড *</label>
            <input {...register("step1.course_code")} className={inputCls} placeholder="e.g. GD-1023" />
            {e1.course_code && <p className="text-red-500 text-xs mt-1">{e1.course_code.message}</p>}
          </div>
          <div>
            <label className={labelCls}>স্ট্যাটাস *</label>
            <select {...register("step1.status")} className={inputCls}>
              <option value="draft">ড্রাফট (Draft)</option>
              <option value="published">প্রকাশিত (Published)</option>
              <option value="archived">আর্কাইভড (Archived)</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>কোর্সের ধরন *</label>
            <select {...register("step1.course_type")} className={inputCls}>
              <option value="offline">অফলাইন</option>
              <option value="online">অনলাইন</option>
              <option value="hybrid">হাইব্রিড</option>
              <option value="recorded">রেকর্ডেড</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-4 mt-5">
          <label className="flex items-center gap-2"><input type="checkbox" {...register("step1.is_featured")} /> ফিচার্ড (হোমপেজ)</label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register("step1.is_popular")} /> পপুলার</label>
        </div>
      </div>

      {/* Language Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ================= BENGALI SIDE ================= */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-t-4 border-t-emerald-500 border-x border-b border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">বাংলা তথ্য (Bengali)</h3>
            
            <div className="space-y-5">
              <div>
                <label className={labelCls}>কোর্সের নাম *</label>
                <input {...register("step1.name_bn")} className={inputCls} />
                {e1.name_bn && <p className="text-red-500 text-xs mt-1">{e1.name_bn.message}</p>}
              </div>
              <div>
                <label className={labelCls}>স্লাগ (URL) *</label>
                <input {...register("step1.slug_bn")} className={inputCls} />
                {e1.slug_bn && <p className="text-red-500 text-xs mt-1">{e1.slug_bn.message}</p>}
              </div>
              <div>
                <label className={labelCls}>শর্ট ডেসক্রিপশন (সর্বনিম্ন ২০ অক্ষর) *</label>
                <textarea {...register("step2.short_description_bn")} className={`${inputCls} h-20 resize-none`} />
                {e2.short_description_bn && <p className="text-red-500 text-xs mt-1">{e2.short_description_bn.message}</p>}
              </div>
              <div>
                <label className={labelCls}>লং ডেসক্রিপশন (বিস্তারিত)</label>
                <textarea {...register("step2.long_description_bn")} className={`${inputCls} h-32`} />
              </div>
              <div>
                <label className={labelCls}>শেখার ফলাফল (Learning Outcomes)</label>
                <textarea {...register("step2.learning_outcomes_bn")} className={`${inputCls} h-24`} placeholder="প্রতি লাইনে একটি পয়েন্ট লিখুন" />
              </div>
              <div>
                <label className={labelCls}>পূর্বশর্ত (Requirements)</label>
                <textarea {...register("step2.requirements_bn")} className={`${inputCls} h-24`} placeholder="প্রতি লাইনে একটি পয়েন্ট লিখুন" />
              </div>
              <div>
                <label className={labelCls}>কারা যোগ দেবেন (Who should join)</label>
                <textarea {...register("step2.who_should_join_bn")} className={`${inputCls} h-24`} placeholder="প্রতি লাইনে একটি পয়েন্ট লিখুন" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= ENGLISH SIDE ================= */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-t-4 border-t-blue-500 border-x border-b border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">English Information</h3>
            
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Course Name *</label>
                <input {...register("step1.name_en")} className={inputCls} />
                {e1.name_en && <p className="text-red-500 text-xs mt-1">{e1.name_en.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Slug (URL) *</label>
                <input {...register("step1.slug_en")} className={inputCls} />
                {e1.slug_en && <p className="text-red-500 text-xs mt-1">{e1.slug_en.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Short Description (Min 20 chars) *</label>
                <textarea {...register("step2.short_description_en")} className={`${inputCls} h-20 resize-none`} />
                {e2.short_description_en && <p className="text-red-500 text-xs mt-1">{e2.short_description_en.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Long Description (Detailed)</label>
                <textarea {...register("step2.long_description_en")} className={`${inputCls} h-32`} />
              </div>
              <div>
                <label className={labelCls}>Learning Outcomes</label>
                <textarea {...register("step2.learning_outcomes_en")} className={`${inputCls} h-24`} placeholder="One point per line" />
              </div>
              <div>
                <label className={labelCls}>Requirements</label>
                <textarea {...register("step2.requirements_en")} className={`${inputCls} h-24`} placeholder="One point per line" />
              </div>
              <div>
                <label className={labelCls}>Who should join</label>
                <textarea {...register("step2.who_should_join_en")} className={`${inputCls} h-24`} placeholder="One point per line" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Media, Duration, Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MEDIA */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className={sectionTitle}>মিডিয়া (Media)</h3>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Thumbnail URL (3:2)</label>
              <input {...register("step3.thumbnail_url")} className={inputCls} />
              {e3.thumbnail_url && <p className="text-red-500 text-xs mt-1">{e3.thumbnail_url.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Banner URL (16:9)</label>
              <input {...register("step3.banner_url")} className={inputCls} />
              {e3.banner_url && <p className="text-red-500 text-xs mt-1">{e3.banner_url.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Intro Video URL (YouTube)</label>
              <input {...register("step3.intro_video_url")} className={inputCls} />
            </div>
          </div>
        </div>

        {/* DURATION */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className={sectionTitle}>সময়সূচী (Duration)</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>সময়কাল (Bangla) *</label>
                <input {...register("step4.duration_text_bn")} className={inputCls} placeholder="৩ মাস" />
                {e4.duration_text_bn && <p className="text-red-500 text-xs mt-1">{e4.duration_text_bn.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Duration (English) *</label>
                <input {...register("step4.duration_text_en")} className={inputCls} placeholder="3 Months" />
                {e4.duration_text_en && <p className="text-red-500 text-xs mt-1">{e4.duration_text_en.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>মোট ক্লাস</label>
                <input type="number" {...register("step4.total_classes")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>মোট ঘন্টা</label>
                <input type="number" {...register("step4.total_hours")} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>শুরুর তারিখ</label>
                <input type="date" {...register("step4.start_date")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>ভর্তির শেষ তারিখ</label>
                <input type="date" {...register("step4.admission_deadline")} className={inputCls} />
              </div>
            </div>
          </div>
        </div>

        {/* PRICING */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className={sectionTitle}>মূল্য নির্ধারণ (Pricing)</h3>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>কোর্স ফি (Regular) ৳ *</label>
              <input type="number" {...register("step5.course_fee")} className={inputCls} />
              {e5.course_fee && <p className="text-red-500 text-xs mt-1">{e5.course_fee.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>ভর্তি ফি ৳</label>
                <input type="number" {...register("step5.admission_fee")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>মাসিক ফি ৳</label>
                <input type="number" {...register("step5.monthly_fee")} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>ডিসকাউন্ট %</label>
              <input type="number" {...register("step5.discount_percent")} className={inputCls} max={100} />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" {...register("step5.is_free")} /> বিনামূল্যে (Free)</label>
              <label className="flex items-center gap-2"><input type="checkbox" {...register("step5.installment_available")} /> কিস্তি সুবিধা</label>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-0 z-50 bg-white/80 dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 -mx-6 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)] px-6">
        <Link href="/admin/courses" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 transition-colors">বাতিল করুন</Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-base font-bold shadow-md shadow-emerald-200 dark:shadow-emerald-900 transition-all"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSubmitting ? "সেভ হচ্ছে..." : courseId ? "কোর্স আপডেট করুন" : "কোর্স তৈরি করুন"}
        </button>
      </div>
    </form>
  );
}
