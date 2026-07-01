"use client"

import { ShieldCheck, Cpu, Users2, HeadphonesIcon, Wifi, Medal } from "lucide-react"
import { motion } from "framer-motion"
import SpotlightCard from "@/components/ui/SpotlightCard"
import { useLang } from "@/context/GlobalLangContext"

const getFeatures = (t: any) => [
  {
    icon: Cpu,
    title: t("feat_card1_t"),
    desc: t("feat_card1_d"),
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/30",
    shadow: "shadow-sm border border-blue-100 dark:border-blue-800",
  },
  {
    icon: Users2,
    title: t("feat_card2_t"),
    desc: t("feat_card2_d"),
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    shadow: "shadow-sm border border-emerald-100 dark:border-emerald-800",
  },
  {
    icon: ShieldCheck,
    title: t("feat_card3_t"),
    desc: t("feat_card3_d"),
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/30",
    shadow: "shadow-sm border border-amber-100 dark:border-amber-800",
  },
  {
    icon: Medal,
    title: t("feat_card4_t"),
    desc: t("feat_card4_d"),
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-50 dark:bg-pink-900/30",
    shadow: "shadow-sm border border-pink-100 dark:border-pink-800",
  },
  {
    icon: Wifi,
    title: t("feat_card5_t"),
    desc: t("feat_card5_d"),
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/30",
    shadow: "shadow-sm border border-violet-100 dark:border-violet-800",
  },
  {
    icon: HeadphonesIcon,
    title: t("feat_card6_t"),
    desc: t("feat_card6_d"),
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-900/30",
    shadow: "shadow-sm border border-cyan-100 dark:border-cyan-800",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

export default function Features() {
  const { t, isBn } = useLang();
  const features = getFeatures(t);

  return (
    <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 relative z-10 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 dark:bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/10 dark:bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className={`grid lg:grid-cols-2 gap-12 items-center mb-16 ${isBn ? "font-bn" : ""}`}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">
              {t("feat_title1")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
              {t("feat_title2")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">{t("feat_title3")}</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              {t("feat_desc")}
            </p>

            {/* Mini stats */}
            <div className="mt-8 flex gap-8">
              <div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{t("feat_stat1_v")}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{t("feat_stat1_l")}</p>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-700 pl-8">
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{t("feat_stat2_v")}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{t("feat_stat2_l")}</p>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-700 pl-8">
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{t("feat_stat3_v")}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{t("feat_stat3_l")}</p>
              </div>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden ${isBn ? "font-bn" : ""}`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 dark:bg-blue-900/30 rounded-full blur-[40px] pointer-events-none" />
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">{t("feat_review_tag")}</p>
              <blockquote className="text-lg font-medium leading-relaxed mb-6 text-slate-700 dark:text-slate-300">
                {t("feat_review_text")}
              </blockquote>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-bold text-lg text-blue-600 dark:text-blue-400">{t("feat_review_name").charAt(0)}</div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{t("feat_review_name")}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t("feat_review_role")}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400 drop-shadow-[0_0_2px_rgba(245,158,11,0.5)]" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div 
              variants={itemVariants}
              key={f.title} 
              className="group"
            >
              <SpotlightCard className={`p-6 h-full transition-all duration-300 bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 ${isBn ? "font-bn" : ""}`}>
                <div className={`w-12 h-12 ${f.bg} ${f.shadow} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2 relative z-10">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed relative z-10">{f.desc}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
