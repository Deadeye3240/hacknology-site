import {
  CYBER_RIDER_GAPS,
  CYBER_RIDER_TRACK,
  isInGap,
  terrainSlopeAt,
  terrainYAt,
} from "@/lib/stickRider/track";
import {
  RIDER_CONFIG,
  type BikeState,
  type GamePhase,
  type InputState,
  type Particle,
  type Point,
  type TrickKind,
  type TrickPopup,
} from "@/lib/stickRider/types";

const {
  wheelBase,
  wheelRadius,
  gravity,
  maxSpeed,
  gasForce,
  brakeForce,
  groundFriction,
  airDrag,
  airRotate,
  groundAlign,
  crashAngle,
  badLandingAngle,
  finishX,
  suspensionStiffness,
  suspensionDamping,
  comboDecayMs,
  flipBonus,
  perfectLandingBonus,
} = RIDER_CONFIG;

function normalizeAngle(angle: number) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

function wheelPosition(bike: BikeState, rear: boolean) {
  const half = wheelBase / 2;
  const dx = Math.cos(bike.angle) * half;
  const dy = Math.sin(bike.angle) * half;
  return rear ? { x: bike.x - dx, y: bike.y - dy } : { x: bike.x + dx, y: bike.y + dy };
}

function riderHead(bike: BikeState) {
  const cos = Math.cos(bike.angle);
  const sin = Math.sin(bike.angle);
  return {
    x: bike.x - sin * 58 + cos * 8,
    y: bike.y - cos * 58 - sin * 8,
  };
}

function spawnParticles(bike: BikeState, x: number, y: number, count: number, color: string, spread = 4) {
  for (let i = 0; i < count; i++) {
    const p: Particle = {
      x,
      y,
      vx: (Math.random() - 0.5) * spread - bike.vx * 0.3,
      vy: -Math.random() * spread - 1.5,
      life: 1,
      maxLife: 0.6 + Math.random() * 0.5,
      size: 2 + Math.random() * 3,
      color,
    };
    bike.particles.push(p);
  }
}

function addPopup(bike: BikeState, text: string, subtext?: string, color = "#22d3ee") {
  bike.popupId += 1;
  const popup: TrickPopup = {
    id: bike.popupId,
    text,
    subtext,
    x: bike.x,
    y: bike.y - 80,
    life: 1,
    color,
  };
  bike.popups.push(popup);
}

function awardTrick(bike: BikeState, kind: TrickKind, label: string, basePoints: number) {
  if (bike.comboTimerMs <= 0) bike.combo = 0;
  bike.combo += 1;
  bike.comboTimerMs = comboDecayMs;
  bike.lastTrick = kind;
  const multiplier = 1 + (bike.combo - 1) * 0.35;
  const points = Math.round(basePoints * multiplier);
  bike.trickScore += points;
  const comboText = bike.combo > 1 ? ` ×${bike.combo}` : "";
  addPopup(bike, label + comboText, `+${points}`, kind === "perfect" ? "#4ade80" : "#22d3ee");
}

function updateEffects(bike: BikeState, dt: number) {
  bike.screenShake *= Math.pow(0.88, dt);
  if (bike.comboTimerMs > 0) bike.comboTimerMs -= dt * 16.67;
  else if (bike.combo > 0) bike.combo = 0;

  bike.popups = bike.popups
    .map((p) => ({ ...p, life: p.life - dt * 0.018, y: p.y - dt * 0.4 }))
    .filter((p) => p.life > 0);

  bike.particles = bike.particles
    .map((p) => ({
      ...p,
      x: p.x + p.vx * dt,
      y: p.y + p.vy * dt,
      vy: p.vy + 0.08 * dt,
      life: p.life - dt * 0.022,
    }))
    .filter((p) => p.life > 0);
}

export function createBike(): BikeState {
  const startX = 120;
  const startY = terrainYAt(CYBER_RIDER_TRACK, startX) - wheelRadius - 6;
  return {
    x: startX,
    y: startY,
    angle: terrainSlopeAt(CYBER_RIDER_TRACK, startX),
    angularVel: 0,
    vx: 2.4,
    vy: 0,
    grounded: true,
    airborne: false,
    airTimeMs: 0,
    phase: "ready",
    wheelRotation: 0,
    elapsedMs: 0,
    rearSuspension: 0,
    frontSuspension: 0,
    airRotation: 0,
    trickScore: 0,
    combo: 0,
    comboTimerMs: 0,
    lastTrick: null,
    landingQuality: 1,
    wobble: 0,
    screenShake: 0,
    popups: [],
    particles: [],
    popupId: 0,
    crashReason: "",
  };
}

export function startRun(bike: BikeState) {
  bike.phase = "playing";
  bike.elapsedMs = 0;
  bike.trickScore = 0;
  bike.combo = 0;
  bike.comboTimerMs = 0;
  bike.popups = [];
  bike.particles = [];
  bike.airRotation = 0;
  bike.crashReason = "";
}

function setPhase(bike: BikeState, phase: GamePhase, reason = "") {
  bike.phase = phase;
  if (phase === "crashed") {
    bike.crashReason = reason || "You lost control.";
    bike.screenShake = Math.max(bike.screenShake, 8);
    bike.vx *= 0.25;
    bike.vy *= 0.25;
    bike.angularVel *= 0.15;
  }
}

function resolveWheelContact(
  wheel: { x: number; y: number },
  wasAirborne: boolean,
  track: Point[],
): { touching: boolean; compression: number; impact: number } {
  const gap = isInGap(wheel.x, CYBER_RIDER_GAPS);
  if (gap && wheel.y + wheelRadius < gap.pitY - 40) {
    return { touching: false, compression: 0, impact: 0 };
  }

  const groundY = terrainYAt(track, wheel.x, CYBER_RIDER_GAPS);
  const penetration = wheel.y + wheelRadius - groundY;

  if (penetration < -2) return { touching: false, compression: 0, impact: 0 };

  const compression = Math.min(1, Math.max(0, penetration / 14));
  const impact = wasAirborne && penetration > 2 ? Math.min(1, penetration / 18) : 0;
  return { touching: penetration >= -1, compression, impact };
}

function evaluateLanding(bike: BikeState, slope: number, rearTouch: boolean, frontTouch: boolean, impact: number) {
  const angleDelta = Math.abs(normalizeAngle(bike.angle - slope));
  const upsideDown = Math.abs(normalizeAngle(bike.angle)) > Math.PI * 0.55;
  const singleWheel = rearTouch !== frontTouch;

  if (upsideDown || angleDelta > crashAngle) {
    setPhase(bike, "crashed", upsideDown ? "Landed upside down." : "Bad angle — wiped out.");
    return;
  }

  if (angleDelta > badLandingAngle || (singleWheel && impact > 0.35)) {
    bike.wobble = Math.min(1, angleDelta / badLandingAngle);
    bike.vx *= 0.72;
    bike.angularVel += (Math.random() - 0.5) * 0.08;
    bike.screenShake = Math.max(bike.screenShake, 3 + impact * 4);
    addPopup(bike, "Rough landing", undefined, "#fbbf24");
    return;
  }

  bike.landingQuality = 1 - angleDelta / badLandingAngle;
  bike.wobble *= 0.6;

  if (impact > 0.15) {
    spawnParticles(bike, bike.x, bike.y + wheelRadius, 6 + Math.floor(impact * 8), "rgba(148, 163, 184, 0.7)", 5);
    bike.screenShake = Math.max(bike.screenShake, 1.5 + impact * 3);
  }

  const flips = Math.floor(Math.abs(bike.airRotation) / (Math.PI * 2));
  if (flips >= 1) {
    const kind: TrickKind = bike.airRotation > 0 ? "frontflip" : "backflip";
    const label = flips >= 2 ? `${flips}x Flip` : kind === "backflip" ? "Backflip" : "Frontflip";
    awardTrick(bike, kind, label, flipBonus * flips);
  }

  if (angleDelta < 0.12 && impact < 0.4 && Math.abs(bike.airRotation) > Math.PI * 1.5) {
    awardTrick(bike, "360", "360°", flipBonus);
  }

  if (angleDelta < 0.08 && impact < 0.25 && bike.airTimeMs > 400) {
    awardTrick(bike, "perfect", "Perfect!", perfectLandingBonus);
  }

  bike.airRotation = 0;
  bike.airTimeMs = 0;
}

export function updateBike(bike: BikeState, input: InputState, dt: number, track: Point[] = CYBER_RIDER_TRACK) {
  if (bike.phase === "ready" || bike.phase === "crashed" || bike.phase === "finished") {
    updateEffects(bike, dt);
    return;
  }

  bike.elapsedMs += dt * 16.67;
  updateEffects(bike, dt);

  if (input.gas) bike.vx += gasForce * dt;
  if (input.brake) bike.vx -= brakeForce * dt;

  bike.vy += gravity * dt;
  bike.x += bike.vx * dt;
  bike.y += bike.vy * dt;

  const wasAirborne = bike.airborne;
  const rear = wheelPosition(bike, true);
  const front = wheelPosition(bike, false);

  const rearContact = resolveWheelContact(rear, wasAirborne, track);
  const frontContact = resolveWheelContact(front, wasAirborne, track);
  let anyTouch = rearContact.touching || frontContact.touching;

  const rearGround = terrainYAt(track, rear.x, CYBER_RIDER_GAPS);
  const frontGround = terrainYAt(track, front.x, CYBER_RIDER_GAPS);
  const slope = Math.atan2(frontGround - rearGround, wheelBase);

  if (anyTouch && bike.vy < -0.6 && slope < -0.08) {
    anyTouch = false;
  }

  bike.rearSuspension += (rearContact.compression - bike.rearSuspension) * suspensionStiffness * dt;
  bike.frontSuspension += (frontContact.compression - bike.frontSuspension) * suspensionStiffness * dt;
  bike.rearSuspension *= Math.pow(suspensionDamping, dt);
  bike.frontSuspension *= Math.pow(suspensionDamping, dt);

  if (anyTouch) {
    const avgGround = (rearGround + frontGround) / 2;

    if (wasAirborne && bike.vy > 0.5) {
      const impact = Math.max(rearContact.impact, frontContact.impact);
      evaluateLanding(bike, slope, rearContact.touching, frontContact.touching, impact);
      if (bike.phase !== "playing") return;
    }

    bike.airborne = false;

    const targetY = avgGround - wheelRadius - (bike.rearSuspension + bike.frontSuspension) * 4;
    const spring = bike.vy > 0 ? 0.55 : 0.38;
    bike.y += (targetY - bike.y) * spring * dt;
    bike.vy *= bike.vy > 0 ? 0.35 : 0.55;

    const align = normalizeAngle(slope - bike.angle);
    bike.angle += align * groundAlign * dt;

    if (input.leanBack) bike.angularVel -= 0.004 * dt;
    if (input.leanForward) bike.angularVel += 0.004 * dt;

    bike.angle += bike.angularVel * dt + bike.wobble * Math.sin(bike.elapsedMs * 0.02) * 0.015;
    bike.angularVel *= Math.pow(0.86, dt);
    bike.wobble *= Math.pow(0.92, dt);

    bike.vx *= Math.pow(groundFriction, dt);

    if (Math.abs(normalizeAngle(bike.angle - slope)) > crashAngle * 0.85 && Math.abs(bike.vx) > 2) {
      setPhase(bike, "crashed", "Lost balance on the slope.");
      return;
    }
  } else {
    if (!wasAirborne) {
      bike.airborne = true;
      bike.airTimeMs = 0;
    } else {
      bike.airTimeMs += dt * 16.67;
    }

    bike.grounded = false;

    if (input.leanBack || input.brake) bike.angularVel -= airRotate * dt;
    if (input.leanForward || input.gas) bike.angularVel += airRotate * dt;
    bike.angularVel *= Math.pow(airDrag, dt);
    bike.angle += bike.angularVel * dt;
    bike.airRotation += bike.angularVel * dt;

    bike.vx *= Math.pow(airDrag, dt * 0.3);

    if (Math.abs(bike.angle) > Math.PI * 0.72 && bike.airTimeMs > 600 && Math.abs(bike.vx) < 3) {
      setPhase(bike, "crashed", "Tumbled in the air.");
      return;
    }
  }

  bike.grounded = anyTouch;
  bike.vx = Math.max(-3, Math.min(maxSpeed, bike.vx));

  const head = riderHead(bike);
  const headGround = terrainYAt(track, head.x, CYBER_RIDER_GAPS);
  if (head.y >= headGround - 6) {
    setPhase(bike, "crashed", "Rider hit the deck.");
    return;
  }

  if (bike.y > 780 || (isInGap(bike.x, CYBER_RIDER_GAPS) && bike.y > 820)) {
    setPhase(bike, "crashed", "Fell into the void.");
    return;
  }

  bike.wheelRotation += bike.vx * 0.09 * dt;

  if (bike.x >= finishX) {
    bike.phase = "finished";
    addPopup(bike, "FINISH!", formatTrickScore(bike.trickScore), "#f472b6");
  }
}

export function formatTrickScore(score: number): string {
  return score > 0 ? `${score} trick pts` : "";
}

export function cameraXForBike(bikeX: number, current: number): number {
  const target = Math.max(0, bikeX - RIDER_CONFIG.cameraLead);
  return current + (target - current) * RIDER_CONFIG.cameraSmooth;
}

export { riderHead, wheelPosition, normalizeAngle };
