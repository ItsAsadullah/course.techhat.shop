"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

const batches = [
  {
    course: "Full Stack Web Development",
    date: "15 Oct 2026",
    time: "08:00 PM - 10:00 PM",
    type: "Online (Zoom)",
    status: "Filling Fast",
  },
  {
    course: "Advanced Graphics Design",
    date: "20 Oct 2026",
    time: "03:00 PM - 05:00 PM",
    type: "Offline (Dhaka Branch)",
    status: "Few Seats Left",
  }
];

export default function Schedule() {
  return (
    <section id="schedule" className="py-24 bg-white dark:bg-slate-900 relative z-10 transition-colors duration-300 border-y border-slate-100 dark:border-white/5">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4"
          >
            Upcoming <span className="text-emerald-500">Batches</span>
          </motion.h2>
        </div>

        <div className="space-y-4">
          {batches.map((batch, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    {batch.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{batch.course}</h3>
                
                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-500"/> {batch.date}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-500"/> {batch.time}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500"/> {batch.type}</div>
                </div>
              </div>

              <Link href="#admission" className="w-full md:w-auto shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                Book Seat <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
