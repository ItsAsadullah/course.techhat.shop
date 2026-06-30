"use client";
import { MonitorPlay, Trophy, Headphones } from "lucide-react";

export default function FeatureBoxes() {
  const features = [
    { icon: <MonitorPlay className="w-8 h-8 text-[#0f62fe]" />, title: "Skilled Instructors", desc: "Learn from industry experts with years of practical experience." },
    { icon: <Trophy className="w-8 h-8 text-[#0f62fe]" />, title: "Govt. Approved", desc: "Get certified with government approved skill development certificates." },
    { icon: <Headphones className="w-8 h-8 text-[#0f62fe]" />, title: "24/7 Live Support", desc: "Dedicated support team available round the clock to help you." },
  ];

  return (
    <section className="py-16 bg-white relative z-20 -mt-16">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
