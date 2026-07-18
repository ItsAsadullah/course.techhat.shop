"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, MessageCircleQuestion } from "lucide-react";
import { useLang } from "@/context/GlobalLangContext";

export default function FaqSection() {
  const { t, isBn } = useLang();
  const [open, setOpen] = useState(0);

  const faqs = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
    { q: t("faq_q4"), a: t("faq_a4") }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 relative">
      <div className="max-w-[1400px] mx-auto px-4 grid lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side (Image) */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl h-[600px] relative">
            <Image 
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop" 
              alt="Certificate Handover" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Right Side (FAQ Accordion) */}
        <div className={`pt-8 ${isBn ? "font-bn" : ""}`}>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mb-4">
            <MessageCircleQuestion className="w-5 h-5" />
            {t("faq_tag")}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white leading-[1.2] mb-6">
            {t("faq_title")}
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
            {t("faq_desc1")}<br/>{t("faq_desc2")}
          </p>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = open === idx;
              return (
                <div 
                  key={idx} 
                  className={`border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800'}`}
                >
                  <button 
                    onClick={() => setOpen(isOpen ? -1 : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between"
                  >
                    <span className={`font-bold text-lg ${isOpen ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-white text-blue-600' : 'bg-blue-600 text-white dark:bg-blue-900/50 dark:text-blue-200'}`}>
                      {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6 text-blue-100 border-t border-white/20 mt-2 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
