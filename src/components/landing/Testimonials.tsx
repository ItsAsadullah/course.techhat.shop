"use client"

import { Quote, Star } from "lucide-react"
import { motion } from "framer-motion"

const testimonials = [
  {
    name: "রাফি আহমেদ",
    course: "গ্রাফিক ডিজাইন",
    batch: "ব্যাচ ২০২৩",
    avatar: "র",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    rating: 5,
    text: "EduCore-এ পড়ে আমি মাত্র ৪ মাসে Graphic Design শিখেছি। এখন Fiverr-এ প্রতি মাসে ৪০,০০০+ টাকা ইনকাম করছি। শিক্ষকরা অনেক সহযোগী এবং ক্লাস খুব ব্যবহারিক।",
    income: "৪০,০০০+/মাস",
  },
  {
    name: "সুমাইয়া বেগম",
    course: "মাইক্রোসফট অফিস",
    batch: "ব্যাচ ২০২৩",
    avatar: "স",
    color: "bg-pink-50 text-pink-600 border-pink-200",
    rating: 5,
    text: "আমি গৃহিণী ছিলাম। MS Office কোর্স করার পর একটি কোম্পানিতে ডেটা এন্ট্রি পোস্টে চাকরি পেয়েছি। EduCore আমার জীবন বদলে দিয়েছে।",
    income: "চাকরি পেয়েছেন",
  },
  {
    name: "তানভীর হাসান",
    course: "ওয়েব ডেভেলপমেন্ট",
    batch: "ব্যাচ ২০২৪",
    avatar: "ত",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    rating: 5,
    text: "বাসায় বসে অনলাইনে ক্লাস করা যায়, ভিডিও রেকর্ড পাই, শিক্ষক সবসময় সাহায্য করেন। ৬ মাসে ওয়েব ডেভেলপমেন্ট শিখে এখন একটি সফটওয়্যার ফার্মে কাজ করছি।",
    income: "জুনিয়র ডেভেলপার",
  },
  {
    name: "আরিফুল ইসলাম",
    course: "ডিজিটাল মার্কেটিং",
    batch: "ব্যাচ ২০২৪",
    avatar: "আ",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    rating: 5,
    text: "ডিজিটাল মার্কেটিং কোর্সটা সত্যিই দারুণ। ফেসবুক, গুগল অ্যাড থেকে শুরু করে SEO সব কিছু শিখেছি। এখন নিজেই ছোট এজেন্সি চালাচ্ছি।",
    income: "নিজস্ব এজেন্সি",
  },
  {
    name: "নুসরাত জাহান",
    course: "Python প্রোগ্রামিং",
    batch: "ব্যাচ ২০২৪",
    avatar: "ন",
    color: "bg-violet-50 text-violet-600 border-violet-200",
    rating: 5,
    text: "SSC পাস করার পর EduCore-এ Python শিখেছি। এখন Upwork-এ ডেটা অ্যানালিসিসের কাজ করছি। প্রতি মাসে ডলারে ইনকাম করছি।",
    income: "Upwork Freelancer",
  },
  {
    name: "মোহাম্মদ রিজওয়ান",
    course: "ভিডিও এডিটিং",
    batch: "ব্যাচ ২০২৩",
    avatar: "ম",
    color: "bg-teal-50 text-teal-600 border-teal-200",
    rating: 5,
    text: "YouTube চ্যানেল শুরু করতে চেয়েছিলাম কিন্তু ভিডিও এডিটিং জানতাম না। EduCore-এ শেখার পর আজ আমার চ্যানেলে ৫০ হাজার সাবস্ক্রাইবার।",
    income: "YouTube Creator",
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? "text-amber-400 fill-amber-400 drop-shadow-sm" : "text-slate-200 fill-slate-200"}`}
        />
      ))}
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white relative z-10 overflow-hidden">
      {/* Decorative gradient elements */}
      <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-14"
        >
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
            শিক্ষার্থীদের মতামত
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            তারা বলছেন তাদের সাফল্যের কথা
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            আমাদের হাজারো সফল শিক্ষার্থীর মধ্য থেকে কয়েকজনের কথা জানুন।
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              variants={itemVariants}
              key={t.name}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 flex flex-col group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-24 h-24 text-slate-300 fill-slate-300" />
              </div>

              {/* Quote icon */}
              <div className="mb-4 relative z-10">
                <Quote className="w-8 h-8 text-blue-200 fill-blue-200 group-hover:text-blue-500 group-hover:fill-blue-500 transition-colors drop-shadow-sm" />
              </div>

              {/* Text */}
              <p className="text-slate-700 text-sm leading-relaxed flex-1 mb-5 relative z-10 italic">
                "{t.text}"
              </p>

              {/* Income badge */}
              <div className="mb-4 relative z-10">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm" />
                  {t.income}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 pt-4 relative z-10">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold text-sm flex-shrink-0 border shadow-sm`}
                  >
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.course} • <span className="text-slate-400">{t.batch}</span></p>
                  </div>
                  <StarRating count={t.rating} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
          className="mt-16 relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-30" />
          
          <div className="relative p-8 sm:p-14 text-white text-center z-10">
            <h3 className="text-2xl sm:text-4xl font-bold mb-4 drop-shadow-md">
              আপনিও সফল হতে পারেন!
            </h3>
            <p className="text-indigo-100 mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed drop-shadow-sm">
              আজই শুরু করুন আপনার আইটি ক্যারিয়ার। সঠিক দিকনির্দেশনা ও হাতে-কলমে প্রশিক্ষণ পান।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/admission"
                className="group relative inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl hover:bg-slate-50 transition-all text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-0.5 overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full -ml-10 bg-indigo-500/10 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative">এখনই ভর্তি হন →</span>
              </a>
              <a
                href="tel:+8801XXXXXXXXX"
                className="inline-flex items-center justify-center gap-2 bg-black/20 backdrop-blur-md text-white font-semibold px-8 py-3.5 rounded-xl border border-white/30 hover:bg-black/30 transition-all text-sm hover:-translate-y-0.5"
              >
                📞 কল করুন
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
