"use client";
import Image from "next/image";
import { MonitorPlay } from "lucide-react";

export default function SuccessGallery() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-2 text-[#0f62fe] font-bold mb-4">
            <MonitorPlay className="w-5 h-5" />
            আমাদের সেন্টারের সাফল্যের ঝলক
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-[1.3] mb-6">
            শিখতে এবং গড়তে দেখুন আমাদের<br/>
            শিক্ষার্থীদের সাফল্য
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            আমাদের শিক্ষার্থীরা হাতে-কলমে প্রজেক্ট এবং কোর্স সম্পন্ন করে দারুন সাফল্য অর্জন করেছে।<br/>
            এখানে তাদের ছবির মাধ্যমে কিছু উদাহরণ এবং সাফল্যের গল্প তুলে ধরা হলো, যা আপনাকেও<br/>
            অনুপ্রাণিত করবে।
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-12 gap-6">
          {/* Left Column (Newspaper) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg border border-gray-100">
              <Image src="https://images.unsplash.com/photo-1585241936939-f6ce97645161?q=80&w=600&auto=format&fit=crop" fill alt="Newspaper" className="object-cover" />
            </div>
            <div className="relative h-[250px] md:h-[300px] rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-white p-4">
               {/* Placeholder for the second newspaper article */}
               <Image src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop" fill alt="News Article" className="object-cover" />
            </div>
          </div>

          {/* Right Column (Photos) */}
          <div className="md:col-span-7 flex flex-col gap-6">
            {/* Big Top Photo */}
            <div className="relative h-[300px] md:h-[450px] rounded-xl overflow-hidden shadow-lg border border-gray-100">
              <Image src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop" fill alt="Students Group Photo" className="object-cover" />
            </div>
            
            {/* Two Bottom Photos */}
            <div className="grid grid-cols-2 gap-6 h-[200px] md:h-[250px]">
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <Image src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop" fill alt="Classroom" className="object-cover" />
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <Image src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop" fill alt="Lab" className="object-cover" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
