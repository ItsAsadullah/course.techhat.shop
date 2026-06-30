"use client"

import Link from "next/link"
import {
  Monitor, Palette, Code2, BarChart3, Camera, Database,
  Calculator, Globe, Clock, ArrowRight, Users
} from "lucide-react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import SpotlightCard from "@/components/ui/SpotlightCard"

interface InteractiveCourseImageProps {
  course: {
    name: string
    image?: string
    mode: "online" | "offline"
    badge?: string
    badgeColor?: string
    bg: string
    border: string
  }
}

function InteractiveCourseImage({ course }: InteractiveCourseImageProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      className="relative h-44 w-full overflow-hidden"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        <img 
          src={course.image} 
          alt={course.name} 
          className="w-full h-full object-cover transition-transform duration-500 scale-110 group-hover:scale-125"
          style={{
            transform: "translateZ(30px)"
          }}
        />
      </motion.div>

      <div className="absolute top-0 left-0 right-0 flex justify-between p-3">
        {course.badge && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${course.badgeColor} backdrop-blur-sm z-10`}>
            {course.badge}
          </span>
        )}
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${course.mode === "online" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-amber-100 text-amber-700 border border-amber-200"} backdrop-blur-sm z-10`}>
          {course.mode === "online" ? "অনলাইন" : "অফলাইন"}
        </span>
      </div>
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

import { Course } from "@/data/courses"

interface CoursesProps {
  id: string
  title: string
  subtitle: string
  description: string
  courses: Course[]
  backgroundColor?: string
}

export default function Courses({ id, title, subtitle, description, courses, backgroundColor = "bg-slate-50" }: CoursesProps) {
  return (
    <section id={id} className={`py-20 ${backgroundColor} relative`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px]" />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-14"
        >
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">{subtitle}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-base leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Course grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {courses.map((course) => (
            <motion.div
              variants={itemVariants}
              key={course.name}
              className="group"
            >
              <SpotlightCard className={`p-0 h-full transition-all duration-300 flex flex-col relative overflow-hidden rounded-3xl border border-slate-100`}>
                <div className={`absolute top-0 right-0 w-32 h-32 ${course.bg} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`} />
                
                {/* Course Image */}
                {course.image && (
                  <InteractiveCourseImage course={course} />
                )}
                
                <div className="p-5 flex flex-col flex-1 relative z-10">
                  {/* If no image, show mode badge */}
                  {!course.image && (
                    <div className="flex items-start justify-between mb-4">
                      {course.badge && (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${course.badgeColor}`}>
                          {course.badge}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${course.mode === "online" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-amber-100 text-amber-700 border border-amber-200"}`}>
                        {course.mode === "online" ? "অনলাইন" : "অফলাইন"}
                      </span>
                    </div>
                  )}

                  {/* Name with Icon */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 ${course.bg} border ${course.border} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <course.icon className={`w-5 h-5 ${course.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{course.name}</h3>
                      <p className="text-xs text-slate-500">{course.nameEn}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-5 flex-1">
                    {course.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                        <span className={`w-1.5 h-1.5 rounded-full ${course.bg} border ${course.border} flex-shrink-0`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Meta */}
                  <div className="border-t border-slate-100 pt-4 mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Users className="w-3.5 h-3.5" />
                        <span>{course.students} শিক্ষার্থী</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-slate-500 mb-0.5">মাসিক বেতন</p>
                        <p className={`text-xl font-extrabold ${course.color}`}>৳{course.monthlyFee}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/course/${course.slug}`} className={`text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center shadow-sm`}>
                          বিস্তারিত
                        </Link>
                        <button
                          onClick={() => {
                            const section = document.getElementById("enroll-steps");
                            if (section) {
                              section.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className={`text-xs font-semibold px-4 py-2 rounded-xl ${course.bg} border ${course.border} ${course.color} hover:bg-opacity-90 transition-all flex items-center gap-1.5 hover:gap-2 shadow-sm cursor-pointer`}
                        >
                          ভর্তি হন <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          className="text-center mt-12"
        >
          <p className="text-slate-600 text-sm mb-4">সমস্ত কোর্স দেখতে বা পরামর্শের জন্য কল করুন</p>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
          >
            আরও তথ্য জানুন <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
