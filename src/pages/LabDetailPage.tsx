import { useParams } from "react-router-dom";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { LabDetail } from "@/components/labs/LabDetail";
import { FlaskIcon } from "@/components/ui/icons";
import { getLabById } from "@/data/labs";

export default function LabDetailPage() {
  const { labId } = useParams<{ labId: string }>();
  const lab = labId ? getLabById(labId) : undefined;

  return (
    <Section>
      {lab ? (
        <LabDetail lab={lab} />
      ) : (
        <EmptyState
          icon={FlaskIcon}
          title="Lab not found"
          description="We couldn't find that lab. It may have moved or the link may be incorrect."
          action={
            <Button to="/labs" variant="secondary" size="sm">
              Back to labs
            </Button>
          }
        />
      )}
    </Section>
  );
}
