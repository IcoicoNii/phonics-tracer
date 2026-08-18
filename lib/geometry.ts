// Geometry utilities for the tracing engine

/** Euclidean distance between two points */
export function dist(
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  return Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);
}

/**
 * Shortest distance from point (px, py) to the
 * line segment (ax, ay) → (bx, by).
 */
export function distToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return dist(px, py, ax, ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return dist(px, py, ax + t * dx, ay + t * dy);
}

/**
 * Sample N evenly-spaced points along a polyline defined by checkpoints.
 * Used for drawing the guide path.
 */
export function samplePath(
  checkpoints: { x: number; y: number }[],
  samples: number
): { x: number; y: number }[] {
  if (checkpoints.length < 2) return checkpoints;
  const result: { x: number; y: number }[] = [];
  const segs = checkpoints.length - 1;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const raw = t * segs;
    const seg = Math.min(Math.floor(raw), segs - 1);
    const u = raw - seg;
    const a = checkpoints[seg];
    const b = checkpoints[seg + 1];
    result.push({ x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u });
  }
  return result;
}

/** Linearly interpolate between two values */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
