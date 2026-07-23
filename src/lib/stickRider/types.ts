export type Point = { x: number; y: number };

export type GamePhase = "ready" | "playing" | "crashed" | "finished";

export type BikeState = {
  x: number;
  y: number;
  angle: number;
  angularVel: number;
  vx: number;
  vy: number;
  grounded: boolean;
  phase: GamePhase;
  wheelRotation: number;
  elapsedMs: number;
};

export type InputState = {
  gas: boolean;
  brake: boolean;
  leanBack: boolean;
  leanForward: boolean;
};

export const RIDER_CONFIG = {
  viewWidth: 1100,
  viewHeight: 620,
  wheelBase: 84,
  wheelRadius: 17,
  gravity: 0.52,
  maxSpeed: 10.5,
  gasForce: 0.2,
  brakeForce: 0.16,
  friction: 0.992,
  airRotate: 0.05,
  groundAlign: 0.2,
  crashAngle: 1.25,
  finishX: 4750,
  cameraLead: 280,
} as const;
