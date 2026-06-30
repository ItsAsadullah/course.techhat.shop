"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, User, Calendar, MessageSquare } from "lucide-react";

export default function BlogSection() {
  const blogs = [
    {
      img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
      title: "কম্পিউটার শেখা কেন প্রয়োজন?",
      author: "Sarker Md. Ibrahim",
      date: "24 Jun 26",
      comments: "0",
      desc: "কম্পিউটার শেখা কেন প্রয়োজন? জীবিকা নির্বাহ করে বেঁচে থাকতে হলে, আজকের দিনে..."
    },
    {
      img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
      title: "🖥️ 📝 বেসিক কম্পিউটার কেন শিখা প্রয়োজন?",
      author: "Sarker Md. Ibrahim",
      date: "24 Jun 26",
      comments: "1",
      desc: "বেসিক কম্পিউটার কেন শিখা প্রয়োজন? বর্তমান যুগে কম্পিউটার জ্ঞান শুধু একটি অতিরিক্ত..."
    },
    {
      img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
      title: "কম্পিউটার শিখুন! নিজেকে এগিয়ে রাখুন।",
      author: "Sarker Md. Ibrahim",
      date: "24 Jun 26",
      comments: "0",
      desc: "একাডেমিক কিংবা ক্যারিয়ার সহজ করতে শিখুন। ব্যক্তিগত কাজ, একাডেমিক কিংবা ক্যারিয়ার..."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-800 mb-4">
            সাম্প্রতিক ব্লগ পোস্ট
          </h2>
          <p className="text-slate-500">
            কম্পিউটার টেকনোলজি সম্পর্কে গুরুত্বপূর্ণ ব্লগ পোস্ট পড়ুন।
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <div key={idx} className="bg-[#f8fafc] rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              
              <div className="p-4 pb-0">
                <div className="h-64 relative rounded-xl overflow-hidden">
                  <Image src={blog.img} fill alt="Blog" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-bold text-2xl text-slate-800 mb-6 leading-snug group-hover:text-[#0f62fe] transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 font-medium mb-6">
                  <div className="flex items-center gap-1.5"><User className="w-4 h-4" /> {blog.author}</div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {blog.date}</div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="flex items-center gap-1.5 w-full mt-2"><MessageSquare className="w-4 h-4" /> {blog.comments}</div>
                </div>
                
                <p className="text-slate-600 text-[15px] mb-8 line-clamp-2 leading-relaxed">
                  {blog.desc}
                </p>
                
                <div className="mt-auto border-t border-dashed border-gray-300 pt-6">
                  <Link href="#" className="inline-flex items-center gap-2 text-[#0f62fe] font-bold hover:underline">
                    Read More <ArrowRight className="w-4 h-4" />
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
