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
        fontFamily: "var(--font-main)",
        paddingTop: "var(--safe-top)",
        paddingLeft: "var(--safe-left)",
        paddingRight: "var(--safe-right)",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="w-full px-4 pt-5 pb-3 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3">

          {/* App title */}
          <div className="flex-1 border min-w-0">
            <h1
              className="text-3xl font-black leading-none tracking-tight"
              style={{ color: "var(--color-text)" }}
            >
              ABC Tracer
            </h1>
            <p
              className="text-sm font-bold mt-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              Pick a letter to trace! ✏️
            </p>
          </div>

          {/* Case toggle */}
          <div className="case-toggle border flex-shrink-0">
            <button
              className={`case-btn ${caseMode === "upper" ? "active" : ""}`}
              onClick={() => setCaseMode("upper")}
              aria-pressed={caseMode === "upper"}
            >
              <span className="text-xl font-black">A</span>
              <span>Big</span>
            </button>
            <button
              className={`case-btn ${caseMode === "lower" ? "active" : ""}`}
              onClick={() => setCaseMode("lower")}
              aria-pressed={caseMode === "lower"}
            >
              <span className="text-xl font-black">a</span>
              <span>Small</span>
            </button>
          </div>

          {/* Trophy link */}
          <Link
            href="/progress"
            className="glass-card nav-btn flex-col gap-0.5 flex-shrink-0"
            style={{ minWidth: 56, minHeight: 56, padding: "8px 12px" }}
            aria-label="My stars"
          >
            <span className="text-2xl leading-none">🏆</span>
            <span className="text-[11px] font-black" style={{ color: "var(--color-text-muted)" }}>Stars</span>
          </Link>
        </div>
      </header>

      {/* ── Letter grid ────────────────────────────────────────────────────── */}
      <main
        className="flex-1 w-[90vw] max-w-2xl mx-auto px-4 pb-6"
        style={{ paddingBottom: `calc(1.5rem + var(--safe-bottom))` }}
      >
        {/*
          FIX: Use <Link> instead of <button> + router.push() inside setTimeout.
          On iPad/iOS, programmatic navigation inside setTimeout breaks because
          iOS restricts navigation to synchronous user-gesture contexts.
          <Link> handles navigation immediately on tap/click, bypassing this.
        */}
        <div className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(clamp(60px, 14vw, 90px), 1fr))",
          }}
        >
          {letters.map((displayLetter) => {
            const upperKey = displayLetter.toUpperCase();
            const progressKey = caseMode === "upper" ? upperKey : displayLetter.toLowerCase();
            const mastery = getMasteryLevel(progressKey, progress);
            const phonics = PHONICS[upperKey];
            const color = getLetterColor(upperKey);
            const isBouncing = bouncing === upperKey;
            const href = `/trace/${caseMode === "upper" ? upperKey : displayLetter.toLowerCase()}`;

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
                    fontSize: "clamp(22px, 5.5vw, 36px)",
                    textShadow: "0 2px 5px rgba(0,0,0,0.18)",
                  }}
                >
                  {displayLetter}
                </span>

                <span
                  className="leading-none"
                  style={{ fontSize: "clamp(14px, 3.5vw, 22px)" }}
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
        <div className="flex justify-center gap-3 mt-5">
          {[
            { icon: "☆", label: "New" },
            { icon: "⭐", label: "Learning" },
            { icon: "🌟", label: "Mastered" },
          ].map(({ icon, label }) => (
            <div key={label} className="glass-card flex items-center gap-1.5 px-3 py-2">
              <span className="text-base leading-none">{icon}</span>
              <span className="text-xs font-bold" style={{ color: "var(--color-text-muted)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function lighten(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + Math.round(255 * a));
  const g = Math.min(255, ((n >> 8) & 0xff) + Math.round(255 * a));
  const b = Math.min(255, (n & 0xff) + Math.round(255 * a));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function darken(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - Math.round(255 * a));
  const g = Math.max(0, ((n >> 8) & 0xff) - Math.round(255 * a));
  const b = Math.max(0, (n & 0xff) - Math.round(255 * a));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
