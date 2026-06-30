"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Lightbulb, MessageSquare, Trophy, FileText, MonitorPlay, Award, BookOpen } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#f4f8fb] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side (Images & Floating Badges) */}
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop" 
              alt="Classroom" 
              width={800} 
              height={600} 
              className="object-cover w-full h-[500px]"
            />
          </div>

          {/* Floating Green Lightbulb */}
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#22c55e] rounded-full flex items-center justify-center shadow-lg z-10 animate-bounce">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>

          {/* Floating 20% OFF */}
          <div className="absolute top-32 -left-12 bg-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 z-10">
            <div className="w-10 h-10 bg-[#6366f1] rounded-full flex items-center justify-center text-white font-bold text-lg">
              %
            </div>
            <div>
              <p className="font-black text-slate-800 leading-tight">20% OFF</p>
              <p className="text-xs text-slate-500 font-medium leading-tight">For All Courses</p>
            </div>
          </div>

          {/* Floating Reviews */}
          <div className="absolute top-10 right-10 bg-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 z-10">
            <div className="w-10 h-10 bg-[#f97316] rounded-full flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="font-black text-slate-800 leading-tight flex items-center gap-1">4.6 <span className="text-xs font-normal text-slate-500">(2.4k)</span></p>
              <p className="text-xs text-slate-500 font-medium leading-tight">AVG Reviews</p>
            </div>
          </div>

          {/* Floating Satisfaction Chart */}
          <div className="absolute -bottom-10 right-10 bg-white p-6 rounded-2xl shadow-2xl z-10 w-64 text-center">
            <div className="relative w-32 h-16 mx-auto mb-4 overflow-hidden">
              <div className="w-32 h-32 rounded-full border-[12px] border-[#f97316] absolute top-0 left-0 border-b-gray-100 border-r-gray-100 transform -rotate-45"></div>
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="absolute top-0 right-0 bg-[#f97316] text-white text-[10px] font-bold px-1 rounded">90%</div>
            </div>
            <p className="font-bold text-slate-800 text-sm">90% Satisfied Students</p>
            <p className="text-xs text-slate-500">Excelent</p>
          </div>
        </div>

        {/* Right Side (Text & Features) */}
        <div className="lg:pl-8">
          <div className="flex items-center gap-2 text-[#0f62fe] font-bold mb-4">
            <div className="w-4 h-4 border-2 border-[#0f62fe] rounded-sm"></div>
            আমাদের সম্পর্কে
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black text-slate-800 leading-[1.2] mb-6">
            শেখা সহজ ও দক্ষতার পথে আপনার সঙ্গী
          </h2>
          
          <p className="text-slate-600 mb-10 leading-relaxed">
            আমরা একটি আধুনিক কম্পিউটার ট্রেনিং সেন্টার যেখানে প্রত্যেক শিক্ষার্থীকে নতুন প্রযুক্তি, সফটওয়্যার ও আইটি স্কিল শেখানো হয় সহজভাবে। আমাদের কোর্সগুলো তৈরি করা হয়েছে শুরু থেকে এক্সপার্ট পর্যন্ত সবার জন্য।
          </p>
          
          <div className="grid sm:grid-cols-2 gap-8 mb-10">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#0f62fe]" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-2">অভিজ্ঞ প্রশিক্ষক</h4>
                <p className="text-xs text-slate-500 leading-relaxed">দীর্ঘ অভিজ্ঞতা সম্পন্ন শিক্ষকরা আপনাকে সঠিকভাবে গাইড করবেন।</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-2">আমাদের কোর্স</h4>
                <p className="text-xs text-slate-500 leading-relaxed">যেকোন অবস্থান থেকে কোর্স অংশ নেওয়া সম্ভব।</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <MonitorPlay className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-2">আধুনিক ল্যাব সুবিধা</h4>
                <p className="text-xs text-slate-500 leading-relaxed">সর্বাধুনিক কম্পিউটার ও সফটওয়্যার ল্যাব।</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-2">সার্টিফিকেট</h4>
                <p className="text-xs text-slate-500 leading-relaxed">কোর্স শেষে সার্টিফিকেট এবং জব গাইডলাইন।</p>
              </div>
            </div>
          </div>
          
          <Link href="#courses" className="bg-[#0f62fe] text-white px-8 py-3.5 rounded-full font-bold inline-flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
            কোর্স দেখুন <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
