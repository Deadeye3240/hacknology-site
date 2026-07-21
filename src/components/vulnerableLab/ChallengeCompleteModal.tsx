import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { VulnerableLabChallenge } from "@/types/gamification";
import { getVulnerableLabById } from "@/data/vulnerableLabs";
import { paths } from "@/routes/paths";

interface ChallengeCompleteModalProps {
  open: boolean;
  onClose: () => void;
  challenge: VulnerableLabChallenge;
  xpEarned: number;
  newAchievements: string[];
}

export function ChallengeCompleteModal({
  open,
  onClose,
  challenge,
  xpEarned,
  newAchievements,
}: ChallengeCompleteModalProps) {
  const next = challenge.nextChallengeId
    ? getVulnerableLabById(challenge.nextChallengeId)
    : undefined;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Challenge Complete!"
      footer={
        <>
          {next && (
            <Button to={`${paths.vulnerableLab}/${next.id}`}>
              Next: {next.title}
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Stay on challenge
          </Button>
          <Button to={paths.vulnerableLab} variant="ghost">
            Back to lab
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {xpEarned > 0 && (
          <p className="text-base font-semibold text-accent-300">+{xpEarned} XP earned</p>
        )}
        {newAchievements.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {newAchievements.map((id) => (
              <Badge key={id} variant="success">
                Achievement unlocked!
              </Badge>
            ))}
          </div>
        )}
        <div>
          <h3 className="mb-1 font-medium text-white">Vulnerability demonstrated</h3>
          <p className="text-slate-300">{challenge.vulnerability}</p>
        </div>
        <div>
          <h3 className="mb-1 font-medium text-white">Why it matters</h3>
          <p className="text-slate-300">{challenge.whyItMatters}</p>
        </div>
        <div>
          <h3 className="mb-1 font-medium text-white">How developers prevent it</h3>
          <p className="text-slate-300">{challenge.prevention}</p>
        </div>
      </div>
    </Modal>
  );
}
