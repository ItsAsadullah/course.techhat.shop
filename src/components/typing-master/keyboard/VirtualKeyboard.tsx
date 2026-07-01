"use client";

import React, { useMemo } from "react";
import { CornerDownLeft } from "lucide-react";
import {
  KEYBOARD_ROWS,
  FINGER_COLOR,
  FINGER_COLOR_PASSIVE,
  HOME_ROW_KEYS,
  charRequiresShift,
  getFingerForChar,
  getKeyForChar,
  getShiftKeyForHand,
  type Finger,
  type FingerTarget,
  type KeyDef,
} from "./keyboardData";
import { getHandImages } from "./handImageData";

export interface HandOffset { dx: number; dy: number }

interface VirtualKeyboardProps {
  nextExpectedChar: string | null;
  showHands?: boolean;
  wrongKey?: string | null;
  hideHint?: boolean;
}

interface KeyCapProps {
  keyDef: KeyDef;
  isActive: boolean;
  isError: boolean;
}

function KeyCap({ keyDef, isActive, isError }: KeyCapProps) {
  const finger = keyDef.finger.finger;
  const colors = FINGER_COLOR[finger];
  const widthRem = (keyDef.width ?? 1) * 3.0;
  const isHomeRow = keyDef.chars.some((char) => HOME_ROW_KEYS.has(char));

  return (
    <div
      style={{ minWidth: `${widthRem}rem`, maxWidth: `${widthRem}rem` }}
      className={[
        "relative h-11 rounded-lg flex items-center justify-center",
        "text-[11px] font-semibold select-none transition-all duration-150 cursor-default",
        "border-b-[3px]",
        isError
          ? "bg-red-500 border-b-red-700 text-white ring-2 ring-red-400 scale-105 shadow-md"
          : isActive
          ? [
              colors.bg,
              "border-transparent text-white",
              `ring-2 ${colors.ring}`,
              "scale-105 shadow-md -translate-y-0.5",
            ].join(" ")
          : [
              FINGER_COLOR_PASSIVE[finger],
              "border-b-gray-300/60 dark:border-b-slate-600/60 shadow-sm",
            ].join(" "),
      ].join(" ")}
    >
      {keyDef.label}
      {isHomeRow && (
        <span
          className={[
            "absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
            isActive ? "bg-white/70" : "bg-gray-400/70 dark:bg-slate-400/70",
          ].join(" ")}
        />
      )}
    </div>
  );
}

interface HandOverlayProps {
  nextExpectedChar: string | null;
}

function HandOverlay({ nextExpectedChar }: HandOverlayProps) {
  const { left, right, isSpace } = useMemo(
    () => getHandImages(nextExpectedChar),
    [nextExpectedChar]
  );

  return (
    <div
      className="pointer-events-none z-20"
      style={{ position: "absolute", left: 0, top: "-13%", width: "100%", height: "100%" }}
    >
      {isSpace ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/hands/space.png"
          alt=""
          style={{ position: "absolute", left: "33.3%", top: 0, width: "84.2%", height: "auto" }}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/hands/${left}.png`}
            alt="left hand"
            style={{ position: "absolute", left: "-20.5%", top: "-6%", width: "74.3%", height: "auto" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/hands/${right}.png`}
            alt="right hand"
            style={{
              position: "absolute",
              left: "31.3%",
              top: 0,
              width: "84.2%",
              height: "auto",
              transform: "translate(-10px, -8px)",
            }}
          />
        </>
      )}
    </div>
  );
}

function renderNextKeyBadge(char: string) {
  if (char === " ") return "SP";
  if (char === "\n") return <CornerDownLeft className="w-4 h-4" strokeWidth={2.4} />;
  return char.toUpperCase();
}

function formatFingerLabel(targetFinger: FingerTarget, shiftHand: "left" | "right" | null) {
  const primary = `${targetFinger.hand} ${targetFinger.finger}`;
  if (!shiftHand) return primary;
  return `${shiftHand} pinky + ${primary}`;
}

export default function VirtualKeyboard({
  nextExpectedChar,
  showHands = true,
  wrongKey = null,
  hideHint = false,
}: VirtualKeyboardProps) {
  const targetFinger = useMemo(
    () => (nextExpectedChar ? getFingerForChar(nextExpectedChar) : null),
    [nextExpectedChar]
  );

  const activeKey = useMemo(() => (
    nextExpectedChar ? getKeyForChar(nextExpectedChar) : null
  ), [nextExpectedChar]);

  const needsShift = useMemo(() => (
    nextExpectedChar ? charRequiresShift(nextExpectedChar) : false
  ), [nextExpectedChar]);

  const shiftHand = useMemo(() => {
    if (!needsShift || !targetFinger) return null;
    return targetFinger.hand === "left" ? "right" : "left";
  }, [needsShift, targetFinger]);

  const shiftKey = useMemo(() => (
    shiftHand ? getShiftKeyForHand(shiftHand) : null
  ), [shiftHand]);

  const activeKeys = useMemo(() => {
    const keys = new Set<KeyDef>();
    if (activeKey) keys.add(activeKey);
    if (shiftKey) keys.add(shiftKey);
    return keys;
  }, [activeKey, shiftKey]);

  const fingerLabel = useMemo(() => {
    if (!targetFinger) return null;
    return formatFingerLabel(targetFinger, shiftHand);
  }, [targetFinger, shiftHand]);

  const badgeKeyClassName = useMemo(() => {
    if (needsShift) {
      return [
        "min-w-[4.75rem] h-7 px-2 rounded-md flex items-center justify-center gap-1.5",
        "text-[10px] font-bold text-white shadow-sm",
        targetFinger ? FINGER_COLOR[targetFinger.finger].bg : "bg-gray-300",
      ].join(" ");
    }

    return [
      "w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white shadow-sm",
      targetFinger ? FINGER_COLOR[targetFinger.finger].bg : "bg-gray-300",
    ].join(" ");
  }, [needsShift, targetFinger]);

  const badgeKeyContent = useMemo(() => {
    if (!nextExpectedChar) return null;
    if (needsShift) {
      return (
        <>
          <span className="text-[9px] uppercase tracking-wide">Shift</span>
          <span className="text-xs">{nextExpectedChar.toUpperCase()}</span>
        </>
      );
    }
    return renderNextKeyBadge(nextExpectedChar);
  }, [nextExpectedChar, needsShift]);

  const errorKey = useMemo(() => {
    if (!wrongKey) return null;
    for (const row of KEYBOARD_ROWS) {
      for (const key of row) {
        if (key.chars.includes(wrongKey) || key.chars.includes(wrongKey.toLowerCase())) return key;
      }
    }
    return null;
  }, [wrongKey]);

  return (
    <div className="flex flex-col items-center select-none">
      {nextExpectedChar && !hideHint ? (
        <div className="mb-3 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm dark:bg-slate-800 dark:border-slate-600">
          <span className="text-[11px] text-gray-400 dark:text-slate-400 font-medium tracking-wide">
            Next
          </span>
          <div
            className={badgeKeyClassName}
          >
            {badgeKeyContent}
          </div>
          {fingerLabel && (
            <span className={`text-[11px] font-semibold capitalize ${FINGER_COLOR[targetFinger?.finger ??  "index"].text}`}>
              {fingerLabel}
            </span>
          )}
        </div>
      ) : (
        <div className="mb-3 h-8" />
      )}

      <div className="relative" style={{ overflow: "visible", marginBottom: showHands ? "250px" : undefined }}>
        <div className="relative z-10 p-3" role="img" aria-label="Virtual keyboard">
          <div className="flex flex-col gap-1.5">
            {KEYBOARD_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-1">
                {row.map((key, keyIdx) => (
                  <KeyCap
                    key={`${rowIdx}-${keyIdx}`}
                    keyDef={key}
                    isActive={activeKeys.has(key)}
                    isError={errorKey === key}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
            {(["pinky", "ring", "middle", "index", "thumb"] as Finger[]).map((finger) => (
              <span
                key={finger}
                className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-slate-500 font-medium"
              >
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${FINGER_COLOR[finger].bg}`} />
                {finger.charAt(0).toUpperCase() + finger.slice(1)}
              </span>
            ))}
          </div>
        </div>

        {showHands && <HandOverlay nextExpectedChar={nextExpectedChar} />}
      </div>
    </div>
  );
}
