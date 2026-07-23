import { trackProgress, terrainYAt } from "@/lib/stickRider/track";
import { RIDER_CONFIG, type BikeState, type Point } from "@/lib/stickRider/types";

const { viewWidth, viewHeight, wheelBase, wheelRadius, finishX, worldScale } = RIDER_CONFIG;

function drawSky(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, 0, viewHeight);
  gradient.addColorStop(0, "#050810");
  gradient.addColorStop(0.4, "#0a1020");
  gradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, viewWidth, viewHeight);

  ctx.strokeStyle = "rgba(56, 189, 248, 0.035)";
  ctx.lineWidth = 1;
  for (let y = 60; y < viewHeight; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(viewWidth, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(34, 211, 238, 0.04)";
  for (let i = 0; i < 40; i++) {
    const sx = ((i * 137) % viewWidth) + ((i * 53) % 80);
    const sy = 40 + ((i * 97) % 180);
    ctx.beginPath();
    ctx.arc(sx, sy, 1 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawParallax(ctx: CanvasRenderingContext2D, cameraX: number) {
  ctx.fillStyle = "rgba(10, 16, 32, 0.9)";
  ctx.beginPath();
  ctx.moveTo(0, viewHeight);
  for (let x = 0; x <= viewWidth + 100; x += 50) {
    const worldX = x + cameraX * 0.18;
    const y = 300 + Math.sin(worldX * 0.002) * 55 + Math.cos(worldX * 0.001) * 25;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(viewWidth, viewHeight);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.beginPath();
  ctx.moveTo(0, viewHeight);
  for (let x = 0; x <= viewWidth + 100; x += 40) {
    const worldX = x + cameraX * 0.32;
    const y = 360 + Math.sin(worldX * 0.0035) * 38 + Math.sin(worldX * 0.008) * 12;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(viewWidth, viewHeight);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(34, 211, 238, 0.05)";
  ctx.beginPath();
  ctx.moveTo(0, viewHeight);
  for (let x = 0; x <= viewWidth + 100; x += 35) {
    const worldX = x + cameraX * 0.5;
    const y = 410 + Math.sin(worldX * 0.006) * 22;
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
  ctx.moveTo(track[0].x, viewHeight / worldScale + 120);
  ctx.lineTo(track[0].x, track[0].y);
  for (const point of track) ctx.lineTo(point.x, point.y);
  ctx.lineTo(track[track.length - 1].x, viewHeight / worldScale + 120);
  ctx.closePath();
  const fillGrad = ctx.createLinearGradient(0, 250, 0, 600);
  fillGrad.addColorStop(0, "#111827");
  fillGrad.addColorStop(1, "#0a0f1a");
  ctx.fillStyle = fillGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(track[0].x, track[0].y);
  for (const point of track) ctx.lineTo(point.x, point.y);
  ctx.strokeStyle = "#22d3ee";
  ctx.shadowColor = "rgba(34, 211, 238, 0.5)";
  ctx.shadowBlur = 10;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = "rgba(34, 211, 238, 0.15)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(track[0].x, track[0].y + 8);
  for (const point of track) ctx.lineTo(point.x, point.y + 8);
  ctx.stroke();

  const finishY = terrainYAt(track, finishX);
  ctx.strokeStyle = "#f472b6";
  ctx.lineWidth = 4;
  ctx.shadowColor = "rgba(244, 114, 182, 0.6)";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(finishX, finishY);
  ctx.lineTo(finishX, finishY - 140);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(244, 114, 182, 0.9)";
  ctx.beginPath();
  ctx.moveTo(finishX, finishY - 140);
  ctx.lineTo(finishX + 60, finishY - 110);
  ctx.lineTo(finishX, finishY - 80);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "bold 12px ui-monospace, monospace";
  ctx.fillText("FINISH", finishX + 8, finishY - 145);

  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, bike: BikeState, cameraX: number) {
  for (const p of bike.particles) {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x - cameraX, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawTrickPopups(ctx: CanvasRenderingContext2D, bike: BikeState, cameraX: number) {
  for (const popup of bike.popups) {
    const sx = popup.x - cameraX;
    const sy = popup.y;
    ctx.globalAlpha = popup.life;
    ctx.fillStyle = popup.color;
    ctx.font = `bold ${16 + popup.life * 6}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(popup.text, sx, sy);
    if (popup.subtext) {
      ctx.font = "12px ui-monospace, monospace";
      ctx.fillStyle = "rgba(248, 250, 252, 0.75)";
      ctx.fillText(popup.subtext, sx, sy + 18);
    }
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = "start";
}

function drawStickRider(ctx: CanvasRenderingContext2D, bike: BikeState, cameraX: number) {
  const screenX = bike.x - cameraX;
  const screenY = bike.y;
  const rearDrop = bike.rearSuspension * 6;
  const frontDrop = bike.frontSuspension * 6;

  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.rotate(bike.angle);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const [rear, drop] of [
    [true, rearDrop],
    [false, frontDrop],
  ] as const) {
    const wx = rear ? -wheelBase / 2 : wheelBase / 2;
    const wy = drop;
    ctx.beginPath();
    ctx.arc(wx, wy, wheelRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.save();
    ctx.translate(wx, wy);
    ctx.rotate(bike.wheelRotation);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.85)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * (wheelRadius - 3), Math.sin(a) * (wheelRadius - 3));
      ctx.stroke();
    }
    ctx.restore();
  }

  const frameSink = (rearDrop + frontDrop) * 0.35;
  ctx.strokeStyle = "#f8fafc";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-wheelBase / 2, rearDrop);
  ctx.lineTo(-8, -36 + frameSink);
  ctx.lineTo(wheelBase / 2, frontDrop);
  ctx.lineTo(8, -36 + frameSink);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-8, -36 + frameSink);
  ctx.lineTo(-24, -52 + frameSink);
  ctx.stroke();
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-32, -53 + frameSink);
  ctx.lineTo(-14, -53 + frameSink);
  ctx.stroke();

  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(8, -36 + frameSink);
  ctx.lineTo(24, -58 + frameSink);
  ctx.lineTo(38, -60 + frameSink);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-16, -52 + frameSink);
  ctx.lineTo(-2, -26 + frameSink);
  ctx.lineTo(16, -22 + frameSink);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-16, -52 + frameSink);
  ctx.lineTo(-34, -24 + frameSink);
  ctx.lineTo(-14, -8 + frameSink);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-16, -52 + frameSink);
  ctx.lineTo(-4, -94 + frameSink);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-4, -90 + frameSink);
  ctx.lineTo(24, -58 + frameSink);
  ctx.stroke();

  ctx.fillStyle = "#22d3ee";
  ctx.shadowColor = "rgba(34, 211, 238, 0.6)";
  ctx.shadowBlur = bike.airborne ? 14 : 6;
  ctx.beginPath();
  ctx.arc(-8, -108 + frameSink, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#f8fafc";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (bike.airborne) {
    ctx.strokeStyle = "rgba(34, 211, 238, 0.35)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();
}

function drawHud(ctx: CanvasRenderingContext2D, bike: BikeState, track: Point[]) {
  const speed = Math.round(Math.abs(bike.vx) * 14);
  const distance = Math.max(0, Math.round((bike.x - 120) / 10));
  const progress = Math.round(trackProgress(track, bike.x) * 100);

  ctx.fillStyle = "rgba(7, 11, 20, 0.78)";
  ctx.strokeStyle = "rgba(34, 211, 238, 0.28)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(16, 16, 280, 56, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#64748b";
  ctx.font = "9px ui-monospace, monospace";
  ctx.fillText("SPEED", 28, 34);
  ctx.fillText("DIST", 98, 34);
  ctx.fillText("TRICKS", 168, 34);
  ctx.fillText("PROG", 248, 34);

  ctx.fillStyle = "#22d3ee";
  ctx.font = "bold 15px ui-monospace, monospace";
  ctx.fillText(String(speed), 28, 54);
  ctx.fillStyle = "#f8fafc";
  ctx.fillText(`${distance}m`, 98, 54);
  ctx.fillStyle = bike.combo > 1 ? "#4ade80" : "#22d3ee";
  ctx.fillText(String(bike.trickScore), 168, 54);
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(`${progress}%`, 248, 54);

  if (bike.combo > 1) {
    ctx.fillStyle = "rgba(74, 222, 128, 0.15)";
    ctx.strokeStyle = "rgba(74, 222, 128, 0.45)";
    ctx.beginPath();
    ctx.roundRect(viewWidth - 120, 16, 104, 36, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#4ade80";
    ctx.font = "bold 14px ui-monospace, monospace";
    ctx.fillText(`COMBO ×${bike.combo}`, viewWidth - 112, 40);
  }

  ctx.fillStyle = "rgba(15, 23, 42, 0.5)";
  ctx.fillRect(16, viewHeight - 22, viewWidth - 32, 6);
  ctx.fillStyle = "#22d3ee";
  ctx.fillRect(16, viewHeight - 22, (viewWidth - 32) * trackProgress(track, bike.x), 6);
}

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  bike: BikeState,
  track: Point[],
  cameraX: number,
) {
  const shakeX = bike.screenShake > 0.5 ? (Math.random() - 0.5) * bike.screenShake : 0;
  const shakeY = bike.screenShake > 0.5 ? (Math.random() - 0.5) * bike.screenShake * 0.6 : 0;

  ctx.save();
  ctx.translate(shakeX, shakeY);
  drawSky(ctx);

  ctx.save();
  ctx.scale(worldScale, worldScale);
  const offsetY = (viewHeight / worldScale - viewHeight) * 0.35;
  ctx.translate(0, -offsetY);
  drawParallax(ctx, cameraX);
  drawTrack(ctx, track, cameraX);
  drawParticles(ctx, bike, cameraX);
  drawStickRider(ctx, bike, cameraX);
  drawTrickPopups(ctx, bike, cameraX);
  ctx.restore();

  ctx.restore();

  drawHud(ctx, bike, track);

  if (bike.phase === "ready") {
    ctx.fillStyle = "rgba(7, 11, 20, 0.62)";
    ctx.fillRect(0, 0, viewWidth, viewHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 26px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Press Space or Tap Gas to Start", viewWidth / 2, viewHeight / 2 - 16);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText("Gas to ride · Lean in air for flips · Land wheels-first", viewWidth / 2, viewHeight / 2 + 14);
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("Chain tricks for combo multipliers · Beat the finish time", viewWidth / 2, viewHeight / 2 + 36);
    ctx.textAlign = "start";
  }
}
