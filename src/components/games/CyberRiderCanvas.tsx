import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cameraXForBike, createBike, startRun, updateBike } from "@/lib/stickRider/engine";
import { renderFrame } from "@/lib/stickRider/renderer";
import { CYBER_RIDER_TRACK } from "@/lib/stickRider/track";
import { RIDER_CONFIG, type BikeState, type InputState } from "@/lib/stickRider/types";
import { formatGameTime, getBestTime, recordGameTime } from "@/lib/gameScores";
import { cn } from "@/lib/cn";

type Status = "ready" | "playing" | "crashed" | "finished";

interface CyberRiderCanvasProps {
  onStatusChange?: (status: Status, elapsedMs: number) => void;
}

const emptyInput = (): InputState => ({
  gas: false,
  brake: false,
  leanBack: false,
  leanForward: false,
});

export function CyberRiderCanvas({ onStatusChange }: CyberRiderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bikeRef = useRef<BikeState>(createBike());
  const cameraRef = useRef(0);
  const inputRef = useRef<InputState>(emptyInput());
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const statusRef = useRef<Status>("ready");

  const [status, setStatus] = useState<Status>("ready");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(() => getBestTime("stick-rider"));
  const [isNewBest, setIsNewBest] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [trickScore, setTrickScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [crashReason, setCrashReason] = useState("");

  const reset = useCallback(() => {
    bikeRef.current = createBike();
    cameraRef.current = 0;
    inputRef.current = emptyInput();
    lastTimeRef.current = 0;
    statusRef.current = "ready";
    setStatus("ready");
    setElapsedMs(0);
    setIsNewBest(false);
    setSpeed(0);
    setTrickScore(0);
    setCombo(0);
    setCrashReason("");
  }, []);

  const beginIfReady = useCallback(() => {
    if (bikeRef.current.phase === "ready") {
      startRun(bikeRef.current);
      statusRef.current = "playing";
      setStatus("playing");
    }
  }, []);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = RIDER_CONFIG.viewWidth * dpr;
      canvas.height = RIDER_CONFIG.viewHeight * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "auto";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const loop = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 16.67, 2.5);
      lastTimeRef.current = time;

      const bike = bikeRef.current;
      const input = inputRef.current;

      if (bike.phase === "playing") {
        updateBike(bike, input, dt);
        cameraRef.current = cameraXForBike(bike.x, cameraRef.current);
        setElapsedMs(Math.round(bike.elapsedMs));
        setSpeed(Math.round(Math.abs(bike.vx) * 14));
        setTrickScore(bike.trickScore);
        setCombo(bike.combo);
      }

      const phase = bike.phase;
      if (phase === "crashed" && statusRef.current !== "crashed") {
        statusRef.current = "crashed";
        setCrashReason(bike.crashReason);
        setStatus("crashed");
        onStatusChange?.("crashed", bike.elapsedMs);
      } else if (phase === "finished" && statusRef.current !== "finished") {
        const result = recordGameTime("stick-rider", bike.elapsedMs);
        setBestTime(result.best);
        setIsNewBest(result.isNewBest);
        setTrickScore(bike.trickScore);
        statusRef.current = "finished";
        setStatus("finished");
        onStatusChange?.("finished", bike.elapsedMs);
      }

      renderFrame(ctx, bike, CYBER_RIDER_TRACK, cameraRef.current);
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [onStatusChange]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "w", "a", "s", "d", "r"].includes(key)) {
        event.preventDefault();
      }
      if (key === "r") {
        reset();
        return;
      }
      if (key === " " || key === "arrowright" || key === "d") {
        inputRef.current.gas = true;
        beginIfReady();
      }
      if (key === "arrowleft" || key === "a") inputRef.current.brake = true;
      if (key === "arrowup" || key === "w") inputRef.current.leanBack = true;
      if (key === "arrowdown" || key === "s") inputRef.current.leanForward = true;
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === " " || key === "arrowright" || key === "d") inputRef.current.gas = false;
      if (key === "arrowleft" || key === "a") inputRef.current.brake = false;
      if (key === "arrowup" || key === "w") inputRef.current.leanBack = false;
      if (key === "arrowdown" || key === "s") inputRef.current.leanForward = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [beginIfReady, reset]);

  const setTouch = (field: keyof InputState, active: boolean) => {
    inputRef.current[field] = active;
    if (field === "gas" && active) beginIfReady();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <StatPill label="Time" value={formatGameTime(elapsedMs)} accent />
          <StatPill label="Speed" value={String(speed)} />
          <StatPill label="Tricks" value={String(trickScore)} highlight={combo > 1} />
          {bestTime !== null && <StatPill label="Best" value={formatGameTime(bestTime)} />}
        </div>
        <Button onClick={reset} size="sm" variant="secondary">
          Restart (R)
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-accent-400/20 bg-base-950 shadow-glow">
        <canvas ref={canvasRef} className="block w-full touch-none" />

        {status !== "playing" && status !== "ready" && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-950/70 backdrop-blur-sm">
            <div className="mx-4 max-w-sm rounded-2xl border border-white/10 bg-base-950/95 px-8 py-7 text-center shadow-2xl">
              <p className="text-3xl font-black text-white">
                {status === "crashed" ? "Wiped out" : "Track cleared"}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {status === "crashed"
                  ? crashReason || "You lost balance or hit the ground. Line up your landing and try again."
                  : `Finished in ${formatGameTime(elapsedMs)}${trickScore > 0 ? ` · ${trickScore} trick pts` : ""}.`}
              </p>
              {isNewBest && status === "finished" && (
                <p className="mt-2 text-sm font-medium text-accent-300">New personal best saved locally.</p>
              )}
              <Button onClick={reset} className="mt-5">
                Ride again
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 sm:hidden">
        <TouchButton label="Brake" onDown={() => setTouch("brake", true)} onUp={() => setTouch("brake", false)} />
        <TouchButton
          label="Gas"
          primary
          onDown={() => setTouch("gas", true)}
          onUp={() => setTouch("gas", false)}
        />
        <TouchButton
          label="Flip F"
          onDown={() => setTouch("leanForward", true)}
          onUp={() => setTouch("leanForward", false)}
        />
        <TouchButton
          label="Flip B"
          className="col-span-3"
          onDown={() => setTouch("leanBack", true)}
          onUp={() => setTouch("leanBack", false)}
        />
      </div>

      <div className="hidden gap-3 sm:grid sm:grid-cols-3">
        <ControlHint title="Gas" keys="D / → / Space" />
        <ControlHint title="Brake" keys="A / ←" />
        <ControlHint title="Flips in air" keys="W/S or ↑/↓" />
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  accent,
  highlight,
}: {
  label: string;
  value: string;
  accent?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-surface/60 px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
      <p
        className={cn(
          "font-mono text-sm font-semibold",
          highlight ? "text-emerald-300" : accent ? "text-accent-300" : "text-white",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function ControlHint({ title, keys }: { title: string; keys: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface/40 px-4 py-3">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{keys}</p>
    </div>
  );
}

function TouchButton({
  label,
  onDown,
  onUp,
  primary,
  className,
}: {
  label: string;
  onDown: () => void;
  onUp: () => void;
  primary?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "select-none rounded-xl border px-3 py-4 text-sm font-bold transition active:scale-95",
        primary
          ? "border-accent-400/40 bg-accent-400/15 text-accent-100"
          : "border-white/10 bg-white/[0.04] text-slate-200",
        className,
      )}
      onPointerDown={(e) => {
        e.preventDefault();
        onDown();
      }}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerCancel={onUp}
    >
      {label}
    </button>
  );
}
