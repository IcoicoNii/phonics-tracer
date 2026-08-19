"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { dist, distToSegment } from "@/lib/geometry";
import type { LetterPath, Checkpoint } from "@/lib/letterPaths";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BrushTheme = "plain" | "neon" | "stars" | "paper";
export type TracePoint = { x: number; y: number };
export type EngineState = "demo" | "idle" | "tracing" | "paused" | "complete";

export type UseTracingEngineOptions = {
  letterPath: LetterPath;
  canvasWidth: number;
  canvasHeight: number;
  brushTheme: BrushTheme;
  onComplete: () => void;
  onCheckpointHit?: () => void;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const RAW_W = 300;
const RAW_H = 360;

// Demo animation: points per frame (lower = slower / more visible)
const DEMO_SPEED = 1.4;
// How long to pause between demo loops (ms)
const DEMO_PAUSE_MS = 900;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scalePoint(p: Checkpoint, sx: number, sy: number): TracePoint {
  return { x: p.x * sx, y: p.y * sy };
}

/** Interpolate points along a polyline for smooth demo drawing */
function buildSmoothPath(
  checkpoints: Checkpoint[],
  sx: number,
  sy: number,
  samplesPerSegment = 14
): TracePoint[] {
  const pts: TracePoint[] = [];
  for (let i = 0; i < checkpoints.length - 1; i++) {
    const a = checkpoints[i];
    const b = checkpoints[i + 1];
    for (let s = 0; s <= samplesPerSegment; s++) {
      const t = s / samplesPerSegment;
      pts.push({ x: (a.x + (b.x - a.x) * t) * sx, y: (a.y + (b.y - a.y) * t) * sy });
    }
  }
  return pts;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTracingEngine({
  letterPath,
  canvasWidth,
  canvasHeight,
  brushTheme,
  onComplete,
  onCheckpointHit,
}: UseTracingEngineOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const sx = canvasWidth / RAW_W;
  const sy = canvasHeight / RAW_H;

  // ── State refs (avoid re-render on every frame) ───────────────────────────
  const [engineState, setEngineStateR] = useState<EngineState>("demo");
  const engineStateRef = useRef<EngineState>("demo");

  const strokeIdxRef = useRef(0);
  const cpIdxRef = useRef(0);
  const trailRef = useRef<TracePoint[]>([]);
  const doneStrokesRef = useRef<TracePoint[][]>([]);
  const pointerDownRef = useRef(false);
  const fadeAlphaRef = useRef(1);
  const fadingRef = useRef(false);
  const guideFadeRef = useRef(1); // 1 = visible; fades out once user starts

  // Demo loop state
  const demoStrokePaths = useRef<TracePoint[][]>([]); // per-stroke smooth paths
  const demoStrokeIdx = useRef(0);   // which stroke we're currently animating
  const demoProgress = useRef(0);    // float index into current stroke's path
  const demoPauseUntil = useRef(0);  // timestamp to pause until
  const demoPhase = useRef<"drawing" | "fading">("drawing");
  const demoFadeAlpha = useRef(1);
  const demoVisibleStrokes = useRef<TracePoint[][]>([]); // completed strokes in demo

  const setState = (s: EngineState) => {
    engineStateRef.current = s;
    setEngineStateR(s);
  };

  // ── Pre-compute demo stroke paths ────────────────────────────────────────
  useEffect(() => {
    demoStrokePaths.current = letterPath.strokes.map((stroke) =>
      buildSmoothPath(stroke.checkpoints, sx, sy, 16)
    );
    // reset demo
    demoStrokeIdx.current = 0;
    demoProgress.current = 0;
    demoPhase.current = "drawing";
    demoFadeAlpha.current = 1;
    demoVisibleStrokes.current = [];
    demoPauseUntil.current = 0;
  }, [letterPath, sx, sy]);

  // ── Full engine reset ─────────────────────────────────────────────────────
  const reset = useCallback(() => {
    strokeIdxRef.current = 0;
    cpIdxRef.current = 0;
    trailRef.current = [];
    doneStrokesRef.current = [];
    pointerDownRef.current = false;
    fadeAlphaRef.current = 1;
    fadingRef.current = false;
    guideFadeRef.current = 1;

    demoStrokeIdx.current = 0;
    demoProgress.current = 0;
    demoPhase.current = "drawing";
    demoFadeAlpha.current = 1;
    demoVisibleStrokes.current = [];
    demoPauseUntil.current = 0;

    setState("demo");
  }, []);

  useEffect(() => { reset(); }, [letterPath, reset]);

  // ── Soft-reset (current stroke fades out) ────────────────────────────────
  const softReset = useCallback(() => {
    if (fadingRef.current) return;
    fadingRef.current = true;
    const startAlpha = fadeAlphaRef.current;
    const t0 = performance.now();
    const FADE_MS = 320;
    const fade = (now: number) => {
      const t = Math.min((now - t0) / FADE_MS, 1);
      fadeAlphaRef.current = startAlpha * (1 - t);
      if (t < 1) { requestAnimationFrame(fade); }
      else {
        trailRef.current = [];
        cpIdxRef.current = 0;
        fadeAlphaRef.current = 1;
        fadingRef.current = false;
        setState("idle");
      }
    };
    requestAnimationFrame(fade);
  }, []);

  // ── Pointer handlers ──────────────────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      // Convert CSS-pixel position to internal canvas coordinate space.
      const canvasFromCssX = canvasWidth  / rect.width;
      const canvasFromCssY = canvasHeight / rect.height;
      const x = (e.clientX - rect.left) * canvasFromCssX;
      const y = (e.clientY - rect.top)  * canvasFromCssY;

      // cssScaleX: how many CSS px equal 1 canvas unit on this device.
      // Used to normalise hitRadius/resetThreshold to physical pixels.
      // e.g. if canvas is 380px CSS wide and 300 canvas units: cssScaleX = 380/300 ≈ 1.27
      //      a hitRadius of 34 canvas units => 43 CSS px on this device (always reasonable).
      const cssScaleX = rect.width / canvasWidth;

      // Any tap during demo skips it
      if (engineStateRef.current === "demo") {
        setState("idle");
        strokeIdxRef.current = 0;
        cpIdxRef.current = 0;
        trailRef.current = [];
        doneStrokesRef.current = [];
        guideFadeRef.current = 1;
        return;
      }
      if (engineStateRef.current === "complete") return;

      pointerDownRef.current = true;
      guideFadeRef.current = 0;

      if (engineStateRef.current === "paused") {
        const stroke = letterPath.strokes[strokeIdxRef.current];
        const lastCp = stroke?.checkpoints[cpIdxRef.current];
        if (lastCp) {
          const lp = scalePoint(lastCp, sx, sy);
          // Resume zone: hitRadius converted to canvas units at the actual CSS size,
          // keeping at least 44 CSS px, then expanded 2.5× for comfort.
          const cssScaleXD = Math.min(2, Math.max(0.5, rect.width / canvasWidth));
          const resumeCssPx = Math.max(stroke.hitRadius * cssScaleXD, 44) * 2.5;
          const resumeR = resumeCssPx / cssScaleXD; // canvas units
          if (dist(x, y, lp.x, lp.y) < resumeR) {
            setState("tracing");
          } else {
            softReset();
          }
        }
        return;
      }
      setState("tracing");
    },
    [letterPath, sx, sy, canvasWidth, canvasHeight, softReset]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!pointerDownRef.current || engineStateRef.current !== "tracing") return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      // Convert CSS-pixel event position → internal canvas coordinate space.
      const canvasFromCssX = canvasWidth  / rect.width;
      const canvasFromCssY = canvasHeight / rect.height;
      const x = (e.clientX - rect.left) * canvasFromCssX;
      const y = (e.clientY - rect.top)  * canvasFromCssY;

      // cssScaleX: CSS pixels per canvas unit on this screen.
      // Multiplying a canvas-unit distance by cssScaleX gives the
      // equivalent physical distance in CSS pixels.
      //
      // We use this to keep hitRadius and resetThreshold in CSS px terms
      // so the tolerance is consistent regardless of the canvas CSS size:
      //   • Small phone (200px CSS canvas) → cssScaleX ≈ 0.67
      //     hitRadius 34 canvas units × 0.67 ≈ 23 CSS px  ← too small!
      //   • iPad (500px CSS canvas)       → cssScaleX ≈ 1.67
      //     hitRadius 34 canvas units × 1.67 ≈ 57 CSS px  ← comfortable
      //
      // To normalise: keep the threshold at a fixed CSS-px target
      // (e.g. 40px hit, 60px reset) and convert BACK to canvas units.
      //
      // TARGET_HIT_PX and TARGET_RESET_PX are physical target sizes.
      // We clamp cssScaleX to [0.5, 2] to avoid extreme values.
      const cssScaleX = Math.min(2, Math.max(0.5, rect.width / canvasWidth));


      trailRef.current = [...trailRef.current, { x, y }];

      const stroke = letterPath.strokes[strokeIdxRef.current];
      if (!stroke) return;

      const cpIdx = cpIdxRef.current;
      const nextCp = stroke.checkpoints[cpIdx + 1];
      if (!nextCp) return;

      const np = scalePoint(nextCp, sx, sy);

      // Scale hitRadius so the physical touch zone is at least 44 CSS px
      // regardless of canvas size. If the canvas is 300px wide and hitRadius
      // is 34, that's already fine on a 300px CSS canvas. On a 180px canvas
      // it would be 20px — too small. The corrected value keeps it physical.
      const hitCssPx   = Math.max(stroke.hitRadius   * cssScaleX, 44);
      const hitR       = hitCssPx / cssScaleX; // back to canvas units

      if (dist(x, y, np.x, np.y) < hitR) {
        cpIdxRef.current += 1;
        onCheckpointHit?.();

        if (cpIdxRef.current >= stroke.checkpoints.length - 1) {
          // Stroke complete
          doneStrokesRef.current = [...doneStrokesRef.current, [...trailRef.current]];
          trailRef.current = [];
          cpIdxRef.current = 0;
          strokeIdxRef.current += 1;

          if (strokeIdxRef.current >= letterPath.strokes.length) {
            setState("complete");
            onComplete();
          } else {
            setState("idle");
            pointerDownRef.current = false;
          }
          return;
        }
      }

      // Stray detection — keep reset zone at least 62 CSS px wide.
      const resetCssPx = Math.max(stroke.resetThreshold * cssScaleX, 62);
      const resetR     = resetCssPx / cssScaleX; // back to canvas units
      const cp         = scalePoint(stroke.checkpoints[cpIdx], sx, sy);
      const segDist    = distToSegment(x, y, cp.x, cp.y, np.x, np.y);
      if (segDist > resetR && !fadingRef.current) {
        softReset();
      }
    },
    [letterPath, sx, sy, canvasWidth, canvasHeight, onComplete, onCheckpointHit, softReset]
  );


  function stroke_reset_css(s: typeof letterPath.strokes[0] | undefined) { return s ? s.resetThreshold : 62; }

  const handlePointerUp = useCallback(() => {
    if (!pointerDownRef.current) return;
    pointerDownRef.current = false;
    if (engineStateRef.current === "tracing") setState("paused");
  }, []);

  // ── Render loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // ── Soft paper background ──────────────────────────────────────────────
      ctx.save();
      ctx.fillStyle = brushTheme === "paper" ? "#FFFEF8" : "#FEFCF8";
      roundRect(ctx, 0, 0, canvasWidth, canvasHeight, 0);
      ctx.fill();

      if (brushTheme === "paper") {
        // ── Ruled handwriting paper lines (blue–red–blue) ──────────────────
        // Standard 4-line handwriting paper:
        //   - Top line (blue)       — ascender line
        //   - Mid-upper line (red)  — dotted midline / x-height
        //   - Mid-lower line (blue) — baseline
        //   - Bottom line (blue)    — descender line
        // We repeat this pattern vertically across the canvas.
        const rowH  = 60 * sy;          // height of one ruled set
        const rows  = Math.ceil(canvasHeight / rowH) + 1;
        const startY = (canvasHeight % rowH) / 2; // center the pattern

        for (let r = 0; r < rows; r++) {
          const base = startY + r * rowH;

          // Descender line (blue, faint)
          drawRuledLine(ctx, 0, base + rowH, canvasWidth, "#9AC0E8", 0.9, 1.1 * sx, false);
          // Baseline (blue, strong)
          drawRuledLine(ctx, 0, base + rowH * 0.67, canvasWidth, "#5A9FD4", 1.0, 1.5 * sx, false);
          // Midline (red, dashed)
          drawRuledLine(ctx, 0, base + rowH * 0.33, canvasWidth, "#E05A6A", 0.85, 1.1 * sx, true);
          // Top / ascender line (blue, faint)
          drawRuledLine(ctx, 0, base, canvasWidth, "#9AC0E8", 0.75, 1.0 * sx, false);
        }

        // Left margin red vertical line
        const marginX = 28 * sx;
        ctx.save();
        ctx.globalAlpha = 0.45;
        ctx.strokeStyle = "#E05A6A";
        ctx.lineWidth = 1.5 * sx;
        ctx.beginPath();
        ctx.moveTo(marginX, 0);
        ctx.lineTo(marginX, canvasHeight);
        ctx.stroke();
        ctx.restore();

      } else {
        // Subtle dot grid (default)
        ctx.globalAlpha = 0.06;
        ctx.fillStyle = "#8B8BA8";
        const GRID = 22 * sx;
        for (let gx = GRID; gx < canvasWidth - GRID * 0.5; gx += GRID) {
          for (let gy = GRID; gy < canvasHeight - GRID * 0.5; gy += GRID) {
            ctx.beginPath();
            ctx.arc(gx, gy, 1.5 * sx, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();

      const state = engineStateRef.current;
      const strokes = letterPath.strokes;
      const sIdx = strokeIdxRef.current;

      // ── 1. Guide paths (dashed track) ─────────────────────────────────────
      strokes.forEach((stroke, i) => {
        const isDone = i < sIdx;
        const isCurrent = i === sIdx;

        // Hollow tube track
        const trackW = 28 * sx;
        const a = isDone ? 0.06 : isCurrent ? 0.14 : 0.10;

        ctx.save();
        ctx.globalAlpha = a;
        ctx.strokeStyle = isCurrent ? "#FF8C42" : "#A0A0C0";
        ctx.lineWidth = trackW;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        stroke.checkpoints.forEach((cp, j) => {
          const p = scalePoint(cp, sx, sy);
          if (j === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        // Inner dashed line
        ctx.globalAlpha = isCurrent ? 0.22 : 0.08;
        ctx.strokeStyle = isCurrent ? "#FF8C42" : "#8B8BA8";
        ctx.lineWidth = 2.5 * sx;
        ctx.setLineDash([7 * sx, 7 * sx]);
        ctx.beginPath();
        stroke.checkpoints.forEach((cp, j) => {
          const p = scalePoint(cp, sx, sy);
          if (j === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      });

      // ── 2. Directional arrows (multiple per stroke) ───────────────────────
      if (
        guideFadeRef.current > 0.01 &&
        (state === "idle" || state === "tracing" || state === "paused")
      ) {
        const stroke = strokes[sIdx];
        if (stroke && stroke.checkpoints.length >= 2) {
          const cps = stroke.checkpoints;
          const arrowAlpha = guideFadeRef.current;
          // Place arrows at ~every 2 segments, skip first and last
          for (let ai = 1; ai < cps.length - 1; ai += 2) {
            const from = scalePoint(cps[ai - 1], sx, sy);
            const to   = scalePoint(cps[ai],     sx, sy);
            // Animated pulsing: offset each arrow's phase
            const phase = (now * 0.0025 + ai * 0.6) % (Math.PI * 2);
            const pulse = 0.55 + 0.45 * Math.sin(phase);
            drawArrow(ctx, from, to, arrowAlpha * pulse * 0.85, sx);
          }
          // Always draw one arrow in the middle if only short path
          if (cps.length === 2) {
            const from = scalePoint(cps[0], sx, sy);
            const to   = scalePoint(cps[1], sx, sy);
            const pulse = 0.55 + 0.45 * Math.sin(now * 0.0025);
            drawArrow(ctx, from, to, guideFadeRef.current * pulse, sx);
          }
        }
      }

      // ── 3. Completed strokes ───────────────────────────────────────────────
      doneStrokesRef.current.forEach((pts) => {
        if (pts.length >= 2) drawTrail(ctx, pts, brushTheme, 1, sx);
      });

      // ── 4. Active trail ────────────────────────────────────────────────────
      if (trailRef.current.length >= 2) {
        drawTrail(ctx, trailRef.current, brushTheme, fadeAlphaRef.current, sx);
      }

      // ── 5. Start dot (green pulsing) ───────────────────────────────────────
      if (
        guideFadeRef.current > 0.01 &&
        (state === "idle" || state === "tracing" || state === "paused")
      ) {
        const stroke = strokes[sIdx];
        if (stroke) {
          const sp = scalePoint(stroke.checkpoints[0], sx, sy);
          const pulse = 0.72 + 0.28 * Math.sin(now * 0.005);
          drawStartDot(ctx, sp, pulse, guideFadeRef.current, sx);
        }
      }

      // ── 6. Resume dot (amber) ──────────────────────────────────────────────
      if (state === "paused") {
        const stroke = strokes[sIdx];
        if (stroke) {
          const lastCp = stroke.checkpoints[cpIdxRef.current];
          if (lastCp) {
            const lp = scalePoint(lastCp, sx, sy);
            const pulse = 0.72 + 0.28 * Math.sin(now * 0.006);
            drawResumeDot(ctx, lp, pulse, sx);
          }
        }
      }

      // ── 7. Demo animation ──────────────────────────────────────────────────
      if (state === "demo") {
        const allPaths = demoStrokePaths.current;
        if (allPaths.length === 0) {
          rafRef.current = requestAnimationFrame(draw);
          return;
        }

        if (demoPhase.current === "fading") {
          // Fade out all drawn strokes
          const alpha = demoFadeAlpha.current;
          if (alpha > 0) {
            allPaths.slice(0, demoStrokeIdx.current + 1).forEach((_, i) => {
              const pts = demoVisibleStrokes.current[i];
              if (pts && pts.length >= 2) {
                drawDemoTrail(ctx, pts, alpha);
              }
            });
            demoFadeAlpha.current = Math.max(0, alpha - 0.018);
          } else {
            // Reset for next loop
            demoStrokeIdx.current = 0;
            demoProgress.current = 0;
            demoPhase.current = "drawing";
            demoFadeAlpha.current = 1;
            demoVisibleStrokes.current = [];
            demoPauseUntil.current = now + DEMO_PAUSE_MS;
          }
          rafRef.current = requestAnimationFrame(draw);
          return;
        }

        // Pause between loop iterations
        if (now < demoPauseUntil.current) {
          rafRef.current = requestAnimationFrame(draw);
          return;
        }

        const strokePath = allPaths[demoStrokeIdx.current];
        if (!strokePath) { rafRef.current = requestAnimationFrame(draw); return; }

        // Draw all completed demo strokes
        for (let i = 0; i < demoStrokeIdx.current; i++) {
          const pts = demoVisibleStrokes.current[i];
          if (pts && pts.length >= 2) drawDemoTrail(ctx, pts, demoFadeAlpha.current);
        }

        // Advance current stroke
        demoProgress.current = Math.min(
          demoProgress.current + DEMO_SPEED,
          strokePath.length - 1
        );
        const visLen = Math.floor(demoProgress.current) + 1;
        const visiblePts = strokePath.slice(0, visLen);

        if (visiblePts.length >= 2) drawDemoTrail(ctx, visiblePts, demoFadeAlpha.current);

        // Animated pencil cursor at the tip
        const tip = visiblePts[visiblePts.length - 1];
        if (tip) {
          drawPencilCursor(ctx, tip, now, sx);
        }

        // Stroke done → move to next
        if (demoProgress.current >= strokePath.length - 1) {
          // Store completed path
          const stored = [...demoVisibleStrokes.current];
          stored[demoStrokeIdx.current] = [...visiblePts];
          demoVisibleStrokes.current = stored;

          if (demoStrokeIdx.current < allPaths.length - 1) {
            demoStrokeIdx.current += 1;
            demoProgress.current = 0;
            demoPauseUntil.current = now + 380; // brief pause between strokes
          } else {
            // All strokes done — start fade
            demoPhase.current = "fading";
          }
        }
      }

      // ── 8. Completion overlay ──────────────────────────────────────────────
      // (handled in React JSX overlay, not canvas)

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [letterPath, canvasWidth, canvasHeight, brushTheme, sx, sy]);

  return {
    canvasRef,
    engineState,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    reset,
    strokeIndex: strokeIdxRef.current,
    totalStrokes: letterPath.strokes.length,
  };
}

// ─── Drawing helpers ──────────────────────────────────────────────────────────

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/** User trail rendering (3 brush themes) */
function drawTrail(
  ctx: CanvasRenderingContext2D,
  pts: TracePoint[],
  theme: BrushTheme,
  alpha: number,
  sx: number
) {
  if (pts.length < 2) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (theme === "plain") {
    // Rich indigo with subtle glow
    ctx.strokeStyle = "#4F46E5";
    ctx.lineWidth = 11 * sx;
    ctx.shadowColor = "#818CF8";
    ctx.shadowBlur = 8;
    tracePath(ctx, pts);

    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 3.5 * sx;
    ctx.shadowBlur = 0;
    tracePath(ctx, pts);

  } else if (theme === "neon") {
    // Outer glow
    ctx.strokeStyle = "#22D3EE";
    ctx.lineWidth = 14 * sx;
    ctx.shadowColor = "#06B6D4";
    ctx.shadowBlur = 22;
    tracePath(ctx, pts);
    // Core line
    ctx.strokeStyle = "#67E8F9";
    ctx.lineWidth = 6 * sx;
    ctx.shadowBlur = 12;
    tracePath(ctx, pts);
    // White center
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2.5 * sx;
    ctx.shadowBlur = 0;
    tracePath(ctx, pts);

  } else if (theme === "stars") {
    // Dotted gold line + star emojis
    ctx.strokeStyle = "rgba(251,191,36,0.6)";
    ctx.lineWidth = 5 * sx;
    ctx.setLineDash([6 * sx, 4 * sx]);
    tracePath(ctx, pts);
    ctx.setLineDash([]);

    ctx.font = `${Math.round(15 * sx)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const step = Math.max(1, Math.floor(pts.length / 20));
    for (let i = 0; i < pts.length; i += step) {
      ctx.fillText("⭐", pts[i].x, pts[i].y);
    }
  } else if (theme === "paper") {
    // Pencil on ruled paper — soft grey with slight texture
    ctx.strokeStyle = "rgba(60, 60, 80, 0.82)";
    ctx.lineWidth = 9 * sx;
    ctx.shadowColor = "rgba(60,60,80,0.18)";
    ctx.shadowBlur = 3;
    tracePath(ctx, pts);
    // Fine highlight to mimic pencil sheen
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 2.5 * sx;
    ctx.shadowBlur = 0;
    tracePath(ctx, pts);
  }
  ctx.restore();
}

function drawDemoTrail(
  ctx: CanvasRenderingContext2D,
  pts: TracePoint[],
  alpha: number
) {
  if (pts.length < 2) return;
  ctx.save();
  ctx.globalAlpha = alpha * 0.72;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Wide soft trail
  ctx.strokeStyle = "#A78BFA";
  ctx.lineWidth = 13;
  ctx.shadowColor = "#7C3AED";
  ctx.shadowBlur = 16;
  tracePath(ctx, pts);

  // White center
  ctx.strokeStyle = "#F5F3FF";
  ctx.lineWidth = 5;
  ctx.shadowBlur = 0;
  tracePath(ctx, pts);

  ctx.restore();
}

function tracePath(ctx: CanvasRenderingContext2D, pts: TracePoint[]) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
}

/** Animated pencil cursor for demo mode */
function drawPencilCursor(
  ctx: CanvasRenderingContext2D,
  tip: TracePoint,
  now: number,
  sx: number
) {
  const bob = Math.sin(now * 0.008) * 2 * sx;
  ctx.save();
  // Outer ring
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.arc(tip.x, tip.y + bob, 9 * sx, 0, Math.PI * 2);
  ctx.strokeStyle = "#7C3AED";
  ctx.lineWidth = 2 * sx;
  ctx.shadowColor = "#7C3AED";
  ctx.shadowBlur = 10;
  ctx.stroke();
  // Inner dot
  ctx.beginPath();
  ctx.arc(tip.x, tip.y + bob, 4 * sx, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "#A78BFA";
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();
}

/** Pulsing green start dot */
function drawStartDot(
  ctx: CanvasRenderingContext2D,
  sp: TracePoint,
  pulse: number,
  alpha: number,
  sx: number
) {
  ctx.save();
  // Expanding ring
  ctx.globalAlpha = alpha * 0.3 * (1 - pulse * 0.3);
  ctx.beginPath();
  ctx.arc(sp.x, sp.y, 28 * sx * (0.8 + pulse * 0.4), 0, Math.PI * 2);
  ctx.fillStyle = "#3DD68C";
  ctx.fill();
  // Glow ring
  ctx.globalAlpha = alpha * 0.55;
  ctx.beginPath();
  ctx.arc(sp.x, sp.y, 18 * sx * pulse, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(61, 214, 140, 0.4)";
  ctx.fill();
  // Solid dot
  ctx.globalAlpha = alpha * 0.95;
  ctx.beginPath();
  ctx.arc(sp.x, sp.y, 13 * sx, 0, Math.PI * 2);
  ctx.fillStyle = "#3DD68C";
  ctx.shadowColor = "#3DD68C";
  ctx.shadowBlur = 16;
  ctx.fill();
  // White inner
  ctx.beginPath();
  ctx.arc(sp.x, sp.y, 5 * sx, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowBlur = 0;
  ctx.fill();
  ctx.restore();
}

/** Pulsing amber resume dot */
function drawResumeDot(
  ctx: CanvasRenderingContext2D,
  lp: TracePoint,
  pulse: number,
  sx: number
) {
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.arc(lp.x, lp.y, 24 * sx * pulse, 0, Math.PI * 2);
  ctx.fillStyle = "#FF8C42";
  ctx.fill();

  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.arc(lp.x, lp.y, 13 * sx, 0, Math.PI * 2);
  ctx.fillStyle = "#FF8C42";
  ctx.shadowColor = "#FF8C42";
  ctx.shadowBlur = 14;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(lp.x, lp.y, 5 * sx, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowBlur = 0;
  ctx.fill();
  ctx.restore();
}

/**
 * Draw a solid filled arrow-head between two points.
 * Placed at the midpoint of the segment, pointing in the direction of travel.
 */
function drawArrow(
  ctx: CanvasRenderingContext2D,
  from: TracePoint,
  to: TracePoint,
  alpha: number,
  sx: number
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx);
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;

  const L = 14 * sx; // arrow length
  const W = 8  * sx; // arrow half-width

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(mx, my);
  ctx.rotate(angle);

  // Arrow body line
  ctx.strokeStyle = "#FF8C42";
  ctx.lineWidth = 3.5 * sx;
  ctx.lineCap = "round";
  ctx.shadowColor = "#FF8C42";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(-L * 0.5, 0);
  ctx.lineTo(L * 0.5, 0);
  ctx.stroke();

  // Filled arrowhead
  ctx.fillStyle = "#FF8C42";
  ctx.beginPath();
  ctx.moveTo(L * 0.5, 0);
  ctx.lineTo(L * 0.5 - W, -W * 0.65);
  ctx.lineTo(L * 0.5 - W * 0.4, 0);
  ctx.lineTo(L * 0.5 - W, W * 0.65);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/** Draws a single horizontal ruled line (blue or red, optionally dashed) */
function drawRuledLine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  color: string,
  alpha: number,
  lineWidth: number,
  dashed: boolean
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "square";
  if (dashed) ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
