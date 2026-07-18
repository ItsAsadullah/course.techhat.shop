"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { AiModel } from "@/components/settings/IntegrationsSettingsForm";
import { createServerClient } from "@/lib/supabase-server";

export async function getAiModelsConfig() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("system_settings")
    .select("key, value")
    .in("key", ["ai_models", "default_ai_model_id"]);

  const modelsJson = data?.find(s => s.key === "ai_models")?.value;
  const defaultModelId = data?.find(s => s.key === "default_ai_model_id")?.value;

  let models: AiModel[] = [];
  try {
    models = modelsJson ? JSON.parse(modelsJson) : [];
  } catch (e) {}
  
  return { models, defaultModelId };
}

export async function generateCourseWithAI(topic: string, modelId?: string) {
  try {
    const { models, defaultModelId } = await getAiModelsConfig();
    
    if (models.length === 0) {
      return { error: "No AI models configured. Please go to Admin > Settings > Integrations to add one." };
    }

    const targetModelId = modelId || defaultModelId || models[0].id;
    const selectedModel = models.find(m => m.id === targetModelId);

    if (!selectedModel) {
      return { error: "Selected AI model not found in settings." };
    }

    const supabase = await createServerClient();
    const { data: settingsData } = await supabase
      .from("system_settings")
      .select("key, value, valueBn")
      .in("key", ["org_name", "site_domain"]);

    const orgNameEn = settingsData?.find(s => s.key === "org_name")?.value || "TechHat IT Institute";
    const orgNameBn = settingsData?.find(s => s.key === "org_name")?.valueBn || "টেকহাট আইটি ইন্সটিটিউট";
    const siteDomain = settingsData?.find(s => s.key === "site_domain")?.value || "course.techhat.shop";

    const prompt = `You are a senior professional course creator and instructional designer for an IT Training Institute in Bangladesh. 
The English name of the institute is "${orgNameEn}" (TechHat Computer Training Center) and the Bengali name is "${orgNameBn}" (টেকহাট কম্পিউটার প্রশিক্ষণ কেন্দ্র).
The main website domain is "${siteDomain}".
The physical address of the institute is: Address: Holidhani, Jhenaidah Sadar, Jhenaidah (ঠিকানা: হলিধানী, ঝিনাইদহ সদর, ঝিনাইদহ).

CRITICAL REQUIREMENT: You MUST naturally incorporate the institute's name (TechHat Computer Training Center / টেকহাট কম্পিউটার প্রশিক্ষণ কেন্দ্র) and the address (Holidhani, Jhenaidah Sadar, Jhenaidah) into the generated content, particularly within the course descriptions, FAQs, Testimonials, and SEO metadata. Make it sound professional and integrated as part of the course offering.
VERY IMPORTANT SPELLING RULE: In Bengali, ALWAYS write "টেকহাট". NEVER write "টেকহ্যাট" or anything else. The spelling must be exactly "টেকহাট".

The user wants to create a new course about: "${topic}".

Generate a complete, professional course schema that can be used directly to fill out our course creation form.
Provide your response strictly as a JSON object matching this structure (no markdown blocks, just raw JSON or well-formatted JSON parseable string):

{
  "general": {
    "name_en": "Professional English Course Name",
    "name_bn": "Professional Bengali Course Name",
    "course_code": "E.g. WEB-101",
    "tags": [
      "TechHat Computer Training Center",
      "টেকহাট কম্পিউটার প্রশিক্ষণ কেন্দ্র",
      "Best Computer Training Center in Jhenaidah",
      "Holidhani",
      "Jhenaidah",
      "Plus 15 to 20 more course specific tags here"
    ]
  },
  "content": {
    "short_description_en": "A highly engaging 1-2 sentence short description in English. Minimum 25 characters.",
    "short_description_bn": "A highly engaging 1-2 sentence short description in Bengali. Minimum 25 characters.",
    "long_description_en": "Detailed course overview, what they will learn, and why this course is important. 2-3 paragraphs. Format nicely with line breaks if needed. DO NOT USE EMOJIS.",
    "long_description_bn": "Detailed course overview in Bengali. 2-3 paragraphs. DO NOT USE EMOJIS.",
    "learning_outcomes_en": ["Outcome 1", "Outcome 2"],
    "learning_outcomes_bn": ["ফলাফল ১", "ফলাফল ২"],
    "who_should_join_en": ["Audience 1"],
    "who_should_join_bn": ["শ্রোতা ১"],
    "requirements_en": ["Req 1"],
    "requirements_bn": ["প্রয়োজনীয়তা ১"],
    "career_opportunities_en": ["Career 1"],
    "career_opportunities_bn": ["পেশা ১"],
    "skills_en": ["Skill 1"],
    "skills_bn": ["দক্ষতা ১"],
    "software_used_en": ["Software 1"],
    "software_used_bn": ["সফটওয়্যার ১"],
    "projects_en": ["Project 1"],
    "projects_bn": ["প্রজেক্ট ১"],
    "target_audience_en": "Short 1-sentence target audience summary.",
    "target_audience_bn": "Short 1-sentence target audience summary in Bengali.",
    "faqs": [
      {
        "question_en": "Question in English",
        "question_bn": "Question in Bengali",
        "answer_en": "Answer in English",
        "answer_bn": "Answer in Bengali"
      }
    ],
    "testimonials": [
      {
        "author_name": "Student Name",
        "rating": 5,
        "body_en": "Review in English",
        "body_bn": "Review in Bengali"
      }
    ]
  },
  "seo": {
    "en": {
      "meta_title": "Highly optimized SEO title in English (max 60 chars)",
      "meta_description": "Highly optimized SEO description (max 160 chars)",
      "meta_keywords": "keyword1, keyword2",
      "focus_keyword": "focus keyword",
      "canonical_url": "https://${siteDomain}/courses/slug",
      "og_title": "OG Title English",
      "og_description": "OG Description English"
    },
    "bn": {
      "meta_title": "SEO title in Bengali",
      "meta_description": "SEO description in Bengali",
      "meta_keywords": "কিওয়ার্ড ১, কিওয়ার্ড ২",
      "focus_keyword": "ফোকাস কিওয়ার্ড",
      "canonical_url": "https://${siteDomain}/courses/slug",
      "og_title": "OG Title Bengali",
      "og_description": "OG Description Bengali"
    }
  },
  "curriculum": {
    "modules": [
      {
        "title_en": "Module Title EN",
        "title_bn": "Module Title BN",
        "description_en": "Module Desc EN",
        "description_bn": "Module Desc BN",
        "lessons": [
          {
            "title_en": "Lesson Title EN",
            "title_bn": "Lesson Title BN"
          }
        ]
      }
    ]
  },
  "search": {
    "manual_jsonld": "{ \"@context\": \"https://schema.org\", \"@type\": \"Course\" }"
  },
  "analytics": {
    "event_config": "{ \"event_name\": \"view_course\" }"
  }
}

Make sure the Bengali is natural, professional, and accurate. Make the English standard professional instructional design language. 
CRITICAL RULE: DO NOT use any emojis (like 🚀, ✅, 🎓, etc) anywhere in the output. Use standard hyphens (-) for bullet points.`;

    let responseText = "";

    if (selectedModel.provider === 'gemini') {
      const genAI = new GoogleGenerativeAI(selectedModel.apiKey);
      const model = genAI.getGenerativeModel({ 
        model: selectedModel.modelName, 
        generationConfig: { responseMimeType: "application/json" } 
      });
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
    } 
    else if (selectedModel.provider === 'openai') {
      const openai = new OpenAI({ apiKey: selectedModel.apiKey });
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: selectedModel.modelName,
        response_format: { type: "json_object" }
      });
      responseText = completion.choices[0].message.content || "";
    }
    else if (selectedModel.provider === 'xai') {
      // xAI uses OpenAI SDK
      const openai = new OpenAI({ 
        apiKey: selectedModel.apiKey,
        baseURL: "https://api.x.ai/v1"
      });
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: selectedModel.modelName,
        response_format: { type: "json_object" }
      });
      responseText = completion.choices[0].message.content || "";
    }
    else if (selectedModel.provider === 'groq') {
      // Groq uses OpenAI SDK
      const openai = new OpenAI({ 
        apiKey: selectedModel.apiKey,
        baseURL: "https://api.groq.com/openai/v1"
      });
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: selectedModel.modelName,
        response_format: { type: "json_object" }
      });
      responseText = completion.choices[0].message.content || "";
    }
    else if (selectedModel.provider === 'anthropic') {
      const anthropic = new Anthropic({ apiKey: selectedModel.apiKey });
      const msg = await anthropic.messages.create({
        model: selectedModel.modelName,
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt + "\n\nOutput only valid JSON." }]
      });
      responseText = (msg.content[0] as any).text || "";
    }

    if (!responseText) {
      throw new Error("Empty response from AI provider");
    }

    // Attempt to parse the JSON
    try {
      const parsed = JSON.parse(responseText);
      return { success: true, data: parsed };
    } catch (parseError) {
      const jsonMatch = responseText.match(/```(?:json)?\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        return { success: true, data: JSON.parse(jsonMatch[1]) };
      }
      return { error: "Failed to parse AI response. Please try again." };
    }
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { error: error.message || "Failed to generate course with AI" };
  }
}
