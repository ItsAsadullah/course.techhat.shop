"use client";
import Image from "next/image";
import { Star, Award, BookOpen, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>;
const Twitter = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>;

export default function TeamSection() {
  const team = [
    {
      name: "Md. Ibrahim Sarker",
      role: "Founder & CEO",
      img: "11",
      qualifications: ["10+ বছর অভিজ্ঞ", "Computer Science MSc"],
      specialties: ["IT Management", "Career Counseling"],
    },
    {
      name: "Md. Ishaq Sarker",
      role: "Senior Instructor",
      img: "12",
      qualifications: ["8+ বছর অভিজ্ঞ", "BSc in CSE"],
      specialties: ["Web Development", "Graphics Design"],
    },
    {
      name: "Marmim Islam",
      role: "Computer Engineer",
      img: "13",
      qualifications: ["BSc in CSE", "CCNA Certified"],
      specialties: ["Networking", "Hardware & Software"],
    },
    {
      name: "Omar Faruk CMB",
      role: "Digital Marketing Expert",
      img: "14",
      qualifications: ["Google Certified", "5+ Years Experience"],
      specialties: ["SEO", "Social Media Marketing"],
    },
    {
      name: "Hasan Ali",
      role: "Full Stack Developer",
      img: "15",
      qualifications: ["BSc in CSE", "React & Next.js Expert"],
      specialties: ["MERN Stack", "Web Application"],
    },
  ];

  return (
    <section id="team" className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              আমাদের টিম
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">
              আমাদের দক্ষ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">শিক্ষক মণ্ডলী</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              প্রতিটি শিক্ষকই তাদের নিজের ক্ষেত্রে বিশেষজ্ঞ, যারা আপনাকে বাস্তবভিত্তিক শিক্ষা প্রদান করবেন।
            </p>
          </motion.div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              whileHover={{ y: -5 }}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

              <div className="p-6 flex-1 flex flex-col">
                {/* Header & Image Section */}
                <div className="flex flex-col items-center text-center mb-5">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 p-1 mx-auto shadow-sm group-hover:shadow-md transition-shadow duration-300 group-hover:scale-105 transform">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                        <Image
                          src={`https://i.pravatar.cc/300?img=${member.img}`}
                          fill
                          alt={member.name}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <motion.h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                    {member.name}
                  </motion.h3>
                  <p className="text-indigo-600 font-medium text-sm flex items-center justify-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    {member.role}
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer">
                    <Twitter className="w-4 h-4" />
                  </div>
                </div>

                <div className="w-full h-px bg-slate-100 mb-5"></div>

                {/* Qualifications */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    যোগ্যতা
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.qualifications.map((q, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold px-2.5 py-1 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-lg border border-amber-100/50"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-5 flex-1">
                  <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    বিশেষত্ব
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.specialties.map((s, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-100/50"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating Footer */}
                <div className="w-full pt-4 mt-auto flex items-center justify-between border-t border-slate-50">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    5.0 <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wide ml-0.5">রেটিং</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
