import { SITE, SITE_URL, courseUrl } from "@/lib/seo/site";
import { getPublishedCoursesForSeo, bestSlug } from "@/lib/seo/course-data";

// RSS 2.0 feed of published courses. Cached for one hour.
export const revalidate = 3600;

function escapeXml(s: string): string {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const courses = await getPublishedCoursesForSeo();
  const now = new Date().toUTCString();

  const items = courses
    .map((c) => {
      const slug = bestSlug(c, "en");
      if (!slug) return "";
      const link = courseUrl(slug);
      const title = escapeXml(c.name_en || c.name_bn || "Course");
      const desc = escapeXml(c.short_en || c.short_bn || "");
      const pubDate = c.published_at ? new Date(c.published_at).toUTCString() : now;
      const image = c.thumbnail_url
        ? `<enclosure url="${escapeXml(c.thumbnail_url)}" type="image/jpeg" />`
        : "";
      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${desc}</description>
      <pubDate>${pubDate}</pubDate>
      ${image}
    </item>`;
    })
    .filter(Boolean)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)} — Courses</title>
    <link>${SITE_URL}/courses</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(SITE.description)}</description>
    <language>bn-BD</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
