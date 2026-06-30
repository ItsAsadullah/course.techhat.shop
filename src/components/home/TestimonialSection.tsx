"use client";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Rifat Hossain",
      role: "Office Application Student",
      image: "11",
      review: "প্রথমে কম্পিউটার ভিত্তিক শিক্ষা সম্পর্কে আমার সন্দেহ ছিল, তবুও আমি আমার দৃষ্টিভঙ্গি সম্পূর্ণরূপে পরিবর্তন করেছি। কোর্সগুলি আমার নিজস্ব গতিতে শেখার জন্য খুব পরিকল্পিত, এটি গুরুত্বপূর্ণ।"
    },
    {
      name: "Anamika Goshwami",
      role: "Diploma Student",
      image: "12",
      review: "প্রথমে কম্পিউটার ভিত্তিক শিক্ষা সম্পর্কে আমার সন্দেহ ছিল, তবুও আমি আমার দৃষ্টিভঙ্গি সম্পূর্ণরূপে পরিবর্তন করেছি। কোর্সগুলি আমার নিজস্ব গতিতে শেখার জন্য খুব পরিকল্পিত, এটি গুরুত্বপূর্ণ।"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="flex justify-center items-center gap-2 text-[#0f62fe] font-bold mb-4">
            <MessageSquareQuote className="w-5 h-5" />
            শিক্ষার্থীদের অভিজ্ঞতা
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-[1.3] mb-6">
            আমাদের কোর্সে শিক্ষার্থীরা যা বলছে
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            আমাদের শিক্ষার্থীরা কোর্স সম্পন্ন করে অর্জিত অভিজ্ঞতা ও দক্ষতা শেয়ার করেছেন। তাদের<br/>
            মতামত আমাদের কাজকে আরও উন্নত এবং শিক্ষার্থীদের জন্য প্রেরণাদায়ক করে তোলে।
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {testimonials.map((test, idx) => (
            <div key={idx} className="bg-[#f4f8fb] rounded-2xl p-10 relative group hover:shadow-xl transition-shadow">
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-yellow-500 text-yellow-500" />)}
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-8 text-lg font-medium">
                {test.review}
              </p>
              
              <div className="border-t border-blue-100 pt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <Image src={`https://i.pravatar.cc/100?img=${test.image}`} width={56} height={56} alt={test.name} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{test.name}</h4>
                    <p className="text-xs text-slate-500">{test.role}</p>
                  </div>
                </div>
                {/* Big Quote Icon Placeholder */}
                <div className="text-6xl font-serif text-[#0f62fe] opacity-50 leading-none">
                  &#8221;
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4">
          <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-slate-400 hover:bg-[#0f62fe] hover:text-white hover:border-[#0f62fe] transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-slate-400 hover:bg-[#0f62fe] hover:text-white hover:border-[#0f62fe] transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
