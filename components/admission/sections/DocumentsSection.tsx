"use client";

import { useFormContext, Controller } from "react-hook-form";
import { AdmissionFormValues } from "@/lib/schema/admission.schema";
import { useLang } from "@/context/GlobalLangContext";
import { admissionTranslations, AdmissionTKey } from "@/lib/i18n/admission";
import FileUpload from "@/components/ui/FileUpload";

export default function DocumentsSection({ id }: { id: string }) {
  const { control, formState: { errors } } = useFormContext<AdmissionFormValues>();
  const { lang } = useLang();
  const t = (key: AdmissionTKey) => admissionTranslations[lang][key];

  return (
    <section id={id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 scroll-mt-28">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        {t("sec_docs")}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Controller
            control={control}
            name="photoUrl"
            render={({ field }) => (
              <FileUpload
                label="Student Photo *"
                value={field.value}
                onUpload={field.onChange}
                onRemove={() => field.onChange("")}
                accept="image/*"
              />
            )}
          />
          {errors.photoUrl && <p className="text-red-500 text-xs mt-2">{errors.photoUrl.message}</p>}
        </div>

        <div>
          <Controller
            control={control}
            name="nidUrl"
            render={({ field }) => (
              <FileUpload
                label="NID / Birth Certificate"
                value={field.value}
                onUpload={field.onChange}
                onRemove={() => field.onChange("")}
              />
            )}
          />
        </div>
      </div>
    </section>
  );
}
