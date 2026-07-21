import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { KnowledgeCheck } from "@/components/education/KnowledgeCheck";
import { getPathAssessment } from "@/data/lessons";
import { learningPaths } from "@/data/learningPaths";
import { useLessonProgress } from "@/context/LessonProgressContext";
import { paths } from "@/routes/paths";
import { TargetIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/Badge";

export default function PathAssessmentPage() {
  const { pathId } = useParams();
  const path = learningPaths.find((p) => p.id === pathId);
  const assessment = pathId ? getPathAssessment(pathId) : undefined;
  const { completePathAssessment, isPathCompleted } = useLessonProgress();

  if (!path || !assessment) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          title="Assessment not found"
          description="This path assessment does not exist."
          action={<Button to={paths.lessons}>Back to Learn</Button>}
        />
      </PageContainer>
    );
  }

  const done = isPathCompleted(path.id);

  return (
    <>
      <PageHeader
        eyebrow={path.title}
        title={assessment.title}
        description={`Pass with ${assessment.passingScore}/${assessment.questions.length} correct to earn +${assessment.xpReward} XP and your path certificate.`}
        icon={TargetIcon}
      />
      <PageContainer className="py-10">
        <AssessmentContent
          assessment={assessment}
          done={done}
          onPass={(score: number, total: number) => completePathAssessment(path.id, score, total)}
          pathId={path.id}
        />
      </PageContainer>
    </>
  );
}

function AssessmentContent({
  assessment,
  done,
  onPass,
  pathId,
}: {
  assessment: NonNullable<ReturnType<typeof getPathAssessment>>;
  done: boolean;
  onPass: (score: number, total: number) => void;
  pathId: string;
}) {
  if (done) {
    return (
      <Card className="flex max-w-xl flex-col gap-4 p-6">
        <Badge variant="success">Path certified</Badge>
        <p className="text-slate-300">
          You passed the final assessment and completed this learning path. +{assessment.xpReward} XP
          awarded.
        </p>
        <Button to={`${paths.lessons}/${pathId}`}>Back to path</Button>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl">
      <KnowledgeCheck
        questions={assessment.questions}
        onPass={onPass}
        alreadyPassed={false}
      />
    </div>
  );
}
