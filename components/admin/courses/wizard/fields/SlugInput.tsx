"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Wand2 } from "lucide-react";
import { useCourseWizardStore } from "@/lib/store/course-wizard.store";
import { inputCls, labelCls, errCls } from "../shared";

function slugify(input: string): string {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ঀ-৿\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function fieldError(errors: import("react-hook-form").FieldErrors, name: string): string | undefined {
  let o: unknown = errors;
  for (const k of name.split(".")) {
    if (o && typeof o === "object" && k in o) {
      o = (o as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }
  return (o as { message?: string })?.message;
}

/** Bilingual slug field with per-language auto-generate from the course name. */
export function SlugInput() {
  const { control, register, setValue, formState: { errors } } = useFormContext();
  const language = useCourseWizardStore((s) => s.language);
  const showEn = language === "en" || language === "both";
  const showBn = language === "bn" || language === "both";

  const nameEn = useWatch({ control, name: "general.name_en" });
  const nameBn = useWatch({ control, name: "general.name_bn" });

  const auto = (lang: "en" | "bn") => {
    const src = lang === "en" ? nameEn : nameBn;
    setValue(`general.slug_${lang}`, slugify(src || ""), { shouldDirty: true, shouldValidate: true });
  };

  const errEn = fieldError(errors, "general.slug_en");
  const errBn = fieldError(errors, "general.slug_bn");

  return (
    <div>
      <label className={labelCls}>URL Slug <span className="text-red-500">*</span></label>
      <div className={`grid gap-3 ${showEn && showBn ? "sm:grid-cols-2" : "grid-cols-1"}`}>
        {showEn && (
          <div>
            <div className="flex gap-1.5">
              <input {...register("general.slug_en")} placeholder="english-slug" className={inputCls} />
              <button
                type="button"
                onClick={() => auto("en")}
                title="Generate from name"
                className="shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 px-2.5 text-slate-500 hover:text-blue-600 hover:border-blue-300"
              >
                <Wand2 className="h-4 w-4" />
              </button>
            </div>
            {errEn && <p className={errCls}>{errEn}</p>}
          </div>
        )}
        {showBn && (
          <div>
            <div className="flex gap-1.5">
              <input {...register("general.slug_bn")} placeholder="bangla-slug" className={inputCls + " font-bn"} />
              <button
                type="button"
                onClick={() => auto("bn")}
                title="নাম থেকে তৈরি করুন"
                className="shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 px-2.5 text-slate-500 hover:text-blue-600 hover:border-blue-300"
              >
                <Wand2 className="h-4 w-4" />
              </button>
            </div>
            {errBn && <p className={errCls}>{errBn}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
