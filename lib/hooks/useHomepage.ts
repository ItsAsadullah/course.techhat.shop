"use client";

import { useHomepageContent } from "@/context/HomepageContentContext";
import { useLang } from "@/context/GlobalLangContext";
import { translations } from "@/context/GlobalLangContext";

type TranslationKey = keyof typeof translations.en;

/**
 * Returns a function that gets homepage content:
 * 1. First checks the DB-driven homepage content (via context)
 * 2. Falls back to the hardcoded translation string
 */
export function useHomepage() {
  const content = useHomepageContent();
  const { lang, isBn } = useLang();

  const h = (key: string, fallbackKey?: TranslationKey): string => {
    const langContent = isBn ? content.bn : content.en;
    const dbValue = langContent[key as keyof typeof langContent];
    if (dbValue) return dbValue;
    
    // Fallback to translations
    if (fallbackKey) {
      return translations[lang][fallbackKey] as string;
    }
    // Try same key in translations
    if (key in translations[lang]) {
      return translations[lang][key as TranslationKey] as string;
    }
    return '';
  };

  return { h, isBn, lang };
}
