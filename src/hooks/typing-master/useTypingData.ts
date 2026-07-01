"use client";

/**
 * useTypingData — dual-storage hook for drill session results.
 *
 * Signed-in users → saved to PostgreSQL via /api/sessions
 * Guest users      → saved to localStorage ("guest_typing_data")
 *
 * syncGuestDataToServer() uploads guest records after sign-in.
 */

import { useState, useCallback } from "react";
import { useSession } from "@/hooks/typing-master/useSessionAdapter";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TypingSession {
  /** Curriculum IDs */
  drillId: string;
  lessonId: string;
  modId: string;
  /** Performance */
  wpm: number;
  accuracy: number; // 0–100
  errors: number;
  timeSpent: number; // seconds
  /** ISO timestamp — set by client for guests, by DB for signed-in */
  completedAt: string;
  /** DB primary key — only present for signed-in records fetched from server */
  id?: string;
}

export type SaveSessionInput = Omit<TypingSession, "completedAt" | "id">;

export interface UseTypingDataResult {
  /** Persist one drill result (signed-in → DB, guest → localStorage) */
  saveSession: (data: SaveSessionInput) => Promise<void>;
  /** Fetch all results for this user / guest */
  getSessions: () => Promise<TypingSession[]>;
  /**
   * After the user signs in while having guest data, call this once
   * to upload all locally stored sessions to the server, then clear them.
   */
  syncGuestDataToServer: () => Promise<void>;
  isLoading: boolean;
}

// ── localStorage helpers (SSR-safe) ──────────────────────────────────────────

const GUEST_LS_KEY = "guest_typing_data";

function lsGetSessions(): TypingSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_LS_KEY);
    return raw ? (JSON.parse(raw) as TypingSession[]) : [];
  } catch {
    return [];
  }
}

function lsSaveSessions(sessions: TypingSession[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_LS_KEY, JSON.stringify(sessions));
}

function lsClearSessions(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_LS_KEY);
}

// ── API helpers ───────────────────────────────────────────────────────────────

async function apiSaveSession(data: SaveSessionInput): Promise<TypingSession> {
  const res = await fetch("/api/typing-master/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

async function apiGetSessions(): Promise<TypingSession[]> {
  const res = await fetch("/api/typing-master/sessions");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useTypingData(): UseTypingDataResult {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const isSignedIn = status === "authenticated" && !!session?.user?.id;

  // ── saveSession ────────────────────────────────────────────────────────────
  const saveSession = useCallback(
    async (data: SaveSessionInput): Promise<void> => {
      setIsLoading(true);
      try {
        if (isSignedIn) {
          await apiSaveSession(data);
        } else {
          // Guest — write to localStorage immediately
          const existing = lsGetSessions();
          const newRecord: TypingSession = {
            ...data,
            completedAt: new Date().toISOString(),
          };
          lsSaveSessions([...existing, newRecord]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isSignedIn],
  );

  // ── getSessions ────────────────────────────────────────────────────────────
  const getSessions = useCallback(async (): Promise<TypingSession[]> => {
    setIsLoading(true);
    try {
      if (isSignedIn) {
        return await apiGetSessions();
      } else {
        return lsGetSessions();
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  // ── syncGuestDataToServer ──────────────────────────────────────────────────
  // Upload any locally stored guest sessions after the user signs in,
  // then clear the local cache so records are not duplicated.
  const syncGuestDataToServer = useCallback(async (): Promise<void> => {
    if (!isSignedIn) return; // nothing to sync if not logged in

    const guests = lsGetSessions();
    if (guests.length === 0) return;

    setIsLoading(true);
    try {
      // Upload all in sequence (keeps order; parallel risks race conditions)
      for (const g of guests) {
        await apiSaveSession({
          drillId: g.drillId,
          lessonId: g.lessonId,
          modId: g.modId,
          wpm: g.wpm,
          accuracy: g.accuracy,
          errors: g.errors,
          timeSpent: g.timeSpent,
        });
      }
      lsClearSessions();
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  return { saveSession, getSessions, syncGuestDataToServer, isLoading };
}
