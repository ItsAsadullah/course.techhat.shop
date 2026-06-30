
"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase-browser"
import { motion } from "framer-motion"

const supabase = createBrowserClient()

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

  // Validation
  const validate = () => {
    const err: typeof errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email.trim()) err.email = "ইমেইল লিখুন"
    else if (!emailRegex.test(email)) err.email = "সঠিক ইমেইল ফরম্যাট দিন"

    if (!password) err.password = "পাসওয়ার্ড লিখুন"
    else if (password.length < 6) err.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"

    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErrors({})

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => router.push("/"), 1500)
    } catch (err: any) {
      setErrors({ general: err.message || "লগইন ব্যর্থ হয়েছে" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl w-full">
        <button
          onClick={() => router.push("/")}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">হোম পেজে ফিরে যান</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden"
        >
          <div className="grid md:grid-cols-2">
            {/* Left: Illustration & Info */}
            <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-600 to-cyan-600 p-8 text-white relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-400/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />

              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-2">স্বাগতম!</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  TechHat-এ সाइन ইন করে আপনার শেখার যাত্রা শুরু করুন।
                </p>
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">সুরক্ষিত অ্যাকাউন্ট</p>
                    <p className="text-blue-100 text-xs mt-1">256-bit SSL এনক্রিপশন দিয়ে সুরক্ষিত</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">দ্রুত অ্যাক্সেস</p>
                    <p className="text-blue-100 text-xs mt-1">সব ডিভাইসে একক অ্যাকাউন্ট</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="p-8 sm:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">লগইন করুন</h2>
                <p className="text-slate-600 text-sm">আপনার অ্যাকাউন্টে সাইন ইন করুন</p>
              </div>

              {errors.general && (
                <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              {success && (
                <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>লগইন সফল! হোম পেজে যাচ্ছেন...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">ইমেইল ঠিকানা *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 text-sm border rounded-xl outline-none transition-all duration-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm ${
                        errors.email
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50"
                          : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">পাসওয়ার্ড *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-11 pr-12 py-3 text-sm border rounded-xl outline-none transition-all duration-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm ${
                        errors.password
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50"
                          : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-[15px]"
                >
                  <span className="absolute inset-0 w-full h-full -ml-10 bg-white/20 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative flex items-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        লগইন হচ্ছে...
                      </>
                    ) : (
                      "লগইন করুন"
                    )}
                  </span>
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-slate-600 text-xs">
                  অ্যাকাউন্ট নেই?{" "}
                  <button onClick={() => router.push("/register")} className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                    রেজিস্ট্রেশন করুন
                  </button>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
