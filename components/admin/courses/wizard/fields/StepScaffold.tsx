"use client";

import type { ReactNode } from "react";

/** Consistent title + description block shown at the top of a wizard step. */
export function StepHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
  );
}

/** Dashed placeholder shown when a repeatable list (batches, modules, trainers…) is empty. */
export function EmptyState({
  icon,
  message,
  action,
}: {
  icon?: ReactNode;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 px-6 py-10 text-center">
      {icon && <div className="text-slate-400">{icon}</div>}
      <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{message}</p>
      {action}
    </div>
  );
}

/** Section sub-heading with an optional right-aligned action (e.g. an Add button). */
export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      {action}
    </div>
  );
}
