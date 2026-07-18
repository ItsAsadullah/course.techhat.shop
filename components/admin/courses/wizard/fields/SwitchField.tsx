"use client";

import { useFormContext, useWatch } from "react-hook-form";

interface SwitchFieldProps {
  name: string;
  label: string;
  description?: string;
}

/** Controlled boolean toggle backed by an RHF field (no external switch dep). */
export function SwitchField({ name, label, description }: SwitchFieldProps) {
  const { control, setValue } = useFormContext();
  const value: boolean = !!useWatch({ control, name });

  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-3 cursor-pointer">
      <span>
        <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
        {description && <span className="block text-xs text-slate-400 mt-0.5">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => setValue(name, !value, { shouldDirty: true })}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
          value ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}
