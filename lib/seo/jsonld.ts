// =====================================================
// schema.org JSON-LD builders (Course, BreadcrumbList,
// FAQPage, EducationalOrganization). Decoupled from the DB
// shape — callers pass explicit primitives. Assemble the
// nodes into an @graph with buildCourseGraph().
// =====================================================

import { ORGANIZATION, SITE, SITE_URL } from "./site";

export interface CourseInstanceInput {
  courseMode?: string; // "onsite" | "online" | "blended"
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  instructorNames?: string[];
}

export interface CourseJsonLdInput {
  name: string;
  description: string;
  url: string; // canonical, absolute
  image?: string | null;
  courseCode?: string | null;
  inLanguage: string; // "en" | "bn"
  educationalLevel?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  price?: number | null;
  currency?: string;
  isFree?: boolean;
  ratingValue?: number | null;
  reviewCount?: number | null;
  instances?: CourseInstanceInput[];
  instructorNames?: string[];
}

export function buildOrganizationJsonLd() {
  return { "@context": "https://schema.org", ...ORGANIZATION };
}

export function buildCourseJsonLd(input: CourseJsonLdInput) {
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: input.name,
    description: input.description,
    url: input.url,
    inLanguage: input.inLanguage,
    provider: {
      "@type": "EducationalOrganization",
      name: SITE.name,
      url: SITE_URL,
      sameAs: ORGANIZATION.sameAs,
    },
  };

  if (input.image) node.image = input.image;
  if (input.courseCode) node.courseCode = input.courseCode;
  if (input.educationalLevel) node.educationalLevel = input.educationalLevel;
  if (input.datePublished) node.datePublished = input.datePublished;
  if (input.dateModified) node.dateModified = input.dateModified;

  // Offers — required for Course rich results
  node.offers = {
    "@type": "Offer",
    category: input.isFree ? "Free" : "Paid",
    price: input.isFree ? 0 : input.price ?? 0,
    priceCurrency: input.currency || "BDT",
    availability: "https://schema.org/InStock",
    url: input.url,
  };

  // Course instances (from batches, or a sensible default)
  const instances =
    input.instances && input.instances.length
      ? input.instances
      : [{ courseMode: "blended" }];
  node.hasCourseInstance = instances.map((ci) => {
    const inst: Record<string, unknown> = {
      "@type": "CourseInstance",
      courseMode: ci.courseMode || "blended",
    };
    if (ci.startDate) inst.startDate = ci.startDate;
    if (ci.endDate) inst.endDate = ci.endDate;
    if (ci.location) inst.location = { "@type": "Place", name: ci.location };
    const names = ci.instructorNames || input.instructorNames;
    if (names && names.length) {
      inst.instructor = names.map((n) => ({ "@type": "Person", name: n }));
    }
    return inst;
  });

  if (input.ratingValue && input.reviewCount && input.reviewCount > 0) {
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: input.ratingValue,
      reviewCount: input.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return node;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqJsonLd(faqs: FaqItem[]) {
  const valid = faqs.filter((f) => f.question?.trim() && f.answer?.trim());
  if (valid.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: valid.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Combine enabled nodes into an @graph (single <script> tag). */
export function buildCourseGraph(opts: {
  course?: object | null;
  breadcrumb?: object | null;
  faq?: object | null;
  organization?: object | null;
}) {
  const graph = [opts.organization, opts.breadcrumb, opts.course, opts.faq].filter(
    Boolean
  );
  return { "@context": "https://schema.org", "@graph": graph };
}
