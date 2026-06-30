"use client";
import Image from "next/image";
import { Star } from "lucide-react";

export default function LiveCourses() {
  return (
    <section className="py-24 bg-[#f8fafc]">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-16 relative inline-block left-1/2 -translate-x-1/2">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">
            Our <span className="text-red-500">Online Live</span> Course
          </h2>
          <svg className="absolute -bottom-4 w-full h-4 text-[#0f62fe]" viewBox="0 0 200 20" preserveAspectRatio="none">
            <path d="M0,10 Q100,20 200,5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Live Course Card 1 */}
          <div className="bg-[#1e293b] rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div>
                <h3 className="text-2xl font-black mb-2">Microsoft Office Live Course</h3>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(s=><Star key={s} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                </div>
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                <Image src="https://i.pravatar.cc/100?img=11" width={64} height={64} alt="Ibrahim" />
              </div>
            </div>
            <div className="flex items-end justify-between relative z-10">
              <div>
                <p className="text-blue-300 font-bold mb-1">কোর্স ফি:</p>
                <p className="text-4xl font-black">2,500৳</p>
              </div>
              <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
                ভর্তি হোন →
              </button>
            </div>
          </div>

          {/* Live Course Card 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 relative overflow-hidden shadow-xl group hover:border-[#0f62fe] transition-colors">
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div>
                <h3 className="text-2xl font-black mb-2 text-slate-800">Microsoft Word Live Course</h3>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(s=><Star key={s} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                </div>
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#0f62fe]">
                <Image src="https://i.pravatar.cc/100?img=12" width={64} height={64} alt="Ishaq" />
              </div>
            </div>
            <div className="flex items-end justify-between relative z-10">
              <div>
                <p className="text-slate-500 font-bold mb-1">কোর্স ফি:</p>
                <p className="text-4xl font-black text-[#0f62fe]">1,200৳</p>
              </div>
              <button className="bg-[#0f62fe] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-blue-700 transition-colors">
                ভর্তি হোন →
              </button>
            </div>
          </div>

          {/* Live Course Card 3 */}
          <div className="bg-[#0f62fe] rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div>
                <h3 className="text-2xl font-black mb-2">Graphics Design Live Course</h3>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(s=><Star key={s} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                </div>
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                <Image src="https://i.pravatar.cc/100?img=13" width={64} height={64} alt="Marmim" />
              </div>
            </div>
            <div className="flex items-end justify-between relative z-10">
              <div>
                <p className="text-blue-200 font-bold mb-1">কোর্স ফি:</p>
                <p className="text-4xl font-black">4,500৳</p>
              </div>
              <button className="bg-white text-[#0f62fe] px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
                ভর্তি হোন →
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
