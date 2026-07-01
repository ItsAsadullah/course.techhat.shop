"use client";

// =============================================================================
//  /lessons  — full gamified curriculum browser
//
//  Breadcrumb flow:   Modules → Module → Lesson → Drill (GamifiedTypingEngine)
//  After finishing:   DrillResults modal
// =============================================================================

import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Star, BookOpen, ArrowLeft, ArrowRight, BookText, Lightbulb, Keyboard, AlignLeft, CheckCircle2 } from "lucide-react";
import {
  ENGLISH_COURSE,
  calcStars,
  type Drill,
  type Module,
  type Lesson,
  type IntroPage,
} from "@/data/typing-master/englishCurriculum";
import { useLang } from "@/context/typing-master/LangContext";
import { useProgress } from "@/hooks/typing-master/useProgress";
import { useProgressStore } from "@/hooks/typing-master/useProgressStore";
import {
  KEYBOARD_ROWS,
  FINGER_COLOR,
  FINGER_COLOR_PASSIVE,
  HOME_ROW_KEYS,
} from "@/components/typing-master/keyboard/keyboardData";
import GamifiedTypingEngine, {
  type DrillCompleteStats,
} from "@/components/typing-master/typing/GamifiedTypingEngine";
import KeyDrillEngine   from "@/components/typing-master/typing/KeyDrillEngine";
import PairsDrillEngine from "@/components/typing-master/typing/PairsDrillEngine";
import FallingLettersEngine from "@/components/typing-master/typing/FallingLettersEngine";
import FighterPlaneEngine from "@/components/typing-master/typing/FighterPlaneEngine";
import DrillResults     from "@/components/typing-master/typing/DrillResults";

// ─── Types ────────────────────────────────────────────────────────────────────

type View =
  | { kind: "modules" }
  | { kind: "module";  mod: Module }
  | { kind: "lesson";  mod: Module; lesson: Lesson }
  | { kind: "drill";   mod: Module; lesson: Lesson; drill: Drill; drillIdx: number };

// ─── URL ↔ View helpers ───────────────────────────────────────────────────────
//
//  We encode the active view into URL search params so a page refresh always
//  lands on the exact same screen — no hydration mismatch, no localStorage race.
//
//  Param layout:
//    ?v=module&m=<modId>
//    ?v=lesson&m=<modId>&l=<lessonId>
//    ?v=drill &m=<modId>&l=<lessonId>&d=<drillId>&i=<drillIdx>

const DEFAULT_VIEW: View = { kind: "module", mod: ENGLISH_COURSE.modules[0] };

const BN_ENTITY_COPY = {
  modules: {
    "mod-fast-touch": {
      title: "ফাস্ট টাচ টাইপিং কোর্স",
      subtitle: "না দেখে ২৬টি কী আয়ত্ত করুন",
    },
  },
  lessons: {
    "les-01-home-row": "দ্য হোম রো",
  },
  drills: {
    "d-01-1-intro-basics": "টাচ টাইপিংয়ের ভিত্তি",
    "d-01-2-intro-homerow": "নতুন কী: হোম রো",
    "d-01-3-key": "নতুন কী হোম রো (ASDF-JKL; এন্টার)",
    "d-01-4-falling": "ফলিং লেটারস (ASDF JKL;)",
    "d-01-3-intro-results": "ফলাফল বোঝা",
    "d-01-5-pairs": "হোম রো জোড়া ও গ্রুপ",
    "d-01-6-word": "শব্দ ড্রিল",
    "d-01-6b-sentence": "বাক্য ড্রিল",
    "d-01-7-intro-shift": "বড় হাতের অক্ষরে Shift",
    "d-01-7-paragraph": "প্যারাগ্রাফ ড্রিল",
  },
} as const;

function getModuleTitle(mod: Module, lang: "en" | "bn") {
  return lang === "bn" ? (BN_ENTITY_COPY.modules[mod.id as keyof typeof BN_ENTITY_COPY.modules]?.title ?? mod.title) : mod.title;
}

function getModuleSubtitle(mod: Module, lang: "en" | "bn") {
  return lang === "bn" ? (BN_ENTITY_COPY.modules[mod.id as keyof typeof BN_ENTITY_COPY.modules]?.subtitle ?? mod.subtitle) : mod.subtitle;
}

function getLessonTitle(lesson: Lesson, lang: "en" | "bn") {
  return lang === "bn" ? (BN_ENTITY_COPY.lessons[lesson.id as keyof typeof BN_ENTITY_COPY.lessons] ?? lesson.title) : lesson.title;
}

function getDrillTitle(drill: Drill, lang: "en" | "bn") {
  return lang === "bn" ? (BN_ENTITY_COPY.drills[drill.id as keyof typeof BN_ENTITY_COPY.drills] ?? drill.title) : drill.title;
}

function getDifficultyLabel(difficulty: Drill["difficulty"], lang: "en" | "bn") {
  if (lang !== "bn") return difficulty;
  if (difficulty === "BEGINNER") return "শুরুর স্তর";
  if (difficulty === "INTERMEDIATE") return "মাঝারি";
  return "অগ্রসর";
}

function viewToSearch(v: View): string {
  const p = new URLSearchParams();
  if (v.kind === "module") {
    p.set("v", "module"); p.set("m", v.mod.id);
  } else if (v.kind === "lesson") {
    p.set("v", "lesson"); p.set("m", v.mod.id); p.set("l", v.lesson.id);
  } else if (v.kind === "drill") {
    p.set("v", "drill");  p.set("m", v.mod.id); p.set("l", v.lesson.id);
    p.set("d", v.drill.id); p.set("i", String(v.drillIdx));
  }
  return p.toString();
}

function viewFromSearch(search: string): View {
  const p = new URLSearchParams(search);
  const kind = p.get("v");
  if (!kind) return DEFAULT_VIEW;

  const mod = ENGLISH_COURSE.modules.find(m => m.id === p.get("m")) ?? null;
  if (!mod) return DEFAULT_VIEW;

  if (kind === "module") return { kind: "module", mod };

  const lesson = mod.lessons.find(l => l.id === p.get("l")) ?? null;
  if (!lesson) return { kind: "module", mod };

  if (kind === "lesson") return { kind: "lesson", mod, lesson };

  if (kind === "drill") {
    const drillId  = p.get("d") ?? "";
    const drillIdx = parseInt(p.get("i") ?? "0", 10);
    // Match by both id and index for robustness
    const drill = lesson.drills.find(d => d.id === drillId)
               ?? lesson.drills[drillIdx]
               ?? lesson.drills[0];
    if (!drill) return { kind: "lesson", mod, lesson };
    const actualIdx = lesson.drills.indexOf(drill);
    return { kind: "drill", mod, lesson, drill, drillIdx: actualIdx };
  }

  return DEFAULT_VIEW;
}

function buildAdaptivePracticeDrill(baseDrill: Drill, stats: DrillCompleteStats): Drill {
  const priorityEntries = Object.entries(stats.errorKeyCounts ?? {})
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  const normalizedPriorityKeys = priorityEntries.map(([key]) =>
    key === "⎵" ? " " : key.toLowerCase(),
  );

  const supportKeys = Array.from(new Set(
    [...baseDrill.content]
      .filter((ch) => ch !== " " && ch !== "\n" && ch !== "\t")
      .map((ch) => ch.toLowerCase()),
  ));

  const allKeys = Array.from(new Set([...normalizedPriorityKeys, ...supportKeys]));
  if (allKeys.length === 0) {
    return {
      ...baseDrill,
      id: `adaptive-practice-${baseDrill.id}`,
      title: "Focused Key Practice",
      type: "word",
      content: "a s d f j k l ;",
      hint: "Priority keys are repeated more often.",
      timeLimit: 120,
    };
  }

  const weightedPool = allKeys.flatMap((key) => {
    const sourceKey = key === " " ? "⎵" : key;
    const wrongCount = stats.errorKeyCounts?.[sourceKey] ?? 0;
    const weight = wrongCount > 0 ? Math.min(3 + wrongCount * 2, 14) : 1;
    return Array.from({ length: weight }, () => key);
  });

  const targetLength = 140;
  const sequence: string[] = [];
  for (let i = 0; i < targetLength; i += 1) {
    const pick = weightedPool[Math.floor(Math.random() * weightedPool.length)] ?? allKeys[0];
    sequence.push(pick);
  }

  const groupedTokens: string[] = [];
  for (let i = 0; i < sequence.length; i += 5) {
    groupedTokens.push(sequence.slice(i, i + 5).join(""));
  }

  const priorityLabel = normalizedPriorityKeys
    .filter((key) => key !== " ")
    .slice(0, 4)
    .map((key) => key.toUpperCase())
    .join(" · ");

  return {
    ...baseDrill,
    id: `adaptive-practice-${baseDrill.id}`,
    title: "Focused Key Practice",
    type: "word",
    content: groupedTokens.join(" "),
    timeLimit: 150,
    targetWpm: Math.max(12, Math.floor(baseDrill.targetWpm * 0.85)),
    hint: priorityLabel
      ? `Priority: ${priorityLabel} (others included for balance).`
      : "Priority keys are repeated more often (others included for balance).",
  };
}

// ─── Simple star row ─────────────────────────────────────────────────────────

function StarRow({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"}`}
        />
      ))}
    </span>
  );
}

// ─── Module Card ─────────────────────────────────────────────────────────────

function ModuleCard({
  mod,
  onClick,
}: {
  mod: Module;
  onClick: () => void;
}) {
  const { lang } = useLang();
  const totalDrills = mod.lessons.reduce((sum, l) => sum + l.drills.length, 0);
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.025, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left w-full"
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner`}
        style={{ background: `var(--color-${mod.color}-100, #f0fdf4)` }}
      >
        {mod.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-800 dark:text-slate-100 text-base truncate">{getModuleTitle(mod, lang)}</p>
        <p className="text-slate-400 dark:text-slate-400 text-xs truncate">{getModuleSubtitle(mod, lang)}</p>
        <p className="text-slate-300 dark:text-slate-500 text-[10px] mt-0.5 uppercase tracking-wider">
          {mod.lessons.length} lessons · {totalDrills} drills
        </p>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
    </motion.button>
  );
}

// ─── Lesson Card ─────────────────────────────────────────────────────────────

function LessonCard({
  lesson,
  lessonIndex,
  completedCount,
  onClick,
}: {
  lesson: Lesson;
  lessonIndex: number;
  completedCount: number;
  onClick: () => void;
}) {
  const { lang } = useLang();
  const total = lesson.drills.length;
  const allDone = completedCount === total;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left w-full"
    >
      {/* Serial number badge */}
      <div className={[
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative",
        "font-black text-base",
        allDone
          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
          : "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300",
      ].join(" ")}>
        {lessonIndex}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{getLessonTitle(lesson, lang)}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: total > 0 ? `${Math.round((completedCount / total) * 100)}%` : "0%" }}
            />
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">{completedCount}/{total}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
    </motion.button>
  );
}

// ─── Drill Card ──────────────────────────────────────────────────────────────

function DrillCard({
  drill,
  index,
  lessonIndex,
  completed,
  stars,
  onClick,
}: {
  drill: Drill;
  index: number;
  lessonIndex: number;
  completed: boolean;
  stars: 0 | 1 | 2 | 3;
  onClick: () => void;
}) {
  const { lang } = useLang();
  const isIntro = drill.type === "intro";
  const isTip   = drill.type === "tip";

  const typeIcon =
    isTip   ? <Lightbulb className="w-4 h-4" /> :
    isIntro ? <BookText  className="w-4 h-4" /> :
    drill.type === "key"       ? <Keyboard  className="w-4 h-4" /> :
    drill.type === "pairs"     ? <Keyboard  className="w-4 h-4" /> :
    drill.type === "paragraph" ? <AlignLeft className="w-4 h-4" /> :
                                 <BookOpen  className="w-4 h-4" />;

  const iconBg =
    completed ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" :
    isTip     ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400" :
    isIntro   ? "bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400" :
                "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400";

  const diffColor =
    drill.difficulty === "BEGINNER"     ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400" :
    drill.difficulty === "INTERMEDIATE" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400" :
    drill.difficulty === "ADVANCED"     ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400" :
                                          "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400";

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`group flex items-center gap-3 border rounded-[24px] px-3.5 py-3 shadow-sm hover:shadow-md transition-all text-left w-full h-full min-h-[92px] ${
        completed
          ? "border-emerald-200 dark:border-emerald-800/70 bg-[linear-gradient(135deg,rgba(236,253,245,0.92),rgba(255,255,255,0.92))] dark:bg-[linear-gradient(135deg,rgba(10,28,25,0.96),rgba(16,38,34,0.94))]"
          : "border-slate-200 dark:border-slate-700/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.9))]"
      }`}
    >
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${iconBg}`}>
        {typeIcon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <p className={`font-semibold text-[13px] leading-5 truncate ${completed ? "text-slate-500 dark:text-slate-100" : "text-slate-800 dark:text-slate-100"}`}>
            <span className="inline-flex items-center justify-center min-w-[42px] h-6 px-2 mr-2 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-200 text-[11px] font-mono font-medium align-middle">
              {lessonIndex}.{index + 1}
            </span>
            {getDrillTitle(drill, lang)}
          </p>
          {!isIntro && !isTip ? (
            <div className="flex items-center gap-1.5 shrink-0">
              <StarRow count={stars} />
              {completed && <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 shrink-0" />}
            </div>
          ) : completed
            ? <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 shrink-0" />
            : <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
          }
        </div>
        {!isIntro && !isTip && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${diffColor}`}>
              {getDifficultyLabel(drill.difficulty, lang)}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-300 whitespace-nowrap">
              {lang === "bn" ? `${drill.targetWpm} WPM লক্ষ্য` : `${drill.targetWpm} WPM target`}
            </span>
          </div>
        )}
        {(isIntro || isTip) && (
          <p className="text-[11px] text-slate-400 dark:text-slate-300 mt-1.5">
            {isTip ? "Tip" : "Introduction"} · 3 min.
          </p>
        )}
      </div>
    </motion.button>
  );
}

// ─── IntroViewer ─────────────────────────────────────────────────────────────

// Highlight inline key names like A, S, D, F, J, K, L, ; etc.
function emphasizeBanglaDigits(text: string, keyPrefix: string) {
  return text.split(/([০-৯]+(?:[–—-][০-৯]+)?%?)/g).map((part, idx) => {
    if (/[০-৯]/.test(part)) {
      return (
        <span key={`${keyPrefix}-${idx}`} className="bn-numeral">
          {part}
        </span>
      );
    }
    return part;
  });
}

function highlightKeys(text: string) {
  // Match single uppercase letters or keyboard symbols preceded by → or standalone bracketed
  return text.split(/(→\s*[A-Z;])/g).map((chunk, ci) => {
    if (/^→\s*[A-Z;]$/.test(chunk)) {
      const key = chunk.replace(/^→\s*/, "");
      return (
        <span key={ci} className="inline-flex items-center gap-1">
          <span className="text-slate-400 mx-0.5">→</span>
          <kbd className="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-bold
            bg-slate-800 dark:bg-slate-700 text-white border border-slate-600 shadow-sm min-w-[26px]">
            {key}
          </kbd>
        </span>
      );
    }
    return emphasizeBanglaDigits(chunk, `digit-${ci}`);
  });
}

function renderBody(body: string, accentColor: "blue" | "amber" = "blue") {
  const accent = accentColor === "amber"
    ? { dot: "bg-amber-500", num: "bg-amber-500 text-white", head: "border-amber-400 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30" }
    : { dot: "bg-blue-500", num: "bg-blue-600 text-white", head: "border-blue-400 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30" };

  return body.split("\n").map((line, i) => {
    if (line === "") return <div key={i} className="h-2" />;

    const isBullet   = line.startsWith("\u2022 ");
    const isNumbered = /^\d+\.\s/.test(line) || /^[\u09E6-\u09EF]+\.\s/.test(line);
    const isAllCaps  = !isBullet && !isNumbered && line === line.toUpperCase() && line.length > 3 && /[A-Z]/.test(line);
    const isSubHead  = !isBullet && !isNumbered && !isAllCaps && line.endsWith(":") && line.length < 70;
    const isTipLine  = !isSubHead && (line.startsWith("Tip!") || line.startsWith("Tip:") || line.startsWith("টিপ!") || line.startsWith("টিপ:"));
    const isCtaLine   = !isSubHead && (line.startsWith("Press ") || line.startsWith("নিচের ") || line.startsWith("সামনে ")) || (!isSubHead && (line.startsWith("You are ready") || line.startsWith("আপনি প্রস্তুত")));

    if (isBullet) {
      const text = line.slice(2);
      return (
        <div key={i} className="flex gap-3 items-start py-0.5">
          <span className={`mt-[7px] w-2 h-2 rounded-full shrink-0 ${accent.dot}`} />
          <span className="text-slate-700 dark:text-slate-200 text-[16px] leading-snug">{highlightKeys(text)}</span>
        </div>
      );
    }

    if (isNumbered) {
      const match = line.match(/^(\d+|[\u09E6-\u09EF]+)\.\s(.+)/);
      const num   = match?.[1] ?? "";
      const text  = match?.[2] ?? line;
      return (
        <div key={i} className="flex gap-3 items-start py-1">
          <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${accent.num}`}>
            {num}
          </span>
          <span className="text-slate-700 dark:text-slate-200 text-[16px] leading-snug pt-0.5">{highlightKeys(text)}</span>
        </div>
      );
    }

    if (isAllCaps) {
      return (
        <p key={i} className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-3 mb-0.5">
          {emphasizeBanglaDigits(line, `caps-${i}`)}
        </p>
      );
    }

    if (isSubHead) {
      return (
        <div key={i} className={`flex items-center gap-2 pl-3 pr-4 py-1.5 mt-2 rounded-lg border-l-4 ${accent.head}`}>
          <span className="font-bold text-[16px] leading-snug">{emphasizeBanglaDigits(line.slice(0, -1), `sub-${i}`)}</span>
        </div>
      );
    }

    if (isTipLine) {
      return (
        <div key={i} className="flex gap-2 items-start px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 mt-1">
          <span className="text-amber-500 shrink-0 mt-0.5">💡</span>
          <span className="text-amber-800 dark:text-amber-200 text-[15px] leading-snug">{emphasizeBanglaDigits(line, `tip-${i}`)}</span>
        </div>
      );
    }

    if (isCtaLine) {
      return (
        <div key={i} className={`mt-3 px-4 py-3 rounded-xl font-semibold text-[15px] ${
          accentColor === "amber"
            ? "bg-amber-500 text-white"
            : "bg-blue-600 text-white"
        }`}>
          {emphasizeBanglaDigits(line, `cta-${i}`)}
        </div>
      );
    }

    return (
      <p key={i} className="text-slate-600 dark:text-slate-300 text-[16px] leading-snug">
        {highlightKeys(line)}
      </p>
    );
  });
}

// ─── IntroKeyboard ────────────────────────────────────────────────────────────
//  Compact multi-key-highlight keyboard + hand PNG overlay, used in IntroViewer

function IntroKeyboard({
  highlightKeys,
  highlightShift,
  leftHandImg,
  rightHandImg,
  showLegend = true,
}: {
  highlightKeys: string[];
  highlightShift?: "left" | "right";
  leftHandImg?:  string;
  rightHandImg?: string;
  showLegend?: boolean;
}) {
  const normalizedHighlightKeys = (Array.isArray(highlightKeys)
    ? highlightKeys
    : typeof highlightKeys === "string"
    ? [highlightKeys]
    : []).filter((k): k is string => typeof k === "string");
  const highlightSet = new Set(normalizedHighlightKeys.map((k) => k.toLowerCase()));

  const activeKeys = new Set<object>();
  for (const row of KEYBOARD_ROWS) {
    for (const key of row) {
      if (key.chars.some((c) => highlightSet.has(c.toLowerCase()))) {
        activeKeys.add(key);
      }
    }
  }
  if (highlightShift === "left") activeKeys.add(KEYBOARD_ROWS[3][0]);
  if (highlightShift === "right") activeKeys.add(KEYBOARD_ROWS[3][11]);

  const leftImg  = leftHandImg  ? `/hands/${leftHandImg}.png`  : null;
  const rightImg = rightHandImg ? `/hands/${rightHandImg}.png` : null;
  const showHands = !!(leftImg || rightImg);

  // Match drill keyboard scale so hand overlays align correctly
  const KEY_W = 2.9;

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/*
       * Outer wrapper: position:relative so hand images (absolute) are
       * anchored to the keyboard card's top-left corner.
       * The paddingBottom reserves vertical room for hands below the rows.
       */}
      <div
        className="relative"
        style={{ paddingBottom: showHands ? "190px" : undefined }}
      >
        {/* ── Keyboard card ── */}
        <div
          className="relative z-10 p-3"
        >
          <div className="flex flex-col gap-1">
            {KEYBOARD_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-0.5">
                {row.map((key, keyIdx) => {
                  const isActive  = activeKeys.has(key);
                  const finger    = key.finger.finger;
                  const widthRem  = (key.width ?? 1) * KEY_W;
                  const isHomeRow = key.chars.some((c) => HOME_ROW_KEYS.has(c));
                  return (
                    <div
                      key={`${rowIdx}-${keyIdx}`}
                      style={{ minWidth: `${widthRem}rem`, maxWidth: `${widthRem}rem` }}
                      className={[
                        "relative h-10 rounded-md flex items-center justify-center",
                        "text-[11px] font-semibold select-none transition-colors duration-150",
                        "border-b-2",
                        isActive
                          ? [
                              FINGER_COLOR[finger].bg,
                              "border-transparent text-white",
                              `ring-2 ${FINGER_COLOR[finger].ring}`,
                            ].join(" ")
                          : [
                              FINGER_COLOR_PASSIVE[finger],
                              "border-b-gray-300/60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400",
                            ].join(" "),
                      ].join(" ")}
                    >
                      {key.label}
                      {isHomeRow && (
                        <span
                          className={[
                            "absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                            isActive ? "bg-white/70" : "bg-gray-400/50",
                          ].join(" ")}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Finger-colour legend */}
          {showLegend && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-slate-700
              flex flex-wrap gap-x-4 gap-y-1 justify-center">
              {(["pinky","ring","middle","index","thumb"] as const).map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-[9px] text-gray-400 font-medium">
                  <span className={`inline-block w-2 h-2 rounded-full ${FINGER_COLOR[f].bg}`} />
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/*
         * Hand PNG overlay.
         * Anchored to the keyboard card's outer wrapper (position:relative).
         * Percentages match VirtualKeyboard's HandOverlay exactly — left/right
         * hands bleed slightly outside the keyboard width on both sides, which
         * is intentional (mirrors typing.com's layout).
         */}
        {showHands && (
          <div
            className="pointer-events-none z-20"
            style={{
              position: "absolute",
              left: 0,
              top: "-10%",
              width: "100%",
              height: "100%",
            }}
          >
            {leftImg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={leftImg}
                alt="left hand"
                style={{
                  position: "absolute",
                  left: "-19%",
                  top: "0%",
                  width: "72%",
                  height: "auto",
                }}
              />
            )}
            {rightImg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={rightImg}
                alt="right hand"
                style={{
                  position: "absolute",
                  left: "31%",
                  top: "2%",
                  width: "82%",
                  height: "auto",
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── KeyPressScreen ───────────────────────────────────────────────────────────
//  Full-screen keyboard drill: highlight one key, user must press it N times.
//  Replaces the normal text+keyboard layout when page.keyPressMode === true.

function GuideKeyboardScene({
  highlightKeys,
  highlightShift,
  leftHandImg,
  rightHandImg,
  animated = false,
}: {
  highlightKeys: string[];
  highlightShift?: "left" | "right";
  leftHandImg?: string;
  rightHandImg?: string;
  animated?: boolean;
}) {
  const content = (
    <div
      className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 via-white to-blue-50 border border-slate-200 shadow-inner rounded-[24px]"
      style={{ clipPath: "polygon(10% 0%, 100% 0%, 100% 88%, 90% 100%, 0% 100%, 0% 12%)" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
      <div className="absolute left-1/2 top-7 -translate-x-1/2 origin-top scale-[0.4] sm:scale-[0.43]">
        <IntroKeyboard
          highlightKeys={highlightKeys}
          highlightShift={highlightShift}
          leftHandImg={leftHandImg}
          rightHandImg={rightHandImg}
          showLegend={false}
        />
      </div>
    </div>
  );

  if (!animated) return content;

  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
    >
      {content}
    </motion.div>
  );
}

function GuideStepCard({
  step,
  title,
  note,
  children,
}: {
  step: string;
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex w-9 h-9 rounded-2xl bg-blue-600 text-white text-sm font-black items-center justify-center shadow-sm">
          {step}
        </span>
        <div>
          <h4 className="text-sm font-bold text-slate-800 leading-tight">{title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{note}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ShiftPunctuationGuide({ lang }: { lang: "en" | "bn" }) {
  const copy = lang === "bn"
    ? {
        step1: "বড় হাতের অক্ষর",
        note1: "অক্ষর টাইপের বিপরীত হাতের Shift ধরুন",
        step2: "কমা",
        note2: "ডান হাতের মধ্যমা দিয়ে , চাপুন",
        step3: "ফুলস্টপ",
        note3: "ডান হাতের অনামিকা দিয়ে . চাপুন",
        shift: "Shift",
      }
    : {
        step1: "Capital Letter",
        note1: "Hold the opposite-hand Shift with the letter",
        step2: "Comma",
        note2: "Press , with your right middle finger",
        step3: "Period",
        note3: "Press . with your right ring finger",
        shift: "Shift",
      };

  return (
    <div className="w-full px-8 pb-8 pt-8">
      <div className="grid gap-5 lg:grid-cols-3">
        <GuideStepCard step="1" title={copy.step1} note={copy.note1}>
          <GuideKeyboardScene
            highlightKeys={["a"]}
            highlightShift="right"
            leftHandImg="left-home-row-5"
            rightHandImg="right-bottom-row-6"
          />
        </GuideStepCard>

        <GuideStepCard step="2" title={copy.step2} note={copy.note2}>
          <GuideKeyboardScene
            highlightKeys={[","]}
            leftHandImg="left-resting-hand"
            rightHandImg="right-bottom-row-3"
          />
        </GuideStepCard>

        <GuideStepCard step="3" title={copy.step3} note={copy.note3}>
          <GuideKeyboardScene
            highlightKeys={["."]}
            leftHandImg="left-resting-hand"
            rightHandImg="right-bottom-row-4"
            animated
          />
        </GuideStepCard>
      </div>
    </div>
  );
}

const KEY_PRESS_REQUIRED = 5;

function KeyPressScreen({
  page,
  onAdvance,
  onBack,
  isFirst,
  lang,
}: {
  page: IntroPage;
  onAdvance: () => void;
  onBack: () => void;
  isFirst: boolean;
  lang: "en" | "bn";
}) {
  const pageHighlightKeys = (Array.isArray(page.highlightKeys)
    ? page.highlightKeys
    : typeof page.highlightKeys === "string"
    ? [page.highlightKeys]
    : []).filter((k): k is string => typeof k === "string");
  const targetKeys  = pageHighlightKeys.map((k) => k.toLowerCase());
  const displayKey  = pageHighlightKeys[0] ?? "";
  const isSpace     = displayKey === " ";

  const [count,  setCount]  = useState(0);
  const [flash,  setFlash]  = useState<"correct" | "wrong" | null>(null);

  // Derive done from count — no separate state needed
  const isDone   = count >= KEY_PRESS_REQUIRED;

  // Keep a stable ref to onAdvance so the timeout always calls the latest version
  const onAdvanceRef    = useRef(onAdvance);
  useEffect(() => { onAdvanceRef.current = onAdvance; }, [onAdvance]);

  // Schedule the auto-advance exactly once when the target is hit.
  // The advancedRef guard prevents StrictMode's double-effect-invocation
  // from calling onAdvance twice (which would push pageIdx out of bounds).
  const advancedRef = useRef(false);
  useEffect(() => {
    if (!isDone) { advancedRef.current = false; return; }
    if (advancedRef.current) return;
    advancedRef.current = true;
    const id = setTimeout(() => onAdvanceRef.current(), 900);
    return () => clearTimeout(id);
  }, [isDone]);

  useEffect(() => {
    if (isDone) return;
    const handler = (e: KeyboardEvent) => {
      // Prevent browser default (e.g. scrolling on Space)
      if (targetKeys.includes(" ") && e.key === " ") e.preventDefault();

      const pressed = e.key.toLowerCase();
      const isCorrect =
        targetKeys.includes(pressed) ||
        (isSpace && e.key === " ");

      if (isCorrect) {
        setFlash("correct");
        setTimeout(() => setFlash(null), 280);
        setCount((prev) => Math.min(prev + 1, KEY_PRESS_REQUIRED));
      } else {
        setFlash("wrong");
        setTimeout(() => setFlash(null), 280);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isDone, targetKeys, isSpace]);

  const highlightSet = new Set(targetKeys);
  const KEY_W = 2.9; // rem per unit — slightly larger than IntroKeyboard
  const showHands = !!(page.leftHandImg || page.rightHandImg);

  return (
    <div className={`flex-1 min-h-0 flex flex-col bg-white dark:bg-slate-800${lang === "bn" ? " font-bn" : ""}`}>

      {/* ── Key display + progress ── */}
      <div className="shrink-0 flex flex-col items-center justify-center gap-3 py-5
        bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-800
        border-b border-slate-100 dark:border-slate-700">

        <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
          {lang === "bn" ? "এই কীটি চাপুন:" : "Press this key:"}
        </p>

        {/* Big animated key cap */}
        <motion.div
          key={flash}
          animate={
            flash === "correct"
              ? { scale: [1, 1.28, 1] }
              : flash === "wrong"
              ? { x: [-6, 6, -6, 0] }
              : {}
          }
          transition={{ duration: 0.28 }}
          className={[
            "w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl border-b-[6px]",
            "text-4xl font-black select-none transition-colors duration-150",
            isDone
              ? "bg-emerald-500 border-emerald-700 text-white"
              : flash === "correct"
              ? "bg-emerald-500 border-emerald-700 text-white"
              : flash === "wrong"
              ? "bg-red-400 border-red-600 text-white"
              : "bg-blue-600 border-blue-800 text-white",
          ].join(" ")}
        >
          {isDone
            ? "✓"
            : isSpace
            ? (lang === "bn" ? "স্পেস" : "Space")
            : displayKey.toUpperCase()}
        </motion.div>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: KEY_PRESS_REQUIRED }).map((_, i) => (
            <motion.div
              key={i}
              animate={i === count - 1 ? { scale: [1, 1.5, 1] } : {}}
              transition={{ duration: 0.25 }}
              className={`w-4 h-4 rounded-full border-2 transition-colors duration-200 ${
                i < count
                  ? "bg-emerald-500 border-emerald-600"
                  : "bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500"
              }`}
            />
          ))}
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-1 tabular-nums">
            {count}/{KEY_PRESS_REQUIRED}
          </span>
        </div>

        {isDone && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-400"
          >
            {lang === "bn" ? "চমৎকার! ✓" : "Excellent! ✓"}
          </motion.p>
        )}
      </div>

      {/* ── Full-width keyboard (fills remaining height) ── */}
      <div className="flex-1 min-h-0 overflow-hidden
        flex items-start justify-center px-3 pt-4 pb-2">
        <div
          className="relative"
          style={{ paddingBottom: showHands ? "190px" : undefined }}
        >
          {/* Keyboard */}
          <div className="relative z-10 p-3">
            <div className="flex flex-col gap-1">
              {KEYBOARD_ROWS.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-0.5">
                  {row.map((key, keyIdx) => {
                    const isActive = key.chars.some((c) =>
                      highlightSet.has(c.toLowerCase())
                    );
                    const isJustPressed = isActive && flash === "correct";
                    const finger   = key.finger.finger;
                    const widthRem = (key.width ?? 1) * KEY_W;
                    const isHomeKey = key.chars.some((c) => HOME_ROW_KEYS.has(c));
                    return (
                      <div
                        key={`${rowIdx}-${keyIdx}`}
                        style={{
                          minWidth: `${widthRem}rem`,
                          maxWidth: `${widthRem}rem`,
                        }}
                        className={[
                          "relative h-10 rounded-md flex items-center justify-center",
                          "text-[11px] font-semibold select-none transition-all duration-150",
                          "border-b-2",
                          isJustPressed
                            ? "bg-emerald-500 border-transparent text-white ring-2 ring-emerald-300 scale-110 shadow-lg"
                            : isActive
                            ? [
                                FINGER_COLOR[finger].bg,
                                "border-transparent text-white",
                                `ring-2 ${FINGER_COLOR[finger].ring}`,
                                "scale-105 shadow-md -translate-y-0.5",
                              ].join(" ")
                            : [
                                FINGER_COLOR_PASSIVE[finger],
                                "border-b-gray-300/60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400",
                              ].join(" "),
                        ].join(" ")}
                      >
                        {key.label}
                        {isHomeKey && (
                          <span
                            className={[
                              "absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                              isActive ? "bg-white/70" : "bg-gray-400/50",
                            ].join(" ")}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Finger-colour legend */}
            <div className="mt-2 pt-2 flex flex-wrap gap-x-4 gap-y-1 justify-center">
              {(["pinky","ring","middle","index","thumb"] as const).map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-[9px] text-gray-400 font-medium">
                  <span className={`inline-block w-2 h-2 rounded-full ${FINGER_COLOR[f].bg}`} />
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </span>
              ))}
            </div>
          </div>

          {/* Hand PNG overlay */}
          {showHands && (
            <div
              className="pointer-events-none z-20"
              style={{
                position: "absolute",
                left: 0,
                top: "-10%",
                width: "100%",
                height: "100%",
              }}
            >
              {page.leftHandImg && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/hands/${page.leftHandImg}.png`}
                  alt="left hand"
                  style={{
                    position: "absolute",
                    left: "-19%",
                    top: "0%",
                    width: "72%",
                    height: "auto",
                  }}
                />
              )}
              {page.rightHandImg && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/hands/${page.rightHandImg}.png`}
                  alt="right hand"
                  style={{
                    position: "absolute",
                    left: "31%",
                    top: "2%",
                    width: "82%",
                    height: "auto",
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200
        dark:border-slate-700 px-6 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={isFirst}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
            border border-slate-300 dark:border-slate-600
            text-slate-600 dark:text-slate-300 text-sm font-medium
            hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors
            ${isFirst ? "invisible pointer-events-none" : ""}`}
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "bn" ? "পূর্ববর্তী" : "Back"}
        </button>

        <button
          onClick={onAdvance}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
            border border-slate-200 dark:border-slate-600
            text-slate-400 dark:text-slate-500 text-xs
            hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          {lang === "bn" ? "এড়িয়ে যান" : "Skip"}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function IntroViewer({
  drill,
  onDone,
  onCancel,
  onHome,
}: {
  drill: Drill;
  onDone: () => void;
  onCancel: () => void;
  onHome: () => void;
}) {
  const [pageIdx, setPageIdx] = useState(0);
  const [showDone, setShowDone] = useState(false);
  const { lang } = useLang();

  const pages: IntroPage[] = drill.pages ?? [{ title: drill.title, body: drill.content }];
  const page    = pages[pageIdx];
  const isFirst = pageIdx === 0;
  const isLast  = pageIdx === pages.length - 1;
  const total   = pages.length;
  const isTip   = drill.type === "tip";

  const title  = lang === "bn" && page.titleBn ? page.titleBn : page.title;
  const body   = lang === "bn" && page.bodyBn  ? page.bodyBn  : page.body;

  const nextLabel   = lang === "bn" ? (isLast ? "সামনে যান" : "পরেরটি") : (isLast ? "Forward" : "Next");
  const prevLabel   = lang === "bn" ? "পূর্ববর্তী" : "Back";
  const cancelLabel = lang === "bn" ? "বাতিল" : "Cancel";
  const pageLabel   = total > 1
    ? (lang === "bn" ? `পাতা ${pageIdx + 1} / ${total}` : `Page ${pageIdx + 1} of ${total}`)
    : null;

  const hasVisualGuide = !!page.visualGuide;
  const imageIsHand = typeof page.image === "string" && page.image.startsWith("/hands/");
  const handImageName = imageIsHand
    ? (typeof page.image === "string" ? page.image.replace("/hands/", "").replace(".png", "") : null)
    : null;
  const derivedLeftHand = handImageName && handImageName.startsWith("left-") ? handImageName : undefined;
  const derivedRightHand = handImageName && handImageName.startsWith("right-") ? handImageName : undefined;
  const normalizedPageHighlightKeys = (Array.isArray(page.highlightKeys)
    ? page.highlightKeys
    : typeof page.highlightKeys === "string"
    ? [page.highlightKeys]
    : []).filter((k): k is string => typeof k === "string");
  const homeRowKeyList = Array.from(HOME_ROW_KEYS).filter((k): k is string => typeof k === "string");
  const keyboardHighlightKeys = normalizedPageHighlightKeys.length > 0
    ? normalizedPageHighlightKeys
    : imageIsHand
    ? homeRowKeyList
    : [];
  const keyboardLeftHand = page.leftHandImg ?? derivedLeftHand;
  const keyboardRightHand = page.rightHandImg ?? derivedRightHand;
  const showKeyboard = keyboardHighlightKeys.length > 0 || imageIsHand;
  const hasKeyboardOrImage = showKeyboard || (!!page.image && !imageIsHand);

  const accentCls = isTip
    ? "bg-amber-500 hover:bg-amber-600"
    : "bg-blue-600 hover:bg-blue-700";

  const isKeyPressPage = !showDone && !!page.keyPressMode;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className={`flex flex-col flex-1 min-h-0 overflow-hidden${
        isKeyPressPage
          ? ""
          : " rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700"
      }${lang === "bn" ? " font-bn" : ""}`}
    >
      {/* Header */}
      <div className={`shrink-0 px-7 pt-5 pb-4 ${isTip ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-gradient-to-r from-blue-700 to-blue-500"}`}>
        <div className="flex items-center gap-3">
          <span className="text-white/90 text-2xl leading-none">{isTip ? "💡" : "📖"}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={pageIdx + "-title"}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              className="text-white font-bold text-xl leading-snug"
            >
              {title}
            </motion.h2>
          </AnimatePresence>
        </div>
        {/* Page progress dots */}
        {total > 1 && (
          <div className="flex gap-1.5 mt-3">
            {pages.map((_, pi) => (
              <button
                key={pi}
                onClick={() => setPageIdx(pi)}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  pi === pageIdx
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Body + Footer — swapped to KeyPressScreen on keyPressMode pages */}
      {page.keyPressMode && !showDone ? (
        <KeyPressScreen
          key={pageIdx}
          page={page}
          onAdvance={() => isLast ? setShowDone(true) : setPageIdx(p => p + 1)}
          onBack={() => setPageIdx(p => p - 1)}
          isFirst={isFirst}
          lang={lang}
        />
      ) : (
        <>
      {/* Body — grows to fill all remaining space */}
      <div className={`flex-1 min-h-0 bg-white dark:bg-slate-800 ${showDone ? "hidden" : "flex flex-col overflow-hidden"}`}>

        {/* ── Text section ── always at top, limited height so keyboard gets room */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pageIdx + "-body"}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className={
              hasVisualGuide
                ? "shrink-0 px-8 pt-6 pb-5 border-b border-slate-100 dark:border-slate-700 space-y-1"
                : hasKeyboardOrImage
                ? "shrink-0 max-h-[350px] overflow-y-auto px-8 py-5 border-b border-slate-100 dark:border-slate-700 space-y-1"
                : "flex-1 px-8 py-6 overflow-y-auto space-y-1"
            }
          >
            {renderBody(body, isTip ? "amber" : "blue")}
          </motion.div>
        </AnimatePresence>

        {/* ── Keyboard visualisation (below text, full width) ── */}
        {showKeyboard && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pageIdx + "-kb"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.18 }}
              className="flex-1 min-h-0 overflow-hidden
                bg-slate-50 dark:bg-slate-800/60
                flex items-start justify-center px-6 pt-4"
            >
              <IntroKeyboard
                highlightKeys={keyboardHighlightKeys}
                leftHandImg={keyboardLeftHand}
                rightHandImg={keyboardRightHand}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Image panel (for non-keyboard pages) ── */}
        {!page.highlightKeys && page.image && !imageIsHand && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pageIdx + "-img"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex-1 min-h-0 overflow-hidden
                bg-slate-50 dark:bg-slate-800/60
                flex items-center justify-center p-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={page.image}
                alt=""
                className="max-w-full max-h-full object-contain rounded-xl shadow-md"
              />
            </motion.div>
          </AnimatePresence>
        )}

        {page.visualGuide === "shift-punctuation" && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pageIdx + "-guide"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.18 }}
              className="shrink-0 bg-slate-50 dark:bg-slate-800/60"
            >
              <ShiftPunctuationGuide lang={lang} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Footer — always pinned at bottom, fixed 3-column grid */}
      <div className={`shrink-0 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700
        px-6 py-4 items-center ${showDone ? "hidden" : "grid"}`} style={{ gridTemplateColumns: "1fr auto 1fr" }}>

        {/* Left: Cancel + Back (Back is invisible on page 1 but still takes space) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="min-w-[80px] px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600
              text-slate-500 dark:text-slate-400 text-sm font-medium text-center
              hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => setPageIdx(p => p - 1)}
            disabled={isFirst}
            className={`min-w-[90px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl
              border border-slate-300 dark:border-slate-600
              text-slate-600 dark:text-slate-300 text-sm font-medium
              hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors
              ${isFirst ? "invisible pointer-events-none" : ""}`}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {prevLabel}
          </button>
        </div>

        {/* Centre: page counter — always present, empty span when single page */}
        <div className="flex justify-center px-4">
          <span className={`text-sm text-slate-400 whitespace-nowrap${lang === "bn" ? " font-bn" : ""}`}>
            {pageLabel ?? ""}
          </span>
        </div>

        {/* Right: Next / Forward — fixed min-width so label change doesn't shift it */}
        <div className="flex justify-end">
          <button
            onClick={() => isLast ? setShowDone(true) : setPageIdx(p => p + 1)}
            className={`min-w-[120px] inline-flex items-center justify-center gap-2 px-5 py-2.5
              rounded-xl text-white text-sm font-semibold transition-colors ${accentCls}`}
          >
            {nextLabel}
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
        </>
      )}

      {/* ── Intro Done screen — appears after last page Forward ── */}
      {showDone && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex-1 min-h-0 flex flex-col items-center justify-center gap-7 px-8 py-10
            bg-white dark:bg-slate-800 overflow-y-auto${lang === "bn" ? " font-bn" : ""}`}
        >
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", bounce: 0.45 }}
            className="text-[80px] leading-none select-none"
          >🎉</motion.div>

          <div className="text-center">
            <h3 className="text-2xl font-black text-blue-700 dark:text-blue-400 mb-3">
              {lang === "bn" ? "অভিনন্দন!" : "Congratulations!"}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-[17px] leading-relaxed max-w-md">
              {lang === "bn"
                ? "আপনি এবার টাচ টাইপিং এর জন্য সম্পূর্ণ প্রস্তুত! পরের ধাপে আমরা শুরু করব।"
                : "You are now fully ready for touch typing! In the next step, let's begin."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <button
              onClick={onHome}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                rounded-xl border border-slate-300 dark:border-slate-600
                text-slate-600 dark:text-slate-300 text-sm font-semibold
                hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              🏠 {lang === "bn" ? "হোমে যান" : "Go Home"}
            </button>
            <button
              onClick={() => { setShowDone(false); setPageIdx(0); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                rounded-xl border border-slate-300 dark:border-slate-600
                text-slate-600 dark:text-slate-300 text-sm font-semibold
                hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              🔄 {lang === "bn" ? "আবার চেষ্টা করুন" : "Try Again"}
            </button>
            <button
              onClick={onDone}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                rounded-xl text-white text-sm font-bold transition-colors ${accentCls}`}
            >
              ▶ {lang === "bn" ? "পরবর্তী লেসন শুরু করুন" : "Next Lesson"}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── LessonCompleteOverlay ────────────────────────────────────────────────────

function LessonCompleteOverlay({
  lesson,
  stats,
  onHome,
  onRetry,
  onNextLesson,
}: {
  lesson: Lesson;
  stats: DrillCompleteStats | null;
  onHome: () => void;
  onRetry: () => void;
  onNextLesson: () => void;
}) {
  const { lang } = useLang();
  const wpm   = stats?.wpm      ?? 0;
  const acc   = stats?.accuracy ?? 0;
  const stars = wpm >= 40 ? 3 : wpm >= 25 ? 2 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      exit={   { opacity: 0, scale: 0.88, y: 20 }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.28 }}
      className="flex-1 min-h-0 flex items-center justify-center py-6 overflow-y-auto"
    >
      <div className={`bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200
        dark:border-slate-700 p-10 max-w-lg w-full flex flex-col items-center gap-6 text-center
        ${lang === "bn" ? "font-bn" : ""}`}>

        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate:   0 }}
          transition={{ delay: 0.15, type: "spring", bounce: 0.5 }}
          className="text-[84px] leading-none select-none"
        >🏆</motion.div>

        {/* Stars */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.3 }}
          className="flex gap-3"
        >
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate:   0 }}
              transition={{ delay: 0.35 + i * 0.1, type: "spring", bounce: 0.5 }}
              className={`text-4xl ${i < stars ? "" : "grayscale opacity-30"}`}
            >⭐</motion.span>
          ))}
        </motion.div>

        {/* Title + lesson name */}
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-1">
            {lang === "bn" ? "লেসন সম্পন্ন!" : "Lesson Complete!"}
          </h2>
          <p className="text-slate-400 text-sm">{lesson.title}</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-4">
              <p className="text-3xl font-black text-blue-700 dark:text-blue-400">{wpm}</p>
              <p className="text-xs text-blue-500 font-semibold mt-0.5 uppercase tracking-wide">WPM</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-4">
              <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400">{acc}%</p>
              <p className="text-xs text-emerald-500 font-semibold mt-0.5 uppercase tracking-wide">
                {lang === "bn" ? "নির্ভুলতা" : "Accuracy"}
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onNextLesson}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl
              bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] transition-colors"
          >
            ▶ {lang === "bn" ? "পরবর্তী লেসন শুরু করুন" : "Start Next Lesson"}
          </button>
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl
              border border-slate-300 dark:border-slate-600
              text-slate-600 dark:text-slate-300 font-semibold text-[15px]
              hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            🔄 {lang === "bn" ? "আবার চেষ্টা করুন" : "Try Lesson Again"}
          </button>
          <button
            onClick={onHome}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl
              border border-slate-300 dark:border-slate-600
              text-slate-400 dark:text-slate-500 font-medium text-[14px]
              hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            🏠 {lang === "bn" ? "হোমে যান" : "Go Home"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── DrillResults ─────────────────────────────────────────────────────────────

function Breadcrumb({
  view,
  onNavigate,
}: {
  view: View;
  onNavigate: (v: View) => void;
}) {
  const { lang } = useLang();
  const parts: { label: string; action: () => void }[] = [
    { label: lang === "bn" ? "পাঠ্যক্রম" : "Curriculum", action: () => onNavigate({ kind: "module", mod: ENGLISH_COURSE.modules[0] }) },
  ];
  if (view.kind === "lesson" || view.kind === "drill") {
    const v = view as Extract<View, { lesson: Lesson }>;
    parts.push({ label: getLessonTitle(v.lesson, lang), action: () => onNavigate({ kind: "lesson", mod: v.mod, lesson: v.lesson }) });
  }
  if (view.kind === "drill") {
    const v = view as Extract<View, { drill: Drill }>;
    parts.push({ label: getDrillTitle(v.drill, lang), action: () => {} });
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 flex-wrap">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
          <button
            onClick={p.action}
            className={`hover:text-slate-700 dark:hover:text-slate-200 transition-colors ${i === parts.length - 1 ? "text-slate-700 dark:text-slate-200 font-semibold pointer-events-none" : ""}`}
          >
            {p.label}
          </button>
        </span>
      ))}
    </nav>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LessonsPage() {
  const { lang } = useLang();
  // Start with DEFAULT_VIEW so server and client render the same HTML (no hydration mismatch).
  // The correct view is restored from the URL on the first client-side effect below.
  const [view,               setView]               = useState<View>(DEFAULT_VIEW);
  const [mounted,            setMounted]            = useState(false);
  const [stats,              setStats]              = useState<DrillCompleteStats | null>(null);
  const [showResult,         setShowResult]         = useState(false);
  const [showLessonComplete, setShowLessonComplete] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [completedLesson,    setCompletedLesson]    = useState<{ mod: Module; lesson: Lesson } | null>(null);
  const [focusPracticeBaseline, setFocusPracticeBaseline] = useState<DrillCompleteStats | null>(null);
  const [focusPracticeReturnView, setFocusPracticeReturnView] = useState<Extract<View, { kind: "drill" }> | null>(null);

  // ── localStorage progress store — hydration-safe, always reflects persisted state ──
  // isMounted gates checkmark rendering so server HTML matches client initial render.
  const { isMounted: progressMounted, completedDrills, drillStars, markDrillCompleted, updateDrillStars } = useProgressStore();

  // ── API/position tracking for signed-in users ──
  const { lastPosition, isLoaded, markComplete, savePosition } = useProgress();

  // ── Restore view from URL on first client render ──────────────────────────
  // URL params survive refresh; no async gaps, no hydration mismatches.
  useEffect(() => {
    setView(viewFromSearch(window.location.search));
    setMounted(true);
  }, []); // intentionally empty — only run on mount

  // ── For signed-in users: override view from API last-position if URL is bare ──
  const hasAutoResumed = useRef(false);
  useEffect(() => {
    if (hasAutoResumed.current || !isLoaded || !lastPosition) return;
    hasAutoResumed.current = true;
    // Only apply if the URL has no view param (fresh navigation, not a bookmarked drill)
    if (new URLSearchParams(window.location.search).has("v")) return;
    const mod = ENGLISH_COURSE.modules.find(m => m.id === lastPosition.modId);
    if (!mod) return;
    const lesson = mod.lessons.find(l => l.id === lastPosition.lessonId);
    if (!lesson) return;
    const drillIdx = lesson.drills.findIndex(d => d.id === lastPosition.drillId);
    if (drillIdx < 0) return;
    navigate({ kind: "drill", mod, lesson, drill: lesson.drills[drillIdx], drillIdx });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, lastPosition]); // navigate intentionally omitted to avoid loop

  const navigate = useCallback((v: View) => {
    setView(v);
    setStats(null);
    setShowResult(false);
    setShowLessonComplete(false);
    setFocusPracticeBaseline(null);
    setFocusPracticeReturnView(null);
    // Encode view into URL — this is what survives a page refresh
    const search = viewToSearch(v);
    window.history.replaceState(null, "", search ? `/lessons?${search}` : "/lessons");
    if (v.kind === "drill") {
      savePosition(v.drill.id, v.lesson.id, v.mod.id);
    }
  }, [savePosition]);

  const handleComplete = useCallback((s: DrillCompleteStats) => {
    if (view.kind !== "drill") return;
    const { mod, lesson, drill, drillIdx } = view;
    const isFocusedPracticeDrill = drill.id.startsWith("adaptive-practice-");

    if (isFocusedPracticeDrill) {
      setStats(s);
      setShowResult(true);
      return;
    }

    // 1. Persist to localStorage immediately (useProgressStore)
    markDrillCompleted(drill.id);
    updateDrillStars(drill.id, calcStars(drill, s.wpm, s.accuracy));
    // 2. Sync to API for signed-in users (useProgress)
    markComplete(drill.id, lesson.id, mod.id);
    setStats(s);
    // Last drill in lesson → skip DrillResults, go straight to LessonCompleteOverlay
    // This ensures the tick appears even without clicking "Next"
    if (drillIdx + 1 >= lesson.drills.length) {
      setCompletedLesson({ mod, lesson });
      setShowLessonComplete(true);
    } else {
      setShowResult(true);
    }
  }, [view, markComplete, markDrillCompleted, updateDrillStars]);

  const handleFocusedPractice = useCallback(() => {
    if (view.kind !== "drill" || !stats) return;
    const adaptive = buildAdaptivePracticeDrill(view.drill, stats);
    setShowResult(false);
    setStats(null);
    setFocusPracticeBaseline(stats);
    setFocusPracticeReturnView(view);
    setView({ kind: "drill", mod: view.mod, lesson: view.lesson, drill: adaptive, drillIdx: view.drillIdx });
  }, [view, stats]);

  const handleRetry = useCallback(() => { setStats(null); setShowResult(false); setRetryKey(k => k + 1); }, []);

  const handleNext = useCallback(() => {
    if (view.kind !== "drill") return;
    const { mod, lesson, drillIdx, drill } = view;

    if (drill.id.startsWith("adaptive-practice-")) {
      setShowResult(false);
      setStats(null);
      if (focusPracticeReturnView) {
        setView(focusPracticeReturnView);
      }
      setFocusPracticeBaseline(null);
      setFocusPracticeReturnView(null);
      return;
    }

    setShowResult(false);
    setStats(null);
    if (drillIdx + 1 < lesson.drills.length) {
      const nextDrill = lesson.drills[drillIdx + 1];
      setView({ kind: "drill", mod, lesson, drill: nextDrill, drillIdx: drillIdx + 1 });
      savePosition(nextDrill.id, lesson.id, mod.id);
    } else {
      // Last drill done → show lesson complete overlay
      setCompletedLesson({ mod, lesson });
      setShowLessonComplete(true);
    }
  }, [view, savePosition, focusPracticeReturnView]);

  const handleLessonHome = useCallback(() => {
    setShowLessonComplete(false);
    setStats(null);
    // Return to the lesson's drill list, not the module overview
    if (completedLesson) navigate({ kind: "lesson", mod: completedLesson.mod, lesson: completedLesson.lesson });
  }, [completedLesson, navigate]);

  const handleLessonRetry = useCallback(() => {
    if (!completedLesson) return;
    const { mod, lesson } = completedLesson;
    setShowLessonComplete(false);
    setStats(null);
    navigate({ kind: "drill", mod, lesson, drill: lesson.drills[0], drillIdx: 0 });
  }, [completedLesson, navigate]);

  const handleNextLesson = useCallback(() => {
    if (!completedLesson) return;
    const { mod, lesson } = completedLesson;
    const lessonIdx = mod.lessons.findIndex(l => l.id === lesson.id);
    setShowLessonComplete(false);
    setStats(null);
    if (lessonIdx + 1 < mod.lessons.length) {
      navigate({ kind: "lesson", mod, lesson: mod.lessons[lessonIdx + 1] });
    } else {
      navigate({ kind: "module", mod });
    }
  }, [completedLesson, navigate]);

  const handleMiniGame = useCallback(() => {
    setShowResult(false);
    window.location.href = "/games";
  }, []);

  const isFocusedPracticeView = view.kind === "drill" && view.drill.id.startsWith("adaptive-practice-");

  // ── Render ──
  // Don't render until the mount effect has read the URL and set the correct view.
  // This prevents a flash of DEFAULT_VIEW before the URL-based view is applied.
  if (!mounted) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const isDrill = view.kind === "drill";

  return (
    <>
    {/* ── Focus overlay — covers sidebar/topbar/footer when a drill is active ── */}
    <AnimatePresence>
      {isDrill && (
        <motion.div
          key="focus-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 z-50 ${["falling","fighter"].includes(view.drill.type) ? "bg-[#e2e8f0] dark:bg-slate-900" : "bg-gray-50 dark:bg-slate-950"} flex flex-col`}
        >
          <div className={`flex-1 min-h-0 w-full mx-auto flex flex-col gap-4 ${["falling","fighter"].includes(view.drill.type) ? "max-w-none px-0 py-0" : "max-w-5xl px-6 py-10"}`}>
            {/* Breadcrumb inside focus mode */}
            {!["falling","fighter"].includes(view.drill.type) && (
              <Breadcrumb view={view} onNavigate={navigate} />
            )}

            {/* Intro / Tip viewer */}
            {(view.drill.type === "intro" || view.drill.type === "tip") && (
              <IntroViewer
                key={view.drill.id}
                drill={view.drill}
                onDone={() => {
                  const { mod, lesson, drill, drillIdx } = view as Extract<View, { kind: "drill" }>;
                  // Persist to localStorage immediately, then sync to API
                  markDrillCompleted(drill.id);
                  markComplete(drill.id, lesson.id, mod.id);
                  if (drillIdx + 1 < lesson.drills.length) {
                    navigate({ kind: "drill", mod, lesson, drill: lesson.drills[drillIdx + 1], drillIdx: drillIdx + 1 });
                  } else {
                    // Last drill in lesson was an intro — show lesson complete
                    setCompletedLesson({ mod, lesson });
                    setShowLessonComplete(true);
                  }
                }}
                onCancel={() => {
                  const { mod, lesson } = view as Extract<View, { kind: "drill" }>;
                  navigate({ kind: "lesson", mod, lesson });
                }}
                onHome={() => {
                  const { mod, lesson, drill } = view as Extract<View, { kind: "drill" }>;
                  // Mark complete before navigating away (user finished the intro)
                  markDrillCompleted(drill.id);
                  markComplete(drill.id, lesson.id, mod.id);
                  navigate({ kind: "lesson", mod, lesson });
                }}
              />
            )}

            {/* Typing engine drills */}
            {view.drill.type !== "intro" && view.drill.type !== "tip" && !showLessonComplete && (
              <motion.div
                key={view.drill.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className={view.drill.type === "fighter"
                  ? "min-h-screen w-full flex flex-col"
                  : ["falling"].includes(view.drill.type)
                    ? "min-h-screen w-full flex flex-col pt-4 px-6 md:px-12"
                    : ""
                }
              >
                {view.drill.type !== "fighter" && (
                  <div className={`flex items-center gap-2 mb-4 ${["falling"].includes(view.drill.type) ? "absolute top-6 left-6 md:left-12 z-60" : ""}`}>
                    <button
                      onClick={() => navigate({ kind: "lesson", mod: view.mod, lesson: view.lesson })}
                      className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> {lang === "bn" ? "লেসনে ফিরুন" : "Back to lesson"}
                    </button>
                  </div>
                )}
                {view.drill.type === "key" ? (
                  <KeyDrillEngine key={`${view.drill.id}-${retryKey}`}
                    drill={view.drill}
                    onComplete={handleComplete}
                  />
                ) : view.drill.type === "pairs" ? (
                  <PairsDrillEngine key={`${view.drill.id}-${retryKey}`}
                    drill={view.drill}
                    onComplete={handleComplete}
                  />
                ) : view.drill.type === "falling" ? (
                  <FallingLettersEngine key={`${view.drill.id}-${retryKey}`}
                      drill={view.drill}
                      onComplete={handleComplete}
                    />
                  ) : view.drill.type === "fighter" ? (
                    <FighterPlaneEngine key={`${view.drill.id}-${retryKey}`}
                      drill={view.drill}
                      onBack={() => navigate({ kind: "lesson", mod: view.mod, lesson: view.lesson })}
                      backLabel={lang === "bn" ? "লেসনে ফিরুন" : "Back to lesson"}
                      onComplete={handleComplete}
                    />
                  ) : (
                  <GamifiedTypingEngine key={`${view.drill.id}-${retryKey}`}
                    drill={view.drill}
                    showKeyboard={true}
                    onComplete={handleComplete}
                  />
                )}
              </motion.div>
            )}

            {/* Results modal */}
            {stats && !showLessonComplete && (
              <DrillResults
                drill={view.drill}
                stats={stats}
                show={showResult}
                onRetry={handleRetry}
                onNext={handleNext}
                onPlayMiniGame={handleMiniGame}
                onFocusedPractice={handleFocusedPractice}
                isFocusedPractice={isFocusedPracticeView}
                compareBefore={focusPracticeBaseline}
              />
            )}

            {/* Lesson complete overlay */}
            <AnimatePresence>
              {showLessonComplete && completedLesson && (
                <LessonCompleteOverlay
                  key="lesson-complete"
                  lesson={completedLesson.lesson}
                  stats={stats}
                  onHome={handleLessonHome}
                  onRetry={handleLessonRetry}
                  onNextLesson={handleNextLesson}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* ── Normal layout (module / lesson list) ── */}
    <div className={`${view.kind === "lesson" ? "max-w-6xl" : "max-w-3xl"} mx-auto flex flex-col gap-5 w-full`}>
      {/* Back button and Navigation (not on top-level) */}
      {view.kind === "lesson" && (
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => navigate({ kind: "module", mod: view.mod })}
            className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {lang === "bn" ? "ফিরে যান" : "Back"}
          </button>
          
          <div className="flex items-center gap-3">
            {view.mod.lessons.indexOf(view.lesson) > 0 && (
              <button
                onClick={() => navigate({ kind: "lesson", mod: view.mod, lesson: view.mod.lessons[view.mod.lessons.indexOf(view.lesson) - 1] })}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                {lang === "bn" ? "আগের লেসন" : "Previous Lesson"}
              </button>
            )}
            {view.mod.lessons.indexOf(view.lesson) < view.mod.lessons.length - 1 && (
              <button
                onClick={() => navigate({ kind: "lesson", mod: view.mod, lesson: view.mod.lessons[view.mod.lessons.indexOf(view.lesson) + 1] })}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors shadow-sm"
              >
                {lang === "bn" ? "পরের লেসন" : "Next Lesson"}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <Breadcrumb view={view} onNavigate={navigate} />

      <AnimatePresence mode="wait">

        {/* ── Module grid ── */}
        {view.kind === "modules" && (
          <motion.div
            key="modules"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-3"
          >
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">{lang === "bn" ? "পাঠ্যক্রম" : "Curriculum"}</h1>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-0.5">{lang === "bn" ? "হোম রো থেকে স্পিড রান পর্যন্ত প্রতিটি কী আয়ত্ত করুন।" : "Master every key from home row to speed runs."}</p>
            </div>
            {ENGLISH_COURSE.modules.map((mod) => (
              <ModuleCard
                key={mod.id}
                mod={mod}
                onClick={() => navigate({ kind: "module", mod })}
              />
            ))}
          </motion.div>
        )}

        {/* ── Lesson list ── */}
        {view.kind === "module" && (
          <motion.div
            key="module"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-3"
          >
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">{lang === "bn" ? "পাঠ্যক্রম" : "Curriculum"}</h1>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-0.5">{getModuleSubtitle(view.mod, lang)}</p>
            </div>
            {view.mod.lessons.map((lesson, lessonIdx) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                lessonIndex={lessonIdx + 1}
                // Don't show progress counts until localStorage has loaded (hydration guard)
                completedCount={progressMounted ? lesson.drills.filter(d => completedDrills.has(d.id)).length : 0}
                onClick={() => navigate({ kind: "lesson", mod: view.mod, lesson })}
              />
            ))}
          </motion.div>
        )}

        {/* ── Drill list ── */}
        {view.kind === "lesson" && (
          <motion.div
            key="lesson"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4"
          >
            {(() => {
              const lessonIdx = view.mod.lessons.indexOf(view.lesson);
              const lessonSerial = lessonIdx + 1;
              const completedCount = progressMounted ? view.lesson.drills.filter(d => completedDrills.has(d.id)).length : 0;
              return (
                <>
                  <div className="rounded-[30px] border border-slate-200 dark:border-slate-700/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(241,245,249,0.92))] dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.9))] px-5 py-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                            {lessonSerial}
                          </span>
                          <h1 className="text-[22px] font-black tracking-tight text-slate-800 dark:text-slate-100 truncate">{getLessonTitle(view.lesson, lang)}</h1>
                        </div>
                        <div className="flex items-center gap-2.5 pl-11 flex-wrap text-xs text-slate-500 dark:text-slate-300">
                          <span>{lang === "bn" ? `${view.lesson.drills.length}টি ড্রিল` : `${view.lesson.drills.length} drills`}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                          <span>{lang === "bn" ? `${completedCount}টি সম্পন্ন` : `${completedCount} completed`}</span>
                        </div>
                      </div>
                      <div className="min-w-[220px] md:max-w-[280px]">
                        <div className="flex items-center justify-between mb-1.5 text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-300">
                          <span>{lang === "bn" ? "অগ্রগতি" : "Progress"}</span>
                          <span>{view.lesson.drills.length > 0 ? Math.round((completedCount / view.lesson.drills.length) * 100) : 0}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,#34d399,#22c55e,#10b981)]"
                            style={{ width: view.lesson.drills.length > 0 ? `${Math.round((completedCount / view.lesson.drills.length) * 100)}%` : "0%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
                    {view.lesson.drills.map((drill, idx) => (
                      <DrillCard
                        key={drill.id}
                        drill={drill}
                        index={idx}
                        lessonIndex={lessonSerial}
                        // Don't show checkmarks until localStorage has loaded (hydration guard)
                        completed={progressMounted && completedDrills.has(drill.id)}
                        stars={progressMounted ? (drillStars[drill.id] ?? 0) : 0}
                        onClick={() => navigate({ kind: "drill", mod: view.mod, lesson: view.lesson, drill, drillIdx: idx })}
                      />
                    ))}
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
    </>
  );
}




