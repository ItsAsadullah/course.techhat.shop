"use client"

import { useState } from "react"
import {
  User, Phone, Mail, MapPin, Calendar, BookOpen,
  Clock, GraduationCap, ChevronDown, CheckCircle, Loader2, AlertCircle
} from "lucide-react"

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

const educationLevels = [
  "অষ্টম শ্রেণি",
  "JSC/JDC",
  "SSC/দাখিল",
  "HSC/আলিম",
  "ডিপ্লোমা",
  "স্নাতক (Honors/Degree)",
  "স্নাতকোত্তর (Masters)",
  "অন্যান্য",
]

type FormData = {
  fullName: string
  fatherName: string
  motherName: string
  phone: string
  email: string
  dob: string
  gender: string
  address: string
  district: string
  course: string
  shift: string
  education: string
  occupation: string
  heardFrom: string
  notes: string
  agreeTerms: boolean
}

const initial: FormData = {
  fullName: "", fatherName: "", motherName: "", phone: "",
  email: "", dob: "", gender: "", address: "", district: "",
  course: "", shift: "", education: "", occupation: "",
  heardFrom: "", notes: "", agreeTerms: false,
}

type Status = "idle" | "loading" | "success" | "error"

export default function AdmissionForm() {
  const [form, setForm] = useState<FormData>(initial)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [status, setStatus] = useState<Status>("idle")

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }))

  const validate = (): boolean => {
    const err: Partial<Record<keyof FormData, string>> = {}
    if (!form.fullName.trim()) err.fullName = "নাম লিখুন"
    if (!form.fatherName.trim()) err.fatherName = "পিতার নাম লিখুন"
    if (!form.phone.trim() || !/^01[3-9]\d{8}$/.test(form.phone)) err.phone = "সঠিক মোবাইল নম্বর লিখুন"
    if (!form.gender) err.gender = "লিঙ্গ নির্বাচন করুন"
    if (!form.course) err.course = "কোর্স নির্বাচন করুন"
    if (!form.shift) err.shift = "শিফট নির্বাচন করুন"
    if (!form.address.trim()) err.address = "ঠিকানা লিখুন"
    if (!form.education) err.education = "শিক্ষাগত যোগ্যতা নির্বাচন করুন"
    if (!form.agreeTerms) err.agreeTerms = "শর্ত মেনে নিন" as unknown as boolean
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus("loading")
    await new Promise((r) => setTimeout(r, 1800))
    // TODO: POST /api/admissions  with form data
    setStatus("success")
  }

  if (status === "success") {
    return (
      <section id="admission" className="py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-12 border border-emerald-100 shadow-xl">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">ভর্তির আবেদন সফল হয়েছে!</h2>
            <p className="text-slate-500 mb-6 leading-relaxed">
              আপনার আবেদন আমরা পেয়েছি। শীঘ্রই আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন। ধন্যবাদ!
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 text-left text-sm">
              <p className="text-slate-500"><span className="font-semibold text-slate-700">নাম:</span> {form.fullName}</p>
              <p className="text-slate-500 mt-1"><span className="font-semibold text-slate-700">কোর্স:</span> {form.course}</p>
              <p className="text-slate-500 mt-1"><span className="font-semibold text-slate-700">শিফট:</span> {shifts.find(s => s.id === form.shift)?.label}</p>
            </div>
            <button
              onClick={() => { setForm(initial); setStatus("idle") }}
              className="mt-6 text-indigo-600 font-semibold text-sm hover:text-indigo-700"
            >
              আরেকটি আবেদন করুন →
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="admission" className="py-20 bg-gradient-to-br from-indigo-50/60 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">ভর্তি ফর্ম</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            আজই ভর্তির আবেদন করুন
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            নিচের ফর্মটি পূরণ করুন। আমাদের প্রতিনিধি ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবেন।
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left info */}
          <div className="lg:col-span-1">
            <div className="bg-indigo-600 text-white rounded-2xl p-7 sticky top-24">
              <h3 className="font-bold text-xl mb-5">ভর্তি তথ্য</h3>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">কোর্স ফি</p>
                    <p className="text-indigo-200 text-xs mt-0.5">ভর্তি ফি: ৫০০ টাকা (একবার)</p>
                    <p className="text-indigo-200 text-xs">মাসিক বেতন: কোর্স ভেদে ভিন্ন</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">ক্লাসের সময়</p>
                    <p className="text-indigo-200 text-xs mt-0.5">সপ্তাহে ৬ দিন (শুক্রবার বন্ধ)</p>
                    <p className="text-indigo-200 text-xs">প্রতিটি শিফট ২ ঘণ্টা</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">সার্টিফিকেট</p>
                    <p className="text-indigo-200 text-xs mt-0.5">সরকার অনুমোদিত সার্টিফিকেট</p>
                    <p className="text-indigo-200 text-xs">কোর্স সম্পন্নের পর প্রদান</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">যোগাযোগ</p>
                    <p className="text-indigo-200 text-xs mt-0.5">01XXXXXXXXX</p>
                    <p className="text-indigo-200 text-xs">সকাল ৯টা – রাত ৯টা</p>
                  </div>
                </div>
              </div>

              <div className="mt-7 pt-6 border-t border-white/20">
                <p className="text-xs text-indigo-200 leading-relaxed">
                  📌 ভর্তির সময় ১ কপি পাসপোর্ট সাইজ ছবি, জন্ম সনদ / NID এর ফটোকপি প্রয়োজন।
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 space-y-6">
              {status === "error" && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।</span>
                </div>
              )}

              {/* Section 1: Personal Info */}
              <div>
                <h4 className="font-semibold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-500" />
                  ব্যক্তিগত তথ্য
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="শিক্ষার্থীর নাম *" error={errors.fullName as string}>
                    <input
                      type="text"
                      placeholder="পূর্ণ নাম লিখুন"
                      value={form.fullName}
                      onChange={set("fullName")}
                      className={inputCls(errors.fullName as string)}
                    />
                  </Field>

                  <Field label="পিতার নাম *" error={errors.fatherName as string}>
                    <input
                      type="text"
                      placeholder="পিতার পূর্ণ নাম"
                      value={form.fatherName}
                      onChange={set("fatherName")}
                      className={inputCls(errors.fatherName as string)}
                    />
                  </Field>

                  <Field label="মাতার নাম">
                    <input
                      type="text"
                      placeholder="মাতার পূর্ণ নাম"
                      value={form.motherName}
                      onChange={set("motherName")}
                      className={inputCls()}
                    />
                  </Field>

                  <Field label="জন্ম তারিখ">
                    <input
                      type="date"
                      value={form.dob}
                      onChange={set("dob")}
                      className={inputCls()}
                    />
                  </Field>

                  <Field label="লিঙ্গ *" error={errors.gender as string}>
                    <SelectField value={form.gender} onChange={set("gender")} error={errors.gender as string}>
                      <option value="">-- নির্বাচন করুন --</option>
                      <option value="male">পুরুষ (Male)</option>
                      <option value="female">মহিলা (Female)</option>
                      <option value="other">অন্যান্য</option>
                    </SelectField>
                  </Field>

                  <Field label="পেশা / বর্তমান অবস্থান">
                    <input
                      type="text"
                      placeholder="যেমন: ছাত্র, চাকরিজীবী..."
                      value={form.occupation}
                      onChange={set("occupation")}
                      className={inputCls()}
                    />
                  </Field>
                </div>
              </div>

              {/* Section 2: Contact */}
              <div>
                <h4 className="font-semibold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-500" />
                  যোগাযোগ তথ্য
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="মোবাইল নম্বর *" error={errors.phone as string}>
                    <div className="flex">
                      <span className="flex items-center px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 text-sm font-medium">
                        +880
                      </span>
                      <input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={form.phone}
                        onChange={set("phone")}
                        className={`${inputCls(errors.phone as string)} rounded-l-none`}
                      />
                    </div>
                  </Field>

                  <Field label="ইমেইল ঠিকানা">
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      value={form.email}
                      onChange={set("email")}
                      className={inputCls()}
                    />
                  </Field>

                  <Field label="ঠিকানা *" error={errors.address as string} className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="গ্রাম/মহল্লা, থানা, জেলা"
                      value={form.address}
                      onChange={set("address")}
                      className={inputCls(errors.address as string)}
                    />
                  </Field>
                </div>
              </div>

              {/* Section 3: Course */}
              <div>
                <h4 className="font-semibold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  কোর্স ও শিফট তথ্য
                </h4>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <Field label="কোর্স নির্বাচন করুন *" error={errors.course as string} className="sm:col-span-2">
                    <SelectField value={form.course} onChange={set("course")} error={errors.course as string}>
                      <option value="">-- কোর্স বেছে নিন --</option>
                      {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                    </SelectField>
                  </Field>
                </div>

                {/* Shift selector */}
                <Field label="পছন্দের শিফট *" error={errors.shift as string}>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-1">
                    {shifts.map((s) => (
                      <label
                        key={s.id}
                        className={`flex flex-col items-center p-2.5 rounded-xl border-2 cursor-pointer transition-all text-center ${
                          form.shift === s.id
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 hover:border-slate-300 text-slate-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shift"
                          value={s.id}
                          checked={form.shift === s.id}
                          onChange={set("shift")}
                          className="sr-only"
                        />
                        <span className="font-semibold text-sm">{s.label}</span>
                        <span className="text-[10px] mt-0.5 opacity-70">{s.time}</span>
                      </label>
                    ))}
                  </div>
                  {errors.shift && <p className="text-red-500 text-xs mt-1">{errors.shift as string}</p>}
                </Field>
              </div>

              {/* Section 4: Education */}
              <div>
                <h4 className="font-semibold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  শিক্ষাগত ও অন্যান্য তথ্য
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="সর্বোচ্চ শিক্ষাগত যোগ্যতা *" error={errors.education as string}>
                    <SelectField value={form.education} onChange={set("education")} error={errors.education as string}>
                      <option value="">-- বেছে নিন --</option>
                      {educationLevels.map((e) => <option key={e} value={e}>{e}</option>)}
                    </SelectField>
                  </Field>

                  <Field label="কীভাবে জানলেন?">
                    <SelectField value={form.heardFrom} onChange={set("heardFrom")}>
                      <option value="">-- বেছে নিন --</option>
                      <option value="facebook">Facebook</option>
                      <option value="friend">বন্ধু/পরিচিত</option>
                      <option value="banner">ব্যানার/পোস্টার</option>
                      <option value="youtube">YouTube</option>
                      <option value="google">Google Search</option>
                      <option value="other">অন্যান্য</option>
                    </SelectField>
                  </Field>

                  <Field label="বিশেষ মন্তব্য (ঐচ্ছিক)" className="sm:col-span-2">
                    <textarea
                      rows={3}
                      placeholder="কোনো প্রশ্ন বা বিশেষ চাহিদা থাকলে এখানে লিখুন..."
                      value={form.notes}
                      onChange={set("notes")}
                      className={`${inputCls()} resize-none`}
                    />
                  </Field>
                </div>
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.agreeTerms}
                    onChange={set("agreeTerms")}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 flex-shrink-0 cursor-pointer"
                  />
                  <span className="text-slate-600 text-sm leading-relaxed">
                    আমি EduCore IT Training Center-এর{" "}
                    <a href="#" className="text-indigo-600 hover:underline font-medium">শর্তাবলী</a>{" "}
                    পড়েছি এবং ভর্তির নিয়মকানুন মেনে চলতে রাজি আছি।
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-red-500 text-xs mt-1 ml-7">শর্তাবলীতে সম্মতি দিন</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-indigo-600 text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    আবেদন পাঠানো হচ্ছে...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    ভর্তির আবেদন জমা দিন
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                আবেদন জমার পর আমাদের প্রতিনিধি ২৪ ঘণ্টার মধ্যে ফোন করবেন।
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  label, error, children, className = ""
}: {
  label: string; error?: string; children: React.ReactNode; className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  )
}

function SelectField({
  value, onChange, children, error
}: {
  value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode; error?: string
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`${inputCls(error)} appearance-none pr-10`}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  )
}

function inputCls(error?: string) {
  return `w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-all duration-150 bg-white
    ${error
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
    }
    placeholder:text-slate-300 text-slate-800`
}
