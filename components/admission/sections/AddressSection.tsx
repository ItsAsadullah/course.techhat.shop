"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { AdmissionFormValues } from "@/lib/schema/admission.schema";
import { useLang } from "@/context/GlobalLangContext";
import { admissionTranslations, AdmissionTKey } from "@/lib/i18n/admission";
import { useGeoBangladesh } from "@/hooks/useGeoBangladesh";

export default function AddressSection({ id }: { id: string }) {
  const { register, control, setValue, formState: { errors } } = useFormContext<AdmissionFormValues>();
  const { lang } = useLang();
  const t = (key: AdmissionTKey) => admissionTranslations[lang][key];

  // Watch for dependent dropdowns
  const pDiv = useWatch({ control, name: "presentDivision" });
  const pDist = useWatch({ control, name: "presentDistrict" });
  const pUpa = useWatch({ control, name: "presentUpazila" });

  const { divisions, districts: pDistricts, upazilas: pUpazilas, unions: pUnions } = useGeoBangladesh(pDiv, pDist, pUpa);

  return (
    <section id={id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 scroll-mt-28">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        {t("sec_present_addr")}
      </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("division")} *</label>
            <select 
              {...register("presentDivision")}
              value={pDiv || ""}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="">{t("select_division")}</option>
              {divisions.map(d => (
                <option key={d.id} value={d.name}>{lang === "bn" ? d.nameBn : d.name}</option>
              ))}
            </select>
            {errors.presentDivision && <p className="text-red-500 text-xs mt-1">{errors.presentDivision.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("district")} *</label>
            <select 
              {...register("presentDistrict")}
              value={pDist || ""}
              disabled={!pDiv}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-50"
            >
              <option value="">{t("select_district")}</option>
              {pDistricts.map(d => (
                <option key={d.id} value={d.name}>{lang === "bn" ? d.nameBn : d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("upazila")} *</label>
            <select 
              {...register("presentUpazila")}
              value={pUpa || ""}
              disabled={!pDist}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-50"
            >
              <option value="">{t("select_upazila")}</option>
              {pUpazilas.map(d => (
                <option key={d.id} value={d.name}>{lang === "bn" ? d.nameBn : d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("union")} {t("optional")}</label>
            <select 
              {...register("presentUnion")}
              value={useWatch({ control, name: "presentUnion" }) || ""}
              disabled={!pUpa}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-50"
            >
              <option value="">{t("select_union")}</option>
              {pUnions.map(d => {
                const name = lang === "bn" ? d.nameBn.replace(/\s*ইউনিয়ন\s*$/, '').replace(/\s*পৌরসভা\s*$/, '') : d.name.replace(/\s*Union\s*$/i, '').replace(/\s*Paurashava\s*$/i, '');
                return <option key={d.id} value={d.name}>{name}</option>;
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{lang === "bn" ? "ডাকঘর" : "Post Office"} {t("optional")}</label>
            <input 
              {...register("presentPostOffice")}
              type="text" 
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("post_code")} {t("optional")}</label>
            <input 
              {...register("presentPostCode")}
              type="text" 
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all" 
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("village")} *</label>
            <textarea 
              {...register("presentVillage")}
              rows={2}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all" 
            />
          </div>
        </div>
      </section>
  );
}
