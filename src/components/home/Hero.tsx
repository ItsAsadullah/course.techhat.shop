"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, PlayCircle, Users, BookOpen, Award, Star } from "lucide-react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import React, { useRef } from "react"
import { useLang } from "@/context/GlobalLangContext"

const highlights = [
  "অভিজ্ঞ ও প্রশিক্ষিত শিক্ষকমণ্ডলী",
  "হাতে-কলমে প্রশিক্ষণ (Practical Based)",
  "সার্টিফিকেট সরকার অনুমোদিত",
  "চাকরির সহায়তা প্রদান করা হয়",
]

const getFloatingBadges = (t: any) => [
  { icon: Users, value: "৫০০০+", label: t("hero_badge_students"), color: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 shadow-sm" },
  { icon: Star, value: "৪.৯/৫", label: t("hero_badge_rating"), color: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 shadow-sm" },
  { icon: Award, value: "১০০%", label: t("hero_badge_cert"), color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shadow-sm" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

export default function Hero() {
  const { t, isBn } = useLang();
  const floatingBadges = getFloatingBadges(t);

  return (
    <section className="relative overflow-x-clip bg-white dark:bg-slate-950">
      <div className="bg-gradient-to-b from-slate-50 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative min-h-[100vh] pt-24 lg:pt-28 pb-64 lg:pb-96 flex flex-col justify-start">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          }}
        />

        {/* Decorative blobs */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -30, 0],
            backgroundColor: ["rgba(8, 145, 178, 0.2)", "rgba(147, 51, 234, 0.2)", "rgba(79, 70, 229, 0.2)", "rgba(8, 145, 178, 0.2)"]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full blur-[100px] -translate-y-1/4 translate-x-1/3 pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            backgroundColor: ["rgba(147, 51, 234, 0.2)", "rgba(79, 70, 229, 0.2)", "rgba(8, 145, 178, 0.2)", "rgba(147, 51, 234, 0.2)"]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-0 w-[400px] h-[400px] rounded-full blur-[100px] -translate-x-1/4 pointer-events-none"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-16 items-center">
            {/* Left content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-6"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className={`inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-blue-600 dark:text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800/50 shadow-sm mb-6 ${isBn ? "font-bn" : ""}`}>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                {t("hero_badge")}
              </motion.div>

              {/* Headline */}
              <motion.h1 variants={itemVariants} className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-[1.2] mb-6 ${isBn ? "font-bn" : ""}`}>
                {t("hero_title1")}
                <br />
                <span className="relative inline-block mt-2 w-max max-w-[100vw]">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-[length:200%_auto] animate-text-gradient text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] whitespace-nowrap">
                    {t("hero_title2")}
                  </span>
                  <style>{`
                  @keyframes text-gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                  }
                  .animate-text-gradient {
                    animation: text-gradient 4s ease infinite;
                  }
                `}</style>
                  <svg
                    className="absolute -bottom-2 left-0 w-full drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                    viewBox="0 0 400 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <motion.path
                      d="M0 12 Q200 0 400 12"
                      stroke="#22d3ee"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.8"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.8 }}
                      transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                    />
                  </svg>
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} className={`text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8 max-w-lg ${isBn ? "font-bn" : ""}`}>
                {t("hero_desc1")}
                <br /><br />
                <span className="font-semibold text-slate-800 dark:text-white">{t("hero_desc2")}</span>
              </motion.p>



              {/* CTA buttons */}
              <motion.div variants={itemVariants} className={`flex flex-col sm:flex-row gap-4 ${isBn ? "font-bn" : ""}`}>
                <Link
                  href="#courses"
                  className="inline-flex items-center justify-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-200 font-semibold px-8 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm group"
                >
                  <PlayCircle className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                  {t("hero_btn_courses")}
                </Link>
                <Link
                  href="/admission"
                  className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:-translate-y-1 text-sm overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full -ml-10 bg-white/20 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative">{t("hero_btn_enroll")}</span>
                  <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" as const }}
              className="relative lg:col-span-6 lg:justify-self-end w-full max-w-md lg:max-w-full mx-auto lg:mx-0 mt-12 lg:mt-0"
            >
              {/* Main visual - Instructor Photo */}
              <TiltWrapper>
                <img
                  src="/Hero-Instructor-photo.png"
                  alt="Instructor"
                  className="w-full h-auto max-w-md lg:max-w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                />
              </TiltWrapper>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute -top-4 -right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 flex items-center gap-2.5 z-20 ${isBn ? "font-bn" : ""}`}
              >
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-1.5 rounded-lg">
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{t("hero_total_courses")}</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm leading-none">১৫+</p>
                </div>
              </motion.div>

              {floatingBadges.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  className={`absolute hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-md text-xs font-bold z-20 ${badge.color} ${isBn ? "font-bn" : ""}`}
                  style={{
                    bottom: i === 0 ? "-16px" : i === 1 ? "40%" : undefined,
                    top: i === 2 ? "30%" : undefined,
                    left: i === 0 ? "10%" : i === 1 ? "-24px" : undefined,
                    right: i === 2 ? "-24px" : undefined,
                  }}
                >
                  <badge.icon className="w-4 h-4" />
                  <div>
                    <div className="text-sm font-bold">{badge.value}</div>
                    <div className="font-medium opacity-80">{badge.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Video Embed Section with actual overlap */}
      <div className="relative -mt-40 md:-mt-56 lg:-mt-80 z-20">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
          >
            <div className="relative aspect-video w-full rounded-[24px] overflow-hidden bg-slate-900">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/pGrBqoI4HKg?si=ijcPFRizd0PAi0V4"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TiltWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 400, damping: 30 });
  const springY = useSpring(y, { stiffness: 400, damping: 30 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();

    // Calculate rotation relative to center (from -1 to 1)
    const normalizedX = (clientX - left) / width - 0.5;
    const normalizedY = (clientY - top) / height - 0.5;

    // Max rotation in degrees
    const maxRotate = 15;

    x.set(normalizedX * maxRotate);
    y.set(-normalizedY * maxRotate);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ perspective: 1200 }}
      className="relative z-10 flex justify-center w-full"
    >
      <motion.div
        style={{ rotateY: springX, rotateX: springY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="w-full flex justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
}
