import Link from "next/link"
import {
  Monitor, Palette, Code2, BarChart3, Camera, Database,
  Calculator, Globe, Clock, ArrowRight, Users
} from "lucide-react"

const courses = [
  {
    icon: Monitor,
    name: "মাইক্রোসফট অফিস",
    nameEn: "MS Office (Basic & Advanced)",
    duration: "৩ মাস",
    fee: "৩,০০০",
    monthlyFee: "১,৫০০",
    students: "১২০+",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    badge: "জনপ্রিয়",
    badgeColor: "bg-blue-100 text-blue-700",
    features: ["Word, Excel, PowerPoint", "Data Entry & Management", "Practical Project"],
  },
  {
    icon: Palette,
    name: "গ্রাফিক ডিজাইন",
    nameEn: "Graphic Design",
    duration: "৪ মাস",
    fee: "৫,০০০",
    monthlyFee: "১,৫০০",
    students: "৯০+",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-100",
    badge: "সেরা চয়েস",
    badgeColor: "bg-pink-100 text-pink-700",
    features: ["Adobe Photoshop", "Illustrator & CorelDRAW", "Logo, Banner Design"],
  },
  {
    icon: Code2,
    name: "ওয়েব ডেভেলপমেন্ট",
    nameEn: "Web Development",
    duration: "৬ মাস",
    fee: "৮,০০০",
    monthlyFee: "১,৫০০",
    students: "৮০+",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    badge: "নতুন",
    badgeColor: "bg-indigo-100 text-indigo-700",
    features: ["HTML, CSS, JavaScript", "React.js & Next.js", "Database & API"],
  },
  {
    icon: BarChart3,
    name: "ডিজিটাল মার্কেটিং",
    nameEn: "Digital Marketing",
    duration: "৩ মাস",
    fee: "৪,৫০০",
    monthlyFee: "১,৫০০",
    students: "৭০+",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    badge: "",
    badgeColor: "",
    features: ["Facebook & Google Ads", "SEO & Content Marketing", "Freelancing শুরু"],
  },
  {
    icon: Camera,
    name: "ভিডিও এডিটিং",
    nameEn: "Video Editing",
    duration: "৩ মাস",
    fee: "৪,০০০",
    monthlyFee: "১,৫০০",
    students: "৬০+",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
    badge: "",
    badgeColor: "",
    features: ["Adobe Premiere Pro", "After Effects", "YouTube Content"],
  },
  {
    icon: Calculator,
    name: "একাউন্টিং সফটওয়্যার",
    nameEn: "Tally & Accounting",
    duration: "৪ মাস",
    fee: "৬,০০০",
    monthlyFee: "১,৫০০",
    students: "৫৫+",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
    badge: "",
    badgeColor: "",
    features: ["Tally Prime", "QuickBooks বেসিক", "Financial Reporting"],
  },
  {
    icon: Database,
    name: "Python প্রোগ্রামিং",
    nameEn: "Python Programming",
    duration: "৫ মাস",
    fee: "৭,০০০",
    monthlyFee: "১,৫০০",
    students: "৪৫+",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    badge: "নতুন",
    badgeColor: "bg-yellow-100 text-yellow-700",
    features: ["Python Fundamentals", "Data Analysis", "Automation & Script"],
  },
  {
    icon: Globe,
    name: "ফ্রিল্যান্সিং",
    nameEn: "Freelancing Masterclass",
    duration: "২ মাস",
    fee: "৩,০০০",
    monthlyFee: "১,৫০০",
    students: "১০০+",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    badge: "হট",
    badgeColor: "bg-violet-100 text-violet-700",
    features: ["Fiverr & Upwork", "প্রোফাইল তৈরি", "ক্লায়েন্ট ম্যানেজমেন্ট"],
  },
]

export default function Courses() {
  return (
    <section id="courses" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">আমাদের কোর্সসমূহ</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            আপনার পছন্দের কোর্স বেছে নিন
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
            হাতে-কলমে প্রশিক্ষণে শিল্প-বিশেষজ্ঞদের গাইডেন্সে দক্ষতা অর্জন করুন এবং ক্যারিয়ার গড়ুন।
          </p>
        </div>

        {/* Course grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {courses.map((course) => (
            <div
              key={course.name}
              className={`bg-white rounded-2xl border ${course.border} p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col`}
            >
              {/* Icon + badge */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 ${course.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <course.icon className={`w-5 h-5 ${course.color}`} />
                </div>
                {course.badge && (
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${course.badgeColor}`}>
                    {course.badge}
                  </span>
                )}
              </div>

              {/* Name */}
              <h3 className="font-bold text-slate-900 text-base mb-1">{course.name}</h3>
              <p className="text-xs text-slate-400 mb-3">{course.nameEn}</p>

              {/* Features */}
              <ul className="space-y-1.5 mb-4 flex-1">
                {course.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className={`mt-0.5 w-1.5 h-1.5 rounded-full ${course.bg} border ${course.border} flex-shrink-0 mt-1`} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Meta */}
              <div className="border-t border-slate-100 pt-4 mt-auto">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{course.students} শিক্ষার্থী</span>
                  </div>
                </div>

                <div className="flex items-end justify-between mt-2">
                  <div>
                    <p className="text-[10px] text-slate-400">মাসিক বেতন</p>
                    <p className={`text-lg font-bold ${course.color}`}>৳{course.monthlyFee}</p>
                  </div>
                  <Link
                    href="#admission"
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${course.bg} ${course.color} hover:opacity-80 transition-opacity flex items-center gap-1`}
                  >
                    ভর্তি হন <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <p className="text-slate-500 text-sm mb-4">সমস্ত কোর্স দেখতে বা পরামর্শের জন্য কল করুন</p>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors"
          >
            আরও তথ্য জানুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
