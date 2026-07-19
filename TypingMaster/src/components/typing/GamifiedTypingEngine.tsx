"use client";

// =============================================================================
//  GamifiedTypingEngine
//  Wraps the existing useTypingEngine hook with a Typing.com-style gamified UI.
//
//  Features:
//  • Animated progress bar with a moving rocket avatar
//  • Combo streak tracker with floating "🔥 Nx Combo!" text
//  • Per-word pulse/glow animation on correct completion
//  • Sound effects via useSoundManager
//  • Emits onComplete(stats) when the drill finishes
// =============================================================================

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Volume2, VolumeX, Zap, Hand, Timer, ChevronRight, CornerDownLeft } from "lucide-react";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import VirtualKeyboard from "@/components/keyboard/VirtualKeyboard";
import { useSoundManager } from "@/components/typing/SoundManager";
import type { Drill } from "@/data/englishCurriculum";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DrillCompleteStats {
  wpm:            number;
  netWpm:         number;
  accuracy:       number;
  errors:         number;
  elapsed:        number;
  maxCombo:       number;
  correctChars:   number;
  totalChars:     number;
  errorKeyCounts: Record<string, number>;
  wasStoppedEarly?: boolean;
}

interface GamifiedTypingEngineProps {
  drill:       Drill;
  showKeyboard?: boolean;
  onComplete:  (stats: DrillCompleteStats) => void;
  onRetry?:    () => void;
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressRocket({ pct }: { pct: number }) {
  return (
    <div className="relative h-8 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
      {/* Track fill */}
      <motion.div
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
        animate={{ width: `${Math.max(pct, 2)}%` }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />
      {/* Checkpoint flags */}
      {[25, 50, 75].map((flag) => (
        <div
          key={flag}
          className="absolute top-0 h-full border-l-2 border-dashed border-white/60"
          style={{ left: `${flag}%` }}
        />
      ))}
      {/* Rocket avatar */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-lg select-none"
        animate={{ left: `${Math.min(Math.max(pct, 2), 97)}%` }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        🚀
      </motion.div>
      {/* Finish flag */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm select-none pointer-events-none">🏁</div>
    </div>
  );
}

// ─── Combo Badge ──────────────────────────────────────────────────────────────

function ComboBadge({ combo, milestone }: { combo: number; milestone: boolean }) {
  if (combo < 5) return null;
  const color =
    combo >= 40 ? "from-red-500 to-orange-500" :
    combo >= 20 ? "from-amber-500 to-yellow-400" :
                  "from-emerald-500 to-teal-400";
  return (
    <motion.div
      key={combo}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: milestone ? [1.3, 1.0] : 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400 }}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${color} text-white text-xs font-bold shadow-lg`}
    >
      <Zap className="w-3.5 h-3.5" />
      {combo}x Combo!
    </motion.div>
  );
}

// ─── Floating Milestone Toast ─────────────────────────────────────────────────

function MilestoneToast({ show, combo }: { show: boolean; combo: number }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={combo}
          initial={{ y: 0, opacity: 1, scale: 1 }}
          animate={{ y: -60, opacity: 0, scale: 1.4 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-50
                     text-2xl font-black text-amber-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]
                     whitespace-nowrap"
        >
          🔥 {combo}x Combo!
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function buildWordPages(text: string, maxLineChars = 32, linesPerPage = 2) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: { text: string; start: number; end: number }[] = [];
  let current = "";
  let currentStart = 0;
  let absPos = 0;

  words.forEach((word, wordIdx) => {
    const candidate = current ? `${current} ${word}` : word;
    if (current && candidate.length > maxLineChars) {
      lines.push({ text: current, start: currentStart, end: currentStart + current.length });
      currentStart = absPos;
      current = word;
    } else {
      current = candidate;
    }

    absPos += word.length;
    if (wordIdx < words.length - 1) absPos += 1;
  });

  if (current) {
    lines.push({ text: current, start: currentStart, end: currentStart + current.length });
  }

  const pages: { start: number; end: number; lines: { start: number; end: number }[] }[] = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    const pageLines = lines.slice(i, i + linesPerPage);
    if (pageLines.length) {
      pages.push({
        start: pageLines[0].start,
        end: pageLines[pageLines.length - 1].end,
        lines: pageLines.map((line) => ({ start: line.start, end: line.end })),
      });
    }
  }

  return { lines, pages };
}

function buildSentencePages(text: string, linesPerPage = 3) {
  const rawLines = text.split("\n");
  const lines: { text: string; start: number; end: number }[] = [];
  let absPos = 0;

  rawLines.forEach((line, lineIdx) => {
    lines.push({ text: line, start: absPos, end: absPos + line.length });
    absPos += line.length;
    if (lineIdx < rawLines.length - 1) absPos += 1;
  });

  const pages: { start: number; end: number; lines: { start: number; end: number }[] }[] = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    const pageLines = lines.slice(i, i + linesPerPage);
    if (pageLines.length) {
      pages.push({
        start: pageLines[0].start,
        end: pageLines[pageLines.length - 1].end,
        lines: pageLines.map((line) => ({ start: line.start, end: line.end })),
      });
    }
  }

  return { lines, pages };
}

function getDisplayKey(char: string, showBlankSpace = false) {
  if (char === " ") return showBlankSpace ? "_" : "\u00A0";
  if (char === "\n") return "⌋";
  return char;
}

// ─── Text Display ─────────────────────────────────────────────────────────────

function renderEnterIcon(className: string) {
  return <CornerDownLeft className={className} strokeWidth={2.4} />;
}

function GamifiedTextDisplay({
  chars, cursor, completedWords, isPagedDrill = false, isParagraphDrill = false, errorMarkedPositions, wrongPopup, wrongFlashIndex, visibleRange,
}: {
  chars: ReturnType<typeof useTypingEngine>["chars"];
  cursor: number;
  completedWords: Set<number>; // set of word-end char indices
  isPagedDrill?: boolean;
  isParagraphDrill?: boolean;
  errorMarkedPositions: Set<number>;
  wrongPopup: { index: number; char: string } | null;
  wrongFlashIndex: number | null;
  visibleRange?: { start: number; end: number; lines?: { start: number; end: number }[] } | null;
}) {
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    cursorRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [cursor]);

  const visibleStart = visibleRange?.start ?? 0;
  const visibleEnd = visibleRange?.end ?? chars.length;
  const visibleChars = chars.slice(visibleStart, visibleEnd);

  const renderCharacter = (i: number) => {
    const c = chars[i];
    if (!c) return null;

    const isCursor = i === cursor;
    const isWordEnd = completedWords.has(i);
    const hadError = errorMarkedPositions.has(i);
    const wrongAttempt = wrongPopup?.index === i ? wrongPopup.char : null;
    const showWrongFlash = wrongFlashIndex === i;
    const displayChar = c.char === " "
      ? (isCursor ? "_" : "\u00A0")
      : c.char;
    const displayNode = c.char === "\n"
      ? renderEnterIcon(isParagraphDrill ? "inline-block w-4 h-4 align-[-0.1em]" : "inline-block w-5 h-5 align-[-0.15em]")
      : displayChar;

    let charClass = "text-gray-300";
    if (c.state === "correct")   charClass = "text-emerald-600";
    if (c.state === "incorrect") charClass = c.char === " " ? "bg-red-200 text-red-500 rounded-sm" : "text-red-500";
    if (hadError) {
      charClass = c.char === " "
        ? "bg-red-100 text-red-500 rounded-sm underline decoration-red-400 decoration-2"
        : "text-red-500 bg-red-50 rounded-sm underline decoration-red-400 decoration-2";
    }
    if (isCursor && !hadError) {
      charClass = c.char === " "
        ? "text-blue-500"
        : "text-blue-600";
    }
    if (isCursor && showWrongFlash) {
      charClass = c.char === " "
        ? "bg-red-100 text-red-500 rounded-sm"
        : "text-red-500 bg-red-50 rounded-sm";
    }

    return (
      <span key={i} className="relative inline-block align-bottom">
        {wrongAttempt && (
          <motion.span
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0.95, 0.9, 0], x: [0, -1, 1, -1, 1, 0], y: [0, 2, 5] }}
            transition={{ duration: 0.34, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-full -mt-0.5 leading-none font-normal text-red-500 pointer-events-none z-20"
            style={{ fontSize: "1em" }}
          >
            {wrongAttempt === " " ? "⎵" : wrongAttempt}
          </motion.span>
        )}
        {isCursor && (
          <span
            ref={cursorRef}
            className="absolute -left-px top-[3px] bottom-[3px] w-[2.5px] bg-blue-500 rounded-full animate-pulse z-10"
          />
        )}
        <motion.span
          className={`transition-colors duration-75 ${charClass}`}
          animate={isWordEnd && !hadError ? { scale: [1.15, 1.0] } : isWordEnd ? { scale: [1.15, 1.0] } : {}}
          transition={{ duration: 0.25 }}
        >
          {displayNode}
        </motion.span>
      </span>
    );
  };

  return (
    <div className={[
      "relative bg-white rounded-2xl border border-gray-200 font-mono tracking-wide select-none overflow-hidden",
      isPagedDrill
        ? isParagraphDrill
          ? "px-8 py-7 text-[1.65rem] leading-[2.45rem] min-h-[13rem]"
          : "px-10 py-8 text-[1.9rem] leading-[2.7rem] min-h-[12rem]"
        : "px-8 py-6 text-[1.3rem] leading-[2.6rem] min-h-[9rem] whitespace-pre-wrap break-words",
    ].join(" ")}>
      {isPagedDrill && visibleRange?.lines?.length ? (
        <div>
          {visibleRange.lines.map((line, lineIdx) => {
            const indices: number[] = [];
            for (let idx = line.start; idx < line.end; idx += 1) {
              indices.push(idx);
            }

            const boundaryKeyIndex = line.end;
            if (chars[boundaryKeyIndex]?.char === " " || chars[boundaryKeyIndex]?.char === "\n") {
              indices.push(boundaryKeyIndex);
            }

            return (
              <div
                key={`${line.start}-${line.end}-${lineIdx}`}
                className={isParagraphDrill ? "pr-3" : "whitespace-nowrap"}
              >
                {indices.map((idx) => renderCharacter(idx))}
              </div>
            );
          })}
        </div>
      ) : (
        visibleChars.map((_, localIdx) => renderCharacter(visibleStart + localIdx))
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function GamifiedTypingEngine({
  drill,
  showKeyboard = true,
  onComplete,
}: GamifiedTypingEngineProps) {
  const inputRef     = useRef<HTMLTextAreaElement>(null);
  const inputVal     = useRef("");
  const prevCursor   = useRef(0);
  const prevCorrect  = useRef(0);

  const [combo,          setCombo]          = useState(0);
  const [maxCombo,       setMaxCombo]       = useState(0);
  const [showMilestone,  setShowMilestone]  = useState(false);
  const [milestoneCombo, setMilestoneCombo] = useState(0);
  const [soundEnabled,   setSoundEnabled]   = useState(true);
  const [showHands,      setShowHands]      = useState(true);
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());
  const [pendingErrorPositions, setPendingErrorPositions] = useState<Set<number>>(new Set());
  const [errorMarkedPositions, setErrorMarkedPositions] = useState<Set<number>>(new Set());
  const [wrongPopup,     setWrongPopup]     = useState<{ index: number; char: string } | null>(null);
  const [autoPaused,     setAutoPaused]     = useState(false);
  const [wrongKey,       setWrongKey]       = useState<string | null>(null);
  const [wrongFlashIndex, setWrongFlashIndex] = useState<number | null>(null);
  const [errorKeyCounts, setErrorKeyCounts] = useState<Record<string, number>>({});
  const [emittedDone,    setEmittedDone]    = useState(false);
  const lastActivityRef = useRef<number>(0);
  const wrongKeyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongPopupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { play, setEnabled } = useSoundManager(true);
  const engine = useTypingEngine(drill.content);
  const isWordDrill = drill.type === "word";
  const isSentenceDrill = drill.type === "sentence";
  const isParagraphDrill = drill.type === "paragraph";
  const isLineBreakDrill = isSentenceDrill || isParagraphDrill;
  const isPagedDrill = isWordDrill || isLineBreakDrill;
  const wordPages = useMemo(() => buildWordPages(drill.content, 32, 2), [drill.content]);
  const sentencePages = useMemo(() => buildSentencePages(drill.content, 3), [drill.content]);
  const pagedRanges = isLineBreakDrill ? sentencePages.pages : wordPages.pages;
  const activePagedPage = useMemo(() => {
    const idx = pagedRanges.findIndex((page) => engine.cursor >= page.start && engine.cursor <= page.end);
    return idx >= 0 ? idx : Math.max(0, pagedRanges.length - 1);
  }, [pagedRanges, engine.cursor]);
  const visiblePagedRange = isPagedDrill ? (pagedRanges[activePagedPage] ?? null) : null;
  const displayErrors = errorMarkedPositions.size + pendingErrorPositions.size;
  const displayTotalAttempts = engine.correctCount + pendingErrorPositions.size;
  const displayAccuracy = displayTotalAttempts > 0
    ? Math.round(((displayTotalAttempts - displayErrors) / displayTotalAttempts) * 100)
    : 100;

  const pct = drill.content.length > 0
    ? Math.round((engine.cursor / drill.content.length) * 100)
    : 0;

  // ── Focus input on mount ──
  useEffect(() => { inputRef.current?.focus(); }, [drill.id]);
  useEffect(() => {
    engine.reset();
    inputVal.current = "";
    lastActivityRef.current = 0;
    setCombo(0);
    setMaxCombo(0);
    setCompletedWords(new Set());
    setPendingErrorPositions(new Set());
    setErrorMarkedPositions(new Set());
    setWrongPopup(null);
    setAutoPaused(false);
    setWrongKey(null);
    setWrongFlashIndex(null);
    setErrorKeyCounts({});
    setEmittedDone(false);
  }, [drill.id]);

  useEffect(() => {
    if (!engine.isStarted || engine.isFinished || autoPaused) return;
    const id = setInterval(() => {
      if (Date.now() - lastActivityRef.current > 5000) {
        engine.pause();
        setAutoPaused(true);
      }
    }, 300);
    return () => clearInterval(id);
  }, [engine, autoPaused, engine.isStarted, engine.isFinished]);

  useEffect(() => () => {
    if (wrongKeyTimerRef.current) clearTimeout(wrongKeyTimerRef.current);
    if (wrongPopupTimerRef.current) clearTimeout(wrongPopupTimerRef.current);
    if (wrongFlashTimerRef.current) clearTimeout(wrongFlashTimerRef.current);
  }, []);

  // ── Sync sound toggle ──
  useEffect(() => { setEnabled(soundEnabled); }, [soundEnabled, setEnabled]);

  const buildCompletionStats = useCallback((wasStoppedEarly = false): DrillCompleteStats => ({
    wpm:            engine.wpm,
    netWpm:         engine.netWpm,
    accuracy:       displayAccuracy,
    errors:         displayErrors,
    elapsed:        engine.elapsedSeconds,
    maxCombo,
    correctChars:   engine.correctCount,
    totalChars:     Math.max(engine.cursor, displayTotalAttempts),
    errorKeyCounts,
    wasStoppedEarly,
  }), [
    engine.wpm,
    engine.netWpm,
    engine.elapsedSeconds,
    engine.correctCount,
    engine.cursor,
    displayAccuracy,
    displayErrors,
    displayTotalAttempts,
    maxCombo,
    errorKeyCounts,
  ]);

  // ── Emit onComplete once ──
  useEffect(() => {
    if (engine.isFinished && !emittedDone) {
      setEmittedDone(true);
      onComplete(buildCompletionStats(false));
    }
  }, [engine.isFinished, emittedDone, onComplete, buildCompletionStats]);

  // ── Input change: drive typing engine + combo + sounds ──
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawVal = e.target.value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    if (e.target.value !== rawVal) {
      e.target.value = rawVal;
    }
    const prevVal = inputVal.current;

    if (!engine.isStarted && rawVal.length > 0) {
      lastActivityRef.current = Date.now();
    }

    if (autoPaused) {
      engine.resume();
      setAutoPaused(false);
      lastActivityRef.current = Date.now();
    }

    if (rawVal.length > prevVal.length) {
      const typedChar = rawVal[rawVal.length - 1];
      const expected = drill.content[prevVal.length] ?? "";
      lastActivityRef.current = Date.now();

      if (typedChar !== expected) {
        setPendingErrorPositions((prev) => new Set(prev).add(prevVal.length));
        const normalizedWrongKey = typedChar === "\n" ? "Enter" : getDisplayKey(typedChar, true);
        const displayedWrongKey = normalizedWrongKey;
        setErrorKeyCounts((prev) => ({
          ...prev,
          [displayedWrongKey]: (prev[displayedWrongKey] ?? 0) + 1,
        }));
        setWrongPopup({ index: prevVal.length, char: typedChar === "\n" ? "Enter" : getDisplayKey(typedChar, true) });
        setWrongFlashIndex(prevVal.length);
        if (wrongFlashTimerRef.current) clearTimeout(wrongFlashTimerRef.current);
        wrongFlashTimerRef.current = setTimeout(() => setWrongFlashIndex(null), 170);
        if (wrongPopupTimerRef.current) clearTimeout(wrongPopupTimerRef.current);
        wrongPopupTimerRef.current = setTimeout(() => setWrongPopup(null), 320);
        play("keystroke_error");
        setCombo(0);
        setWrongKey(typedChar);
        if (wrongKeyTimerRef.current) clearTimeout(wrongKeyTimerRef.current);
        wrongKeyTimerRef.current = setTimeout(() => setWrongKey(null), 320);
        e.target.value = prevVal;
        engine.handleInput(prevVal);
        prevCursor.current = prevVal.length;
        return;
      }
    }

    const val = rawVal;
    inputVal.current = val;
    engine.handleInput(val);

    const cursor     = val.length;
    const correct    = engine.correctCount;
    const typedChar  = drill.content[cursor - 1];
    const wasCorrect = cursor > prevCursor.current && typedChar === val[cursor - 1];
    const isSpace    = typedChar === " ";
    const isSentenceBreak = typedChar === "\n";
    const isCompletionChar = isLineBreakDrill ? isSentenceBreak : isSpace;

    if (wasCorrect) {
      setWrongFlashIndex(null);

      const typedIndex = cursor - 1;
      if (typedIndex >= 0 && pendingErrorPositions.has(typedIndex)) {
        setErrorMarkedPositions((prev) => new Set(prev).add(typedIndex));
        setPendingErrorPositions((prev) => {
          const next = new Set(prev);
          next.delete(typedIndex);
          return next;
        });
      }
    }

    if (wasCorrect) {
      setCombo((c) => {
        const next = c + 1;
        if (next > maxCombo) setMaxCombo(next);
        if (next % 20 === 0) {
          play("streak_milestone");
          setMilestoneCombo(next);
          setShowMilestone(true);
          setTimeout(() => setShowMilestone(false), 900);
        } else if (isSpace) {
          // Spacebar — deeper mechanical sound
          play("keystroke_space");
        } else {
          // Regular alphanumeric key click
          play("keystroke");
        }
        return next;
      });

      if (isCompletionChar) {
        play("word_complete");
        setCompletedWords((prev) => new Set(prev).add(cursor - 1));
      }
    } else if (cursor > prevCursor.current) {
      // Error — muted dull thud (no satisfying click)
      play("keystroke_error");
      setCombo(0);
    }

    prevCursor.current = cursor;
    prevCorrect.current = correct;
  }, [engine, drill.content, maxCombo, play, autoPaused, pendingErrorPositions, isLineBreakDrill]);

  const handleReset = () => {
    engine.reset();
    inputVal.current = "";
    if (inputRef.current) inputRef.current.value = "";
    lastActivityRef.current = 0;
    setCombo(0);
    setMaxCombo(0);
    setCompletedWords(new Set());
    setPendingErrorPositions(new Set());
    setErrorMarkedPositions(new Set());
    setWrongPopup(null);
    setAutoPaused(false);
    setWrongKey(null);
    setWrongFlashIndex(null);
    setErrorKeyCounts({});
    setEmittedDone(false);
    inputRef.current?.focus();
  };

  const handleManualNext = useCallback(() => {
    if (emittedDone) return;
    engine.pause();
    setAutoPaused(false);
    setEmittedDone(true);
    onComplete(buildCompletionStats(true));
  }, [emittedDone, engine, onComplete, buildCompletionStats]);

  if (isPagedDrill) {
    return (
      <div className="flex flex-col gap-0">
        <textarea
          ref={inputRef}
          className="absolute opacity-0 h-0 w-0 pointer-events-none"
          onChange={handleChange}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          tabIndex={0}
        />

        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-4">
          <motion.div
            className="h-full bg-linear-to-r from-blue-400 to-indigo-500 rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ ease: "linear", duration: 0.2 }}
          />
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-1 min-w-0 flex flex-col items-center">
            <div className="w-full rounded-2xl bg-slate-50 border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-base leading-tight">{drill.title}</h3>
                  <p className="text-slate-400 text-xs">{drill.hint ?? `Target: ${drill.targetWpm} WPM`}</p>
                </div>
                <ComboBadge combo={combo} milestone={showMilestone} />
              </div>

              <div onClick={() => inputRef.current?.focus()} className="cursor-text">
                <GamifiedTextDisplay
                  chars={engine.chars}
                  cursor={engine.cursor}
                  completedWords={completedWords}
                  isPagedDrill={true}
                  isParagraphDrill={isParagraphDrill}
                  errorMarkedPositions={errorMarkedPositions}
                  wrongPopup={wrongPopup}
                  wrongFlashIndex={wrongFlashIndex}
                  visibleRange={visiblePagedRange}
                />
              </div>

              <MilestoneToast show={showMilestone} combo={milestoneCombo} />
            </div>

            {showKeyboard && (
              <div className="mt-2 w-full">
                <VirtualKeyboard
                  nextExpectedChar={engine.isFinished ? null : drill.content[engine.cursor] ?? null}
                  showHands={showHands}
                  wrongKey={wrongKey}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <div className="flex flex-col items-center gap-1 rounded-2xl border-2 shadow-sm px-5 py-4 min-w-24 transition-colors border-slate-100 bg-white">
              <span className="text-[11px] font-semibold uppercase tracking-widest flex items-center gap-1 text-slate-400">
                <Timer className="w-3 h-3" /> Time
              </span>
              <span className="text-3xl font-black leading-none tabular-nums text-slate-800">
                {formatTime(engine.elapsedSeconds)}
              </span>
              {autoPaused && <span className="text-[10px] font-semibold text-amber-500 mt-0.5">⏸ Paused</span>}
            </div>

            <div className="flex flex-col items-center gap-0.5 rounded-2xl bg-white border border-slate-100 shadow-sm px-5 py-4 min-w-[90px]">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-500">WPM</span>
              <span className="text-3xl font-black text-slate-800 leading-none">{engine.wpm}</span>
            </div>

            <div className="flex flex-col items-center gap-0.5 rounded-2xl bg-white border border-slate-100 shadow-sm px-5 py-4 min-w-[90px]">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-500">ACC</span>
              <span className="text-3xl font-black text-slate-800 leading-none">{displayAccuracy}%</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{displayErrors} err</span>
            </div>

            <button
              onClick={handleManualNext}
              className="flex items-center justify-center gap-1.5 text-[12px] text-emerald-700 hover:text-emerald-800 py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm transition-colors font-semibold"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setSoundEnabled((s) => !s)}
              className="flex items-center justify-center gap-1.5 text-[12px] text-slate-400 hover:text-slate-600 py-2 px-3 rounded-xl bg-white border border-slate-100 shadow-sm transition-colors"
              title={soundEnabled ? "Mute sounds" : "Enable sounds"}
            >
              {soundEnabled ? <><Volume2 className="w-3.5 h-3.5" /> On</> : <><VolumeX className="w-3.5 h-3.5" /> Off</>}
            </button>

            <button
              onClick={() => setShowHands((s) => !s)}
              className={[
                "flex items-center justify-between gap-2 text-[12px] py-2 px-3 rounded-xl border shadow-sm transition-colors",
                showHands
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "bg-white border-slate-100 text-slate-400 hover:text-slate-600",
              ].join(" ")}
            >
              <span className="flex items-center gap-1.5"><Hand className="w-3.5 h-3.5" /> Hands</span>
              <span className={[
                "inline-flex w-8 h-4 rounded-full transition-colors duration-200 relative shrink-0",
                showHands ? "bg-blue-500" : "bg-slate-200",
              ].join(" ")}>
                <span className={[
                  "absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200",
                  showHands ? "translate-x-4" : "translate-x-0.5",
                ].join(" ")} />
              </span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 text-[12px] text-slate-400 hover:text-slate-600 py-2 px-3 rounded-xl bg-white border border-slate-100 shadow-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Hidden real input */}
      <textarea
        ref={inputRef}
        className="absolute opacity-0 h-0 w-0 pointer-events-none"
        onChange={handleChange}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        tabIndex={0}
      />

      {/* ── Header row ── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-800 text-base leading-tight">{drill.title}</h3>
          <p className="text-slate-400 text-xs">{drill.hint ?? `Target: ${drill.targetWpm} WPM`}</p>
        </div>
        <div className="flex items-center gap-2">
          <ComboBadge combo={combo} milestone={showMilestone} />
          <button
            onClick={() => setSoundEnabled((s) => !s)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>
        </div>
      </div>

      {/* ── Progress rocket ── */}
      <div className="relative">
        <ProgressRocket pct={pct} />
        <MilestoneToast show={showMilestone} combo={milestoneCombo} />
      </div>

      {/* ── Stats bar ── */}
      <div className="flex gap-3">
        {[
          { label: "WPM", value: engine.wpm, color: "text-blue-600" },
          { label: "NET", value: engine.netWpm, color: "text-emerald-600" },
          { label: "ACC", value: `${displayAccuracy}%`, color: displayAccuracy >= 95 ? "text-emerald-600" : displayAccuracy >= 85 ? "text-amber-600" : "text-red-500" },
          { label: "ERR", value: displayErrors, color: "text-red-500" },
          { label: "TIME", value: `${engine.elapsedSeconds}s`, color: "text-slate-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center">
            <p className={`text-lg font-bold leading-none ${color}`}>{value}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Text display ── */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="cursor-text"
      >
        <GamifiedTextDisplay
          chars={engine.chars}
          cursor={engine.cursor}
          completedWords={completedWords}
          errorMarkedPositions={errorMarkedPositions}
          wrongPopup={wrongPopup}
          wrongFlashIndex={wrongFlashIndex}
        />
      </div>

      {/* ── Progress bar (text %) ── */}
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-emerald-500 rounded-full"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.12 }}
        />
      </div>

      {/* ── Virtual Keyboard ── */}
      {showKeyboard && (
        <div className="mt-2">
          <VirtualKeyboard
            nextExpectedChar={engine.isFinished ? null : drill.content[engine.cursor] ?? null}
            showHands={true}
            wrongKey={wrongKey}
          />
        </div>
      )}
    </div>
  );
}




