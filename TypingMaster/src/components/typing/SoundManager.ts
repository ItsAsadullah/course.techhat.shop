"use client";

// =============================================================================
//  SoundManager — Real typing.com sound files via Web Audio API
//
//  Files (served from /sounds/):
//    keysprite.mp3  -> all normal keystroke sounds (playback-rate pitch variation)
//    error.mp3      -> wrong keystroke
//    pop.mp3        -> word complete / popup / UI feedback
//    star1.mp3      -> 1-star reward
//    star2.mp3      -> 2-star / streak milestone
//    star3.mp3      -> 3-star / level-up / drill complete
//
//  Architecture:
//    - AudioContext + DynamicsCompressor on master bus
//    - All files pre-decoded into AudioBuffer on first use (background fetch)
//    - Each play() spawns a lightweight BufferSourceNode (GC-friendly)
//    - Pitch variety via playbackRate jitter table for keystroke
// =============================================================================

import { useRef, useCallback, useEffect } from "react";

export type SoundName =
  | "keystroke"
  | "keystroke_space"
  | "keystroke_error"
  | "explosion"
  | "word_complete"
  | "streak_milestone"
  | "level_up"
  | "drill_complete"
  | "popup";

interface SoundManager {
  play: (name: SoundName) => void;
  setEnabled: (enabled: boolean) => void;
}

// Sound file paths (served from /public/sounds/)
const SOUND_FILES = {
  keysprite: "/sounds/keysprite.mp3",
  error:     "/sounds/error.mp3",
  explosion: "/sounds/Explosion.mp3",
  pop:       "/sounds/pop.mp3",
  star1:     "/sounds/star1.mp3",
  star2:     "/sounds/star2.mp3",
  star3:     "/sounds/star3.mp3",
} as const;

type SoundKey = keyof typeof SOUND_FILES;

// Master compressor (limiter) on the destination bus
function buildCompressor(ctx: AudioContext): DynamicsCompressorNode {
  const c = ctx.createDynamicsCompressor();
  c.threshold.value = -6;
  c.knee.value      =  1;
  c.ratio.value     =  20;
  c.attack.value    =  0.004;
  c.release.value   =  0.05;
  c.connect(ctx.destination);
  return c;
}

// Fetch + decode one audio file
async function fetchBuffer(ctx: AudioContext, url: string): Promise<AudioBuffer | null> {
  try {
    const res = await fetch(url);
    const arr = await res.arrayBuffer();
    return await ctx.decodeAudioData(arr);
  } catch (e) {
    console.warn("[SoundManager] Could not load", url, e);
    return null;
  }
}

// Play a decoded buffer with optional pitch / gain / offset / duration
function playBuffer(
  ctx:    AudioContext,
  out:    AudioNode,
  buf:    AudioBuffer,
  opts: {
    gain?:         number;
    playbackRate?: number;
    offset?:       number;
    duration?:     number;
  } = {},
) {
  const { gain = 1.0, playbackRate = 1.0, offset = 0, duration } = opts;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = playbackRate;

  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(g);
  g.connect(out);

  if (duration !== undefined) {
    src.start(ctx.currentTime, offset, duration);
  } else {
    src.start(ctx.currentTime, offset);
  }
}

// Pitch jitter table: gives each keystroke a slightly different pitch
// so rapid typing sounds natural, not robotic.
let _pitchIdx = 0;
const PITCH_TABLE = [1.00, 1.02, 0.98, 1.03, 0.97, 1.01, 0.99, 1.04, 0.96, 1.02];
function nextPitch(): number {
  return PITCH_TABLE[_pitchIdx++ % PITCH_TABLE.length];
}

// Context state (one per component tree, lazy-created on first gesture)
interface CtxState {
  ctx:     AudioContext;
  out:     DynamicsCompressorNode;
  buffers: Partial<Record<SoundKey, AudioBuffer>>;
}

// Hook
export function useSoundManager(initialEnabled = true): SoundManager {
  const stateRef   = useRef<CtxState | null>(null);
  const enabledRef = useRef(initialEnabled);

  useEffect(() => () => { stateRef.current?.ctx.close(); }, []);

  const getState = useCallback((): CtxState | null => {
    if (!enabledRef.current) return null;
    if (typeof window === "undefined") return null;

    const existing = stateRef.current;
    if (existing && existing.ctx.state !== "closed") {
      if (existing.ctx.state === "suspended") existing.ctx.resume();
      return existing;
    }

    const AC = window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const out = buildCompressor(ctx);
    const state: CtxState = { ctx, out, buffers: {} };
    stateRef.current = state;

    // Pre-load all files in the background
    for (const [key, url] of Object.entries(SOUND_FILES) as [SoundKey, string][]) {
      fetchBuffer(ctx, url).then((buf) => {
        if (buf) state.buffers[key] = buf;
      });
    }

    return state;
  }, []);

  const play = useCallback((name: SoundName) => {
    const s = getState();
    if (!s) return;
    const { ctx, out, buffers } = s;

    try {
      switch (name) {
        case "keystroke": {
          const buf = buffers.keysprite;
          if (!buf) return;
          // Play a 65 ms window so fast typing does not bleed into next stroke.
          playBuffer(ctx, out, buf, { gain: 0.85, playbackRate: nextPitch(), duration: 0.065 });
          break;
        }
        case "keystroke_space": {
          const buf = buffers.keysprite;
          if (!buf) return;
          // Lower pitch = deeper spacebar thud feel.
          playBuffer(ctx, out, buf, { gain: 0.90, playbackRate: 0.82, duration: 0.085 });
          break;
        }
        case "keystroke_error": {
          const buf = buffers.error;
          if (!buf) return;
          playBuffer(ctx, out, buf, { gain: 0.80 });
          break;
        }
        case "explosion": {
          const boom = buffers.explosion;
          const pop = buffers.pop;
          const err = buffers.error;
          if (boom) {
            playBuffer(ctx, out, boom, { gain: 0.9, offset: 1.7 });
          } else {
            if (pop) {
              playBuffer(ctx, out, pop, { gain: 0.95, playbackRate: 0.62 });
            }
            if (err) {
              playBuffer(ctx, out, err, { gain: 0.35, playbackRate: 0.78 });
            }
          }
          break;
        }
        case "word_complete":
        case "popup": {
          const buf = buffers.pop;
          if (!buf) return;
          playBuffer(ctx, out, buf, { gain: 0.65 });
          break;
        }
        case "streak_milestone": {
          const buf = buffers.star2;
          if (!buf) return;
          playBuffer(ctx, out, buf, { gain: 0.75 });
          break;
        }
        case "level_up": {
          const buf = buffers.star3;
          if (!buf) return;
          playBuffer(ctx, out, buf, { gain: 0.85 });
          break;
        }
        case "drill_complete": {
          // Play star3 then star1 as a flourish
          const buf3 = buffers.star3;
          const buf1 = buffers.star1;
          if (buf3) playBuffer(ctx, out, buf3, { gain: 0.90 });
          if (buf1) {
            setTimeout(() => {
              const s2 = stateRef.current;
              if (s2) playBuffer(s2.ctx, s2.out, buf1, { gain: 0.55, playbackRate: 1.1 });
            }, 320);
          }
          break;
        }
      }
    } catch { /* AudioContext not ready */ }
  }, [getState]);

  const setEnabled = useCallback((v: boolean) => { enabledRef.current = v; }, []);

  return { play, setEnabled };
}
