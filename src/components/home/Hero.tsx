"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#020617] -z-20 transition-colors duration-300" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05] -z-10 mix-blend-screen" />
      
      {/* Glowing Orbs for Dark Mode */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none -z-10 hidden dark:block" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -z-10 hidden dark:block" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 dark:bg-white/5 border border-cyan-100 dark:border-white/10 mb-8">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 tracking-wide">Premium IT Education in Bangladesh</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
              Learn Skills.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                Build Future.
              </span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed">
              Master modern web development, graphics design, and digital marketing with our 100% project-based intensive training programs.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Link href="#admission" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:-translate-y-1 transition-all">
                Join Next Batch <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#courses" className="inline-flex items-center justify-center gap-2 bg-white dark:bg-white/5 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-all backdrop-blur-md">
                <PlayCircle className="w-5 h-5 text-cyan-500" /> Explore Courses
              </Link>
            </motion.div>

            <motion.div variants={fadeIn} className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white dark:border-[#020617] overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Student" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Trusted by 5,000+ students</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, ease: "easeOut" as const }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-[3rem] blur-2xl opacity-20 dark:opacity-40" />
            <div className="relative rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl bg-white dark:bg-[#0f172a]/80 backdrop-blur-xl p-2 aspect-[4/5]">
              <Image 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" 
                alt="Students coding" 
                fill 
                className="object-cover rounded-[2.5rem]"
              />
              {/* Floating Element */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-10 top-20 bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🚀</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Placement Rate</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">98.5%</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
