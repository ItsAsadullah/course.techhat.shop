"use client"

import { Users, BookOpen, Trophy, Clock } from "lucide-react"
import { motion } from "framer-motion"
import SpotlightCard from "@/components/ui/SpotlightCard"
import { useLang } from "@/context/GlobalLangContext"

const getStats = (t: ReturnType<typeof useLang>["t"], isBn: boolean) => [
  {
    icon: Users,
    value: isBn ? "৫,০০০+" : "5,000+",
    label: t("stat_students_label"),
    desc: t("stat_students_desc"),
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/30",
    shadow: "shadow-sm border border-blue-100 dark:border-blue-800",
  },
  {
    icon: BookOpen,
    value: isBn ? "১৫+" : "15+",
    label: t("stat_courses_label"),
    desc: t("stat_courses_desc"),
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    shadow: "shadow-sm border border-emerald-100 dark:border-emerald-800",
  },
  {
    icon: Trophy,
    value: isBn ? "৯৮%" : "98%",
    label: t("stat_success_label"),
    desc: t("stat_success_desc"),
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/30",
    shadow: "shadow-sm border border-amber-100 dark:border-amber-800",
  },
  {
    icon: Clock,
    value: isBn ? "১০+" : "10+",
    label: t("stat_exp_label"),
    desc: t("stat_exp_desc"),
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/30",
    shadow: "shadow-sm border border-purple-100 dark:border-purple-800",
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
  const { t, isBn } = useLang();
  const stats = getStats(t, isBn);

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
