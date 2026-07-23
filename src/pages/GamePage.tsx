import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { CyberRiderCanvas } from "@/components/games/CyberRiderCanvas";
import { PlayIcon } from "@/components/ui/icons";
import { paths } from "@/routes/paths";

export default function GamePage() {
  return (
    <>
      <PageHeader
        eyebrow="Nerd Games · Highlight"
        title="Cyber Rider"
        description="One-track stick-bike stunt run. Hit the gas, survive the hills and jumps, and chase a personal-best finish time."
        icon={PlayIcon}
      />
      <PageContainer className="py-8">
        <CyberRiderCanvas />
        <div className="mt-6 flex justify-center">
          <Button to={paths.games} variant="ghost" size="sm">
            Back to arcade
          </Button>
        </div>
      </PageContainer>
    </>
  );
}
