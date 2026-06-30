"use client";

import { motion } from "framer-motion";

import Image from "next/image";

const teachers = [
  {
    name: "Arif Hossain",
    role: "Lead Software Engineer",
    company: "Google",
    image: "https://i.pravatar.cc/300?img=11",
  },
  {
    name: "Nusrat Jahan",
    role: "Senior UI/UX Designer",
    company: "Meta",
    image: "https://i.pravatar.cc/300?img=5",
  },
  {
    name: "Rakib Hasan",
    role: "Marketing Head",
    company: "Shopify",
    image: "https://i.pravatar.cc/300?img=12",
  },
];

export default function Teacher() {
  return (
    <section id="teachers" className="py-24 bg-slate-50 dark:bg-[#020617] relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6"
          >
            Learn from <span className="text-fuchsia-500">Experts</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 font-medium"
          >
            Our mentors are industry veterans working at the world's top tech companies.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teachers.map((teacher, idx) => (
            <motion.div
              key={teacher.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-center group hover:-translate-y-2 transition-all hover:shadow-[0_0_30px_rgba(217,70,239,0.15)] hover:border-fuchsia-500/50"
            >
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-slate-50 dark:border-[#020617] shadow-xl group-hover:border-fuchsia-500/30 transition-colors">
                <Image src={teacher.image} alt={teacher.name} width={128} height={128} className="object-cover w-full h-full" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{teacher.name}</h3>
              <p className="text-fuchsia-500 font-semibold text-sm mb-1">{teacher.role}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">Ex- {teacher.company}</p>
              
              <div className="flex justify-center gap-3">
                <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-500 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-cyan-500 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
