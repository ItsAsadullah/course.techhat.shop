"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion"
import { ClipboardList, CreditCard, BookOpen, Award } from "lucide-react"

const steps = [
  {
    id: 1,
    intro: "ধাপ ০১",
    emphasis: "ফর্ম পূরণ করুন",
    desc: "অনলাইনে বা সরাসরি অফিসে এসে ভর্তির আবেদন ফর্ম পূরণ করুন।",
    icon: ClipboardList,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconPos: "left",
  },
  {
    id: 2,
    intro: "ধাপ ০২",
    emphasis: "ফি পরিশোধ করুন",
    desc: "ভর্তি ফি ও প্রথম মাসের বেতন পরিশোধ করুন। রসিদ সংগ্রহ করুন।",
    icon: CreditCard,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconPos: "right",
  },
  {
    id: 3,
    intro: "ধাপ ০৩",
    emphasis: "ক্লাস শুরু করুন",
    desc: "ব্যাচ ও শিফট অনুযায়ী ক্লাসে যোগ দিন। হাতে-কলমে শিখুন।",
    icon: BookOpen,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconPos: "left",
  },
  {
    id: 4,
    intro: "ধাপ ০৪",
    emphasis: "সার্টিফিকেট নিন",
    desc: "কোর্স সফলভাবে সম্পন্ন করলে সরকার অনুমোদিত সার্টিফিকেট পাবেন।",
    icon: Award,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    iconPos: "center",
  },
]

export default function EnrollSteps() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "85% 70%"],
  })

  // Use a snappier spring so the path draws instantly without lagging behind the scroll
  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 40, restDelta: 0.001 })

  // Use exact pixel length to perfectly sync SVG dash and CSS offset-path across all browsers
  const TOTAL_LENGTH = 2520;
  const offsetDistance = useTransform(pathLength, [0, 1], ["0px", `${TOTAL_LENGTH}px`])
  const strokeDashoffset = useTransform(pathLength, [0, 1], [TOTAL_LENGTH, 0])

  // Path coordinates fixed: goes Right -> Left -> Right -> Center, avoiding icons entirely.
  // Horizontal line after Step 3 is at y=620, followed by a long vertical drop to y=740.
  // The path ends exactly at y=740, which is the center of the 4th step icon (using -top-12, y=760).
  const svgPath = "M 420 0 L 420 10 Q 420 30 440 30 L 708 30 Q 728 30 728 50 L 728 200 Q 728 220 708 220 L 132 220 Q 112 220 112 240 L 112 400 Q 112 420 132 420 L 708 420 Q 728 420 728 440 L 728 600 Q 728 620 708 620 L 440 620 Q 420 620 420 640 L 420 740";

  return (
    <section id="enroll-steps" className="pt-20 pb-24 bg-white relative z-10 overflow-hidden border-t border-slate-100" ref={containerRef}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-16 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-center mb-14"
          >
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              ভর্তি প্রক্রিয়া
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              মাত্র ৪টি ধাপে ভর্তি সম্পন্ন
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              ভর্তি প্রক্রিয়া সম্পূর্ণ সহজ ও ঝামেলামুক্ত। অনলাইনেও আবেদন করা যায়।
            </p>
          </motion.div>
        </div>

        <div className="relative w-full max-w-[840px] mx-auto h-[960px] hidden md:block mt-8">
          <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none" aria-hidden="true">
            <svg 
              className="w-[840px] h-[960px] flex-shrink-0 overflow-visible"
              viewBox="0 0 840 960" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d={svgPath}
                stroke="#f1f5f9" 
                strokeWidth="4" 
                strokeDasharray="8 10" 
                strokeLinecap="round" 
                className="animate-dash"
              />
              <style>{`
                @keyframes dash-move {
                  from { stroke-dashoffset: 0; }
                  to { stroke-dashoffset: -180; }
                }
                .animate-dash {
                  animation: dash-move 8s linear infinite;
                }
              `}</style>
              <motion.path 
                d={svgPath}
                stroke="url(#paint0_linear_enroll)" 
                strokeWidth="4" 
                strokeLinecap="round" 
                style={{ 
                  strokeDasharray: `${TOTAL_LENGTH} ${TOTAL_LENGTH}`,
                  strokeDashoffset 
                }}
              />
              <defs>
                <linearGradient id="paint0_linear_enroll" x1="150" y1="0" x2="688" y2="960" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              
              <motion.g
                style={{
                  offsetPath: `path("${svgPath}")`,
                  offsetDistance,
                  offsetRotate: "auto",
                }}
              >
                <circle cx="0" cy="0" r="16" fill="white" stroke="#3b82f6" strokeWidth="2" />
                <motion.g 
                  style={{ transformOrigin: "0px 0px" }}
                >
                  <svg x="-10" y="-10" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.g>
              </motion.g>
            </svg>
          </div>

          {steps.map((step, idx) => (
            <StepCardDesktop 
              key={step.id} 
              step={step} 
              idx={idx} 
              pathLength={pathLength} 
            />
          ))}
        </div>

        <div className="relative z-10 space-y-6 py-8 flex flex-col items-center md:hidden">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0.3, filter: "blur(10px)", y: 20 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: false, margin: "-15% 0px -15% 0px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full max-w-sm relative"
            >
              <div className={`w-full flex ${step.iconPos === 'center' ? 'flex-col text-center pt-8' : 'flex-row'} items-center gap-4 bg-white border ${step.border} rounded-2xl p-5 shadow-sm relative z-20`}>
                <div className={`w-12 h-12 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center flex-shrink-0 ${step.iconPos === 'center' ? 'absolute -top-6 left-1/2 -translate-x-1/2' : ''}`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <div className={`flex-1 ${step.iconPos === 'center' ? '' : 'text-left'}`}>
                  <p className="text-slate-500 text-xs font-medium mb-1">{step.intro}</p>
                  <h3 className={`text-base font-bold ${step.color} leading-tight`}>{step.emphasis}</h3>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 max-w-2xl mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm backdrop-blur-sm relative z-20"
        >
          <span className="text-2xl flex-shrink-0">📌</span>
          <div className="text-left">
            <p className="font-semibold text-amber-700 text-sm mb-1">ভর্তিতে যা যা লাগবে</p>
            <p className="text-amber-900 text-sm leading-relaxed">
              ১ কপি পাসপোর্ট সাইজ ছবি &nbsp;|&nbsp; জাতীয় পরিচয়পত্র / জন্ম সনদ-এর ফটোকপি &nbsp;|&nbsp;
              সর্বশেষ শিক্ষাগত সনদের ফটোকপি &nbsp;|&nbsp; ভর্তি ফি ৫০০ টাকা (নগদ বা বিকাশে)
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function StepCardDesktop({ step, idx, pathLength }: { step: any, idx: number, pathLength: any }) {
  const thresholds = [
    [0.00, 0.10],
    [0.30, 0.45],
    [0.60, 0.75],
    [0.94, 0.99]
  ][idx];
  const y = [60, 260, 460, 760][idx];

  const opacity = useTransform(pathLength, thresholds, [0.3, 1]);
  const blurAmount = useTransform(pathLength, thresholds, [8, 0]);
  const yOffset = useTransform(pathLength, thresholds, [20, 0]);
  const filter = useTransform(blurAmount, (v) => `blur(${v}px)`);

  const isCenter = step.iconPos === "center";
  const isRight = step.iconPos === "right";

  return (
    <motion.div
      style={{ top: `${y}px`, opacity, filter, y: yOffset }}
      className="absolute w-full max-w-xl left-1/2 -translate-x-1/2 min-h-[120px]"
    >
      <div className={`w-full h-full flex ${
        isCenter ? "flex-col text-center pt-8 pb-5 px-6" :
        isRight ? "flex-row-reverse text-right pr-6 pl-2" : 
        "flex-row text-left pl-6 pr-2"
      } items-center bg-white border ${step.border} rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow relative z-20`}>
        
        <div className={`w-14 h-14 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center flex-shrink-0 absolute ${
          isCenter ? "left-1/2 -translate-x-1/2 -top-12" :
          isRight ? "-right-12" : 
          "-left-12"
        } bg-white shadow-sm`}>
          <step.icon className={`w-7 h-7 ${step.color}`} />
        </div>
        
        <div className={`flex-1 w-full ${isCenter ? 'mt-2' : ''}`}>
          <p className="text-slate-500 text-sm font-medium mb-1">{step.intro}</p>
          <h3 className={`text-xl font-bold ${step.color} leading-tight`}>{step.emphasis}</h3>
          <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">{step.desc}</p>
        </div>
      </div>
    </motion.div>
  );
}
