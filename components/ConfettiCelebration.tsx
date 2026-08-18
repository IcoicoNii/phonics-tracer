"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export default function ConfettiCelebration({ trigger }: { trigger: boolean }) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!trigger || firedRef.current) return;
    firedRef.current = true;

    const duration = 2000;
    const end = Date.now() + duration;

    const burst = () => {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { x: 0.3, y: 0.5 },
        colors: ["#FBBF24", "#34D399", "#60A5FA", "#F9A8D4", "#FCA5A5"],
        startVelocity: 28,
        gravity: 0.9,
        scalar: 1.1,
      });
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { x: 0.7, y: 0.5 },
        colors: ["#FBBF24", "#34D399", "#60A5FA", "#F9A8D4", "#A5B4FC"],
        startVelocity: 28,
        gravity: 0.9,
        scalar: 1.1,
      });
      if (Date.now() < end) setTimeout(burst, 250);
    };
    burst();
  }, [trigger]);

  return null;
}
