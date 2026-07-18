"use client";

import { useState } from "react";
import { updateSetting } from "@/lib/admin/actions/settings";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface SettingsFormProps {
  settingKey: string;
  initialValue: string;
  label: string;
  placeholder?: string;
  type?: string;
}

export function SettingsForm({ settingKey, initialValue, label, placeholder, type = "text" }: SettingsFormProps) {
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateSetting(settingKey, value);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("সেটিংস সফলভাবে সেভ হয়েছে!");
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="flex gap-3">
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || value === initialValue}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-blue-200 dark:shadow-blue-900 transition-all"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          সেভ করুন
        </button>
      </div>
    </div>
  );
}
