"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Plus, X, ChevronUp, ChevronDown, Monitor, Globe, TrendingUp, Rocket, Lightbulb, ShieldCheck, Users, Briefcase, GraduationCap, BadgeCheck, Target, Sparkles, Layers3 } from "lucide-react";
import { useCourseWizardStore } from "@/lib/store/course-wizard.store";
import FileUpload from "@/components/ui/FileUpload";
import { inputCls, labelCls } from "../shared";

interface ArrayEditorProps {
  name: string;
  label?: string;
  placeholder?: string;
  addLabel?: string;
  bn?: boolean;
  isImage?: boolean;
  iconType?: "requirements" | "whoJoin" | "software" | "projects";
}

/** Editable list of strings backed by an RHF array field. */
export function ArrayEditor({ name, label, placeholder, addLabel = "Add", bn, isImage, iconType }: ArrayEditorProps) {
  const { control, setValue } = useFormContext();
  const itemsRaw = useWatch({ control, name });
  const items: string[] = Array.isArray(itemsRaw) ? itemsRaw : [];

  const update = (next: string[]) => setValue(name, next, { shouldDirty: true });
  const setAt = (i: number, v: string) => update(items.map((x, idx) => (idx === i ? v : x)));
  const add = () => update([...items, ""]);
  const removeAt = (i: number) => update(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  };

  return (
    <div>
      {label && <label className={labelCls}>{label}</label>}
      <div className="space-y-2">
        {items.map((val, i) => {
          let IconComponent = null;
          if (iconType === "requirements") {
            const icons = [Monitor, Globe, TrendingUp, Rocket, Lightbulb, ShieldCheck];
            IconComponent = icons[i % icons.length];
          } else if (iconType === "whoJoin") {
            const icons = [Users, Briefcase, GraduationCap, BadgeCheck, Target, Sparkles];
            IconComponent = icons[i % icons.length];
          } else if (iconType === "software") {
            IconComponent = Monitor;
          } else if (iconType === "projects") {
            IconComponent = Layers3;
          }

          return (
            <div key={i} className={`flex ${isImage ? "items-start" : "items-center"} gap-2`}>
              {IconComponent && (
                <div className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded text-slate-500 shrink-0 border border-slate-200 dark:border-slate-700">
                  <IconComponent className="w-4 h-4" />
                </div>
              )}
              <div className="flex-1">
              {isImage ? (
                <FileUpload
                  value={val}
                  folder="courses"
                  accept="image/*"
                  onUpload={(url) => setAt(i, url)}
                  onRemove={() => setAt(i, "")}
                  label=""
                />
              ) : (
                <input
                  value={val}
                  onChange={(e) => setAt(i, e.target.value)}
                  placeholder={placeholder}
                  className={inputCls + (bn ? " font-bn" : "")}
                />
              )}
            </div>
            <div className={`flex flex-col ${isImage ? "mt-2" : ""}`}>
              <button type="button" onClick={() => move(i, -1)} className="text-slate-400 hover:text-slate-600" tabIndex={-1}>
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => move(i, 1)} className="text-slate-400 hover:text-slate-600" tabIndex={-1}>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeAt(i)}
              className={`rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 ${isImage ? "mt-2" : ""}`}
              tabIndex={-1}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        <Plus className="h-4 w-4" /> {addLabel}
      </button>
    </div>
  );
}

interface BilingualArrayProps {
  label: string;
  nameEn: string;
  nameBn: string;
  placeholder?: string;
  action?: React.ReactNode;
  iconType?: "requirements" | "whoJoin" | "software" | "projects";
}

export function BilingualArray({ label, nameEn, nameBn, placeholder, action, iconType }: BilingualArrayProps) {
  const language = useCourseWizardStore((s) => s.language);
  const showEn = language === "en" || language === "both";
  const showBn = language === "bn" || language === "both";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className={labelCls + " mb-0"}>{label}</label>
        {action}
      </div>
      <div className={`grid gap-4 ${showEn && showBn ? "sm:grid-cols-2" : "grid-cols-1"}`}>
        {showEn && (
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">English</p>
            <ArrayEditor name={nameEn} placeholder={placeholder} iconType={iconType} />
          </div>
        )}
        {showBn && (
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">বাংলা</p>
            <ArrayEditor name={nameBn} placeholder={placeholder} bn iconType={iconType} />
          </div>
        )}
      </div>
    </div>
  );
}

// --- Specific Editor for Skills (Supports Image Upload) ---

interface Skill {
  name: string;
  image_url: string;
}

export function SkillArrayEditor({ name, placeholder, bn }: { name: string; placeholder?: string; bn?: boolean }) {
  const { control, setValue } = useFormContext();
  const itemsRaw = useWatch({ control, name });
  const items: Skill[] = Array.isArray(itemsRaw) ? itemsRaw : [];

  const update = (next: Skill[]) => setValue(name, next, { shouldDirty: true });
  const updateItem = (i: number, key: keyof Skill, val: string) => 
    update(items.map((x, idx) => (idx === i ? { ...x, [key]: val } : x)));
  const add = () => update([...items, { name: "", image_url: "" }]);
  const removeAt = (i: number) => update(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  };

  return (
    <div>
      <div className="space-y-3">
        {items.map((val, i) => (
          <div key={i} className="flex gap-2 items-start border border-slate-100 dark:border-slate-800 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <div className="w-14 h-14 shrink-0 overflow-hidden [&_.h-24]:!h-14 [&_.w-full]:!w-14 [&_.border-2]:!border [&_.text-xs]:!text-[10px] [&_svg]:!w-4 [&_svg]:!h-4">
              <FileUpload
                value={val.image_url}
                folder="skills"
                accept="image/*"
                onUpload={(url) => updateItem(i, "image_url", url)}
                onRemove={() => updateItem(i, "image_url", "")}
                label=""
              />
            </div>
            <div className="flex-1 mt-1">
              <input
                value={val.name}
                onChange={(e) => updateItem(i, "name", e.target.value)}
                placeholder={placeholder}
                className={inputCls + (bn ? " font-bn" : "")}
              />
            </div>
            <div className="flex flex-col mt-1">
              <button type="button" onClick={() => move(i, -1)} className="text-slate-400 hover:text-slate-600"><ChevronUp className="h-3.5 w-3.5" /></button>
              <button type="button" onClick={() => move(i, 1)} className="text-slate-400 hover:text-slate-600"><ChevronDown className="h-3.5 w-3.5" /></button>
            </div>
            <button type="button" onClick={() => removeAt(i)} className="p-1 mt-1 text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
        <Plus className="h-4 w-4" /> Add Skill
      </button>
    </div>
  );
}

export function BilingualSkillArray({ label, nameEn, nameBn, placeholder }: BilingualArrayProps) {
  const language = useCourseWizardStore((s) => s.language);
  const showEn = language === "en" || language === "both";
  const showBn = language === "bn" || language === "both";

  return (
    <div>
      <label className={labelCls + " mb-1.5"}>{label}</label>
      <div className={`grid gap-4 ${showEn && showBn ? "sm:grid-cols-2" : "grid-cols-1"}`}>
        {showEn && (
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">English</p>
            <SkillArrayEditor name={nameEn} placeholder={placeholder} />
          </div>
        )}
        {showBn && (
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">বাংলা</p>
            <SkillArrayEditor name={nameBn} placeholder={placeholder} bn />
          </div>
        )}
      </div>
    </div>
  );
}
