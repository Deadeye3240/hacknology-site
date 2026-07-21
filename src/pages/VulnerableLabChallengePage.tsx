import { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { TargetIcon } from "@/components/ui/icons";
import { LabIsolationBanner } from "@/components/vulnerableLab/LabIsolationBanner";
import { HintPanel } from "@/components/vulnerableLab/HintPanel";
import { ChallengeCompleteModal } from "@/components/vulnerableLab/ChallengeCompleteModal";
import { ChallengeSimulator } from "@/components/vulnerableLab/challenges";
import { getVulnerableLabById } from "@/data/vulnerableLabs";
import { useVulnerableLab } from "@/context/VulnerableLabContext";
import { difficultyBadgeVariant } from "@/lib/difficulty";
import { paths } from "@/routes/paths";

export default function VulnerableLabChallengePage() {
  const { challengeId } = useParams();
  const challenge = challengeId ? getVulnerableLabById(challengeId) : undefined;
  const { isCompleted, completeChallenge } = useVulnerableLab();
  const [showComplete, setShowComplete] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const solvedRef = useRef(false);

  const handleSolve = useCallback(() => {
    if (!challenge || isCompleted(challenge.id) || solvedRef.current) return;
    solvedRef.current = true;
    const result = completeChallenge(challenge.id);
    setXpEarned(result.xpEarned);
    setNewAchievements(result.newAchievements);
    setShowComplete(true);
  }, [challenge, isCompleted, completeChallenge]);

  if (!challenge) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          title="Challenge not found"
          description="This challenge does not exist in the Vulnerable Lab."
          action={<Button to={paths.vulnerableLab}>Back to lab</Button>}
        />
      </PageContainer>
    );
  }

  const done = isCompleted(challenge.id);

  return (
    <>
      <PageHeader
        eyebrow="Vulnerable Lab"
        title={challenge.title}
        description={challenge.description}
        icon={TargetIcon}
        actions={
          <div className="flex flex-wrap gap-2">
            <Badge variant="accent">{challenge.category}</Badge>
            <Badge variant={difficultyBadgeVariant(challenge.level)}>{challenge.level}</Badge>
            {done && <Badge variant="success">Completed</Badge>}
          </div>
        }
      />
      <PageContainer className="py-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <LabIsolationBanner />

          <Card className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-white">Scenario</h2>
            <p className="text-sm leading-relaxed text-slate-300">{challenge.scenario}</p>
          </Card>

          <Card className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-white">Learning objectives</h2>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
              {challenge.objectives.map((obj) => (
                <li key={obj}>{obj}</li>
              ))}
            </ul>
          </Card>

          <Card className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-white">Instructions</h2>
            <ol className="list-inside list-decimal space-y-1 text-sm text-slate-300">
              {challenge.instructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </Card>

          <div>
            <h2 className="mb-3 text-base font-semibold text-white">Interactive environment</h2>
            <ChallengeSimulator challenge={challenge} onSolve={handleSolve} />
          </div>

          {!done && <HintPanel hints={challenge.hints} />}

          <div className="flex gap-2">
            <Button to={paths.vulnerableLab} variant="ghost" size="sm">
              ← All challenges
            </Button>
            {challenge.nextChallengeId && (
              <Button
                to={`${paths.vulnerableLab}/${challenge.nextChallengeId}`}
                variant="secondary"
                size="sm"
              >
                Next challenge →
              </Button>
            )}
          </div>
        </div>
      </PageContainer>

      <ChallengeCompleteModal
        open={showComplete}
        onClose={() => setShowComplete(false)}
        challenge={challenge}
        xpEarned={xpEarned}
        newAchievements={newAchievements}
      />
    </>
  );
}
