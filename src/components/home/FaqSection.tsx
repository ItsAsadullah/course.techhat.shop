"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, MessageCircleQuestion } from "lucide-react";

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  const faqs = [
    {
      q: "আমি কিভাবে কোর্সে ভর্তি হব?",
      a: "আমাদের যেকোন কোর্সে ভর্তি হলে Enroll বাটনে ক্লিক করুন এবং অনলাইনে ভর্তি হলে সরাসরি অফিসে যোগাযোগ করুন অথবা 01788-827474 এই নম্বরে কল করুন।"
    },
    { q: "আমি কি আমার কোর্সগুলো মোবাইল ডিভাইসে অ্যাক্সেস করতে পারব?", a: "হ্যাঁ, আপনি যেকোনো স্মার্টফোন থেকে আমাদের কোর্স অ্যাক্সেস করতে পারবেন।" },
    { q: "আমি কতক্ষণ কোর্সে অংশগ্রহণ করতে পারব?", a: "কোর্সটি আপনার অ্যাকাউন্টে আজীবন থাকবে, আপনি যে কোনো সময় দেখতে পারবেন।" },
    { q: "কোর্স চলাকালীন সাহায্যের প্রশ্নগুলির প্রয়োজন হলে?", a: "আমাদের ডেডিকেটেড লাইভ সাপোর্ট গ্রুপ আছে যেখানে আপনি যেকোনো সাহায্য পাবেন।" }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-[1400px] mx-auto px-4 grid lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side (Image) */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl h-[600px] relative">
            <Image 
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop" 
              alt="Certificate Handover" 
              fill 
              className="object-cover"
            />
          </div>
        </div>

        {/* Right Side (FAQ Accordion) */}
        <div className="pt-8">
          <div className="flex items-center gap-2 text-[#0f62fe] font-bold mb-4">
            <MessageCircleQuestion className="w-5 h-5" />
            Frequently Asked Questions (FAQs)
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-[1.2] mb-6">
            আপনার প্রশ্নের উত্তর খুঁজুন
          </h2>
          
          <p className="text-slate-500 leading-relaxed mb-10">
            আমাদের প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী বিভাগে স্বাগতম! এখানে, আমরা আমাদের<br/>ব্যবহারকারীদের জিজ্ঞাসা করা কিছু সাধারণ প্রশ্নের উত্তর সংকলন করেছি।
          </p>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = open === idx;
              return (
                <div 
                  key={idx} 
                  className={`border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-[#0f62fe] border-[#0f62fe]' : 'bg-[#f8fafc] border-gray-100 hover:border-blue-200'}`}
                >
                  <button 
                    onClick={() => setOpen(isOpen ? -1 : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between"
                  >
                    <span className={`font-bold text-lg ${isOpen ? 'text-white' : 'text-slate-800'}`}>
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-white text-[#0f62fe]' : 'bg-[#0f62fe] text-white'}`}>
                      {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6 text-blue-100 border-t border-white/20 mt-2 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
