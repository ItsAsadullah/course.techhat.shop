"use client";

import { motion } from "framer-motion";
import { Users, Award, Briefcase, Star } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  { id: 1, name: "Successful Students", value: 5000, suffix: "+", icon: Users },
  { id: 2, name: "Job Placements", value: 4500, suffix: "+", icon: Briefcase },
  { id: 3, name: "Expert Instructors", value: 50, suffix: "+", icon: Award },
  { id: 4, name: "Average Rating", value: 4.9, suffix: "/5", icon: Star },
];

export default function Stats() {
  return (
    <section className="py-20 relative bg-white dark:bg-[#020617] border-y border-slate-100 dark:border-white/5 z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-slate-100 dark:divide-white/10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center justify-center p-4"
            >
              <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-500/10 rounded-full flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
