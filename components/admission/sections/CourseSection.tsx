"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AdmissionFormValues } from "@/lib/schema/admission.schema";
import { useLang } from "@/context/GlobalLangContext";
import { admissionTranslations, AdmissionTKey } from "@/lib/i18n/admission";
import { getHomepageCourses } from "@/lib/admin/actions/courses";

export default function CourseSection({ id }: { id: string }) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<AdmissionFormValues>();
  const { lang } = useLang();
  const t = (key: AdmissionTKey) => admissionTranslations[lang][key];
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    async function loadCourses() {
      try {
        const { all } = await getHomepageCourses();
        setCourses(all || []);
        
        // Auto-select course from URL if present
        if (typeof window !== "undefined" && all) {
          const params = new URLSearchParams(window.location.search);
          const courseParam = params.get("course");
          if (courseParam) {
            const matched = all.find(c => c.slug_en === courseParam || c.id === courseParam);
            if (matched) {
              setValue("courseId", matched.id, { shouldValidate: true });
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    }
    loadCourses();
  }, [setValue]);

  const selectedCourseId = watch("courseId");
  const wantsCertificate = watch("wantsCertificate");
  const courseMode = watch("courseMode");
  
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  
  let totalFee = 0;
  if (selectedCourse) {
    totalFee = selectedCourse.course_fee || 0;
    if (selectedCourse.has_certificate && selectedCourse.certificate_option === "paid" && wantsCertificate) {
      totalFee += (selectedCourse.certificate_fee || 0);
    }
  }

  return (
    <section id={id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 scroll-mt-28">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        {t("sec_course")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("course")} *</label>
          <select {...register("courseId")} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400">
            <option value="">{t("select")}</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {lang === "bn" ? c.name_bn || c.name_en : c.name_en} - ৳{c.course_fee}
              </option>
            ))}
          </select>
          {errors.courseId && <p className="text-red-500 text-xs mt-1">{errors.courseId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">কোর্সের ধরন (Course Mode) *</label>
          <select {...register("courseMode")} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400">
            <option value="">{t("select")}</option>
            <option value="online">Online (অনলাইন)</option>
            <option value="offline">Offline (অফলাইন - ক্লাসরুম)</option>
          </select>
          {errors.courseMode && <p className="text-red-500 text-xs mt-1">{errors.courseMode.message}</p>}
        </div>
      </div>

      {courseMode === "offline" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">ব্যাচ ও শিফট (Shift) *</label>
            <select {...register("shift")} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400">
              <option value="">{t("select")}</option>
              <option value="morning">সকাল (৮:০০ - ১০:০০ AM)</option>
              <option value="noon">দুপুর (১০:০০ - ১২:০০ PM)</option>
              <option value="afternoon">বিকাল (২:০০ - ৪:০০ PM)</option>
              <option value="evening">সন্ধ্যা (৫:০০ - ৭:০০ PM)</option>
            </select>
            {errors.shift && <p className="text-red-500 text-xs mt-1">{errors.shift.message}</p>}
          </div>
        </div>
      )}

      {selectedCourse && (
        <div className="mt-8 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
            ফি এর বিবরণ (Fee Details)
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">কোর্স ফি (Course Fee)</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">৳{selectedCourse.course_fee}</span>
            </div>

            {selectedCourse.has_certificate && selectedCourse.certificate_option === "paid" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    {...register("wantsCertificate")} 
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900" 
                  />
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                    সার্টিফিকেট নিবো (Add Certificate)
                  </span>
                </label>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {wantsCertificate ? `+ ৳${selectedCourse.certificate_fee}` : `৳${selectedCourse.certificate_fee}`}
                </span>
              </div>
            )}
            
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3 flex justify-between items-center">
              <span className="font-bold text-slate-800 dark:text-slate-200">সর্বমোট (Total)</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">৳{totalFee}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
