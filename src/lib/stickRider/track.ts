import type { Point } from "@/lib/stickRider/types";

/** Gap regions — no rideable surface between startX and endX (fall = crash below pitY). */
export type TrackGap = {
  startX: number;
  endX: number;
  pitY: number;
};

/**
 * Varied stunt track — uneven spacing, mixed jump sizes, gaps, steep takeoffs.
 * Control points are NOT evenly spaced; y values create bumps, ramps, and launch lips.
 */
export const CYBER_RIDER_TRACK: Point[] = [
  { x: 0, y: 520 },
  { x: 200, y: 520 },
  { x: 380, y: 512 },
  { x: 520, y: 505 },
  { x: 680, y: 498 },
  { x: 820, y: 478 },
  { x: 900, y: 455 },
  { x: 960, y: 430 },
  { x: 1020, y: 468 },
  { x: 1180, y: 490 },
  { x: 1320, y: 475 },
  { x: 1450, y: 440 },
  { x: 1520, y: 395 },
  { x: 1580, y: 360 },
  { x: 1640, y: 410 },
  { x: 1780, y: 455 },
  { x: 1920, y: 448 },
  { x: 2080, y: 420 },
  { x: 2220, y: 390 },
  { x: 2340, y: 340 },
  { x: 2420, y: 300 },
  { x: 2500, y: 355 },
  { x: 2680, y: 420 },
  { x: 2860, y: 405 },
  { x: 3020, y: 370 },
  { x: 3180, y: 330 },
  { x: 3280, y: 280 },
  { x: 3360, y: 250 },
  { x: 3440, y: 310 },
  { x: 3580, y: 390 },
  { x: 3720, y: 410 },
  { x: 3880, y: 395 },
  { x: 4040, y: 360 },
  { x: 4180, y: 320 },
  { x: 4280, y: 270 },
  { x: 4360, y: 320 },
  { x: 4520, y: 400 },
  { x: 4680, y: 430 },
  { x: 4860, y: 445 },
  { x: 5040, y: 455 },
  { x: 5200, y: 455 },
  { x: 5600, y: 455 },
];

export const CYBER_RIDER_GAPS: TrackGap[] = [
  { startX: 1650, endX: 1820, pitY: 900 },
  { startX: 3780, endX: 3960, pitY: 900 },
];

export function isInGap(x: number, gaps: TrackGap[] = CYBER_RIDER_GAPS): TrackGap | null {
  for (const gap of gaps) {
    if (x >= gap.startX && x <= gap.endX) return gap;
  }
  return null;
}

export function terrainYAt(track: Point[], x: number, gaps: TrackGap[] = CYBER_RIDER_GAPS): number {
  const gap = isInGap(x, gaps);
  if (gap) return gap.pitY;

  if (x <= track[0].x) return track[0].y;
  const last = track[track.length - 1];
  if (x >= last.x) return last.y;

  for (let i = 0; i < track.length - 1; i++) {
    const a = track[i];
    const b = track[i + 1];
    if (x >= a.x && x <= b.x) {
      const span = Math.max(1, b.x - a.x);
      const t = (x - a.x) / span;
      const smooth = t * t * (3 - 2 * t);
      return a.y + (b.y - a.y) * smooth;
    }
  }

  return last.y;
}

export function terrainSlopeAt(track: Point[], x: number, gaps: TrackGap[] = CYBER_RIDER_GAPS): number {
  if (isInGap(x, gaps)) {
    const left = terrainYAt(track, x - 12, gaps);
    const right = terrainYAt(track, x + 12, gaps);
    return Math.atan2(right - left, 24);
  }
  const delta = 10;
  const y1 = terrainYAt(track, x - delta, gaps);
  const y2 = terrainYAt(track, x + delta, gaps);
  return Math.atan2(y2 - y1, delta * 2);
}

/** Approximate track progress 0–1 for HUD */
export function trackProgress(track: Point[], x: number): number {
  const start = track[0].x;
  const end = 5200;
  return Math.max(0, Math.min(1, (x - start) / (end - start)));
}
