
import { getCourseBySlug } from "@/lib/admin/actions/courses";
import { allCourses, getCourseBySlug as getCatalogCourseBySlug, type Course as CatalogCourse } from "@/data/courses";
import { createClient } from "@/lib/admin/supabase/server";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import CourseStickyNav from "@/components/course/CourseStickyNav";
import CurriculumAccordion from "@/components/course/CurriculumAccordion";
import FaqAccordion from "@/components/course/FaqAccordion";
import {
  Clock, Users, Star, CheckCircle2, ArrowRight, GraduationCap, User,
  ChevronRight, Play, Download, BookOpen, Target, Briefcase,
  Layers3, BadgeCheck, Sparkles, Quote, Monitor, Globe, 
  TrendingUp, Rocket, Lightbulb, ShieldCheck, Code,
  Cpu, Database, Layout, PenTool, Terminal, Award, MapPin, Zap
} from "lucide-react";
import type { Metadata } from "next";
import { SITE, SITE_URL, courseUrl, absoluteUrl } from "@/lib/seo/site";
import {
  buildCourseJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildOrganizationJsonLd,
  buildCourseGraph,
} from "@/lib/seo/jsonld";
import { readingTime } from "@/lib/seo/reading-time";
import { cache } from "react";
import { getVideoEmbedUrl, getVideoKind } from "@/lib/video";
import { cookies } from "next/headers";

interface Props {
  params: Promise<{ slug: string }>;
}

type CourseSource = "database" | "catalog" | "generated";

type CoursePageData = {
  source: CourseSource;
  raw: Record<string, unknown>;
  sourceLabel: string;
  related: CatalogCourse[];
};

const BANGLA_DIGITS: Record<string, string> = {
  "০": "0",
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "৫": "5",
  "৬": "6",
  "৭": "7",
  "৮": "8",
  "৯": "9",
};

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseCount(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return fallback;
  const normalized = value.replace(/[০-৯]/g, (digit) => BANGLA_DIGITS[digit] || digit);
  const digits = normalized.match(/\d+/g)?.join("");
  return digits ? Number(digits) : fallback;
}

function joinSentences(lines: string[]): string {
  return lines.filter(Boolean).join("\n\n");
}

function buildFaqs(title: string, feeLabel: string, durationLabel: string) {
  return [
    {
      question_en: `What will I learn in ${title}?`,
      question_bn: `${title} কোর্সে কী শিখব?`,
      answer_en: `You will get practical, job-focused training with ${durationLabel} of guided learning, project work, and support tailored to the course.`,
      answer_bn: `আপনি ${durationLabel} জুড়ে হাতে-কলমে শিখবেন, প্রজেক্ট করবেন এবং প্রয়োজনীয় সাপোর্ট পাবেন।`,
    },
    {
      question_en: "Is certificate included?",
      question_bn: "সার্টিফিকেট কি অন্তর্ভুক্ত?",
      answer_en: "Yes. Completion support and certificate details are shown in the sidebar for this course.",
      answer_bn: "হ্যাঁ। কোর্স শেষে সার্টিফিকেট ও সমাপ্তি সম্পর্কিত তথ্য সাইডবারে দেখানো হয়েছে।",
    },
    {
      question_en: "How much does it cost?",
      question_bn: "ফি কত?",
      answer_en: `The current fee display starts from ${feeLabel}. Please contact admissions for the latest offer and installment options.`,
      answer_bn: `বর্তমান ফি দেখানো হচ্ছে ${feeLabel} থেকে। সর্বশেষ অফার ও কিস্তির তথ্যের জন্য ভর্তি টিমের সাথে যোগাযোগ করুন।`,
    },
  ];
}

function buildStaticCoursePayload(course: CatalogCourse, slug: string) {
  const title = course.nameEn || slugToTitle(course.slug);
  const durationLabel = course.duration || "কোর্স সমাপ্তির সময়";
  const fee = parseCount(course.fee, 3000);
  const monthlyFee = parseCount(course.monthlyFee, 1500);
  const enrolled = parseCount(course.students, 0);
  const summary = course.fullDescription;
  const longDescription = joinSentences([
    course.fullDescription,
    `এই কোর্সে ${course.modules.length}টি focused module-এর মাধ্যমে শেখানো হয়।`,
    course.learningOutcomes.length > 0 ? `আপনি যা শিখবেন: ${course.learningOutcomes.join("; ")}.` : "",
  ]);

  return {
    course_code: `CAT-${course.slug.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "COURSE"}`,
    course_type: course.mode,
    course_level: "beginner",
    status: "published",
    is_featured: Boolean(course.badge),
    is_popular: enrolled > 75,
    is_trending: enrolled > 90,
    total_enrolled: enrolled,
    average_rating: 4.8,
    total_reviews: Math.max(12, Math.round(enrolled / 4) || 18),
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    translations: [
      {
        lang: "en",
        name: title,
        slug: course.slug,
        short_description: summary,
        long_description: longDescription,
        learning_outcomes: course.learningOutcomes,
        requirements: ["Basic computer literacy", "Interest in practical learning"],
        who_should_join: ["Beginners", "Career switchers", "Students and job seekers"],
        career_opportunities: [title, `${title} Assistant`, `${title} Specialist`],
      },
      {
        lang: "bn",
        name: course.name,
        slug: course.slug,
        short_description: summary,
        long_description: longDescription,
        learning_outcomes: course.learningOutcomes,
        requirements: ["বেসিক কম্পিউটার জ্ঞান", "হাতে-কলমে শেখার আগ্রহ"],
        who_should_join: ["নতুন শিক্ষার্থী", "ক্যারিয়ার পরিবর্তনকারী", "চাকরি প্রত্যাশী"],
        career_opportunities: [course.name, `${course.name} অ্যাসিস্ট্যান্ট`, `${course.name} স্পেশালিস্ট`],
      },
    ],
    media: [
      {
        thumbnail_url: course.image || null,
        banner_url: course.image || null,
        intro_video_url: null,
        brochure_pdf_url: null,
      },
    ],
    pricing: [
      {
        course_fee: fee,
        admission_fee: 0,
        monthly_fee: monthlyFee,
        is_free: fee === 0,
        discount_percent: 0,
        certificate_option: "included",
        installment_available: true,
        installment_count: 3,
      },
    ],
    duration: [
      {
        duration_text_en: durationLabel,
        duration_text_bn: durationLabel,
        total_classes: Math.max(12, course.modules.length * 4),
        total_hours: null,
        is_lifetime_access: true,
      },
    ],
    features: [
      {
        has_certificate: true,
        has_lifetime_support: true,
        has_community_access: true,
        has_private_group: true,
        has_live_qa: true,
        has_projects: true,
        has_assignments: true,
        has_exam: true,
        has_final_project: true,
        has_job_guideline: true,
        has_internship_support: true,
        has_career_support: true,
        has_freelancing_guide: true,
        has_cv_review: true,
        has_portfolio_review: true,
      },
    ],
    category: [
      {
        name_en: course.mode === "online" ? "Online Course" : "Offline Course",
        name_bn: course.mode === "online" ? "অনলাইন কোর্স" : "অফলাইন কোর্স",
      },
    ],
    faqs: buildFaqs(title, `৳${fee.toLocaleString("bn-BD")}`, durationLabel),
    seo: [
      {
        lang: "en",
        meta_title: `${title} — TechHat IT Institute`,
        meta_description: summary,
        meta_keywords: `${title}, TechHat, ${course.slug}`,
        focus_keyword: title,
        canonical_url: courseUrl(slug),
        og_title: `${title} — TechHat IT Institute`,
        og_description: summary,
        og_image_url: course.image || null,
        twitter_card: "summary_large_image",
        robots_index: true,
        schema_type: "Course",
        seo_score: 80,
        readability_score: 80,
        keyword_density: 1,
      },
      {
        lang: "bn",
        meta_title: `${course.name} — TechHat IT Institute`,
        meta_description: summary,
        meta_keywords: `${course.name}, TechHat`,
        focus_keyword: course.name,
        canonical_url: courseUrl(slug),
        og_title: `${course.name} — TechHat IT Institute`,
        og_description: summary,
        og_image_url: course.image || null,
        twitter_card: "summary_large_image",
        robots_index: true,
        schema_type: "Course",
        seo_score: 80,
        readability_score: 80,
        keyword_density: 1,
      },
    ],
    modules: course.modules,
  };
}

function buildGeneratedCoursePayload(slug: string) {
  const title = slugToTitle(slug);
  const summary = `TechHat IT Institute-এর ${title} কোর্সে হাতে-কলমে শেখানো হয়, যাতে আপনি বাস্তব কাজের জন্য প্রস্তুত হতে পারেন।`;
  const description = joinSentences([
    summary,
    "এই পেজটি আপাতত স্বয়ংক্রিয়ভাবে তৈরি হয়েছে, তাই আপনি কোর্সের কাঠামো, সাপোর্ট, এবং ভর্তি তথ্য একসাথে দেখতে পারবেন।",
    "কোর্সটি আপডেট হলে একই URL-এ বিস্তারিত তথ্য আরও সমৃদ্ধ হবে।",
  ]);

  return {
    course_code: `TMP-${slug.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "COURSE"}`,
    course_type: "offline",
    course_level: "beginner",
    status: "published",
    is_featured: false,
    is_popular: false,
    is_trending: false,
    total_enrolled: 0,
    average_rating: 0,
    total_reviews: 0,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    translations: [
      {
        lang: "en",
        name: title,
        slug,
        short_description: summary,
        long_description: description,
        learning_outcomes: [
          "Real-world practical workflow",
          "Project-based guided learning",
          "Career-focused support",
        ],
        requirements: ["Basic computer literacy"],
        who_should_join: ["Beginners", "Job seekers", "Students"],
        career_opportunities: [title, `${title} Assistant`],
      },
      {
        lang: "bn",
        name: title,
        slug,
        short_description: summary,
        long_description: description,
        learning_outcomes: [
          "বাস্তব কাজের workflow",
          "প্রজেক্টভিত্তিক শেখা",
          "ক্যারিয়ার ফোকাসড সাপোর্ট",
        ],
        requirements: ["বেসিক কম্পিউটার জ্ঞান"],
        who_should_join: ["নতুন শিক্ষার্থী", "চাকরি প্রত্যাশী", "স্টুডেন্ট"],
        career_opportunities: [title, `${title} অ্যাসিস্ট্যান্ট`],
      },
    ],
    media: [{ thumbnail_url: null, banner_url: null, intro_video_url: null, brochure_pdf_url: null }],
    pricing: [{ course_fee: 3000, admission_fee: 0, monthly_fee: 1500, is_free: false, discount_percent: 0, certificate_option: "included", installment_available: true, installment_count: 3 }],
    duration: [{ duration_text_en: "3 months", duration_text_bn: "৩ মাস", total_classes: 24, total_hours: 36, is_lifetime_access: true }],
    features: [{ has_certificate: true, has_lifetime_support: true, has_community_access: true, has_private_group: true, has_live_qa: true, has_projects: true, has_assignments: true, has_exam: true, has_final_project: true, has_job_guideline: true, has_internship_support: true, has_career_support: true, has_freelancing_guide: true, has_cv_review: true, has_portfolio_review: true }],
    category: [{ name_en: "Course", name_bn: "কোর্স" }],
    faqs: buildFaqs(title, "৳3,000", "৩ মাস"),
    seo: [{ lang: "en", meta_title: `${title} — TechHat IT Institute`, meta_description: summary, meta_keywords: title, focus_keyword: title, canonical_url: courseUrl(slug), og_title: `${title} — TechHat IT Institute`, og_description: summary, og_image_url: null, twitter_card: "summary_large_image", robots_index: true, schema_type: "Course", seo_score: 70, readability_score: 70, keyword_density: 1 }],
    modules: [
      { title: "Module 1: Getting Started", topics: ["Course overview", "Core tools", "Learning workflow"] },
      { title: "Module 2: Hands-on Practice", topics: ["Guided exercises", "Mini projects", "Review sessions"] },
      { title: "Module 3: Career Preparation", topics: ["Portfolio basics", "Interview guidance", "Next steps"] },
    ],
  };
}

const getCoursePageData = cache(async (slug: string): Promise<CoursePageData> => {
  const publishedCourse = await getCourseBySlug(slug).catch(() => null);
  if (publishedCourse) {
    return {
      source: "database",
      raw: publishedCourse as unknown as Record<string, unknown>,
      sourceLabel: "লাইভ ডাটাবেস ডেটা",
      related: allCourses,
    };
  }

  const catalogCourse = getCatalogCourseBySlug(slug);
  if (catalogCourse) {
    return {
      source: "catalog",
      raw: buildStaticCoursePayload(catalogCourse, slug),
      sourceLabel: "ক্যাটালগ প্রিভিউ",
      related: allCourses,
    };
  }

  return {
    source: "generated",
    raw: buildGeneratedCoursePayload(slug),
    sourceLabel: "অস্থায়ী বিস্তারিত পৃষ্ঠা",
    related: allCourses,
  };
});

/** Bangla-locale date format for published/updated timestamps. */
function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
}

/** Normalize a raw course row into the pieces SEO needs, choosing a primary language. */
function seoFrom(courseRaw: Record<string, unknown>, slug: string, langCookie?: "en" | "bn") {
  const translations: Record<string, unknown>[] = (courseRaw.translations as Record<string, unknown>[]) || [];
  const enT = translations.find((t) => t.lang === "en") || {};
  const bnT = translations.find((t) => t.lang === "bn") || {};
  // Which language does this URL slug belong to? (Override with cookie if available)
  const primary: "en" | "bn" = langCookie || "bn";
  const T = primary === "bn" ? bnT : enT;
  const other = primary === "bn" ? enT : bnT;

  const seoRows: Record<string, unknown>[] = (courseRaw.seo as Record<string, unknown>[]) || [];
  const seo = seoRows.find((s) => s.lang === primary) || seoRows.find((s) => s.lang === "en") || {};

  const media: Record<string, unknown> = Array.isArray(courseRaw.media) ? courseRaw.media[0] : (courseRaw.media as Record<string, unknown>) || {};
  const title = seo.meta_title || `${T.name || other.name || ""} — ${SITE.name}`;
  const description = seo.meta_description || T.short_description || other.short_description || SITE.description;

  return { primary, T, other, enT, bnT, seo, media, title, description };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const { raw: courseRaw } = await getCoursePageData(decodedSlug);
  
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("techhat-lang")?.value as "en" | "bn" | undefined;

  const { primary, enT, bnT, seo, media, title, description } = seoFrom(courseRaw as Record<string, unknown>, decodedSlug, langCookie);

  const canonical = seo.canonical_url || courseUrl(decodedSlug);
  const ogImage = seo.og_image_url || media.thumbnail_url || media.banner_url || SITE.ogFallback;
  const keywords = ((seo.meta_keywords as string) || "")
    .split(",")
    .map((k: string) => k.trim())
    .filter(Boolean);

  // hreflang alternates — link both language slugs when present.
  const languages: Record<string, string> = {};
  if (enT.slug) languages[SITE.hreflang.en] = courseUrl(enT.slug as string);
  if (bnT.slug) languages[SITE.hreflang.bn] = courseUrl(bnT.slug as string);

  const indexable = seo.robots_index ?? true;

  return {
    metadataBase: new URL(SITE_URL),
    title: title as string,
    description: description as string,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: canonical as string, languages: Object.keys(languages).length ? languages : undefined },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      url: canonical as string,
      title: (seo.og_title as string) || (title as string),
      description: (seo.og_description as string) || (description as string),
      siteName: SITE.name,
      locale: SITE.locales[primary],
      images: [{ url: ogImage as string, width: 1200, height: 630, alt: String(title) }],
    },
    twitter: {
      card: ((seo.twitter_card as string) || "summary_large_image") as "summary" | "summary_large_image" | "player" | "app" | undefined,
      title: (seo.og_title as string) || (title as string),
      description: (seo.og_description as string) || (description as string),
      images: [ogImage as string],
    },
  };
}

export const revalidate = 60;

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const { raw: courseRaw, source, sourceLabel, related } = await getCoursePageData(decodedSlug);
  
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("techhat-lang")?.value as "en" | "bn" | undefined;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  const { primary, T, other, enT, bnT, seo, media, title, description } = seoFrom(courseRaw as Record<string, unknown>, decodedSlug, langCookie);
  
  const pricing: Record<string, unknown> = Array.isArray(courseRaw.pricing) ? courseRaw.pricing[0] : (courseRaw.pricing as Record<string, unknown>) || {};
  const duration: Record<string, unknown> = Array.isArray(courseRaw.duration) ? courseRaw.duration[0] : (courseRaw.duration as Record<string, unknown>) || {};
  const features: Record<string, unknown> = Array.isArray(courseRaw.features) ? courseRaw.features[0] : (courseRaw.features as Record<string, unknown>) || {};
  const faqs: Record<string, unknown>[] = (courseRaw.faqs as Record<string, unknown>[]) || [];
  const category: Record<string, unknown> = Array.isArray(courseRaw.category) ? courseRaw.category[0] : (courseRaw.category as Record<string, unknown>) || {};

  // Array content fields may be stored as JSON strings (or PG array text) in TEXT columns.
  const parseArr = (v: unknown): Record<string, unknown>[] => {
    if (Array.isArray(v)) return v;
    if (typeof v === "string" && v.trim()) {
      try {
        const p = JSON.parse(v);
        if (Array.isArray(p)) return p;
      } catch { }
      if (v.startsWith("{") && v.endsWith("}")) {
        return (v.slice(1, -1).split(",").map((s) => s.replace(/(^"|"$)/g, "").replace(/\\"/g, '"')).filter(Boolean) as unknown) as Record<string, unknown>[];
      }
      return (v.split("\n").filter(Boolean) as unknown) as Record<string, unknown>[];
    }
    return [];
  };

  const name = T.name || other.name || slugToTitle(slug);
  const shortDesc = (T.short_description as string) || (other.short_description as string) || `TechHat IT Institute-এর ${name} কোর্সে হাতে-কলমে শেখানো হয়।`;
  const longDesc = (T.long_description as string) || (other.long_description as string) || joinSentences([
    shortDesc,
    "কোর্সের কাঠামো, ভর্তি সাপোর্ট, এবং শেখার ফলাফল এই পেজে বিস্তারিতভাবে দেখানো হয়েছে।",
  ]);
  const outcomes: string[] = (parseArr(T.learning_outcomes || other.learning_outcomes) as unknown) as string[];
  const requirements: string[] = (parseArr(T.requirements || other.requirements) as unknown) as string[];
  const whoJoin: string[] = (parseArr(T.who_should_join || other.who_should_join) as unknown) as string[];
  const careers: string[] = (parseArr(T.career_opportunities || other.career_opportunities) as unknown) as string[];
  const skillsCovered: Record<string, unknown>[] = parseArr(T.skills_covered || other.skills_covered);
  const softwareUsed: Record<string, unknown>[] = parseArr(T.software_used || other.software_used);
  const projectsList: string[] = (parseArr(T.projects || other.projects) as unknown) as string[];
  const modules: Record<string, unknown>[] = Array.isArray(courseRaw.modules) ? (courseRaw.modules as Record<string, unknown>[]) : [];
  const trainers: Record<string, unknown>[] = Array.isArray(courseRaw.trainers) ? (courseRaw.trainers as Record<string, unknown>[]) : [];
  const testimonials = (Array.isArray(courseRaw.reviews) ? (courseRaw.reviews as Record<string, unknown>[]) : []).filter((r: Record<string, unknown>) => r.is_testimonial && r.is_approved);

  const discountedFee = (pricing.course_fee as number) > 0 && (pricing.discount_percent as number) > 0
    ? (pricing.course_fee as number) - ((pricing.course_fee as number) * (pricing.discount_percent as number) / 100)
    : (pricing.course_fee as number);

  // ---------- SEO: JSON-LD structured data ----------
  const canonical = seo.canonical_url || courseUrl(slug);
  const ogImage = seo.og_image_url || media.thumbnail_url || media.banner_url || null;
  const readTime = readingTime([longDesc as string, ...outcomes, ...requirements]);

  const courseJsonLd = buildCourseJsonLd({
    name: name as string,
    description: (shortDesc || name) as string,
    url: canonical as string,
    image: ogImage as string,
    courseCode: courseRaw.course_code as string,
    inLanguage: primary,
    educationalLevel: courseRaw.course_level as string,
    datePublished: courseRaw.published_at as string,
    dateModified: courseRaw.updated_at as string,
    price: Math.round(discountedFee) || null,
    currency: (pricing.currency as string) || "BDT",
    isFree: !!pricing.is_free,
    ratingValue: (courseRaw.average_rating as number) || null,
    reviewCount: (courseRaw.total_reviews as number) || null,
    instances: [{ courseMode: courseRaw.course_type === "online" ? "online" : "blended" }],
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Courses", url: absoluteUrl("/courses") },
    { name: name as string, url: canonical as string },
  ]);
  const faqJsonLd = buildFaqJsonLd(
    faqs.map((f) => ({
      question: (f.question_bn || f.question_en || "") as string,
      answer: (f.answer_bn || f.answer_en || "") as string,
    }))
  );
  const graph = buildCourseGraph({
    organization: buildOrganizationJsonLd(),
    breadcrumb: breadcrumbJsonLd,
    course: courseJsonLd,
    faq: faqJsonLd,
  });

  const customFeatures = parseArr(T.benefits).length > 0 ? parseArr(T.benefits) : parseArr(other.benefits);
  const FEATURE_LIST = [
    { key: "has_certificate", icon: "🏆", label: primary === "bn" ? "সার্টিফিকেট প্রদান" : "Certificate Provided" },
    { key: "has_lifetime_support", icon: "♾️", label: primary === "bn" ? "লাইফটাইম সাপোর্ট" : "Lifetime Support" },
    { key: "has_community_access", icon: "👥", label: primary === "bn" ? "কমিউনিটি এক্সেস" : "Community Access" },
    { key: "has_private_group", icon: "🔒", label: primary === "bn" ? "প্রাইভেট গ্রুপ" : "Private Group" },
    { key: "has_live_qa", icon: "🎙️", label: primary === "bn" ? "লাইভ প্রশ্নোত্তর সেশন" : "Live Q&A Session" },
    { key: "has_projects", icon: "💻", label: primary === "bn" ? "রিয়েল লাইফ প্রজেক্টস" : "Real-life Projects" },
    { key: "has_assignments", icon: "📝", label: primary === "bn" ? "অ্যাসাইনমেন্ট" : "Assignments" },
    { key: "has_exam", icon: "✍️", label: primary === "bn" ? "ফাইনাল এক্সাম" : "Final Exam" },
    { key: "has_final_project", icon: "🎯", label: primary === "bn" ? "ফাইনাল প্রজেক্ট" : "Final Project" },
    { key: "has_job_guideline", icon: "💼", label: primary === "bn" ? "জব গাইডলাইন" : "Job Guideline" },
    { key: "has_internship_support", icon: "🤝", label: primary === "bn" ? "ইন্টার্নশিপ সাপোর্ট" : "Internship Support" },
    { key: "has_career_support", icon: "🚀", label: primary === "bn" ? "ক্যারিয়ার সাপোর্ট" : "Career Support" },
    { key: "has_freelancing_guide", icon: "🌐", label: primary === "bn" ? "ফ্রিল্যান্সিং গাইডলাইন" : "Freelancing Guideline" },
    { key: "has_cv_review", icon: "📄", label: primary === "bn" ? "সিভি রিভিউ" : "CV Review" },
    { key: "has_portfolio_review", icon: "🎨", label: primary === "bn" ? "পোর্টফোলিও রিভিউ" : "Portfolio Review" },
  ].filter(f => features[f.key]);

  // Append custom features
  customFeatures.forEach((f) => {
    FEATURE_LIST.push({ key: `custom_${f.name}`, icon: "✨", label: f.name as string });
  });

  const isBn = primary === "bn";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Structured data (schema.org) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

      {/* Hero */}
      <div className="relative overflow-hidden bg-[#0f172a]">
        {/* Spot Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/40 rounded-full blur-[110px] -translate-y-1/4 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-10 right-[30%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[110px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-30 pb-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">{isBn ? "হোম" : "Home"}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/courses" className="hover:text-white transition-colors">{isBn ? "কোর্সসমূহ" : "Courses"}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">{name as string}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {!!category.name_bn && (
                  <span className="inline-flex items-center gap-1 rounded-[4px] bg-white/10 px-2 py-1 text-xs text-white border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-blue-300" /> {isBn ? (category.name_bn as string) : (category.name_en as string || category.name_bn as string)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-[4px] bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400 border border-emerald-500/30">
                  <BadgeCheck className="w-3.5 h-3.5" /> {isBn ? "লাইভ কোর্স" : "Live Course"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-[4px] bg-amber-500/20 px-2 py-1 text-xs text-amber-300 border border-amber-500/30">
                  {isBn ? "ব্যাচ - 1" : "Batch - 1"}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">{name as string}</h1>
              <div className="text-slate-300 text-base md:text-lg leading-relaxed mb-6 space-y-2">
                <p>{shortDesc as string}</p>
              </div>

              {/* Action & Price */}
              <div className="flex flex-wrap items-center gap-4 mb-6 mt-8">
                <Link href={`/enroll/${slug}`} className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-6 py-2.5 rounded-lg transition-colors">
                  {isBn ? "ভর্তি হোন" : "Enroll Now"} <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-white">৳{discountedFee.toLocaleString(isBn ? "bn-BD" : "en-US")}</span>
                  {(pricing.course_fee as number) > discountedFee && (
                    <span className="text-lg text-slate-400 line-through">৳{(pricing.course_fee as number).toLocaleString(isBn ? "bn-BD" : "en-US")}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Content: Spacer for Absolute Card */}
            <div className="hidden lg:block relative z-10 pt-4">
              {/* The sticky PriceCard will overlap this area from below */}
            </div>
      </div>
        </div>
      </div>

      {/* Sticky Sub-Navigation (Tabs) */}
      <CourseStickyNav
        hasAbout={!!longDesc}
        hasOutcomes={outcomes.length > 0 || skillsCovered.length > 0}
        hasCurriculum={modules.length > 0}
        hasProjects={careers.length > 0 || projectsList.length > 0 || testimonials.length > 0}
        hasFaq={faqs.length > 0}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            {/* Banner */}
            {!!media.banner_url && (
              <div className="rounded-2xl overflow-hidden shadow-xl h-64 md:h-80">
                <img src={media.banner_url as string} alt={name as string} className="w-full h-full object-cover" />
              </div>
            )}



            {/* Features */}
            {FEATURE_LIST.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{isBn ? "এই কোর্সে যা পাবেন" : "What You'll Get in This Course"}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {FEATURE_LIST.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span>{f.icon as string}</span> {f.label as string}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Long Description */}
            {longDesc && (
              <div id="about" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 !scroll-mt-[140px] md:!scroll-mt-[150px]">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" /> {isBn ? "কোর্স সম্পর্কে" : "About Course"}
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
                  {(longDesc as string).split("\n").map((line: string, i: number) => <p key={i}>{line}</p>)}
                </div>
              </div>
            )}

            {/* Learning Outcomes & Skills */}
            {(outcomes.length > 0 || skillsCovered.length > 0) && (
              <div id="outcomes" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 !scroll-mt-[140px] md:!scroll-mt-[150px]">
                {outcomes.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <Target className="w-6 h-6 text-blue-600" /> {isBn ? "শেখার ফলাফল" : "Learning Outcomes"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {outcomes.map((item: string, i: number) => (
                        <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:shadow-md transition-all group">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mt-0.5">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {skillsCovered.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 mt-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-amber-500" /> {isBn ? "যে স্কিলগুলো শিখবেন" : "Skills You'll Learn"}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {skillsCovered.map((s: Record<string, unknown>, i: number) => {
                        const skillName = typeof s === "string" ? s : (s.name as string);
                        const skillImg = typeof s === "object" ? (s.image_url as string) : "";
                        if (!skillName) return null;

                        const gradients = [
                          "from-blue-500 to-cyan-400",
                          "from-purple-500 to-pink-500",
                          "from-amber-500 to-orange-400",
                          "from-emerald-500 to-teal-400",
                          "from-rose-500 to-red-400",
                          "from-indigo-500 to-violet-500",
                          "from-fuchsia-500 to-pink-500",
                          "from-sky-500 to-blue-500",
                        ];
                        const icons = [Code, Cpu, Database, Layout, PenTool, Terminal, Sparkles, Monitor];
                        const bg = gradients[i % gradients.length];
                        const Icon = icons[i % icons.length];
                        
                        return (
                          <div key={i} className="flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all group">
                            {/* Card Image / Graphic Area */}
                            <div className={`h-24 md:h-28 w-full ${skillImg ? "bg-slate-100 dark:bg-slate-800" : `bg-linear-to-br ${bg}`} relative overflow-hidden flex items-center justify-center`}>
                              {!skillImg && (
                                <div className="absolute inset-0 bg-white/10 mix-blend-overlay opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '12px 12px' }}></div>
                              )}
                              {skillImg ? (
                                <img src={skillImg} alt={skillName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              ) : (
                                <Icon className="w-10 h-10 text-white/90 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300 drop-shadow-md" />
                              )}
                            </div>
                            {/* Card Content */}
                            <div className="p-4 flex items-center justify-center text-center min-h-[4rem]">
                              <span className="text-slate-800 dark:text-slate-200 font-bold text-sm leading-tight">
                                {skillName}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Curriculum */}
            {modules.length > 0 && (
              <div id="curriculum" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 !scroll-mt-[140px] md:!scroll-mt-[150px]">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Layers3 className="w-5 h-5 text-blue-600" /> {isBn ? "কোর্স কাঠামো" : "Course Curriculum"}
                </h2>
                <CurriculumAccordion modules={modules} />
              </div>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-center lg:justify-start">
                  {isBn ? "কী কী থাকতে হবে" : "Prerequisites"}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {requirements.map((r, i) => {
                    const icons = [
                      <Monitor className="w-8 h-8 text-blue-500" />,
                      <Globe className="w-8 h-8 text-emerald-500" />,
                      <TrendingUp className="w-8 h-8 text-amber-500" />,
                      <Rocket className="w-8 h-8 text-purple-500" />,
                      <Lightbulb className="w-8 h-8 text-rose-500" />,
                      <ShieldCheck className="w-8 h-8 text-indigo-500" />,
                    ];
                    return (
                      <div key={i} className="flex flex-col items-center justify-center p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800/50 hover:shadow-sm transition-all group">
                        <div className="w-16 h-16 flex items-center justify-center bg-white dark:bg-slate-900 rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform">
                          {icons[i % icons.length]}
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm md:text-base leading-snug">{r}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Who Should Join */}
            {whoJoin.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-center lg:justify-start">
                  {isBn ? "কারা যোগ দিতে পারবেন?" : "Who Can Join?"}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {whoJoin.map((w, i) => {
                    const icons = [
                      <Users className="w-8 h-8 text-indigo-500" />,
                      <Briefcase className="w-8 h-8 text-rose-500" />,
                      <GraduationCap className="w-8 h-8 text-blue-500" />,
                      <BadgeCheck className="w-8 h-8 text-emerald-500" />,
                      <Target className="w-8 h-8 text-amber-500" />,
                      <Sparkles className="w-8 h-8 text-purple-500" />,
                    ];
                    return (
                      <div key={i} className="flex flex-col items-center justify-center p-6 text-center rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-300 transition-all group">
                        <div className="w-16 h-16 flex items-center justify-center bg-white dark:bg-slate-900 rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform">
                          {icons[i % icons.length]}
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm md:text-base leading-snug">{w}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Career Opportunities & Projects */}
            {(careers.length > 0 || projectsList.length > 0 || softwareUsed.length > 0) && (
              <div id="projects" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 !scroll-mt-[140px] md:!scroll-mt-[150px]">
                {careers.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-600" /> {isBn ? "ক্যারিয়ার সুযোগ" : "Career Opportunities"}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {careers.map((c, i) => {
                        const icons = [Briefcase, Target, Rocket, Star, TrendingUp, Award, MapPin, Zap];
                        const gradients = [
                          "bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-100 dark:border-blue-800/30",
                          "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-800/30",
                          "bg-purple-50 dark:bg-purple-900/20 text-purple-600 border-purple-100 dark:border-purple-800/30",
                          "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-800/30",
                          "bg-rose-50 dark:bg-rose-900/20 text-rose-600 border-rose-100 dark:border-rose-800/30",
                          "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-100 dark:border-indigo-800/30",
                        ];
                        const Icon = icons[i % icons.length];
                        const colorClass = gradients[i % gradients.length];

                        return (
                          <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-sm ${colorClass}`}>
                            <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg shadow-sm shrink-0">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-sm leading-tight text-slate-800 dark:text-slate-200">
                              {c}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {projectsList.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 mt-8 flex items-center gap-2">
                      <Layers3 className="w-6 h-6 text-indigo-500" /> {isBn ? "কোর্সে যা যা প্রজেক্ট করানো হবে" : "Projects Included"}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      {projectsList.map((p, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition-colors">
                          <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                            <Layers3 className="w-6 h-6" />
                          </div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{p}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {softwareUsed.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <Download className="w-6 h-6 text-rose-500" /> {isBn ? "ব্যবহৃত সফটওয়্যারসমূহ" : "Software Used"}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {softwareUsed.map((s, i) => {
                        const sName = typeof s === "string" ? s : (s.name as string);
                        const sImg = typeof s === "object" ? (s.image_url as string) : "";
                        if (!sName) return null;

                        const themes = [
                          { bg: "bg-blue-50/50 dark:bg-blue-950/20", border: "border-blue-100 dark:border-blue-900/30 hover:border-blue-300", icon: "text-blue-500", text: "text-blue-900 dark:text-blue-200" },
                          { bg: "bg-emerald-50/50 dark:bg-emerald-950/20", border: "border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-300", icon: "text-emerald-500", text: "text-emerald-900 dark:text-emerald-200" },
                          { bg: "bg-purple-50/50 dark:bg-purple-950/20", border: "border-purple-100 dark:border-purple-900/30 hover:border-purple-300", icon: "text-purple-500", text: "text-purple-900 dark:text-purple-200" },
                          { bg: "bg-amber-50/50 dark:bg-amber-950/20", border: "border-amber-100 dark:border-amber-900/30 hover:border-amber-300", icon: "text-amber-500", text: "text-amber-900 dark:text-amber-200" },
                          { bg: "bg-rose-50/50 dark:bg-rose-950/20", border: "border-rose-100 dark:border-rose-900/30 hover:border-rose-300", icon: "text-rose-500", text: "text-rose-900 dark:text-rose-200" },
                          { bg: "bg-indigo-50/50 dark:bg-indigo-950/20", border: "border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-300", icon: "text-indigo-500", text: "text-indigo-900 dark:text-indigo-200" },
                          { bg: "bg-cyan-50/50 dark:bg-cyan-950/20", border: "border-cyan-100 dark:border-cyan-900/30 hover:border-cyan-300", icon: "text-cyan-500", text: "text-cyan-900 dark:text-cyan-200" },
                        ];
                        const t = themes[i % themes.length];

                        return (
                          <div key={i} className={`flex flex-col items-center justify-center gap-3 p-4 ${t.bg} rounded-xl border ${t.border} transition-colors text-center group`}>
                            <div className={`w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl shadow-sm ${t.icon} overflow-hidden ${sImg ? 'border border-slate-100 dark:border-slate-800' : ''}`}>
                              {sImg ? (
                                <img src={sImg} alt={sName} className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300" />
                              ) : (
                                <Monitor className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                              )}
                            </div>
                            <span className={`font-semibold ${t.text} text-sm`}>
                              {sName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Trainers */}
            {trainers.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" /> {isBn ? "কোর্স ইন্সট্রাক্টর" : "Course Instructors"}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {trainers.map((t: Record<string, unknown>, i: number) => {
                    const tr = (t.trainer || {}) as Record<string, unknown>;
                    return (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 border-2 border-white dark:border-slate-700">
                          {tr.image_url ? (
                            <img src={tr.image_url as string} alt={(tr.name_bn || tr.name_en) as string} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-full h-full p-3 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">{(tr.name_bn || tr.name_en) as string}</h3>
                          <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{(tr.designation_bn || tr.designation_en) as string}</p>
                          {!!(tr.bio_bn || tr.bio_en) && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{(tr.bio_bn || tr.bio_en) as string}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <div id="reviews" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 !scroll-mt-[140px] md:!scroll-mt-[150px]">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> {isBn ? "শিক্ষার্থীদের মতামত" : "Student Testimonials"}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {testimonials.map((t: Record<string, unknown>, i: number) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 relative">
                      <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-200 dark:text-slate-800" />
                      <div className="flex gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-4 h-4 ${idx < (t.rating as number) ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'}`}
                          />
                        ))}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm italic mb-4 relative z-10 leading-relaxed">
                        "{t.body as string}"
                      </p>
                      <div className="flex items-center gap-3 mt-auto">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 overflow-hidden shrink-0 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                          {t.author_image_url ? (
                            <img src={t.author_image_url as string} alt={t.author_name as string} className="w-full h-full object-cover" />
                          ) : (
                            (t.author_name as string).charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">{t.author_name as string}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{isBn ? "শিক্ষার্থী," : "Student,"} {name as string}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <div id="faq" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 !scroll-mt-[140px] md:!scroll-mt-[150px]">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{isBn ? "সাধারণ প্রশ্নোত্তর (FAQ)" : "Frequently Asked Questions (FAQ)"}</h2>
                <FaqAccordion faqs={faqs} />
              </div>
            )}
          </div>

          {/* Right Sidebar — Mobile Price Card */}
          <div className="lg:hidden">
            <PriceCard
              pricing={pricing}
              hasPricingData={!!pricing}
              discountedFee={discountedFee}
              duration={duration}
              hasDurationData={!!duration}
              brochureUrl={media.brochure_pdf_url as string}
              media={media}
              FEATURE_LIST={FEATURE_LIST}
              slug={slug}
              isBn={isBn}
              isLoggedIn={isLoggedIn}
            />
          </div>

          {/* Desktop Sticky Sidebar */}
          <div className="hidden lg:block relative">
            <div className="sticky top-28 -mt-[480px] z-[45]">
              <PriceCard
                pricing={pricing}
                hasPricingData={!!pricing}
                discountedFee={discountedFee}
                duration={duration}
                hasDurationData={!!duration}
                brochureUrl={media.brochure_pdf_url as string}
                media={media}
                FEATURE_LIST={FEATURE_LIST}
                slug={slug}
                isBn={isBn}
                isLoggedIn={isLoggedIn}
              />
            </div>
      </div>
        </div>
      </div>

      {/* Related courses */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2">{isBn ? "আরও কোর্স" : "More Courses"}</p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{isBn ? "সংশ্লিষ্ট কোর্সসমূহ" : "Related Courses"}</h2>
            </div>
            <Link href="/courses" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors inline-flex items-center gap-1">
              {isBn ? "সব কোর্স দেখুন" : "View All Courses"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {related.filter((course) => course.slug !== slug).slice(0, 4).map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 transition-all duration-300"
              >
                <div className="h-40 bg-linear-to-br from-slate-900 via-blue-950 to-slate-800">
                  {course.image ? (
                    <img src={course.image as string} alt={course.name as string} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <GraduationCap className="w-12 h-12 text-white/60" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">{course.mode === "online" ? (isBn ? "অনলাইন" : "Online") : (isBn ? "অফলাইন" : "Offline")}</p>
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.name as string}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{course.fullDescription as string}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration as string}</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{isBn ? "বিস্তারিত" : "Details"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Price Card Component
function PriceCard({ pricing, hasPricingData, discountedFee, duration, hasDurationData, brochureUrl, media, FEATURE_LIST, slug, isBn, isLoggedIn }: {
  pricing: Record<string, unknown>;
  hasPricingData: boolean;
  discountedFee: number;
  duration: Record<string, unknown>;
  hasDurationData: boolean;
  brochureUrl?: string;
  media?: Record<string, unknown>;
  FEATURE_LIST?: Record<string, unknown>[];
  slug: string;
  isBn: boolean;
  isLoggedIn: boolean;
}) {
  const previewVideoUrl = getVideoEmbedUrl((media?.preview_video_url || media?.demo_video_url || media?.intro_video_url) as string);
  const previewVideoKind = getVideoKind((media?.preview_video_url || media?.demo_video_url || media?.intro_video_url) as string);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden flex flex-col">
      
      {/* 1. Video Section */}
      <div className="w-full relative aspect-[16/9] bg-slate-900 group border-b-4 border-emerald-500">
        {previewVideoUrl ? (
          previewVideoKind === "direct" ? (
            <video controls className="h-full w-full bg-black object-cover" src={previewVideoUrl} poster={(media?.banner_url || media?.thumbnail_url || undefined) as string | undefined} />
          ) : (
            <iframe
              src={previewVideoUrl}
              title="Course preview video"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )
        ) : (
          <>
            <img src={(media?.banner_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800") as string} alt="Course Intro" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-pink-200/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-pink-500 ml-1 fill-pink-500" />
              </div>
            </div>
          </>
        )}
        <div className="pointer-events-none absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/80 to-transparent flex items-center gap-2">
          <Play className="w-4 h-4 text-white fill-white" />
          <span className="text-white text-sm font-semibold">
            {isBn ? "ক্লিক করে দেখে নিন কোর্সের ডেমো ক্লাস" : "Click to watch demo class"}
          </span>
        </div>
      </div>


      {/* 3. Pricing */}
      <div className="p-5 pb-3">
        {(pricing.is_free || discountedFee === 0) ? (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 drop-shadow-sm tracking-wide">
              FREE
            </span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm">
              {isBn ? "সম্পূর্ণ বিনামূল্যে" : "Completely Free"}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                ৳{Math.round(discountedFee).toLocaleString(isBn ? "bn-BD" : "en-US")}
              </span>
              {(pricing.discount_percent as number) > 0 && (
                <span className="text-lg text-orange-400 line-through">
                  ৳{Number(pricing.course_fee).toLocaleString(isBn ? "bn-BD" : "en-US")}
                </span>
              )}
            </div>
            {(pricing.discount_percent as number) > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-md border border-emerald-100 dark:border-emerald-800/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> {isBn ? "প্রোমো অ্যাপ্লাইড" : "Promo Applied"}
                <span className="ml-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-800/40 rounded text-emerald-700 dark:text-emerald-300">TECHHAT</span>
              </div>
            )}
          </div>
        )}

        {/* 4. Action Button */}
        <Link
          href={`/enroll/${slug}`}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-[#fbc02d] hover:bg-[#f9a825] text-slate-900 font-bold text-base transition-all shadow-sm"
        >
          {isBn ? "ব্যাচে ভর্তি হোন" : "Enroll in Batch"} <ChevronRight className="w-5 h-5" />
        </Link>

        {/* 5. Countdown Timer */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs">
          <Clock className="w-4 h-4 text-red-500" />
          <span className="text-red-500 font-medium">{isBn ? "ব্যাচ শুরু হতে সময় বাকি -" : "Time left for batch starts -"}</span>
          <span className="bg-red-50 dark:bg-red-900/20 text-red-500 px-2 py-1 rounded font-mono font-medium">21d : 1h : 50m : 14s</span>
        </div>
      </div>

      <div className="px-5 pb-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 mt-2">{isBn ? "এই কোর্সে আপনি পাচ্ছেন:" : "You will get in this course:"}</h3>
        {/* 6. Features Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4">
          {FEATURE_LIST?.slice(0, 10).map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <div className="mt-0.5 shrink-0 bg-white rounded-full">
                 <CheckCircle2 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </div>
              <span className="leading-tight">{f.label as string}</span>
            </div>
          ))}
          {/* Default items if FEATURE_LIST is short */}
          {(!FEATURE_LIST || FEATURE_LIST.length < 4) && (
            <>
              <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-4 h-4 text-slate-700 mt-0.5 shrink-0" /> <span className="leading-tight">{isBn ? "৭ মাসের স্টাডি প্ল্যান" : "7 Months Study Plan"}</span></div>
              <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-4 h-4 text-slate-700 mt-0.5 shrink-0" /> <span className="leading-tight">{isBn ? "৪৮ টি লাইভ ক্লাস" : "48 Live Classes"}</span></div>
              <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-4 h-4 text-slate-700 mt-0.5 shrink-0" /> <span className="leading-tight">{isBn ? "১ টি ক্যাপস্টোন প্রজেক্ট" : "1 Capstone Project"}</span></div>
              <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-4 h-4 text-slate-700 mt-0.5 shrink-0" /> <span className="leading-tight">{isBn ? "লাইফটাইম এক্সেস" : "Lifetime Access"}</span></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
