import Link from "next/link"
import { ArrowRight, CheckCircle, PlayCircle, Users, BookOpen, Award, Star } from "lucide-react"

const highlights = [
  "অভিজ্ঞ ও প্রশিক্ষিত শিক্ষকমণ্ডলী",
  "হাতে-কলমে প্রশিক্ষণ (Practical Based)",
  "সার্টিফিকেট সরকার অনুমোদিত",
  "চাকরির সহায়তা প্রদান করা হয়",
]

const floatingBadges = [
  { icon: Users, value: "৫০০০+", label: "শিক্ষার্থী", color: "bg-blue-50 text-blue-700 border-blue-100" },
  { icon: Star, value: "৪.৯/৫", label: "রেটিং", color: "bg-amber-50 text-amber-700 border-amber-100" },
  { icon: Award, value: "১০০%", label: "সার্টিফিকেট", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 pt-28 pb-20 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle, #4F46E5 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-100/60 rounded-full blur-3xl -translate-y-1/4 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full border border-indigo-100 mb-6">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              ২০২৫ সালের ভর্তি চলছে
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5">
              দক্ষ হোন,{" "}
              <span className="relative">
                <span className="text-indigo-600">সফল হোন</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 6 Q50 2 100 6 Q150 10 200 6" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4" />
                </svg>
              </span>
              <br />
              আইটি ক্যারিয়ারে
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-lg">
              বাংলাদেশের শীর্ষস্থানীয় কম্পিউটার প্রশিক্ষণ কেন্দ্র। হাতে-কলমে শিক্ষায় গড়ে উঠুন একজন দক্ষ আইটি পেশাদার হিসেবে। আজই শুরু করুন আপনার ক্যারিয়ার যাত্রা।
            </p>

            {/* Highlight list */}
            <ul className="space-y-3 mb-10">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700 text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="#admission"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm"
              >
                ভর্তি ফর্ম পূরণ করুন
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#courses"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold px-8 py-3.5 rounded-xl border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200 text-sm hover:bg-indigo-50"
              >
                <PlayCircle className="w-4 h-4" />
                কোর্স দেখুন
              </Link>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative">
            {/* Main card - Course Preview */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">চলমান কোর্স</p>
                  <h3 className="font-bold text-slate-900 text-lg">ওয়েব ডেভেলপমেন্ট</h3>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-100">
                  আসন আছে
                </span>
              </div>

              {/* Progress */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-500 font-medium">ব্যাচ অগ্রগতি</span>
                  <span className="text-indigo-600 font-bold">৬৫%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" />
                </div>
              </div>

              {/* Modules */}
              <div className="space-y-3 mb-5">
                {[
                  { name: "HTML & CSS", done: true },
                  { name: "JavaScript", done: true },
                  { name: "React.js", done: false, active: true },
                  { name: "Next.js + Database", done: false },
                ].map((m) => (
                  <div key={m.name} className={`flex items-center gap-3 p-2.5 rounded-lg ${m.active ? "bg-indigo-50" : ""}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      m.done ? "bg-emerald-100" : m.active ? "border-2 border-indigo-400" : "bg-slate-100"
                    }`}>
                      {m.done && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                      {m.active && <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
                    </div>
                    <span className={`text-sm font-medium ${m.active ? "text-indigo-700" : m.done ? "text-slate-400 line-through" : "text-slate-600"}`}>
                      {m.name}
                    </span>
                    {m.active && <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-md font-semibold">চলছে</span>}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">মাসিক বেতন</p>
                  <p className="text-xl font-bold text-indigo-600">৳১,৫০০</p>
                </div>
                <div className="flex -space-x-2">
                  {["ম", "র", "স", "ক"].map((n, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {n}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-600 text-xs font-bold">
                    +৮
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-2.5 flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">মোট কোর্স</p>
                <p className="font-bold text-slate-800 text-sm leading-none">১৫+</p>
              </div>
            </div>

            {floatingBadges.map((badge, i) => (
              <div
                key={badge.label}
                className={`absolute hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold shadow-sm ${badge.color}`}
                style={{
                  bottom: i === 0 ? "-16px" : i === 1 ? "40%" : undefined,
                  top: i === 2 ? "30%" : undefined,
                  left: i === 0 ? "10%" : i === 1 ? "-24px" : undefined,
                  right: i === 2 ? "-24px" : undefined,
                }}
              >
                <badge.icon className="w-4 h-4" />
                <div>
                  <div className="text-sm font-bold">{badge.value}</div>
                  <div className="font-medium opacity-80">{badge.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
