// =====================================================
// Lightweight, dependency-free SEO / readability heuristics.
// Runs in the browser (Step 3 live panel) and on the server
// (cached to course_seo.seo_score). Not a replacement for a
// real crawler — a fast, deterministic editorial guide.
// =====================================================

export interface SeoCheck {
  id: string;
  label: string;
  status: "good" | "warn" | "bad";
  hint?: string;
}

export interface SeoScoreResult {
  score: number; // 0..100
  checks: SeoCheck[];
  keywordDensity: number; // percent
  readability: number; // 0..100 (Flesch reading ease, clamped)
}

export interface SeoInput {
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  focusKeyword?: string;
  content?: string; // long description / body used for density + readability
}

const normalizeText = (s?: string) => {
  if (!s) return "";
  return s.toLowerCase().trim()
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces/joiners
    .replace(/\s+/g, ' '); // Normalize spaces
};

/** Percentage of body words that are the focus keyword (phrase-aware). */
export function keywordDensity(content?: string, keyword?: string): number {
  const body = normalizeText(content);
  const kw = normalizeText(keyword);
  if (!body || !kw) return 0;
  
  const words = body.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;
  
  const kwWords = kw.split(/\s+/).filter(Boolean).length || 1;
  const occurrences = body.split(kw).length - 1;
  
  return Math.round(((occurrences * kwWords) / words.length) * 1000) / 10;
}

/** Approximate English syllable count for a single word. */
function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const groups = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "")
    .match(/[aeiouy]{1,2}/g);
  return groups ? groups.length : 1;
}

/** Readability heuristic. Adapts for Bengali by avoiding English syllable counts if non-ASCII. */
export function readabilityScore(content?: string): number {
  const text = (content || "").trim();
  if (!text) return 0;
  
  // If it's mostly Bengali (or non-ascii), just use a simpler metric based on word/sentence length
  const isNonAscii = /[^\x00-\x7F]/.test(text);
  
  const sentences = Math.max(1, (text.match(/[.!?।]+/g) || []).length);
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;
  
  if (isNonAscii) {
    // Bengali/Non-English readability heuristic:
    // Avg words per sentence. If <= 15, very readable (100). If > 30, hard to read (0).
    const avgWords = words.length / sentences;
    const score = 100 - ((avgWords - 12) * 5); // 12 words = 100, 32 words = 0
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  const syl = words.reduce((n, w) => n + syllables(w), 0) || words.length;
  const ease =
    206.835 - 1.015 * (words.length / sentences) - 84.6 * (syl / words.length);
  return Math.max(0, Math.min(100, Math.round(ease)));
}

export function computeSeoScore(input: SeoInput): SeoScoreResult {
  const checks: SeoCheck[] = [];
  const title = input.metaTitle || "";
  const desc = input.metaDescription || "";
  const kw = normalizeText(input.focusKeyword);
  const density = keywordDensity(input.content, input.focusKeyword);
  const readability = readabilityScore(input.content);

  // Title length (recommended 50–60 chars)
  checks.push({
    id: "title-length",
    label: "Meta title length (50–60)",
    status: title.length >= 45 && title.length <= 60 ? "good" : title.length ? "warn" : "bad",
    hint: `${title.length} chars`,
  });

  // Description length (recommended 120–160 chars)
  checks.push({
    id: "desc-length",
    label: "Meta description length (120–160)",
    status: desc.length >= 120 && desc.length <= 160 ? "good" : desc.length ? "warn" : "bad",
    hint: `${desc.length} chars`,
  });

  // Focus keyword present
  checks.push({
    id: "focus-keyword",
    label: "Focus keyword set",
    status: kw ? "good" : "bad",
  });

  // Keyword in title
  checks.push({
    id: "kw-in-title",
    label: "Keyword in meta title",
    status: kw && normalizeText(title).includes(kw) ? "good" : kw ? "warn" : "bad",
  });

  // Keyword in description
  checks.push({
    id: "kw-in-desc",
    label: "Keyword in meta description",
    status: kw && normalizeText(desc).includes(kw) ? "good" : kw ? "warn" : "bad",
  });

  // Keyword in slug - more lenient for Bengali (warning if not present, but doesn't ruin score completely if it's Bengali)
  const isBengaliKeyword = /[^\x00-\x7F]/.test(kw);
  const slugMatches = kw && normalizeText(input.slug).replace(/-/g, ' ').includes(kw.replace(/-/g, ' '));
  checks.push({
    id: "kw-in-slug",
    label: "Keyword in URL slug",
    status: slugMatches ? "good" : (isBengaliKeyword ? "warn" : (kw ? "warn" : "bad")),
  });

  // Density between 0.5% and 2.5% (Bengali texts might naturally have lower density, tolerate down to 0.3%)
  checks.push({
    id: "kw-density",
    label: "Keyword density (0.5–2.5%)",
    status: density >= 0.3 && density <= 3.0 ? "good" : density > 0 ? "warn" : "bad",
    hint: `${density}%`,
  });

  // Readability
  checks.push({
    id: "readability",
    label: "Readability",
    status: readability >= 60 ? "good" : readability >= 30 ? "warn" : "bad",
    hint: `${readability}/100`,
  });

  const weight = { good: 1, warn: 0.5, bad: 0 } as const;
  const score = Math.round(
    (checks.reduce((sum, c) => sum + weight[c.status], 0) / checks.length) * 100
  );

  return { score, checks, keywordDensity: density, readability };
}
