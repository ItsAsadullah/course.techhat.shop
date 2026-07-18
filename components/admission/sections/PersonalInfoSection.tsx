"use client";

import { useFormContext, Controller } from "react-hook-form";
import { AdmissionFormValues } from "@/lib/schema/admission.schema";
import { useLang } from "@/context/GlobalLangContext";
import { admissionTranslations, AdmissionTKey } from "@/lib/i18n/admission";
import { DobSelector } from "@/components/ui/DobSelector";

export default function PersonalInfoSection({ id }: { id: string }) {
  const { register, control, formState: { errors } } = useFormContext<AdmissionFormValues>();
  const { lang } = useLang();
  const t = (key: AdmissionTKey) => admissionTranslations[lang][key];

  return (
    <section id={id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 scroll-mt-28">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        {t("sec_personal")}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* En Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("full_name_en")} *</label>
          <input 
            {...register("fullNameEn")}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s.-]/g, '');
            }}
            type="text" 
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all" 
          />
          {errors.fullNameEn && <p className="text-red-500 text-xs mt-1">{errors.fullNameEn.message}</p>}
        </div>

        {/* Bn Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("full_name_bn")} *</label>
          <input 
            {...register("fullNameBn")}
            type="text" 
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all" 
          />
          {errors.fullNameBn && <p className="text-red-500 text-xs mt-1">{errors.fullNameBn.message}</p>}
        </div>

        {/* Father Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("father_name")} *</label>
          <input 
            {...register("fatherName")}
            type="text" 
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all" 
          />
          {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName.message}</p>}
        </div>

        {/* Mother Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("mother_name")} *</label>
          <input 
            {...register("motherName")}
            type="text" 
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all" 
          />
          {errors.motherName && <p className="text-red-500 text-xs mt-1">{errors.motherName.message}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("gender")} *</label>
          <select 
            {...register("gender")}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all"
          >
            <option value="">{t("select")}</option>
            <option value="Male">{t("male")}</option>
            <option value="Female">{t("female")}</option>
            <option value="Other">{t("other")}</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
        </div>

        {/* Religion */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("religion")} *</label>
          <select 
            {...register("religion")}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all"
          >
            <option value="">{t("select")}</option>
            <option value="Islam">{t("islam")}</option>
            <option value="Hinduism">{t("hinduism")}</option>
            <option value="Buddhism">{t("buddhism")}</option>
            <option value="Christianity">{t("christianity")}</option>
          </select>
          {errors.religion && <p className="text-red-500 text-xs mt-1">{errors.religion.message}</p>}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("mobile")} *</label>
          <input 
            {...register("mobile")}
            type="tel" 
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all" 
          />
          {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("dob")} *</label>
          <Controller
            control={control}
            name="dob"
            render={({ field }) => (
              <DobSelector 
                value={field.value || ""} 
                onChange={field.onChange} 
                error={!!errors.dob} 
              />
            )}
          />
          {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("marital_status")} *</label>
          <select 
            {...register("maritalStatus")}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all"
          >
            <option value="">{t("select")}</option>
            <option value="Single">{t("single")}</option>
            <option value="Married">{t("married")}</option>
          </select>
          {errors.maritalStatus && <p className="text-red-500 text-xs mt-1">{errors.maritalStatus.message}</p>}
        </div>

        {/* NID */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("nid")} {t("optional")}</label>
          <input 
            {...register("nid")}
            type="text" 
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all" 
          />
        </div>

        {/* Birth Certificate */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("birth_cert")} {t("optional")}</label>
          <input 
            {...register("birthCertNo")}
            type="text" 
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all" 
          />
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("blood_group")} {t("optional")}</label>
          <select 
            {...register("bloodGroup")}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all"
          >
            <option value="">{t("select")}</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
      </div>
    </section>
  );
}
