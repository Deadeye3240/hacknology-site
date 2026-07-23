import { CYBER_RIDER_TRACK, terrainSlopeAt, terrainYAt } from "@/lib/stickRider/track";
import {
  RIDER_CONFIG,
  type BikeState,
  type GamePhase,
  type InputState,
  type Point,
} from "@/lib/stickRider/types";

const { wheelBase, wheelRadius, gravity, maxSpeed, gasForce, brakeForce, friction, airRotate, groundAlign, crashAngle, finishX } =
  RIDER_CONFIG;

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

export function createBike(): BikeState {
  const startX = 120;
  const startY = terrainYAt(CYBER_RIDER_TRACK, startX) - wheelRadius - 4;
  return {
    x: startX,
    y: startY,
    angle: terrainSlopeAt(CYBER_RIDER_TRACK, startX),
    angularVel: 0,
    vx: 2.2,
    vy: 0,
    grounded: true,
    phase: "ready",
    wheelRotation: 0,
    elapsedMs: 0,
  };
}

export function startRun(bike: BikeState) {
  bike.phase = "playing";
  bike.elapsedMs = 0;
}

function setPhase(bike: BikeState, phase: GamePhase) {
  bike.phase = phase;
  bike.vx *= 0.35;
  bike.angularVel *= 0.2;
}

export function updateBike(bike: BikeState, input: InputState, dt: number, track: Point[] = CYBER_RIDER_TRACK) {
  if (bike.phase === "ready" || bike.phase === "crashed" || bike.phase === "finished") return;

  bike.elapsedMs += dt * 16.67;

  if (input.gas) bike.vx += gasForce * dt;
  if (input.brake) bike.vx -= brakeForce * dt;

  bike.vx *= Math.pow(friction, dt);
  bike.vx = Math.max(-2.8, Math.min(maxSpeed, bike.vx));

  bike.vy += gravity * dt;
  bike.x += bike.vx * dt;
  bike.y += bike.vy * dt;

  const rear = wheelPosition(bike, true);
  const front = wheelPosition(bike, false);
  const rearGround = terrainYAt(track, rear.x);
  const frontGround = terrainYAt(track, front.x);
  const rearTouch = rear.y + wheelRadius >= rearGround - 1;
  const frontTouch = front.y + wheelRadius >= frontGround - 1;
  bike.grounded = rearTouch || frontTouch;

  if (bike.grounded) {
    const slope = Math.atan2(frontGround - rearGround, wheelBase);
    const align = normalizeAngle(slope - bike.angle);
    bike.angle += align * groundAlign * dt;

    if (input.leanBack) bike.angularVel -= 0.0035 * dt;
    if (input.leanForward) bike.angularVel += 0.0035 * dt;

    bike.angle += bike.angularVel * dt;
    bike.angularVel *= Math.pow(0.88, dt);

    const avgGround = (rearGround + frontGround) / 2;
    if (bike.vy > -0.5) {
      bike.y += (avgGround - wheelRadius - bike.y) * 0.35 * dt;
      bike.vy *= 0.25;
    }

    if (Math.abs(normalizeAngle(bike.angle - slope)) > crashAngle && Math.abs(bike.vx) > 1.2) {
      setPhase(bike, "crashed");
      return;
    }
  } else {
    if (input.leanBack || input.brake) bike.angularVel -= airRotate * dt;
    if (input.leanForward || input.gas) bike.angularVel += airRotate * dt;
    bike.angularVel *= Math.pow(0.996, dt);
    bike.angle += bike.angularVel * dt;

    if (Math.abs(bike.angle) > Math.PI * 0.85 && Math.abs(bike.vx) < 2) {
      setPhase(bike, "crashed");
      return;
    }
  }

  const head = riderHead(bike);
  if (head.y >= terrainYAt(track, head.x) - 8) {
    setPhase(bike, "crashed");
    return;
  }

  bike.wheelRotation += bike.vx * 0.085 * dt;

  if (bike.x >= finishX) {
    setPhase(bike, "finished");
  }
}

export function cameraXForBike(bikeX: number, current: number): number {
  const target = Math.max(0, bikeX - RIDER_CONFIG.cameraLead);
  return current + (target - current) * 0.1;
}

export { riderHead, wheelPosition, normalizeAngle };
