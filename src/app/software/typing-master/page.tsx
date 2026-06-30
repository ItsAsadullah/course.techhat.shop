"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Keyboard,
  BookOpen,
  Timer,
  Gamepad2,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Globe,
  Zap,
  Target,
  TrendingUp,
  Star,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

// ─── Typing animation demo ─────────────────────────────────────────────────

const DEMO_SLIDES = [
  { text: "The quick brown fox jumps over the lazy dog.", lang: "en", label: "English" },
  { text: "আমাদের দেশ বাংলাদেশ, আমাদের ভাষা বাংলা।",    lang: "bn", label: "বাংলা"   },
  { text: "Pack my box with five dozen liquor jugs.",     lang: "en", label: "English" },
  { text: "দ্রুত টাইপিং শেখা খুব সহজ এবং আনন্দদায়ক।",  lang: "bn", label: "বাংলা"   },
  { text: "How vexingly quick daft zebras jump!",         lang: "en", label: "English" },
  { text: "প্রতিদিন অনুশীলন করলে টাইপিং গতি বাড়ে।",    lang: "bn", label: "বাংলা"   },
];

const KB_ROWS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "ZXCVBNM".split(""),
];
const KB_ALL = KB_ROWS.flat();

function TypingDemo() {
  const { theme } = useTheme();
  const [dmMounted, setDmMounted] = useState(false);
  const [slideIdx, setSlideIdx]   = useState(0);
  const [typed,    setTyped]      = useState(0);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => { setDmMounted(true); }, []);

  const slide = DEMO_SLIDES[slideIdx];

  // Typing animation
  useEffect(() => {
    if (typed >= slide.text.length) {
      const t = setTimeout(() => {
        setSlideIdx((i) => (i + 1) % DEMO_SLIDES.length);
        setTyped(0);
      }, 1600);
      return () => clearTimeout(t);
    }
    const delay = Math.random() * 55 + 40;
    const t = setTimeout(() => {
      const ch = slide.text[typed];
      if (ch && /[a-zA-Z]/.test(ch)) {
        const upper = ch.toUpperCase();
        setActiveKey(upper);
        setTimeout(() => setActiveKey(null), 130);
      } else if (ch === " ") {
        setActiveKey("SPACE");
        setTimeout(() => setActiveKey(null), 130);
      } else if (ch) {
        const rk = KB_ALL[Math.floor(Math.random() * KB_ALL.length)];
        setActiveKey(rk);
        setTimeout(() => setActiveKey(null), 130);
      }
      setTyped((n) => n + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [typed, slideIdx, slide.text]);

  const wpm = Math.min(Math.round((typed / 5) / (1 / 60)) || 0, 120);
  const acc = typed > 3 ? 97 : 100;
  const isBn = slide.lang === "bn";
  const isDark = !dmMounted || theme === "dark";

  // ─── Theme-aware palette ────────────────────────────────────────
  const card   = isDark
    ? "bg-slate-800/60 border-slate-700/50 shadow-2xl shadow-black/40"
    : "bg-white/70 border-white/80 shadow-2xl shadow-slate-200/80 backdrop-blur-xl";
  const chrome = isDark ? "text-slate-500" : "text-slate-400";
  const statBg = isDark ? "bg-slate-900/60" : "bg-slate-100/80 border border-slate-200/60";
  const statSub= isDark ? "text-slate-500" : "text-slate-500";
  const textBox= isDark ? "bg-slate-900/80" : "bg-slate-50/90 border border-slate-200/50";
  const typed_ = "text-emerald-500";
  const cursor_= "bg-emerald-500";
  const untyped= isDark ? "text-slate-500" : "text-slate-400";
  const progBg = isDark ? "bg-slate-700"   : "bg-slate-200";
  const keyBase= isDark
    ? "bg-slate-700 border-slate-600 text-slate-400"
    : "bg-white border-slate-200 text-slate-500 shadow-sm";
  const keyAct = isDark
    ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/40 scale-95"
    : "bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-400/50 scale-95";
  const langBadge = isDark
    ? "bg-slate-700/70 text-slate-400 border-slate-600"
    : "bg-slate-100 text-slate-500 border-slate-200";

  return (
    <div className={`relative rounded-2xl border backdrop-blur-sm p-6 transition-colors duration-300 ${card}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400/80" />
          <span className="w-3 h-3 rounded-full bg-amber-400/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
          <span className={`ml-3 text-xs font-mono ${chrome}`}>typing-practice.tsx</span>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${langBadge} ${isBn ? "font-bn" : ""}`}>
          {slide.label}
        </span>
      </div>

      <div className="flex gap-3 mb-5">
        {[
          { label: "WPM",      value: wpm,        color: "text-blue-500"    },
          { label: "Accuracy", value: `${acc}%`,  color: "text-emerald-500" },
          { label: "Streak",   value: "🔥 7",     color: "text-amber-500"   },
        ].map(({ label, value, color }) => (
          <div key={label} className={`flex-1 rounded-xl px-3 py-2 text-center ${statBg}`}>
            <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
            <p className={`text-[10px] uppercase tracking-wider ${statSub}`}>{label}</p>
          </div>
        ))}
      </div>

      <div className={`rounded-xl px-4 py-4 text-[15px] leading-relaxed min-h-[72px] tracking-wide ${textBox} ${isBn ? "font-bn" : "font-mono"}`}>
        <span className={typed_}>{slide.text.slice(0, typed)}</span>
        <span className={`inline-block w-0.5 h-5 ${cursor_} animate-pulse align-middle mx-0.5`} />
        <span className={untyped}>{slide.text.slice(typed)}</span>
      </div>

      <div className={`mt-3 h-1 rounded-full overflow-hidden ${progBg}`}>
        <div
          className="h-full bg-linear-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-150"
          style={{ width: `${(typed / slide.text.length) * 100}%` }}
        />
      </div>

      <div className="mt-4 flex flex-col items-center gap-[3px]">
        {KB_ROWS.map((row, ri) => (
          <div
            key={ri}
            className="flex gap-[3px]"
            style={{ marginLeft: [0, 6, 14][ri] }}
          >
            {row.map((k) => (
              <div
                key={k}
                className={`w-[22px] h-[20px] rounded border flex items-center justify-center text-[8px] font-mono font-semibold transition-all duration-75 ${
                  activeKey === k ? keyAct : keyBase
                }`}
              >
                {k}
              </div>
            ))}
          </div>
        ))}
        <div
          style={{ marginLeft: 22 }}
          className={`w-28 h-[18px] rounded border flex items-center justify-center text-[7px] font-mono transition-all duration-75 ${
            activeKey === "SPACE" ? keyAct : keyBase
          }`}
        />
      </div>
    </div>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon:     BookOpen,
    title:    "কাঠামোগত পাঠ",
    desc:     "হোম রো কী থেকে শুরু করে ধাপে ধাপে শিখুন — নতুন থেকে অ্যাডভান্সড পর্যন্ত।",
    color:    "text-emerald-400",
    bg:       "bg-emerald-500/10",
    border:   "border-emerald-500/20",
    href:     "#",
  },
  {
    icon:     Timer,
    title:    "স্পিড টেস্ট",
    desc:     "১, ৩ বা ৫ মিনিটের টেস্ট নিন। সময়ের সাথে WPM এবং নির্ভুলতা ট্র্যাক করুন।",
    color:    "text-blue-400",
    bg:       "bg-blue-500/10",
    border:   "border-blue-500/20",
    href:     "#",
  },
  {
    icon:     Gamepad2,
    title:    "টাইপিং গেমস",
    desc:     "পড়ন্ত শব্দের গেমে বিরক্তি দূর করুন। অনুশীলনকে মজাদার করুন।",
    color:    "text-violet-400",
    bg:       "bg-violet-500/10",
    border:   "border-violet-500/20",
    href:     "#",
  },
  {
    icon:     BarChart3,
    title:    "অগ্রগতি বিশ্লেষণ",
    desc:     "স্পিড ইতিহাস, নির্ভুলতার ট্রেন্ড এবং ব্যক্তিগত রেকর্ড এক নজরে দেখুন।",
    color:    "text-amber-400",
    bg:       "bg-amber-500/10",
    border:   "border-amber-500/20",
    href:     "#",
  },
];

// ─── Steps ─────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num:      "01",
    icon:     Star,
    title:    "বিনামূল্যে অ্যাকাউন্ট তৈরি করুন",
    desc:     "কয়েক সেকেন্ডে সাইন আপ করুন — কোনো ক্রেডিট কার্ড লাগবে না।",
    color:    "text-emerald-400",
    ring:     "ring-emerald-500/30",
  },
  {
    num:      "02",
    icon:     Target,
    title:    "আপনার শেখার পথ বেছে নিন",
    desc:     "কাঠামোগত পাঠ, বিনামূল্যে অনুশীলন, বা দ্রুত স্পিড টেস্ট থেকে বেছে নিন।",
    color:    "text-blue-400",
    ring:     "ring-blue-500/30",
  },
  {
    num:      "03",
    icon:     TrendingUp,
    title:    "আপনার অগ্রগতি ট্র্যাক করুন",
    desc:     "পেশীর স্মৃতি ও নির্ভুলতা বাড়ানোর সাথে সাথে WPM বাড়তে দেখুন।",
    color:    "text-violet-400",
    ring:     "ring-violet-500/30",
  },
];


// ─── Page ──────────────────────────────────────────────────────────────────

export default function TypingMasterLandingPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isDark = !mounted || theme === "dark";

  return (
    <>
    <Navbar />
    <div
      className={`min-h-screen overflow-x-hidden pt-16 transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage: isDark
            ? "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)"
            : "linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none fixed top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-emerald-600/10 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-100px] right-[-150px] w-[600px] h-[400px] rounded-full bg-violet-600/8 blur-[100px]" />

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              <span className="font-bn">বিনামূল্যে দ্বিভাষিক টাইপিং টিউটর</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6 font-bn">
              টাইপিং আয়ত্ত করুন{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                বিদ্যুৎ গতিতে
              </span>
            </h1>

            <p className={`text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 ${isDark ? "text-slate-400" : "text-slate-600"} font-bn`}>
              বাংলা (বিজয় ও অভ্র) এবং ইংরেজি টাইপিং শিখুন — কাঠামোগত পাঠ, রিয়েল-টাইম স্পিড টেস্ট এবং মজাদার গেমস দিয়ে।
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <Link
                href="#"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 text-white font-semibold text-[15px] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/25 hover:scale-[1.02]"
              >
                <span className="font-bn">বিনামূল্যে শুরু করুন</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <button
                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[15px] transition-all ${
                  isDark
                    ? "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 shadow-sm"
                }`}
              >
                <span className="font-bn">সাইনইন ছাড়াই শুরু করুন (গেস্ট মোড)</span>
              </button>
            </div>

            <ul className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start text-sm">
              {[
                "কোনো ক্রেডিট কার্ড লাগবে না",
                "বিনামূল্যে চিরতরে",
                "সব ডিভাইসে কাজ করে"
              ].map((text) => (
                <li key={text} className={`flex items-center gap-1.5 ${isDark ? "text-slate-400" : "text-slate-600"} font-bn`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden lg:block">
            <TypingDemo />
          </div>
        </div>
      </section>

      <div
        className={`relative z-10 border-y backdrop-blur-sm ${
          isDark
            ? "border-slate-800/60 bg-slate-900/40"
            : "border-slate-200/80 bg-white/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "10,000+", label: "সক্রিয় শিক্ষার্থী" },
            { value: "50 WPM",  label: "গড় উন্নতি" },
            { value: "99%",     label: "আপটাইম" },
            { value: "2 langs", label: "বাংলা ও ইংরেজি" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{value}</p>
              <p className={`text-sm mt-0.5 ${isDark ? "text-slate-500" : "text-slate-500"} font-bn`}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3 font-bn">আপনার যা দরকার</p>
          <h2 className="text-4xl font-extrabold font-bn">
            একটি প্ল্যাটফর্মে,{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              সম্পূর্ণ টাইপিং দক্ষতা
            </span>
          </h2>
          <p className={`mt-4 max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"} font-bn`}>
            প্রথম পাঠ থেকে ১০০+ WPM পর্যন্ত — সব কিছু এখানেই আছে।
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg, border, href }) => (
            <Link
              key={title}
              href={href}
              className={`group relative rounded-2xl ${bg} border ${border} p-6 hover:scale-[1.02] transition-all duration-200 ${
                isDark ? "hover:shadow-xl hover:shadow-black/30" : "hover:shadow-lg hover:shadow-slate-900/10"
              }`}
            >
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${bg} border ${border} ${color} mb-4`}>
                <Icon className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className={`font-semibold text-base mb-2 ${isDark ? "text-white" : "text-slate-900"} font-bn`}>{title}</h3>
              <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"} font-bn`}>{desc}</p>
              <div className={`mt-4 inline-flex items-center gap-1 text-xs ${color} font-medium opacity-0 group-hover:opacity-100 transition-opacity`}>
                দেখুন <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className={`relative z-10 border-y ${
          isDark ? "bg-slate-900/30 border-slate-800/50" : "bg-slate-100/60 border-slate-200/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3 font-bn">সহজ প্রক্রিয়া</p>
            <h2 className={`text-4xl font-extrabold ${isDark ? "" : "text-slate-900"} font-bn`}>মিনিটেই শুরু করুন</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map(({ num, icon: Icon, title, desc, color, ring }) => (
              <div key={num} className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl border ring-4 ${ring} mb-5 mx-auto shadow-xl ${
                    isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                  }`}
                >
                  <Icon className={`w-8 h-8 ${color}`} strokeWidth={1.5} />
                </div>
                <div
                  className={`inline-block text-xs font-bold ${color} mb-2 px-2 py-0.5 rounded-full border ${
                    isDark ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"
                  } font-bn`}
                >
                  ধাপ {num}
                </div>
                <h3 className={`font-semibold text-lg mb-2 ${isDark ? "text-white" : "text-slate-900"} font-bn`}>{title}</h3>
                <p className={`text-sm leading-relaxed max-w-xs mx-auto ${isDark ? "text-slate-400" : "text-slate-600"} font-bn`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="languages" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-medium mb-5">
              <Globe className="w-3.5 h-3.5" />
              <span className="font-bn">দ্বিভাষিক সমর্থন</span>
            </div>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight font-bn">
              টাইপ করুন{" "}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                বাংলা ও ইংরেজিতে
              </span>
            </h2>
            <p className={`text-lg leading-relaxed mb-6 ${isDark ? "text-slate-400" : "text-slate-600"} font-bn`}>
              বাংলাদেশি শিক্ষার্থীদের জন্য তৈরি একমাত্র টাইপিং টিউটর। বিজয় ও অভ্র কীবোর্ড লেআউট এবং ইংরেজি শিখুন।
            </p>
            <ul className="space-y-3">
              {[
                "বিজয় কীবোর্ড লেআউট",
                "অভ্র কীবোর্ড লেআউট",
                "ইংরেজি QWERTY / টাচ টাইপিং"
              ].map((text) => (
                <li key={text} className={`flex items-center gap-3 text-[15px] ${isDark ? "text-slate-300" : "text-slate-700"} font-bn`}>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                flag:   "🇧🇩",
                lang:   "বাংলা",
                sub:    "Bangla",
                items:  ["Bijoy কীবোর্ড", "Avro ফোনেটিক", "ইউনিকোড সাপোর্ট"],
                color:  "text-emerald-400",
                bullet: "bg-emerald-500",
                border: "border-emerald-500/20",
                bg:     "bg-emerald-500/5",
              },
              {
                flag:   "🇬🇧",
                lang:   "English",
                sub:    "International",
                items:  ["QWERTY layout", "Touch typing", "10-finger method"],
                color:  "text-blue-400",
                bullet: "bg-blue-500",
                border: "border-blue-500/20",
                bg:     "bg-blue-500/5",
              },
            ].map(({ flag, lang: langName, sub, items, color, bullet, border, bg }) => (
              <div key={langName} className={`rounded-2xl ${bg} border ${border} p-6`}>
                <div className="text-4xl mb-3">{flag}</div>
                <h3 className={`font-bold text-xl mb-0.5 ${color} font-bn`}>{langName}</h3>
                <p className={`text-xs mb-4 ${isDark ? "text-slate-500" : "text-slate-500"}`}>{sub}</p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className={`flex items-center gap-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"} font-bn`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${bullet} shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div
          className={`relative rounded-3xl border overflow-hidden p-12 text-center ${
            isDark
              ? "bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-slate-900 border-emerald-500/20"
              : "bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-emerald-200"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent pointer-events-none" />
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-emerald-600/15 blur-[80px] pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500 shadow-xl shadow-emerald-500/30 mb-6 mx-auto">
              <Keyboard className="w-8 h-8 text-white" strokeWidth={1.75} />
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 font-bn">
              দ্রুত টাইপ করতে{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">প্রস্তুত?</span>
            </h2>
            <p className={`text-lg max-w-md mx-auto mb-8 ${isDark ? "text-slate-400" : "text-slate-600"} font-bn`}>
              হাজার হাজার শিক্ষার্থী এই প্ল্যাটফর্ম দিয়ে তাদের টাইপিং গতি উন্নত করেছেন।
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="#"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-white font-semibold text-base hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/25 hover:scale-[1.02]"
              >
                <span className="font-bn">বিনামূল্যে অ্যাকাউন্ট তৈরি করুন</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#"
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all ${
                  isDark
                    ? "bg-slate-800/80 text-slate-200 border border-slate-700 hover:bg-slate-700"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm"
                }`}
              >
                <span className="font-bn">সাইন ইন</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}
