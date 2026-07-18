"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { getAiModelsConfig } from "@/lib/admin/actions/ai";

// =====================================================
// Course-focused AI generators. Reuse the multi-provider
// config from ai.ts; every generator returns strict JSON.
// =====================================================

const NO_EMOJI =
  "CRITICAL: Do NOT use emojis anywhere. Return ONLY raw valid JSON, no markdown fences.";

async function runAiJson<T = any>(
  prompt: string,
  modelId?: string
): Promise<{ data: T } | { error: string }> {
  try {
    const { models, defaultModelId } = await getAiModelsConfig();
    if (!models.length)
      return { error: "No AI models configured. Add one in Settings > Integrations." };

    const target = models.find((m) => m.id === (modelId || defaultModelId)) || models[0];
    let text = "";

    if (target.provider === "gemini") {
      const genAI = new GoogleGenerativeAI(target.apiKey);
      const model = genAI.getGenerativeModel({
        model: target.modelName,
        generationConfig: { responseMimeType: "application/json" },
      });
      text = (await model.generateContent(prompt)).response.text();
    } else if (target.provider === "anthropic") {
      const anthropic = new Anthropic({ apiKey: target.apiKey });
      const msg = await anthropic.messages.create({
        model: target.modelName,
        max_tokens: 4000,
        messages: [{ role: "user", content: `${prompt}\n\n${NO_EMOJI}` }],
      });
      text = (msg.content[0] as any)?.text || "";
    } else {
      // openai / xai / groq all use the OpenAI SDK with a baseURL
      const baseURL =
        target.provider === "xai"
          ? "https://api.x.ai/v1"
          : target.provider === "groq"
          ? "https://api.groq.com/openai/v1"
          : undefined;
      const openai = new OpenAI({ apiKey: target.apiKey, baseURL });
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: target.modelName,
        response_format: { type: "json_object" },
      });
      text = completion.choices[0]?.message?.content || "";
    }

    if (!text) return { error: "Empty response from AI provider." };
    try {
      return { data: JSON.parse(text) as T };
    } catch {
      const m = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      if (m?.[1]) return { data: JSON.parse(m[1]) as T };
      return { error: "Failed to parse AI response. Try again." };
    }
  } catch (e: any) {
    console.error("AI course generation error:", e);
    return { error: e?.message || "AI request failed." };
  }
}

export interface CourseAiContext {
  name?: string;
  category?: string;
  shortDescription?: string;
  longDescription?: string;
  modelId?: string;
}

function ctxLine(ctx: CourseAiContext): string {
  let line = `Course: "${ctx.name || "Untitled"}"${
    ctx.category ? `, Category: ${ctx.category}` : ""
  }.${ctx.shortDescription ? ` Summary: ${ctx.shortDescription}` : ""}`;

  line += `\n\nContext:\n- Institute: TechHat Computer Training Center (টেকহাট কম্পিউটার প্রশিক্ষণ কেন্দ্র)\n- Address: Holidhani, Jhenaidah Sadar, Jhenaidah (হলিধানী, ঝিনাইদহ সদর, ঝিনাইদহ)\n- CRITICAL: You must naturally weave the institute name and this specific address into the content where appropriate (e.g., SEO metadata, descriptions, FAQs, student testimonials, etc).\n- VERY IMPORTANT SPELLING RULE: In Bengali, ALWAYS write "টেকহাট". NEVER write "টেকহ্যাট" or anything else. The spelling must be exactly "টেকহাট".`;
  
  return line;
}

// ---------- SEO (bilingual meta + OG) ----------
export async function generateSeo(ctx: CourseAiContext) {
  const prompt = `You are an SEO expert for "TechHat IT Institute", an IT training center in Bangladesh.
${ctxLine(ctx)}
Generate SEO metadata in English and Bangla. Meta title 50-60 chars, meta description 120-160 chars, keywords comma-separated (6-10), one focus keyword, and OpenGraph title/description.
Return JSON exactly:
{"en":{"meta_title":"","meta_description":"","meta_keywords":"","focus_keyword":"","og_title":"","og_description":""},
 "bn":{"meta_title":"","meta_description":"","meta_keywords":"","focus_keyword":"","og_title":"","og_description":""}}
${NO_EMOJI}`;
  return runAiJson(prompt, ctx.modelId);
}

// ---------- FAQ (bilingual) ----------
export async function generateFaq(ctx: CourseAiContext) {
  const prompt = `You are a course marketing expert for TechHat IT Institute (Bangladesh).
${ctxLine(ctx)}
Generate 6 frequently asked questions with answers, in both English and Bangla.
Return JSON: {"faqs":[{"question_en":"","question_bn":"","answer_en":"","answer_bn":""}]}
${NO_EMOJI}`;
  return runAiJson<{ faqs: any[] }>(prompt, ctx.modelId);
}

// ---------- Keywords ----------
export async function generateKeywords(ctx: CourseAiContext) {
  const prompt = `${ctxLine(ctx)}
Generate SEO keywords for this IT course (Bangladesh market), comma-separated, 8-12 items each language.
Return JSON: {"en":"kw1, kw2","bn":"kw1, kw2"}
${NO_EMOJI}`;
  return runAiJson<{ en: string; bn: string }>(prompt, ctx.modelId);
}

// ---------- Tags ----------
export async function generateTags(ctx: CourseAiContext) {
  const prompt = `${ctxLine(ctx)}
Generate 15-20 relevant tags for this course. 
CRITICAL REQUIREMENTS:
- MUST include organizational tags: "TechHat", "TechHat IT", "টেকহাট আইটি", "টেকহাট", "Best Computer Training Center in Jhenaidah", "Computer Training Center".
- Include a mix of English and Bangla tags related to the course topic.
- Include course-specific keywords and skills.
Return JSON: {"tags":["tag1","tag2"]}
${NO_EMOJI}`;
  return runAiJson<{ tags: string[] }>(prompt, ctx.modelId);
}

// ---------- Slug ----------
export async function generateSlug(ctx: CourseAiContext) {
  const prompt = `${ctxLine(ctx)}
Generate an SEO-friendly URL slug (lowercase, hyphenated, ASCII, <= 6 words) in English and a Bangla slug.
Return JSON: {"en":"web-development-course","bn":"web-development-course-bn"}
${NO_EMOJI}`;
  return runAiJson<{ en: string; bn: string }>(prompt, ctx.modelId);
}

// ---------- Descriptions (short + long, bilingual + outcomes) ----------
export async function generateDescriptions(ctx: CourseAiContext) {
  const prompt = `You are a senior instructional designer at TechHat IT Institute (Bangladesh).
${ctxLine(ctx)}
Write compelling course content in English and Bangla.
Return JSON:
{"short_description_en":"","short_description_bn":"","long_description_en":"","long_description_bn":"",
 "learning_outcomes_en":["",""],"learning_outcomes_bn":["",""],
 "requirements_en":["",""],"requirements_bn":["",""],
 "who_should_join_en":["",""],"who_should_join_bn":["",""],
 "career_opportunities_en":["",""],"career_opportunities_bn":["",""]}
${NO_EMOJI}`;
  return runAiJson(prompt, ctx.modelId);
}
