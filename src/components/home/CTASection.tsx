"use client";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-[#0ca368] py-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
          আজই ভর্তি হন
        </h2>
        <p className="text-emerald-50 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
          সীমিত আসন রয়েছে। আপনার ডিজিটাল ভবিষ্যৎ গড়তে দেরি না করে এখনই ভর্তি নিন এবং নতুন কিছু শেখার যাত্রা শুরু করুন।
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="#courses" className="bg-white text-[#0ca368] px-8 py-3.5 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-50 transition-colors shadow-lg">
            কোর্স দেখুন <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="tel:+8801788827474" className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-white/10 transition-colors shadow-lg">
            <Phone className="w-5 h-5" /> কল করুন
          </Link>
        </div>
      </div>
      
      {/* Optional decorative background shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
}
