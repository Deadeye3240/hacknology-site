import { useCallback, useEffect, useRef, useState } from "react";

type Point = {
  x: number;
  y: number;
};

type Bike = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  crashed: boolean;
  finished: boolean;
};

const WIDTH = 1200;
const HEIGHT = 700;
const WHEEL_RADIUS = 18;
const WHEEL_BASE = 72;
const GRAVITY = 0.45;
const AIR_CONTROL = 0.007;
const MAX_SPEED = 8;

const defaultTerrain: Point[] = [
  { x: 0, y: 560 },
  { x: 120, y: 560 },
  { x: 220, y: 520 },
  { x: 320, y: 555 },
  { x: 410, y: 470 },
  { x: 500, y: 500 },
  { x: 590, y: 410 },
  { x: 700, y: 475 },
  { x: 820, y: 390 },
  { x: 940, y: 450 },
  { x: 1080, y: 360 },
  { x: 1200, y: 420 },
  { x: 1400, y: 420 },
  { x: 1600, y: 480 },
  { x: 1800, y: 400 },
  { x: 2050, y: 450 },
  { x: 2300, y: 350 },
  { x: 2600, y: 430 },
  { x: 3000, y: 430 },
];

function createBike(): Bike {
  return {
    x: 130,
    y: 470,
    vx: 2,
    vy: 0,
    angle: 0,
    angularVelocity: 0,
    crashed: false,
    finished: false,
  };
}

function normalizeAngle(angle: number) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

function terrainYAt(terrain: Point[], x: number) {
  for (let i = 0; i < terrain.length - 1; i++) {
    const a = terrain[i];
    const b = terrain[i + 1];

    if (x >= a.x && x <= b.x) {
      const t = (x - a.x) / Math.max(1, b.x - a.x);
      return a.y + (b.y - a.y) * t;
    }
  }

  return 560;
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);

  gradient.addColorStop(0, "#8fd3ff");
  gradient.addColorStop(1, "#eaf8ff");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Clouds
  ctx.fillStyle = "rgba(255,255,255,0.75)";

  const clouds = [
    { x: 120, y: 100, s: 1 },
    { x: 500, y: 150, s: 0.8 },
    { x: 900, y: 90, s: 1.2 },
    { x: 1350, y: 120, s: 0.9 },
    { x: 1900, y: 80, s: 1.1 },
  ];

  for (const cloud of clouds) {
    const x = cloud.x - cameraX * 0.25;

    if (x < -150 || x > WIDTH + 150) continue;

    ctx.beginPath();

    ctx.arc(
      x,
      cloud.y,
      28 * cloud.s,
      0,
      Math.PI * 2,
    );

    ctx.arc(
      x + 35 * cloud.s,
      cloud.y - 12 * cloud.s,
      38 * cloud.s,
      0,
      Math.PI * 2,
    );

    ctx.arc(
      x + 75 * cloud.s,
      cloud.y,
      28 * cloud.s,
      0,
      Math.PI * 2,
    );

    ctx.fill();
  }

  // Distant hills
  ctx.fillStyle = "rgba(90,170,110,0.28)";

  ctx.beginPath();
  ctx.moveTo(0, HEIGHT);

  for (let x = -100; x <= WIDTH + 100; x += 100) {
    const worldX = x + cameraX * 0.35;
    const y = 470 + Math.sin(worldX * 0.002) * 70;

    ctx.lineTo(x, y);
  }

  ctx.lineTo(WIDTH, HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawTerrain(
  ctx: CanvasRenderingContext2D,
  terrain: Point[],
  cameraX: number,
) {
  ctx.save();

  ctx.translate(-cameraX, 0);

  // Ground fill
  ctx.beginPath();

  ctx.moveTo(terrain[0].x, HEIGHT);
  ctx.lineTo(terrain[0].x, terrain[0].y);

  for (const point of terrain) {
    ctx.lineTo(point.x, point.y);
  }

  ctx.lineTo(
    terrain[terrain.length - 1].x,
    HEIGHT,
  );

  ctx.closePath();

  ctx.fillStyle = "#7acb6b";
  ctx.fill();

  // Ground line
  ctx.beginPath();

  ctx.moveTo(
    terrain[0].x,
    terrain[0].y,
  );

  for (const point of terrain) {
    ctx.lineTo(point.x, point.y);
  }

  ctx.strokeStyle = "#1d1d1d";
  ctx.lineWidth = 5;
  ctx.stroke();

  // Finish flag
  const finishX = 2850;
  const finishY = terrainYAt(
    terrain,
    finishX,
  );

  ctx.strokeStyle = "#222";
  ctx.lineWidth = 4;

  ctx.beginPath();

  ctx.moveTo(
    finishX,
    finishY,
  );

  ctx.lineTo(
    finishX,
    finishY - 130,
  );

  ctx.stroke();

  ctx.fillStyle = "#ff3d3d";

  ctx.beginPath();

  ctx.moveTo(
    finishX,
    finishY - 130,
  );

  ctx.lineTo(
    finishX + 70,
    finishY - 105,
  );

  ctx.lineTo(
    finishX,
    finishY - 80,
  );

  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawBike(
  ctx: CanvasRenderingContext2D,
  bike: Bike,
  cameraX: number,
  wheelRotation: number,
) {
  const screenX = bike.x - cameraX;
  const screenY = bike.y;

  ctx.save();

  ctx.translate(
    screenX,
    screenY,
  );

  ctx.rotate(bike.angle);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Wheels
  for (
    const wheelX of [
      -WHEEL_BASE / 2,
      WHEEL_BASE / 2,
    ]
  ) {
    ctx.beginPath();

    ctx.arc(
      wheelX,
      0,
      WHEEL_RADIUS,
      0,
      Math.PI * 2,
    );

    ctx.strokeStyle = "#111";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Spokes
    ctx.save();

    ctx.translate(
      wheelX,
      0,
    );

    ctx.rotate(wheelRotation);

    ctx.strokeStyle = "#777";
    ctx.lineWidth = 1.5;

    for (let i = 0; i < 8; i++) {
      const angle =
        (i / 8) *
        Math.PI *
        2;

      ctx.beginPath();

      ctx.moveTo(0, 0);

      ctx.lineTo(
        Math.cos(angle) *
          WHEEL_RADIUS,
        Math.sin(angle) *
          WHEEL_RADIUS,
      );

      ctx.stroke();
    }

    ctx.restore();
  }

  ctx.strokeStyle = "#111";
  ctx.lineWidth = 5;

  // Bike frame
  ctx.beginPath();

  ctx.moveTo(
    -WHEEL_BASE / 2,
    0,
  );

  ctx.lineTo(
    -10,
    -34,
  );

  ctx.lineTo(
    WHEEL_BASE / 2,
    0,
  );

  ctx.lineTo(
    -WHEEL_BASE / 2,
    0,
  );

  ctx.lineTo(
    10,
    -34,
  );

  ctx.stroke();

  // Seat
  ctx.beginPath();

  ctx.moveTo(
    -10,
    -34,
  );

  ctx.lineTo(
    -22,
    -50,
  );

  ctx.stroke();

  ctx.lineWidth = 6;

  ctx.beginPath();

  ctx.moveTo(
    -30,
    -51,
  );

  ctx.lineTo(
    -14,
    -51,
  );

  ctx.stroke();

  // Handlebars
  ctx.lineWidth = 4;

  ctx.beginPath();

  ctx.moveTo(
    10,
    -34,
  );

  ctx.lineTo(
    22,
    -55,
  );

  ctx.lineTo(
    36,
    -58,
  );

  ctx.stroke();

  // Rider legs
  ctx.lineWidth = 5;

  ctx.beginPath();

  ctx.moveTo(
    -18,
    -55,
  );

  ctx.lineTo(
    -4,
    -28,
  );

  ctx.lineTo(
    18,
    -25,
  );

  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(
    -18,
    -55,
  );

  ctx.lineTo(
    -35,
    -27,
  );

  ctx.lineTo(
    -15,
    -10,
  );

  ctx.stroke();

  // Body
  ctx.beginPath();

  ctx.moveTo(
    -18,
    -55,
  );

  ctx.lineTo(
    -2,
    -92,
  );

  ctx.stroke();

  // Arms
  ctx.beginPath();

  ctx.moveTo(
    -2,
    -88,
  );

  ctx.lineTo(
    22,
    -60,
  );

  ctx.stroke();

  // Head
  ctx.fillStyle = "#111";

  ctx.beginPath();

  ctx.arc(
    -5,
    -108,
    13,
    0,
    Math.PI * 2,
  );

  ctx.fill();

  ctx.restore();
}

export default function GamePage() {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const animationRef =
    useRef<number | null>(null);

  const keysRef =
    useRef<Record<string, boolean>>({});

  const terrainRef =
    useRef<Point[]>(
      defaultTerrain,
    );

  const bikeRef =
    useRef<Bike>(
      createBike(),
    );

  const cameraRef =
    useRef(0);

  const wheelRotationRef =
    useRef(0);

  const lastTimeRef =
    useRef(0);

  const [status, setStatus] =
    useState<
      "riding" |
      "crashed" |
      "finished"
    >("riding");

  const [speed, setSpeed] =
    useState(0);

  const resetGame =
    useCallback(() => {
      bikeRef.current =
        createBike();

      cameraRef.current =
        0;

      wheelRotationRef.current =
        0;

      lastTimeRef.current =
        0;

      setStatus("riding");

      setSpeed(0);
    }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown =
      (event: KeyboardEvent) => {
        keysRef.current[
          event.key.toLowerCase()
        ] = true;

        if (
          [
            "arrowup",
            "arrowdown",
            "arrowleft",
            "arrowright",
            " ",
          ].includes(
            event.key.toLowerCase(),
          )
        ) {
          event.preventDefault();
        }

        if (
          event.key.toLowerCase() ===
          "r"
        ) {
          resetGame();
        }
      };

    const handleKeyUp =
      (event: KeyboardEvent) => {
        keysRef.current[
          event.key.toLowerCase()
        ] = false;
      };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    window.addEventListener(
      "keyup",
      handleKeyUp,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp,
      );
    };
  }, [resetGame]);

  // Game loop
  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    const resizeCanvas =
      () => {
        const dpr =
          Math.min(
            window.devicePixelRatio ||
              1,
            2,
          );

        canvas.width =
          WIDTH * dpr;

        canvas.height =
          HEIGHT * dpr;

        canvas.style.width =
          "100%";

        canvas.style.height =
          "auto";

        ctx.setTransform(
          dpr,
          0,
          0,
          dpr,
          0,
          0,
        );
      };

    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas,
    );

    const gameLoop =
      (time: number) => {
        const bike =
          bikeRef.current;

        const terrain =
          terrainRef.current;

        const keys =
          keysRef.current;

        if (
          !lastTimeRef.current
        ) {
          lastTimeRef.current =
            time;
        }

        const deltaTime =
          Math.min(
            (time -
              lastTimeRef.current) /
              16.67,
            2,
          );

        lastTimeRef.current =
          time;

        if (
          !bike.crashed &&
          !bike.finished
        ) {
          const accelerate =
            keys["arrowright"] ||
            keys["d"];

          const brake =
            keys["arrowleft"] ||
            keys["a"];

          const frontBrake =
            keys["arrowup"] ||
            keys["w"];

          const backBrake =
            keys["arrowdown"] ||
            keys["s"];

          if (accelerate) {
            bike.vx +=
              0.16 *
              deltaTime;
          }

          if (brake) {
            bike.vx -=
              0.12 *
              deltaTime;
          }

          bike.vx *=
            Math.pow(
              0.995,
              deltaTime,
            );

          bike.vx =
            Math.max(
              -3,
              Math.min(
                MAX_SPEED,
                bike.vx,
              ),
            );

          bike.vy +=
            GRAVITY *
            deltaTime;

          bike.x +=
            bike.vx *
            deltaTime;

          bike.y +=
            bike.vy *
            deltaTime;

          const rearX =
            bike.x -
            Math.cos(
              bike.angle,
            ) *
              (WHEEL_BASE / 2);

          const frontX =
            bike.x +
            Math.cos(
              bike.angle,
            ) *
              (WHEEL_BASE / 2);

          const rearGround =
            terrainYAt(
              terrain,
              rearX,
            );

          const frontGround =
            terrainYAt(
              terrain,
              frontX,
            );

          const rearWheelY =
            bike.y +
            Math.sin(
              bike.angle,
            ) *
              (WHEEL_BASE / 2);

          const frontWheelY =
            bike.y -
            Math.sin(
              bike.angle,
            ) *
              (WHEEL_BASE / 2);

          const rearTouch =
            rearWheelY +
              WHEEL_RADIUS >=
            rearGround;

          const frontTouch =
            frontWheelY +
              WHEEL_RADIUS >=
            frontGround;

          const slope =
            Math.atan2(
              frontGround -
                rearGround,
              WHEEL_BASE,
            );

          if (
            rearTouch ||
            frontTouch
          ) {
            const groundY =
              Math.min(
                rearGround,
                frontGround,
              ) -
              WHEEL_RADIUS;

            if (
              bike.y >
              groundY - 10
            ) {
              bike.y =
                groundY;

              bike.vy *=
                -0.15;

              const angleDifference =
                normalizeAngle(
                  slope -
                    bike.angle,
                );

              bike.angle +=
                angleDifference *
                0.12 *
                deltaTime;

              bike.angularVelocity *=
                0.72;

              if (
                Math.abs(
                  bike.angle,
                ) >
                Math.PI *
                  0.65
              ) {
                bike.crashed =
                  true;

                setStatus(
                  "crashed",
                );
              }
            }
          } else {
            if (
              keys["arrowleft"] ||
              keys["a"]
            ) {
              bike.angularVelocity -=
                AIR_CONTROL *
                deltaTime;
            }

            if (
              keys["arrowright"] ||
              keys["d"]
            ) {
              bike.angularVelocity +=
                AIR_CONTROL *
                deltaTime;
            }

            if (frontBrake) {
              bike.angularVelocity -=
                AIR_CONTROL *
                0.5 *
                deltaTime;
            }

            if (backBrake) {
              bike.angularVelocity +=
                AIR_CONTROL *
                0.5 *
                deltaTime;
            }

            bike.angularVelocity *=
              Math.pow(
                0.995,
                deltaTime,
              );

            bike.angle +=
              bike.angularVelocity *
              deltaTime;
          }

          wheelRotationRef.current +=
            bike.vx *
            0.08 *
            deltaTime;

          if (
            bike.x >=
            2850
          ) {
            bike.finished =
              true;

            setStatus(
              "finished",
            );
          }

          cameraRef.current +=
            (
              Math.max(
                0,
                bike.x - 300,
              ) -
              cameraRef.current
            ) *
            0.08;

          setSpeed(
            Math.round(
              Math.abs(
                bike.vx,
              ) * 12,
            ),
          );
        }

        drawBackground(
          ctx,
          cameraRef.current,
        );

        drawTerrain(
          ctx,
          terrain,
          cameraRef.current,
        );

        drawBike(
          ctx,
          bike,
          cameraRef.current,
          wheelRotationRef.current,
        );

        animationRef.current =
          requestAnimationFrame(
            gameLoop,
          );
      };

    animationRef.current =
      requestAnimationFrame(
        gameLoop,
      );

    return () => {
      window.removeEventListener(
        "resize",
        resizeCanvas,
      );

      if (
        animationRef.current
      ) {
        cancelAnimationFrame(
          animationRef.current,
        );
      }
    };
  }, []);

  return (
    <div className="min-h-[70vh] bg-base-950 text-white">
      <div className="mx-auto w-full max-w-[1250px] px-4 py-5">

        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

          <div>
            <h1 className="text-2xl font-black">
              Stick Rider
            </h1>

            <p className="text-sm text-neutral-400">
              Classic stick-bike physics.
            </p>
          </div>

          <div className="flex items-center gap-2">

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm">
              Speed:{" "}
              <span className="font-bold">
                {speed}
              </span>
            </div>

            <button
              onClick={resetGame}
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-neutral-200"
            >
              Restart
            </button>

          </div>
        </div>

        {/* Game */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-black shadow-2xl">

          <canvas
            ref={canvasRef}
            className="block w-full"
          />

          {status !== "riding" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">

              <div className="rounded-2xl border border-white/10 bg-neutral-950/95 px-8 py-7 text-center shadow-2xl">

                <div className="mb-2 text-4xl font-black">
                  {status ===
                  "crashed"
                    ? "CRASH!"
                    : "FINISH!"}
                </div>

                <p className="mb-5 text-neutral-400">
                  {status ===
                  "crashed"
                    ? "You wiped out. Try to land on your wheels."
                    : "Nice run! You made it to the finish line."}
                </p>

                <button
                  onClick={resetGame}
                  className="rounded-lg bg-white px-6 py-3 font-bold text-black hover:bg-neutral-200"
                >
                  Ride Again
                </button>

              </div>

            </div>
          )}

        </div>

        {/* Controls */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="mb-1 font-bold">
              Accelerate
            </div>

            <div className="text-sm text-neutral-400">
              D or Right Arrow
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="mb-1 font-bold">
              Brake
            </div>

            <div className="text-sm text-neutral-400">
              A or Left Arrow
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="mb-1 font-bold">
              Air Rotation
            </div>

            <div className="text-sm text-neutral-400">
              Left / Right while airborne
            </div>
          </div>

        </div>

        <div className="mt-5 text-center text-xs text-neutral-600">
          Press R to restart.
        </div>

      </div>
    </div>
  );
}