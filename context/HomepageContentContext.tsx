"use client";

import React, { createContext, useContext, ReactNode } from "react";

export interface HomepageContent {
  // Hero
  hero_badge: string;
  hero_title1: string;
  hero_title2: string;
  hero_desc1: string;
  hero_desc2: string;
  hero_badge_students: string;
  hero_badge_rating: string;
  hero_badge_cert: string;
  hero_total_courses: string;
  // Video
  homepage_video_id: string;
  // Stats
  stat_students_value: string;
  stat_students_label: string;
  stat_courses_value: string;
  stat_courses_label: string;
  stat_success_value: string;
  stat_success_label: string;
  stat_exp_value: string;
  stat_exp_label: string;
  // Features
  feat_title1: string;
  feat_title2: string;
  feat_title3: string;
  feat_desc: string;
  feat_stat1_v: string;
  feat_stat1_l: string;
  feat_stat2_v: string;
  feat_stat2_l: string;
  feat_stat3_v: string;
  feat_stat3_l: string;
  feat_review_tag: string;
  feat_review_text: string;
  feat_review_name: string;
  feat_review_role: string;
  feat_card1_t: string;
  feat_card1_d: string;
  feat_card2_t: string;
  feat_card2_d: string;
  feat_card3_t: string;
  feat_card3_d: string;
  feat_card4_t: string;
  feat_card4_d: string;
  feat_card5_t: string;
  feat_card5_d: string;
  feat_card6_t: string;
  feat_card6_d: string;
  // About
  about_tag: string;
  about_title: string;
  about_desc: string;
  about_card1_t: string;
  about_card1_d: string;
  about_card2_t: string;
  about_card2_d: string;
  about_card3_t: string;
  about_card3_d: string;
  about_card4_t: string;
  about_card4_d: string;
  // Roadmap
  rm_title: string;
  rm_desc: string;
  rm_sol: string;
  rm_s1_i: string;
  rm_s1_e: string;
  rm_s2_i: string;
  rm_s2_e: string;
  rm_s3_i: string;
  rm_s3_e: string;
  rm_s4_i: string;
  rm_s4_e: string;
  // EnrollSteps
  en_tag: string;
  en_title: string;
  en_desc: string;
  en_req_title: string;
  en_req_desc: string;
  en_s1_i: string;
  en_s1_e: string;
  en_s1_d: string;
  en_s2_i: string;
  en_s2_e: string;
  en_s2_d: string;
  en_s3_i: string;
  en_s3_e: string;
  en_s3_d: string;
  en_s4_i: string;
  en_s4_e: string;
  en_s4_d: string;
  // FAQ
  faq_tag: string;
  faq_title: string;
  faq_desc1: string;
  faq_q1: string;
  faq_a1: string;
  faq_q2: string;
  faq_a2: string;
  faq_q3: string;
  faq_a3: string;
  faq_q4: string;
  faq_a4: string;
  // Footer
  ft_desc: string;
  ft_addr: string;
  ft_phone: string;
  ft_email: string;
  ft_days: string;
  ft_hours: string;
  ft_map_embed: string;
  ft_facebook: string;
  ft_youtube: string;
  ft_whatsapp: string;
}

// Both EN and BN versions
export interface HomepageContentBilingual {
  en: Partial<HomepageContent>;
  bn: Partial<HomepageContent>;
}

const HomepageContentContext = createContext<HomepageContentBilingual | undefined>(undefined);

export function HomepageContentProvider({
  children,
  content,
}: {
  children: ReactNode;
  content: HomepageContentBilingual;
}) {
  return (
    <HomepageContentContext.Provider value={content}>
      {children}
    </HomepageContentContext.Provider>
  );
}

export function useHomepageContent() {
  const context = useContext(HomepageContentContext);
  if (context === undefined) {
    throw new Error("useHomepageContent must be used within a HomepageContentProvider");
  }
  return context;
}
