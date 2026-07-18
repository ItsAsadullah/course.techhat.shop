"use client";

import { Check, Loader2, AlertCircle, Rocket, Save, Eye } from "lucide-react";
import { useLang } from "@/context/GlobalLangContext";
import { courseWizardT } from "@/lib/i18n/course-wizard";
import { useCourseWizardStore } from "@/lib/store/course-wizard.store";

interface WizardSaveBarProps {
  onSave: () => void;
  onPublish: () => void;
  onPreview?: () => void;
  publishing: boolean;
  status: string;
}

function timeAgo(ts: number | null): string {
  if (!ts) return "";
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  return `${m}m ago`;
}

export function WizardSaveBar({ onSave, onPublish, onPreview, publishing, status }: WizardSaveBarProps) {
  const { lang } = useLang();
  const t = (k: keyof typeof courseWizardT["en"]) => courseWizardT[lang][k];
  const saveStatus = useCourseWizardStore((s) => s.saveStatus);
  const lastSavedAt = useCourseWizardStore((s) => s.lastSavedAt);

  const StatusPill = () => {
    if (saveStatus === "saving")
      return <span className="flex items-center gap-1.5 text-slate-500"><Loader2 className="h-3.5 w-3.5 animate-spin" /> {t("saving")}</span>;
    if (saveStatus === "error")
      return <span className="flex items-center gap-1.5 text-red-500"><AlertCircle className="h-3.5 w-3.5" /> {t("saveError")}</span>;
    if (saveStatus === "saved")
      return <span className="flex items-center gap-1.5 text-emerald-500"><Check className="h-3.5 w-3.5" /> {t("saved")} · {timeAgo(lastSavedAt)}</span>;
    return <span className="text-slate-400">{t("unsaved")}</span>;
  };

  return (
    <div className="sticky bottom-0 z-20 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs">
          <StatusPill />
        </div>
        <div className="flex items-center gap-2">
          {onPreview && (
            <button
              type="button"
              onClick={onPreview}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-blue-300"
            >
              <Eye className="h-4 w-4" /> {t("preview")}
            </button>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={saveStatus === "saving"}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-blue-300 disabled:opacity-60"
          >
            <Save className="h-4 w-4" /> {t("save")}
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={publishing}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
          >
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
            {status === "published" ? t("published") : t("publish")}
          </button>
        </div>
      </div>
    </div>
  );
}
