"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Volume2, VolumeX, Timer, Settings, X } from "lucide-react";
import VirtualKeyboard from "@/components/typing-master/keyboard/VirtualKeyboard";
import { useSoundManager } from "@/components/typing-master/typing/SoundManager";
import {
  FINGER_COLOR,
  getFingerForChar,
} from "@/components/typing-master/keyboard/keyboardData";
import type { Drill } from "@/data/typing-master/englishCurriculum";
import type { DrillCompleteStats } from "./GamifiedTypingEngine";

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const getKeyOffset = (char: string) => {
  if (!char) return "0px";
  const c = char.toLowerCase();

  // typing.com falling letters typically only use two positions
  // Left hand characters go left, Right hand characters go right

  const leftHandKeys = "qazwsxedcrfvtgb";
  const rightHandKeys = "yhnujmik,ol.p;/";

  if (leftHandKeys.includes(c)) return "-80px";
  if (rightHandKeys.includes(c)) return "80px";

  if (c === " ") return "0px";

  return "0px";
};

export default function FallingLettersEngine({
  drill,
  onComplete,
}: {
  drill: Drill;
  onComplete: (stats: DrillCompleteStats) => void;
}) {
  const { play, setEnabled } = useSoundManager();
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const toggleSound = () => {
    setIsSoundEnabled((prev) => {
      const next = !prev;
      setEnabled(next);
      return next;
    });
  };

  const sequence = useMemo(() => {
    return drill.content.split(/\s+/).filter((c) => c.length > 0);
  }, [drill.content]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [errors, setErrors] = useState(0);
  const [errorKeyCounts, setErrorKeyCounts] = useState<Record<string, number>>(
    {},
  );

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [shakeToken, setShakeToken] = useState(0);

  // Settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showHands, setShowHands] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [errorSoundOn, setErrorSoundOn] = useState(true);

  const isDone = currentIndex >= sequence.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const emittedDone = useRef(false);
  const wrongKeyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer
  useEffect(() => {
    if (startTime && !isDone) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isDone]);

  // Completion
  useEffect(() => {
    if (isDone && !emittedDone.current) {
      emittedDone.current = true;
      if (timerRef.current) clearInterval(timerRef.current);

      const totalTime = elapsed || 1;
      const minutes = totalTime / 60;
      const totalChars = sequence.reduce((acc, val) => acc + val.length, 0); // Words/chars
      const wpm = Math.round(totalChars / 5 / minutes);
      const totalAttempted = correct + errors;
      const accuracy =
        totalAttempted > 0 ? Math.round((correct / totalAttempted) * 100) : 0;

      setTimeout(() => {
        play("drill_complete");
        onComplete({
          wpm: wpm || 0,
          netWpm: wpm || 0,
          accuracy: accuracy || 0,
          errors: errors || 0,
          elapsed: totalTime || 1,
          maxCombo: 0,
          correctChars: correct || 0,
          totalChars: totalAttempted || 1,
          errorKeyCounts: errorKeyCounts || {},
        } as any);
      }, 400);
    }
  }, [
    isDone,
    elapsed,
    correct,
    errors,
    sequence,
    errorKeyCounts,
    onComplete,
    play,
  ]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isDone) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      const pressed =
        e.key === " " ? " " : e.key.length === 1 ? e.key.toLowerCase() : null;
      if (pressed === null) return;
      e.preventDefault();

      setStartTime((prev) => prev ?? Date.now());

      const target = sequence[currentIndex];

      if (pressed === target) {
        play("keystroke");
        setCorrect((c) => c + 1);
        setCurrentIndex((i) => i + 1);
        setShakeToken(0);
        setWrongKey(null);
        if (wrongKeyTimerRef.current) clearTimeout(wrongKeyTimerRef.current);
      } else {
        if (errorSoundOn) play("keystroke_error");
        setErrors((e) => e + 1);
        setErrorKeyCounts((prev) => ({
          ...prev,
          [target]: (prev[target] || 0) + 1,
        }));
        setWrongKey(pressed);
        setShakeToken(Date.now());
        if (wrongKeyTimerRef.current) clearTimeout(wrongKeyTimerRef.current);
        wrongKeyTimerRef.current = setTimeout(() => setWrongKey(null), 800);
      }
    },
    [isDone, sequence, currentIndex, play, errorSoundOn],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setCorrect(0);
    setErrors(0);
    setErrorKeyCounts({});
    setStartTime(null);
    setElapsed(0);
    setWrongKey(null);
    emittedDone.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    handleReset();
  }, [drill.id, handleReset]);

  const visibleCount = 5;
  const visibleStartIndex = currentIndex;

  // We want the current target at the bottom, and upcoming targets above it.
  const displayItems = [];
  for (let i = 0; i < visibleCount; i++) {
    const seqIndex = currentIndex + i;
    if (seqIndex < sequence.length) {
      displayItems.push(sequence[seqIndex]);
    } else {
      displayItems.push(null);
    }
  }

  // Reverse so the active target is at the bottom of the rendered list
  displayItems.reverse();

  const currentTargetChar = sequence[currentIndex] ?? "";
  const timeLimit = drill.timeLimit || 0;
  const timeRemaining =
    timeLimit > 0 ? Math.max(0, timeLimit - elapsed) : elapsed;

  return (
    <div className="flex flex-col flex-1 min-h-[100vh] w-full bg-transparent overflow-hidden relative focus:outline-none -mt-4">
      <div className="flex items-center justify-center py-4 shrink-0 w-full z-50">
        <div className="flex items-center gap-4">
          <ul className="flex items-center gap-6 px-6 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200/60 dark:border-slate-700/60 text-sm font-bold">
            <li className="flex flex-col items-center justify-center min-w-[3rem]">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5 text-center flex gap-1 items-center">
                <Timer className="w-3 h-3" /> Time
              </span>
              <span className="text-slate-700 dark:text-slate-200 leading-none text-lg">
                {timeLimit > 0 && timeRemaining === 0
                  ? "0:00"
                  : formatTime(timeRemaining)}
              </span>
            </li>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
            <li className="flex flex-col items-center justify-center min-w-[3rem]">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5 text-center">
                Errors
              </span>
              <span
                className={`leading-none text-lg ${errors > 0 ? "text-red-500" : "text-slate-700 dark:text-slate-200"}`}
              >
                {errors}
              </span>
            </li>
          </ul>

          <button
            onClick={toggleSound}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 transition-colors"
          >
            {!isSoundEnabled ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center relative w-full overflow-hidden">
        {/* Play Area Container */}
        <div className="w-full flex-1 flex flex-col items-center relative px-2 md:px-4 max-w-[800px] mx-auto mt-4 md:mt-8">
          <div className="w-full flex flex-col gap-3 relative">
            <AnimatePresence mode="popLayout" initial={false}>
              {displayItems.map((char, index) => {
                const isTargetItem = index === displayItems.length - 1; // Bottom item
                const absoluteIndex =
                  currentIndex + (displayItems.length - 1 - index);
                const keyId = `falling-letter-${absoluteIndex}`;

                if (char === null) {
                  return (
                    <motion.div
                      key={`empty-${absoluteIndex}`}
                      layout
                      className="w-full h-[58px]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0 }}
                    />
                  );
                }

                const ft = getFingerForChar(char);
                const col = ft ? FINGER_COLOR[ft.finger] : null;

                return (
                  <motion.div
                    key={keyId}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      layout: {
                        type: "tween",
                        duration: 0.35,
                        ease: "easeOut",
                      },
                      default: { duration: 0.3 },
                    }}
                    className={`w-full h-[62px] flex items-center justify-center rounded-2xl relative ${
                      isTargetItem
                        ? "bg-blue-100/60 dark:bg-blue-900/30 z-10 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.3)]"
                        : "bg-slate-200/50 dark:bg-white/5"
                    }`}
                  >
                    <div
                      className="absolute h-full flex items-center justify-center"
                      style={{
                        transform: `translateX(${getKeyOffset(char)})`,
                        transition: "transform 0.2s ease-out",
                      }}
                    >
                      <motion.div
                        animate={
                          isTargetItem && shakeToken
                            ? { x: [0, -6, 6, -6, 6, -4, 4, 0] }
                            : { x: 0 }
                        }
                        transition={{ duration: 0.35 }}
                        className={`min-w-[56px] h-[48px] px-3 flex items-center justify-center rounded-xl font-black text-[22px] shadow-sm border-b-[3px] transition-colors ${
                          isTargetItem && shakeToken
                            ? "bg-red-500 text-white border-red-700"
                            : isTargetItem
                              ? `text-white border-black/20 ${col ? col.bg : "bg-blue-500"}`
                              : "bg-white text-slate-400 border-slate-200/50 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-800/80"
                        }`}
                      >
                        {char === " " ? "Space" : char.toLowerCase()}
                      </motion.div>

                      {isTargetItem && currentIndex === 0 && elapsed === 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: -20, y: -10 }}
                          animate={{ opacity: 1, x: 0, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
                          className="absolute left-[100%] ml-3.5 items-center hidden sm:flex pointer-events-none"
                        >
                          <div className="bg-blue-500 text-white text-[15px] font-bold px-4 py-2.5 rounded-xl shadow-md whitespace-nowrap relative">
                            <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-r-[8px] border-r-blue-500 border-b-[7px] border-b-transparent"></div>
                            Start Typing!
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Keyboard Area - fixed at bottom of container */}
        <div className={`w-full flex justify-center mt-auto pb-0 translate-y-12 scale-[1.05] origin-bottom z-10 transition-opacity duration-300 ${showKeyboard ? "opacity-100" : "opacity-0 pointer-events-none h-0 overflow-hidden"}`}>
          <VirtualKeyboard
            nextExpectedChar={currentTargetChar}
            wrongKey={wrongKey}
            showHands={showHands}
            hideHint={true}
          />
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsSettingsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/4 -translate-x-1/2 z-[101] w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" /> Options
                </h3>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-5">
                {/* Global Sound */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSoundEnabled ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                      {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">Play Sounds</div>
                      <div className="text-xs text-slate-400 font-medium">Global typing sounds</div>
                    </div>
                  </div>
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isSoundEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <input type="checkbox" className="sr-only" checked={isSoundEnabled} onChange={toggleSound} />
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSoundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </label>

                {/* Error Sound */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${errorSoundOn ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">Error Beep</div>
                      <div className="text-xs text-slate-400 font-medium">Alert on wrong keys</div>
                    </div>
                  </div>
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${errorSoundOn ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <input type="checkbox" className="sr-only" checked={errorSoundOn} onChange={(e) => setErrorSoundOn(e.target.checked)} />
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${errorSoundOn ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </label>

                <div className="h-px w-full bg-slate-100 dark:bg-slate-700" />

                {/* Show Keyboard */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">Virtual Keyboard</div>
                  </div>
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showKeyboard ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <input type="checkbox" className="sr-only" checked={showKeyboard} onChange={(e) => setShowKeyboard(e.target.checked)} />
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showKeyboard ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </label>

                {/* Show Hands */}
                <label className={`flex items-center justify-between cursor-pointer ${!showKeyboard ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">Guide Hands</div>
                  </div>
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showHands ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <input type="checkbox" className="sr-only" checked={showHands} onChange={(e) => setShowHands(e.target.checked)} disabled={!showKeyboard} />
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showHands ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </label>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

