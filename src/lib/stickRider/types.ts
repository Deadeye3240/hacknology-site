export type Point = { x: number; y: number };

export type GamePhase = "ready" | "playing" | "crashed" | "finished";

export type TrickKind = "backflip" | "frontflip" | "360" | "perfect";

export type TrickPopup = {
  id: number;
  text: string;
  subtext?: string;
  x: number;
  y: number;
  life: number;
  color: string;
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

export type BikeState = {
  x: number;
  y: number;
  angle: number;
  angularVel: number;
  vx: number;
  vy: number;
  grounded: boolean;
  airborne: boolean;
  airTimeMs: number;
  phase: GamePhase;
  wheelRotation: number;
  elapsedMs: number;
  /** Suspension compression 0–1 per wheel */
  rearSuspension: number;
  frontSuspension: number;
  /** Accumulated rotation while airborne (radians) */
  airRotation: number;
  /** Tricks completed this run */
  trickScore: number;
  combo: number;
  comboTimerMs: number;
  lastTrick: TrickKind | null;
  /** Landing quality 0–1 after touch-down */
  landingQuality: number;
  wobble: number;
  /** Visual / feedback */
  screenShake: number;
  popups: TrickPopup[];
  particles: Particle[];
  popupId: number;
  /** Crash reason for UI */
  crashReason: string;
};

export type InputState = {
  gas: boolean;
  brake: boolean;
  leanBack: boolean;
  leanForward: boolean;
};

export type RenderEffects = {
  screenShake: number;
  popups: TrickPopup[];
  particles: Particle[];
};

export const RIDER_CONFIG = {
  viewWidth: 1280,
  viewHeight: 720,
  /** World scale — lower = zoomed out, more terrain visible */
  worldScale: 0.72,
  wheelBase: 84,
  wheelRadius: 17,
  gravity: 0.58,
  maxSpeed: 11.5,
  gasForce: 0.22,
  brakeForce: 0.18,
  groundFriction: 0.988,
  airDrag: 0.998,
  airRotate: 0.072,
  groundAlign: 0.14,
  /** Max angle delta from terrain slope before crash (radians) */
  crashAngle: 1.05,
  /** Bad landing threshold — wobble above this, crash above crashAngle */
  badLandingAngle: 0.55,
  finishX: 5200,
  /** Camera sits this far behind the bike — larger = more lookahead */
  cameraLead: 420,
  cameraSmooth: 0.065,
  suspensionStiffness: 0.42,
  suspensionDamping: 0.78,
  comboDecayMs: 2800,
  flipBonus: 250,
  perfectLandingBonus: 150,
} as const;
