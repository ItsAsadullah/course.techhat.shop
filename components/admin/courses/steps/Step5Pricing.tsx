"use client";

import { UseFormReturn, Path } from "react-hook-form";
import { CourseWizardValues } from "@/lib/schema/course.schema";

interface Step5Props {
  form: UseFormReturn<CourseWizardValues>;
}

const inputCls = "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all placeholder:text-slate-400";
const labelCls = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
const sectionTitle = "text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3";

function Toggle({
  name,
  label,
  desc,
  form,
}: {
  name: keyof CourseWizardValues["step5"];
  label: string;
  desc?: string;
  form: UseFormReturn<CourseWizardValues>;
}) {
  const { register, watch } = form;
  const checked = watch(`step5.${name}` as Path<CourseWizardValues>);
  return (
    <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${checked ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"}`}>
      <input type="checkbox" {...register(`step5.${name}` as Path<CourseWizardValues>)} className="sr-only" />
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${checked ? "border-blue-500 bg-blue-50 dark:bg-blue-900/200" : "border-slate-300 dark:border-slate-600"}`}>
        {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-white">{label}</p>
        {desc && <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>}
      </div>
    </label>
  );
}

export default function Step5Pricing({ form }: Step5Props) {
  const { register, watch } = form;
  const isFree = watch("step5.is_free");
  const installmentAvailable = watch("step5.installment_available");
  const certificateOption = watch("step5.certificate_option");

  return (
    <div className="space-y-6">
      {/* Free Toggle */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
        <label className="flex items-center gap-3 cursor-pointer flex-1">
          <input type="checkbox" {...register("step5.is_free")} className="sr-only" />
          <div className={`relative w-11 h-6 rounded-full transition-colors ${isFree ? "bg-emerald-50 dark:bg-emerald-900/100" : "bg-slate-300 dark:bg-slate-600"}`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-slate-900 shadow-sm transition-transform ${isFree ? "translate-x-5" : "translate-x-0"}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">🆓 বিনামূল্যে কোর্স (Free Course)</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">চালু করলে ফি ক্ষেত্রগুলো নিষ্ক্রিয় হবে</p>
          </div>
        </label>
      </div>

      {!isFree && (
        <>
          {/* Fee Fields */}
          <div>
            <h3 className={sectionTitle}>ফি সমূহ</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>কোর্স ফি (৳) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">৳</span>
                  <input type="number" {...register("step5.course_fee")} className={`${inputCls} pl-8`} placeholder="0" min={0} />
                </div>
              </div>
              <div>
                <label className={labelCls}>ভর্তি ফি (৳)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">৳</span>
                  <input type="number" {...register("step5.admission_fee")} className={`${inputCls} pl-8`} placeholder="0" min={0} />
                </div>
              </div>
              <div>
                <label className={labelCls}>মাসিক ফি (৳)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">৳</span>
                  <input type="number" {...register("step5.monthly_fee")} className={`${inputCls} pl-8`} placeholder="0" min={0} />
                </div>
              </div>
            </div>
          </div>

          {/* Discount */}
          <div>
            <h3 className={sectionTitle}>ছাড় ও বৃত্তি</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>ছাড়ের হার (%)</label>
                <div className="relative">
                  <input type="number" {...register("step5.discount_percent")} className={`${inputCls} pr-8`} placeholder="0" min={0} max={100} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                </div>
              </div>
              <div className="flex items-end">
                <Toggle name="scholarship_available" label="🎓 বৃত্তি পাওয়া যাবে" desc="Scholarship Available" form={form} />
              </div>
            </div>
          </div>

          {/* Installment */}
          <div>
            <h3 className={sectionTitle}>কিস্তি সুবিধা</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Toggle name="installment_available" label="💳 কিস্তিতে পরিশোধ" desc="Installment Available" form={form} />
              {installmentAvailable && (
                <div>
                  <label className={labelCls}>কিস্তির সংখ্যা</label>
                  <input type="number" {...register("step5.installment_count")} className={inputCls} placeholder="যেমন: 3" min={2} max={24} />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Certificate */}
      <div>
        <h3 className={sectionTitle}>সার্টিফিকেট</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { value: "included", label: "✅ অন্তর্ভুক্ত", desc: "Included" },
            { value: "optional", label: "🔘 ঐচ্ছিক", desc: "Optional (paid)" },
            { value: "none", label: "❌ নেই", desc: "No Certificate" },
          ].map(({ value, label, desc }) => {
            const isActive = certificateOption === value;
            return (
              <label key={value} className={`p-3 rounded-xl border-2 cursor-pointer text-center transition-all ${isActive ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-700"}`}>
                <input type="radio" {...register("step5.certificate_option")} value={value} className="sr-only" />
                <p className="text-sm font-bold text-slate-800 dark:text-white">{label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
              </label>
            );
          })}
        </div>

        {certificateOption === "optional" && (
          <div className="max-w-xs">
            <label className={labelCls}>সার্টিফিকেট ফি (৳)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">৳</span>
              <input type="number" {...register("step5.certificate_fee")} className={`${inputCls} pl-8`} placeholder="যেমন: 1000" min={0} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

