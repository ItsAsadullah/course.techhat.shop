"use client"

import { Quote, Star } from "lucide-react"
import { motion } from "framer-motion"
import { useLang } from "@/context/GlobalLangContext"

const getTestimonials = (isBn: boolean) => [
  {
    name: isBn ? "রাফি আহমেদ" : "Rafi Ahmed",
    course: isBn ? "গ্রাফিক ডিজাইন" : "Graphic Design",
    batch: isBn ? "ব্যাচ ২০২৩" : "Batch 2023",
    avatar: isBn ? "র" : "R",
    color: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    rating: 5,
    text: isBn 
      ? "EduCore-এ পড়ে আমি মাত্র ৪ মাসে Graphic Design শিখেছি। এখন Fiverr-এ প্রতি মাসে ৪০,০০০+ টাকা ইনকাম করছি। শিক্ষকরা অনেক সহযোগী এবং ক্লাস খুব ব্যবহারিক।" 
      : "I learned Graphic Design in just 4 months studying at TechHat. Now I earn 40,000+ Taka per month on Fiverr. The teachers are very helpful and classes are practical.",
    income: isBn ? "৪০,০০০+/মাস" : "40,000+/mo",
  },
  {
    name: isBn ? "সুমাইয়া বেগম" : "Sumaiya Begum",
    course: isBn ? "মাইক্রোসফট অফিস" : "Microsoft Office",
    batch: isBn ? "ব্যাচ ২০২৩" : "Batch 2023",
    avatar: isBn ? "স" : "S",
    color: "bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800",
    rating: 5,
    text: isBn 
      ? "আমি গৃহিণী ছিলাম। MS Office কোর্স করার পর একটি কোম্পানিতে ডেটা এন্ট্রি পোস্টে চাকরি পেয়েছি। EduCore আমার জীবন বদলে দিয়েছে।" 
      : "I was a housewife. After doing the MS Office course, I got a job as a data entry operator in a company. TechHat changed my life.",
    income: isBn ? "চাকরি পেয়েছেন" : "Got a Job",
  },
  {
    name: isBn ? "তানভীর হাসান" : "Tanvir Hasan",
    course: isBn ? "ওয়েব ডেভেলপমেন্ট" : "Web Development",
    batch: isBn ? "ব্যাচ ২০২৪" : "Batch 2024",
    avatar: isBn ? "ত" : "T",
    color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    rating: 5,
    text: isBn 
      ? "বাসায় বসে অনলাইনে ক্লাস করা যায়, ভিডিও রেকর্ড পাই, শিক্ষক সবসময় সাহায্য করেন। ৬ মাসে ওয়েব ডেভেলপমেন্ট শিখে এখন একটি সফটওয়্যার ফার্মে কাজ করছি।" 
      : "Classes can be done online from home, get video recordings, teachers always help. Learned Web Development in 6 months and now working in a software firm.",
    income: isBn ? "জুনিয়র ডেভেলপার" : "Junior Developer",
  },
  {
    name: isBn ? "আরিফুল ইসলাম" : "Ariful Islam",
    course: isBn ? "ডিজিটাল মার্কেটিং" : "Digital Marketing",
    batch: isBn ? "ব্যাচ ২০২৪" : "Batch 2024",
    avatar: isBn ? "আ" : "A",
    color: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    rating: 5,
    text: isBn 
      ? "ডিজিটাল মার্কেটিং কোর্সটা সত্যিই দারুণ। ফেসবুক, গুগল অ্যাড থেকে শুরু করে SEO সব কিছু শিখেছি। এখন নিজেই ছোট এজেন্সি চালাচ্ছি।" 
      : "The Digital Marketing course is truly amazing. Learned everything from Facebook, Google Ads to SEO. Now running my own small agency.",
    income: isBn ? "নিজস্ব এজেন্সি" : "Own Agency",
  },
  {
    name: isBn ? "নুসরাত জাহান" : "Nusrat Jahan",
    course: isBn ? "Python প্রোগ্রামিং" : "Python Programming",
    batch: isBn ? "ব্যাচ ২০২৪" : "Batch 2024",
    avatar: isBn ? "ন" : "N",
    color: "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800",
    rating: 5,
    text: isBn 
      ? "SSC পাস করার পর EduCore-এ Python শিখেছি। এখন Upwork-এ ডেটা অ্যানালিসিসের কাজ করছি। প্রতি মাসে ডলারে ইনকাম করছি।" 
      : "Learned Python at TechHat after passing SSC. Now working on data analysis on Upwork. Earning in dollars every month.",
    income: isBn ? "Upwork Freelancer" : "Upwork Freelancer",
  },
  {
    name: isBn ? "মোহাম্মদ রিজওয়ান" : "Mohammad Rizwan",
    course: isBn ? "ভিডিও এডিটিং" : "Video Editing",
    batch: isBn ? "ব্যাচ ২০২৩" : "Batch 2023",
    avatar: isBn ? "ম" : "M",
    color: "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800",
    rating: 5,
    text: isBn 
      ? "YouTube চ্যানেল শুরু করতে চেয়েছিলাম কিন্তু ভিডিও এডিটিং জানতাম না। EduCore-এ শেখার পর আজ আমার চ্যানেলে ৫০ হাজার সাবস্ক্রাইবার।" 
      : "Wanted to start a YouTube channel but didn't know video editing. After learning at TechHat, today my channel has 50k subscribers.",
    income: isBn ? "YouTube Creator" : "YouTube Creator",
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
  const { t, isBn } = useLang();
  const testimonials = getTestimonials(isBn);

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-slate-950 relative z-10 overflow-hidden">
      {/* Decorative gradient elements */}
      <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className={`text-center mb-14 ${isBn ? "font-bn" : ""}`}
        >
          <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">
            {t("test_tag")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t("test_title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            {t("test_desc")}
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
              className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-900/20 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 flex flex-col group relative overflow-hidden ${isBn ? "font-bn" : ""}`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-[0.03] group-hover:opacity-20 transition-opacity">
                <Quote className="w-24 h-24 text-slate-300 fill-slate-300" />
              </div>

              {/* Quote icon */}
              <div className="mb-4 relative z-10">
                <Quote className="w-8 h-8 text-blue-200 dark:text-blue-900/50 fill-blue-200 dark:fill-blue-900/50 group-hover:text-blue-500 group-hover:fill-blue-500 transition-colors drop-shadow-sm" />
              </div>

              {/* Text */}
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed flex-1 mb-5 relative z-10 italic">
                "{t.text}"
              </p>

              {/* Income badge */}
              <div className="mb-4 relative z-10">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm" />
                  {t.income}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 relative z-10">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold text-sm flex-shrink-0 border shadow-sm`}
                  >
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{t.name}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{t.course} • <span className="text-slate-400 dark:text-slate-500">{t.batch}</span></p>
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
          className={`mt-16 relative overflow-hidden rounded-3xl ${isBn ? "font-bn" : ""}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-30" />
          
          <div className="relative p-8 sm:p-14 text-white text-center z-10">
            <h3 className="text-2xl sm:text-4xl font-bold mb-4 drop-shadow-md">
              {t("test_cta_title")}
            </h3>
            <p className="text-indigo-100 mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed drop-shadow-sm">
              {t("test_cta_desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/admission"
                className="group relative inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl hover:bg-slate-50 transition-all text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-0.5 overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full -ml-10 bg-indigo-500/10 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative">{t("test_cta_btn1")}</span>
              </a>
              <a
                href="tel:+8801XXXXXXXXX"
                className="inline-flex items-center justify-center gap-2 bg-black/20 backdrop-blur-md text-white font-semibold px-8 py-3.5 rounded-xl border border-white/30 hover:bg-black/30 transition-all text-sm hover:-translate-y-0.5"
              >
                {t("test_cta_btn2")}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
