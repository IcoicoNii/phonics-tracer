"use client";

import type { BrushTheme } from "@/hooks/useTracingEngine";

type Props = {
  theme: BrushTheme;
  onChange: (t: BrushTheme) => void;
};

const THEMES: { id: BrushTheme; label: string; icon: string }[] = [
  { id: "plain",  label: "Pen",   icon: "✏️" },
  { id: "neon",   label: "Neon",  icon: "💡" },
  { id: "stars",  label: "Stars", icon: "⭐" },
  { id: "paper",  label: "Paper", icon: "📄" },
];

export default function BrushPicker({ theme, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          aria-label={`Brush: ${t.label}`}
          className={`brush-btn ${theme === t.id ? "active" : ""}`}
        >
          <span className="text-2xl leading-none">{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
