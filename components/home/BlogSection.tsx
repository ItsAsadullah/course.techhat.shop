"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, User, Calendar, MessageSquare } from "lucide-react";
import { useLang } from "@/context/GlobalLangContext";

export default function BlogSection() {
  const { t, isBn } = useLang();
  
  const blogs = [
    {
      img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
      title: isBn ? "কম্পিউটার শেখা কেন প্রয়োজন?" : "Why is it necessary to learn computers?",
      author: "Sarker Md. Ibrahim",
      date: isBn ? "২৪ জুন ২৬" : "24 Jun 26",
      comments: isBn ? "০" : "0",
      desc: isBn 
        ? "কম্পিউটার শেখা কেন প্রয়োজন? জীবিকা নির্বাহ করে বেঁচে থাকতে হলে, আজকের দিনে..." 
        : "Why is it necessary to learn computers? To earn a living and survive today..."
    },
    {
      img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
      title: isBn ? "🖥️ 📝 বেসিক কম্পিউটার কেন শিখা প্রয়োজন?" : "🖥️ 📝 Why learn basic computers?",
      author: "Sarker Md. Ibrahim",
      date: isBn ? "২৪ জুন ২৬" : "24 Jun 26",
      comments: isBn ? "১" : "1",
      desc: isBn 
        ? "বেসিক কম্পিউটার কেন শিখা প্রয়োজন? বর্তমান যুগে কম্পিউটার জ্ঞান শুধু একটি অতিরিক্ত..." 
        : "Why learn basic computers? In the current era, computer knowledge is not just an extra..."
    },
    {
      img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
      title: isBn ? "কম্পিউটার শিখুন! নিজেকে এগিয়ে রাখুন।" : "Learn computers! Keep yourself ahead.",
      author: "Sarker Md. Ibrahim",
      date: isBn ? "২৪ জুন ২৬" : "24 Jun 26",
      comments: isBn ? "০" : "0",
      desc: isBn 
        ? "একাডেমিক কিংবা ক্যারিয়ার সহজ করতে শিখুন। ব্যক্তিগত কাজ, একাডেমিক কিংবা ক্যারিয়ার..." 
        : "Learn to make academic or career easier. Personal work, academic or career..."
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Header */}
        <div className={`text-center mb-16 ${isBn ? "font-bn" : ""}`}>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4">
            {t("blog_title")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            {t("blog_desc")}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <div key={idx} className={`bg-[#f8fafc] dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden group hover:shadow-xl dark:hover:shadow-indigo-900/20 transition-all duration-300 flex flex-col h-full ${isBn ? "font-bn" : ""}`}>
              
              <div className="p-4 pb-0">
                <div className="h-64 relative rounded-xl overflow-hidden">
                  <Image src={blog.img} fill sizes="(max-width: 768px) 100vw, 33vw" alt="Blog" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-bold text-2xl text-slate-800 dark:text-white mb-6 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">
                  <div className="flex items-center gap-1.5"><User className="w-4 h-4" /> {blog.author}</div>
                  <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {blog.date}</div>
                  <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                  <div className="flex items-center gap-1.5 w-full mt-2"><MessageSquare className="w-4 h-4" /> {blog.comments}</div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 text-[15px] mb-8 line-clamp-2 leading-relaxed">
                  {blog.desc}
                </p>
                
                <div className="mt-auto border-t border-dashed border-gray-300 dark:border-slate-700 pt-6">
                  <Link href="#" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline">
                    {t("blog_read")} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
