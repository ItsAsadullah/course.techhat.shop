"use client";

// =============================================================================
//  PairsDrillEngine — TypingMaster-style pairs & groups drill
// =============================================================================

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Volume2, VolumeX, Timer, Hand } from "lucide-react";
import VirtualKeyboard        from "@/components/typing-master/keyboard/VirtualKeyboard";
import { useSoundManager }    from "@/components/typing-master/typing/SoundManager";
import type { SoundName }     from "@/components/typing-master/typing/SoundManager";
import {
  FINGER_COLOR,
  getFingerForChar,
}                             from "@/components/typing-master/keyboard/keyboardData";
import type { Drill }         from "@/data/typing-master/englishCurriculum";
import type { DrillCompleteStats } from "./GamifiedTypingEngine";

const GROUPS_PER_ROW  = 2;
const GROUPS_PER_PAGE = GROUPS_PER_ROW * 2; // 4 groups visible at once (2 rows × 2 cols)

function buildFlatSeq(tokens: string[]): string[] {
  const out: string[] = [];
  tokens.forEach((tok, ti) => {
    for (const ch of tok) out.push(ch);
    if (ti < tokens.length - 1) out.push(" ");
  });
  return out;
}

function buildTokenStarts(tokens: string[]): number[] {
  const starts: number[] = [];
  let pos = 0;
  tokens.forEach((tok, ti) => {
    starts.push(pos);
    pos += tok.length;
    if (ti < tokens.length - 1) pos += 1;
  });
  return starts;
}

function posToToken(
  tokenStarts: number[],
  cursorPos: number,
): { tokenIdx: number; charIdx: number } {
  let lo = 0, hi = tokenStarts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (tokenStarts[mid] <= cursorPos) lo = mid;
    else hi = mid - 1;
  }
  return { tokenIdx: lo, charIdx: cursorPos - tokenStarts[lo] };
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type KS = "done" | "current" | "upcoming";

function KeyCap({
  char, status, shakeToken, hadError,
}: { char: string; status: KS; shakeToken?: number; hadError?: boolean }) {
  const isSpace = char === " ";
  const label   = isSpace ? "Space" : char.toUpperCase();
  const ft      = !isSpace ? getFingerForChar(char) : null;
  const col     = ft ? FINGER_COLOR[ft.finger] : null;

  const [shaking, setShaking] = useState(false);
  useEffect(() => {
    if (!shakeToken) return;
    setShaking(true);
    const t = setTimeout(() => setShaking(false), 380);
    return () => clearTimeout(t);
  }, [shakeToken]);

  return (
    <motion.div
      animate={shaking ? { x: [0, -7, 7, -7, 7, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.38, ease: "easeInOut" }}
      className={[
        "flex items-center justify-center rounded-lg font-black shrink-0 select-none transition-colors duration-75",
        isSpace ? "px-3 h-12 text-[11px] min-w-[68px]" : "w-12 h-12 text-base",
        status === "current" && shaking
          ? "bg-red-500 text-white shadow border-b-[3px] border-red-700"
          : status === "current"
          ? `text-white shadow border-b-[3px] border-black/20 ${col ? col.bg : "bg-slate-500"}`
          : status === "done" && hadError
          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500 dark:text-emerald-400 opacity-60 border-2 border-red-400"
          : status === "done"
          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500 dark:text-emerald-400 opacity-60"
          : "bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 border border-slate-200 dark:border-slate-600 shadow-sm",
      ].join(" ")}
    >
      {label}
    </motion.div>
  );
}

function TokenGroup({
  token, groupStatus, charIdx, shakeToken, isLast, tokenStart, errorPositions,
}: {
  token:          string;
  groupStatus:    "done" | "active" | "upcoming";
  charIdx:        number;
  shakeToken:     number;
  isLast:         boolean;
  tokenStart:     number;
  errorPositions: Set<number>;
}) {
  const onSpace = groupStatus === "active" && charIdx >= token.length;

  const spaceStatus: KS =
    groupStatus === "done"     ? "done" :
    groupStatus === "upcoming" ? "upcoming" :
    onSpace                    ? "current" : "upcoming";

  return (
    <motion.div
      animate={groupStatus === "active" ? { scale: 1.04, y: 0 } : { scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={[
        "flex items-center gap-1.5 px-3 py-2.5 rounded-xl border-2 transition-colors duration-75 min-w-[160px] justify-center",
        groupStatus === "active"
          ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500 shadow-lg"
          : groupStatus === "done"
          ? "border-emerald-200 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/20 opacity-55"
          : "border-slate-200 dark:border-slate-600 bg-white/80 dark:bg-slate-700/80",
      ].join(" ")}
    >
      {token.split("").map((ch, i) => {
        const status: KS =
          groupStatus === "done"     ? "done" :
          groupStatus === "upcoming" ? "upcoming" :
          onSpace                    ? "done" :
          i < charIdx               ? "done" :
          i === charIdx             ? "current" : "upcoming";
        const absPos = tokenStart + i;
        return (
          <KeyCap
            key={i}
            char={ch}
            status={status}
            hadError={errorPositions.has(absPos)}
            shakeToken={status === "current" ? shakeToken : 0}
          />
        );
      })}
      {!isLast && (
        <KeyCap
          char=" "
          status={spaceStatus}
          hadError={errorPositions.has(tokenStart + token.length)}
          shakeToken={spaceStatus === "current" ? shakeToken : 0}
        />
      )}
    </motion.div>
  );
}

function TokenRow({
  rowTokens, rowOffset, totalTokens, activeTokenIdx, activeCharIdx, shakeToken,
  tokenStarts, errorPositions,
}: {
  rowTokens:      string[];
  rowOffset:      number;
  totalTokens:    number;
  activeTokenIdx: number;
  activeCharIdx:  number;
  shakeToken:     number;
  tokenStarts:    number[];
  errorPositions: Set<number>;
}) {
  return (
    <div className="flex items-stretch justify-center gap-6">
      {rowTokens.map((tok, i) => {
        const absIdx = rowOffset + i;
        const gs: "done" | "active" | "upcoming" =
          absIdx < activeTokenIdx  ? "done" :
          absIdx === activeTokenIdx ? "active" : "upcoming";
        return (
          <TokenGroup
            key={absIdx}
            token={tok}
            groupStatus={gs}
            charIdx={absIdx === activeTokenIdx ? activeCharIdx : 0}
            shakeToken={shakeToken}
            isLast={absIdx === totalTokens - 1}
            tokenStart={tokenStarts[absIdx] ?? 0}
            errorPositions={errorPositions}
          />
        );
      })}
    </div>
  );
}

function StatBox({ label, value, sub, accent }: {
  label:  string;
  value:  string | number;
  sub?:   string;
  accent: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm px-5 py-4 min-w-[90px]">
      <span className={`text-[11px] font-semibold uppercase tracking-widest ${accent}`}>{label}</span>
      <span className="text-3xl font-black text-slate-800 dark:text-slate-100 leading-none">{value}</span>
      {sub && <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{sub}</span>}
    </div>
  );
}

interface Props {
  drill:      Drill;
  onComplete: (stats: DrillCompleteStats) => void;
}

export default function PairsDrillEngine({ drill, onComplete }: Props) {
  const timeLimit = drill.timeLimit || 300;

  const [resetKey, setResetKey] = useState(0);

  const { loopedTokens, flatSeq, tokenStarts } = useMemo(() => {
    // Extract unique characters from content (ignore spaces)
    const baseChars = Array.from(
      new Set(drill.content.replace(/\s+/g, "").split(""))
    ).filter(Boolean);

    if (baseChars.length === 0) return { loopedTokens: [], flatSeq: [], tokenStarts: [] };

    // Generate 240 groups (enough for a full 5-min drill at any speed).
    // Every page (GROUPS_PER_PAGE groups) shares the same random group size,
    // but each new page picks a new random size: 2, 3, or 4 chars.
    const TOTAL_GROUPS = 240;
    const SIZES        = [2, 3, 4] as const;
    const generated: string[] = [];
    let pageSize = SIZES[Math.floor(Math.random() * SIZES.length)];

    for (let gi = 0; gi < TOTAL_GROUPS; gi++) {
      // New page → pick a new group size
      if (gi % GROUPS_PER_PAGE === 0) {
        pageSize = SIZES[Math.floor(Math.random() * SIZES.length)];
      }
      let group = "";
      for (let ci = 0; ci < pageSize; ci++) {
        group += baseChars[Math.floor(Math.random() * baseChars.length)];
      }
      generated.push(group);
    }

    return {
      loopedTokens: generated,
      flatSeq:      buildFlatSeq(generated),
      tokenStarts:  buildTokenStarts(generated),
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drill.content, resetKey]);

  const [cursorPos,      setCursorPos]      = useState(0);
  const [shakeToken,     setShakeToken]     = useState(0);
  const [wrongKey,       setWrongKey]       = useState<string | null>(null);
  const [errors,         setErrors]         = useState(0);
  const [totalTyped,     setTotalTyped]     = useState(0);
  const [timeLeft,       setTimeLeft]       = useState(timeLimit);
  const [started,        setStarted]        = useState(false);
  const [done,           setDone]           = useState(false);
  const [soundEnabled,   setSoundEnabled]   = useState(true);
  const [wpm,            setWpm]            = useState(0);
  const [accuracy,       setAccuracy]       = useState(100);
  const [errorPositions, setErrorPositions] = useState<Set<number>>(new Set());
  const [autoPaused,     setAutoPaused]     = useState(false);
  const [showHands,      setShowHands]      = useState(true);

  const lastActivityRef = useRef<number>(0);

  const wrongTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { play, setEnabled } = useSoundManager(true);

  const { tokenIdx, charIdx } = useMemo(
    () => posToToken(tokenStarts, Math.min(cursorPos, flatSeq.length - 1)),
    [cursorPos, tokenStarts, flatSeq.length],
  );

  const activePage = Math.floor(tokenIdx / GROUPS_PER_PAGE);

  useEffect(() => {
    if (!started || done || autoPaused) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); setDone(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [started, done, autoPaused]);

  // Auto-pause after 5 s of inactivity
  useEffect(() => {
    if (!started || done) return;
    const id = setInterval(() => {
      if (Date.now() - lastActivityRef.current > 5000) {
        setAutoPaused(true);
      }
    }, 500);
    return () => clearInterval(id);
  }, [started, done]);

  useEffect(() => {
    if (!started) return;
    const elapsed = timeLimit - timeLeft;
    if (elapsed > 0 && totalTyped > 0) {
      setWpm(Math.round((totalTyped / 5) / (elapsed / 60)));
      setAccuracy(Math.round(((totalTyped - errors) / totalTyped) * 100));
    }
  }, [timeLeft, totalTyped, errors, started, timeLimit]);

  const completedRef = useRef(false);
  useEffect(() => {
    if (!done || completedRef.current) return;
    completedRef.current = true;
    const elapsed  = timeLimit - timeLeft;
    const acc      = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
    const finalWpm = elapsed > 0 && totalTyped > 0 ? Math.round((totalTyped / 5) / (elapsed / 60)) : 0;
    onComplete({
      wpm: finalWpm,
      netWpm: finalWpm,
      accuracy: acc,
      errors,
      elapsed,
      maxCombo: 0,
      correctChars: Math.max(totalTyped - errors, 0),
      totalChars: totalTyped,
      errorKeyCounts: {},
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  useEffect(() => setEnabled(soundEnabled), [soundEnabled, setEnabled]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (done) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    const pressed = e.key === " " ? " " : e.key.length === 1 ? e.key : null;
    if (!pressed) return;
    e.preventDefault();

    if (!started) { setStarted(true); lastActivityRef.current = Date.now(); }

    // Resume from auto-pause — don't consume the keypress, fall through to process it
    if (autoPaused) {
      setAutoPaused(false);
    }

    lastActivityRef.current = Date.now();

    const expected = flatSeq[cursorPos] ?? null;
    if (!expected) return;

    if (pressed === expected) {
      play("keyPress" as SoundName);
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
      setWrongKey(null);
      setShakeToken(0);
      setTotalTyped(c => c + 1);
      setCursorPos(p => Math.min(p + 1, flatSeq.length - 1));
    } else {
      play("error" as SoundName);
      setErrors(c => c + 1);
      setTotalTyped(c => c + 1);
      setWrongKey(pressed);
      setShakeToken(t => t + 1);
      setErrorPositions(s => { const n = new Set(s); n.add(cursorPos); return n; });
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = setTimeout(() => setWrongKey(null), 500);
    }
  }, [done, started, autoPaused, flatSeq, cursorPos, play]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const handleReset = useCallback(() => {
    completedRef.current = false;
    setCursorPos(0);
    setShakeToken(0);
    setWrongKey(null);
    setErrors(0);
    setTotalTyped(0);
    setTimeLeft(timeLimit);
    setStarted(false);
    setDone(false);
    setWpm(0);
    setAccuracy(100);
    setErrorPositions(new Set());
    setAutoPaused(false);
    lastActivityRef.current = 0;
    setResetKey(k => k + 1);
  }, [timeLimit]);

  const curChar  = flatSeq[cursorPos] ?? null;
  const progress = (timeLimit - timeLeft) / timeLimit;

  const pageStart = activePage * GROUPS_PER_PAGE;
  const row1Data  = {
    tokens: loopedTokens.slice(pageStart,                      pageStart + GROUPS_PER_ROW),
    offset: pageStart,
  };
  const row2Data  = {
    tokens: loopedTokens.slice(pageStart + GROUPS_PER_ROW,     pageStart + GROUPS_PER_PAGE),
    offset: pageStart + GROUPS_PER_ROW,
  };

  return (
    <div className="flex flex-col gap-0 select-none">

      <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden mb-4">
        <motion.div
          className="h-full bg-linear-to-r from-blue-400 to-indigo-500 rounded-full"
          animate={{ width: `${progress * 100}%` }}
          transition={{ ease: "linear", duration: 0.5 }}
        />
      </div>

      <div className="flex gap-4 items-start">

        {/* ── Center column: pairs grid + keyboard, both centered together ── */}
        <div className="flex-1 min-w-0 flex flex-col items-center">

          <div className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 p-5 shadow-sm">

            {drill.hint && (
              <p className="text-[11px] text-slate-400 mb-3 font-medium">{drill.hint}</p>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`page-${activePage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
              >
                {/* Row 1 — always top, gets "done" state once cursor moves to row 2 */}
                <div className="mb-3">
                  <TokenRow
                    rowTokens={row1Data.tokens}
                    rowOffset={row1Data.offset}
                    totalTokens={loopedTokens.length}
                    activeTokenIdx={tokenIdx}
                    activeCharIdx={charIdx}
                    shakeToken={shakeToken}
                    tokenStarts={tokenStarts}
                    errorPositions={errorPositions}
                  />
                </div>

                {/* Row 2 — always bottom, becomes active when row 1 is done */}
                {row2Data.tokens.length > 0 && (
                  <TokenRow
                    rowTokens={row2Data.tokens}
                    rowOffset={row2Data.offset}
                    totalTokens={loopedTokens.length}
                    activeTokenIdx={tokenIdx}
                    activeCharIdx={charIdx}
                    shakeToken={shakeToken}
                    tokenStarts={tokenStarts}
                    errorPositions={errorPositions}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {!started && (
              <p className="mt-4 text-[12px] text-slate-400 dark:text-slate-500 text-center animate-pulse">
                Start typing to begin…
              </p>
            )}
          </div>

          <div className="mt-2 w-full">
            <VirtualKeyboard
              nextExpectedChar={curChar}
              wrongKey={wrongKey}
              showHands={showHands}
            />
          </div>
        </div>

        {/* ── Right sidebar: stats only, outside the center column ── */}
        <div className="flex flex-col gap-3 shrink-0">
          <div className={[
            "flex flex-col items-center gap-1 rounded-2xl border-2 shadow-sm px-5 py-4 min-w-24 transition-colors",
            timeLeft <= 30 && started ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30" : autoPaused ? "border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800",
          ].join(" ")}>
            <span className={`text-[11px] font-semibold uppercase tracking-widest flex items-center gap-1 ${timeLeft <= 30 && started ? "text-red-500" : autoPaused ? "text-amber-500" : "text-slate-400 dark:text-slate-400"}`}>
              <Timer className="w-3 h-3" /> Time
            </span>
            <span className={`text-3xl font-black leading-none tabular-nums ${timeLeft <= 30 && started ? "text-red-600" : "text-slate-800 dark:text-slate-100"}`}>
              {formatTime(timeLeft)}
            </span>
            {autoPaused && (
              <span className="text-[10px] font-semibold text-amber-500 mt-0.5 animate-pulse">⏸ Paused</span>
            )}
            {!started && !autoPaused && <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">paused</span>}
          </div>

          <StatBox label="WPM" value={wpm} accent="text-blue-500" />
          <StatBox label="Acc" value={`${accuracy}%`} sub={errors > 0 ? `${errors} err` : "perfect"} accent="text-emerald-500" />

          <button
            onClick={() => setSoundEnabled(s => !s)}
            className="flex items-center justify-center gap-1.5 text-[12px] text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors"
          >
            {soundEnabled
              ? <><Volume2 className="w-3.5 h-3.5" /> On</>
              : <><VolumeX className="w-3.5 h-3.5" /> Off</>}
          </button>

          {/* Hand guide toggle */}
          <button
            onClick={() => setShowHands(s => !s)}
            className={[
              "flex items-center justify-between gap-2 text-[12px] py-2 px-3 rounded-xl border shadow-sm transition-colors",
              showHands
                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400"
                : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
            ].join(" ")}
          >
            <span className="flex items-center gap-1.5"><Hand className="w-3.5 h-3.5" /> Hands</span>
            {/* Toggle pill */}
            <span className={[
              "inline-flex w-8 h-4 rounded-full transition-colors duration-200 relative shrink-0",
              showHands ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-600",
            ].join(" ")}>
              <span className={[
                "absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200",
                showHands ? "translate-x-4" : "translate-x-0.5",
              ].join(" ")} />
            </span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 text-[12px] text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>
        </div>
      </div>
    </div>
  );
}
