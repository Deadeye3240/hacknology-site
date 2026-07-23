import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GameCard } from "@/components/games/GameCard";
import { HighlightGameBanner } from "@/components/games/HighlightGameBanner";
import { SparklesIcon, TargetIcon } from "@/components/ui/icons";
import { gameCategories, nerdGames } from "@/data/games";
import { platformStats } from "@/data/platformStats";
import { paths } from "@/routes/paths";
import { useVulnerableLab } from "@/context/VulnerableLabContext";
import { vulnerableLabs } from "@/data/vulnerableLabs";
import { cn } from "@/lib/cn";

export default function GamesHubPage() {
  const { completedIds, totalXp } = useVulnerableLab();
  const [category, setCategory] = useState<(typeof gameCategories)[number]>("All");

  const filtered = useMemo(() => {
    if (category === "All") return nerdGames;
    return nerdGames.filter((g) => g.category === category);
  }, [category]);

  const featured = nerdGames.filter((g) => g.featured && !g.highlight);

  return (
    <>
      <PageHeader
        eyebrow="Play & learn"
        title="Nerd Games"
        description="An arcade of cybersecurity mini-games — quick rounds, replayable challenges, and local high scores."
        icon={SparklesIcon}
      />
      <Section>
        <HighlightGameBanner />

        <Card className="mb-8 flex flex-col gap-4 border-emerald-400/20 bg-emerald-400/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
              <TargetIcon />
            </span>
            <div>
              <h2 className="text-base font-semibold text-white">Vulnerable Lab</h2>
              <p className="text-sm text-slate-400">
                Hands-on web security challenges in an isolated sandbox. {completedIds.length}/
                {vulnerableLabs.length} solved · {totalXp} XP
              </p>
            </div>
          </div>
          <Button to={paths.vulnerableLab} variant="secondary" className="shrink-0">
            Open Vulnerable Lab
          </Button>
        </Card>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Arcade library</p>
            <p className="mt-1 text-sm text-slate-400">
              {platformStats.gameCount} games · scores saved locally in your browser
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {gameCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition",
                  category === cat
                    ? "border-accent-400/40 bg-accent-400/10 text-accent-200"
                    : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {category === "All" && featured.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Featured</h2>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {featured.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        )}

        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
          {category === "All" ? "All games" : category}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {(category === "All"
            ? filtered.filter((g) => !g.featured && !g.highlight)
            : filtered.filter((g) => !g.highlight)
          ).map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </Section>
    </>
  );
}
