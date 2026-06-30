import { Users, BookOpen, Trophy, Clock } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "৫,০০০+",
    label: "সফল শিক্ষার্থী",
    desc: "এখন পর্যন্ত প্রশিক্ষিত",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: BookOpen,
    value: "১৫+",
    label: "কোর্স সমূহ",
    desc: "অফলাইন ও অনলাইন",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Trophy,
    value: "৯৮%",
    label: "সাফল্যের হার",
    desc: "পরীক্ষায় উত্তীর্ণ",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Clock,
    value: "১০+",
    label: "বছরের অভিজ্ঞতা",
    desc: "মানসম্পন্ন প্রশিক্ষণে",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
]

export default function Stats() {
  return (
    <section className="py-12 bg-white border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-slate-800 font-semibold text-sm leading-tight">{stat.label}</p>
                <p className="text-slate-400 text-xs">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
