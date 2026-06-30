"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Do I need prior programming experience?",
    a: "Not necessarily. Our foundational courses start from scratch. However, basic computer literacy is required."
  },
  {
    q: "Will I get a certificate after completion?",
    a: "Yes, you will receive an industry-recognized certificate upon successfully completing the course and all required projects."
  },
  {
    q: "Do you provide job placement support?",
    a: "Yes! We have a dedicated placement cell that helps with resume building, interview preparation, and connects you with our hiring partners."
  },
  {
    q: "Are the classes online or offline?",
    a: "We offer both online (live via Zoom) and offline classes at our campus. You can choose the mode that suits you best during admission."
  }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-50 dark:bg-[#020617] relative z-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6"
          >
            Frequently Asked <span className="text-violet-500">Questions</span>
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-bold text-slate-900 dark:text-white text-lg">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openIdx === idx ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-slate-600 dark:text-slate-400 font-medium">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
