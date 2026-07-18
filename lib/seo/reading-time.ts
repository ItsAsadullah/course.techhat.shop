// =====================================================
// Reading-time estimate. Counts words across the given
// text fragments (handles Latin + Bangla whitespace).
// =====================================================

export interface ReadingTime {
  words: number;
  minutes: number;
  label: string;
}

export function readingTime(input: string | string[], wpm = 200): ReadingTime {
  const text = Array.isArray(input) ? input.join(" ") : input || "";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wpm));
  return { words, minutes, label: `${minutes} min read` };
}
