import type { MetadataRoute } from "next";
import { SITE_URL, courseUrl } from "@/lib/seo/site";
import { getPublishedCoursesForSeo, bestSlug } from "@/lib/seo/course-data";

// Revalidate the sitemap hourly.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/courses`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/admissions`, changeFrequency: "weekly", priority: 0.7 },
  ];

  const courses = await getPublishedCoursesForSeo();

  const courseRoutes: MetadataRoute.Sitemap = courses
    .map((c) => {
      const slug = bestSlug(c, "en");
      if (!slug) return null;

      // hreflang alternates
      const languages: Record<string, string> = {};
      if (c.slug_en) languages["en"] = courseUrl(c.slug_en);
      if (c.slug_bn) languages["bn-BD"] = courseUrl(c.slug_bn);

      const entry: MetadataRoute.Sitemap[number] = {
        url: courseUrl(slug),
        lastModified: c.updated_at || c.published_at || undefined,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: Object.keys(languages).length ? { languages } : undefined,
      };
      if (c.thumbnail_url) entry.images = [c.thumbnail_url];
      if (c.intro_video_url) {
        entry.videos = [
          {
            title: c.name_en || c.name_bn || "Course intro",
            thumbnail_loc: c.thumbnail_url || `${SITE_URL}/logo.png`,
            description: c.short_en || c.short_bn || c.name_en || "Course introduction video",
            content_loc: c.intro_video_url,
          },
        ];
      }
      return entry;
    })
    .filter(Boolean) as MetadataRoute.Sitemap;

  return [...staticRoutes, ...courseRoutes];
}
