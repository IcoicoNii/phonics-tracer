"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ALPHABET, PHONICS, getLetterColor } from "@/lib/phonics";
import {
  loadProgress,
  getMasteryLevel,
  clearProgress,
  type ProgressMap,
} from "@/lib/localStorage";
import MasteryBadge from "@/components/MasteryBadge";

export default function ProgressPage() {
  const [progress,       setProgress]       = useState<ProgressMap>({});
  const [totalMastered,  setTotalMastered]  = useState(0);

  const reload = () => {
    const p = loadProgress();
    setProgress(p);
    let count = 0;
    ALPHABET.forEach((l) => {
      if (getMasteryLevel(l,             p) >= 2) count++;
      if (getMasteryLevel(l.toLowerCase(), p) >= 2) count++;
    });
    setTotalMastered(count);
  };

  useEffect(() => { reload(); }, []);

  const handleClear = () => {
    if (window.confirm("Reset ALL stars? This cannot be undone!")) {
      clearProgress();
      reload();
    }
  };

  const pct = Math.round((totalMastered / 52) * 100);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: "var(--font-main)",
        paddingTop:    "var(--safe-top)",
        paddingLeft:   "var(--safe-left)",
        paddingRight:  "var(--safe-right)",
        paddingBottom: "var(--safe-bottom)",
      }}
    >
      {/* ── Header ── */}
      <header className="w-full max-w-2xl mx-auto px-4 pt-5 pb-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="glass-card nav-btn"
            style={{ color: "var(--color-text-muted)", minWidth: 80 }}
          >
            ← Home
          </Link>

          <div className="text-center">
            <h1
              className="text-2xl font-black leading-none"
              style={{ color: "var(--color-text)" }}
            >
              My Stars 🏆
            </h1>
            <p className="text-xs font-bold mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {totalMastered} / 52 mastered
            </p>
          </div>

          <button
            onClick={handleClear}
            className="glass-card nav-btn"
            style={{ color: "var(--color-danger)", minWidth: 80, fontSize: 13 }}
          >
            Reset
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <p
            className="text-center text-xs font-bold mt-1.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {pct}% complete 🌟
          </p>
        </div>
      </header>

      {/* ── Sections: Uppercase + Lowercase ── */}
      {(["upper", "lower"] as const).map((caseMode) => (
        <section key={caseMode} className="w-full max-w-2xl mx-auto px-4 mt-5">
          <h2
            className="text-xs font-black uppercase tracking-widest mb-3"
            style={{ color: "var(--color-text-muted)" }}
          >
            {caseMode === "upper" ? "🔠 Uppercase A – Z" : "🔡 Lowercase a – z"}
          </h2>

          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(clamp(60px, 14vw, 90px), 1fr))" }}>
            {ALPHABET.map((base) => {
              const letter  = caseMode === "upper" ? base : base.toLowerCase();
              const level   = getMasteryLevel(letter, progress);
              const color   = getLetterColor(base);
              const phonics = PHONICS[base];

              return (
                <Link
                  key={letter}
                  href={`/trace/${letter}`}
                  aria-label={`${letter} — ${phonics?.word}`}
                  className="letter-btn"
                  style={{
                    background:
                      level === 0
                        ? `linear-gradient(145deg, #E8E8F0, #D4D4E0)`
                        : `linear-gradient(145deg, ${lighten(color, 0.12)}, ${color})`,
                    boxShadow:
                      level >= 2
                        ? `0 5px 0 ${darken(color, 0.18)}, 0 0 16px ${color}60`
                        : level === 1
                        ? `0 4px 0 ${darken(color, 0.15)}, 0 6px 16px ${color}40`
                        : "0 3px 0 #BCBCD0, 0 4px 10px rgba(0,0,0,0.08)",
                    opacity: level === 0 ? 0.55 : 1,
                  }}
                >
                  <span
                    className="text-2xl sm:text-3xl leading-none"
                    style={{
                      color: level === 0 ? "#8B8BA8" : "white",
                      textShadow: level > 0 ? "0 2px 6px rgba(0,0,0,0.18)" : "none",
                    }}
                  >
                    {letter}
                  </span>
                  <span className="text-base leading-none mt-0.5">
                    {phonics?.emoji}
                  </span>
                  <span className="absolute top-1.5 right-1.5 text-xs">
                    <MasteryBadge level={level} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {/* Footer */}
      <p
        className="text-center text-xs font-bold mt-6 mb-10 px-4"
        style={{ color: "var(--color-text-muted)" }}
      >
        Trace each letter 3 times to earn a 🌟
      </p>
    </div>
  );
}

function lighten(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + Math.round(255 * amount));
  const g = Math.min(255, ((n >>  8) & 0xff) + Math.round(255 * amount));
  const b = Math.min(255, ( n        & 0xff) + Math.round(255 * amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function darken(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - Math.round(255 * amount));
  const g = Math.max(0, ((n >>  8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, ( n        & 0xff) - Math.round(255 * amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
