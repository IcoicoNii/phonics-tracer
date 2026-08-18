"use client";

import { useCallback, useRef } from "react";

export type SFXType = "checkpoint" | "complete" | "reset";

const AUDIO_CONTEXT_KEY = "__phonics_audio_ctx__";
declare global {
  interface Window { [AUDIO_CONTEXT_KEY]?: AudioContext; }
}

function getCtx(): AudioContext {
  if (!window[AUDIO_CONTEXT_KEY]) {
    window[AUDIO_CONTEXT_KEY] = new AudioContext();
  }
  return window[AUDIO_CONTEXT_KEY]!;
}

function tone(
  ctx: AudioContext,
  freq: number,
  dur: number,
  type: OscillatorType = "sine",
  vol = 0.25
) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + dur);
}

export function useAudio() {
  const unlockedRef = useRef(false);

  const unlock = useCallback(() => {
    if (unlockedRef.current || typeof window === "undefined") return;
    try {
      const ctx = getCtx();
      if (ctx.state === "suspended") ctx.resume();
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
      unlockedRef.current = true;
    } catch { /* no-op */ }
  }, []);

  /** Play a short synthesized SFX (no voice) */
  const playSFX = useCallback((type: SFXType) => {
    try {
      unlock();
      const ctx = getCtx();
      if (type === "checkpoint") {
        tone(ctx, 720, 0.1, "sine", 0.18);
      } else if (type === "complete") {
        tone(ctx, 523, 0.14, "sine", 0.22);
        setTimeout(() => tone(ctx, 659, 0.14, "sine", 0.22), 120);
        setTimeout(() => tone(ctx, 784, 0.25, "sine", 0.26), 240);
        setTimeout(() => tone(ctx, 1047, 0.38, "sine", 0.30), 400);
      } else if (type === "reset") {
        tone(ctx, 260, 0.18, "triangle", 0.12);
      }
    } catch { /* no-op */ }
  }, [unlock]);

  return { unlock, playSFX };
}
