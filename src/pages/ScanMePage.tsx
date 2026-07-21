import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RadarIcon } from "@/components/ui/icons";
import { LabIsolationBanner } from "@/components/vulnerableLab/LabIsolationBanner";
import { scanMeMissions, SCANME_TARGET_HOST } from "@/data/scanme";
import { scanMeAchievements } from "@/data/scanmeAchievements";
import { useScanMe } from "@/context/ScanMeContext";
import { difficultyBadgeVariant } from "@/lib/difficulty";
import { paths } from "@/routes/paths";

export default function ScanMePage() {
  const { totalXp, unlockedAchievements, isMissionComplete } = useScanMe();

  return (
    <>
      <PageHeader
        eyebrow="Authorized reconnaissance"
        title="ScanMe Lab"
        description="Learn Nmap and network reconnaissance against an isolated training target — never the production Hacknology site."
        icon={RadarIcon}
      />
      <Section>
        <div className="flex flex-col gap-8">
          <LabIsolationBanner />

          <Card className="border-accent-400/20 bg-accent-400/[0.04] p-5">
            <h2 className="text-base font-semibold text-white">Authorized target</h2>
            <p className="mt-2 font-mono text-sm text-accent-200">{SCANME_TARGET_HOST}</p>
            <p className="mt-2 text-sm text-slate-400">
              Deploy the isolated lab locally (see docs/SCANME-LAB.md) or use the built-in simulator on
              each mission. Only scan systems you own or have explicit permission to test.
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-2xl font-bold text-accent-300">{totalXp}</p>
            <p className="text-sm text-slate-400">ScanMe XP earned</p>
          </Card>

          {unlockedAchievements.length > 0 && (
            <Card className="p-5">
              <h2 className="mb-3 text-base font-semibold text-white">Achievements</h2>
              <div className="flex flex-wrap gap-2">
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

          <div className="grid gap-4 sm:grid-cols-2">
            {scanMeMissions.map((mission) => {
              const done = isMissionComplete(mission.id);
              return (
                <Link key={mission.id} to={`${paths.scanme}/${mission.id}`} className="block">
                  <Card interactive className="flex h-full flex-col gap-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white">{mission.title}</h3>
                      {done ? (
                        <Badge variant="success">Complete</Badge>
                      ) : (
                        <Badge variant="neutral">+{mission.xpReward} XP</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{mission.description}</p>
                    <div className="mt-auto flex gap-2">
                      <Badge variant={difficultyBadgeVariant(mission.level)}>{mission.level}</Badge>
                      <span className="text-xs text-slate-500">~{mission.estimatedMinutes} min</span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
}
