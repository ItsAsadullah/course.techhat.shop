import { Quote, Star } from "lucide-react"

const testimonials = [
  {
    name: "রাফি আহমেদ",
    course: "গ্রাফিক ডিজাইন",
    batch: "ব্যাচ ২০২৩",
    avatar: "র",
    color: "bg-indigo-500",
    rating: 5,
    text: "EduCore-এ পড়ে আমি মাত্র ৪ মাসে Graphic Design শিখেছি। এখন Fiverr-এ প্রতি মাসে ৪০,০০০+ টাকা ইনকাম করছি। শিক্ষকরা অনেক সহযোগী এবং ক্লাস খুব ব্যবহারিক।",
    income: "৪০,০০০+/মাস",
  },
  {
    name: "সুমাইয়া বেগম",
    course: "মাইক্রোসফট অফিস",
    batch: "ব্যাচ ২০২৩",
    avatar: "স",
    color: "bg-pink-500",
    rating: 5,
    text: "আমি গৃহিণী ছিলাম। MS Office কোর্স করার পর একটি কোম্পানিতে ডেটা এন্ট্রি পোস্টে চাকরি পেয়েছি। EduCore আমার জীবন বদলে দিয়েছে।",
    income: "চাকরি পেয়েছেন",
  },
  {
    name: "তানভীর হাসান",
    course: "ওয়েব ডেভেলপমেন্ট",
    batch: "ব্যাচ ২০২৪",
    avatar: "ত",
    color: "bg-emerald-500",
    rating: 5,
    text: "বাসায় বসে অনলাইনে ক্লাস করা যায়, ভিডিও রেকর্ড পাই, শিক্ষক সবসময় সাহায্য করেন। ৬ মাসে ওয়েব ডেভেলপমেন্ট শিখে এখন একটি সফটওয়্যার ফার্মে কাজ করছি।",
    income: "জুনিয়র ডেভেলপার",
  },
  {
    name: "আরিফুল ইসলাম",
    course: "ডিজিটাল মার্কেটিং",
    batch: "ব্যাচ ২০২৪",
    avatar: "আ",
    color: "bg-amber-500",
    rating: 5,
    text: "ডিজিটাল মার্কেটিং কোর্সটা সত্যিই দারুণ। ফেসবুক, গুগল অ্যাড থেকে শুরু করে SEO সব কিছু শিখেছি। এখন নিজেই ছোট এজেন্সি চালাচ্ছি।",
    income: "নিজস্ব এজেন্সি",
  },
  {
    name: "নুসরাত জাহান",
    course: "Python প্রোগ্রামিং",
    batch: "ব্যাচ ২০২৪",
    avatar: "ন",
    color: "bg-violet-500",
    rating: 5,
    text: "SSC পাস করার পর EduCore-এ Python শিখেছি। এখন Upwork-এ ডেটা অ্যানালিসিসের কাজ করছি। প্রতি মাসে ডলারে ইনকাম করছি।",
    income: "Upwork Freelancer",
  },
  {
    name: "মোহাম্মদ রিজওয়ান",
    course: "ভিডিও এডিটিং",
    batch: "ব্যাচ ২০২৩",
    avatar: "ম",
    color: "bg-teal-500",
    rating: 5,
    text: "YouTube চ্যানেল শুরু করতে চেয়েছিলাম কিন্তু ভিডিও এডিটিং জানতাম না। EduCore-এ শেখার পর আজ আমার চ্যানেলে ৫০ হাজার সাবস্ক্রাইবার।",
    income: "YouTube Creator",
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
        />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">
            শিক্ষার্থীদের মতামত
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            তারা বলছেন তাদের সাফল্যের কথা
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            আমাদের হাজারো সফল শিক্ষার্থীর মধ্য থেকে কয়েকজনের কথা জানুন।
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
            >
              {/* Quote icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-indigo-100 fill-indigo-100" />
              </div>

              {/* Text */}
              <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-5">
                "{t.text}"
              </p>

              {/* Income badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-100">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  {t.income}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                  >
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.course} • {t.batch}</p>
                  </div>
                  <StarRating count={t.rating} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 sm:p-12 text-white text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-3">
            আপনিও সফল হতে পারেন!
          </h3>
          <p className="text-indigo-200 mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            আজই শুরু করুন আপনার আইটি ক্যারিয়ার। সঠিক দিকনির্দেশনা ও হাতে-কলমে প্রশিক্ষণ পান।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#admission"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors text-sm shadow-md"
            >
              এখনই ভর্তি হন →
            </a>
            <a
              href="tel:+8801XXXXXXXXX"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-colors text-sm"
            >
              📞 কল করুন
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
