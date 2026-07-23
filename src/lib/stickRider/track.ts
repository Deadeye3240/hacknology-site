import type { Point } from "@/lib/stickRider/types";

/** Single stunt track — hills, dips, and a finish gate. */
export const CYBER_RIDER_TRACK: Point[] = [
  { x: 0, y: 500 },
  { x: 180, y: 500 },
  { x: 360, y: 470 },
  { x: 520, y: 495 },
  { x: 720, y: 430 },
  { x: 920, y: 390 },
  { x: 1120, y: 455 },
  { x: 1320, y: 440 },
  { x: 1520, y: 360 },
  { x: 1680, y: 420 },
  { x: 1880, y: 410 },
  { x: 2100, y: 330 },
  { x: 2320, y: 390 },
  { x: 2550, y: 420 },
  { x: 2780, y: 350 },
  { x: 3000, y: 400 },
  { x: 3250, y: 460 },
  { x: 3480, y: 380 },
  { x: 3720, y: 320 },
  { x: 3960, y: 370 },
  { x: 4200, y: 430 },
  { x: 4450, y: 455 },
  { x: 4750, y: 455 },
  { x: 5100, y: 455 },
];

export function terrainYAt(track: Point[], x: number): number {
  if (x <= track[0].x) return track[0].y;
  const last = track[track.length - 1];
  if (x >= last.x) return last.y;

  for (let i = 0; i < track.length - 1; i++) {
    const a = track[i];
    const b = track[i + 1];
    if (x >= a.x && x <= b.x) {
      const t = (x - a.x) / Math.max(1, b.x - a.x);
      return a.y + (b.y - a.y) * t;
    }
  }

  return last.y;
}

export function terrainSlopeAt(track: Point[], x: number): number {
  const delta = 8;
  const y1 = terrainYAt(track, x - delta);
  const y2 = terrainYAt(track, x + delta);
  return Math.atan2(y2 - y1, delta * 2);
}
