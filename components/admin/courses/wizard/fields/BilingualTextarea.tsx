"use client";

import { useFormContext } from "react-hook-form";
import { useCourseWizardStore } from "@/lib/store/course-wizard.store";
import { inputCls, labelCls, errCls } from "../shared";

interface BilingualTextareaProps {
  label: string;
  nameEn: string;
  nameBn: string;
  rows?: number;
  required?: boolean;
  action?: React.ReactNode;
  hint?: string;
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

export function BilingualTextarea({
  label,
  nameEn,
  nameBn,
  rows = 4,
  required,
  action,
  hint,
}: BilingualTextareaProps) {
  const { register, watch, formState: { errors } } = useFormContext();
  const language = useCourseWizardStore((s) => s.language);
  const showEn = language === "en" || language === "both";
  const showBn = language === "bn" || language === "both";

  const errEn = fieldError(errors, nameEn);
  const errBn = fieldError(errors, nameBn);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className={labelCls + " mb-0"}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {action}
      </div>
      <div className={`grid gap-3 ${showEn && showBn ? "sm:grid-cols-2" : "grid-cols-1"}`}>
        {showEn && (
          <div>
            <textarea {...register(nameEn)} value={watch(nameEn) || ""} rows={rows} placeholder="English" className={inputCls} />
            {errEn && <p className={errCls}>{errEn}</p>}
          </div>
        )}
        {showBn && (
          <div>
            <textarea {...register(nameBn)} value={watch(nameBn) || ""} rows={rows} placeholder="বাংলা" className={inputCls + " font-bn"} />
            {errBn && <p className={errCls}>{errBn}</p>}
          </div>
        )}
      </div>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
