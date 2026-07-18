"use client"

import Link from "next/link"
import { GraduationCap, MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"
import { useLang } from "@/context/GlobalLangContext"

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
)

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
)

const getQuickLinks = (isBn: boolean) => [
  { href: "/#courses", label: isBn ? "কোর্সসমূহ" : "Courses" },
  { href: "/#features", label: isBn ? "কেন আমরা?" : "Why Us?" },
  { href: "/admissions", label: isBn ? "ভর্তি ফর্ম" : "Admission Form" },
  { href: "/#testimonials", label: isBn ? "শিক্ষার্থীদের মতামত" : "Student Reviews" },
  { href: "/admin", label: isBn ? "অ্যাডমিন প্যানেল" : "Admin Panel" },
]

const getCourseLinks = (isBn: boolean) => [
  isBn ? "মাইক্রোসফট অফিস" : "Microsoft Office",
  isBn ? "গ্রাফিক ডিজাইন" : "Graphic Design",
  isBn ? "ওয়েব ডেভেলপমেন্ট" : "Web Development",
  isBn ? "ডিজিটাল মার্কেটিং" : "Digital Marketing",
  isBn ? "ভিডিও এডিটিং" : "Video Editing",
  isBn ? "Python প্রোগ্রামিং" : "Python Programming",
]

const getShifts = (isBn: boolean) => [
  { label: isBn ? "সকাল শিফট" : "Morning Shift", time: isBn ? "৮:০০ – ১০:০০ AM" : "8:00 – 10:00 AM" },
  { label: isBn ? "দুপুর শিফট" : "Noon Shift", time: isBn ? "১০:০০ – ১২:০০ PM" : "10:00 – 12:00 PM" },
  { label: isBn ? "বিকাল শিফট" : "Afternoon Shift", time: isBn ? "২:০০ – ৪:০০ PM" : "2:00 – 4:00 PM" },
  { label: isBn ? "সন্ধ্যা শিফট" : "Evening Shift", time: isBn ? "৫:০০ – ৭:০০ PM" : "5:00 – 7:00 PM" },
  { label: isBn ? "রাত শিফট" : "Night Shift", time: isBn ? "৭:০০ – ৯:০০ PM" : "7:00 – 9:00 PM" },
]

export default function Footer() {
  const { t, isBn } = useLang();
  
  const quickLinks = getQuickLinks(isBn);
  const courseLinks = getCourseLinks(isBn);
  const shifts = getShifts(isBn);

  return (
    <footer id="contact" className={`bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 relative border-t border-slate-100 dark:border-slate-800 overflow-hidden ${isBn ? "font-bn" : ""}`}>
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
      <div className="absolute -bottom-20 left-0 w-64 h-64 bg-cyan-50 dark:bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-10 h-10 bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-blue-800 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-[18px] leading-none tracking-wide group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">EduCore</p>
                <p className="text-[10px] text-blue-500 dark:text-blue-400 font-semibold tracking-widest uppercase mt-0.5">IT Training Center</p>
              </div>
            </Link>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-7">
              {t("ft_desc")}
            </p>

            {/* Contact info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 group cursor-pointer">
                <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5 group-hover:animate-bounce" />
                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {t("ft_addr")}
                </span>
              </div>
              <div className="flex items-center gap-3 group">
                <Phone className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0 group-hover:rotate-12 transition-transform" />
                <a href="tel:+8801XXXXXXXXX" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  +880 1XXX-XXXXXX
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <Mail className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0 group-hover:-rotate-12 transition-transform" />
                <a href="mailto:info@educore.com.bd" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  info@educore.com.bd
                </a>
              </div>
              <div className="flex items-start gap-3 group cursor-pointer">
                <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5 group-hover:rotate-90 transition-transform duration-500" />
                <div className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  <p>{t("ft_days")}</p>
                  <p>{t("ft_hours")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-6 uppercase tracking-wider">{t("ft_ql")}</h4>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full group-hover:bg-blue-500 dark:group-hover:bg-blue-400 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-6 uppercase tracking-wider">{t("nav_courses")}</h4>
            <ul className="space-y-3.5">
              {courseLinks.map((course) => (
                <li key={course}>
                  <a
                    href="#courses"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full group-hover:bg-blue-500 dark:group-hover:bg-blue-400 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{course}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Shifts & Social */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-6 uppercase tracking-wider">{t("ft_cs")}</h4>
            <ul className="space-y-3 mb-8">
              {shifts.map((s) => (
                <li key={s.label} className="flex items-center justify-between text-sm group">
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{s.label}</span>
                  <span className="text-blue-700 dark:text-blue-300 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 transition-colors">{s.time}</span>
                </li>
              ))}
            </ul>

            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-4 uppercase tracking-wider">{t("ft_sm")}</h4>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:shadow-sm rounded-xl flex items-center justify-center transition-all group"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 hover:shadow-sm rounded-xl flex items-center justify-center transition-all group"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
              </a>
              <a
                href="https://wa.me/8801XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:shadow-sm rounded-xl flex items-center justify-center transition-all group"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              </a>
            </div>

            {/* Google Map embed placeholder */}
            <div className="mt-8 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-28 bg-slate-50 dark:bg-slate-900 flex items-center justify-center group hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer relative">
              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-center relative z-10">
                <MapPin className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 mx-auto mb-1.5 transition-colors" />
                <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">Google Map</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">{t("ft_embed")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 dark:text-slate-400 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} <span className="text-slate-900 dark:text-white font-medium">EduCore</span> IT Training Center. {t("ft_rights")}
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t("ft_privacy")}</a>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t("ft_terms")}</a>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t("ft_refund")}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
