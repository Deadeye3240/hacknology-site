import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TargetIcon } from "@/components/ui/icons";
import { LabIsolationBanner } from "@/components/vulnerableLab/LabIsolationBanner";
import { vulnerableLabs } from "@/data/vulnerableLabs";
import { achievements } from "@/data/achievements";
import { useVulnerableLab } from "@/context/VulnerableLabContext";
import { difficultyBadgeVariant } from "@/lib/difficulty";
import { paths } from "@/routes/paths";

export default function VulnerableLabPage() {
  const { isCompleted, completedIds, totalXp, unlockedAchievements } = useVulnerableLab();

  return (
    <>
      <PageHeader
        eyebrow="Web Security Playground"
        title="Vulnerable Lab"
        description="Learn common web vulnerabilities through isolated, client-side simulations — fake data only, zero production risk."
        icon={TargetIcon}
      />
      <Section>
        <div className="flex flex-col gap-8">
          <LabIsolationBanner />

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <p className="text-2xl font-bold text-accent-300">{totalXp}</p>
              <p className="text-sm text-slate-400">Total XP earned</p>
            </Card>
            <Card className="p-5">
              <p className="text-2xl font-bold text-white">
                {completedIds.length} / {vulnerableLabs.length}
              </p>
              <p className="text-sm text-slate-400">Challenges completed</p>
            </Card>
            <Card className="p-5">
              <p className="text-2xl font-bold text-emerald-300">{unlockedAchievements.length}</p>
              <p className="text-sm text-slate-400">Achievements unlocked</p>
            </Card>
          </div>

          {unlockedAchievements.length > 0 && (
            <Card className="p-5">
              <h2 className="mb-3 text-base font-semibold text-white">Achievements</h2>
              <div className="flex flex-wrap gap-2">
                {achievements
                  .filter((a) => unlockedAchievements.some((u) => u.achievementId === a.id))
                  .map((a) => (
                    <Badge key={a.id} variant="success">
                      {a.title}
                    </Badge>
                  ))}
              </div>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {vulnerableLabs.map((challenge) => {
              const done = isCompleted(challenge.id);
              return (
                <Link
                  key={challenge.id}
                  to={`${paths.vulnerableLab}/${challenge.id}`}
                  className="block"
                >
                  <Card interactive className="flex h-full flex-col gap-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold text-white">{challenge.title}</h3>
                      {done ? (
                        <Badge variant="success">Complete</Badge>
                      ) : (
                        <Badge variant="neutral">+{challenge.xpReward} XP</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{challenge.description}</p>
                    <div className="mt-auto flex flex-wrap gap-2">
                      <Badge variant="accent">{challenge.category}</Badge>
                      <Badge variant={difficultyBadgeVariant(challenge.level)}>
                        {challenge.level}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        ~{challenge.estimatedMinutes} min
                      </span>
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
