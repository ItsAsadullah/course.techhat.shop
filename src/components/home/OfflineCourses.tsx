"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";

export default function OfflineCourses() {
  const courses = [
    { title: "Diploma In Software Application", price: "7,500.00৳", oldPrice: "9,000.00৳" },
    { title: "Basic Computer Office Application", price: "4,500.00৳", oldPrice: "5,000.00৳" },
    { title: "Graphics Design Expert", price: "5,500.00৳", oldPrice: "6,500.00৳" },
    { title: "Professional Video Editing", price: "6,000.00৳", oldPrice: "7,500.00৳" },
    { title: "Digital Marketing Strategy", price: "8,000.00৳", oldPrice: "10,000.00৳" },
    { title: "Web Design & Development", price: "12,000.00৳", oldPrice: "15,000.00৳" }
  ];

  return (
    <section className="py-24 max-w-[1400px] mx-auto px-4 bg-white" id="offline-courses">
      <div className="text-center mb-16 relative inline-block left-1/2 -translate-x-1/2">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">
          আমাদের <span className="text-[#0f62fe]">অফলাইন/সরাসরি কোর্স</span> সমূহ
        </h2>
        <svg className="absolute -bottom-4 w-full h-4 text-red-500" viewBox="0 0 200 20" preserveAspectRatio="none">
          <path d="M0,10 Q100,20 200,5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden hover:-translate-y-1 transition-transform group">
            <div className="h-56 relative bg-gray-100">
              <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop" fill alt="Course" className="object-cover" />
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-md">20% OFF</div>
              <div className="absolute -bottom-5 left-4 bg-white p-1 rounded-full flex items-center gap-2 shadow-md pr-4">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  <Image src="https://i.pravatar.cc/100?img=12" width={32} height={32} alt="Instructor" />
                </div>
                <span className="text-xs font-bold text-slate-700">Md. Ishaq Sarker</span>
              </div>
            </div>
            <div className="p-6 pt-10">
              <h3 className="font-bold text-xl text-slate-800 mb-4 leading-snug group-hover:text-[#0f62fe] transition-colors line-clamp-2">
                {course.title}
              </h3>
              <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-auto">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 line-through font-semibold">{course.oldPrice}</span>
                  <span className="font-black text-[#0f62fe] text-xl">{course.price}</span>
                </div>
                <Link href="#" className="text-sm font-bold text-slate-700 hover:text-[#0f62fe] flex items-center gap-1 bg-gray-50 px-4 py-2 rounded-lg">
                  Enroll Now <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
