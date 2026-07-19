"use client";

import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { SeoScoreResult } from "@/lib/seo/score";

const ICON = {
  good: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  warn: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  bad: <XCircle className="h-4 w-4 text-red-500" />,
};

function ringColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}

export function SeoScorePanel({ result }: { result: SeoScoreResult }) {
  const { score, checks, keywordDensity, readability } = result;
  const circumference = 2 * Math.PI * 26;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-5">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="26" fill="none" strokeWidth="6" className="stroke-slate-100 dark:stroke-slate-800" />
            <circle
              cx="30"
              cy="30"
              r="26"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - score / 100)}
              className={`${ringColor(score)} transition-all`}
              stroke="currentColor"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-800 dark:text-slate-100">
            {score}
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-xs text-slate-400">Readability</div>
            <div className="font-semibold text-slate-800 dark:text-slate-100">{readability}/100</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Keyword density</div>
            <div className="font-semibold text-slate-800 dark:text-slate-100">{keywordDensity}%</div>
          </div>
        </div>
      </div>
      <ul className="mt-4 space-y-1.5">
        {checks.map((c) => (
          <li key={c.id} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            {ICON[c.status]}
            <span className="flex-1">{c.label}</span>
            {c.hint && <span className="text-xs text-slate-400">{c.hint}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
