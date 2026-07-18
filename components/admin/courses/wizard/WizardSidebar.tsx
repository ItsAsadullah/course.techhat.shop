"use client";

import {
  Info, FileText, Search, Image as ImageIcon, Calendar, DollarSign,
  ListTree, Users, Home, Globe, BarChart3, Rocket, Check, Lock, type LucideIcon,
} from "lucide-react";
import { useLang } from "@/context/GlobalLangContext";
import { WIZARD_STEPS } from "@/lib/schema/course-wizard.schema";
import { useCourseWizardStore } from "@/lib/store/course-wizard.store";

const ICONS: Record<string, LucideIcon> = {
  Info, FileText, Search, Image: ImageIcon, Calendar, DollarSign,
  ListTree, Users, Home, Globe, BarChart3, Rocket,
};

export function WizardSidebar() {
  const { lang } = useLang();
  const activeStep = useCourseWizardStore((s) => s.activeStep);
  const setActiveStep = useCourseWizardStore((s) => s.setActiveStep);
  const completed = useCourseWizardStore((s) => s.completedSteps);

  return (
    <nav className="space-y-1">
      {WIZARD_STEPS.map((step) => {
        const Icon = ICONS[step.icon] || Info;
        const isActive = activeStep === step.key;
        const isDone = completed[step.key];
        const disabled = false;
        return (
          <button
            key={step.key}
            type="button"
            disabled={disabled}
            onClick={() => setActiveStep(step.key)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : disabled
                ? "cursor-not-allowed text-slate-300 dark:text-slate-600"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                isActive ? "bg-white/20" : isDone ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15" : "bg-slate-100 dark:bg-slate-800"
              }`}
            >
              {disabled ? <Lock className="h-3.5 w-3.5" /> : isDone ? <Check className="h-3.5 w-3.5" /> : step.index}
            </span>
            <span className="flex-1 min-w-0">
              <span className={`block truncate text-sm font-medium ${lang === "bn" ? "font-bn" : ""}`}>
                {lang === "bn" ? step.labelBn : step.labelEn}
              </span>
            </span>
            <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-500"}`} />
          </button>
        );
      })}
    </nav>
  );
}
