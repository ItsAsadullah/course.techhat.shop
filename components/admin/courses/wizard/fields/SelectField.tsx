"use client";

import { useFormContext } from "react-hook-form";
import { inputCls, labelCls, errCls } from "../shared";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: Option[];
  required?: boolean;
  placeholder?: string;
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

export function SelectField({ label, name, options, required, placeholder }: SelectFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const err = fieldError(errors, name);
  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select {...register(name)} className={inputCls}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {err && <p className={errCls}>{err}</p>}
    </div>
  );
}
