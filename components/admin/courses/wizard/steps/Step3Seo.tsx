"use client";

import { useMemo, useState } from "react";
import { useFormContext, useWatch, Path, PathValue } from "react-hook-form";
import { useLang } from "@/context/GlobalLangContext";
import { courseWizardT } from "@/lib/i18n/course-wizard";
import { computeSeoScore } from "@/lib/seo/score";
import { courseUrl } from "@/lib/seo/site";
import { TWITTER_CARDS, SCHEMA_TYPES, type CourseFormValues } from "@/lib/schema/course-wizard.schema";
import { inputCls, labelCls } from "../shared";
import { AiAssistButton } from "../fields/AiAssistButton";
import { FileUploadField } from "../fields/FileUploadField";
import { SeoScorePanel } from "../previews/SeoScorePanel";
import {
  GoogleSearchPreview,
  FacebookSharePreview,
  TwitterSharePreview,
  LinkedInPreview,
} from "../previews/SocialPreviews";
import { generateSeo } from "@/lib/admin/actions/ai-course";

type L = "en" | "bn";

function Counter({ value, min, max }: { value: string; min: number; max: number }) {
  const len = (value || "").length;
  const ok = len >= min && len <= max;
  return (
    <span className={`text-[11px] ${ok ? "text-emerald-500" : "text-slate-400"}`}>
      {len}/{max}
    </span>
  );
}

function SeoLangFields({ lang }: { lang: L }) {
  const { register } = useFormContext<CourseFormValues>();
  const { control } = useFormContext<CourseFormValues>();
  const t = useLang();
  const tt = (k: keyof typeof courseWizardT["en"]) => courseWizardT[t.lang][k];
  const p = `seo.${lang}` as const;

  const metaTitle = useWatch({ control, name: `seo.${lang}.meta_title` }) || "";
  const metaDesc = useWatch({ control, name: `seo.${lang}.meta_description` }) || "";

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={labelCls + " mb-0"}>{tt("metaTitle")}</label>
          <Counter value={metaTitle} min={45} max={60} />
        </div>
        <input {...register(`${p}.meta_title`)} className={inputCls + (lang === "bn" ? " font-bn" : "")} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={labelCls + " mb-0"}>{tt("metaDescription")}</label>
          <Counter value={metaDesc} min={120} max={160} />
        </div>
        <textarea {...register(`${p}.meta_description`)} rows={3} className={inputCls + (lang === "bn" ? " font-bn" : "")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>{tt("focusKeyword")}</label>
          <input {...register(`${p}.focus_keyword`)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{tt("metaKeywords")}</label>
          <input {...register(`${p}.meta_keywords`)} placeholder="kw1, kw2, kw3" className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>{tt("canonicalUrl")}</label>
        <input {...register(`${p}.canonical_url`)} placeholder="https://…" className={inputCls} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>{tt("ogTitle")}</label>
          <input {...register(`${p}.og_title`)} className={inputCls} />
        </div>
        <div>
          <FileUploadField name={`${p}.og_image_url`} label={tt("ogImage") as string} folder="courses" />
        </div>
      </div>

      <div>
        <label className={labelCls}>{tt("ogDescription")}</label>
        <textarea {...register(`${p}.og_description`)} rows={2} className={inputCls} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls}>{tt("twitterCard")}</label>
          <select {...register(`${p}.twitter_card`)} className={inputCls}>
            {TWITTER_CARDS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>{tt("schemaType")}</label>
          <select {...register(`${p}.schema_type`)} className={inputCls}>
            {SCHEMA_TYPES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>{tt("robots")}</label>
          <label className="flex items-center gap-2 h-[46px]">
            <input type="checkbox" {...register(`${p}.robots_index`)} className="h-4 w-4 rounded accent-blue-600" />
            <span className="text-sm text-slate-600 dark:text-slate-300">{tt("indexable")}</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export function Step3Seo() {
  const { lang: uiLang } = useLang();
  const t = (k: keyof typeof courseWizardT["en"]) => courseWizardT[uiLang][k];
  const { control, setValue } = useFormContext<CourseFormValues>();
  const [tab, setTab] = useState<L>(uiLang === "bn" ? "bn" : "en");

  const values = useWatch({ control }) as CourseFormValues;
  const seo = values?.seo?.[tab] || ({} as NonNullable<CourseFormValues["seo"]>["en"]);
  const g = values?.general || ({} as CourseFormValues["general"]);
  const c = values?.content || ({} as CourseFormValues["content"]);

  const seoMetaTitle = seo.meta_title;
  const seoMetaDescription = seo.meta_description;
  const seoFocusKeyword = seo.focus_keyword;
  const slugEn = g.slug_en;
  const slugBn = g.slug_bn;
  const longDescEn = c.long_description_en;
  const longDescBn = c.long_description_bn;

  const scoreResult = useMemo(
    () =>
      computeSeoScore({
        metaTitle: seoMetaTitle,
        metaDescription: seoMetaDescription,
        slug: tab === "en" ? slugEn : slugBn,
        focusKeyword: seoFocusKeyword,
        content: tab === "en" ? longDescEn : longDescBn,
      }),
    [seoMetaTitle, seoMetaDescription, seoFocusKeyword, slugEn, slugBn, longDescEn, longDescBn, tab]
  );

  const slug = (tab === "en" ? g.slug_en : g.slug_bn) || "course";
  const preview = {
    title: seo.og_title || seo.meta_title || (tab === "en" ? g.name_en : g.name_bn) || "Course title",
    description:
      seo.og_description ||
      seo.meta_description ||
      (tab === "en" ? c.short_description_en : c.short_description_bn) ||
      "",
    url: seo.canonical_url || courseUrl(slug),
    image: seo.og_image_url || undefined,
    siteName: "TechHat IT Institute",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 p-0.5">
          {(["en", "bn"] as L[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setTab(l)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                tab === l ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {l === "en" ? "English SEO" : "বাংলা SEO"}
            </button>
          ))}
        </div>
        <AiAssistButton
          label="Generate SEO with AI"
          action={() => generateSeo({ name: g.name_en || g.name_bn, shortDescription: c.short_description_en })}
          onResult={(d) => {
            const seoData = d as Partial<Record<L, Record<string, unknown>>> | null;
            (["en", "bn"] as L[]).forEach((l) => {
              const src = seoData?.[l];
              if (!src) return;
              Object.entries(src).forEach(([k, v]) =>
                setValue(`seo.${l}.${k}` as Path<CourseFormValues>, v as PathValue<CourseFormValues, Path<CourseFormValues>>, { shouldDirty: true })
              );
            });
          }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <SeoLangFields lang={tab} />
        </div>
        <div className="space-y-5">
          <SeoScorePanel result={scoreResult} />
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2">{t("googlePreview")}</p>
            <GoogleSearchPreview {...preview} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2">{t("facebookPreview")}</p>
            <FacebookSharePreview {...preview} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2">{t("twitterPreview")}</p>
              <TwitterSharePreview {...preview} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2">{t("linkedinPreview")}</p>
              <LinkedInPreview {...preview} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
