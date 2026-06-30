"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import { ShieldAlert, Crosshair, Heart, Trophy, AlertTriangle, PlayCircle, ArrowLeft } from "lucide-react";
import { useSoundManager } from "@/components/typing/SoundManager";
import type { Drill } from "@/data/englishCurriculum";
import type { DrillCompleteStats } from "./GamifiedTypingEngine";

type Plane = {
  id: string;
  word: string;
  typed: string;
  duration: number; // Seconds to cross the screen
  y: number; // 5 to 60 percentage
  isBoss: boolean;
  kind: 'normal' | 'bonus' | 'bomb' | 'boss';
  points: number;
  sprite: string;
};

type Missile = {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  isDud: boolean;
};

type Explosion = {
  id: string;
  x: number;
  y: number;
  type: 'hit' | 'dud' | 'destroy';
};

const WORD_BANK = [
  "as", "ask", "all", "also", "sad", "sale", "safe", "seal", "fall", "false", "class", "glass",
  "dad", "add", "adds", "deal", "lead", "lad", "land", "and", "sand", "stand", "last", "salt",
  "fast", "fade", "faded", "find", "fine", "final", "said", "sail", "skill", "disk", "side", "slide",
  "jazz", "jail", "jade", "joke", "join", "joint", "just", "judge", "juice", "jump", "jumps", "jungle",
  "keep", "keeps", "keen", "key", "keys", "kid", "kind", "kinds", "kill", "kilo", "lake", "like",
  "line", "link", "links", "lift", "life", "lives", "solid", "solo", "sold", "fold", "gold", "goal",
  "tone", "note", "stone", "stole", "alone", "close", "clone", "code", "coding", "read", "reader", "leader",
  "word", "world", "learn", "learns", "typing", "speed", "focus", "track", "target", "plane", "blast", "storm",
  "defend", "defense", "battle", "rocket", "pilot", "mission", "strike", "danger", "signal", "shield", "system"
];

const BONUS_WORD_BANK = [
  "bonus", "prime", "ultra", "rapid", "extra", "super", "boost", "glory", "lucky", "reward"
];

const BOMB_WORD_BANK = [
  "blast", "shock", "burst", "crash", "bomb", "boom", "quake", "storm"
];

const NORMAL_PLANE_SPRITES = [
  '/game-assets/planes/plane_1_blue.png',
  '/game-assets/planes/plane_1_pink.png',
  '/game-assets/planes/plane_1_red.png',
  '/game-assets/planes/plane_1_yellow.png',
  '/game-assets/planes/plane_2_blue.png',
  '/game-assets/planes/plane_2_green.png',
  '/game-assets/planes/plane_2_red.png',
  '/game-assets/planes/plane_2_yellow.png',
  '/game-assets/planes/plane_3_blue.png',
  '/game-assets/planes/plane_3_green.png'
];

const BONUS_PLANE_SPRITES = [
  '/game-assets/planes/plane_2_yellow.png',
  '/game-assets/planes/plane_1_yellow.png',
  '/game-assets/planes/plane_3_green.png'
];

const BOMB_PLANE_SPRITES = [
  '/game-assets/planes/plane_1_red.png',
  '/game-assets/planes/plane_2_red.png',
  '/game-assets/planes/plane_3_red.png'
];

const BOSS_PLANE_SPRITE = '/game-assets/planes/plane_3_red.png';
const BONUS_COIN_SPRITE = '/game-assets/coins/bronze.png';

const CANNON_BASE_Y = 80;
const CANNON_BARREL_LENGTH = 56;
const CANNON_MUZZLE_X_OFFSET = 0;
const CANNON_MUZZLE_Y_OFFSET = -3;

const canBuildWord = (word: string, allowedLetters: Set<string>) => {
  for (const char of word) {
    if (char === ' ') continue;
    if (!allowedLetters.has(char)) return false;
  }
  return true;
};

const generateWord = (letters: string[], length: number) => {
  if (!letters || letters.length === 0) return 'fallback';

  const allowedLetters = new Set(letters.map(l => l.toLowerCase()));
  const candidates = WORD_BANK.filter(word => canBuildWord(word, allowedLetters));
  const exact = candidates.filter(word => word.length === length);

  if (exact.length > 0) {
    return exact[Math.floor(Math.random() * exact.length)];
  }

  if (candidates.length > 0) {
    const nearest = [...candidates].sort((a, b) => Math.abs(a.length - length) - Math.abs(b.length - length));
    return nearest[0];
  }

  let word = '';
  for (let i = 0; i < length; i++) {
    word += letters[Math.floor(Math.random() * letters.length)];
  }
  return word;
};

const generateSentence = (letters: string[], wordCount: number) => {
  return Array.from({ length: wordCount })
    .map(() => generateWord(letters, Math.floor(Math.random() * 4) + 3))
    .join(' ');
};

const generateSpecialWord = (letters: string[], category: 'bonus' | 'bomb') => {
  const allowedLetters = new Set(letters.map(l => l.toLowerCase()));
  const pool = category === 'bonus' ? BONUS_WORD_BANK : BOMB_WORD_BANK;
  const candidates = pool.filter(word => canBuildWord(word, allowedLetters));

  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  return generateWord(letters, category === 'bonus' ? 5 : 4);
};

const pickRandom = (items: string[]) => items[Math.floor(Math.random() * items.length)];

const smoothStep = (t: number) => t * t * (3 - 2 * t);

// --- SVGs for realistic visuals ---
const CloudSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="-12 -12 124 64" fill="none" preserveAspectRatio="xMidYMid meet">
    <path
      d="M8 34 C8 23 16 16 27 16 C31 7 41 2 51 5 C57 2 64 2 70 5 C80 4 89 10 92 20 C102 21 110 28 110 38 C110 49 101 56 90 56 H27 C16 56 8 47 8 34 Z"
      fill="#ffffff"
      opacity="0.78"
    />
  </svg>
);

const FighterSvg = () => (
  <svg viewBox="0 0 64 24" fill="none" className="w-full h-full drop-shadow-xl overflow-visible">
    <path d="M5 14 C10 14 15 10 25 10 L45 10 C50 10 60 12 60 14 C60 16 50 18 45 18 L25 18 C15 18 10 14 5 14 Z" fill="#475569"/>
    <path d="M35 10 C35 7 40 7 45 10 Z" fill="#bae6fd"/>
    <path d="M10 10 L5 2 L15 10 Z" fill="#1e293b"/>
    <path d="M35 10 L25 2 L40 10 Z" fill="#1e293b"/>
    <path d="M35 18 L25 24 L40 18 Z" fill="#64748b"/>
    <circle cx="60" cy="14" r="2" fill="#ef4444"/>
    <path d="M-10 14 L5 14" stroke="#ffffff" strokeWidth="2" strokeDasharray="2 2" opacity="0.6"/>
  </svg>
);

const BomberSvg = () => (
  <svg viewBox="0 0 100 40" fill="none" className="w-full h-full drop-shadow-2xl overflow-visible">
    <path d="M10 20 C15 15 30 12 50 12 L75 12 C85 12 95 18 95 20 C95 23 85 28 75 28 L50 28 C30 28 15 25 10 20 Z" fill="#1e293b"/>
    <path d="M70 12 C70 8 80 8 85 12 Z" fill="#0ea5e9"/>
    <path d="M20 12 L10 2 L25 12 Z" fill="#0f172a"/>
    <path d="M50 12 L35 0 L60 12 Z" fill="#0f172a"/>
    <path d="M50 28 L35 40 L60 28 Z" fill="#334155"/>
    <circle cx="55" cy="8" r="3" fill="#f59e0b"/>
    <circle cx="55" cy="32" r="3" fill="#f59e0b"/>
    <ellipse cx="95" cy="20" rx="3" ry="5" fill="#ef4444"/>
    <path d="M-20 20 L10 20" stroke="#ffffff" strokeWidth="3" strokeDasharray="3 3" opacity="0.4"/>
  </svg>
);

const BirdSvg = () => (
  <svg viewBox="0 0 64 24" fill="none" className="w-full h-full">
    <path d="M4 16 C12 8 20 8 28 16" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M36 16 C44 8 52 8 60 16" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="32" cy="16" r="1.3" fill="#0f172a" />
  </svg>
);

const CannonBaseSvg = () => (
  <svg width="140" height="120" viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="baseMetal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6b7280" />
        <stop offset="45%" stopColor="#374151" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
      <linearGradient id="basePlate" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
      <radialGradient id="hubMetal" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#f1f5f9" />
        <stop offset="45%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#475569" />
      </radialGradient>
      <radialGradient id="hubCore" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </radialGradient>
      <filter id="baseShadow" x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="2" stdDeviation="1.3" floodColor="#000000" floodOpacity="0.45" />
      </filter>
    </defs>

    <g filter="url(#baseShadow)">
      <path d="M8 90 H92 L82 60 H18 Z" fill="url(#baseMetal)" />
      <path d="M16 64 H84 L80 54 H20 Z" fill="url(#basePlate)" opacity="0.95" />
      <path d="M24 52 H76 L72 45 H28 Z" fill="#1f2937" />
      <path d="M12 90 H88" stroke="#0b1220" strokeWidth="2" />
      <path d="M18 82 H82" stroke="#111827" strokeWidth="2" opacity="0.8" />
      <path d="M22 74 H78" stroke="#111827" strokeWidth="1.8" opacity="0.75" />
      <path d="M26 66 H74" stroke="#111827" strokeWidth="1.6" opacity="0.7" />
    </g>

    <circle cx="50" cy="50" r="17" fill="#0f172a" />
    <circle cx="50" cy="50" r="14" fill="url(#hubMetal)" />
    <circle cx="50" cy="50" r="8.8" fill="url(#hubCore)" />
    <circle cx="47" cy="46.5" r="2.2" fill="#e2e8f0" opacity="0.9" />

    <circle cx="40" cy="50" r="1.6" fill="#94a3b8" />
    <circle cx="60" cy="50" r="1.6" fill="#94a3b8" />
    <circle cx="50" cy="40" r="1.6" fill="#94a3b8" />
    <circle cx="50" cy="60" r="1.6" fill="#94a3b8" />
  </svg>
);

const CannonTurretSvg = ({ glowBoost = false }: { glowBoost?: boolean }) => (
  <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
    <defs>
      <linearGradient id="barrelMetal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9ca3af" />
        <stop offset="45%" stopColor="#4b5563" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
      <linearGradient id="barrelCap" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#e5e7eb" />
        <stop offset="100%" stopColor="#6b7280" />
      </linearGradient>
      <radialGradient id="turretBody" cx="45%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#374151" />
        <stop offset="100%" stopColor="#030712" />
      </radialGradient>
      <radialGradient id="turretCore" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#64748b" />
      </radialGradient>
    </defs>

    <rect x="29.5" y="7" width="11" height="35" rx="2.8" fill="url(#barrelMetal)" />
    <rect x="31" y="10" width="8" height="24" rx="1.8" fill="#111827" opacity="0.7" />
    <rect x="29" y="5" width="12" height="6.5" rx="2" fill="url(#barrelCap)" />

    <rect x="20" y="10" width="10" height="9" rx="1.8" fill="#b91c1c" />
    <rect x="40" y="10" width="10" height="9" rx="1.8" fill="#b91c1c" />
    <rect x="22" y="12" width="6" height="2" rx="1" fill="#f87171" opacity="0.9" />
    <rect x="42" y="12" width="6" height="2" rx="1" fill="#f87171" opacity="0.9" />

    <circle cx="35" cy="45" r="15" fill="#0b1220" />
    <circle cx="35" cy="45" r="13" fill="url(#turretBody)" />
    <circle cx="35" cy="45" r="7.4" fill="url(#turretCore)" />
    <circle cx="32.5" cy="42.2" r="1.8" fill="#f8fafc" opacity="0.85" />

    <circle cx="35" cy="45" r="11" stroke="#1f2937" strokeWidth="1.5" opacity="0.8" />
    <circle cx="35" cy="45" r="9.3" stroke="#94a3b8" strokeWidth="0.8" opacity="0.55" />

    <circle cx="35" cy="7" r="6.5" fill="#f59e0b" opacity={glowBoost ? 0.42 : 0.16} />
    <circle cx="35" cy="7" r="3.6" fill="#fde68a" opacity={glowBoost ? 0.72 : 0.32} />
  </svg>
);

type CloudLayerProps = {
  top: string;
  height: string;
  sprite: string;
  speed: number;
};

const CloudLayer = ({ top, height, sprite, speed }: CloudLayerProps) => {
  const offsetX = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    const next = offsetX.get() - (speed * delta) / 1000;
    offsetX.set(next);
  });

  return (
    <motion.div
      className="absolute inset-x-0 pointer-events-none z-2"
      style={{
        top,
        height,
        backgroundImage: `url(${sprite})`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 100%',
        backgroundPositionY: 'bottom',
        backgroundPositionX: offsetX,
      }}
    />
  );
};
// ------------------------------------

export default function FighterPlaneEngine({
  drill,
  onComplete,
  onBack,
  backLabel = "Back to lesson",
}: {
  drill: Drill;
  onComplete: (stats: DrillCompleteStats) => void;
  onBack?: () => void;
  backLabel?: string;
}) {
  const { play } = useSoundManager();

  // Core Stats
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(5);
  const [planesDestroyed, setPlanesDestroyed] = useState(0);

  // Entities
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [missiles, setMissiles] = useState<Missile[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);

  // Targets & Interaction Tracking
  const [targetId, setTargetId] = useState<string | null>(null);
  const targetIdRef = useRef<string | null>(null);

  const [correctChars, setCorrectChars] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const wrongKeyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [muzzleFlash, setMuzzleFlash] = useState(false);
  const [isRecoiling, setIsRecoiling] = useState(false);
  const muzzleFlashTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recoilTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Refs for tracking bounds dynamically
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const planeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const planesStateRef = useRef(planes);
  useEffect(() => {
    planesStateRef.current = planes;
  }, [planes]);
  const isGameOver = useRef(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [cannonAngle, setCannonAngle] = useState(0);
  const dayNightPhase = useMotionValue(0);
  const duskOpacity = useTransform(dayNightPhase, [0, 0.25, 0.5, 0.75, 1], [0, 0.06, 0.24, 0.12, 0]);
  const nightOpacity = useTransform(dayNightPhase, [0, 0.35, 0.6, 0.85, 1], [0, 0, 0.46, 0.16, 0]);
  const sunOpacity = useTransform(dayNightPhase, [0, 0.42, 0.52, 1], [0.95, 0.95, 0, 0]);
  const moonOpacity = useTransform(dayNightPhase, [0, 0.45, 0.6, 1], [0, 0, 0.82, 0]);
  const celestialX = useTransform(dayNightPhase, [0, 1], ['-8%', '108%']);
  const celestialY = useTransform(dayNightPhase, [0, 0.5, 1], ['20%', '4%', '20%']);
  const cloudConfigs = useMemo(
    () => [
      { id: 'cloud-1', sprite: '/game-assets/background/Cloud.svg', top: '-10%', height: '84%', speed: 58 },
      { id: 'cloud-2', sprite: '/game-assets/background/Cloud.svg', top: '-4%', height: '78%', speed: 40 }
    ],
    []
  );
  const birdConfigs = useMemo(
    () => [
      { id: 'bird-1', top: '16%', scale: 0.9, duration: 20, delay: 0, opacity: 0.38, flap: 0.24 },
      { id: 'bird-2', top: '22%', scale: 0.72, duration: 24, delay: 6, opacity: 0.3, flap: 0.2 },
      { id: 'bird-3', top: '13%', scale: 0.82, duration: 22, delay: 11, opacity: 0.34, flap: 0.22 },
      { id: 'bird-4', top: '19%', scale: 0.66, duration: 26, delay: 16, opacity: 0.25, flap: 0.18 },
    ],
    []
  );
  // Unlock pool based on drill
  const unlockedLetters = useMemo(() => {
    let chars = Array.from(new Set(drill.content.replace(/[^a-zA-Z]/g, '').toLowerCase().split('')));
    if (chars.length === 0) chars = ['a','s','d','f','j','k','l'];
    return chars;
  }, [drill.content]);

  // Keep ref sync
  useEffect(() => {
    targetIdRef.current = targetId;
  }, [targetId]);

  useAnimationFrame((_, delta) => {
    const next = (dayNightPhase.get() + delta / 120000) % 1;
    dayNightPhase.set(next);
  });

  // Handle Level Up
  useEffect(() => {
    const nextLevel = Math.floor(planesDestroyed / 10) + 1;
    if (nextLevel > level) {
      setLevel(nextLevel);
      if (hasStarted) play('level_up');
    }
  }, [planesDestroyed, level, play, hasStarted]);

  const buildCompleteStats = useCallback((): DrillCompleteStats => {
    const elapsed = startTime ? (Date.now() - startTime) / 1000 : 1;
    const total = correctChars + totalErrors || 1;
    const accuracy = Math.round((correctChars / total) * 100);
    const wpm = Math.round(correctChars / 5 / (elapsed / 60));

    return {
      wpm: wpm || 0,
      netWpm: wpm || 0,
      accuracy: accuracy || 0,
      errors: totalErrors,
      elapsed: elapsed || 1,
      maxCombo: score,
      correctChars,
      totalChars: total,
      errorKeyCounts: {},
    };
  }, [startTime, correctChars, totalErrors, score]);

  const handleRetry = useCallback(() => {
    if (wrongKeyTimerRef.current) {
      clearTimeout(wrongKeyTimerRef.current);
      wrongKeyTimerRef.current = null;
    }
    if (muzzleFlashTimerRef.current) {
      clearTimeout(muzzleFlashTimerRef.current);
      muzzleFlashTimerRef.current = null;
    }
    if (recoilTimerRef.current) {
      clearTimeout(recoilTimerRef.current);
      recoilTimerRef.current = null;
    }

    isGameOver.current = false;
    setScore(0);
    setLevel(1);
    setLives(5);
    setPlanesDestroyed(0);
    setPlanes([]);
    planesStateRef.current = [];
    setMissiles([]);
    setExplosions([]);
    setTargetId(null);
    setCorrectChars(0);
    setTotalErrors(0);
    setWrongKey(null);
    setMuzzleFlash(false);
    setIsRecoiling(false);
    setCannonAngle(0);
    setStartTime(Date.now());

    const starterPlane: Plane = {
      id: crypto.randomUUID(),
      word: generateWord(unlockedLetters, 2),
      typed: '',
      duration: 17,
      y: Math.random() * 45 + 5,
      isBoss: false,
      kind: 'normal',
      points: 50,
      sprite: pickRandom(NORMAL_PLANE_SPRITES),
    };

    const next = [starterPlane];
    planesStateRef.current = next;
    setPlanes(next);
    setTargetId(starterPlane.id);
  }, [unlockedLetters]);

  const triggerCannonFx = useCallback(() => {
    setMuzzleFlash(true);
    setIsRecoiling(true);

    if (muzzleFlashTimerRef.current) clearTimeout(muzzleFlashTimerRef.current);
    if (recoilTimerRef.current) clearTimeout(recoilTimerRef.current);

    muzzleFlashTimerRef.current = setTimeout(() => {
      setMuzzleFlash(false);
      muzzleFlashTimerRef.current = null;
    }, 52);

    recoilTimerRef.current = setTimeout(() => {
      setIsRecoiling(false);
      recoilTimerRef.current = null;
    }, 78);
  }, []);

  const getMuzzleStart = useCallback(() => {
    if (!gameContainerRef.current) {
      return { x: 0, y: 0 };
    }

    const cannonX = gameContainerRef.current.clientWidth / 2;
    const cannonY = gameContainerRef.current.clientHeight - CANNON_BASE_Y;
    const angleRad = (cannonAngle * Math.PI) / 180;

    return {
      x: cannonX + Math.sin(angleRad) * CANNON_BARREL_LENGTH + CANNON_MUZZLE_X_OFFSET,
      y: cannonY - Math.cos(angleRad) * CANNON_BARREL_LENGTH + CANNON_MUZZLE_Y_OFFSET,
    };
  }, [cannonAngle]);

  const fireCannonShot = useCallback((sound: 'keystroke' | 'keystroke_error' | 'keystroke_space') => {
    play(sound);
    triggerCannonFx();
  }, [play, triggerCannonFx]);

  const handleFinish = useCallback(() => {
    play('drill_complete');
    onComplete(buildCompleteStats());
  }, [play, onComplete, buildCompleteStats]);

  // Game End Logic
  useEffect(() => {
    if (lives <= 0 && !isGameOver.current) {
      isGameOver.current = true;
      play('keystroke_error');
    }
  }, [lives, play]);

  // Spawner Loop
  const spawnPlane = useCallback(() => {
    if (isGameOver.current || !hasStarted) return;

    const isBossLevel = level % 5 === 0;
    const currentPlanes = planesStateRef.current;

    // Don't flood screens with bosses
    const bossCount = currentPlanes.filter(p => p.isBoss).length;
    if (isBossLevel && bossCount > 0) return;

    if (isBossLevel) {
      const id = crypto.randomUUID();
      const duration = 30 - Math.min(10, level); // massive health, slow
      const y = Math.random() * 20 + 5; // top tier
      const word = generateSentence(unlockedLetters, 3 + Math.floor(level / 5));
      const bossPlane: Plane = { id, word, typed: '', duration, y, isBoss: true, kind: 'boss', points: 260, sprite: BOSS_PLANE_SPRITE };
      const next: Plane[] = [...currentPlanes, bossPlane];
      planesStateRef.current = next;
      setPlanes(next);
      return;
    }

    // Cap at active planes based on level
    const maxPlanes = 4 + Math.floor(level / 2);
    if (currentPlanes.length >= maxPlanes) return;

    const id = crypto.randomUUID();
    const spawnRoll = Math.random();
    const isBombPlane = level >= 3 && spawnRoll < 0.09;
    const isBonusPlane = level >= 2 && !isBombPlane && spawnRoll < 0.22;

    const length = 2 + Math.floor(level / 2);
    const word = isBombPlane
      ? generateSpecialWord(unlockedLetters, 'bomb')
      : isBonusPlane
        ? generateSpecialWord(unlockedLetters, 'bonus')
        : generateWord(unlockedLetters, length);

    const baseDuration = Math.max(8, 18 - level);
    const speedJitter = 0.72 + Math.random() * 0.5;
    const typeMultiplier = isBonusPlane ? 0.7 : isBombPlane ? 0.95 : 1;
    const duration = Math.max(5.5, baseDuration * speedJitter * typeMultiplier);
    const kind: Plane['kind'] = isBombPlane ? 'bomb' : isBonusPlane ? 'bonus' : 'normal';
    const points = isBonusPlane ? 150 : isBombPlane ? 130 : 50;
    const sprite = isBombPlane
      ? pickRandom(BOMB_PLANE_SPRITES)
      : isBonusPlane
        ? pickRandom(BONUS_PLANE_SPRITES)
        : pickRandom(NORMAL_PLANE_SPRITES);

    const y = Math.random() * 45 + 5; // 5% to 50% max so it doesn't clip cannon
    const normalPlane: Plane = { id, word, typed: '', duration, y, isBoss: false, kind, points, sprite };
    const next: Plane[] = [...currentPlanes, normalPlane];
    planesStateRef.current = next;
    setPlanes(next);
  }, [level, unlockedLetters, hasStarted]);

  useEffect(() => {
    if (lives <= 0 || !hasStarted) return;
    const isBossLevel = level % 5 === 0;
    const rate = isBossLevel ? 4200 : Math.max(650, 1800 - level * 110);

    const tId = setInterval(spawnPlane, rate);
    return () => clearInterval(tId);
  }, [level, spawnPlane, lives, hasStarted]);

  // Cannon tracks currently selected target plane
  useEffect(() => {
    if (!hasStarted) return;

    let rafId = 0;
    const updateAim = () => {
      const container = gameContainerRef.current;
      const selectedId = targetIdRef.current;
      const targetEl = selectedId ? planeRefs.current[selectedId] : null;

      if (!container || !targetEl) {
        setCannonAngle(prev => (Math.abs(prev) < 0.5 ? 0 : prev * 0.9));
      } else {
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        const cannonX = containerRect.width / 2;
        const cannonY = containerRect.height - CANNON_BASE_Y;

        const targetX = targetRect.left - containerRect.left + targetRect.width / 2;
        const targetY = targetRect.top - containerRect.top + targetRect.height / 2;

        const rawAngle = Math.atan2(targetY - cannonY, targetX - cannonX) * (180 / Math.PI) + 90;
        const clampedAngle = Math.max(-70, Math.min(70, rawAngle));

        setCannonAngle(prev => (Math.abs(prev - clampedAngle) < 0.1 ? prev : clampedAngle));
      }

      rafId = requestAnimationFrame(updateAim);
    };

    rafId = requestAnimationFrame(updateAim);
    return () => cancelAnimationFrame(rafId);
  }, [hasStarted]);

  // Auto-targeting fallback
  useEffect(() => {
    if (planes.length > 0) {
      if (!targetId || !planes.some(p => p.id === targetId)) {
        setTargetId(planes[0].id);
      }
    } else {
      setTargetId(null);
    }
  }, [planes, targetId]);

  // Handle plane visually escaping -> causes damage
  const handlePlaneEscape = useCallback((id: string) => {
    if (isGameOver.current) return;
    const currentPlanes = planesStateRef.current;
    const plane = currentPlanes.find(p => p.id === id);
    if (!plane) return;

    setLives(l => l - 1);
    play('keystroke_error');

    const next = currentPlanes.filter(p => p.id !== id);
    planesStateRef.current = next;
    setPlanes(next);
  }, [play]);

  // Typing Interceptor
  const handleKeystroke = useCallback((key: string) => {
    const tId = targetIdRef.current;
    const currentPlanes = planesStateRef.current;
    const targetPlane = currentPlanes.find(p => p.id === tId);

    if (!targetPlane) return;

    const expectedChar = targetPlane.word[targetPlane.typed.length];

    const muzzleStart = getMuzzleStart();
    const startX = muzzleStart.x;
    const startY = muzzleStart.y;

    // Calculate Target Impact
    let targetX = startX;
    let targetY = Math.max(40, startY - 220);
    const pRef = planeRefs.current[targetPlane.id];
    if (pRef && gameContainerRef.current) {
      const rect = pRef.getBoundingClientRect();
      const cRect = gameContainerRef.current.getBoundingClientRect();
      targetX = rect.left - cRect.left + (rect.width / 2);
      targetY = rect.top - cRect.top + (rect.height / 2);
    }

    const mId = crypto.randomUUID();

    if (key === expectedChar) {
      // CORRECT
      fireCannonShot(key === ' ' ? 'keystroke_space' : 'keystroke');
      setCorrectChars(c => c + 1);

      setMissiles(m => [...m, { id: mId, startX, startY, targetX, targetY, isDud: false }]);
      setScore(s => s + 10);
      setWrongKey(null);
      if (wrongKeyTimerRef.current) clearTimeout(wrongKeyTimerRef.current);

      const newTyped = targetPlane.typed + key;

      if (newTyped === targetPlane.word) {
        setScore(s => s + targetPlane.points);
        setTimeout(() => {
          play('word_complete');
          play('explosion');
          setExplosions(ex => [...ex, { id: crypto.randomUUID(), x: targetX, y: targetY, type: 'destroy' }]);
          setPlanesDestroyed(pd => pd + 1);
          const livePlanes = planesStateRef.current;

          if (targetPlane.kind === 'bomb') {
            const otherPlanes = livePlanes.filter(p => p.id !== targetPlane.id);
            const crashExplosions = otherPlanes.map((plane) => {
              const el = planeRefs.current[plane.id];
              if (!el || !gameContainerRef.current) {
                return { id: crypto.randomUUID(), x: targetX, y: targetY, type: 'destroy' as const };
              }

              const rect = el.getBoundingClientRect();
              const cRect = gameContainerRef.current.getBoundingClientRect();
              return {
                id: crypto.randomUUID(),
                x: rect.left - cRect.left + rect.width / 2,
                y: rect.top - cRect.top + rect.height / 2,
                type: 'destroy' as const,
              };
            });

            setExplosions(ex => [...ex, ...crashExplosions]);
            if (otherPlanes.length > 0) {
              setScore(s => s + otherPlanes.length * 40);
              setPlanesDestroyed(pd => pd + otherPlanes.length);
            }

            planesStateRef.current = [];
            setPlanes([]);
            setTargetId(null);
          } else {
            const next = livePlanes.filter(p => p.id !== targetPlane.id);
            planesStateRef.current = next;
            setPlanes(next);
          }
        }, 150);
      }

      const next = currentPlanes.map(p => p.id === targetPlane.id ? { ...p, typed: newTyped } : p);
      planesStateRef.current = next;
      setPlanes(next);
    } else {
      // INCORRECT
      fireCannonShot('keystroke_error');
      setTotalErrors(e => e + 1);
      setScore(s => Math.max(0, s - 5));

      setWrongKey(key);
      if (wrongKeyTimerRef.current) clearTimeout(wrongKeyTimerRef.current);
      wrongKeyTimerRef.current = setTimeout(() => setWrongKey(null), 800);

      setMissiles(m => [...m, { id: mId, startX, startY, targetX, targetY, isDud: true }]);
    }
  }, [fireCannonShot, getMuzzleStart, play]);

  useEffect(() => {
    return () => {
      if (wrongKeyTimerRef.current) clearTimeout(wrongKeyTimerRef.current);
      if (muzzleFlashTimerRef.current) clearTimeout(muzzleFlashTimerRef.current);
      if (recoilTimerRef.current) clearTimeout(recoilTimerRef.current);
    };
  }, []);

  // Global Keyboard Events
  useEffect(() => {
    if (!hasStarted) return;

    const handler = (e: KeyboardEvent) => {
      if (isGameOver.current || e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
          const prev = planesStateRef.current;
          const idx = prev.findIndex(p => p.id === targetIdRef.current);
          const nextIdx = idx <= 0 ? prev.length - 1 : idx - 1;
          setTargetId(prev[nextIdx]?.id || null);
          return;
        }

        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const prev = planesStateRef.current;
          const idx = prev.findIndex(p => p.id === targetIdRef.current);
          const nextIdx = idx >= prev.length - 1 || idx === -1 ? 0 : idx + 1;
          setTargetId(prev[nextIdx]?.id || null);
          return;
        }

      const key = e.key === ' ' ? ' ' : e.key.length === 1 ? e.key.toLowerCase() : null;
      if (key !== null) {
        e.preventDefault();
        if (!startTime) setStartTime(Date.now());
        handleKeystroke(key);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKeystroke, startTime, hasStarted]);

  // Resolve Missile Animations
  const handleMissileHit = useCallback((missile: Missile) => {
    setMissiles(prev => prev.filter(m => m.id !== missile.id));
    setExplosions(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        x: missile.targetX,
        y: missile.isDud ? (missile.startY + missile.targetY) / 2 : missile.targetY,
        type: missile.isDud ? 'dud' : 'hit'
      }
    ]);
  }, []);

  const handleExplosionComplete = useCallback((id: string) => {
    setExplosions(prev => prev.filter(e => e.id !== id));
  }, []);

  const targetPlaneObj = planes.find(p => p.id === targetId);

  return (
    <div className="flex flex-col flex-1 min-h-[100vh] w-full bg-slate-950 overflow-hidden relative focus:outline-none select-none text-slate-200">
      
      {!hasStarted && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-lg text-center"
            >
              <Crosshair className="w-16 h-16 text-blue-500 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
              <h1 className="text-4xl font-black text-white mb-4">TYPING COMMANDER</h1>
              <p className="text-slate-400 mb-6">
                Defend the base! Type the words attached to enemy planes to shoot them down.<br/><br/>
                Use <strong className="text-blue-400">Left Arrow</strong> and <strong className="text-blue-400">Right Arrow</strong> keys to switch targets.
              </p>
              <button
                onClick={() => { setHasStarted(true); spawnPlane(); setStartTime(Date.now()); play('streak_milestone'); }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-12 rounded-xl flex items-center gap-3 transition-colors shadow-lg active:scale-95"
              >
                <PlayCircle className="w-6 h-6" /> START BATTLE
              </button>
            </motion.div>
        </div>
      )}

      {/* Game Area Wrapper (Restricted Height - Filling Screen) */}
      <div className="w-full flex-1 flex flex-col relative mt-0 mb-0">
        {/* Header HUD */}
        <div className="flex justify-between items-center px-6 py-4 z-40 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-t-2xl shadow-xl">
          <div className="flex items-center gap-6">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/70 text-slate-100 hover:text-white hover:border-slate-600 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> {backLabel}
              </button>
            )}

            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1 flex items-center gap-1"><Trophy className="w-3 h-3" /> Score</span>
              <span className="text-2xl font-black text-white leading-none">{score}</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">Level</span>
              <span className="text-2xl font-black text-white leading-none">{level}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Heart key={i} className={`w-6 h-6 transition-all ${i < lives ? 'text-red-500 fill-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'text-slate-800 fill-slate-800'}`} />
            ))}
          </div>
        </div>

        {/* The Action Canvas - Scenic Landscape */}
        <div ref={gameContainerRef} className="flex-1 relative bg-[#87CEEB] overflow-hidden border-x border-slate-300 rounded-b-2xl shadow-[inset_0_0_50px_rgba(255,255,255,0.2)]">
          <motion.div className="absolute inset-x-0 top-0 bottom-[12vh] pointer-events-none z-[1] bg-gradient-to-b from-orange-300/60 via-amber-200/35 to-transparent" style={{ opacity: duskOpacity }} />
          <motion.div className="absolute inset-x-0 top-0 bottom-[12vh] pointer-events-none z-[1] bg-gradient-to-b from-slate-900/65 via-indigo-900/45 to-transparent" style={{ opacity: nightOpacity }} />

          <motion.div className="absolute z-[1] pointer-events-none" style={{ left: celestialX, top: celestialY, opacity: sunOpacity }}>
            <div className="w-16 h-16 rounded-full bg-yellow-200/90 shadow-[0_0_45px_rgba(253,224,71,0.75)]" />
          </motion.div>
          <motion.div className="absolute z-[1] pointer-events-none" style={{ left: celestialX, top: celestialY, opacity: moonOpacity }}>
            <div className="relative w-12 h-12 rounded-full bg-slate-100/85 shadow-[0_0_35px_rgba(226,232,240,0.55)]">
              <div className="absolute -right-1 top-1 w-10 h-10 rounded-full bg-slate-800/70" />
            </div>
          </motion.div>

          {cloudConfigs.map(cloud => (
            <CloudLayer
              key={cloud.id}
              sprite={cloud.sprite}
              top={cloud.top}
              height={cloud.height}
              speed={cloud.speed}
            />
          ))}

          {birdConfigs.map((bird) => (
            <motion.div
              key={bird.id}
              className="absolute right-[-12%] z-[6] pointer-events-none"
              style={{ top: bird.top, opacity: bird.opacity }}
              initial={{ x: '0vw' }}
              animate={{ x: '-124vw' }}
              transition={{ duration: bird.duration, ease: 'linear', repeat: Infinity, delay: bird.delay }}
            >
              <motion.div
                animate={{ scaleY: [1, 1 - bird.flap, 1 + bird.flap * 0.45, 1], y: [0, -1.2, 0.8, 0], rotate: [0, -2, 1, 0] }}
                transition={{ duration: 0.26, ease: 'easeInOut', repeat: Infinity }}
                style={{ width: `${40 * bird.scale}px`, height: `${16 * bird.scale}px`, transformOrigin: '50% 60%' }}
              >
                <BirdSvg />
              </motion.div>
            </motion.div>
          ))}

          <div className="absolute inset-x-0 bottom-[12vh] h-[18vh] z-[5] pointer-events-none overflow-hidden">
            <img
              src="/game-assets/background/mountain_front.png"
              alt="front mountain"
              className="absolute bottom-0 left-1/2 h-full w-auto min-w-[108%] max-w-none -translate-x-1/2 object-contain object-bottom"
              draggable={false}
            />
          </div>
          <div className="absolute inset-x-0 bottom-[12vh] h-[22vh] z-[4] pointer-events-none overflow-hidden">
            <img
              src="/game-assets/background/mountain_mid.png"
              alt="mid mountain"
              className="absolute bottom-0 left-1/2 h-full w-auto min-w-[112%] max-w-none -translate-x-1/2 object-contain object-bottom"
              draggable={false}
            />
          </div>
          <div className="absolute inset-x-0 bottom-[12vh] h-[26vh] z-[3] pointer-events-none overflow-hidden">
            <img
              src="/game-assets/background/mountain_far.png"
              alt="far mountain"
              className="absolute bottom-0 left-1/2 h-full w-auto min-w-[116%] max-w-none -translate-x-1/2 object-contain object-bottom"
              draggable={false}
            />
          </div>

          {/* Ground */}
          <div className="absolute bottom-0 left-0 w-full h-[12vh] bg-gradient-to-t from-[#2d1a0c] to-[#4c2b14] border-t-[8px] border-[#3f6212] z-0">
             <div className="absolute top-0 left-[10%] w-10 h-3 bg-[#3f6212] rounded-t-full -mt-2" />
             <div className="absolute top-0 left-[45%] w-16 h-4 bg-[#3f6212] rounded-t-full -mt-3" />
             <div className="absolute top-0 left-[80%] w-8 h-2 bg-[#3f6212] rounded-t-full -mt-1" />
          </div>

          {/* Planes Layer */}
          <AnimatePresence>
            {planes.map(p => {
              const isTarget = targetId === p.id;
              return (
                <motion.div
                  key={p.id}
                  ref={(el) => { planeRefs.current[p.id] = el; }}
                  initial={{ left: "-20%" }}
                  animate={{ left: "120%" }}
                  transition={{ duration: p.duration, ease: "linear" }}
                  onAnimationComplete={() => handlePlaneEscape(p.id)}
                  className={`absolute flex flex-col items-center justify-center z-10 ${p.isBoss ? 'scale-125' : 'scale-100'} transition-transform`}
                  style={{ top: `${p.y}%`, y: '-50%' }}
                >
                  <div className={`relative ${isTarget ? 'drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]' : ''}`}>
                    <div className={`${p.isBoss ? 'w-44 h-22' : 'w-28 h-14'} relative flex items-center justify-center filter drop-shadow-xl`}>
                      <img src={p.sprite} alt="Enemy plane" className="w-full h-full object-contain" draggable={false} />
                      {p.isBoss && isTarget && <ShieldAlert className="absolute top-[-24px] text-red-500 w-6 h-6 animate-bounce" />}
                    </div>

                    {p.kind === 'bonus' && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-yellow-400/90 text-slate-900 flex items-center gap-1">
                        <img src={BONUS_COIN_SPRITE} alt="coin" className="w-3.5 h-3.5 object-contain" draggable={false} />
                        BONUS
                      </span>
                    )}
                    {p.kind === 'bomb' && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-orange-500/90 text-white">BOMB</span>
                    )}

                    {isTarget && (
                      <motion.div
                        initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-[-15px] border-2 border-slate-100 rounded-full animate-spin-slow opacity-80"
                        style={{ borderStyle: 'dashed' }}
                      />
                    )}
                  </div>

                  <div className="mt-2 px-3 py-1 bg-slate-900/90 backdrop-blur rounded-lg border border-slate-700/50 shadow-lg text-lg font-mono tracking-wider whitespace-pre flex items-center justify-center z-20">
                    <span className="text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]">{p.typed.replace(/ /g, '\u00A0')}</span>
                    <span className="text-white drop-shadow-md relative bg-blue-600/50 px-0.5 rounded outline outline-1 outline-blue-400">
                      {p.word[p.typed.length] === ' ' ? '\u00A0' : p.word[p.typed.length]}
                    </span>
                    <span className="text-slate-400">{p.word.slice(p.typed.length + 1).replace(/ /g, '\u00A0')}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Cannon Object */}
          <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            <div className="relative w-[140px] h-[120px]">
              <div className="absolute inset-0">
                <CannonBaseSvg />
              </div>
              <motion.div
                className="absolute left-1/2 top-[2px] -translate-x-1/2 origin-[50%_86%]"
                animate={{ rotate: cannonAngle, y: isRecoiling ? 2.5 : 0 }}
                transition={{ type: 'spring', stiffness: 190, damping: 22, mass: 0.58 }}
              >
                <div className="relative">
                  <CannonTurretSvg glowBoost={muzzleFlash} />
                  <AnimatePresence>
                    {muzzleFlash && (
                      <motion.div
                        key="muzzle-flash"
                        initial={{ opacity: 0, scale: 0.65 }}
                        animate={{ opacity: 0.72, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 0.08, ease: 'easeOut' }}
                        className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-5 h-5 rounded-full bg-yellow-200/70 blur-[1.5px] mix-blend-screen pointer-events-none"
                      >
                        <div className="absolute inset-1 rounded-full bg-orange-300/70 blur-[0.5px]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Missiles Layer */}
          {missiles.map(m => {
            const angle = Math.atan2(m.targetY - m.startY, m.targetX - m.startX) * (180 / Math.PI) + 90;
            return (
            <motion.div
              key={m.id}
              initial={{ x: m.startX, y: m.startY, scale: 0.8 }}
              animate={{ x: m.targetX, y: m.isDud ? (m.startY + m.targetY) / 2 : m.targetY, scale: 1 }}
              transition={{ duration: m.isDud ? 0.15 : 0.08, ease: "linear" }}
              onAnimationComplete={() => handleMissileHit(m)}
              className="absolute top-0 left-0 z-[18] origin-center -ml-1 -mt-3 drop-shadow-md"
              style={{ rotate: `${angle}deg` }}
            >
              <div className="w-2 h-10 bg-gradient-to-t from-orange-500 rounded-full to-yellow-200 shadow-[0_0_15px_yellow] relative">
                 <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-16 bg-gradient-to-b from-orange-500 to-transparent blur-sm" />
              </div>
            </motion.div>
          )})}

          {/* Explosions Layer */}
          {explosions.map(ex => (
            <motion.div
              key={ex.id}
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: ex.type === 'destroy' ? 4.8 : ex.type === 'dud' ? 1.5 : 2.2, opacity: 0 }}
              transition={{ duration: ex.type === 'destroy' ? 0.7 : 0.32, ease: 'easeOut' }}
              onAnimationComplete={() => handleExplosionComplete(ex.id)}
              className="absolute z-30 flex items-center justify-center origin-center"
              style={{ x: ex.x, y: ex.y, marginLeft: '-32px', marginTop: '-32px' }}
            >
              <div className={`w-16 h-16 rounded-full ${ex.type === 'dud' ? 'bg-slate-500' : 'bg-orange-500'} blur-md mix-blend-screen opacity-90`} />
              <div className={`absolute w-10 h-10 rounded-full ${ex.type === 'dud' ? 'bg-slate-300' : 'bg-yellow-300'} blur-sm mix-blend-screen`} />
              {ex.type === 'destroy' && (
                <>
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0.9 }}
                    animate={{ scale: 2.6, opacity: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="absolute w-18 h-18 rounded-full border-2 border-yellow-200/80"
                  />
                  {[0, 45, 90, 135].map((deg) => (
                    <motion.div
                      key={`${ex.id}-spark-${deg}`}
                      initial={{ scaleY: 0.4, opacity: 0.9 }}
                      animate={{ scaleY: 1.7, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="absolute w-1 h-11 bg-gradient-to-b from-yellow-100 via-orange-300 to-transparent rounded-full"
                      style={{ rotate: `${deg}deg` }}
                    />
                  ))}
                </>
              )}
              {ex.type === 'destroy' && (
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 2.2 }} className="absolute w-12 h-12 bg-white rounded-full blur-sm mix-blend-overlay" />
              )}
            </motion.div>
          ))}

          {/* Targeted Word Display Panel (HUD inside canvas overlaying the action) */}
          <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-min whitespace-nowrap bg-black/70 backdrop-blur-md px-8 py-3 rounded-full border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] pointer-events-none z-30 flex items-center gap-4">
             <Crosshair className="w-6 h-6 text-blue-400 animate-pulse" />
             {targetPlaneObj ? (
               <div className="font-mono text-3xl font-black tracking-widest text-slate-300 flex">
                 <span className="text-green-400">{targetPlaneObj.typed.replace(/ /g, '\u00A0')}</span>
                 <span className="text-white bg-blue-600 px-1 rounded shadow-inner">{targetPlaneObj.word[targetPlaneObj.typed.length] === ' ' ? '\u00A0' : targetPlaneObj.word[targetPlaneObj.typed.length]}</span>
                 <span>{targetPlaneObj.word.slice(targetPlaneObj.typed.length + 1).replace(/ /g, '\u00A0')}</span>
               </div>
             ) : (
               <span className="font-mono text-2xl font-bold tracking-widest text-slate-500 border border-transparent">SCANNING</span>
             )}
          </div>

          {/* Game Over Modal Hook */}
          <AnimatePresence>
            {lives <= 0 && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 bg-red-950/80 backdrop-blur flex flex-col items-center justify-center">
                 <AlertTriangle className="w-20 h-20 text-red-500 mb-6 drop-shadow-lg" />
                 <h2 className="text-5xl font-black text-white mb-2 tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">SYSTEM FAILURE</h2>
                 <p className="text-xl text-red-300 font-mono mb-6 opacity-80">DEFENSES BREACHED</p>
                 <div className="mb-8 text-center">
                   <p className="text-red-200/80 text-sm uppercase tracking-[0.22em] mb-1">Final Score</p>
                   <p className="text-5xl font-black text-white leading-none">{score}</p>
                 </div>
                 <div className="flex items-center gap-4">
                   <button
                     onClick={handleRetry}
                     className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                   >
                     Retry
                   </button>
                   <button
                     onClick={handleFinish}
                     className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                   >
                     Finish
                   </button>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}