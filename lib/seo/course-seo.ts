// =====================================================
// Public SEO data access + normalization for courses.
// Server-only helpers used by the detail page, sitemap,
// robots and RSS. Uses the same admin Supabase client the
// rest of the app uses (RLS still gates to published/public).
// =====================================================

import "server-only";
import { createClient } from "@/lib/admin/supabase/server";
import type { CourseSeo, Lang } from "@/types/course";
import { courseUrl } from "./site";

export interface PublicCourseListItem {
  id: string;
  slug_en: string;
  slug_bn: string;
  name_en: string;
  name_bn: string;
  short_en: string;
  short_bn: string;
  thumbnail: string | null;
  intro_video_url: string | null;
  category_en: string | null;
  updated_at: string;
  published_at: string | null;
  robots_index: boolean; // false if any SEO row is noindex
}

/** Published + public courses, flattened for sitemap / RSS / listing. */
export async function getPublishedCoursesForSeo(limit = 1000): Promise<PublicCourseListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select(
      `id, updated_at, published_at, status, visibility,
       translations:course_translations(lang, name, slug, short_description),
       media:course_media(thumbnail_url, intro_video_url),
       seo:course_seo(lang, robots_index),
       category:course_categories!category_id(name_en)`
    )
    .eq("status", "published")
    .eq("visibility", "public")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row: any) => {
    const tr: any[] = row.translations || [];
    const en = tr.find((t) => t.lang === "en") || {};
    const bn = tr.find((t) => t.lang === "bn") || {};
    const media = Array.isArray(row.media) ? row.media[0] : row.media || {};
    const category = Array.isArray(row.category) ? row.category[0] : row.category || {};
    const seoRows: any[] = row.seo || [];
    const robots_index = seoRows.length ? seoRows.every((s) => s.robots_index !== false) : true;

    return {
      id: row.id,
      slug_en: en.slug || "",
      slug_bn: bn.slug || "",
      name_en: en.name || "",
      name_bn: bn.name || "",
      short_en: en.short_description || "",
      short_bn: bn.short_description || "",
      thumbnail: media.thumbnail_url || null,
      intro_video_url: media.intro_video_url || null,
      category_en: category.name_en || null,
      updated_at: row.updated_at,
      published_at: row.published_at,
      robots_index,
    };
  });
}

/** Pick the SEO row for a language, falling back to the other. */
export function seoForLang(seo: CourseSeo[] | undefined | null, lang: Lang): Partial<CourseSeo> {
  if (!seo || seo.length === 0) return {};
  return seo.find((s) => s.lang === lang) ?? seo[0] ?? {};
}

/** Best public canonical URL for a course (prefers English slug). */
export function bestCourseUrl(slugEn: string, slugBn: string): string {
  return courseUrl(slugEn || slugBn);
}
