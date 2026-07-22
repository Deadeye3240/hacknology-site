import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScanMeTerminal } from "@/components/scanme/ScanMeTerminal";
import { ScanMeMissionComplete } from "@/components/scanme/ScanMeMissionComplete";
import { getScanMeMission, getScanMeLevel } from "@/data/scanme";
import { useScanMe } from "@/context/ScanMeContext";
import { paths } from "@/routes/paths";

export default function ScanMeMissionPage() {
  const { missionId } = useParams();
  const mission = missionId ? getScanMeMission(missionId) : undefined;
  const { completeMission, isMissionComplete, isMissionUnlocked, missionRecord } = useScanMe();
  const [completion, setCompletion] = useState<{ xp: number; achievements: string[] } | null>(null);

  if (!mission) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          title="Mission not found"
          description="This ScanMe mission does not exist."
          action={<Button to={paths.scanme}>Back to ScanMe</Button>}
        />
      </PageContainer>
    );
  }

  const level = getScanMeLevel(mission.levelId);
  const done = isMissionComplete(mission.id);
  const unlocked = isMissionUnlocked(mission.id);
  const record = missionRecord(mission.id);

  if (!unlocked) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          title="Mission locked"
          description="Complete the previous mission to unlock this one."
          action={<Button to={paths.scanme}>Back to ScanMe</Button>}
        />
      </PageContainer>
    );
  }

  function handleComplete(hintsUsed: number) {
    if (done) return;
    const result = completeMission(mission!.id, hintsUsed);
    if (result.success && !result.alreadyComplete) {
      setCompletion({ xp: result.xpEarned, achievements: result.newAchievements });
    }
  }

  return (
    <PageContainer className="py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              to={paths.scanme}
              className="text-xs font-medium uppercase tracking-wide text-slate-500 hover:text-accent-300"
            >
              ← ScanMe training
            </Link>
            <p className="mt-2 font-mono text-xs text-accent-300/80">
              MISSION {mission.code}
              {level && ` · ${level.title.toUpperCase()}`}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white">{mission.title}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {done && <Badge variant="success">Complete</Badge>}
            {!done && <Badge variant="neutral">+{mission.xpReward} XP</Badge>}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="flex flex-col gap-4">
            <ScanMeTerminal
              mission={mission}
              completed={done}
              onComplete={handleComplete}
            />
            {(done || completion) && (
              <ScanMeMissionComplete
                mission={mission}
                xpEarned={completion?.xp ?? record?.xpEarned ?? 0}
                newAchievements={completion?.achievements ?? []}
              />
            )}
          </div>

          <aside className="flex flex-col gap-3">
            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Target</p>
              <p className="mt-1 font-mono text-lg text-accent-200">{mission.targetIp}</p>
              <p className="mt-2 text-xs text-slate-500">Authorized simulated training target</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Objective</p>
              <p className="mt-2 text-sm text-slate-200">{mission.objective}</p>
            </Card>
            <Card className="border-white/5 bg-white/[0.02] p-4">
              <p className="text-xs text-slate-500">
                Simulated environment only — no real network scans are performed from your browser.
              </p>
            </Card>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}
