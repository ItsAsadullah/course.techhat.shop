"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AiAssistButtonProps {
  label?: string;
  /** Runs the AI action; return {data}|{error}. On data, apply it to the form. */
  action: () => Promise<{ data?: unknown; error?: string }>;
  onResult: (data: unknown) => void;
  className?: string;
}

export function AiAssistButton({ label = "AI", action, onResult, className }: AiAssistButtonProps) {
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const res = await action();
      if (res?.error) {
        toast.error(res.error);
      } else if (res?.data !== undefined) {
        onResult(res.data);
        toast.success("AI content applied");
      } else {
        toast.error("No content returned");
      }
    } catch (e: unknown) {
      const error = e as Error;
      toast.error(error?.message || "AI request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={run}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60 ${className || ""}`}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
      {label}
    </button>
  );
}
