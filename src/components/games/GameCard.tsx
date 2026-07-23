import { Link } from "react-router-dom";
import { getBestScore, getBestTime, formatGameTime } from "@/lib/gameScores";
import type { NerdGame } from "@/data/games";
import { paths } from "@/routes/paths";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ArrowRightIcon, ClockIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const difficultyTone: Record<NerdGame["difficulty"], string> = {
  Beginner: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  Intermediate: "text-amber-200 border-amber-400/30 bg-amber-400/10",
  Advanced: "text-rose-200 border-rose-400/30 bg-rose-400/10",
};

interface GameCardProps {
  game: NerdGame;
}

export function GameCard({ game }: GameCardProps) {
  const bestScore = getBestScore(game.id);
  const bestTime = game.scoreType === "time" ? getBestTime(game.id) : null;

  return (
    <Link to={paths.game(game.id)} className="group block h-full">
      <Card
        interactive
        className={cn(
          "relative flex h-full flex-col gap-4 overflow-hidden p-5",
          game.highlight && "border-accent-400/25 bg-accent-400/[0.04]",
          game.featured && !game.highlight && "border-accent-400/20 bg-accent-400/[0.03]",
        )}
      >
        {game.highlight && (
          <span className="absolute right-3 top-3 rounded-full border border-accent-400/40 bg-accent-400/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-accent-100">
            Highlight
          </span>
        )}
        {game.featured && !game.highlight && (
          <span className="absolute right-3 top-3 rounded-full border border-accent-400/30 bg-accent-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-accent-200">
            Featured
          </span>
        )}

        <div className="flex flex-col gap-2 pr-16">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{game.title}</h3>
          </div>
          <Badge variant="accent">{game.category}</Badge>
        </div>

        <p className="text-sm leading-relaxed text-slate-400">{game.description}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
          <span
            className={cn(
              "rounded border px-2 py-0.5 text-[10px] font-medium",
              difficultyTone[game.difficulty],
            )}
          >
            {game.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
            <ClockIcon className="text-xs" />~{game.estimatedMinutes} min
          </span>
          <span className="text-[10px] text-slate-600">+{game.xpReward} XP</span>
          {bestTime !== null ? (
            <span className="ml-auto font-mono text-xs text-accent-300">{formatGameTime(bestTime)}</span>
          ) : bestScore !== null ? (
            <span className="ml-auto font-mono text-xs text-accent-300">Best {bestScore}</span>
          ) : (
            <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-accent-300 opacity-0 transition group-hover:opacity-100">
              Play
              <ArrowRightIcon className="text-[10px]" />
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
