"use client";

import { useCourseWizardStore, type WizardLanguage } from "@/lib/store/course-wizard.store";

const OPTIONS: { key: WizardLanguage; label: string }[] = [
  { key: "en", label: "EN" },
  { key: "bn", label: "বাংলা" },
  { key: "both", label: "Both" },
];

export function LanguageToggle() {
  const language = useCourseWizardStore((s) => s.language);
  const setLanguage = useCourseWizardStore((s) => s.setLanguage);

  return (
    <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-0.5">
      {OPTIONS.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => setLanguage(o.key)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            language === o.key
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 dark:hover:text-slate-300"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
