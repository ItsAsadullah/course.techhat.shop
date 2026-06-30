"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Zap, Users, Code2 } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-[#020617] relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
              Why <span className="text-cyan-500">TechHat?</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-10 leading-relaxed">
              We don't just teach theory. Our project-driven approach ensures you graduate with a strong portfolio and the skills tech companies actually need.
            </p>
            
            <ul className="space-y-6">
              {[
                { title: "100% Practical Focus", desc: "Code from day one. Build real-world projects." },
                { title: "Industry Expert Mentors", desc: "Learn from seniors working at top tech firms." },
                { title: "Dedicated Job Placement", desc: "Resume building, mock interviews & direct referrals." },
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Bento Grid Visual */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-3xl aspect-square flex flex-col items-center justify-center text-center">
                <Code2 className="w-10 h-10 text-cyan-500 mb-4" />
                <h4 className="font-bold text-slate-900 dark:text-white">Live Coding</h4>
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-3xl aspect-[4/3] flex flex-col items-center justify-center text-center text-white">
                <h4 className="font-black text-3xl mb-2">98%</h4>
                <p className="font-medium text-blue-100">Success Rate</p>
              </div>
            </div>
            <div className="space-y-4 pt-10">
              <div className="bg-gradient-to-br from-fuchsia-500 to-pink-600 p-6 rounded-3xl aspect-[4/3] flex flex-col items-center justify-center text-center text-white">
                <Users className="w-10 h-10 mb-4" />
                <h4 className="font-bold">1-on-1 Support</h4>
              </div>
              <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-3xl aspect-square flex flex-col items-center justify-center text-center">
                <Zap className="w-10 h-10 text-amber-500 mb-4" />
                <h4 className="font-bold text-slate-900 dark:text-white">Fast Track</h4>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
