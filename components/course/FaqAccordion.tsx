"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({ faqs }: { faqs: any[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={`rounded-xl border transition-colors ${
              isOpen
                ? "border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            }`}
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
            >
              <p className="font-semibold text-slate-900 dark:text-white pr-4">
                {faq.question_bn || faq.question_en}
              </p>
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full text-slate-500 transition-transform duration-300 shrink-0 ${
                  isOpen ? "rotate-180 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="p-4 pt-0 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-transparent">
                  {faq.answer_bn || faq.answer_en}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
