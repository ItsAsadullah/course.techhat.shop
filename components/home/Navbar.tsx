"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, Phone, ChevronDown, User, Sparkles, ArrowRight, LogOut, Settings, LayoutDashboard } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import NavControls from "@/components/ui/NavControls"
import { useLang } from "@/context/GlobalLangContext"
import { createClient } from "@/lib/admin/supabase/client"
import { User as SupabaseUser } from "@supabase/supabase-js"

type NavLink = { id: string; tKey: keyof typeof import("@/context/GlobalLangContext").translations.en } | { href: string; tKey: keyof typeof import("@/context/GlobalLangContext").translations.en };

const navLinks: NavLink[] = [
  { id: "features", tKey: "nav_features" },
  { id: "enroll-steps", tKey: "nav_how" },
  { id: "contact", tKey: "nav_contact" },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { t, isBn } = useLang();
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false)
  const [softwareDropdownOpen, setSoftwareDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const isHome = pathname === "/"
  const isCoursesPage = pathname?.startsWith("/courses")
  const isSoftwarePage = pathname?.startsWith("/software")
  const isCheckoutPage = pathname?.startsWith("/checkout")

  useEffect(() => {
    const supabase = createClient()
    
    const fetchAvatar = async (u: SupabaseUser | null) => {
      if (!u) {
        setAvatarUrl(null)
        setUserLoading(false)
        return
      }

      let currentAvatar = u.user_metadata?.avatar_url || u.user_metadata?.picture || null
      
      if (!currentAvatar && u.user_metadata?.student_id) {
        try {
          const { data } = await supabase
            .from('student_documents')
            .select('file_url')
            .eq('student_id', u.user_metadata.student_id)
            .eq('document_type', 'photo')
            .single()
            
          if (data?.file_url) {
            currentAvatar = data.file_url
          }
        } catch (e) {
          console.error("Failed to fetch avatar", e)
        }
      }
      
      setAvatarUrl(currentAvatar)
      setUserLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      fetchAvatar(session?.user ?? null)
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      fetchAvatar(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const scrollToSection = (id: string) => {
    setIsOpen(false)
    setCoursesDropdownOpen(false)
    setSoftwareDropdownOpen(false)
    setUserDropdownOpen(false)

    if (pathname !== "/") {
      router.push("/#" + id)
      return
    }

    // Update URL hash without causing a page jump
    window.history.pushState(null, "", "/#" + id)

    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className="fixed top-0 inset-x-0 z-50 flex flex-col items-center pointer-events-none"
    >
      {/* Top bar */}
      {!isCheckoutPage && (
        <div
          className={`w-full text-xs text-center hidden md:block transition-all duration-500 origin-top pointer-events-auto bg-white/60 dark:bg-slate-950/60 backdrop-blur-3xl ${scrolled ? "h-0 opacity-0 overflow-hidden" : "py-2 opacity-100"}`}
        >
          <div className="mx-auto max-w-[1440px] px-4 flex justify-center items-center gap-2 text-slate-600 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span className={isBn ? "font-bn" : ""}>{t("nav_register" as any)}</span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
            <Phone className="hidden sm:inline w-3 h-3 text-cyan-500" />
            <span className="hidden sm:inline">{t("nav_contact" as any)} <strong className="text-slate-900 dark:text-white">01XXXXXXXXX</strong></span>
            <span className="hidden lg:inline text-slate-400 dark:text-slate-600">• 8:00 AM - 9:00 PM</span>
          </div>
        </div>
      )}

      {/* Main Nav */}
      <div className="w-full transition-all duration-500 pointer-events-auto">
        <nav
          className={`relative w-full transition-all duration-500 ${scrolled
              ? "bg-white/70 dark:bg-slate-950/70 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
              : "bg-white/60 dark:bg-slate-950/60 backdrop-blur-3xl"
            }`}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className={`absolute -top-24 right-0 h-40 w-40 rounded-full blur-3xl bg-cyan-400/10 transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-60"}`} />
          </div>

          <div className="relative z-10 flex items-center justify-between h-16 md:h-18 max-w-[1440px] mx-auto px-4 sm:px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-[1px] shadow-[0_10px_30px_rgba(14,165,233,0.22)]">
                <div className="w-full h-full rounded-[15px] bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="TechHat Logo" className="w-8 h-8 object-contain" />
                </div>
              </div>
              <div className="leading-none">
                <p className="font-bold text-slate-900 dark:text-white text-[16px] md:text-[17px] tracking-tight">TechHat</p>
                <p className="text-[10px] md:text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold tracking-[0.18em] uppercase">
                  Computer Training Center
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden xl:flex items-center gap-1.5">
              {/* Courses Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setCoursesDropdownOpen(!coursesDropdownOpen);
                    setSoftwareDropdownOpen(false);
                    setUserDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-medium transition-all duration-200 border ${isCoursesPage
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white/60 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900"
                    }`}
                >
                  <span className={isBn ? "font-bn" : ""}>{t("nav_courses")}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${coursesDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {coursesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.14)] py-2.5 min-w-[220px] z-50 overflow-hidden">
                    <Link
                      href="/courses?type=online"
                      onClick={() => setCoursesDropdownOpen(false)}
                      className={`block w-full text-left px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-cyan-600 transition-colors text-sm font-medium ${isBn ? "font-bn" : ""}`}
                    >
                      {t("courses_online_sub")}
                    </Link>
                    <Link
                      href="/courses?type=offline"
                      onClick={() => setCoursesDropdownOpen(false)}
                      className={`block w-full text-left px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-cyan-600 transition-colors text-sm font-medium ${isBn ? "font-bn" : ""}`}
                    >
                      {t("courses_offline_sub")}
                    </Link>
                  </div>
                )}
              </div>

              {/* Software Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setSoftwareDropdownOpen(!softwareDropdownOpen);
                    setCoursesDropdownOpen(false);
                    setUserDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-medium transition-all duration-200 border ${isSoftwarePage
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white/60 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900"
                    }`}
                >
                  <span className={isBn ? "font-bn" : ""}>{t("nav_software")}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${softwareDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {softwareDropdownOpen && (
                  <div className="absolute top-full left-0 mt-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.14)] py-2.5 min-w-[220px] z-50 overflow-hidden">
                    <Link
                      href="https://typing.techhat.shop"
                      onClick={() => setSoftwareDropdownOpen(false)}
                      className="block w-full text-left px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-cyan-600 transition-colors text-sm font-medium"
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
                      className={`rounded-full px-4 py-2 text-[14px] font-medium transition-all duration-200 border ${pathname === "/" ? "text-slate-700 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"} hover:bg-slate-900 hover:text-white hover:border-slate-900 border-transparent ${isBn ? "font-bn" : ""}`}
                    >
                      {t(link.tKey as any)}
                    </button>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-[14px] font-medium transition-all duration-200 border ${pathname === link.href ? "bg-slate-900 text-white border-slate-900" : "text-slate-700 dark:text-slate-200 border-transparent hover:bg-slate-900 hover:text-white hover:border-slate-900"} ${isBn ? "font-bn" : ""}`}
                  >
                    {t(link.tKey as any)}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden xl:flex items-center gap-2">
              <NavControls />
              {userLoading ? (
                <div className="w-16 h-9 animate-pulse bg-slate-200 dark:bg-slate-700/50 rounded-full mx-1" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setCoursesDropdownOpen(false);
                      setSoftwareDropdownOpen(false);
                    }}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-slate-200 dark:border-slate-700"
                    title={user.user_metadata?.full_name || "User Menu"}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[16px] font-bold text-slate-500 dark:text-slate-400">
                        {(user.user_metadata?.full_name || user.email || "U").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.14)] py-2.5 min-w-[220px] z-50 overflow-hidden"
                      >
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/60 mb-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {user.user_metadata?.full_name || "User"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          href={user.user_metadata?.role === "admin" ? "/admin" : "/dashboard"}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-cyan-600 transition-colors text-sm font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href={user.user_metadata?.role === "admin" ? "/admin/settings" : "/dashboard/settings"}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-cyan-600 transition-colors text-sm font-medium"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`rounded-full px-4 py-2 text-[14px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors ${isBn ? "font-bn" : ""}`}
                  >
                    {t("nav_login")}
                  </Link>
                  <Link
                    href="/admissions"
                    className={`group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-sm ${isBn ? "font-bn" : ""}`}
                  >
                    {t("course_enroll")} <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle & controls */}
            <div className="flex items-center gap-3 xl:hidden">
              <NavControls />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-200 shadow-sm"
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
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                  className="absolute top-full inset-x-0 w-full xl:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden"
              >
                  <div className="py-4 px-4 space-y-1.5 max-w-[1440px] mx-auto">
                  {/* Mobile Courses Links */}
                  <Link
                    href="/courses?type=online"
                    onClick={() => setIsOpen(false)}
                    className={`block w-full text-left px-4 py-3 text-slate-700 dark:text-slate-200 text-base font-medium rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-cyan-600 transition-colors ${isBn ? "font-bn" : ""}`}
                  >
                    {t("courses_online_sub")}
                  </Link>
                  <Link
                    href="/courses?type=offline"
                    onClick={() => setIsOpen(false)}
                    className={`block w-full text-left px-4 py-3 text-slate-700 dark:text-slate-200 text-base font-medium rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-cyan-600 transition-colors ${isBn ? "font-bn" : ""}`}
                  >
                    {t("courses_offline_sub")}
                  </Link>
                  
                  {/* Mobile Software Links */}
                  <Link
                    href="/software/typing-master"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-left px-4 py-3 text-slate-700 dark:text-slate-200 text-base font-medium rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-cyan-600 transition-colors"
                  >
                    Typing Master
                  </Link>

                  {navLinks.map((link) => {
                    if ('id' in link) {
                      return (
                        <button
                          key={link.id}
                          onClick={() => scrollToSection(link.id!)}
                          className={`block w-full text-left px-4 py-3 text-slate-700 dark:text-slate-200 text-base font-medium rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-cyan-600 transition-colors ${isBn ? "font-bn" : ""}`}
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
                        className={`block px-4 py-3 text-slate-700 dark:text-slate-200 text-base font-medium rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-cyan-600 transition-colors ${isBn ? "font-bn" : ""}`}
                      >
                        {t(link.tKey as any)}
                      </Link>
                    );
                  })}
                  <div className="pt-3 border-t border-slate-200/50 mt-2 space-y-2">
                    {userLoading ? (
                      <div className="w-full h-[46px] animate-pulse bg-slate-200 dark:bg-slate-700/50 rounded-2xl" />
                    ) : user ? (
                      <>
                        <div className="flex items-center gap-3 px-4 py-2 mb-2 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[16px] font-bold text-slate-500 dark:text-slate-400">
                                {(user.user_metadata?.full_name || user.email || "U").charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {user.user_metadata?.full_name || "User"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={user.user_metadata?.role === "admin" ? "/admin" : "/dashboard"}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 w-full text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-cyan-600 transition-colors text-base font-medium px-4 py-3 rounded-2xl"
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          Dashboard
                        </Link>
                        <Link
                          href={user.user_metadata?.role === "admin" ? "/admin/settings" : "/dashboard/settings"}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 w-full text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-cyan-600 transition-colors text-base font-medium px-4 py-3 rounded-2xl"
                        >
                          <Settings className="w-5 h-5" />
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-2 w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-base font-medium px-4 py-3 rounded-2xl"
                        >
                          <LogOut className="w-5 h-5" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setIsOpen(false)}
                          className={`block w-full bg-white dark:bg-slate-900 text-slate-700 dark:text-white text-center text-base font-semibold px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm ${isBn ? "font-bn" : ""}`}
                        >
                          {t("nav_login")}
                        </Link>
                        <Link
                          href="/admissions"
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-center gap-2 w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center text-base font-semibold px-4 py-3.5 rounded-2xl shadow-md ${isBn ? "font-bn" : ""}`}
                        >
                          {t("course_enroll")} <ArrowRight className="w-4 h-4" />
                        </Link>
                      </>
                    )}
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
