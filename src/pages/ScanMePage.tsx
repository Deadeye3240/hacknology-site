import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RadarIcon } from "@/components/ui/icons";
import {
  scanMeLevels,
  scanMeMissions,
  getMissionsForLevel,
  SCANME_TARGET_IP,
} from "@/data/scanme";
import { scanMeAchievements } from "@/data/scanmeAchievements";
import { useScanMe } from "@/context/ScanMeContext";
import { paths } from "@/routes/paths";

export default function ScanMePage() {
  const { totalXp, unlockedAchievements, isMissionComplete, isMissionUnlocked, completedCount, resetProgress } =
    useScanMe();

  const [confirmReset, setConfirmReset] = useState(false);
  const progressPct = Math.round((completedCount / scanMeMissions.length) * 100);
  const nextMission = scanMeMissions.find((m) => isMissionUnlocked(m.id) && !isMissionComplete(m.id));

  return (
    <>
      <PageHeader
        eyebrow="Interactive training"
        title="ScanMe — Nmap Teacher"
        description="Learn Nmap from zero through hands-on terminal missions. Type real commands, read simulated output, and progress one concept at a time."
        icon={RadarIcon}
        actions={
          nextMission ? (
            <Button to={`${paths.scanme}/${nextMission.id}`} size="sm">
              {completedCount === 0 ? "Start training" : "Continue"}
            </Button>
          ) : completedCount >= scanMeMissions.length ? (
            <Badge variant="success">Curriculum complete</Badge>
          ) : null
        }
      />
      <Section>
        <div className="flex flex-col gap-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-emerald-500/20 bg-base-950 p-4 sm:col-span-2">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Your journey</p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {completedCount}
                    <span className="text-lg font-normal text-slate-500"> / {scanMeMissions.length} missions</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-accent-300">{totalXp}</p>
                  <p className="text-xs text-slate-500">ScanMe XP</p>
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-accent-400 transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="mt-2 font-mono text-xs text-slate-500">
                Target lab IP: <span className="text-accent-200">{SCANME_TARGET_IP}</span>
              </p>
            </Card>

            {unlockedAchievements.length > 0 && (
              <Card className="p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Achievements</p>
                <div className="flex flex-wrap gap-1.5">
                  {scanMeAchievements
                    .filter((a) => unlockedAchievements.includes(a.id))
                    .map((a) => (
                      <Badge key={a.id} variant="success">
                        {a.title}
                      </Badge>
                    ))}
                </div>
              </Card>
            )}
          </div>

          {scanMeLevels.map((level) => {
            const missions = getMissionsForLevel(level.id);
            const levelDone = missions.every((m) => isMissionComplete(m.id));

            return (
              <div key={level.id} className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-white">
                    Level {level.order} — {level.title}
                  </h2>
                  {levelDone && <Badge variant="success">Complete</Badge>}
                </div>
                <p className="text-sm text-slate-400">{level.description}</p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {missions.map((mission) => {
                    const done = isMissionComplete(mission.id);
                    const unlocked = isMissionUnlocked(mission.id);

                    return (
                      <Link
                        key={mission.id}
                        to={unlocked ? `${paths.scanme}/${mission.id}` : "#"}
                        onClick={(e) => !unlocked && e.preventDefault()}
                        className={unlocked ? "block" : "block cursor-not-allowed"}
                      >
                        <Card
                          interactive={unlocked}
                          className={`flex h-full flex-col gap-2 p-4 ${!unlocked ? "opacity-50" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-xs text-accent-300/80">M{mission.code}</span>
                            {done ? (
                              <Badge variant="success">Done</Badge>
                            ) : unlocked ? (
                              <Badge variant="neutral">+{mission.xpReward} XP</Badge>
                            ) : (
                              <Badge variant="neutral">Locked</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-white">{mission.title}</h3>
                          <p className="line-clamp-2 text-sm text-slate-400">{mission.objective}</p>
                          <p className="mt-auto text-xs text-slate-500">~{mission.estimatedMinutes} min</p>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {completedCount > 0 && (
            <div className="flex flex-col items-end gap-2">
              {confirmReset ? (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <span className="text-sm text-slate-400">Reset all ScanMe progress?</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmReset(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      resetProgress();
                      setConfirmReset(false);
                    }}
                  >
                    Confirm reset
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setConfirmReset(true)}>
                  Reset ScanMe progress
                </Button>
              )}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
