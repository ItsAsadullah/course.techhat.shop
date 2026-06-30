"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, PlayCircle, Users, BookOpen, Award, Star } from "lucide-react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import React, { useRef } from "react"

const highlights = [
  "অভিজ্ঞ ও প্রশিক্ষিত শিক্ষকমণ্ডলী",
  "হাতে-কলমে প্রশিক্ষণ (Practical Based)",
  "সার্টিফিকেট সরকার অনুমোদিত",
  "চাকরির সহায়তা প্রদান করা হয়",
]

const floatingBadges = [
  { icon: Users, value: "৫০০০+", label: "শিক্ষার্থী", color: "bg-blue-50 text-blue-700 border-blue-200 shadow-sm" },
  { icon: Star, value: "৪.৯/৫", label: "রেটিং", color: "bg-amber-50 text-amber-700 border-amber-200 shadow-sm" },
  { icon: Award, value: "১০০%", label: "সার্টিফিকেট", color: "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm" },
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
  return (
    <section className="relative overflow-x-clip bg-white">
      <div className="bg-gradient-to-b from-slate-50 via-slate-50 to-white relative min-h-[100vh] pt-24 lg:pt-28 pb-64 lg:pb-96 flex flex-col justify-start">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle, #0f172a 1px, transparent 1px)`,
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
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full border border-blue-200 shadow-sm mb-6">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
              টেকহ্যাট কম্পিউটার ট্রেনিং সেন্টারে স্বাগতম
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.2] mb-6">
              কম্পিউটার শেখা হোক
              <br />
              <span className="relative inline-block mt-2 w-max max-w-[100vw]">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-[length:200%_auto] animate-text-gradient text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] whitespace-nowrap">
                  সহজ, আধুনিক ও বাস্তবমুখী উপায়ে
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

            <motion.p variants={itemVariants} className="text-slate-600 text-lg leading-relaxed mb-8 max-w-lg">
              ভবিষ্যতের জন্য নিজেকে দক্ষ করে তুলুন। অভিজ্ঞ প্রশিক্ষকের তত্ত্বাবধানে হাতে-কলমে প্রশিক্ষণ নিয়ে গড়ে তুলুন আপনার সফল ক্যারিয়ার।
              <br /><br />
              <span className="font-semibold text-slate-800">আজই ভর্তি হন আপনার পছন্দের কোর্সে।</span>
            </motion.p>



            {/* CTA buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#courses"
                className="inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-md text-slate-700 font-semibold px-8 py-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md text-sm group"
              >
                <PlayCircle className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                কোর্সসমূহ দেখুন
              </Link>
              <Link
                href="/admission"
                className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:-translate-y-1 text-sm overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full -ml-10 bg-white/20 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative">ভর্তি হোন</span>
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
              className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 px-4 py-2.5 flex items-center gap-2.5 z-20"
            >
              <div className="bg-indigo-100 p-1.5 rounded-lg">
                <BookOpen className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">মোট কোর্স</p>
                <p className="font-bold text-slate-900 text-sm leading-none">১৫+</p>
              </div>
            </motion.div>

            {floatingBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                className={`absolute hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-md text-xs font-bold z-20 ${badge.color}`}
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
                src="https://www.youtube.com/embed/Sklc_fQBmcs" 
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
