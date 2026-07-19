"use client";

import { UseFormReturn } from "react-hook-form";
import { CourseWizardValues } from "@/lib/schema/course.schema";

interface Step4Props {
  form: UseFormReturn<CourseWizardValues>;
}

const inputCls = "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all placeholder:text-slate-400";
const labelCls = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
const sectionTitle = "text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3";

const DAYS = [
  { value: "sat", label: "শনি" },
  { value: "sun", label: "রবি" },
  { value: "mon", label: "সোম" },
  { value: "tue", label: "মঙ্গল" },
  { value: "wed", label: "বুধ" },
  { value: "thu", label: "বৃহস্পতি" },
  { value: "fri", label: "শুক্র" },
];

const SESSIONS = [
  { value: "morning", label: "সকাল (Morning)" },
  { value: "evening", label: "বিকাল/সন্ধ্যা (Evening)" },
  { value: "weekend", label: "সাপ্তাহিক (Weekend)" },
  { value: "custom", label: "কাস্টম (Custom)" },
];

const ACCESS_DURATIONS = [30, 60, 90, 180, 365];

export default function Step4Duration({ form }: Step4Props) {
  const { register, watch, setValue } = form;
  const courseType = watch("step1.course_type");
  const classDays = watch("step4.class_days") || [];
  const isLifetime = watch("step4.is_lifetime_access");

  const isOnline = courseType === "online" || courseType === "live_class" || courseType === "recorded";
  const isOffline = courseType === "offline" || courseType === "hybrid" || courseType === "workshop" || courseType === "seminar" || courseType === "bootcamp";

  const toggleDay = (day: string) => {
    const current = classDays;
    if (current.includes(day)) {
      setValue("step4.class_days", current.filter((d: string) => d !== day));
    } else {
      setValue("step4.class_days", [...current, day]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Duration Text */}
      <div>
        <h3 className={sectionTitle}>সময়কাল</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>সময়কাল (Bangla) *</label>
            <input {...register("step4.duration_text_bn")} placeholder="যেমন: ৩ মাস / ১২ সপ্তাহ" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Duration (English) *</label>
            <input {...register("step4.duration_text_en")} placeholder="e.g. 3 Months / 12 Weeks" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Offline / Hybrid Fields */}
      {isOffline && (
        <>
          <div>
            <h3 className={sectionTitle}>সেশন ও ক্লাসের সময়</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>সেশন</label>
                <select {...register("step4.session")} className={inputCls}>
                  <option value="">সেশন বাছুন</option>
                  {SESSIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>শুরুর সময়</label>
                <input type="time" {...register("step4.class_time_start")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>শেষের সময়</label>
                <input type="time" {...register("step4.class_time_end")} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Class Days */}
          <div>
            <label className={labelCls}>ক্লাসের দিন</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                    classDays.includes(day.value)
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className={sectionTitle}>তারিখ</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>শুরুর তারিখ</label>
                <input type="date" {...register("step4.start_date")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>শেষের তারিখ</label>
                <input type="date" {...register("step4.end_date")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>ভর্তির শেষ তারিখ</label>
                <input type="date" {...register("step4.admission_deadline")} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Total Classes & Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>মোট ক্লাস সংখ্যা</label>
              <input type="number" {...register("step4.total_classes")} placeholder="যেমন: 48" className={inputCls} min={0} />
            </div>
            <div>
              <label className={labelCls}>মোট ঘন্টা</label>
              <input type="number" {...register("step4.total_hours")} placeholder="যেমন: 120" className={inputCls} min={0} />
            </div>
          </div>
        </>
      )}

      {/* Online Fields */}
      {isOnline && (
        <div>
          <h3 className={sectionTitle}>অনলাইন অ্যাক্সেস</h3>

          {/* Lifetime Toggle */}
          <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer mb-4 transition-all ${isLifetime ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-700"}`}>
            <input type="checkbox" {...register("step4.is_lifetime_access")} className="sr-only" />
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${isLifetime ? "border-blue-500 bg-blue-500" : "border-slate-300"}`}>
              {isLifetime && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">♾️ লাইফটাইম অ্যাক্সেস</p>
              <p className="text-xs text-slate-500">একবার ভর্তি হলে চিরজীবন অ্যাক্সেস পাবে</p>
            </div>
          </label>

          {!isLifetime && (
            <div>
              <label className={labelCls}>অ্যাক্সেসের মেয়াদ (দিন)</label>
              <div className="flex flex-wrap gap-2">
                {ACCESS_DURATIONS.map(d => {
                  const current = watch("step4.access_duration_days");
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setValue("step4.access_duration_days", d)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                        current === d
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300"
                      }`}
                    >
                      {d} দিন
                    </button>
                  );
                })}
                <div className="flex-1 min-w-[120px]">
                  <input
                    type="number"
                    {...register("step4.access_duration_days")}
                    placeholder="কাস্টম দিন"
                    className={inputCls}
                    min={1}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

