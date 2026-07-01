"use client";

/**
 * useProgressStore — hydration-safe localStorage store for completed drills
 * and best star counts.
 */

import { useSyncExternalStore, useCallback } from "react";

const LS_KEY = "techhat_completed_drills";
const LS_STARS_KEY = "techhat_drill_stars";

type DrillStars = Record<string, 0 | 1 | 2 | 3>;
type ProgressSnapshot = {
  completed: string[];
  stars: DrillStars;
};

function readRaw(): string {
  try { return localStorage.getItem(LS_KEY) ?? "[]"; } catch { return "[]"; }
}

function readStarsRaw(): string {
  try { return localStorage.getItem(LS_STARS_KEY) ?? "{}"; } catch { return "{}"; }
}

function parseRaw(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function parseStarsRaw(raw: string): DrillStars {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const entries = Object.entries(parsed)
      .filter(([key, value]) => typeof key === "string" && [0, 1, 2, 3].includes(Number(value)))
      .map(([key, value]) => [key, Number(value) as 0 | 1 | 2 | 3]);
    return Object.fromEntries(entries);
  } catch {
    return {};
  }
}

function writeToStorage(ids: string[]): void {
  try { localStorage.setItem(LS_KEY, JSON.stringify(ids)); }
  catch { /* storage quota / private-mode */ }
}

function writeStarsToStorage(stars: DrillStars): void {
  try { localStorage.setItem(LS_STARS_KEY, JSON.stringify(stars)); }
  catch { /* storage quota / private-mode */ }
}

type Listener = () => void;
const listeners = new Set<Listener>();

let clientHydrated = false;
let lastRaw = "[]";
let lastStarsRaw = "{}";
const SERVER_SNAPSHOT: ProgressSnapshot = { completed: [], stars: {} };
let memoizedSnapshot: ProgressSnapshot = SERVER_SNAPSHOT;

function subscribe(listener: Listener): () => void {
  clientHydrated = true;
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyAll(): void {
  listeners.forEach((listener) => listener());
}

function getSnapshot(): ProgressSnapshot {
  const raw = readRaw();
  const starsRaw = readStarsRaw();
  if (raw === lastRaw && starsRaw === lastStarsRaw) return memoizedSnapshot;
  lastRaw = raw;
  lastStarsRaw = starsRaw;
  memoizedSnapshot = {
    completed: parseRaw(raw),
    stars: parseStarsRaw(starsRaw),
  };
  return memoizedSnapshot;
}

function getServerSnapshot(): ProgressSnapshot {
  return SERVER_SNAPSHOT;
}

export interface ProgressStore {
  isMounted: boolean;
  completedDrills: Set<string>;
  drillStars: DrillStars;
  markDrillCompleted: (drillId: string) => void;
  updateDrillStars: (drillId: string, stars: 0 | 1 | 2 | 3) => void;
}

export function useProgressStore(): ProgressStore {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const completedDrills = new Set(snapshot.completed);
  const isMounted = clientHydrated;

  const markDrillCompleted = useCallback((drillId: string) => {
    if (!drillId) return;
    const current = parseRaw(readRaw());
    if (current.includes(drillId)) return;
    writeToStorage([...current, drillId]);
    lastRaw = "";
    notifyAll();
  }, []);

  const updateDrillStars = useCallback((drillId: string, stars: 0 | 1 | 2 | 3) => {
    if (!drillId) return;
    const current = parseStarsRaw(readStarsRaw());
    const bestSoFar = current[drillId] ?? 0;
    if (bestSoFar >= stars && drillId in current) return;
    writeStarsToStorage({
      ...current,
      [drillId]: Math.max(bestSoFar, stars) as 0 | 1 | 2 | 3,
    });
    lastStarsRaw = "";
    notifyAll();
  }, []);

  return {
    isMounted,
    completedDrills,
    drillStars: snapshot.stars,
    markDrillCompleted,
    updateDrillStars,
  };
}
