"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ALPHABET, PHONICS, getLetterColor } from "@/lib/phonics";
import { loadProgress, getMasteryLevel, type ProgressMap } from "@/lib/localStorage";
import MasteryBadge from "@/components/MasteryBadge";

type CaseMode = "upper" | "lower";

export default function HomePage() {
  const [caseMode, setCaseMode] = useState<CaseMode>("upper");
  const [progress, setProgress] = useState<ProgressMap>({});
  const [bouncing, setBouncing] = useState<string | null>(null);
  const bounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  // Trigger bounce animation without delaying navigation
  const handleBounce = (upperLetter: string) => {
    if (bounceTimer.current) clearTimeout(bounceTimer.current);
    setBouncing(upperLetter);
    bounceTimer.current = setTimeout(() => setBouncing(null), 520);
  };

  const letters = ALPHABET.map((l) =>
    caseMode === "upper" ? l.toUpperCase() : l.toLowerCase()
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily:   "var(--font-main)",
        paddingTop:   "var(--safe-top)",
        paddingLeft:  "var(--safe-left)",
        paddingRight: "var(--safe-right)",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────────
           3-column CSS grid: [trophy] [title] [toggle]
           max-w-5xl expands content to 1024 px on desktop (was 672 px).
           Padding and spacing scale up at md (768 px) breakpoint.
      ─────────────────────────────────────────────────────────────────────── */}
      <header className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-5 md:pt-10 pb-4 md:pb-6">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-6">

          {/* Trophy link */}
          <Link
            href="/progress"
            className="glass-card nav-btn flex-col gap-0.5 flex-shrink-0"
            style={{ minWidth: 60, minHeight: 60, padding: "8px 14px" }}
            aria-label="My stars"
          >
            <span className="text-2xl md:text-3xl leading-none">🏆</span>
            <span
              className="text-[11px] md:text-xs font-black"
              style={{ color: "var(--color-text-muted)" }}
            >
              Stars
            </span>
          </Link>

          {/* App title — center column */}
          <div className="flex flex-col items-center gap-1 min-w-0 overflow-hidden">
            <h1
              className="font-black leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-pink-500 text-3xl md:text-5xl lg:text-6xl"
              style={{ paddingBottom: "2px" }}
            >
              ABC Tracer
            </h1>
            <p
              className="text-xs md:text-sm font-bold"
              style={{ color: "var(--color-text-muted)" }}
            >
              <span className="hidden md:inline">Pick a letter to trace! ✏️</span>
              <span className="md:hidden">Pick a letter! ✏️</span>
            </p>
          </div>

          {/* Case toggle */}
          <div className="case-toggle flex-shrink-0">
            <button
              className={`case-btn ${caseMode === "upper" ? "active" : ""}`}
              onClick={() => setCaseMode("upper")}
              aria-pressed={caseMode === "upper"}
            >
              <span className="text-xl md:text-2xl font-black">A</span>
              <span>Big</span>
            </button>
            <button
              className={`case-btn ${caseMode === "lower" ? "active" : ""}`}
              onClick={() => setCaseMode("lower")}
              aria-pressed={caseMode === "lower"}
            >
              <span className="text-xl md:text-2xl font-black">a</span>
              <span>Small</span>
            </button>
          </div>

        </div>

        {/* Subtle divider — only shown on md+ between header and grid */}
        <div className="hidden md:block mt-6 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </header>

      {/* ── Letter grid ────────────────────────────────────────────────────────
           Same max-w and px as the header so edges always align.

           Tile sizing strategy  —  clamp(58px, 14vw, 96px):
             Phone  (375 px, inner ≈ 343 px): 14vw=52 → 58 px min → 5 cols
             Tablet (768 px, inner ≈ 640 px): 14vw=107 → 96 px max → 6–7 cols
             Desktop (1440 px, inner ≈ 960 px): 14vw=201 → 96 px max → 9 cols
           26 letters:  5 cols → 6 rows  |  7 cols → 4 rows  |  9 cols → 3 rows ✓
      ──────────────────────────────────────────────────────────────────────── */}
      <main
        className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8"
        style={{ paddingBottom: `calc(2rem + var(--safe-bottom))` }}
      >
        {/*
          FIX: Use <Link> instead of <button> + router.push() inside setTimeout.
          On iPad/iOS, programmatic navigation inside setTimeout breaks because
          iOS restricts navigation to synchronous user-gesture contexts.
          <Link> handles navigation immediately on tap/click, bypassing this.
        */}
        <div
          className="grid gap-3 md:gap-5"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(clamp(58px, 14vw, 96px), 1fr))",
          }}
        >
          {letters.map((displayLetter) => {
            const upperKey    = displayLetter.toUpperCase();
            const progressKey = caseMode === "upper" ? upperKey : displayLetter.toLowerCase();
            const mastery     = getMasteryLevel(progressKey, progress);
            const phonics     = PHONICS[upperKey];
            const color       = getLetterColor(upperKey);
            const isBouncing  = bouncing === upperKey;
            const href        = `/trace/${caseMode === "upper" ? upperKey : displayLetter.toLowerCase()}`;

            const bg = mastery >= 2
              ? `linear-gradient(145deg, ${lighten(color, 0.12)}, ${color})`
              : `linear-gradient(145deg, ${lighten(color, 0.18)}, ${color})`;

            return (
              <Link
                key={displayLetter}
                href={href}
                id={`letter-btn-${displayLetter}`}
                aria-label={`Letter ${displayLetter} — ${phonics?.word ?? ""}`}
                onClick={() => handleBounce(upperKey)}
                className={`letter-btn ${isBouncing ? "animate-letter-bounce" : ""}`}
                style={{
                  background: bg,
                  boxShadow: mastery >= 2
                    ? `0 5px 0 ${darken(color, 0.2)}, 0 0 18px ${color}55`
                    : `0 5px 0 ${darken(color, 0.2)}, 0 6px 18px ${color}44`,
                }}
              >
                <span
                  className="leading-none font-black"
                  style={{
                    fontSize:   "clamp(18px, 4.5vw, 32px)",
                    textShadow: "0 2px 5px rgba(0,0,0,0.18)",
                  }}
                >
                  {displayLetter}
                </span>

                <span
                  className="leading-none"
                  style={{ fontSize: "clamp(12px, 3vw, 22px)" }}
                >
                  {phonics?.emoji}
                </span>

                {/* Mastery star */}
                <span className="absolute top-1.5 right-1.5">
                  <MasteryBadge level={mastery} />
                </span>

                {/* Mastered glow ring */}
                {mastery >= 2 && (
                  <span
                    className="absolute inset-0 rounded-[18px] pointer-events-none"
                    style={{ boxShadow: `0 0 0 2.5px ${color}90` }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center mt-6 md:mt-10">
          <div className="glass-card inline-flex items-center gap-5 md:gap-8 px-6 md:px-10 py-3 md:py-4 rounded-full">
            {[
              { icon: "☆", label: "New" },
              { icon: "⭐", label: "Learning" },
              { icon: "🌟", label: "Mastered" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 md:gap-2">
                <span className="text-lg md:text-2xl leading-none">{icon}</span>
                <span
                  className="text-sm md:text-base font-bold"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function lighten(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + Math.round(255 * a));
  const g = Math.min(255, ((n >>  8) & 0xff) + Math.round(255 * a));
  const b = Math.min(255, ( n        & 0xff) + Math.round(255 * a));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function darken(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - Math.round(255 * a));
  const g = Math.max(0, ((n >>  8) & 0xff) - Math.round(255 * a));
  const b = Math.max(0, ( n        & 0xff) - Math.round(255 * a));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
