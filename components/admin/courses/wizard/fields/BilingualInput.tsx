"use client";

import { useFormContext } from "react-hook-form";
import { useCourseWizardStore } from "@/lib/store/course-wizard.store";
import { inputCls, labelCls, errCls } from "../shared";

interface BilingualInputProps {
  label: string;
  nameEn: string;
  nameBn: string;
  placeholderEn?: string;
  placeholderBn?: string;
  required?: boolean;
  type?: string;
  /** Optional adornment rendered on the right of the header row (e.g. AI button). */
  action?: React.ReactNode;
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

export function BilingualInput({
  label,
  nameEn,
  nameBn,
  placeholderEn,
  placeholderBn,
  required,
  type = "text",
  action,
}: BilingualInputProps) {
  const { register, formState: { errors } } = useFormContext();
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
            <input
              {...register(nameEn)}
              type={type}
              placeholder={placeholderEn || "English"}
              className={inputCls}
            />
            {errEn && <p className={errCls}>{errEn}</p>}
          </div>
        )}
        {showBn && (
          <div>
            <input
              {...register(nameBn)}
              type={type}
              placeholder={placeholderBn || "বাংলা"}
              className={inputCls + " font-bn"}
            />
            {errBn && <p className={errCls}>{errBn}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
