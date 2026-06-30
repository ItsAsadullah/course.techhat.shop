"use client";

// =============================================================================
//  DrillResults
//  Animated results modal shown after completing a drill.
//
//  Features
//  • Stars (0-3) animate in one-by-one with a bounce
//  • XP counter counts up
//  • WPM / ACC / Errors summary
//  • Buttons: Retry | Next Drill | Play Mini-Game
// =============================================================================

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ChevronRight, Sword, Star, BarChart3, AlertTriangle } from "lucide-react";
import { calcStars, calcXp } from "@/data/englishCurriculum";
import type { Drill } from "@/data/englishCurriculum";
import type { DrillCompleteStats } from "@/components/typing/GamifiedTypingEngine";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DrillResultsProps {
  drill:          Drill;
  stats:          DrillCompleteStats;
  show:           boolean;
  onRetry:        () => void;
  onNext:         () => void;
  onPlayMiniGame: () => void;
  onFocusedPractice?: () => void;
  isFocusedPractice?: boolean;
  compareBefore?: DrillCompleteStats | null;
}

// ─── Animated Star ────────────────────────────────────────────────────────────

function AnimStar({ filled, delay }: { filled: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -30, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 14, delay }}
    >
      <Star
        className={`w-10 h-10 drop-shadow-md ${filled ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
      />
    </motion.div>
  );
}

// ─── XP Counter ──────────────────────────────────────────────────────────────

function XPCounter({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return (
    <motion.span
      className="text-4xl font-black text-emerald-500"
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
    >
      +{display}
    </motion.span>
  );
}

// ─── Grade Banner ─────────────────────────────────────────────────────────────

function GradeBanner({ stars, accuracy }: { stars: number; accuracy: number }) {
  const [label, color] =
    stars === 3 ? ["⚡ Flawless!", "from-amber-400 to-yellow-500 text-white"] :
    stars === 2 ? ["✅ Great Job!", "from-emerald-400 to-teal-500 text-white"] :
    stars === 1 ? ["👍 Nice Try!", "from-blue-400 to-blue-500 text-white"] :
                  ["💪 Keep Going", "from-slate-400 to-slate-500 text-white"];
  return (
    <motion.div
      className={`inline-block px-6 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${color} shadow-md`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.3 }}
    >
      {label} · {accuracy}% Accuracy
    </motion.div>
  );
}

// ─── Stat Pill ────────────────────────────────────────────────────────────────

function StatPill({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <motion.div
      className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.9, type: "spring", stiffness: 290 }}
    >
      <p className={`text-2xl font-black leading-none ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>}
      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{label}</p>
    </motion.div>
  );
}

function ErrorKeyChart({ errorKeyCounts }: { errorKeyCounts: Record<string, number> }) {
  const entries = useMemo(
    () => Object.entries(errorKeyCounts).map(([key, count]) => ({ key, count })),
    [errorKeyCounts],
  );

  if (entries.length === 0) {
    return (
      <motion.div
        className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05 }}
      >
        <p className="text-sm font-semibold text-emerald-700">No key mistakes in this drill 🎉</p>
      </motion.div>
    );
  }

  const maxCount = Math.max(...entries.map((entry) => entry.count));
  const minor = entries
    .filter((entry) => entry.count <= 2)
    .sort((a, b) => a.count - b.count || a.key.localeCompare(b.key));
  const major = entries
    .filter((entry) => entry.count > 2)
    .sort((a, b) => a.count - b.count || a.key.localeCompare(b.key));

  const renderItem = (entry: { key: string; count: number }) => {
    const width = Math.max((entry.count / maxCount) * 100, 14);
    return (
      <div key={entry.key} className="grid grid-cols-[40px_1fr_32px] items-center gap-2">
        <span className="text-sm font-bold text-slate-700 text-center rounded-md bg-slate-100 py-1">
          {entry.key}
        </span>
        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${width}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <span className="text-xs font-bold text-slate-500 text-right">{entry.count}x</span>
      </div>
    );
  };

  return (
    <motion.div
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.05 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-violet-500" />
        <p className="text-sm font-bold text-slate-700">Mistake Key Analysis</p>
      </div>

      {minor.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-emerald-600 mb-2">Low / Normal mistakes</p>
          <div className="space-y-2">
            {minor.map(renderItem)}
          </div>
        </div>
      )}

      {major.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-wider font-semibold text-red-500 mb-2">High mistakes (increasing order)</p>
          <div className="space-y-2">
            {major.map(renderItem)}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function TopPracticeKeys({ errorKeyCounts }: { errorKeyCounts: Record<string, number> }) {
  const topKeys = useMemo(
    () => Object.entries(errorKeyCounts)
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key))
      .slice(0, 3),
    [errorKeyCounts],
  );

  if (topKeys.length === 0) return null;

  return (
    <motion.div
      className="w-full rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.12 }}
    >
      <p className="text-sm font-bold text-violet-700 mb-3">Focus Practice (Top 3)</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {topKeys.map((item, idx) => (
          <div
            key={`${item.key}-${idx}`}
            className="rounded-xl border border-violet-100 bg-white px-3 py-2 text-center"
          >
            <p className="text-[11px] uppercase tracking-wider text-violet-400 font-semibold">#{idx + 1} key</p>
            <p className="text-2xl font-black text-violet-700 leading-tight mt-0.5">{item.key}</p>
            <p className="text-xs text-slate-500 mt-1">{item.count} mistakes</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function DrillResults({
  drill,
  stats,
  show,
  onRetry,
  onNext,
  onPlayMiniGame,
  onFocusedPractice,
  isFocusedPractice = false,
  compareBefore = null,
}: DrillResultsProps) {
  const stars = calcStars(drill, stats.wpm, stats.accuracy);
  const xp    = calcXp(stats.wpm, stats.accuracy, stats.maxCombo);
  const correctChars = stats.correctChars ?? Math.max(stats.totalChars - stats.errors, 0);
  const totalChars = stats.totalChars ?? 0;
  const beforeErrors = compareBefore?.errors ?? null;
  const beforeAccuracy = compareBefore?.accuracy ?? null;
  const beforeWpm = compareBefore?.wpm ?? null;
  const errorDelta = beforeErrors === null ? null : beforeErrors - stats.errors;
  const accDelta = beforeAccuracy === null ? null : stats.accuracy - beforeAccuracy;
  const wpmDelta = beforeWpm === null ? null : stats.wpm - beforeWpm;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Card */}
          <motion.div
            key="card"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 310, damping: 22 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-4 flex flex-col items-center gap-3 max-h-[92vh] overflow-y-auto">

              {/* Drill title */}
              <motion.p
                className="text-slate-400 text-sm uppercase tracking-widest font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {drill.title}
              </motion.p>

              {/* Stars */}
              <div className="flex gap-3 items-center">
                {[0, 1, 2].map((i) => (
                  <AnimStar key={i} filled={i < stars} delay={0.3 + i * 0.18} />
                ))}
              </div>

              {/* Grade banner */}
              <GradeBanner stars={stars} accuracy={stats.accuracy} />

              {stats.wasStoppedEarly && (
                <motion.div
                  className="w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center justify-center gap-2 text-amber-700">
                    <AlertTriangle className="w-4 h-4" />
                    <p className="text-sm font-semibold">Typing was stopped early.</p>
                  </div>
                  <p className="text-xs text-amber-700/80 mt-1">
                    These results are based only on the part you typed before clicking Next.
                  </p>
                </motion.div>
              )}

              {/* XP */}
              <div className="flex flex-col items-center gap-0.5">
                <XPCounter target={xp} />
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">XP Earned</p>
                {stats.maxCombo >= 10 && (
                  <motion.p
                    className="text-xs text-amber-500 font-semibold mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    🔥 Max combo: {stats.maxCombo}x bonus included
                  </motion.p>
                )}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full">
                <StatPill label="WPM" value={String(stats.wpm)} sub={`net ${String(stats.netWpm)}`} color="text-blue-600" />
                <StatPill label="Accuracy" value={String(stats.accuracy) + "%"} color={stats.accuracy >= 95 ? "text-emerald-600" : stats.accuracy >= 85 ? "text-amber-600" : "text-red-500"} />
                <StatPill label="Errors" value={String(stats.errors)} color={stats.errors === 0 ? "text-emerald-600" : "text-red-500"} />
                <StatPill label="Correct" value={String(correctChars)} sub={totalChars > 0 ? `of ${String(totalChars)}` : undefined} color="text-emerald-600" />
                <StatPill label="Net Speed" value={String(stats.netWpm)} sub="WPM" color="text-indigo-600" />
              </div>

              <ErrorKeyChart errorKeyCounts={stats.errorKeyCounts ?? {}} />
              <TopPracticeKeys errorKeyCounts={stats.errorKeyCounts ?? {}} />

              {isFocusedPractice && compareBefore && (
                <motion.div
                  className="w-full rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.18 }}
                >
                  <p className="text-sm font-bold text-blue-700 mb-3">Practice Progress (Before vs Now)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="rounded-xl bg-white border border-blue-100 px-3 py-2 text-center">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400">Errors</p>
                      <p className="text-xs text-slate-500">{beforeErrors} → {stats.errors}</p>
                      <p className={`text-sm font-bold ${errorDelta !== null && errorDelta >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {errorDelta === null ? "-" : errorDelta >= 0 ? `-${errorDelta} better` : `+${Math.abs(errorDelta)} more`}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white border border-blue-100 px-3 py-2 text-center">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400">Accuracy</p>
                      <p className="text-xs text-slate-500">{beforeAccuracy}% → {stats.accuracy}%</p>
                      <p className={`text-sm font-bold ${accDelta !== null && accDelta >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {accDelta === null ? "-" : accDelta >= 0 ? `+${accDelta}%` : `${accDelta}%`}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white border border-blue-100 px-3 py-2 text-center">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400">WPM</p>
                      <p className="text-xs text-slate-500">{beforeWpm} → {stats.wpm}</p>
                      <p className={`text-sm font-bold ${wpmDelta !== null && wpmDelta >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {wpmDelta === null ? "-" : wpmDelta >= 0 ? `+${wpmDelta}` : `${wpmDelta}`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action buttons */}
              <motion.div
                className="flex gap-3 w-full"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <button
                  onClick={onRetry}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
                <button
                  onClick={onPlayMiniGame}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-700 font-semibold text-sm transition-colors"
                >
                  <Sword className="w-4 h-4" />
                  Word Ninja
                </button>
                {!isFocusedPractice && onFocusedPractice && stats.errors > 0 && (
                  <button
                    onClick={onFocusedPractice}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold text-sm transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Focus Practice
                  </button>
                )}
                <button
                  onClick={onNext}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors"
                >
                  {isFocusedPractice ? "Back" : "Next"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



