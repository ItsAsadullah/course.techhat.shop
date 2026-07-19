import { createClient } from "@/lib/admin/supabase/server";
import type { Lang } from "@/types/course";

// =====================================================
// Public, SEO-facing course reads. Run with the anon/cookie
// client so RLS restricts to published + public courses.
// =====================================================

export interface SeoCourseListItem {
  id: string;
  slug_en: string | null;
  slug_bn: string | null;
  name_en: string | null;
  name_bn: string | null;
  short_en: string | null;
  short_bn: string | null;
  thumbnail_url: string | null;
  intro_video_url: string | null;
  published_at: string | null;
  updated_at: string | null;
}

/** All published + public courses, flattened for sitemap / RSS. */
export async function getPublishedCoursesForSeo(): Promise<SeoCourseListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select(
      `id, published_at, updated_at, status, visibility,
       translations:course_translations(lang, name, slug, short_description),
       media:course_media(thumbnail_url, intro_video_url)`
    )
    .eq("status", "published")
    .eq("visibility", "public")
    .order("published_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row: Record<string, unknown>) => {
    type TrRow = { lang: string; name?: string; slug?: string; short_description?: string };
    const tr = (row.translations as TrRow[]) || [];
    const empty: TrRow = { lang: "" };
    const en = tr.find((t) => t.lang === "en") ?? empty;
    const bn = tr.find((t) => t.lang === "bn") ?? empty;
    const mediaRaw = row.media;
    const media = (Array.isArray(mediaRaw) ? mediaRaw[0] : mediaRaw || {}) as { thumbnail_url?: string; intro_video_url?: string };
    return {
      id: row.id as string,
      slug_en: en.slug || null,
      slug_bn: bn.slug || null,
      name_en: en.name || null,
      name_bn: bn.name || null,
      short_en: en.short_description || null,
      short_bn: bn.short_description || null,
      thumbnail_url: media?.thumbnail_url || null,
      intro_video_url: media?.intro_video_url || null,
      published_at: (row.published_at as string) || null,
      updated_at: (row.updated_at as string) || null,
    };
  });
}

/** Pick the best slug for a course in a given language, with fallback. */
export function bestSlug(item: SeoCourseListItem, lang: Lang = "en"): string | null {
  if (lang === "bn") return item.slug_bn || item.slug_en;
  return item.slug_en || item.slug_bn;
}
