// localStorage helpers for progress tracking

const PROGRESS_KEY = "phonics-tracer-progress";

export type LetterProgress = {
  completions: number; // 0, 1, 2 = partial; 3+ = mastered
  lastCompleted?: number; // timestamp
};

export type ProgressMap = Record<string, LetterProgress>;

/** Load all progress from localStorage */
export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Save the full progress map */
export function saveProgress(map: ProgressMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
  } catch {
    // storage quota — fail silently
  }
}

/** Record a successful completion for a letter (e.g. "A", "a") */
export function recordCompletion(letterKey: string): ProgressMap {
  const map = loadProgress();
  const existing = map[letterKey] ?? { completions: 0 };
  map[letterKey] = {
    completions: existing.completions + 1,
    lastCompleted: Date.now(),
  };
  saveProgress(map);
  return map;
}

/** Get mastery level for a single letter: 0 = none, 1 = partial, 2 = mastered */
export function getMasteryLevel(
  letterKey: string,
  map?: ProgressMap
): 0 | 1 | 2 {
  const m = map ?? loadProgress();
  const p = m[letterKey];
  if (!p) return 0;
  if (p.completions >= 3) return 2;
  if (p.completions >= 1) return 1;
  return 0;
}

/** Reset all progress (for dev/testing) */
export function clearProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROGRESS_KEY);
}
