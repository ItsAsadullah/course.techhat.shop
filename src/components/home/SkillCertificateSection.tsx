"use client";
import Image from "next/image";
import { Award, Clock, Star, LineChart } from "lucide-react";

export default function SkillCertificateSection() {
  const items = [
    {
      icon: <Award className="w-5 h-5 text-[#0f62fe]" />,
      title: "দক্ষ এক্সপার্ট ট্রেইনারের কাছ থেকে শিখুন!",
      subtitle: "Diploma in Software Application Course (Six Month)"
    },
    {
      icon: <Clock className="w-5 h-5 text-[#0f62fe]" />,
      title: "দক্ষ এক্সপার্ট ট্রেইনারের কাছ থেকে শিখুন!",
      subtitle: "Computer Office Application Course (Three Month)"
    },
    {
      icon: <Star className="w-5 h-5 text-[#0f62fe]" />,
      title: "দক্ষ এক্সপার্ট ট্রেইনারের কাছ থেকে শিখুন!",
      subtitle: "Computer Basic Course (One Month)"
    },
    {
      icon: <LineChart className="w-5 h-5 text-[#0f62fe]" />,
      title: "দক্ষ এক্সপার্ট ট্রেইনারের কাছ থেকে শিখুন!",
      subtitle: "Graphic Design & Studio Manage Course (Three Month)"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-[1.3] mb-6">
            টেকহ্যাট কম্পিউটার ট্রেনিং সেন্টার থেকে<br/>
            দক্ষতার সার্টিফিকেট
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            আমাদের প্ল্যাটফর্মটি উদ্ভাবন, গুণমান এবং অন্তর্ভুক্তির নীতির উপর নির্মিত, যার লক্ষ্য একটি নিবিড় শিক্ষণ শিক্ষা প্রদান করা।
          </p>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left List */}
          <div className="space-y-6">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-6 items-start pb-6 border-b border-dashed border-gray-200 last:border-0">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="bg-[#1e3a8a] rounded-t-3xl pt-12 px-8 flex justify-center relative z-10 overflow-hidden h-[600px]">
              <Image 
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop" 
                alt="Teacher" 
                width={500} 
                height={700}
                className="object-cover object-top w-[90%] h-[110%]"
              />
            </div>
            {/* Background patterns could go here */}
          </div>

        </div>
      </div>
    </section>
  );
}
