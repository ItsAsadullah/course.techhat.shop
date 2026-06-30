"use client"

import { useState, useEffect } from "react"
import { Menu, X, GraduationCap, Phone, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import NavControls from "@/components/ui/NavControls"
import { useLang } from "@/context/GlobalLangContext"

type NavLink = { id: string; tKey: keyof typeof import("@/context/GlobalLangContext").translations.en } | { href: string; tKey: keyof typeof import("@/context/GlobalLangContext").translations.en };

const navLinks: NavLink[] = [
  { id: "features", tKey: "nav_features" },
  { id: "enroll-steps", tKey: "nav_how" },
  { id: "contact", tKey: "nav_contact" },
]

export default function Navbar() {
  const { t, isBn } = useLang();
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false)
  const [softwareDropdownOpen, setSoftwareDropdownOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
    setCoursesDropdownOpen(false)
    setSoftwareDropdownOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className="fixed top-0 inset-x-0 z-50 flex flex-col items-center pointer-events-none"
    >
      {/* Top bar - Hides on scroll */}
      <div
        className={`w-full bg-slate-900/90 backdrop-blur-sm text-slate-200 text-xs text-center hidden md:block transition-all duration-500 origin-top pointer-events-auto ${scrolled ? "h-0 opacity-0 overflow-hidden" : "py-1.5 px-4 opacity-100"
          }`}
      >
        <Phone className="inline w-3 h-3 mr-1 text-blue-400" />
        ভর্তি চলছে — এখনই কল করুন: <strong className="text-white">01XXXXXXXXX</strong> &nbsp;|&nbsp; সকাল ৯টা – রাত ৯টা পর্যন্ত খোলা
      </div>

      {/* Floating Glass Nav */}
      <div className={`w-full max-w-6xl transition-all duration-500 pointer-events-auto ${scrolled ? "px-4 sm:px-6 pt-4" : "px-0 pt-0"
        }`}>
        <nav
          className={`relative mx-auto transition-all duration-500 rounded-full px-4 sm:px-6 hover:bg-white/40 hover:backdrop-blur-[40px] hover:border-white/80 hover:shadow-[inset_0_1px_3px_rgba(255,255,255,1),inset_0_-1px_3px_rgba(255,255,255,0.4),0_10px_40px_rgba(0,0,0,0.15)] ${scrolled
              ? "bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
              : "bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm mt-2"
            }`}
        >
          {/* Gradient Glow (contained inside) */}
          <div className="absolute inset-0 -z-10 rounded-full overflow-hidden">
            <div className={`absolute inset-0 blur-xl bg-gradient-to-r from-cyan-400/15 via-blue-500/15 to-cyan-300/15 transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"}`} />
          </div>

          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <img src="/logo.png" alt="TechHat Logo" className="w-10 h-10 object-contain drop-shadow-sm group-hover:drop-shadow-[0_0_15px_rgba(14,165,233,0.7)] group-hover:scale-105 transition-all duration-300" />
              <div className="leading-none">
                <p className="font-bold text-slate-900 dark:text-white text-[17px]">TechHat</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">
                  Computer Training Center
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Courses Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                  className="text-slate-700 hover:text-blue-600 text-base font-medium px-4 py-2 rounded-full transition-all duration-150 hover:bg-white/40 hover:backdrop-blur-xl hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.05)] border border-transparent hover:border-white/50 flex items-center gap-1"
                >
                  <span className={isBn ? "font-bn" : ""}>{t("nav_courses")}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${coursesDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {coursesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg py-2 min-w-[180px] z-50">
                    <button
                      onClick={() => scrollToSection("online-courses")}
                      className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors text-base font-medium rounded-xl"
                    >
                      অনলাইন কোর্স
                    </button>
                    <button
                      onClick={() => scrollToSection("offline-courses")}
                      className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors text-base font-medium rounded-xl"
                    >
                      অফলাইন কোর্স
                    </button>
                  </div>
                )}
              </div>

              {/* Software Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setSoftwareDropdownOpen(!softwareDropdownOpen);
                    setCoursesDropdownOpen(false);
                  }}
                  className="text-slate-700 hover:text-blue-600 text-base font-medium px-4 py-2 rounded-full transition-all duration-150 hover:bg-white/40 hover:backdrop-blur-xl hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.05)] border border-transparent hover:border-white/50 flex items-center gap-1"
                >
                  <span className={isBn ? "font-bn" : ""}>{t("nav_software")}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${softwareDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {softwareDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg py-2 min-w-[180px] z-50">
                    <Link
                      href="/software/typing-master"
                      onClick={() => setSoftwareDropdownOpen(false)}
                      className="block w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors text-base font-medium rounded-xl"
                    >
                      Typing Master
                    </Link>
                  </div>
                )}
              </div>

              {navLinks.map((link) => {
                if ('id' in link) {
                  return (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id!)}
                      className={`text-slate-700 hover:text-blue-600 text-base font-medium px-4 py-2 rounded-full transition-all duration-150 hover:bg-white/40 hover:backdrop-blur-xl hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.05)] border border-transparent hover:border-white/50 ${isBn ? "font-bn" : ""}`}
                    >
                      {t(link.tKey as any)}
                    </button>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-slate-700 hover:text-blue-600 text-base font-medium px-4 py-2 rounded-full transition-all duration-150 hover:bg-white/40 hover:backdrop-blur-xl hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.05)] border border-transparent hover:border-white/50 ${isBn ? "font-bn" : ""}`}
                  >
                    {t(link.tKey as any)}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <NavControls />
              <Link
                href="/login"
                className={`text-base text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium px-4 py-2 rounded-full hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors ${isBn ? "font-bn" : ""}`}
              >
                {t("nav_login")}
              </Link>
              <Link
                href="/register"
                className={`text-base text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-semibold px-6 py-2.5 rounded-full transition-all shadow-md ${isBn ? "font-bn" : ""}`}
              >
                {t("nav_register")}
              </Link>
              <Link
                href="/admission"
                className="relative group bg-slate-900 text-white text-base font-semibold px-6 py-2.5 rounded-full overflow-hidden shadow-md"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  ভর্তি হন <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </div>

            {/* Mobile toggle & controls */}
            <div className="flex items-center gap-3 lg:hidden">
              <NavControls />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full text-slate-700 hover:bg-slate-100/50 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-colors"
                aria-label="মেনু"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[calc(100%+0.5rem)] inset-x-0 mx-auto w-full lg:hidden bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden"
              >
                <div className="py-4 px-4 space-y-1">
                  {/* Mobile Courses Links */}
                  <button
                    onClick={() => scrollToSection("online-courses")}
                    className="block w-full text-left px-4 py-3 text-slate-700 text-base font-medium rounded-xl hover:bg-white/50 hover:text-blue-600 transition-colors"
                  >
                    অনলাইন কোর্স
                  </button>
                  <button
                    onClick={() => scrollToSection("offline-courses")}
                    className="block w-full text-left px-4 py-3 text-slate-700 text-base font-medium rounded-xl hover:bg-white/50 hover:text-blue-600 transition-colors"
                  >
                    অফলাইন কোর্স
                  </button>
                  
                  {/* Mobile Software Links */}
                  <Link
                    href="/software/typing-master"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-left px-4 py-3 text-slate-700 text-base font-medium rounded-xl hover:bg-white/50 hover:text-blue-600 transition-colors"
                  >
                    Typing Master
                  </Link>

                  {navLinks.map((link) => {
                    if ('id' in link) {
                      return (
                        <button
                          key={link.id}
                          onClick={() => scrollToSection(link.id!)}
                          className={`block w-full text-left px-4 py-3 text-slate-700 text-base font-medium rounded-xl hover:bg-white/50 hover:text-blue-600 transition-colors ${isBn ? "font-bn" : ""}`}
                        >
                          {t(link.tKey as any)}
                        </button>
                      );
                    }

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-3 text-slate-700 text-base font-medium rounded-xl hover:bg-white/50 hover:text-blue-600 transition-colors ${isBn ? "font-bn" : ""}`}
                      >
                        {t(link.tKey as any)}
                      </Link>
                    );
                  })}
                  <div className="pt-3 border-t border-slate-200/50 mt-2 space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className={`block w-full bg-white/50 text-slate-700 text-center text-base font-semibold px-4 py-3 rounded-2xl border border-slate-200 shadow-sm ${isBn ? "font-bn" : ""}`}
                    >
                      {t("nav_login")}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className={`block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center text-base font-semibold px-4 py-3 rounded-2xl shadow-md ${isBn ? "font-bn" : ""}`}
                    >
                      {t("nav_register")}
                    </Link>
                    <Link
                      href="/admission"
                      onClick={() => setIsOpen(false)}
                      className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center text-base font-semibold px-4 py-3.5 rounded-2xl shadow-md"
                    >
                      এখনই ভর্তি হন →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </motion.header>
  )
}
