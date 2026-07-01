"use client";
import Image from "next/image";
import { MonitorPlay } from "lucide-react";
import { useLang } from "@/context/GlobalLangContext";

export default function SuccessGallery() {
  const { t, isBn } = useLang();
  
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Header */}
        <div className={`text-center mb-16 max-w-3xl mx-auto ${isBn ? "font-bn" : ""}`}>
          <div className="flex justify-center items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mb-4">
            <MonitorPlay className="w-5 h-5" />
            {t("sg_tag")}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-[1.3] mb-6">
            {t("sg_title1")}<br/>
            {t("sg_title2")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            {t("sg_desc1")}<br/>
            {t("sg_desc2")}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-12 gap-6">
          {/* Left Column (Newspaper) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-800">
              <Image src="https://images.unsplash.com/photo-1585241936939-f6ce97645161?q=80&w=600&auto=format&fit=crop" fill alt="Newspaper" className="object-cover" />
            </div>
            <div className="relative h-[250px] md:h-[300px] rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
               {/* Placeholder for the second newspaper article */}
               <Image src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop" fill alt="News Article" className="object-cover" />
            </div>
          </div>

          {/* Right Column (Photos) */}
          <div className="md:col-span-7 flex flex-col gap-6">
            {/* Big Top Photo */}
            <div className="relative h-[300px] md:h-[450px] rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-800">
              <Image src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop" fill alt="Students Group Photo" className="object-cover" />
            </div>
            
            {/* Two Bottom Photos */}
            <div className="grid grid-cols-2 gap-6 h-[200px] md:h-[250px]">
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-800">
                <Image src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop" fill alt="Classroom" className="object-cover" />
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-800">
                <Image src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop" fill alt="Lab" className="object-cover" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
