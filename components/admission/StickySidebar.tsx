"use client";

import { useLang } from "@/context/GlobalLangContext";
import { admissionTranslations, AdmissionTKey } from "@/lib/i18n/admission";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface StickySidebarProps {
  sections: { id: string; key: AdmissionTKey; fields?: string[] }[];
  activeSection: string;
}

export default function StickySidebar({ sections, activeSection }: StickySidebarProps) {
  const { lang } = useLang();
  const t = (key: AdmissionTKey) => admissionTranslations[lang][key];
  const { watch } = useFormContext<Record<string, unknown>>();
  
  const formValues = watch() as Record<string, unknown>;

  const isSectionComplete = (fields?: string[]) => {
    if (!fields || fields.length === 0) return false;
    return fields.every(field => {
      const keys = field.split('.');
      let val: Record<string, unknown> | unknown = formValues;
      for (const k of keys) {
        if (val === undefined || val === null) break;
        val = (val as Record<string, unknown>)[k];
      }
      return val !== undefined && val !== null && val !== "" && val !== false;
    });
  };

  return (
    <div className="sticky top-24 hidden lg:block w-72 shrink-0">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
          {lang === "bn" ? "ফর্মের ধাপসমূহ" : "Form Sections"}
        </h3>
        
        <div className="space-y-1 relative">
          {/* Background Gray Line */}
          <div className="absolute top-[20px] bottom-[20px] left-[19px] w-[2px] bg-slate-200 dark:bg-slate-800 z-0" />
          
          {/* Active Blue Line */}
          <div 
            className="absolute top-[20px] left-[19px] w-[2px] bg-blue-600 dark:bg-blue-500 z-0 transition-all duration-500 ease-out"
            style={{ 
              height: `calc( (100% - 40px) * ${sections.findIndex(s => s.id === activeSection) / Math.max(1, sections.length - 1)} )` 
            }}
          />
          {sections.map((section, idx) => {
            const isActive = activeSection === section.id;
            const isCompleted = isSectionComplete(section.fields);
            
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => {
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`relative flex items-center gap-4 w-full p-2 rounded-xl text-left transition-all duration-200 ${
                  isActive 
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <div className="relative z-10 flex items-center justify-center bg-white dark:bg-slate-900">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-white bg-emerald-500 rounded-full shadow-sm" />
                  ) : isActive ? (
                    <div className="w-6 h-6 rounded-full border-4 border-blue-600 dark:border-blue-500 bg-white dark:bg-slate-900 shadow-sm" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors group-hover:border-blue-300 dark:group-hover:border-blue-800" />
                  )}
                </div>
                <span className="text-sm">{t(section.key)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
