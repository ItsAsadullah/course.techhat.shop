"use client";

import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { AdmissionFormValues } from "@/lib/schema/admission.schema";
import { useLang } from "@/context/GlobalLangContext";
import { admissionTranslations, AdmissionTKey } from "@/lib/i18n/admission";

export default function DeclarationSection({ id }: { id: string }) {
  const { register, formState: { errors } } = useFormContext<AdmissionFormValues>();
  const { lang } = useLang();
  const t = (key: AdmissionTKey) => admissionTranslations[lang][key];

  return (
    <section id={id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 scroll-mt-28">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        {t("sec_declaration")}
      </h2>
      
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
          <input type="checkbox" {...register("termsAccepted")} className="mt-1 w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
          <span className="font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            <span>{t("terms")}</span>{" "}
            {lang === "bn" ? (
              <span>আমি <Link href="/privacy-policy" className="text-blue-600 hover:underline" target="_blank">প্রাইভেসি পলিসি</Link> এবং <Link href="/terms" className="text-blue-600 hover:underline" target="_blank">শর্তাবলীর</Link> সাথে একমত।</span>
            ) : (
              <span>I agree to the <Link href="/privacy-policy" className="text-blue-600 hover:underline" target="_blank">Privacy Policy</Link> and <Link href="/terms" className="text-blue-600 hover:underline" target="_blank">Terms and Conditions</Link>.</span>
            )}
          </span>
        </label>
        {errors.termsAccepted && <p className="text-red-500 text-sm mt-1">{errors.termsAccepted.message}</p>}
      </div>
    </section>
  );
}
