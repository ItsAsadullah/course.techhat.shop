"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion"
import { Frown, SearchX, BrainCircuit, Activity } from "lucide-react"

const steps = [
  {
    id: 1,
    intro: "রিসোর্স খুঁজে পেলেও,",
    emphasis: "গাইডেন্স খুঁজে পাও না",
    icon: SearchX,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    align: "right", // Content on the right, icon on the left
  },
  {
    id: 2,
    intro: "টিউটোরিয়াল দেখলে বোঝো",
    emphasis: "কিন্তু নিজে করতে পারো না",
    icon: BrainCircuit,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    align: "left",
  },
  {
    id: 3,
    intro: "নিয়ম করে চলতে গিয়ে মাঝেই",
    emphasis: "আগ্রহ হারিয়ে ফেলো",
    icon: Activity,
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    align: "right",
  },
  {
    id: 4,
    intro: "কমপ্লেক্স লজিক AI এর সাহায্যে তৈরি করতে পারলেও",
    emphasis: "নিজে কোড লিখতে পারো না",
    icon: Frown,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    align: "left",
  },
]

export default function Roadmap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end 80%"],
  })

  // Add a slight spring physics for smoother drawing
  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  const [isScrollingUp, setIsScrollingUp] = useState(false)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const prev = scrollYProgress.getPrevious()
    if (prev !== undefined) {
      if (latest < prev) {
        setIsScrollingUp(true)
      } else if (latest > prev) {
        setIsScrollingUp(false)
      }
    }
  })

  const offsetDistance = useTransform(pathLength, [0, 1], ["0%", "100%"])

  const svgPath = "M 420 0 L 420 10 Q 420 30 440 30 L 708 30 Q 728 30 728 50 L 728 200 Q 728 220 708 220 L 132 220 Q 112 220 112 240 L 112 400 Q 112 420 132 420 L 708 420 Q 728 420 728 440 L 728 600 Q 728 620 708 620 L 132 620 Q 112 620 112 640 L 112 800 Q 112 820 132 820 L 400 820 Q 420 820 420 840 L 420 900";

  return (
    <section className="pt-4 pb-24 lg:pt-6 bg-white relative z-10 overflow-hidden" ref={containerRef}>
      {/* Decorative blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1], 
          x: [0, 30, 0], 
          y: [0, -30, 0],
          backgroundColor: ["rgba(79, 70, 229, 0.2)", "rgba(8, 145, 178, 0.2)", "rgba(147, 51, 234, 0.2)", "rgba(79, 70, 229, 0.2)"]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full blur-[120px] -translate-x-1/2 pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1], 
          x: [0, -20, 0], 
          y: [0, 20, 0],
          backgroundColor: ["rgba(8, 145, 178, 0.2)", "rgba(79, 70, 229, 0.2)", "rgba(147, 51, 234, 0.2)", "rgba(8, 145, 178, 0.2)"]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-0 w-[600px] h-[600px] rounded-full blur-[120px] translate-x-1/3 pointer-events-none" 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-16 relative z-20">
          <motion.h2 
            initial={{ opacity: 0, y: -50, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6 relative z-20 flex flex-wrap justify-center gap-1.5 sm:gap-2 leading-tight"
          >
            <span className="inline-block">
              তুমিও
            </span>
            <span className="inline-block">
              কি
            </span>
            <span className="inline-block">
              এমন
            </span>
            <span className="inline-block">
              সমস্যার
            </span>
            <span className="relative inline-block whitespace-nowrap px-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-[length:200%_auto] animate-text-gradient">
                সম্মুখীন?
              </span>
              <svg className="absolute -bottom-2 left-0 w-full h-4 overflow-visible" viewBox="0 0 400 20" preserveAspectRatio="none">
                <motion.path 
                  d="M0,18 Q200,-2 400,18" 
                  fill="none" 
                  stroke="url(#title_underline_gradient)" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                  viewport={{ once: false }}
                />
                <defs>
                  <linearGradient id="title_underline_gradient">
                    <stop stopColor="#6366f1" />
                    <stop offset="0.5" stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-slate-600"
          >
            প্রোগ্রামিং শেখার সময় এগুলো খুব সাধারণ সমস্যা
          </motion.p>
        </div>

        <div className="relative w-full max-w-[840px] mx-auto h-[900px] hidden md:block mt-8">
          {/* SVG Background Path (Desktop Only) */}
          <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none" aria-hidden="true">
            <svg 
              className="w-[840px] h-[900px] flex-shrink-0 overflow-visible"
              viewBox="0 0 840 900" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background faint line */}
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
                @keyframes text-gradient {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                .animate-text-gradient {
                  animation: text-gradient 4s ease infinite;
                }
              `}</style>
              {/* Animated drawn line */}
              <motion.path 
                d={svgPath}
                stroke="url(#paint0_linear)" 
                strokeWidth="4" 
                strokeLinecap="round" 
                pathLength="1"
                style={{ 
                  strokeDasharray: "1 1",
                  strokeDashoffset: useTransform(pathLength, [0, 1], [1, 0]) 
                }}
              />
              <defs>
                <linearGradient id="paint0_linear" x1="150" y1="0" x2="688" y2="900" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              
              {/* Moving Arrow */}
              <motion.g
                style={{
                  offsetPath: `path("${svgPath}")`,
                  offsetDistance,
                  offsetRotate: "auto",
                }}
              >
                <circle cx="0" cy="0" r="16" fill="white" stroke="#3b82f6" strokeWidth="2" />
                <motion.g 
                  animate={{ rotate: isScrollingUp ? 180 : 0 }} 
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: "0 0" }}
                >
                  <svg x="-10" y="-10" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.g>
              </motion.g>
            </svg>
          </div>

          {/* Desktop Step Cards */}
          {steps.map((step, idx) => (
            <StepCardDesktop 
              key={step.id} 
              step={step} 
              idx={idx} 
              pathLength={pathLength} 
            />
          ))}
        </div>

        {/* Mobile Step Cards (Visible on small screens) */}
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
              <div className={`w-full flex flex-row items-center gap-4 bg-white border ${step.border} rounded-2xl p-5 shadow-sm relative z-20`}>
                <div className={`w-12 h-12 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center flex-shrink-0`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-slate-500 text-xs font-medium mb-1">{step.intro}</p>
                  <h3 className={`text-base font-bold ${step.color} leading-tight`}>{step.emphasis}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
          
          {/* Solution Conclusion */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            className="text-center mt-12 relative z-20"
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-full px-6 py-3 backdrop-blur-md shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-blue-900 font-bold text-lg">আমাদের সল্যুশন: প্রজেক্ট-ভিত্তিক লার্নিং</p>
            </div>
          </motion.div>
      </div>
    </section>
  )
}

function StepCardDesktop({ step, idx, pathLength }: { step: any, idx: number, pathLength: any }) {
  const thresholds = [
    [0.00, 0.04],
    [0.15, 0.22],
    [0.40, 0.47],
    [0.65, 0.72]
  ][idx];
  const y = [60, 260, 460, 660][idx];

  const opacity = useTransform(pathLength, thresholds, [0.3, 1]);
  const blurAmount = useTransform(pathLength, thresholds, [8, 0]);
  const yOffset = useTransform(pathLength, thresholds, [20, 0]);
  const filter = useTransform(blurAmount, (v) => `blur(${v}px)`);

  return (
    <motion.div
      style={{ top: `${y}px`, opacity, filter, y: yOffset }}
      className="absolute w-full max-w-xl left-1/2 -translate-x-1/2 h-[120px]"
    >
      <div className={`w-full h-full flex ${step.align === "right" ? "flex-row" : "flex-row-reverse"} items-center bg-white border ${step.border} rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow relative z-20`}>
        
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center flex-shrink-0 absolute ${step.align === "right" ? "-left-7" : "-right-7"} bg-white shadow-sm`}>
          <step.icon className={`w-7 h-7 ${step.color}`} />
        </div>
        
        {/* Text */}
        <div className={`flex-1 text-center px-6`}>
          <p className="text-slate-500 text-sm font-medium mb-1">{step.intro}</p>
          <h3 className={`text-xl font-bold ${step.color} leading-tight`}>{step.emphasis}</h3>
        </div>
      </div>
    </motion.div>
  );
}
