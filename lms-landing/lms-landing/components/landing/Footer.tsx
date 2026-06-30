import Link from "next/link"
import { GraduationCap, MapPin, Phone, Mail, Clock, Facebook, Youtube, MessageCircle } from "lucide-react"

const quickLinks = [
  { href: "#courses", label: "কোর্সসমূহ" },
  { href: "#features", label: "কেন আমরা?" },
  { href: "#admission", label: "ভর্তি ফর্ম" },
  { href: "#testimonials", label: "শিক্ষার্থীদের মতামত" },
  { href: "/admin", label: "অ্যাডমিন প্যানেল" },
]

const courseLinks = [
  "মাইক্রোসফট অফিস",
  "গ্রাফিক ডিজাইন",
  "ওয়েব ডেভেলপমেন্ট",
  "ডিজিটাল মার্কেটিং",
  "ভিডিও এডিটিং",
  "Python প্রোগ্রামিং",
]

const shifts = [
  { label: "সকাল শিফট", time: "৮:০০ – ১০:০০ AM" },
  { label: "দুপুর শিফট", time: "১০:০০ – ১২:০০ PM" },
  { label: "বিকাল শিফট", time: "২:০০ – ৪:০০ PM" },
  { label: "সন্ধ্যা শিফট", time: "৫:০০ – ৭:০০ PM" },
  { label: "রাত শিফট", time: "৭:০০ – ৯:০০ PM" },
]

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300">
      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-[17px] leading-none">EduCore</p>
                <p className="text-[10px] text-indigo-400 font-semibold tracking-wide uppercase">IT Training Center</p>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              বাংলাদেশের অন্যতম বিশ্বস্ত কম্পিউটার প্রশিক্ষণ কেন্দ্র। ২০১৫ সাল থেকে শিক্ষার্থীদের আইটি ক্যারিয়ার গড়তে সহায়তা করে আসছি।
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-400">
                  ১২৩, মেইন রোড, শহর, জেলা, বাংলাদেশ
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <a href="tel:+8801XXXXXXXXX" className="text-sm text-slate-400 hover:text-white transition-colors">
                  +880 1XXX-XXXXXX
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <a href="mailto:info@educore.com.bd" className="text-sm text-slate-400 hover:text-white transition-colors">
                  info@educore.com.bd
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-400">
                  <p>শনি – বৃহস্পতি</p>
                  <p>সকাল ৮টা – রাত ৯টা</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">দ্রুত লিংক</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-indigo-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">কোর্সসমূহ</h4>
            <ul className="space-y-3">
              {courseLinks.map((course) => (
                <li key={course}>
                  <a
                    href="#courses"
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-indigo-400 transition-colors" />
                    {course}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Shifts & Social */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">ক্লাসের শিফট</h4>
            <ul className="space-y-2 mb-8">
              {shifts.map((s) => (
                <li key={s.label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{s.label}</span>
                  <span className="text-indigo-400 text-xs font-medium">{s.time}</span>
                </li>
              ))}
            </ul>

            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">সোশ্যাল মিডিয়া</h4>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-800 hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-colors group"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-800 hover:bg-red-600 rounded-xl flex items-center justify-center transition-colors group"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </a>
              <a
                href="https://wa.me/8801XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-800 hover:bg-emerald-600 rounded-xl flex items-center justify-center transition-colors group"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </a>
            </div>

            {/* Google Map embed placeholder */}
            <div className="mt-6 rounded-xl overflow-hidden border border-slate-700 h-28 bg-slate-800 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
                <p className="text-xs text-slate-500">Google Map</p>
                <p className="text-[10px] text-slate-600">এখানে embed করুন</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} EduCore IT Training Center. সকল অধিকার সংরক্ষিত।
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <a href="#" className="hover:text-slate-400 transition-colors">গোপনীয়তা নীতি</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-400 transition-colors">শর্তাবলী</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-400 transition-colors">রিফান্ড নীতি</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
