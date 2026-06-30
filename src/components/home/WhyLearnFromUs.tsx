"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCheck, BookOpen, Star, Play } from "lucide-react";

export default function WhyLearnFromUs() {
  const points = [
    "9/10 Average Satisfaction Rate",
    "96% Completitation Rate",
    "Friendly Environment & Expert Teacher"
  ];

  return (
    <section className="py-24 bg-[#f8fafc] relative overflow-hidden">
      {/* Decorative dots background */}
      <div className="absolute top-10 left-10 w-32 h-32 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-red-500"></div>

      <div className="max-w-[1400px] mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#0f62fe] font-bold mb-4">
            <div className="w-2 h-2 rounded-full bg-[#0f62fe]"></div>
            কেন আমাদের সেন্টার থেকে শিখবেন!
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-[1.3] mb-6">
            উৎকর্ষতা, শেখা, বৃদ্ধি এবং সাফল্যের প্রতি আমাদের অঙ্গীকার।
          </h2>
          
          <p className="text-slate-500 leading-relaxed mb-10">
            আমরা শিক্ষার মাধ্যমে জীবনকে রূপান্তরিত করার ব্যাপারে আগ্রহী। সকলের জন্য শিক্ষাকে সহজলভ্য করার লক্ষ্যে প্রতিষ্ঠিত, আমরা জ্ঞানের শক্তিতে বিশ্বাস করি।
          </p>

          <div className="space-y-4 mb-10">
            {points.map((point, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCheck className="w-5 h-5 text-[#0f62fe]" />
                <span className="text-slate-600 font-medium">{point}</span>
              </div>
            ))}
          </div>

          <Link href="#" className="bg-[#0f62fe] text-white px-8 py-3.5 rounded-full font-bold inline-flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
            Read More <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Right Images & Badges */}
        <div className="relative">
          {/* Main Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[550px]">
            <Image 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop" 
              alt="Award Giving Ceremony" 
              fill 
              className="object-cover"
            />
          </div>

          {/* Floating Orange Badge */}
          <div className="absolute top-10 -left-8 w-20 h-20 bg-[#f97316] rounded-full flex items-center justify-center shadow-lg border-4 border-white z-20">
            <BookOpen className="w-8 h-8 text-white" />
          </div>

          {/* Floating Reviews */}
          <div className="absolute top-20 -right-10 bg-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 z-20 border border-gray-100">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="font-black text-slate-800 leading-tight flex items-center gap-1">4.6 <span className="text-xs font-normal text-slate-500">(2.4k)</span></p>
              <p className="text-xs text-slate-500 font-medium leading-tight">AVG Reviews</p>
            </div>
          </div>

          {/* Bottom Left Circular Image with Play Button */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border-[10px] border-white shadow-2xl overflow-hidden z-20 relative bg-white">
            <Image 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=400&auto=format&fit=crop" 
              fill 
              alt="Group" 
              className="object-cover"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-14 h-14 bg-[#0f62fe] rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
            </div>
          </div>

          {/* Bottom Right Students Enrolled */}
          <div className="absolute bottom-10 -right-10 bg-white p-4 rounded-xl shadow-xl z-20 border border-gray-100 w-56">
            <p className="text-xs font-bold text-slate-600 mb-3"><span className="text-[#0f62fe]">36k+</span> Enrolled Students</p>
            <div className="flex -space-x-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                  <Image src={`https://i.pravatar.cc/100?img=${i+20}`} alt="S" width={32} height={32} />
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
