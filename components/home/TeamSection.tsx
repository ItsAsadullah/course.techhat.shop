"use client";
import Image from "next/image";
import { Star, Award, BookOpen, GraduationCap, CheckCircle2, Users, BookOpen as BookIcon, ArrowRight, Briefcase } from "lucide-react";
import { useLang } from "@/context/GlobalLangContext";

export default function TeamSection() {
  const { t, isBn } = useLang();
  const team = [
    {
      name: isBn ? "মোঃ ইব্রাহিম সরকার" : "Md. Ibrahim Sarker",
      role: isBn ? "ফাউন্ডার এবং সিইও" : "Founder & CEO",
      img: "11",
      qualifications: isBn ? ["১০+ বছরের অভিজ্ঞতা", "MSc in CSE"] : ["10+ Years Experience", "MSc in CSE"],
      specialties: isBn ? ["আইটি ম্যানেজমেন্ট", "ক্যারিয়ার কাউন্সেলিং", "ক্লাউড কম্পিউটিং"] : ["IT Management", "Career Counselling", "Cloud Computing"],
      rating: 5.0,
      students: isBn ? "৬৫০" : "650",
      courses: isBn ? "২৫" : "25",
      experience: 10,
      highlighted: true
    },
    {
      name: isBn ? "মোঃ ইসহাক সরকার" : "Md. Ishaq Sarker",
      role: isBn ? "সিনিয়র প্রশিক্ষক" : "Senior Instructor",
      img: "12",
      qualifications: isBn ? ["৮+ বছরের অভিজ্ঞতা", "BSc in CSE"] : ["8+ Years Experience", "BSc in CSE"],
      specialties: isBn ? ["ওয়েব ডেভেলপমেন্ট", "গ্রাফিক্স ডিজাইন", "ইউআই/ইউএক্স"] : ["Web Development", "Graphics Design", "UI/UX"],
      rating: 5.0,
      students: isBn ? "৫২০" : "520",
      courses: isBn ? "১৮" : "18",
      experience: 8,
      highlighted: false
    },
    {
      name: isBn ? "মারমিম ইসলাম" : "Marmim Islam",
      role: isBn ? "কম্পিউটার ইঞ্জিনিয়ার" : "Computer Engineer",
      img: "13",
      qualifications: isBn ? ["BSc in CSE", "CCNA সার্টিফাইড"] : ["BSc in CSE", "CCNA Certified"],
      specialties: isBn ? ["নেটওয়ার্কিং", "হার্ডওয়্যার ও সফটওয়্যার", "সাইবার সিকিউরিটি"] : ["Networking", "Hardware & Software", "Cybersecurity"],
      rating: 5.0,
      students: isBn ? "৪৮০" : "480",
      courses: isBn ? "১৫" : "15",
      experience: 7,
      highlighted: false
    },
  ];

  return (
    <section id="team" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isBn ? "font-bn" : ""}`}>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold mb-4 transition-transform duration-300 hover:scale-105">
            <Briefcase className="w-3.5 h-3.5" />
            {t("team_tag")}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            {t("team_title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t("team_desc")}
          </p>
        </div>

        {/* Instructor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {team.map((member, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1 h-full ${member.highlighted
                ? 'bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 shadow-xl border-indigo-200 dark:border-indigo-800 hover:shadow-2xl'
                : 'bg-white dark:bg-slate-900 hover:shadow-xl dark:hover:shadow-indigo-900/20'
                } ${isBn ? "font-bn" : ""}`}
            >
              {/* Highlight Badge */}
              {member.highlighted && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    {t("team_top")}
                  </div>
                </div>
              )}

              {/* Top Gradient Header */}
              <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-500 relative flex-shrink-0">
                {/* Floating Avatar */}
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                  <div className={`w-28 h-28 rounded-full bg-white dark:bg-slate-900 p-1.5 shadow-lg transition-transform duration-300 hover:scale-105 ${member.highlighted ? 'ring-4 ring-indigo-200 dark:ring-indigo-800' : ''
                    }`}>
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      <Image
                        src={`https://i.pravatar.cc/300?img=${member.img}`}
                        fill
                        sizes="112px"
                        alt={member.name}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-20 px-5 pb-5 flex flex-col flex-1">
                {/* Name & Role */}
                <div className="text-center flex-shrink-0 min-h-[70px]">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {member.name}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-700 dark:text-indigo-400 text-xs font-bold">
                    <GraduationCap className="w-3 h-3" />
                    {member.role}
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center gap-3 flex-shrink-0 min-h-[36px]">
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer hover:scale-110">
                    {/* Custom LinkedIn Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer hover:scale-110">
                    {/* Custom Facebook Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-800 dark:hover:bg-slate-700 hover:text-white transition-all duration-300 cursor-pointer hover:scale-110">
                    {/* Custom GitHub Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="flex-shrink-0 min-h-[72px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t("team_qual")}</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.qualifications.map((q, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        {q}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex-shrink-0 min-h-[100px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t("team_spec")}</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.specialties.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-bold rounded-lg dark:bg-opacity-20"
                        style={{
                          backgroundColor: i % 3 === 0 ? "rgba(224, 231, 255, 0.5)" : i % 3 === 1 ? "rgba(209, 250, 229, 0.5)" : "rgba(254, 243, 199, 0.5)",
                          color: i % 3 === 0 ? "#6366f1" : i % 3 === 1 ? "#10b981" : "#d97706"
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-2 flex-shrink-0 min-h-[72px]">
                  {[
                    { icon: Star, value: member.rating, label: t("team_rating"), color: "#f59e0b" },
                    { icon: Users, value: `${member.students}+`, label: t("team_students"), color: "#6366f1" },
                    { icon: BookIcon, value: member.courses, label: t("team_courses"), color: "#10b981" }
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <stat.icon className="w-3.5 h-3.5 mx-auto mb-0.5" style={{ color: stat.color }} />
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white">{stat.value}</div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA Button - Pushed to Bottom */}
                <div className="mt-auto pt-2">
                  <button className={`w-full py-2.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 ${member.highlighted
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg'
                    }`}>
                    {t("team_btn")}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}