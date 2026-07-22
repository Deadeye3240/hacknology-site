import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ScanMeMission } from "@/data/scanme";
import { getNextMission } from "@/data/scanme";
import { scanMeAchievements } from "@/data/scanmeAchievements";
import { paths } from "@/routes/paths";

interface ScanMeMissionCompleteProps {
  mission: ScanMeMission;
  xpEarned: number;
  newAchievements: string[];
}

export function ScanMeMissionComplete({ mission, xpEarned, newAchievements }: ScanMeMissionCompleteProps) {
  const next = getNextMission(mission.id);

  return (
    <Card className="border-emerald-500/25 bg-emerald-500/[0.06] p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-lg font-semibold text-emerald-300">✓ Mission Complete</span>
        {xpEarned > 0 && (
          <Badge variant="success">+{xpEarned} XP</Badge>
        )}
      </div>

      {newAchievements.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {newAchievements.map((id) => {
            const def = scanMeAchievements.find((a) => a.id === id);
            return (
              <Badge key={id} variant="success">
                {def?.title ?? "Achievement unlocked"}
              </Badge>
            );
          })}
        </div>
      )}

      <div className="mb-4">
        <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-400">
          What you just learned
        </h3>
        <p className="text-sm leading-relaxed text-slate-200">{mission.learnSummary}</p>
      </div>

      {next && (
        <div className="mb-4 rounded-lg border border-white/10 bg-base-950/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-300">Next mission unlocked</p>
          <p className="mt-1 font-medium text-white">{next.title}</p>
          <p className="text-sm text-slate-400">{next.objective}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {next && (
          <Button to={`${paths.scanme}/${next.id}`} size="sm">
            Continue — {next.title}
          </Button>
        )}
        <Button to={paths.scanme} variant="secondary" size="sm">
          Mission map
        </Button>
      </div>
    </Card>
  );
}
