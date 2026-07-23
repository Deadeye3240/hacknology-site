import { Link } from "react-router-dom";
import { getGameById, nerdGames } from "@/data/games";
import { formatGameTime, getBestScore, getBestTime } from "@/lib/gameScores";
import { paths } from "@/routes/paths";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ArrowRightIcon, ClockIcon, PlayIcon, TargetIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const difficultyTone: Record<string, string> = {
  Beginner: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  Intermediate: "text-amber-200 border-amber-400/30 bg-amber-400/10",
  Advanced: "text-rose-200 border-rose-400/30 bg-rose-400/10",
};

export function NerdGamesSpotlight() {
  const highlight = getGameById("stick-rider");
  const miniGames = nerdGames.filter((g) => !g.highlight && g.featured).slice(0, 3);
  const personalBest = highlight ? getBestTime(highlight.id) : null;

  return (
    <div className="flex flex-col gap-8">
      {highlight && (
        <Card className="overflow-hidden border-accent-400/25 bg-gradient-to-br from-accent-400/[0.07] via-base-950/90 to-base-950 p-0 shadow-glow-sm">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col gap-4 p-6 sm:p-8">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-100">
                <PlayIcon className="text-xs" />
                Flagship game
              </span>
              <div>
                <h3 className="text-balance text-2xl font-bold text-white sm:text-3xl">{highlight.title}</h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base">
                  One-track stick-bike stunt run — balance hills, stick landings, and race to the finish. Beat your
                  personal best time stored locally on your device.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-slate-400">
                  <ClockIcon className="text-[10px]" />
                  Time attack
                </span>
                {personalBest !== null ? (
                  <span className="font-mono text-accent-300">Your best: {formatGameTime(personalBest)}</span>
                ) : (
                  <span className="text-slate-500">No best time yet — set one on your first clear.</span>
                )}
              </div>
              <Button to={paths.game(highlight.id)} size="lg" className="mt-1 w-fit sm:w-auto">
                Play Cyber Rider
                <ArrowRightIcon />
              </Button>
            </div>
            <Link
              to={paths.game(highlight.id)}
              className="group relative min-h-[220px] border-t border-accent-400/10 bg-[#070b14] lg:min-h-full lg:border-l lg:border-t-0"
              aria-label="Play Cyber Rider"
            >
              <div className="absolute inset-0 bg-grid-faint bg-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
              <svg viewBox="0 0 400 220" className="relative h-full w-full transition group-hover:opacity-95" aria-hidden>
                <path d="M0 170 Q80 150 140 165 T260 130 T400 150 L400 220 L0 220 Z" fill="#0f172a" />
                <path d="M0 170 Q80 150 140 165 T260 130 T400 150" fill="none" stroke="#22d3ee" strokeWidth="3" />
                <g stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" fill="none">
                  <circle cx="145" cy="158" r="12" />
                  <circle cx="185" cy="145" r="12" />
                  <path d="M145 158 L165 132 L185 145" />
                  <path d="M165 132 L160 108 L175 92 L188 88" />
                  <circle cx="176" cy="82" r="8" fill="#22d3ee" stroke="#f8fafc" />
                </g>
              </svg>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-300">
            <TargetIcon className="text-sm text-emerald-300" />
            More in the arcade
          </span>
          <p className="max-w-md text-sm leading-relaxed text-slate-500">
            Trivia, forensics puzzles, phishing drills, and command-line challenges — quick sessions between study
            blocks.
          </p>
          <Button to={paths.games} variant="ghost" size="sm" className="w-fit px-0 hover:bg-transparent">
            Browse all games
            <ArrowRightIcon />
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {miniGames.map((game) => {
            const best = game.scoreType === "time" ? getBestTime(game.id) : getBestScore(game.id);
            return (
              <Link
                key={game.id}
                to={paths.game(game.id)}
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400/50"
              >
                <Card interactive className="flex h-full flex-col gap-3 border-white/10 bg-surface/30 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-white group-hover:text-accent-200">{game.title}</h4>
                    <Badge variant="accent">{game.category}</Badge>
                  </div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">{game.description}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                    <span
                      className={cn(
                        "rounded border px-1.5 py-0.5 text-[10px] font-medium",
                        difficultyTone[game.difficulty],
                      )}
                    >
                      {game.difficulty}
                    </span>
                    {best !== null && (
                      <span className="ml-auto font-mono text-[10px] text-accent-300">
                        {game.scoreType === "time" ? formatGameTime(best) : `Best ${best}`}
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
