"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "bn";

export const translations = {
  en: {
    // Navbar
    nav_home: "Home",
    nav_features: "Features",
    nav_how: "How it works",
    nav_courses: "Courses",
    nav_contact: "Contact",
    nav_software: "Software",
    nav_login: "Login",
    nav_register: "Register",
    
    // Common
    or: "or",
    back_home: "Back to Home",
    techhat: "TechHat",
    computer_training: "Computer Training Center",

    // Auth - Login
    auth_welcome: "Welcome",
    auth_login_title: "Sign In",
    auth_login_sub: "Login to your account",
    auth_email_label: "Email",
    auth_pass_label: "Password",
    auth_login_btn: "Sign In →",
    auth_login_loading: "Signing in...",
    auth_no_account: "Don't have an account?",
    auth_create_free: "Create for free →",
    auth_invalid: "Invalid email or password.",

    // Auth - Register
    auth_new_member: "New Member",
    auth_reg_title: "Sign Up",
    auth_reg_sub: "Create a new account",
    auth_name_label: "Full Name",
    auth_reg_btn: "Register",
    auth_reg_loading: "Registering...",
    auth_terms: "By creating an account, you agree to our terms and conditions.",
    auth_have_account: "Already have an account?",
    auth_signin_link: "Login →",
    auth_reg_failed: "Registration failed.",
    auth_reg_success: "Registration successful! Redirecting to home...",
  },
  bn: {
    // Navbar
    nav_home: "হোমপেজ",
    nav_features: "কেন আমরা?",
    nav_how: "ভর্তি প্রক্রিয়া",
    nav_courses: "কোর্সসমূহ",
    nav_contact: "যোগাযোগ",
    nav_software: "সফটওয়ার",
    nav_login: "লগইন",
    nav_register: "রেজিস্ট্রেশন",
    
    // Common
    or: "অথবা",
    back_home: "হোমপেজে ফিরে যান",
    techhat: "TechHat",
    computer_training: "Computer Training Center",

    // Auth - Login
    auth_welcome: "স্বাগতম",
    auth_login_title: "সাইন ইন",
    auth_login_sub: "আপনার অ্যাকাউন্টে লগইন করুন",
    auth_email_label: "ইমেইল",
    auth_pass_label: "পাসওয়ার্ড",
    auth_login_btn: "সাইন ইন →",
    auth_login_loading: "লগইন হচ্ছে...",
    auth_no_account: "অ্যাকাউন্ট নেই?",
    auth_create_free: "বিনামূল্যে তৈরি করুন →",
    auth_invalid: "ইমেইল বা পাসওয়ার্ড সঠিক নয়।",

    // Auth - Register
    auth_new_member: "নতুন অ্যাকাউন্ট",
    auth_reg_title: "রেজিস্ট্রেশন করুন",
    auth_reg_sub: "আপনার নতুন অ্যাকাউন্ট তৈরি করুন",
    auth_name_label: "আপনার নাম",
    auth_reg_btn: "রেজিস্ট্রেশন করুন",
    auth_reg_loading: "রেজিস্ট্রেশন হচ্ছে...",
    auth_terms: "অ্যাকাউন্ট তৈরি করার মাধ্যমে আপনি আমাদের শর্তাবলীতে সম্মত হচ্ছেন।",
    auth_have_account: "অ্যাকাউন্ট আছে?",
    auth_signin_link: "লগইন করুন →",
    auth_reg_failed: "রেজিস্ট্রেশন ব্যর্থ হয়েছে।",
    auth_reg_success: "রেজিস্ট্রেশন সফল! হোম পেজে যাচ্ছেন...",
  },
} as const;

type TKey = keyof typeof translations.en;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
  isBn: boolean;
}

const GlobalLangContext = createContext<LangContextType>({
  lang: "bn",
  setLang: () => {},
  t: (key) => translations.bn[key],
  isBn: true,
});

export function GlobalLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    const stored = localStorage.getItem("techhat-lang") as Lang | null;
    if (stored === "en" || stored === "bn") {
      setLangState(stored);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("techhat-lang", l);
  };

  const t = (key: TKey): string => translations[lang][key] as string;

  return (
    <GlobalLangContext.Provider value={{ lang, setLang, t, isBn: lang === "bn" }}>
      {children}
    </GlobalLangContext.Provider>
  );
}

export function useLang() {
  return useContext(GlobalLangContext);
}
