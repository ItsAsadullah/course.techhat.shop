"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const reviews = [
  {
    name: "Sabbir Ahmed",
    course: "Full Stack Web Development",
    review: "TechHat completely changed my career path. The mentors are incredibly supportive and the project-based approach helped me secure a job as a Jr. Developer within 5 months.",
    image: "https://i.pravatar.cc/150?img=11",
  },
  {
    name: "Tanjila Akter",
    course: "Advanced Graphics Design",
    review: "The curriculum is perfectly aligned with industry standards. I learned not just how to use tools, but how to think like a designer. Highly recommended!",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Mehedi Hasan",
    course: "Digital Marketing Pro",
    review: "Practical assignments and real ad campaign management gave me the confidence to start my own agency. Best learning experience ever.",
    image: "https://i.pravatar.cc/150?img=12",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-24 bg-slate-50 dark:bg-[#020617] relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6"
          >
            Student <span className="text-amber-500">Success</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 font-medium"
          >
            Don't just take our word for it. Hear from those who have walked the path.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 relative"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-slate-100 dark:text-white/5" />
              
              <div className="flex items-center gap-1 text-amber-500 mb-6">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-current" />)}
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-8 relative z-10">
                "{review.review}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image src={review.image} alt={review.name} width={48} height={48} className="object-cover w-full h-full" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{review.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{review.course}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
