"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AdmissionFormValues } from "@/lib/schema/admission.schema";
import { useLang } from "@/context/GlobalLangContext";
import { admissionTranslations, AdmissionTKey } from "@/lib/i18n/admission";

export default function GuardianSection({ id }: { id: string }) {
  const { register, formState: { errors }, control, setValue } = useFormContext<AdmissionFormValues>();
  const { lang } = useLang();
  const t = (key: AdmissionTKey) => admissionTranslations[lang][key];

  const guardianType = useWatch({ control, name: "guardianType" });
  const fatherName = useWatch({ control, name: "fatherName" });
  const motherName = useWatch({ control, name: "motherName" });

  useEffect(() => {
    if (guardianType === "Father") {
      setValue("guardianName", fatherName || "", { shouldValidate: !!fatherName });
      setValue("guardianRelationship", "Father", { shouldValidate: true });
    } else if (guardianType === "Mother") {
      setValue("guardianName", motherName || "", { shouldValidate: !!motherName });
      setValue("guardianRelationship", "Mother", { shouldValidate: true });
    } else if (guardianType === "Other") {
      setValue("guardianName", "", { shouldValidate: false });
      setValue("guardianRelationship", "", { shouldValidate: false });
    }
  }, [guardianType, fatherName, motherName, setValue]);

  const isParent = guardianType === "Father" || guardianType === "Mother";

  return (
    <section id={id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 scroll-mt-28">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        {t("sec_guardian")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Guardian Type (First field) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("g_type")} *</label>
          <select {...register("guardianType")} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400">
            <option value="">{t("select")}</option>
            <option value="Father">পিতা / Father</option>
            <option value="Mother">মাতা / Mother</option>
            <option value="Other">অন্যান্য / Other</option>
          </select>
          {errors.guardianType && <p className="text-red-500 text-xs mt-1">{errors.guardianType.message}</p>}
        </div>

        {/* 2. Guardian Name */}
        {guardianType && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("g_name")} *</label>
            <input 
              {...register("guardianName")} 
              type="text" 
              readOnly={isParent} 
              className={`w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 ${isParent ? 'opacity-70 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed' : ''}`} 
            />
            {errors.guardianName && <p className="text-red-500 text-xs mt-1">{errors.guardianName.message}</p>}
          </div>
        )}

        {/* 3. Guardian Mobile */}
        {guardianType && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("guardian_mobile")} *</label>
            <input 
              {...register("guardianMobile")} 
              type="tel" 
              placeholder="01XXXXXXXXX"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400" 
            />
            {errors.guardianMobile && <p className="text-red-500 text-xs mt-1">{errors.guardianMobile.message}</p>}
          </div>
        )}

        {/* 4. Guardian Relationship (Only for 'Other') */}
        {guardianType === "Other" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("g_relationship")} *</label>
            <input 
              {...register("guardianRelationship")} 
              type="text" 
              placeholder="e.g. Uncle, Brother"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400" 
            />
            {errors.guardianRelationship && <p className="text-red-500 text-xs mt-1">{errors.guardianRelationship.message}</p>}
          </div>
        )}

      </div>
    </section>
  );
}
