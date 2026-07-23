import { terrainYAt } from "@/lib/stickRider/track";
import { RIDER_CONFIG, type BikeState, type Point } from "@/lib/stickRider/types";

const { viewWidth, viewHeight, wheelBase, wheelRadius, finishX } = RIDER_CONFIG;

function drawSky(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, 0, viewHeight);
  gradient.addColorStop(0, "#070b14");
  gradient.addColorStop(0.55, "#0c1220");
  gradient.addColorStop(1, "#111827");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, viewWidth, viewHeight);

  ctx.strokeStyle = "rgba(56, 189, 248, 0.04)";
  ctx.lineWidth = 1;
  for (let y = 80; y < viewHeight; y += 36) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(viewWidth, y);
    ctx.stroke();
  }
}

function drawParallax(ctx: CanvasRenderingContext2D, cameraX: number) {
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.beginPath();
  ctx.moveTo(0, viewHeight);
  for (let x = 0; x <= viewWidth + 80; x += 60) {
    const worldX = x + cameraX * 0.25;
    const y = 360 + Math.sin(worldX * 0.003) * 40 + Math.cos(worldX * 0.0015) * 20;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(viewWidth, viewHeight);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(34, 211, 238, 0.06)";
  ctx.beginPath();
  ctx.moveTo(0, viewHeight);
  for (let x = 0; x <= viewWidth + 80; x += 40) {
    const worldX = x + cameraX * 0.45;
    const y = 420 + Math.sin(worldX * 0.005) * 28;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(viewWidth, viewHeight);
  ctx.closePath();
  ctx.fill();
}

function drawTrack(ctx: CanvasRenderingContext2D, track: Point[], cameraX: number) {
  ctx.save();
  ctx.translate(-cameraX, 0);

  ctx.beginPath();
  ctx.moveTo(track[0].x, viewHeight);
  ctx.lineTo(track[0].x, track[0].y);
  for (const point of track) ctx.lineTo(point.x, point.y);
  ctx.lineTo(track[track.length - 1].x, viewHeight);
  ctx.closePath();
  ctx.fillStyle = "#0f172a";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(track[0].x, track[0].y);
  for (const point of track) ctx.lineTo(point.x, point.y);
  ctx.strokeStyle = "#22d3ee";
  ctx.shadowColor = "rgba(34, 211, 238, 0.45)";
  ctx.shadowBlur = 8;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.shadowBlur = 0;

  const finishY = terrainYAt(track, finishX);
  ctx.strokeStyle = "#f472b6";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(finishX, finishY);
  ctx.lineTo(finishX, finishY - 120);
  ctx.stroke();
  ctx.fillStyle = "rgba(244, 114, 182, 0.85)";
  ctx.beginPath();
  ctx.moveTo(finishX, finishY - 120);
  ctx.lineTo(finishX + 55, finishY - 95);
  ctx.lineTo(finishX, finishY - 70);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "bold 11px ui-monospace, monospace";
  ctx.fillText("FINISH", finishX + 6, finishY - 125);

  ctx.restore();
}

function drawStickRider(ctx: CanvasRenderingContext2D, bike: BikeState, cameraX: number, wheelRotation: number) {
  const screenX = bike.x - cameraX;
  const screenY = bike.y;

  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.rotate(bike.angle);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const rear of [true, false]) {
    const wx = rear ? -wheelBase / 2 : wheelBase / 2;
    ctx.beginPath();
    ctx.arc(wx, 0, wheelRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.save();
    ctx.translate(wx, 0);
    ctx.rotate(wheelRotation);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.8)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * (wheelRadius - 3), Math.sin(a) * (wheelRadius - 3));
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.strokeStyle = "#f8fafc";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-wheelBase / 2, 0);
  ctx.lineTo(-8, -36);
  ctx.lineTo(wheelBase / 2, 0);
  ctx.lineTo(8, -36);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-8, -36);
  ctx.lineTo(-24, -52);
  ctx.stroke();
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-32, -53);
  ctx.lineTo(-14, -53);
  ctx.stroke();

  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(8, -36);
  ctx.lineTo(24, -58);
  ctx.lineTo(38, -60);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-16, -52);
  ctx.lineTo(-2, -26);
  ctx.lineTo(16, -22);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-16, -52);
  ctx.lineTo(-34, -24);
  ctx.lineTo(-14, -8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-16, -52);
  ctx.lineTo(-4, -94);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-4, -90);
  ctx.lineTo(24, -58);
  ctx.stroke();

  ctx.fillStyle = "#22d3ee";
  ctx.beginPath();
  ctx.arc(-8, -108, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f8fafc";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

function drawHud(ctx: CanvasRenderingContext2D, speed: number, distance: number) {
  ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
  ctx.strokeStyle = "rgba(34, 211, 238, 0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(16, 16, 150, 52, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px ui-monospace, monospace";
  ctx.fillText("SPEED", 28, 34);
  ctx.fillText("DIST", 98, 34);
  ctx.fillStyle = "#22d3ee";
  ctx.font = "bold 16px ui-monospace, monospace";
  ctx.fillText(String(speed), 28, 54);
  ctx.fillStyle = "#f8fafc";
  ctx.fillText(`${distance}m`, 98, 54);
}

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  bike: BikeState,
  track: Point[],
  cameraX: number,
  wheelRotation: number,
) {
  drawSky(ctx);
  drawParallax(ctx, cameraX);
  drawTrack(ctx, track, cameraX);
  drawStickRider(ctx, bike, cameraX, wheelRotation);

  const speed = Math.round(Math.abs(bike.vx) * 14);
  const distance = Math.max(0, Math.round((bike.x - 120) / 10));
  drawHud(ctx, speed, distance);

  if (bike.phase === "ready") {
    ctx.fillStyle = "rgba(7, 11, 20, 0.55)";
    ctx.fillRect(0, 0, viewWidth, viewHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 28px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Press Space or Tap Gas to Start", viewWidth / 2, viewHeight / 2 - 10);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText("Balance the bike · Beat the finish line · Set a best time", viewWidth / 2, viewHeight / 2 + 22);
    ctx.textAlign = "start";
  }
}
