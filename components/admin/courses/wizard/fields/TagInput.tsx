"use client";

import { useState, type KeyboardEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { X } from "lucide-react";
import { inputCls, labelCls, chipCls } from "../shared";

interface TagInputProps {
  name: string;
  label: string;
  hint?: string;
  action?: React.ReactNode;
}

export function TagInput({ name, label, hint, action }: TagInputProps) {
  const { control, setValue } = useFormContext();
  const tagsRaw = useWatch({ control, name });
  const tags: string[] = Array.isArray(tagsRaw) ? tagsRaw : [];
  const [draft, setDraft] = useState("");

  const commit = (raw: string) => {
    const v = raw.trim().replace(/,$/, "").trim();
    if (v && !tags.includes(v)) setValue(name, [...tags, v], { shouldDirty: true });
    setDraft("");
  };
  const remove = (t: string) =>
    setValue(name, tags.filter((x) => x !== t), { shouldDirty: true });

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(draft);
    } else if (e.key === "Backspace" && !draft && tags.length) {
      remove(tags[tags.length - 1]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className={labelCls + " mb-0"}>{label}</label>
        {action}
      </div>
      <div className={inputCls + " flex flex-wrap items-center gap-1.5 min-h-[46px]"}>
        {tags.map((t) => (
          <span key={t} className={chipCls}>
            {t}
            <button type="button" onClick={() => remove(t)} className="hover:text-red-500">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => draft && commit(draft)}
          placeholder={tags.length ? "" : "Add tag…"}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm"
        />
      </div>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
