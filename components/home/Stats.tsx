"use client"

import { Users, BookOpen, Trophy, Clock } from "lucide-react"
import { motion } from "framer-motion"
import SpotlightCard from "@/components/ui/SpotlightCard"
import { useHomepage } from "@/lib/hooks/useHomepage"

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
  const { h, isBn } = useHomepage();

  const stats = [
    {
      icon: Users,
      value: h('stat_students_value', 'stat_students_label'),
      label: h('stat_students_label', 'stat_students_label'),
      desc: h('stat_students_desc' as any, 'stat_students_desc' as any),
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/30",
      shadow: "shadow-sm border border-blue-100 dark:border-blue-800",
    },
    {
      icon: BookOpen,
      value: h('stat_courses_value', 'stat_courses_label'),
      label: h('stat_courses_label', 'stat_courses_label'),
      desc: h('stat_courses_desc' as any, 'stat_courses_desc' as any),
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
      shadow: "shadow-sm border border-emerald-100 dark:border-emerald-800",
    },
    {
      icon: Trophy,
      value: h('stat_success_value', 'stat_success_label'),
      label: h('stat_success_label', 'stat_success_label'),
      desc: h('stat_success_desc' as any, 'stat_success_desc' as any),
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/30",
      shadow: "shadow-sm border border-amber-100 dark:border-amber-800",
    },
    {
      icon: Clock,
      value: h('stat_exp_value', 'stat_exp_label'),
      label: h('stat_exp_label', 'stat_exp_label'),
      desc: h('stat_exp_desc' as any, 'stat_exp_desc' as any),
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/30",
      shadow: "shadow-sm border border-purple-100 dark:border-purple-800",
    },
  ];

  return (
    <section className="py-12 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800 relative z-10">
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
              <SpotlightCard className="flex items-center gap-4 p-4 rounded-2xl h-full backdrop-blur-sm bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.shadow} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={isBn ? "font-bn" : ""}>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-slate-900 dark:text-white font-semibold text-sm leading-tight">{stat.label}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{stat.desc}</p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
