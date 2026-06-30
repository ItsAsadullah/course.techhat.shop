"use client"

import { ShieldCheck, Cpu, Users2, HeadphonesIcon, Wifi, Medal } from "lucide-react"
import { motion } from "framer-motion"
import SpotlightCard from "@/components/ui/SpotlightCard"

const features = [
  {
    icon: Cpu,
    title: "আধুনিক কম্পিউটার ল্যাব",
    desc: "সর্বাধুনিক কম্পিউটার ও সফটওয়্যার দিয়ে সজ্জিত ল্যাব। প্রতিটি শিক্ষার্থীর জন্য আলাদা কম্পিউটার নিশ্চিত।",
    color: "text-blue-600",
    bg: "bg-blue-50",
    shadow: "shadow-sm border border-blue-100",
  },
  {
    icon: Users2,
    title: "ছোট ব্যাচে ক্লাস",
    desc: "প্রতিটি ব্যাচে সর্বোচ্চ ২০ জন শিক্ষার্থী। শিক্ষকের ব্যক্তিগত মনোযোগ পাওয়ার সুযোগ।",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    shadow: "shadow-sm border border-emerald-100",
  },
  {
    icon: ShieldCheck,
    title: "সরকার অনুমোদিত সার্টিফিকেট",
    desc: "কোর্স সম্পন্নের পর জাতীয় ও আন্তর্জাতিকভাবে স্বীকৃত সার্টিফিকেট প্রদান করা হয়।",
    color: "text-amber-600",
    bg: "bg-amber-50",
    shadow: "shadow-sm border border-amber-100",
  },
  {
    icon: Medal,
    title: "চাকরির সহায়তা",
    desc: "কোর্স শেষে চাকরি পেতে সিভি তৈরি, ইন্টারভিউ প্রস্তুতি ও কোম্পানি লিংকআপের সুবিধা।",
    color: "text-pink-600",
    bg: "bg-pink-50",
    shadow: "shadow-sm border border-pink-100",
  },
  {
    icon: Wifi,
    title: "অনলাইন ক্লাস সুবিধা",
    desc: "ক্লাস মিস হলে রেকর্ডেড ভিডিও দেখার সুবিধা। যেকোনো সময় যেকোনো জায়গা থেকে।",
    color: "text-violet-600",
    bg: "bg-violet-50",
    shadow: "shadow-sm border border-violet-100",
  },
  {
    icon: HeadphonesIcon,
    title: "২৪/৭ সাপোর্ট",
    desc: "পড়াশোনার যেকোনো সমস্যায় WhatsApp ও Facebook গ্রুপের মাধ্যমে সর্বক্ষণিক সহায়তা।",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    shadow: "shadow-sm border border-cyan-100",
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
  return (
    <section id="features" className="py-20 bg-slate-50 border-t border-slate-100 relative z-10 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              কেন আমাদের বেছে নেবেন?
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-5 leading-tight">
              শিক্ষার্থীর সফলতাই <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">আমাদের লক্ষ্য</span>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              আমরা বিশ্বাস করি সঠিক গাইডেন্স ও হাতে-কলমে অনুশীলনের মাধ্যমে যেকোনো শিক্ষার্থী সফল হতে পারে। আমাদের প্রশিক্ষণ পদ্ধতি তাই শিল্প চাহিদার সাথে সঙ্গতি রেখে তৈরি করা হয়েছে।
            </p>

            {/* Mini stats */}
            <div className="mt-8 flex gap-8">
              <div>
                <p className="text-3xl font-bold text-blue-600">৯৫%</p>
                <p className="text-slate-500 text-sm mt-0.5">শিক্ষার্থী সন্তুষ্টি</p>
              </div>
              <div className="border-l border-slate-200 pl-8">
                <p className="text-3xl font-bold text-emerald-600">৮৫%</p>
                <p className="text-slate-500 text-sm mt-0.5">চাকরি প্লেসমেন্ট</p>
              </div>
              <div className="border-l border-slate-200 pl-8">
                <p className="text-3xl font-bold text-amber-600">৫০+</p>
                <p className="text-slate-500 text-sm mt-0.5">পার্টনার কোম্পানি</p>
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
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-[40px] pointer-events-none" />
              <p className="text-sm font-semibold text-blue-600 mb-2">শিক্ষার্থীর অভিজ্ঞতা</p>
              <blockquote className="text-lg font-medium leading-relaxed mb-6 text-slate-700">
                "EduCore-এ পড়ে আমি মাত্র ৩ মাসে Graphic Design শিখেছি এবং এখন Fiverr-এ প্রতি মাসে ৫০,০০০+ টাকা আয় করছি।"
              </blockquote>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-lg text-blue-600">র</div>
                <div>
                  <p className="font-semibold text-slate-900">রাফি আহমেদ</p>
                  <p className="text-slate-500 text-sm">Graphic Design, ব্যাচ ২০২৩</p>
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
              <SpotlightCard className="p-6 h-full transition-all duration-300">
                <div className={`w-12 h-12 ${f.bg} ${f.shadow} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2 relative z-10">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed relative z-10">{f.desc}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
