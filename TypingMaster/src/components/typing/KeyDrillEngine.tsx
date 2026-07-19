"use client";

// =============================================================================
//  KeyDrillEngine  — Progressive home-row key drill  (typing.com hybrid v2)
//
//  Flow per new key:
//    IntroScreen  (press key once → "Great!" → press ENTER) →
//    Solo×8  (typing.com key-row, type the key 8 times fast) →
//    [if 2+ known]  Mix×12  (all learned keys mixed) →
//    next key intro …
//
//  Key-introduction order (set by curriculum content):
//    f → j → a → s → d → k → l → ;
//
//  Keypress timing:
//    80 ms green-flash then IMMEDIATELY advance — zero visible gap
// =============================================================================

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import VirtualKeyboard from "@/components/keyboard/VirtualKeyboard";
import { useSoundManager } from "@/components/typing/SoundManager";
import type { SoundName } from "@/components/typing/SoundManager";
import { FINGER_COLOR, getFingerForChar }  from "@/components/keyboard/keyboardData";
import { FINGER_SVG_FILL }                 from "@/components/keyboard/DrillSvgHands";
import type { Drill }                      from "@/data/englishCurriculum";
import type { DrillCompleteStats }         from "./GamifiedTypingEngine";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const HAND_NAME:   Record<string, string> = { left: "Left",   right: "Right"  };
const FINGER_NAME: Record<string, string> = {
  pinky: "Pinky", ring: "Ring", middle: "Middle", index: "Index", thumb: "Thumb",
};

// ─── Sequence builder ─────────────────────────────────────────────────────────

/** Extract unique lowercase chars in first-appearance order, skipping spaces. */
function uniqueKeysInOrder(content: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const ch of content) {
    if (ch === " " || ch === "\n" || ch === "\t") continue;
    const k = ch.toLowerCase();
    if (!seen.has(k)) { seen.add(k); result.push(k); }
  }
  return result;
}

function makeLcg(seed: number) {
  let s = (seed >>> 0) | 1;
  return () => { s = (Math.imul(1664525, s) + 1013904223) | 0; return (s >>> 0) / 4294967296; };
}
function hashStr(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 0x01000193);
  return h;
}

interface Phase {
  type:    "solo" | "mix";
  keys:    string[];
  newKey?: string;
  sequence: string[];
}

function buildPhases(ukeys: string[], solo = 8, mix = 12): Phase[] {
  const rng    = makeLcg(hashStr(ukeys.join("")));
  const phases: Phase[] = [];
  for (let i = 0; i < ukeys.length; i++) {
    const k = ukeys[i];
    phases.push({ type: "solo", keys: [k], newKey: k, sequence: Array(solo).fill(k) });
    if (i >= 1) {
      const pool = ukeys.slice(0, i + 1);
      const seq: string[] = [];
      for (let r = 0; r < mix; r++) seq.push(pool[Math.floor(rng() * pool.length)]);
      phases.push({ type: "mix", keys: pool, sequence: seq });
    }
  }
  return phases;
}

function phasesToSequence(phases: Phase[]): string[] {
  return phases.flatMap(p => p.sequence);
}

function getPhaseAt(phases: Phase[], idx: number) {
  let offset = 0;
  for (let pi = 0; pi < phases.length; pi++) {
    const p = phases[pi];
    if (idx < offset + p.sequence.length)
      return { phase: p, localIndex: idx - offset, phaseIdx: pi };
    offset += p.sequence.length;
  }
  return { phase: phases[phases.length - 1], localIndex: 0, phaseIdx: phases.length - 1 };
}

function phaseStart(phases: Phase[], phaseIdx: number): number {
  let off = 0;
  for (let i = 0; i < phaseIdx; i++) off += phases[i].sequence.length;
  return off;
}

// ─── Key cap (typing.com row) ─────────────────────────────────────────────────

type KS = "done" | "current" | "upcoming";

function KeyCap({ char, status, shakeToken }: { char: string; status: KS; shakeToken?: number }) {
  const label = char === " " ? "Sp" : char.toUpperCase();
  const ft    = char !== " " ? getFingerForChar(char) : null;
  const col   = ft ? FINGER_COLOR[ft.finger] : null;

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
        "flex items-center justify-center w-14 h-14 rounded-xl font-black shrink-0 select-none text-lg transition-colors duration-100",
        status === "current" && shaking
          ? "bg-red-500 text-white shadow-md border-b-4 border-red-700"
          : status === "current"
          ? `text-white shadow-md border-b-4 border-black/20 ${col ? col.bg : "bg-blue-500"}`
          : status === "done"
          ? "bg-emerald-100 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400 opacity-40"
          : "bg-slate-100 text-slate-400 dark:bg-slate-700/50 dark:text-slate-500 border border-slate-200 dark:border-slate-600",
      ].join(" ")}
    >
      {label}
    </motion.div>
  );
}

const LINE_SIZE = 10;

function KeyRow({ sequence, currentIndex, shakeToken }: { sequence: string[]; currentIndex: number; shakeToken: number }) {
  const lineIndex = Math.floor(currentIndex / LINE_SIZE);
  const lineStart = lineIndex * LINE_SIZE;
  const lineEnd   = Math.min(sequence.length, lineStart + LINE_SIZE);
  const slice     = sequence.slice(lineStart, lineEnd);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={lineIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex items-center justify-center gap-2 py-2"
      >
        {slice.map((ch, i) => {
          const abs    = lineStart + i;
          const status: KS =
            abs < currentIndex ? "done" : abs === currentIndex ? "current" : "upcoming";
          return <KeyCap key={abs} char={ch} status={status} shakeToken={status === "current" ? shakeToken : 0} />;
        })}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Phase label ──────────────────────────────────────────────────────────────

function PhaseLabel({ phase }: { phase: Phase }) {
  if (phase.type === "solo") return (
    <div className="flex items-center gap-2">
      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider">
        New Key
      </span>
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Practice: <strong className="text-slate-700 dark:text-slate-200">
          {phase.newKey!.toUpperCase()}
        </strong>
      </span>
    </div>
  );
  return (
    <div className="flex items-center gap-2">
      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] font-black uppercase tracking-wider">
        Mix
      </span>
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {phase.keys.map(k => k.toUpperCase()).join(" . ")}
      </span>
    </div>
  );
}

// ─── IntroScreen ─────────────────────────────────────────────────────────────

type IntroStep = "waitKey" | "celebrate" | "waitEnter";

function IntroScreen({
  introKey,
  onDone,
  onWaitEnter,
  play,
}: {
  introKey:     string;
  onDone:       () => void;
  onWaitEnter:  () => void;
  play:         (s: SoundName) => void;
}) {
  const [step, setStep] = useState<IntroStep>("waitKey");

  const ft     = introKey !== " " ? getFingerForChar(introKey) : null;
  const svgCol = ft ? FINGER_SVG_FILL[ft.finger] : "#3b82f6";
  const label  = introKey === " " ? "Space" : introKey.toUpperCase();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (step === "waitKey") {
        const k = e.key === " " ? " " : e.key.length === 1 ? e.key.toLowerCase() : null;
        if (k === introKey) {
          e.preventDefault();
          play("keystroke");
          setStep("celebrate");
          setTimeout(() => { setStep("waitEnter"); onWaitEnter(); }, 600);
        }
      } else if (step === "waitEnter") {
        if (e.key === "Enter") {
          e.preventDefault();
          play("word_complete");
          onDone();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [step, introKey, onDone, onWaitEnter, play]);

  return (
    <motion.div
      key={`intro-${introKey}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="w-full max-w-2xl"
    >
      {/* Compact intro card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-5 py-4 flex items-center gap-5">

        {/* Keycap */}
        <AnimatePresence mode="wait">
          {step === "waitKey" ? (
            <motion.div
              key="cap-wait"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ type: "spring", stiffness: 440, damping: 22 }}
              className="relative flex items-center justify-center w-16 h-16 rounded-xl select-none shrink-0"
              style={{
                backgroundColor: svgCol,
                boxShadow: `0 5px 0 rgba(0,0,0,0.28), 0 8px 20px ${svgCol}44`,
                transform: "translateY(-2px)",
              }}
            >
              <div className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 55%)" }} />
              <span className="relative text-3xl font-black text-white drop-shadow">{label}</span>
            </motion.div>
          ) : (
            <motion.div
              key="cap-done"
              initial={{ scale: 0.8, opacity: 0, y: 0 }}
              animate={{ scale: 1, opacity: 1, y: 3 }}
              exit={{ scale: 1.1, opacity: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 440, damping: 22 }}
              className="relative flex items-center justify-center w-16 h-16 rounded-xl select-none shrink-0"
              style={{
                backgroundColor: "#10b981",
                boxShadow: "0 2px 0 rgba(0,0,0,0.25), 0 4px 12px #10b98144",
              }}
            >
              <div className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%)" }} />
              <span className="relative text-3xl font-black text-white drop-shadow">{label}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider">
              New Key
            </span>
            <span className="text-lg font-black text-slate-800 dark:text-slate-100">
              Meet <span style={{ color: svgCol }}>[{label}]</span>
            </span>
          </div>

          {ft && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <strong style={{ color: svgCol }}>{HAND_NAME[ft.hand]} {FINGER_NAME[ft.finger]}</strong> finger types <strong>[{label}]</strong>. Return to home position after.
            </p>
          )}

          <AnimatePresence mode="wait">
            {step === "waitKey" ? (
              <motion.p
                key="hint-key"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                className="text-xs font-semibold text-slate-400"
              >
                Press{" "}
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[11px] font-black border border-slate-300 dark:border-slate-500">
                  {label}
                </kbd>{" "}
                to continue
              </motion.p>
            ) : (
              <motion.div key="hint-enter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">Great job!</span>
                {step === "waitEnter" && (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="text-xs text-slate-400 font-semibold"
                  >
                    Press{" "}
                    <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[11px] font-black border border-slate-300 dark:border-slate-500">
                      Enter
                    </kbd>{" "}
                    to practice
                  </motion.span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </motion.div>
  );
}

// ─── Stat badge ───────────────────────────────────────────────────────────────

function StatBadge({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-5">
      <span className={`text-xl font-black ${color}`}>{value}</span>
      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface KeyDrillEngineProps {
  drill:      Drill;
  onComplete: (stats: DrillCompleteStats) => void;
}

type Screen = { mode: "intro"; key: string } | { mode: "practice" };

export default function KeyDrillEngine({ drill, onComplete }: KeyDrillEngineProps) {
  const { phases, sequence, ukeys } = useMemo(() => {
    const ukeys    = uniqueKeysInOrder(drill.content);
    const phases   = buildPhases(ukeys, 8, 12);
    const sequence = phasesToSequence(phases);
    return { phases, sequence, ukeys };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drill.id]);

  const total = sequence.length;

  const [screen, setScreen] = useState<Screen>(() =>
    ukeys.length > 0 ? { mode: "intro", key: ukeys[0] } : { mode: "practice" },
  );

  const [index,        setIndex]        = useState(0);
  const [correct,      setCorrect]      = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [startTime,    setStartTime]    = useState<number | null>(null);
  const [elapsed,      setElapsed]      = useState(0);
  const [introWaitsEnter, setIntroWaitsEnter] = useState(false);
  const [pendingMistakePositions, setPendingMistakePositions] = useState<Set<number>>(new Set());
  const [errorPositions, setErrorPositions] = useState<Set<number>>(new Set());
  const [wrongKey,   setWrongKey]   = useState<string | null>(null);
  const [shakeToken, setShakeToken] = useState(0);
  const wrongKeyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advancingRef   = useRef(false);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const emittedDone    = useRef(false);
  const shownIntrosRef = useRef<Set<string>>(new Set(ukeys[0] ? [ukeys[0]] : []));

  const { play, setEnabled } = useSoundManager(true);

  const isDone = screen.mode === "practice" && index >= total;

  const { phase: currentPhase, phaseIdx: currentPhaseIdx } = useMemo(
    () => getPhaseAt(phases, Math.min(index, total - 1)),
    [phases, index, total],
  );

  const currentKey   = sequence[index] ?? "";
  const displayMistakes = errorPositions.size + pendingMistakePositions.size;
  const totalAtt     = correct + pendingMistakePositions.size;
  const accuracy     = totalAtt > 0 ? Math.round(((totalAtt - displayMistakes) / totalAtt) * 100) : 100;
  const pct          = total > 0 ? Math.round((index / total) * 100) : 0;

  useEffect(() => {
    if (startTime === null) return;
    timerRef.current = setInterval(
      () => setElapsed(Math.round((Date.now() - startTime) / 1000)), 500,
    );
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTime]);

  useEffect(() => { setEnabled(soundEnabled); }, [soundEnabled, setEnabled]);

  useEffect(() => {
    if (!isDone || emittedDone.current) return;
    emittedDone.current = true;
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    play("drill_complete");
    const acc = totalAtt > 0 ? Math.round(((totalAtt - displayMistakes) / totalAtt) * 100) : 100;
    const wpm = elapsed > 0 ? Math.round((correct / 5) / (elapsed / 60)) : 0;
    onComplete({
      wpm,
      netWpm: wpm,
      accuracy: acc,
      errors: displayMistakes,
      elapsed,
      maxCombo: correct,
      correctChars: correct,
      totalChars: total,
      errorKeyCounts: {},
    });
  }, [isDone, correct, elapsed, onComplete, play, totalAtt, displayMistakes]);

  const handleReset = useCallback(() => {
    setIndex(0);
    setCorrect(0);
    setElapsed(0);
    setStartTime(null);
    setPendingMistakePositions(new Set());
    setErrorPositions(new Set());
    advancingRef.current  = false;
    emittedDone.current   = false;
    shownIntrosRef.current = new Set(ukeys[0] ? [ukeys[0]] : []);
    setScreen(ukeys.length > 0 ? { mode: "intro", key: ukeys[0] } : { mode: "practice" });
    setIntroWaitsEnter(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, [ukeys]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { handleReset(); }, [drill.id]);

  const handleIntroDone = useCallback(() => {
    setIntroWaitsEnter(false);
    setScreen({ mode: "practice" });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (screen.mode !== "practice") return;
    if (isDone || advancingRef.current) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const pressed = e.key === " " ? " " : e.key.length === 1 ? e.key.toLowerCase() : null;
    if (pressed === null) return;
    e.preventDefault();

    setStartTime(prev => prev ?? Date.now());
    const target = sequence[index];

    if (pressed === target) {
      play("keystroke");
      setCorrect(c => c + 1);
      if (pendingMistakePositions.has(index)) {
        setErrorPositions((prev) => new Set(prev).add(index));
        setPendingMistakePositions((prev) => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });
      }
      setShakeToken(0);
      setWrongKey(null);
      if (wrongKeyTimerRef.current) { clearTimeout(wrongKeyTimerRef.current); wrongKeyTimerRef.current = null; }
      advancingRef.current = true;

      const nextIdx = index + 1;

      const needsIntro = (() => {
        if (nextIdx >= total) return false;
        const { phase: np, phaseIdx: npi } = getPhaseAt(phases, nextIdx);
        if (np.type !== "solo" || !np.newKey) return false;
        if (shownIntrosRef.current.has(np.newKey)) return false;
        return nextIdx === phaseStart(phases, npi);
      })();

      setTimeout(() => {
        setIndex(nextIdx);
        advancingRef.current = false;

        if (needsIntro) {
          const { phase: np } = getPhaseAt(phases, nextIdx);
          const nk = np.newKey!;
          shownIntrosRef.current = new Set([...shownIntrosRef.current, nk]);
          setScreen({ mode: "intro", key: nk });
        }
      }, 80);

    } else {
      play("keystroke_error");
      setPendingMistakePositions((prev) => new Set(prev).add(index));
      setWrongKey(pressed);
      setShakeToken(t => t + 1);
      if (wrongKeyTimerRef.current) clearTimeout(wrongKeyTimerRef.current);
      wrongKeyTimerRef.current = setTimeout(() => setWrongKey(null), 500);
    }
  }, [screen.mode, isDone, index, sequence, play, phases, total, pendingMistakePositions]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Suppress unused warning for currentPhaseIdx
  void currentPhaseIdx;

  return (
    <div className="flex flex-col gap-3 items-center select-none w-full mx-auto">

      {/* ── Top bar: progress + controls ── */}
      <div className="w-full flex items-center gap-2">
        {/* Progress track */}
        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-blue-500"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        <span className="text-[11px] tabular-nums text-slate-400 dark:text-slate-500 shrink-0">
          {index}<span className="opacity-50">/{total}</span>
        </span>
        <button
          onClick={() => setSoundEnabled(s => !s)}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
          title={soundEnabled ? "Mute" : "Unmute"}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-[11px] font-semibold transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Restart
        </button>
      </div>

      <AnimatePresence mode="wait">

        {isDone && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 py-14 px-8 flex flex-col items-center gap-5"
          >
            <span className="text-7xl leading-none">&#127881;</span>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Drill Complete!</h2>
            <div className="flex items-center">
              <StatBadge label="Correct"  value={correct}        color="text-emerald-600 dark:text-emerald-400" />
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <StatBadge label="Mistakes" value={displayMistakes} color={displayMistakes === 0 ? "text-slate-400" : "text-red-500"} />
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <StatBadge label="Accuracy" value={`${accuracy}%`} color="text-blue-600 dark:text-blue-400" />
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <StatBadge label="Time"     value={`${elapsed}s`}  color="text-slate-500 dark:text-slate-400" />
            </div>
          </motion.div>
        )}

        {!isDone && screen.mode === "intro" && (
          <IntroScreen
            key={`intro-${screen.key}`}
            introKey={screen.key}
            onDone={handleIntroDone}
            onWaitEnter={() => setIntroWaitsEnter(true)}
            play={play}
          />
        )}

        {!isDone && screen.mode === "practice" && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-full flex flex-col gap-0"
          >
            {/* ── Key row card ── */}
            <div className="bg-white dark:bg-slate-800 rounded-t-2xl border border-slate-200 dark:border-slate-700 px-5 pt-3 pb-3">
              <div className="flex items-center mb-2.5">
                <PhaseLabel phase={currentPhase} />
              </div>
              <KeyRow sequence={sequence} currentIndex={index} shakeToken={shakeToken} />
            </div>

            {/* ── Stats strip ── */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border-x border-b border-slate-200 dark:border-slate-700 rounded-b-2xl py-2.5 flex items-center justify-center divide-x divide-slate-200 dark:divide-slate-700">
              <div className="flex flex-col items-center px-5">
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400 leading-none">{correct}</span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 mt-0.5">Correct</span>
              </div>
              <div className="flex flex-col items-center px-5">
                <span className={`text-base font-black leading-none ${displayMistakes === 0 ? "text-slate-300 dark:text-slate-600" : "text-red-500"}`}>{displayMistakes}</span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 mt-0.5">Mistakes</span>
              </div>
              <div className="flex flex-col items-center px-5">
                <span className={`text-base font-black leading-none ${accuracy >= 95 ? "text-emerald-600 dark:text-emerald-400" : accuracy >= 80 ? "text-amber-500" : "text-red-500"}`}>{accuracy}%</span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 mt-0.5">Accuracy</span>
              </div>
              <div className="flex flex-col items-center px-5">
                <span className="text-base font-black text-slate-500 dark:text-slate-400 leading-none">{elapsed}s</span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 mt-0.5">Time</span>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── Keyboard — fixed position, outside AnimatePresence ── */}
      {!isDone && (
        <div className="w-full flex flex-col items-center">
          <VirtualKeyboard
            nextExpectedChar={screen.mode === "intro" ? (introWaitsEnter ? "\n" : screen.key) : (currentKey || null)}
            wrongKey={wrongKey}
            showHands={true}
          />
        </div>
      )}
    </div>
  );
}
