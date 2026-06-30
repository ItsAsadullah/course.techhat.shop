"use client";

// =============================================================================
//  DrillSvgHands — Inline SVG hand overlay for the Key Drill
//
//  Coordinate system  (viewBox "0 0 772 240"):
//    This is a STANDALONE hands view placed BELOW the VirtualKeyboard.
//    The hands are shown as if resting on the keyboard with fingers pointing up.
//
//  X positions are calibrated to the real keyboard pixel layout
//  (key width 3rem=48px, gap 4px, left padding 12px):
//    Home row key centers:
//      A=124  S=176  D=228  F=280  |  J=436  K=488  L=540  ;=592
//    Space bar center: x≈354
//
//  Finger colour mapping (matches FINGER_COLOR in keyboardData.ts):
//    pinky=rose  ring=amber  middle=emerald  index=blue  thumb=purple
//
//  Space-bar rule: when activeTarget.finger === "thumb",
//    BOTH thumb groups are highlighted.
// =============================================================================

import type { Finger, Hand, FingerTarget } from "./keyboardData";

// ─── Colour palette ───────────────────────────────────────────────────────────

export const FINGER_SVG_FILL: Record<Finger, string> = {
  pinky:  "#8b5cf6",   // violet-500
  ring:   "#f59e0b",   // amber-500
  middle: "#10b981",   // emerald-500
  index:  "#3b82f6",   // blue-500
  thumb:  "#a855f7",   // purple-500
};

const SKIN    = "#f3c5a0";   // warm skin base
const SKIN_SK = "#be8854";   // skin outline
const NAIL    = "rgba(255,255,255,0.54)";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function active(f: Finger, h: Hand, t: FingerTarget | null): boolean {
  if (!t) return false;
  if (t.finger === "thumb" && f === "thumb") return true;   // both thumbs for space
  return t.finger === f && t.hand === h;
}
function fill(f: Finger, h: Hand, t: FingerTarget | null): string {
  return active(f, h, t) ? FINGER_SVG_FILL[f] : SKIN;
}
function sw(f: Finger, h: Hand, t: FingerTarget | null): number {
  return active(f, h, t) ? 2 : 1.5;
}
function sk(f: Finger, h: Hand, t: FingerTarget | null): string {
  return active(f, h, t) ? "rgba(0,0,0,0.22)" : SKIN_SK;
}

// ─── Single finger ────────────────────────────────────────────────────────────

interface FS {
  cx: number; y: number; w: number; h: number; rx: number;
  finger: Finger; hand: Hand; t: FingerTarget | null;
}
function Finger({ cx, y, w, h, rx, finger, hand, t }: FS) {
  const x = cx - w / 2;
  const nw = Math.round(w * 0.6);
  const nx = cx - nw / 2;
  const isAct = active(finger, hand, t);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx}
        fill={fill(finger, hand, t)} stroke={sk(finger, hand, t)} strokeWidth={sw(finger, hand, t)} />
      {/* Nail highlight */}
      <rect x={nx} y={y + 5} width={nw} height={9} rx={4} fill={NAIL} />
      {/* Mid-knuckle crease */}
      <line x1={x + 4} y1={y + h * 0.52} x2={x + w - 4} y2={y + h * 0.52}
        stroke={isAct ? "rgba(0,0,0,0.12)" : SKIN_SK}
        strokeWidth="1.2" strokeLinecap="round" opacity={0.5} />
    </g>
  );
}

// ─── Thumb ────────────────────────────────────────────────────────────────────

interface TS { px: number; py: number; rx_r: number; ry_r: number; deg: number; hand: Hand; t: FingerTarget | null; }
function Thumb({ px, py, rx_r, ry_r, deg, hand, t }: TS) {
  const isAct = active("thumb", hand, t);
  return (
    <g transform={`rotate(${deg} ${px} ${py})`}>
      <rect x={rx_r} y={ry_r} width={38} height={82} rx={17}
        fill={fill("thumb", hand, t)} stroke={sk("thumb", hand, t)} strokeWidth={sw("thumb", hand, t)} />
      <rect x={rx_r + 6} y={ry_r + 6} width={24} height={9} rx={4} fill={NAIL} />
      <line x1={rx_r + 5} y1={ry_r + 82 * 0.52} x2={rx_r + 33} y2={ry_r + 82 * 0.52}
        stroke={isAct ? "rgba(0,0,0,0.12)" : SKIN_SK}
        strokeWidth="1.2" strokeLinecap="round" opacity={0.5} />
    </g>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface DrillSvgHandsProps {
  activeTarget: FingerTarget | null;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DrillSvgHands({ activeTarget }: DrillSvgHandsProps) {
  const t = activeTarget;

  //  Vertical positions — all main fingers meet palm at y=158 (12 px overlap)
  const py = 146;   // palm top y
  const iy = 18;    // index / ring top y
  const my = 12;    // middle top y   (tallest)
  const ky = 28;    // pinky top y    (shortest)

  return (
    <svg
      viewBox="0 0 772 240"
      width="100%"
      style={{ display: "block", pointerEvents: "none" }}
      aria-hidden="true"
    >

      {/* ━━━━━━━━━━━━━━━━━━━━━━━  LEFT HAND  ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <g>
        {/* Palm — rendered first so fingers sit on top */}
        <rect x={97} y={py} width={214} height={82} rx={26}
          fill={SKIN} stroke={SKIN_SK} strokeWidth="1.5" />

        {/* Pinky → A  (cx=124) */}
        <Finger cx={124} y={ky} w={26} h={130} rx={12} finger="pinky"  hand="left" t={t} />
        {/* Ring  → S  (cx=176) */}
        <Finger cx={176} y={iy} w={30} h={140} rx={13} finger="ring"   hand="left" t={t} />
        {/* Middle→ D  (cx=228) */}
        <Finger cx={228} y={my} w={30} h={146} rx={14} finger="middle" hand="left" t={t} />
        {/* Index → F  (cx=280) */}
        <Finger cx={280} y={iy} w={30} h={140} rx={13} finger="index"  hand="left" t={t} />

        {/* Thumb — angled right toward space bar
            tip reaches x ≈ 313 + 82·sin(38°) = 313 + 50 = 363  ≈ space-bar centre  */}
        <Thumb px={313} py={py} rx_r={295} ry_r={py} deg={-38} hand="left" t={t} />
      </g>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━  RIGHT HAND  ━━━━━━━━━━━━━━━━━━━━━━ */}
      <g>
        {/* Palm */}
        <rect x={461} y={py} width={214} height={82} rx={26}
          fill={SKIN} stroke={SKIN_SK} strokeWidth="1.5" />

        {/* Index → J  (cx=436) */}
        <Finger cx={436} y={iy} w={30} h={140} rx={13} finger="index"  hand="right" t={t} />
        {/* Middle→ K  (cx=488) */}
        <Finger cx={488} y={my} w={30} h={146} rx={14} finger="middle" hand="right" t={t} />
        {/* Ring  → L  (cx=540) */}
        <Finger cx={540} y={iy} w={30} h={140} rx={13} finger="ring"   hand="right" t={t} />
        {/* Pinky → ;  (cx=592) */}
        <Finger cx={592} y={ky} w={26} h={130} rx={12} finger="pinky"  hand="right" t={t} />

        {/* Thumb — angled left toward space bar
            tip reaches x ≈ 446 − 82·sin(38°) = 446 − 50 = 396  (in space-bar range) */}
        <Thumb px={446} py={py} rx_r={427} ry_r={py} deg={38} hand="right" t={t} />
      </g>

    </svg>
  );
}
