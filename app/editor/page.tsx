"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ALPHABET } from "@/lib/phonics";

type Point = { x: number; y: number };
type Stroke = { points: Point[] };

const CANVAS_W = 300;
const CANVAS_H = 360;

export default function EditorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [caseMode, setCaseMode] = useState<"upper" | "lower">("upper");
  const [strokes, setStrokes] = useState<Stroke[]>([{ points: [] }]);
  const [activeStroke, setActiveStroke] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background letter guide
    ctx.save();
    ctx.font = "bold 280px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = "#1E1B4B";
    ctx.fillText(
      caseMode === "upper" ? selectedLetter : selectedLetter.toLowerCase(),
      CANVAS_W / 2,
      CANVAS_H / 2
    );
    ctx.restore();

    // Draw all strokes
    const COLORS = ["#4F46E5", "#EF4444", "#16A34A", "#D97706"];
    strokes.forEach((stroke, si) => {
      const color = COLORS[si % COLORS.length];
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      stroke.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      stroke.points.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, i === 0 ? 8 : 5, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? "#34D399" : color;
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(i + 1), p.x, p.y);
      });
      ctx.restore();
    });
  }, [strokes, selectedLetter, caseMode]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);

    setStrokes((prev) => {
      const next = [...prev];
      next[activeStroke] = {
        points: [...(next[activeStroke]?.points ?? []), { x, y }],
      };
      return next;
    });
  };

  const addStroke = () => {
    setStrokes((prev) => [...prev, { points: [] }]);
    setActiveStroke((prev) => prev + 1);
  };

  const removeLastPoint = () => {
    setStrokes((prev) => {
      const next = [...prev];
      const pts = [...(next[activeStroke]?.points ?? [])];
      pts.pop();
      next[activeStroke] = { points: pts };
      return next;
    });
  };

  const clearAll = () => {
    setStrokes([{ points: [] }]);
    setActiveStroke(0);
  };

  const exportJSON = () => {
    const letter = caseMode === "upper" ? selectedLetter : selectedLetter.toLowerCase();
    const json = {
      letter,
      case: caseMode === "upper" ? "uppercase" : "lowercase",
      strokes: strokes.map((s, i) => ({
        id: i + 1,
        label: `Stroke ${i + 1}`,
        checkpoints: s.points,
        hitRadius: 30,
        resetThreshold: 45,
      })),
    };
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${letter}_path.json`;
    a.click();
  };

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--color-bg)" }}>
      <h1 className="text-xl font-black mb-4 text-[var(--color-text)]">
        🛠️ Checkpoint Editor (Dev Tool)
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        Click on the canvas to place checkpoints. Each colored stroke is a separate drawing stroke.
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        {/* Letter selector */}
        <select
          value={selectedLetter}
          onChange={(e) => { setSelectedLetter(e.target.value); clearAll(); }}
          className="px-3 py-2 rounded-xl border font-bold"
        >
          {ALPHABET.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        {/* Case */}
        <button
          onClick={() => setCaseMode(caseMode === "upper" ? "lower" : "upper")}
          className="px-4 py-2 rounded-xl bg-white border font-bold"
        >
          {caseMode === "upper" ? "Uppercase" : "Lowercase"}
        </button>

        {/* Active stroke */}
        <select
          value={activeStroke}
          onChange={(e) => setActiveStroke(Number(e.target.value))}
          className="px-3 py-2 rounded-xl border font-bold"
        >
          {strokes.map((_, i) => <option key={i} value={i}>Stroke {i + 1}</option>)}
        </select>

        <button onClick={addStroke} className="px-4 py-2 rounded-xl bg-indigo-100 font-bold text-indigo-700 hover:bg-indigo-200">
          + Add Stroke
        </button>
        <button onClick={removeLastPoint} className="px-4 py-2 rounded-xl bg-red-100 font-bold text-red-700 hover:bg-red-200">
          ← Undo Point
        </button>
        <button onClick={clearAll} className="px-4 py-2 rounded-xl bg-gray-100 font-bold text-gray-700 hover:bg-gray-200">
          Clear
        </button>
        <button onClick={exportJSON} className="px-4 py-2 rounded-xl bg-green-500 font-bold text-white hover:bg-green-600">
          ⬇ Export JSON
        </button>
      </div>

      <div className="flex gap-6 flex-wrap">
        {/* Canvas */}
        <div className="border-2 border-gray-300 rounded-2xl overflow-hidden shadow">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            onClick={handleCanvasClick}
            style={{ display: "block", width: 300, height: 360, cursor: "crosshair" }}
          />
        </div>

        {/* JSON preview */}
        <div className="flex-1 min-w-[280px]">
          <p className="text-xs font-bold mb-2 text-[var(--color-text-muted)] uppercase tracking-wider">
            Live JSON Preview
          </p>
          <pre className="bg-white rounded-xl p-3 text-xs overflow-auto max-h-96 border shadow-inner">
            {JSON.stringify(
              {
                letter: caseMode === "upper" ? selectedLetter : selectedLetter.toLowerCase(),
                case: caseMode === "upper" ? "uppercase" : "lowercase",
                strokes: strokes.map((s, i) => ({
                  id: i + 1,
                  label: `Stroke ${i + 1}`,
                  checkpoints: s.points,
                  hitRadius: 30,
                  resetThreshold: 45,
                })),
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
