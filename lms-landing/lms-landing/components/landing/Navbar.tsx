"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, GraduationCap, Phone } from "lucide-react"

const navLinks = [
  { href: "#courses", label: "কোর্সসমূহ" },
  { href: "#features", label: "কেন আমরা?" },
  { href: "#admission", label: "ভর্তি প্রক্রিয়া" },
  { href: "#testimonials", label: "শিক্ষার্থীদের মতামত" },
  { href: "#contact", label: "যোগাযোগ" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
          : "bg-transparent"
      }`}
    >
      {/* Top bar */}
      <div className="bg-indigo-600 text-white text-xs py-1.5 px-4 text-center hidden md:block">
        <Phone className="inline w-3 h-3 mr-1" />
        ভর্তি চলছে — এখনই কল করুন: <strong>01XXXXXXXXX</strong> &nbsp;|&nbsp; সকাল ৯টা – রাত ৯টা পর্যন্ত খোলা
      </div>

      <nav className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-indigo-700 transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <p className="font-bold text-slate-900 text-[17px]">EduCore</p>
              <p className="text-[10px] text-indigo-600 font-semibold tracking-wide uppercase">
                IT Training Center
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-200 rounded" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/admin"
              className="text-sm text-slate-600 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              অ্যাডমিন লগইন
            </Link>
            <Link
              href="#admission"
              className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              এখনই ভর্তি হন →
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="মেনু"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white py-4 px-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 text-slate-700 text-sm font-medium rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 mt-2">
              <Link
                href="#admission"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-indigo-600 text-white text-center text-sm font-semibold px-4 py-3 rounded-xl"
              >
                এখনই ভর্তি হন →
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
