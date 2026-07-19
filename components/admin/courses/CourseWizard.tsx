"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseWizardSchema, CourseWizardValues } from "@/lib/schema/course.schema";
import { CourseCategory } from "@/types/course";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createCourseWizard, updateCourseWizard } from "@/lib/admin/actions/courses";
import Step1BasicInfo from "./steps/Step1BasicInfo";
import Step2CourseInfo from "./steps/Step2CourseInfo";
import Step3Media from "./steps/Step3Media";
import Step4Duration from "./steps/Step4Duration";
import Step5Pricing from "./steps/Step5Pricing";
import {
  BookOpen, FileText, Image, Clock, DollarSign,
  ChevronLeft, ChevronRight, Check, Loader2, Save
} from "lucide-react";

const STEPS = [
  { id: 1, title: "বেসিক তথ্য", subtitle: "Basic Information", icon: BookOpen },
  { id: 2, title: "কোর্স বিবরণ", subtitle: "Course Information", icon: FileText },
  { id: 3, title: "মিডিয়া", subtitle: "Media & Files", icon: Image },
  { id: 4, title: "সময়সূচী", subtitle: "Duration & Schedule", icon: Clock },
  { id: 5, title: "মূল্য নির্ধারণ", subtitle: "Pricing", icon: DollarSign },
];

interface CourseWizardProps {
  categories: CourseCategory[];
  courseId?: string;
  defaultValues?: Partial<CourseWizardValues>;
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

export default function CourseWizard({ categories, courseId, defaultValues }: CourseWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);

  const form = useForm<CourseWizardValues>({
    // @ts-expect-error — Zod infers sub_category_id as string|undefined but form resolver types differ slightly
    resolver: zodResolver(courseWizardSchema),
    defaultValues: defaultValues ?? defaultWizardValues,
    mode: "onChange",
  });

  const goNext = async () => {
    // Validate only the current step's fields
    const stepKey = `step${currentStep}` as "step1" | "step2" | "step3" | "step4" | "step5";
    const isValid = await form.trigger(stepKey);
    
    if (isValid) {
      setDirection(1);
      setCurrentStep(s => Math.min(s + 1, STEPS.length));
    } else {
      toast.error("এই ধাপের সব তথ্য সঠিকভাবে পূরণ করুন");
    }
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentStep(s => Math.max(s - 1, 1));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const values = form.getValues();
      console.log("Submitting values:", values);
      
      const validation = courseWizardSchema.safeParse(values);
      if (!validation.success) {
        console.error("Validation Errors:", validation.error.flatten());
        toast.error("ফর্মের কিছু তথ্য ভুল বা অসম্পূর্ণ আছে। দয়া করে চেক করুন।");
        setIsSubmitting(false);
        return;
      }
      
      const data = validation.data;
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

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="flex gap-6 items-start">
      {/* Sidebar */}
      <div className="hidden lg:block w-56 flex-shrink-0">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sticky top-24">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">ধাপসমূহ</p>
          <nav className="space-y-1">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isDone = currentStep > step.id;
              const isActive = currentStep === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={async () => { 
                    if (step.id < currentStep) {
                      setDirection(-1); 
                      setCurrentStep(step.id); 
                    } else if (step.id > currentStep) {
                      // Only allow jumping forward if current is valid
                      const stepKey = `step${currentStep}` as "step1" | "step2" | "step3" | "step4" | "step5";
                      const isValid = await form.trigger(stepKey);
                      if (isValid) {
                        setDirection(1);
                        setCurrentStep(step.id);
                      } else {
                        toast.error("পরবর্তী ধাপে যেতে বর্তমান ধাপের তথ্য সঠিকভাবে পূরণ করুন");
                      }
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900"
                      : isDone
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isActive ? "bg-white/20" : isDone ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-slate-100 dark:bg-slate-800"
                  }`}>
                    {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{step.title}</p>
                    <p className={`text-[10px] truncate ${isActive ? "text-blue-100" : "text-slate-400"}`}>{step.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Progress */}
          <div className="mt-5 px-2">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>অগ্রগতি</span>
              <span>{Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="flex-1 min-w-0">
        <form onSubmit={handleManualSubmit}>
          {/* Step Header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-5">
            <div className="flex items-center gap-3 mb-1">
              {(() => { const Icon = STEPS[currentStep - 1].icon; return <Icon className="w-5 h-5 text-blue-600" />; })()}
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                ধাপ {currentStep}: {STEPS[currentStep - 1].title}
              </h2>
            </div>
            <p className="text-sm text-slate-500 ml-8">{STEPS[currentStep - 1].subtitle}</p>

            {/* Mobile Step Pills */}
            <div className="flex gap-1.5 mt-4 lg:hidden">
              {STEPS.map(s => (
                <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-colors ${currentStep >= s.id ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-700"}`} />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-5 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {currentStep === 1 && <Step1BasicInfo form={form as unknown as Parameters<typeof Step1BasicInfo>[0]["form"]} categories={categories} />}
                {currentStep === 2 && <Step2CourseInfo form={form as unknown as Parameters<typeof Step2CourseInfo>[0]["form"]} />}
                {currentStep === 3 && <Step3Media form={form as unknown as Parameters<typeof Step3Media>[0]["form"]} />}
                {currentStep === 4 && <Step4Duration form={form as unknown as Parameters<typeof Step4Duration>[0]["form"]} />}
                {currentStep === 5 && <Step5Pricing form={form as unknown as Parameters<typeof Step5Pricing>[0]["form"]} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> আগে
            </button>

            <span className="text-xs text-slate-400 font-medium">{currentStep} / {STEPS.length}</span>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-200 dark:shadow-blue-900 transition-all"
              >
                পরবর্তী <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-bold shadow-md shadow-emerald-200 dark:shadow-emerald-900 transition-all"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSubmitting ? "সেভ হচ্ছে..." : courseId ? "আপডেট করুন" : "কোর্স তৈরি করুন"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

