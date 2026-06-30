import { ClipboardList, CreditCard, BookOpen, Award } from "lucide-react"

const steps = [
  {
    step: "০১",
    icon: ClipboardList,
    title: "ফর্ম পূরণ করুন",
    desc: "অনলাইনে বা সরাসরি অফিসে এসে ভর্তির আবেদন ফর্ম পূরণ করুন।",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    line: "border-indigo-200",
  },
  {
    step: "০২",
    icon: CreditCard,
    title: "ফি পরিশোধ করুন",
    desc: "ভর্তি ফি ও প্রথম মাসের বেতন পরিশোধ করুন। রসিদ সংগ্রহ করুন।",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    line: "border-emerald-200",
  },
  {
    step: "০৩",
    icon: BookOpen,
    title: "ক্লাস শুরু করুন",
    desc: "ব্যাচ ও শিফট অনুযায়ী ক্লাসে যোগ দিন। হাতে-কলমে শিখুন।",
    color: "text-amber-600",
    bg: "bg-amber-50",
    line: "border-amber-200",
  },
  {
    step: "০৪",
    icon: Award,
    title: "সার্টিফিকেট নিন",
    desc: "কোর্স সফলভাবে সম্পন্ন করলে সরকার অনুমোদিত সার্টিফিকেট পাবেন।",
    color: "text-violet-600",
    bg: "bg-violet-50",
    line: "border-violet-200",
  },
]

export default function EnrollSteps() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">
            ভর্তি প্রক্রিয়া
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            মাত্র ৪টি ধাপে ভর্তি সম্পন্ন
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            ভর্তি প্রক্রিয়া সম্পূর্ণ সহজ ও ঝামেলামুক্ত। অনলাইনেও আবেদন করা যায়।
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-14 left-0 right-0 h-px border-t-2 border-dashed border-slate-200 mx-[12%]" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, idx) => (
              <div key={s.step} className="flex flex-col items-center text-center relative">
                {/* Step number */}
                <div className="relative mb-5 z-10">
                  <div className={`w-16 h-16 ${s.bg} rounded-2xl flex items-center justify-center border-2 ${s.line} shadow-sm`}>
                    <s.icon className={`w-7 h-7 ${s.color}`} />
                  </div>
                  <span
                    className={`absolute -top-2 -right-2 w-6 h-6 ${s.bg} border-2 ${s.line} rounded-full text-[10px] font-bold ${s.color} flex items-center justify-center`}
                  >
                    {idx + 1}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notice */}
        <div className="mt-14 bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-4">
          <span className="text-2xl flex-shrink-0">📌</span>
          <div>
            <p className="font-semibold text-amber-900 text-sm mb-1">ভর্তিতে যা যা লাগবে</p>
            <p className="text-amber-700 text-sm leading-relaxed">
              ১ কপি পাসপোর্ট সাইজ ছবি &nbsp;|&nbsp; জাতীয় পরিচয়পত্র / জন্ম সনদ-এর ফটোকপি &nbsp;|&nbsp;
              সর্বশেষ শিক্ষাগত সনদের ফটোকপি &nbsp;|&nbsp; ভর্তি ফি ৫০০ টাকা (নগদ বা বিকাশে)
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
