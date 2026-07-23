import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatGameTime, getBestTime } from "@/lib/gameScores";
import { getGameById } from "@/data/games";
import { paths } from "@/routes/paths";
import { ArrowRightIcon, PlayIcon } from "@/components/ui/icons";

export function HighlightGameBanner() {
  const game = getGameById("stick-rider");
  if (!game) return null;

  const bestTime = getBestTime(game.id);

  return (
    <Card className="relative mb-10 overflow-hidden border-accent-400/25 bg-gradient-to-br from-accent-400/[0.08] via-base-950 to-base-950 p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-400/10 blur-3xl" />
      <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-200">
            <PlayIcon className="text-xs" />
            Highlight game
          </span>
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{game.title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">{game.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>{game.difficulty}</span>
            <span aria-hidden>·</span>
            <span>+{game.xpReward} XP</span>
            {bestTime !== null && (
              <>
                <span aria-hidden>·</span>
                <span className="font-mono text-accent-300">Best {formatGameTime(bestTime)}</span>
              </>
            )}
          </div>
          <Button to={paths.game(game.id)} size="lg" className="w-fit">
            Play Cyber Rider
            <ArrowRightIcon />
          </Button>
        </div>

        <div className="hidden rounded-2xl border border-white/10 bg-base-950/80 p-4 lg:block">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">Controls</div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <span className="text-accent-300">Gas</span> — D, →, or Space
            </li>
            <li>
              <span className="text-accent-300">Brake</span> — A or ←
            </li>
            <li>
              <span className="text-accent-300">Lean</span> — W/S or ↑/↓ in the air
            </li>
            <li>
              <span className="text-accent-300">Restart</span> — R
            </li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            One continuous track with a finish gate. Balance on landings, keep your rider off the dirt, and beat your
            local best time.
          </p>
        </div>
      </div>
    </Card>
  );
}
