import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SparklesIcon, TargetIcon } from "@/components/ui/icons";
import { nerdGames } from "@/data/games";
import { paths } from "@/routes/paths";
import { useVulnerableLab } from "@/context/VulnerableLabContext";
import { vulnerableLabs } from "@/data/vulnerableLabs";

export default function GamesHubPage() {
  const { completedIds, totalXp } = useVulnerableLab();

  return (
    <>
      <PageHeader
        eyebrow="Play & learn"
        title="Nerd Games"
        description="Cybersecurity-themed mini-games and challenges — fun, educational, and a little competitive."
        icon={SparklesIcon}
      />
      <Section>
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {nerdGames.map((game) => (
            <Link key={game.id} to={paths.game(game.id)} className="block">
              <Card interactive className="flex h-full flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white">{game.title}</h3>
                  <Badge variant="accent">{game.category}</Badge>
                </div>
                <p className="text-sm leading-relaxed text-slate-400">{game.description}</p>
                <span className="mt-auto text-xs text-slate-500">~{game.estimatedMinutes} min</span>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
