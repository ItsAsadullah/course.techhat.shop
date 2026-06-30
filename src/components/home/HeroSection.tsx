"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, PhoneCall, Clock } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-[#f8fafc] py-12 md:py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Text */}
        <div className="pt-8">
          <div className="flex items-center gap-2 text-[#0f62fe] font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-[#0f62fe]"></span>
            টেকহ্যাট কম্পিউটার ট্রেনিং সেন্টারে স্বাগতম
          </div>
          
          <h1 className="text-5xl md:text-[64px] font-black leading-[1.1] mb-6 text-slate-800 tracking-tight">
            কম্পিউটার শেখা হোক <br/>
            <span className="text-[#f97316]">সহজ ও আধুনিক </span>
            <span className="text-[#0f62fe]">পদ্ধতিতে</span>
          </h1>
          
          <p className="text-slate-500 text-lg md:text-xl font-medium mb-10 max-w-xl leading-relaxed">
            নিজের স্কিলকে ডেভেলপ করতে এবং নিজেকে সবসময় সবার থেকে এগিয়ে রাখতে এখনই ইনরোল করে ফেলো তোমার পছন্দের কোর্সটি...
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <Link href="#courses" className="bg-[#0f62fe] text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
              কোর্স দেখুন <ArrowUpRight className="w-5 h-5" />
            </Link>
            <Link href="#about" className="bg-white text-[#0f62fe] border-2 border-[#0f62fe] px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors">
              আমাদের সম্পর্কে <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Right Image & Badges */}
        <div className="relative hidden lg:block h-[600px]">
          {/* Background Blue Shape */}
          <div className="absolute right-0 top-0 bottom-0 w-[80%] bg-[#0f62fe] rounded-l-[4rem] skew-x-6 transform origin-bottom" />
          
          {/* Person Image */}
          <Image 
            src="/wp-content/uploads/2025/10/girl-taking-online-education-9560194-7793572.gif" 
            alt="Instructor" 
            width={600} 
            height={700}
            className="absolute bottom-0 right-10 object-contain z-10 drop-shadow-2xl h-[90%]"
          />

          {/* Badges */}
          <div className="absolute top-20 left-0 bg-white p-3 rounded-2xl shadow-xl z-20 flex flex-col gap-2 animate-[bounce_4s_infinite]">
            <span className="text-xs font-bold text-slate-500">1.5k+ Enrolled Students</span>
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="S" width={32} height={32} />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-32 left-10 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-4 animate-[bounce_5s_infinite]">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-black text-slate-800 text-lg leading-tight">20% OFF</p>
              <p className="text-sm font-medium text-slate-500 leading-tight">For All Courses</p>
            </div>
          </div>

          <div className="absolute top-1/2 -right-10 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-4 animate-[bounce_6s_infinite]">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <PhoneCall className="w-6 h-6 text-[#0f62fe]" />
            </div>
            <div>
              <p className="font-bold text-slate-500 text-sm leading-tight">Online Supports</p>
              <p className="font-black text-[#0f62fe] text-lg leading-tight">+880 1788-827474</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
