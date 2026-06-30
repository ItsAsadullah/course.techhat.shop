"use client"

import { Users, BookOpen, Trophy, Clock } from "lucide-react"
import { motion } from "framer-motion"
import SpotlightCard from "@/components/ui/SpotlightCard"

const stats = [
  {
    icon: Users,
    value: "৫,০০০+",
    label: "সফল শিক্ষার্থী",
    desc: "এখন পর্যন্ত প্রশিক্ষিত",
    color: "text-blue-600",
    bg: "bg-blue-50",
    shadow: "shadow-sm border border-blue-100",
  },
  {
    icon: BookOpen,
    value: "১৫+",
    label: "কোর্স সমূহ",
    desc: "অফলাইন ও অনলাইন",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    shadow: "shadow-sm border border-emerald-100",
  },
  {
    icon: Trophy,
    value: "৯৮%",
    label: "সাফল্যের হার",
    desc: "পরীক্ষায় উত্তীর্ণ",
    color: "text-amber-600",
    bg: "bg-amber-50",
    shadow: "shadow-sm border border-amber-100",
  },
  {
    icon: Clock,
    value: "১০+",
    label: "বছরের অভিজ্ঞতা",
    desc: "মানসম্পন্ন প্রশিক্ষণে",
    color: "text-purple-600",
    bg: "bg-purple-50",
    shadow: "shadow-sm border border-purple-100",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Stats() {
  return (
    <section className="py-12 bg-white border-y border-slate-100 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              variants={itemVariants}
              key={stat.label}
              className="group"
            >
              <SpotlightCard className="flex items-center gap-4 p-4 rounded-2xl h-full backdrop-blur-sm">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.shadow} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-slate-900 font-semibold text-sm leading-tight">{stat.label}</p>
                  <p className="text-slate-500 text-xs">{stat.desc}</p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
