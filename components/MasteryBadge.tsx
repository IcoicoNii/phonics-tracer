"use client";

type Level = 0 | 1 | 2;

export default function MasteryBadge({ level }: { level: Level }) {
  if (level === 0) {
    return (
      <span
        className="text-sm leading-none opacity-25"
        aria-label="Not yet started"
      >
        ☆
      </span>
    );
  }
  if (level === 1) {
    return (
      <span
        className="text-sm leading-none"
        style={{ filter: "grayscale(0.3)" }}
        aria-label="Partially mastered"
      >
        ⭐
      </span>
    );
  }
  return (
    <span
      className="text-sm leading-none animate-star-pop"
      aria-label="Mastered!"
    >
      🌟
    </span>
  );
}
