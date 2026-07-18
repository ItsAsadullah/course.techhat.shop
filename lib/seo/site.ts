// =====================================================
// Central site / SEO constants.
// Set NEXT_PUBLIC_SITE_URL in .env.local (e.g. https://techhat.com).
// =====================================================

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://techhat.com"
).replace(/\/$/, "");

export const SITE = {
  name: "TechHat IT Institute",
  shortName: "TechHat",
  description:
    "Premium IT training center in Bangladesh — Web Development, Graphics Design, Digital Marketing, Programming and more, taught by industry experts.",
  twitter: "@techhat",
  logo: `${SITE_URL}/logo.png`,
  ogFallback: `${SITE_URL}/logo.png`,
  locales: { en: "en_US", bn: "bn_BD" } as Record<"en" | "bn", string>,
  hreflang: { en: "en", bn: "bn-BD" } as Record<"en" | "bn", string>,
} as const;

/** Organization node reused by every JSON-LD graph. */
export const ORGANIZATION = {
  "@type": "EducationalOrganization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE.name,
  alternateName: SITE.shortName,
  url: SITE_URL,
  logo: SITE.logo,
  sameAs: [
    "https://www.facebook.com/techhat",
    "https://www.linkedin.com/company/techhat",
    "https://www.youtube.com/@techhat",
  ],
} as const;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Canonical public URL for a course slug. */
export function courseUrl(slug: string): string {
  return absoluteUrl(`/courses/${slug}`);
}
