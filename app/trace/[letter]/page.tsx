"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLetterPath } from "@/lib/letterPaths";
import { PHONICS, getLetterColor } from "@/lib/phonics";
import { recordCompletion, getMasteryLevel, loadProgress } from "@/lib/localStorage";
import { useTracingEngine } from "@/hooks/useTracingEngine";
import BrushPicker from "@/components/BrushPicker";
import ConfettiCelebration from "@/components/ConfettiCelebration";
import type { BrushTheme } from "@/hooks/useTracingEngine";

// Internal canvas resolution (scaled by CSS)
const CANVAS_W = 300;
const CANVAS_H = 360;

export default function TracePage() {
  const params  = useParams();
  const router  = useRouter();
  const letter  = decodeURIComponent(params.letter as string);
  const upper   = letter.toUpperCase();
  const phonics = PHONICS[upper];
  const lPath   = getLetterPath(letter);
  const color   = getLetterColor(upper);

  const [brushTheme,   setBrushTheme]   = useState<BrushTheme>("plain");
  const [celebrated,   setCelebrated]   = useState(false);
  const [completions,  setCompletions]  = useState(0);
  const [masteryLevel, setMasteryLevel] = useState(0);
  const [showBanner,   setShowBanner]   = useState(false);

  useEffect(() => {
    const p = loadProgress();
    setMasteryLevel(getMasteryLevel(letter, p));
    setCompletions(p[letter]?.completions ?? 0);
  }, [letter]);

  const handleComplete = useCallback(() => {
    const map = recordCompletion(letter);
    const lvl = getMasteryLevel(letter, map);
    setMasteryLevel(lvl);
    setCompletions(map[letter]?.completions ?? 0);
    setCelebrated(true);
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 2800);
  }, [letter]);

  const {
    canvasRef,
    engineState,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    reset,
    strokeIndex,
    totalStrokes,
  } = useTracingEngine({
    letterPath:  lPath!,
    canvasWidth:  CANVAS_W,
    canvasHeight: CANVAS_H,
    brushTheme,
    onComplete:  handleComplete,
  });

  if (!lPath) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-xl font-bold text-center" style={{ color: "var(--color-text-muted)" }}>
          Letter &quot;{letter}&quot; not found.
        </p>
      </div>
    );
  }

  const handleTryAgain = () => {
    setCelebrated(false);
    setShowBanner(false);
    reset();
  };

  const STATUS: Record<typeof engineState, { icon: string; text: string; color: string }> = {
    demo:     { icon: "👀", text: "Watch how to trace it!",              color: "#A78BFA" },
    idle:     {
      icon: strokeIndex === 0 ? "☝️" : "✅",
      text: strokeIndex === 0 ? "Tap the green dot to start!" : `Stroke ${strokeIndex} done — start the next!`,
      color: "#3DD68C",
    },
    tracing:  { icon: "✏️",  text: "Keep going!",                         color: "#4B9EFF" },
    paused:   { icon: "⏸️",  text: "Tap the orange dot to continue!",     color: "#FF8C42" },
    complete: { icon: "🎉",  text: "Amazing! You did it!",                color: "#FF6B9D" },
  };
  const status = STATUS[engineState];

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        fontFamily: "var(--font-main)",
        paddingTop:    "var(--safe-top)",
        paddingLeft:   "var(--safe-left)",
        paddingRight:  "var(--safe-right)",
        paddingBottom: "var(--safe-bottom)",
      }}
    >
      <ConfettiCelebration trigger={celebrated} />

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header
        className="w-full max-w-lg px-4 pt-5 pb-2"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Back button — router.back() is synchronous, safe on iOS */}
          <button
            onClick={() => router.back()}
            className="glass-card nav-btn"
            aria-label="Go back"
            style={{ minWidth: 72 }}
          >
            ← Back
          </button>

          {/* Stroke progress indicator */}
          {totalStrokes > 0 && (
            <div className="flex items-center gap-2 flex-1 justify-center">
              {Array.from({ length: totalStrokes }).map((_, i) => (
                <span
                  key={i}
                  className="stroke-dot"
                  style={{
                    width: i === strokeIndex ? 28 : 10,
                    background:
                      i < strokeIndex
                        ? "var(--color-accent-green)"
                        : i === strokeIndex
                        ? "var(--color-primary)"
                        : "rgba(139,139,168,0.28)",
                    boxShadow: i === strokeIndex ? "0 0 10px var(--color-primary)" : "none",
                  }}
                />
              ))}
            </div>
          )}

          {/* Reset / try again */}
          <button
            onClick={handleTryAgain}
            className="glass-card nav-btn"
            aria-label="Try again"
            style={{ minWidth: 72 }}
          >
            🔄 Again
          </button>
        </div>
      </header>

      {/* ── Letter identity card ──────────────────────────────────────────── */}
      <div
        className="mx-4 mt-2 w-full max-w-lg px-5 py-4 rounded-3xl flex items-center gap-5"
        style={{
          background: `linear-gradient(135deg, ${color}1A, ${color}3A)`,
          border: `2px solid ${color}55`,
          boxShadow: `0 4px 24px ${color}28`,
        }}
      >
        {/* Giant letter */}
        <span
          className="font-black leading-none select-none flex-shrink-0"
          style={{
            fontSize: "clamp(56px, 15vw, 80px)",
            color: darken(color, 0.22),
            textShadow: `0 3px 12px ${color}55`,
          }}
        >
          {letter}
        </span>

        {/* Divider */}
        <div
          className="w-px self-stretch mx-1 flex-shrink-0"
          style={{ background: `${color}44` }}
        />

        {/* Emoji + word */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <span style={{ fontSize: "clamp(32px, 8vw, 48px)", lineHeight: 1 }}>
            {phonics?.emoji}
          </span>
          <span
            className="font-black leading-tight"
            style={{
              fontSize: "clamp(14px, 3.5vw, 20px)",
              color: darken(color, 0.28),
            }}
          >
            {phonics?.word}
          </span>
        </div>
      </div>

      {/* ── Canvas ───────────────────────────────────────────────────────── */}
      <div
        className="canvas-wrapper mx-4 mt-4 w-full max-w-lg"
        style={{ border: `3px solid ${color}44` }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="tracing-canvas w-full"
          style={{
            /*
             * The canvas always fills the wrapper width.
             * aspect-ratio keeps height proportional so it never squishes.
             * touch-action: none is set via CSS class — critical for iPad drawing.
             */
            aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
            touchAction: "none",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />

        {/* Celebration overlay */}
        {engineState === "complete" && (
          <div className="celebration-overlay">
            <span
              className="font-black animate-celebration leading-none"
              style={{
                fontSize: "clamp(72px, 20vw, 110px)",
                color: darken(color, 0.12),
                textShadow: `0 4px 22px ${color}70`,
              }}
            >
              {letter}
            </span>

            <div className="flex gap-2.5 mt-4">
              {Array.from({ length: Math.min(completions, 3) }).map((_, i) => (
                <span
                  key={i}
                  className="animate-star-pop"
                  style={{ fontSize: 36, animationDelay: `${i * 0.13}s` }}
                >
                  {masteryLevel >= 2 ? "🌟" : "⭐"}
                </span>
              ))}
            </div>

            <p
              className="mt-3 font-black text-center"
              style={{ fontSize: "clamp(16px, 4vw, 22px)", color: "var(--color-text)" }}
            >
              {phonics?.word}!
            </p>

            <button
              onClick={handleTryAgain}
              className="mt-5 font-black text-white rounded-2xl"
              style={{
                padding: "12px 32px",
                fontSize: "clamp(15px, 3.5vw, 18px)",
                background: `linear-gradient(135deg, ${color}, ${darken(color, 0.1)})`,
                boxShadow: `0 5px 20px ${color}55`,
                touchAction: "manipulation",
                border: "none",
                cursor: "pointer",
              }}
            >
              Try Again! 🚀
            </button>
          </div>
        )}
      </div>

      {/* ── Status pill ───────────────────────────────────────────────────── */}
      <div
        className="status-pill mt-3 mx-4"
        style={{ color: status.color }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>{status.icon}</span>
        <span>{status.text}</span>
      </div>

      {/* ── Brush picker ──────────────────────────────────────────────────── */}
      <div className="flex gap-2.5 mt-4 mx-4">
        <BrushPicker theme={brushTheme} onChange={setBrushTheme} />
      </div>

      {/* ── Progress row ──────────────────────────────────────────────────── */}
      <div
        className="glass-card flex items-center gap-3 mt-4 mx-4 px-5 py-3 w-full max-w-lg mb-4"
      >
        <span
          className="text-xs font-black uppercase tracking-widest flex-shrink-0"
          style={{ color: "var(--color-text-muted)" }}
        >
          Progress
        </span>

        <div className="flex gap-2 flex-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="transition-all duration-300"
              style={{
                fontSize: "clamp(18px, 4.5vw, 26px)",
                opacity: i < completions ? 1 : 0.15,
                lineHeight: 1,
              }}
            >
              {masteryLevel >= 2 ? "🌟" : "⭐"}
            </span>
          ))}
        </div>

        <span
          className="text-sm font-bold flex-shrink-0"
          style={{ color: "var(--color-text-muted)" }}
        >
          {completions >= 3 ? "Mastered! 🏆" : `${Math.min(completions, 3)}/3`}
        </span>
      </div>

      {/* ── Flash banner ──────────────────────────────────────────────────── */}
      {showBanner && (
        <div
          className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl font-black text-white animate-fade-in-up shadow-xl pointer-events-none"
          style={{
            fontSize: "clamp(14px, 3.5vw, 18px)",
            background: `linear-gradient(135deg, ${color}, ${darken(color, 0.08)})`,
            boxShadow: `0 6px 24px ${color}65`,
            whiteSpace: "nowrap",
          }}
        >
          {masteryLevel >= 2
            ? "🌟 Letter Mastered!"
            : `⭐ ${Math.min(completions, 3)}/3 Complete!`}
        </div>
      )}
    </div>
  );
}

function darken(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - Math.round(255 * a));
  const g = Math.max(0, ((n >>  8) & 0xff) - Math.round(255 * a));
  const b = Math.max(0, ( n        & 0xff) - Math.round(255 * a));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
