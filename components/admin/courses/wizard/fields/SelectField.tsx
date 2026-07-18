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

function fieldError(errors: any, name: string): string | undefined {
  return name.split(".").reduce((o: any, k) => o?.[k], errors)?.message;
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
