"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { RefreshCw } from "lucide-react";
import { useLang } from "@/context/GlobalLangContext";
import { courseWizardT } from "@/lib/i18n/course-wizard";
import {
  COURSE_TYPES,
  COURSE_LEVELS,
  COURSE_STATUSES,
  COURSE_VISIBILITIES,
  type CourseFormValues,
} from "@/lib/schema/course-wizard.schema";
import type { CourseCategory } from "@/types/course";
import { BilingualInput } from "../fields/BilingualInput";
import { SlugInput } from "../fields/SlugInput";
import { SelectField } from "../fields/SelectField";
import { TagInput } from "../fields/TagInput";
import { AiAssistButton } from "../fields/AiAssistButton";
import { inputCls, labelCls } from "../shared";
import { generateSlug, generateTags } from "@/lib/admin/actions/ai-course";

const titleCase = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function genCode(nameEn: string): string {
  const prefix =
    (nameEn || "CRS")
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, "")
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 4) || "CRS";
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function Step1General({ categories }: { categories: CourseCategory[] }) {
  const { lang } = useLang();
  const t = (k: keyof typeof courseWizardT["en"]) => courseWizardT[lang][k];
  const { register, setValue, control } = useFormContext<CourseFormValues>();

  const nameEn = useWatch({ control, name: "general.name_en" });
  const nameBn = useWatch({ control, name: "general.name_bn" });
  const categoryId = useWatch({ control, name: "general.category_id" });
  const visibility = useWatch({ control, name: "general.visibility" });

  const catOptions = categories
    .filter((c) => !c.parent_id)
    .map((c) => ({
      value: c.id,
      label: lang === "bn" ? c.name_bn : c.name_en,
    }));
  const subCatOptions = categories
    .filter((c) => c.parent_id === categoryId)
    .map((c) => ({ value: c.id, label: lang === "bn" ? c.name_bn : c.name_en }));

  return (
    <div className="space-y-6">
      <BilingualInput
        label={t("courseNameEn").replace(" (English)", "")}
        nameEn="general.name_en"
        nameBn="general.name_bn"
        required
        placeholderEn="e.g. Full-Stack Web Development"
        placeholderBn="যেমন ফুল-স্ট্যাক ওয়েব ডেভেলপমেন্ট"
      />

      <SlugInput />

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Course code */}
        <div>
          <label className={labelCls}>{t("courseCode")} <span className="text-red-500">*</span></label>
          <div className="flex gap-1.5">
            <input {...register("general.course_code")} className={inputCls} placeholder="WEB-1234" />
            <button
              type="button"
              onClick={() => setValue("general.course_code", genCode(nameEn || nameBn), { shouldDirty: true })}
              title={t("autoCode")}
              className="shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 px-2.5 text-slate-500 hover:text-blue-600 hover:border-blue-300"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <TagInput
          name="general.tags"
          label={t("tags")}
          hint={t("tagsHint")}
          action={
            <AiAssistButton
              action={() => {
                const categoryName = categories.find(c => c.id === categoryId)?.name_en;
                return generateTags({ name: nameEn || nameBn, category: categoryName });
              }}
              onResult={(d) => {
                const result = d as { tags?: string[] } | null;
                if (result?.tags) setValue("general.tags", result.tags, { shouldDirty: true, shouldValidate: true });
              }}
            />
          }
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField label={t("category")} name="general.category_id" options={catOptions} required placeholder="—" />
        <SelectField label={t("subCategory")} name="general.sub_category_id" options={subCatOptions} placeholder="—" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SelectField
          label={t("courseType")}
          name="general.course_type"
          options={COURSE_TYPES.map((v) => ({ value: v, label: titleCase(v) }))}
        />
        <SelectField
          label={t("difficulty")}
          name="general.course_level"
          options={COURSE_LEVELS.map((v) => ({ value: v, label: titleCase(v) }))}
        />
        <SelectField
          label={t("status")}
          name="general.status"
          options={COURSE_STATUSES.map((v) => ({ value: v, label: titleCase(v) }))}
        />
        <SelectField
          label={t("visibility")}
          name="general.visibility"
          options={COURSE_VISIBILITIES.map((v) => ({ value: v, label: titleCase(v) }))}
        />
      </div>

      {visibility === "password" && (
        <div className="max-w-sm">
          <label className={labelCls}>{t("password")}</label>
          <input {...register("general.password")} type="text" className={inputCls} placeholder="••••••" />
        </div>
      )}

      {/* AI slug helper */}
      <div>
        <AiAssistButton
          label="AI Slug"
          action={() => generateSlug({ name: nameEn || nameBn })}
          onResult={(d) => {
            const result = d as { en?: string; bn?: string } | null;
            if (result?.en) setValue("general.slug_en", result.en, { shouldDirty: true, shouldValidate: true });
            if (result?.bn) setValue("general.slug_bn", result.bn, { shouldDirty: true, shouldValidate: true });
          }}
        />
      </div>
    </div>
  );
}
