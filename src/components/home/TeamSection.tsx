"use client";
import Image from "next/image";
import { Star, Award, BookOpen, GraduationCap, CheckCircle2, Users, BookOpen as BookIcon, ArrowRight, Briefcase } from "lucide-react";

export default function TeamSection() {
  const team = [
    {
      name: "Md. Ibrahim Sarker",
      role: "Founder & CEO",
      img: "11",
      qualifications: ["10+ Years Experience", "MSc in CSE"],
      specialties: ["IT Management", "Career Counselling", "Cloud Computing"],
      rating: 5.0,
      students: 650,
      courses: 25,
      experience: 10,
      highlighted: true
    },
    {
      name: "Md. Ishaq Sarker",
      role: "Senior Instructor",
      img: "12",
      qualifications: ["8+ Years Experience", "BSc in CSE"],
      specialties: ["Web Development", "Graphics Design", "UI/UX"],
      rating: 5.0,
      students: 520,
      courses: 18,
      experience: 8,
      highlighted: false
    },
    {
      name: "Marmim Islam",
      role: "Computer Engineer",
      img: "13",
      qualifications: ["BSc in CSE", "CCNA Certified"],
      specialties: ["Networking", "Hardware & Software", "Cybersecurity"],
      rating: 5.0,
      students: 480,
      courses: 15,
      experience: 7,
      highlighted: false
    },
  ];

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-4 transition-transform duration-300 hover:scale-105">
            <Briefcase className="w-3.5 h-3.5" />
            Our Expert Instructors
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Meet Our Expert Instructors
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Learn from experienced professionals who are passionate about helping students build real-world skills.
          </p>
        </div>

        {/* Instructor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl shadow-md border border-slate-200 overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1 ${member.highlighted
                ? 'bg-gradient-to-br from-slate-50 to-white shadow-xl border-indigo-200 hover:shadow-2xl'
                : 'bg-white hover:shadow-xl'
                }`}
            >
              {/* Highlight Badge */}
              {member.highlighted && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    Top Instructor
                  </div>
                </div>
              )}

              {/* Top Gradient Header */}
              <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-500 relative flex-shrink-0">
                {/* Floating Avatar */}
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                  <div className={`w-28 h-28 rounded-full bg-white p-1.5 shadow-lg transition-transform duration-300 hover:scale-105 ${member.highlighted ? 'ring-4 ring-indigo-200' : ''
                    }`}>
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      <Image
                        src={`https://i.pravatar.cc/300?img=${member.img}`}
                        fill
                        alt={member.name}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-20 px-6 pb-6 flex flex-col flex-1">
                {/* Name & Role */}
                <div className="text-center mb-4 flex-shrink-0 min-h-[72px]">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {member.name}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full text-indigo-700 text-xs font-bold">
                    <GraduationCap className="w-3 h-3" />
                    {member.role}
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center gap-3 mb-5 flex-shrink-0 min-h-[36px]">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 cursor-pointer hover:scale-110">
                    {/* Custom LinkedIn Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer hover:scale-110">
                    {/* Custom Facebook Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-white transition-all duration-300 cursor-pointer hover:scale-110">
                    {/* Custom GitHub Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </div>
                </div>

                {/* Qualifications - Fixed Height */}
                <div className="mb-5 flex-shrink-0 min-h-[88px]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Qualifications</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.qualifications.map((q, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white rounded-lg border border-slate-200 shadow-sm">
                        {q}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specialties - Fixed Height */}
                <div className="mb-5 flex-shrink-0 min-h-[112px]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Specialized In</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.specialties.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-bold rounded-lg"
                        style={{
                          background: i % 3 === 0 ? "#e0e7ff" : i % 3 === 1 ? "#d1fae5" : "#fef3c7",
                          color: i % 3 === 0 ? "#4338ca" : i % 3 === 1 ? "#059669" : "#b45309"
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Statistics - Fixed Height */}
                <div className="grid grid-cols-3 gap-2 mb-5 flex-shrink-0 min-h-[72px]">
                  {[
                    { icon: Star, value: member.rating, label: "Rating", color: "#f59e0b" },
                    { icon: Users, value: `${member.students}+`, label: "Students", color: "#6366f1" },
                    { icon: BookIcon, value: member.courses, label: "Courses", color: "#10b981" }
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-2 rounded-xl bg-slate-50 border border-slate-200 transition-all duration-300 hover:bg-slate-100">
                      <stat.icon className="w-3.5 h-3.5 mx-auto mb-0.5" style={{ color: stat.color }} />
                      <div className="text-sm font-extrabold text-slate-900">{stat.value}</div>
                      <div className="text-[9px] text-slate-500 font-bold">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Experience - Fixed Height */}
                <div className="mb-5 flex-shrink-0 min-h-[40px]">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-slate-700">Experience</span>
                    <span className="text-xs font-extrabold text-indigo-600">{member.experience}+ Years</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${member.experience * 10}%`,
                        background: "linear-gradient(90deg, #6366f1, #a855f7)"
                      }}
                    />
                  </div>
                </div>

                {/* CTA Button - Pushed to Bottom */}
                <div className="mt-auto">
                  <button className={`w-full py-2.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 ${member.highlighted
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg'
                    }`}>
                    View Profile
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