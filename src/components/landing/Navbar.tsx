"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, GraduationCap, Phone, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { href: "/#features", label: "কেন আমরা?" },
  { id: "enroll-steps", label: "ভর্তি প্রক্রিয়া" },
  { href: "/#testimonials", label: "শিক্ষার্থীদের মতামত" },
  { href: "/#contact", label: "যোগাযোগ" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false)

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
        className={`w-full bg-slate-900/90 backdrop-blur-sm text-slate-200 text-xs text-center hidden md:block transition-all duration-500 origin-top pointer-events-auto ${
          scrolled ? "h-0 opacity-0 overflow-hidden" : "py-1.5 px-4 opacity-100"
        }`}
      >
        <Phone className="inline w-3 h-3 mr-1 text-blue-400" />
        ভর্তি চলছে — এখনই কল করুন: <strong className="text-white">01XXXXXXXXX</strong> &nbsp;|&nbsp; সকাল ৯টা – রাত ৯টা পর্যন্ত খোলা
      </div>

      {/* Floating Glass Nav */}
      <div className={`w-full max-w-6xl transition-all duration-500 pointer-events-auto ${
        scrolled ? "px-4 sm:px-6 pt-4" : "px-0 pt-0"
      }`}>
        <nav 
          className={`relative mx-auto transition-all duration-500 rounded-full px-4 sm:px-6 hover:bg-white/40 hover:backdrop-blur-[40px] hover:border-white/80 hover:shadow-[inset_0_1px_3px_rgba(255,255,255,1),inset_0_-1px_3px_rgba(255,255,255,0.4),0_10px_40px_rgba(0,0,0,0.15)] ${
            scrolled 
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
                <p className="font-bold text-slate-900 text-[17px]">TechHat</p>
                <p className="text-[10px] text-blue-600 font-semibold tracking-wide uppercase">
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
                  কোর্সসমূহ
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

              {navLinks.map((link) => {
                if ('id' in link) {
                  return (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id!)}
                      className="text-slate-700 hover:text-blue-600 text-base font-medium px-4 py-2 rounded-full transition-all duration-150 hover:bg-white/40 hover:backdrop-blur-xl hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.05)] border border-transparent hover:border-white/50"
                    >
                      {link.label}
                    </button>
                  );
                }
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-slate-700 hover:text-blue-600 text-base font-medium px-4 py-2 rounded-full transition-all duration-150 hover:bg-white/40 hover:backdrop-blur-xl hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.05)] border border-transparent hover:border-white/50"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/admin"
                className="text-base text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-full hover:bg-white/50 transition-colors"
              >
                লগইন
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

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-full text-slate-700 hover:bg-slate-100/50 transition-colors"
              aria-label="মেনু"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
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
                  
                  {navLinks.map((link) => {
                    if ('id' in link) {
                      return (
                        <button
                          key={link.id}
                          onClick={() => scrollToSection(link.id!)}
                          className="block w-full text-left px-4 py-3 text-slate-700 text-base font-medium rounded-xl hover:bg-white/50 hover:text-blue-600 transition-colors"
                        >
                          {link.label}
                        </button>
                      );
                    }
                    
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 text-slate-700 text-base font-medium rounded-xl hover:bg-white/50 hover:text-blue-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                  <div className="pt-3 border-t border-slate-200/50 mt-2">
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
