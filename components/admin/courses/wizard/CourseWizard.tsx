"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, Sparkles, Bot, Loader2 } from "lucide-react";
import { useLang } from "@/context/GlobalLangContext";
import { courseWizardT } from "@/lib/i18n/course-wizard";
import {
  courseWizardSchemaV2,
  defaultCourseFormValues,
  WIZARD_STEPS,
  STEP_FIELD_MAP,
  type CourseFormValues,
} from "@/lib/schema/course-wizard.schema";
import { useCourseWizardStore } from "@/lib/store/course-wizard.store";
import { createCourseDraft, saveCourse, publishCourse } from "@/lib/admin/actions/course-wizard";
import { generateCourseWithAI } from "@/lib/admin/actions/ai";
import type { CourseCategory } from "@/types/course";
import type { AiModel } from "@/components/settings/IntegrationsSettingsForm";
import { WizardSidebar } from "./WizardSidebar";
import { WizardSaveBar } from "./WizardSaveBar";
import { LanguageToggle } from "./fields/LanguageToggle";
import { Step1General } from "./steps/Step1General";
import { Step2Content } from "./steps/Step2Content";
import { Step3Seo } from "./steps/Step3Seo";
import {
  Step4Media,
  Step5Schedule,
  Step6Pricing,
  Step7Curriculum,
  Step8Trainers,
  Step9Homepage,
  Step10Search,
  Step11Analytics,
} from "./steps/AdditionalSteps";
import { cardCls } from "./shared";

interface CourseWizardProps {
  mode: "new" | "edit";
  courseId?: string;
  categories: CourseCategory[];
  initialValues?: CourseFormValues;
  courseCode?: string;
  initialStatus?: string;
  aiModels?: AiModel[];
}

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600 dark:text-slate-300 dark:bg-slate-800 dark:text-slate-300",
  published: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-500 dark:bg-emerald-50 dark:bg-emerald-900/100/15 dark:text-emerald-400",
  archived: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-500 dark:bg-amber-50 dark:bg-amber-900/100/15 dark:text-amber-400",
};

export function CourseWizard({
  mode,
  courseId: initialId,
  categories,
  initialValues,
  courseCode,
  initialStatus,
  aiModels = [],
}: CourseWizardProps) {
  const router = useRouter();
  const { lang } = useLang();
  const t = (k: keyof typeof courseWizardT["en"]) => courseWizardT[lang][k];

  const getInitialValues = () => {
    // On hard reload or remount, recover from store if available
    const storeValues = useCourseWizardStore.getState().formValues;
    if (initialValues) return initialValues;
    if (mode === "new" && storeValues) return storeValues;
    return defaultCourseFormValues;
  };

  const methods = useForm<CourseFormValues>({
    // @ts-expect-error \u2014 Zod optional().default("") infers string|undefined but resolver expects strict string
    resolver: zodResolver(courseWizardSchemaV2),
    defaultValues: getInitialValues(),
    mode: "onChange",
  });

  const activeStep = useCourseWizardStore((s) => s.activeStep);
  const setActiveStep = useCourseWizardStore((s) => s.setActiveStep);
  const setSaveStatus = useCourseWizardStore((s) => s.setSaveStatus);
  const setDirty = useCourseWizardStore((s) => s.setDirty);
  const setStepCompleted = useCourseWizardStore((s) => s.setStepCompleted);
  const setStoreCourseId = useCourseWizardStore((s) => s.setCourseId);
  const setFormValues = useCourseWizardStore((s) => s.setFormValues);

  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState(initialStatus ?? "draft");
  
  const [selectedModelId, setSelectedModelId] = useState<string>(aiModels.length > 0 ? aiModels[0].id : "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const idRef = useRef<string | null>(initialId ?? null);
  const savingRef = useRef(false);
  const pendingRef = useRef(false);

  // If the store already has a draft from a previous remount in the same session, recover its ID.
  if (mode === "new" && !idRef.current) {
    const storeCourseId = useCourseWizardStore.getState().courseId;
    if (storeCourseId) idRef.current = storeCourseId;
  }

  // ----- init store & responsive -----
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Only reset if this is a genuinely new session (no form values yet and no course ID)
    if (!useCourseWizardStore.getState().formValues && !idRef.current) {
      useCourseWizardStore.getState().reset();
    }
    setStoreCourseId(idRef.current);
    if (initialValues) {
      computeCompletion(initialValues);
    }
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const computeCompletion = useCallback(
    (values: CourseFormValues) => {
      for (const step of WIZARD_STEPS) {
        const field = STEP_FIELD_MAP[step.key];
        if (!field) continue;
        const schema = (courseWizardSchemaV2.shape as Record<string, { safeParse: (val: unknown) => { success: boolean } }>)[field];
        setStepCompleted(step.key, schema?.safeParse(values[field])?.success ?? false);
      }
    },
    [setStepCompleted]
  );

  // ----- save (autosave + manual) -----
  const doSave = useCallback(async () => {
    if (savingRef.current) {
      pendingRef.current = true;
      return;
    }
    savingRef.current = true;
    setSaveStatus("saving");
    try {
      const values = methods.getValues();
      // Keep store updated with latest values for remount recovery
      setFormValues(values);

      if (!idRef.current) {
        const res = (await createCourseDraft()) as { error?: string; courseId?: string };
        if (res?.error) {
          setSaveStatus("error");
          toast.error(res.error);
          return;
        }
        idRef.current = res.courseId ?? null;
        setStoreCourseId(res.courseId ?? null);
        // Removed auto course code generation here since we removed autosave
      }
      const res = (await saveCourse(idRef.current!, values)) as { error?: string };
      if (res?.error) {
        setSaveStatus("error");
        toast.error(res.error);
      } else {
        setSaveStatus("saved", Date.now());
        computeCompletion(values);
      }
    } catch (e: unknown) {
      setSaveStatus("error");
      toast.error((e as Error)?.message || "Save failed");
    } finally {
      savingRef.current = false;
      if (pendingRef.current) {
        pendingRef.current = false;
        doSave();
      }
    }
  }, [computeCompletion, methods, setSaveStatus, setStoreCourseId, setFormValues]);

  // ----- warn on unload if dirty -----
  useEffect(() => {
    const sub = methods.watch(() => {
      setDirty(true);
      // Immediately backup to store on every keystroke
      setFormValues(methods.getValues());
    });
    return () => sub.unsubscribe();
  }, [methods, setDirty, setFormValues]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (useCourseWizardStore.getState().isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // ----- publish -----
  const onPublish = async () => {
    setPublishing(true);
    try {
      if (!idRef.current) await doSave();
      if (!idRef.current) return;
      const res = (await publishCourse(idRef.current, methods.getValues())) as { error?: string };
      if (res?.error) {
        toast.error(res.error);
      } else {
        setStatus("published");
        methods.setValue("general.status", "published");
        setSaveStatus("saved", Date.now());
        useCourseWizardStore.getState().reset();
        toast.success("Course published");
        router.push("/admin/courses");
      }
    } finally {
      setPublishing(false);
    }
  };

  const onPreview = () => {
    const slug = methods.getValues("general.slug_en") || methods.getValues("general.slug_bn");
    if (slug) window.open(`/courses/${slug}`, "_blank");
    else toast.error("Add a slug first");
  };

  const handleMagicAutoFill = async () => {
    const nameEn = methods.getValues("general.name_en");
    const nameBn = methods.getValues("general.name_bn");
    const topic = nameEn || nameBn;
    
    if (!topic || topic.trim().length < 3) {
      toast.error("Please enter a course name first.");
      return;
    }

    if (!selectedModelId) {
      toast.error("Please select an AI model.");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("Generating full course content with AI...");
    
    try {
      const res = await generateCourseWithAI(topic, selectedModelId);
      if (res?.error) {
        toast.error(res.error, { id: loadingToast });
      } else if (res?.data) {
        const d = res.data;
        // Helper to safely set values
        const setVal = (path: string, val: unknown) => {
          if (val !== undefined && val !== null && val !== "") {
            methods.setValue(path as import("react-hook-form").Path<CourseFormValues>, val as import("react-hook-form").PathValue<CourseFormValues, import("react-hook-form").Path<CourseFormValues>>, { shouldDirty: true, shouldValidate: true });
          }
        };

        const genSlug = (str: string) => str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

        if (d.general) {
          setVal("general.name_en", d.general.name_en);
          setVal("general.name_bn", d.general.name_bn);
          setVal("general.course_code", d.general.course_code);
          if (d.general.tags && Array.isArray(d.general.tags)) setVal("general.tags", d.general.tags);
          
          setVal("general.slug_en", genSlug(d.general.name_en || topic));
          setVal("general.slug_bn", genSlug(d.general.name_en || topic));
        }

        if (d.content) {
          setVal("content.short_description_en", d.content.short_description_en);
          setVal("content.short_description_bn", d.content.short_description_bn);
          setVal("content.long_description_en", d.content.long_description_en);
          setVal("content.long_description_bn", d.content.long_description_bn);
          setVal("content.target_audience_en", d.content.target_audience_en);
          setVal("content.target_audience_bn", d.content.target_audience_bn);
          
          const arrays = ["learning_outcomes", "who_should_join", "requirements", "career_opportunities", "skills", "software_used", "projects"];
          arrays.forEach(k => {
            if (Array.isArray(d.content[`${k}_en`])) setVal(`content.${k}_en`, d.content[`${k}_en`]);
            if (Array.isArray(d.content[`${k}_bn`])) setVal(`content.${k}_bn`, d.content[`${k}_bn`]);
          });

          if (Array.isArray(d.content.faqs)) setVal("content.faqs", d.content.faqs);
          if (Array.isArray(d.content.testimonials)) setVal("content.testimonials", d.content.testimonials);
        }

        if (d.seo) {
          if (d.seo.en) {
            setVal("seo.en.meta_title", d.seo.en.meta_title);
            setVal("seo.en.meta_description", d.seo.en.meta_description);
            setVal("seo.en.meta_keywords", d.seo.en.meta_keywords);
            setVal("seo.en.focus_keyword", d.seo.en.focus_keyword);
            setVal("seo.en.canonical_url", d.seo.en.canonical_url);
            setVal("seo.en.og_title", d.seo.en.og_title);
            setVal("seo.en.og_description", d.seo.en.og_description);
          }
          if (d.seo.bn) {
            setVal("seo.bn.meta_title", d.seo.bn.meta_title);
            setVal("seo.bn.meta_description", d.seo.bn.meta_description);
            setVal("seo.bn.meta_keywords", d.seo.bn.meta_keywords);
            setVal("seo.bn.focus_keyword", d.seo.bn.focus_keyword);
            setVal("seo.bn.canonical_url", d.seo.bn.canonical_url);
            setVal("seo.bn.og_title", d.seo.bn.og_title);
            setVal("seo.bn.og_description", d.seo.bn.og_description);
          }
        }

        if (d.curriculum?.modules && Array.isArray(d.curriculum.modules)) {
          setVal("curriculum.modules", d.curriculum.modules);
        }

        if (d.search?.manual_jsonld) {
          setVal("search.manual_jsonld", d.search.manual_jsonld);
        }

        if (d.analytics?.event_config) {
          setVal("analytics.event_config", d.analytics.event_config);
        }
        
        toast.success("Course content auto-filled!", { id: loadingToast });
      }
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "Generation failed", { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = (key: string) => {
    switch (key) {
      case "general":
        return <Step1General categories={categories} />;
      case "content":
        return <Step2Content />;
      case "seo":
        return <Step3Seo />;
      case "media":
        return <Step4Media />;
      case "schedule":
        return <Step5Schedule />;
      case "pricing":
        return <Step6Pricing />;
      case "curriculum":
        return <Step7Curriculum />;
      case "trainers":
        return <Step8Trainers />;
      case "homepage":
        return <Step9Homepage />;
      case "search":
        return <Step10Search />;
      case "analytics":
        return <Step11Analytics />;
      case "review":
        return <ReviewStep onPublish={onPublish} publishing={publishing} status={status} />;
      default:
        return <p className="text-sm text-slate-400">{t("comingSoon")}</p>;
    }
  };

  const activeSteps = WIZARD_STEPS;

  return (
    <FormProvider {...methods}>
      <div className="mx-auto max-w-7xl pb-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-5">
          <div>
            <h1 className={`text-xl font-bold text-slate-900 dark:text-slate-50 ${lang === "bn" ? "font-bn" : ""}`}>
              {mode === "edit" ? t("editTitle") : t("createTitle")}
            </h1>
            {courseCode && <p className="text-xs text-slate-400 mt-0.5">{courseCode}</p>}
          </div>
          <div className="flex items-center gap-3">
             <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLE[status] || STATUS_STYLE.draft}`}>
              {status}
            </span>
            <LanguageToggle />
          </div>
        </div>

        {/* AI Top Bar */}
        <div className="px-4 sm:px-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-950/20 dark:to-blue-950/20 border border-violet-100 dark:border-violet-900/50 rounded-2xl">
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">AI Course Generation</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Select a model and auto-fill the required fields.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500 min-w-[140px]"
                disabled={aiModels.length === 0}
              >
                {aiModels.length === 0 ? (
                  <option value="">No models found</option>
                ) : (
                  aiModels.map(m => (
                    <option key={m.id} value={m.id}>{m.modelName} ({m.provider})</option>
                  ))
                )}
              </select>
              
              <button
                type="button"
                onClick={handleMagicAutoFill}
                disabled={isGenerating || aiModels.length === 0}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60 transition"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span className="hidden sm:inline">Magic Auto-Fill</span>
                <span className="sm:hidden">Auto-Fill</span>
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="grid gap-6 px-4 sm:px-6 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-4">
              <WizardSidebar />
            </div>
          </aside>

          <main>
            {/* Desktop: single active step */}
            {!isMobile && (
              <div className="hidden lg:block">
                <div className={cardCls}>{renderStep(activeStep)}</div>
              </div>
            )}

            {/* Mobile: accordion wizard */}
            {isMobile && (
              <div className="space-y-3 lg:hidden">
              {activeSteps.map((step) => {
                const open = activeStep === step.key;
                return (
                  <div key={step.key} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setActiveStep(open ? "" : step.key)}
                      className="flex w-full items-center justify-between bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-left"
                    >
                      <span className={`text-sm font-semibold text-slate-800 dark:text-slate-100 ${lang === "bn" ? "font-bn" : ""}`}>
                        {step.index}. {lang === "bn" ? step.labelBn : step.labelEn}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && <div className="border-t border-slate-100 dark:border-slate-800 p-4">{renderStep(step.key)}</div>}
                  </div>
                );
              })}
            </div>
            )}
          </main>
        </div>

        <WizardSaveBar onSave={doSave} onPublish={onPublish} onPreview={onPreview} publishing={publishing} status={status} />
      </div>
    </FormProvider>
  );
}

// ---------- inline Review step ----------
function ReviewStep({
  onPublish,
  publishing,
  status,
}: {
  onPublish: () => void;
  publishing: boolean;
  status: string;
}) {
  const completed = useCourseWizardStore((s) => s.completedSteps);
  const items = [
    { key: "general", label: "General information" },
    { key: "content", label: "Course content" },
    { key: "seo", label: "SEO optimization" },
  ];
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Review & Publish</h3>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.key} className="flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${completed[it.key] ? "bg-emerald-50 dark:bg-emerald-900/100" : "bg-slate-300"}`} />
            <span className="text-slate-700 dark:text-slate-200">{it.label}</span>
            <span className={`text-xs ${completed[it.key] ? "text-emerald-500" : "text-slate-400"}`}>
              {completed[it.key] ? "Complete" : "Incomplete"}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Publishing makes the course live on the homepage, course listing, sitemap, RSS feed and search engines.
      </p>
      <button
        type="button"
        onClick={onPublish}
        disabled={publishing}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
      >
        {status === "published" ? "Update & Re-publish" : "Publish course"}
      </button>
    </div>
  );
}
