"use client"

import { useState } from "react"
import {
  User, Phone, Mail, MapPin, BookOpen,
  Clock, GraduationCap, ChevronDown, CheckCircle,
  Loader2, AlertCircle, Eye, EyeOff, Lock, ArrowRight,
  ShieldCheck, Sparkles
} from "lucide-react"
import Link from "next/link"

const courses = [
  "মাইক্রোসফট অফিস (Basic)",
  "মাইক্রোসফট অফিস (Advanced)",
  "গ্রাফিক ডিজাইন",
  "ওয়েব ডেভেলপমেন্ট",
  "ডিজিটাল মার্কেটিং",
  "ভিডিও এডিটিং",
  "একাউন্টিং সফটওয়্যার (Tally)",
  "Python প্রোগ্রামিং",
  "ফ্রিল্যান্সিং মাস্টারক্লাস",
  "অন্যান্য (ফোনে জানাবো)",
]

const shifts = [
  { id: "morning", label: "সকাল", time: "৮:০০ - ১০:০০ AM" },
  { id: "noon", label: "দুপুর", time: "১০:০০ - ১২:০০ PM" },
  { id: "afternoon", label: "বিকাল", time: "২:০০ - ৪:০০ PM" },
  { id: "evening", label: "সন্ধ্যা", time: "৫:০০ - ৭:০০ PM" },
  { id: "night", label: "রাত", time: "৭:০০ - ৯:০০ PM" },
]

type FormData = {
  fullName: string
  fatherName: string
  phone: string
  email: string
  address: string
  course: string
  shift: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

type FieldErrors = Partial<Record<keyof FormData, string>>

const initial: FormData = {
  fullName: "", fatherName: "", phone: "",
  email: "", address: "", course: "", shift: "",
  password: "", confirmPassword: "", agreeTerms: false,
}

type Status = "idle" | "loading" | "success" | "error"

export default function PublicAdmissionForm() {
  const [form, setForm] = useState<FormData>(initial)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }))

  const validate = (): boolean => {
    const err: FieldErrors = {}
    if (!form.fullName.trim()) err.fullName = "নাম লিখুন"
    if (!form.fatherName.trim()) err.fatherName = "পিতার নাম লিখুন"
    if (!form.phone.trim() || !/^01[3-9]\d{8}$/.test(form.phone)) err.phone = "সঠিক মোবাইল নম্বর লিখুন (01XXXXXXXXX)"
    if (!form.address.trim()) err.address = "ঠিকানা লিখুন"
    if (!form.course) err.course = "কোর্স নির্বাচন করুন"
    if (!form.shift) err.shift = "শিফট নির্বাচন করুন"
    if (!form.password || form.password.length < 6) err.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"
    if (form.password !== form.confirmPassword) err.confirmPassword = "পাসওয়ার্ড মিলছে না"
    if (!form.agreeTerms) err.agreeTerms = "শর্ত মেনে নিন"
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus("loading")
    setErrorMessage("")
    try {
      const res = await fetch("/api/public/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          fatherName: form.fatherName,
          phone: form.phone,
          email: form.email,
          address: form.address,
          course: form.course,
          shift: form.shift,
          password: form.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMessage(data.error || "কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।")
        setStatus("error")
        return
      }
      setStatus("success")
    } catch (err) {
      console.error("[PUBLIC_ADMISSION]", err)
      setErrorMessage("সার্ভার সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
        <div className="bg-white rounded-3xl p-10 border border-emerald-200 shadow-2xl relative overflow-hidden max-w-md w-full text-center">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-100 rounded-full blur-[50px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-100 rounded-full blur-[50px] pointer-events-none" />
          <div className="relative z-10">
            <div className="w-24 h-24 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">ভর্তির আবেদন সফল! 🎉</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              আপনার আবেদন সফলভাবে জমা হয়েছে। আপনার মোবাইল নম্বর এবং তৈরি করা পাসওয়ার্ড দিয়ে লগইন করতে পারবেন।
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-sm mb-6">
              <p className="text-slate-700"><span className="font-semibold text-blue-600 mr-2">নাম:</span>{form.fullName}</p>
              <p className="text-slate-700 mt-2"><span className="font-semibold text-blue-600 mr-2">কোর্স:</span>{form.course}</p>
              <p className="text-slate-700 mt-2"><span className="font-semibold text-blue-600 mr-2">মোবাইল:</span>{form.phone}</p>
              <p className="text-slate-700 mt-2"><span className="font-semibold text-blue-600 mr-2">শিফট:</span>{shifts.find(s => s.id === form.shift)?.label}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-200"
              >
                লগইন করুন <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => { setForm(initial); setStatus("idle") }}
                className="text-slate-500 font-medium text-sm hover:text-slate-700 transition-colors py-2"
              >
                আরেকটি আবেদন করুন →
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 pb-20">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            ভর্তি চলছে
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-bn">
            আজই ভর্তির আবেদন করুন
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto font-bn">
            নিচের ফর্মটি পূরণ করুন। আমাদের প্রতিনিধি ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবেন।
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24 shadow-lg overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100 rounded-full blur-[40px] pointer-events-none opacity-60" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 rounded-full blur-[40px] pointer-events-none opacity-60" />
              <h3 className="font-bold text-slate-900 text-lg mb-5 relative z-10 font-bn">ভর্তি তথ্য</h3>
              <div className="space-y-5 relative z-10">
                {[
                  { icon: BookOpen, color: "blue", title: "কোর্স ফি", lines: ["ভর্তি ফি: ৫০০ টাকা (একবার)", "মাসিক বেতন: কোর্স ভেদে ভিন্ন"] },
                  { icon: Clock, color: "indigo", title: "ক্লাসের সময়", lines: ["সপ্তাহে ৬ দিন (শুক্রবার বন্ধ)", "প্রতিটি শিফট ২ ঘণ্টা"] },
                  { icon: GraduationCap, color: "emerald", title: "সার্টিফিকেট", lines: ["সরকার অনুমোদিত সার্টিফিকেট", "কোর্স সম্পন্নের পর প্রদান"] },
                  { icon: Phone, color: "purple", title: "যোগাযোগ", lines: ["01XXXXXXXXX", "সকাল ৯টা – রাত ৯টা"] },
                ].map(({ icon: Icon, color, title, lines }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className={`w-9 h-9 bg-${color}-50 border border-${color}-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon className={`w-4 h-4 text-${color}-600`} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm font-bn">{title}</p>
                      {lines.map(l => <p key={l} className="text-slate-500 text-xs mt-0.5 font-bn">{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <p className="text-sm font-semibold text-slate-800 font-bn">অ্যাকাউন্ট তৈরি হবে</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-bn">
                  ভর্তির আবেদনের সাথে স্বয়ংক্রিয়ভাবে আপনার একটি অনলাইন অ্যাকাউন্ট তৈরি হবে। মোবাইল নম্বর এবং পাসওয়ার্ড দিয়ে লগইন করে কোর্স ম্যাটেরিয়াল, পরীক্ষা, ও সার্টিফিকেট দেখতে পারবেন।
                </p>
              </div>

              <div className="mt-5 relative z-10">
                <p className="text-xs text-amber-800 leading-relaxed bg-amber-50 border border-amber-200 p-3 rounded-xl font-bn">
                  📌 <strong className="text-amber-700">জরুরি:</strong> ভর্তির সময় ১ কপি পাসপোর্ট সাইজ ছবি ও জন্ম সনদ/NID এর ফটোকপি প্রয়োজন।
                </p>
              </div>

              <div className="mt-5 text-center relative z-10">
                <p className="text-xs text-slate-400 font-bn">আগে থেকে অ্যাকাউন্ট আছে?</p>
                <Link href="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors font-bn">
                  লগইন করুন →
                </Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8 space-y-7">
                {status === "error" && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="font-bn">{errorMessage}</span>
                  </div>
                )}

                {/* Personal Info */}
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-5 pb-3 border-b border-slate-100 flex items-center gap-2 font-bn">
                    <User className="w-4 h-4 text-blue-600" />
                    ব্যক্তিগত তথ্য
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="শিক্ষার্থীর নাম *" error={errors.fullName}>
                      <input
                        type="text"
                        placeholder="পূর্ণ নাম লিখুন"
                        value={form.fullName}
                        onChange={set("fullName")}
                        className={inputCls(errors.fullName)}
                      />
                    </Field>
                    <Field label="পিতার নাম *" error={errors.fatherName}>
                      <input
                        type="text"
                        placeholder="পিতার পূর্ণ নাম"
                        value={form.fatherName}
                        onChange={set("fatherName")}
                        className={inputCls(errors.fatherName)}
                      />
                    </Field>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-5 pb-3 border-b border-slate-100 flex items-center gap-2 font-bn">
                    <Phone className="w-4 h-4 text-blue-600" />
                    যোগাযোগ তথ্য
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="মোবাইল নম্বর *" error={errors.phone}>
                      <div className={`flex rounded-xl overflow-hidden border ${errors.phone ? "border-red-300 focus-within:ring-2 focus-within:ring-red-500/20" : "border-slate-300 focus-within:ring-2 focus-within:ring-blue-500/20 hover:border-slate-400"} transition-all shadow-sm`}>
                        <span className="flex items-center px-3 bg-slate-50 border-r border-slate-300 text-slate-500 text-sm font-medium shrink-0">+880</span>
                        <input
                          type="tel"
                          placeholder="01XXXXXXXXX"
                          value={form.phone}
                          onChange={set("phone")}
                          className="w-full px-3 py-2.5 text-sm outline-none bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    </Field>
                    <Field label="ইমেইল (ঐচ্ছিক)">
                      <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={form.email}
                        onChange={set("email")}
                        className={inputCls()}
                      />
                    </Field>
                    <Field label="ঠিকানা *" error={errors.address} className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="গ্রাম/মহল্লা, থানা, জেলা"
                        value={form.address}
                        onChange={set("address")}
                        className={inputCls(errors.address)}
                      />
                    </Field>
                  </div>
                </div>

                {/* Course & Shift */}
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-5 pb-3 border-b border-slate-100 flex items-center gap-2 font-bn">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    কোর্স ও শিফট
                  </h4>
                  <div className="space-y-5">
                    <Field label="কোর্স নির্বাচন করুন *" error={errors.course}>
                      <div className="relative">
                        <select
                          value={form.course}
                          onChange={set("course")}
                          className={`${inputCls(errors.course)} appearance-none pr-10 cursor-pointer font-bn`}
                        >
                          <option value="">-- কোর্স বেছে নিন --</option>
                          {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </Field>

                    <Field label="পছন্দের শিফট *" error={errors.shift}>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mt-1">
                        {shifts.map((s) => (
                          <label
                            key={s.id}
                            className={`flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center ${
                              form.shift === s.id
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50 text-slate-600"
                            }`}
                          >
                            <input type="radio" name="shift" value={s.id} checked={form.shift === s.id} onChange={set("shift")} className="sr-only" />
                            <span className="font-semibold text-xs sm:text-sm font-bn">{s.label}</span>
                            <span className="text-[9px] sm:text-[10px] mt-1 opacity-70 font-bn">{s.time}</span>
                          </label>
                        ))}
                      </div>
                      {errors.shift && <p className="text-red-400 text-xs mt-2 flex items-center gap-1 font-bn"><AlertCircle className="w-3 h-3" />{errors.shift}</p>}
                    </Field>
                  </div>
                </div>

                {/* Password Section */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-5">
                  <h4 className="font-semibold text-slate-900 text-sm mb-1 flex items-center gap-2 font-bn">
                    <Lock className="w-4 h-4 text-blue-600" />
                    অ্যাকাউন্ট পাসওয়ার্ড তৈরি করুন
                  </h4>
                  <p className="text-xs text-slate-500 mb-5 font-bn">
                    এই পাসওয়ার্ড দিয়ে পরবর্তীতে আপনার মোবাইল নম্বর ব্যবহার করে লগইন করতে পারবেন।
                  </p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="পাসওয়ার্ড *" error={errors.password}>
                      <div className={`flex rounded-xl overflow-hidden border ${errors.password ? "border-red-300 focus-within:ring-2 focus-within:ring-red-500/20" : "border-slate-300 focus-within:ring-2 focus-within:ring-blue-500/20 hover:border-slate-400"} transition-all shadow-sm bg-white`}>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="কমপক্ষে ৬ অক্ষর"
                          value={form.password}
                          onChange={set("password")}
                          className="w-full px-4 py-2.5 text-sm outline-none bg-white text-slate-900 placeholder:text-slate-400 font-bn"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3 text-slate-400 hover:text-slate-600 shrink-0">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </Field>
                    <Field label="পাসওয়ার্ড নিশ্চিত করুন *" error={errors.confirmPassword}>
                      <div className={`flex rounded-xl overflow-hidden border ${errors.confirmPassword ? "border-red-300 focus-within:ring-2 focus-within:ring-red-500/20" : "border-slate-300 focus-within:ring-2 focus-within:ring-blue-500/20 hover:border-slate-400"} transition-all shadow-sm bg-white`}>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="পাসওয়ার্ড আবার দিন"
                          value={form.confirmPassword}
                          onChange={set("confirmPassword")}
                          className="w-full px-4 py-2.5 text-sm outline-none bg-white text-slate-900 placeholder:text-slate-400 font-bn"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="px-3 text-slate-400 hover:text-slate-600 shrink-0">
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </Field>
                  </div>
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className={`relative w-5 h-5 mt-0.5 rounded border flex-shrink-0 transition-colors ${form.agreeTerms ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white group-hover:border-blue-400"}`}>
                      <input type="checkbox" checked={form.agreeTerms} onChange={set("agreeTerms")} className="absolute opacity-0 w-full h-full cursor-pointer" />
                      {form.agreeTerms && <CheckCircle className="absolute inset-0 w-full h-full text-white p-0.5" />}
                    </div>
                    <span className="text-slate-600 text-sm leading-relaxed select-none font-bn">
                      আমি TechHat IT Institute-এর{" "}
                      <Link href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">শর্তাবলী</Link>{" "}
                      পড়েছি এবং ভর্তির নিয়মকানুন মেনে চলতে রাজি আছি।
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-red-400 text-xs mt-2 ml-8 flex items-center gap-1 font-bn"><AlertCircle className="w-3 h-3" />শর্তাবলীতে সম্মতি দিন</p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="px-6 sm:px-8 pb-8">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full relative group overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-[0_4px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-[15px]"
                >
                  <span className="relative flex items-center gap-2 font-bn">
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        আবেদন পাঠানো হচ্ছে...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        ভর্তির আবেদন জমা দিন
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </button>
                <p className="text-center text-xs text-slate-500 font-medium mt-3 font-bn">
                  আবেদন জমার পর আমাদের প্রতিনিধি ২৪ ঘণ্টার মধ্যে ফোন করবেন।
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  label, error, children, className = ""
}: {
  label: string; error?: string; children: React.ReactNode; className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-slate-700 mb-2 font-bn">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1 font-bn"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  )
}

function inputCls(error?: string) {
  return `w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-all duration-200 bg-white text-slate-900 shadow-sm
    ${error
      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50"
      : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-400"
    }
    placeholder:text-slate-400`
}
