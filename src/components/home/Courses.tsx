"use client";

import { motion } from "framer-motion";
import { Layout, Database, Smartphone, PenTool, TrendingUp, MonitorPlay, ArrowRight } from "lucide-react";
import Link from "next/link";

const courses = [
  {
    id: 1,
    title: "Full Stack Web Development",
    desc: "Master MERN stack. Build scalable web applications from scratch to deployment.",
    icon: Layout,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
  },
  {
    id: 2,
    title: "Advanced Graphics Design",
    desc: "Learn UI/UX, Photoshop, Illustrator, and create stunning visual concepts.",
    icon: PenTool,
    color: "from-fuchsia-500 to-pink-500",
    bg: "bg-fuchsia-500/10",
    text: "text-fuchsia-500",
  },
  {
    id: 3,
    title: "Digital Marketing Pro",
    desc: "SEO, SMM, Meta Ads, and Google Ads to skyrocket business growth.",
    icon: TrendingUp,
    color: "from-emerald-500 to-green-500",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
  },
  {
    id: 4,
    title: "App Development (Flutter)",
    desc: "Build cross-platform mobile applications for iOS and Android with Flutter.",
    icon: Smartphone,
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-500/10",
    text: "text-violet-500",
  },
];

export default function Courses() {
  return (
    <section id="courses" className="py-24 bg-slate-50 dark:bg-[#020617] relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6"
          >
            Popular <span className="text-cyan-500">Courses</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 font-medium"
          >
            Industry-relevant curriculum designed by experts to make you job-ready in months.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 ${course.bg} rounded-2xl flex items-center justify-center mb-6`}>
                <course.icon className={`w-7 h-7 ${course.text}`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-cyan-500 transition-colors">
                {course.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium line-clamp-3">
                {course.desc}
              </p>
              <Link href={`/courses/${course.id}`} className="flex items-center gap-2 font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                View Details <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
