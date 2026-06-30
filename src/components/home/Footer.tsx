import Link from "next/link"
import { GraduationCap, MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
)

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
)

const quickLinks = [
  { href: "/#courses", label: "কোর্সসমূহ" },
  { href: "/#features", label: "কেন আমরা?" },
  { href: "/admission", label: "ভর্তি ফর্ম" },
  { href: "/#testimonials", label: "শিক্ষার্থীদের মতামত" },
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
    <footer id="contact" className="bg-white text-slate-600 relative border-t border-slate-100 overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute -bottom-20 left-0 w-64 h-64 bg-cyan-50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[100px] pointer-events-none" />

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <GraduationCap className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-[18px] leading-none tracking-wide group-hover:text-blue-600 transition-colors">EduCore</p>
                <p className="text-[10px] text-blue-500 font-semibold tracking-widest uppercase mt-0.5">IT Training Center</p>
              </div>
            </Link>

            <p className="text-slate-600 text-sm leading-relaxed mb-7">
              বাংলাদেশের অন্যতম বিশ্বস্ত কম্পিউটার প্রশিক্ষণ কেন্দ্র। ২০১৫ সাল থেকে শিক্ষার্থীদের আইটি ক্যারিয়ার গড়তে সহায়তা করে আসছি।
            </p>

            {/* Contact info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 group cursor-pointer">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5 group-hover:animate-bounce" />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  ১২৩, মেইন রোড, শহর, জেলা, বাংলাদেশ
                </span>
              </div>
              <div className="flex items-center gap-3 group">
                <Phone className="w-4 h-4 text-blue-500 flex-shrink-0 group-hover:rotate-12 transition-transform" />
                <a href="tel:+8801XXXXXXXXX" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  +880 1XXX-XXXXXX
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0 group-hover:-rotate-12 transition-transform" />
                <a href="mailto:info@educore.com.bd" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  info@educore.com.bd
                </a>
              </div>
              <div className="flex items-start gap-3 group cursor-pointer">
                <Clock className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5 group-hover:rotate-90 transition-transform duration-500" />
                <div className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  <p>শনি – বৃহস্পতি</p>
                  <p>সকাল ৮টা – রাত ৯টা</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 font-semibold text-sm mb-6 uppercase tracking-wider">দ্রুত লিংক</h4>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-blue-500 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-slate-900 font-semibold text-sm mb-6 uppercase tracking-wider">কোর্সসমূহ</h4>
            <ul className="space-y-3.5">
              {courseLinks.map((course) => (
                <li key={course}>
                  <a
                    href="#courses"
                    className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-blue-500 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{course}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Shifts & Social */}
          <div>
            <h4 className="text-slate-900 font-semibold text-sm mb-6 uppercase tracking-wider">ক্লাসের শিফট</h4>
            <ul className="space-y-3 mb-8">
              {shifts.map((s) => (
                <li key={s.label} className="flex items-center justify-between text-sm group">
                  <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{s.label}</span>
                  <span className="text-blue-700 text-xs font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-200 transition-colors">{s.time}</span>
                </li>
              ))}
            </ul>

            <h4 className="text-slate-900 font-semibold text-sm mb-4 uppercase tracking-wider">সোশ্যাল মিডিয়া</h4>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm rounded-xl flex items-center justify-center transition-all group"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-50 border border-slate-200 hover:border-red-300 hover:bg-red-50 hover:shadow-sm rounded-xl flex items-center justify-center transition-all group"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4 text-slate-500 group-hover:text-red-600 transition-colors" />
              </a>
              <a
                href="https://wa.me/8801XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-sm rounded-xl flex items-center justify-center transition-all group"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-slate-500 group-hover:text-emerald-600 transition-colors" />
              </a>
            </div>

            {/* Google Map embed placeholder */}
            <div className="mt-8 rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-50 flex items-center justify-center group hover:border-slate-300 transition-colors cursor-pointer relative">
              <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-center relative z-10">
                <MapPin className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mx-auto mb-1.5 transition-colors" />
                <p className="text-xs text-slate-500 group-hover:text-slate-600">Google Map</p>
                <p className="text-[10px] text-slate-400">এখানে embed করুন</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} <span className="text-slate-900 font-medium">EduCore</span> IT Training Center. সকল অধিকার সংরক্ষিত।
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-500 font-medium">
            <a href="#" className="hover:text-blue-600 transition-colors">গোপনীয়তা নীতি</a>
            <span className="text-slate-300">|</span>
            <a href="#" className="hover:text-blue-600 transition-colors">শর্তাবলী</a>
            <span className="text-slate-300">|</span>
            <a href="#" className="hover:text-blue-600 transition-colors">রিফান্ড নীতি</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
