"use client";
import Link from "next/link";
import Image from "next/image";
import { Grid, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [coursesOpen, setCoursesOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-48 h-12">
            <Image src="/logo.png" fill alt="TechHat Logo" className="object-contain object-left" priority />
          </div>
        </Link>

        {/* Categories Button */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-slate-600 cursor-pointer hover:bg-gray-100 transition-colors">
          <Grid className="w-4 h-4 text-slate-500" />
          Categories <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-[15px] font-semibold text-slate-600">
          <Link href="/" className="text-[#0f62fe]">হোম</Link>
          
          {/* Courses Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setCoursesOpen(!coursesOpen)}
              className="flex items-center gap-1 cursor-pointer hover:text-[#0f62fe] transition-colors"
            >
              কোর্স সমূহ <ChevronDown className={`w-4 h-4 transition-transform ${coursesOpen ? "rotate-180" : ""}`} />
            </button>
            
            {coursesOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg py-2 min-w-[200px] z-50">
                <button
                  onClick={() => {
                    scrollToSection("online-courses");
                    setCoursesOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-[#0f62fe] transition-colors"
                >
                  অনলাইন কোর্স
                </button>
                <button
                  onClick={() => {
                    scrollToSection("offline-courses");
                    setCoursesOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-[#0f62fe] transition-colors"
                >
                  অফলাইন কোর্স
                </button>
              </div>
            )}
          </div>
          
          <Link href="#team" className="hover:text-[#0f62fe]">পরিচালনা টিম</Link>
          <Link href="#" className="hover:text-[#0f62fe]">ফটো গ্যালারি</Link>
          <Link href="#" className="hover:text-[#0f62fe]">সফটওয়্যার ডাউনলোড</Link>
          <Link href="#" className="hover:text-[#0f62fe]">ভর্তি ফরম</Link>
          <div className="flex items-center gap-1 cursor-pointer hover:text-[#0f62fe]">
            আরোও <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Login Button */}
        <Link href="#" className="bg-[#0f62fe] text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
          → Login
        </Link>
      </div>
    </nav>
  );
}
