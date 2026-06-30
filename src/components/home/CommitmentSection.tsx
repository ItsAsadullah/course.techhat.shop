"use client";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function CommitmentSection() {
  const commitments = [
    {
      title: "প্রজেক্ট-ভিত্তিক শিক্ষা",
      desc: "হাতে-কলমে প্রজেক্টের মাধ্যমে শিখবেন বাস্তব অভিজ্ঞতা, যা চাকরিতে কাজে লাগবে",
    },
    {
      title: "অভিজ্ঞ শিক্ষক মণ্ডলী",
      desc: "দীর্ঘ অভিজ্ঞ প্রশিক্ষকরা আপনাকে সঠিক দিকনির্দেশনা দিয়ে শেখাবেন কার্যকরভাবে।",
    },
    {
      title: "সার্টিফিকেট প্রদান",
      desc: "কোর্স শেষে পাবেন আন্তর্জাতিক মানের সার্টিফিকেট, যা আপনার ক্যারিয়ারকে এগিয়ে নেবে।",
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Top Header */}
        <div className="grid md:grid-cols-2 gap-10 items-end mb-16">
          <div>
            <div className="flex items-center gap-2 text-[#0f62fe] font-bold mb-4">
              <div className="w-4 h-4 border-2 border-[#0f62fe] rounded-sm"></div>
              শিখুন আপনার সুবিধামতো
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-[1.2]">
              আপনার সাফল্যের জন্য আমরা প্রতিশ্রুতিবদ্ধ!
            </h2>
          </div>
          <div>
            <p className="text-slate-600 leading-relaxed mb-6">
              আমাদের প্রশিক্ষণ প্রোগ্রামগুলো শিক্ষার্থীদের হাতে-কলমে অভিজ্ঞতা প্রদান করে। আধুনিক ল্যাব, দক্ষ শিক্ষক এবং বাস্তব প্রজেক্টের মাধ্যমে আমরা নিশ্চিত করি যে আপনি প্রতিটি স্কিলে পারদর্শী হবেন।
            </p>
            <Link href="#" className="text-[#0f62fe] font-bold flex items-center gap-2 hover:underline">
              Read More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {commitments.map((item, idx) => (
            <div key={idx} className="bg-white border-2 border-blue-100 rounded-xl p-10 text-center hover:border-[#0f62fe] hover:shadow-xl transition-all duration-300 group">
              <div className="w-24 h-24 bg-[#f4f8fb] rounded-full mx-auto flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <BookOpen className="w-10 h-10 text-[#0f62fe]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{item.title}</h3>
              <p className="text-slate-500 mb-8">{item.desc}</p>
              <div className="w-12 h-px bg-slate-300 mx-auto group-hover:bg-[#0f62fe] transition-colors"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
