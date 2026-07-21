import { Link, useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CheckIcon, LockIcon } from "@/components/ui/icons";
import { learningPaths } from "@/data/learningPaths";
import { getLessonsByPath, getPathAssessment } from "@/data/lessons";
import { useLessonProgress } from "@/context/LessonProgressContext";
import { difficultyBadgeVariant } from "@/lib/difficulty";
import { paths } from "@/routes/paths";

export default function LessonPathPage() {
  const { pathId } = useParams();
  const {
    isCompleted,
    isLessonUnlocked,
    isPathUnlocked,
    isPathCompleted,
    pathProgressPercent,
    recommendedNextLesson,
  } = useLessonProgress();
  const path = learningPaths.find((p) => p.id === pathId);
  const pathLessons = pathId ? getLessonsByPath(pathId) : [];
  const assessment = pathId ? getPathAssessment(pathId) : undefined;
  const nextId = pathId ? recommendedNextLesson(pathId) : undefined;

  if (!path) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          title="Learning path not found"
          description="This path does not exist."
          action={<Button to={paths.lessons}>Back to Learn</Button>}
        />
      </PageContainer>
    );
  }

  const locked = pathId ? !isPathUnlocked(pathId) : false;
  const completed = pathLessons.filter((l) => isCompleted(l.id)).length;
  const allLessonsDone = completed === pathLessons.length && pathLessons.length > 0;
  const progress = pathId ? pathProgressPercent(pathId) : 0;

  if (locked) {
    const prereq = learningPaths.find((p) => p.id === path.prerequisitePathId);
    return (
      <PageContainer className="py-16">
        <EmptyState
          title="Path locked"
          description={`Complete the final assessment for ${prereq?.title ?? "the prerequisite path"} to unlock this path.`}
          action={<Button to={prereq ? `${paths.lessons}/${prereq.id}` : paths.lessons}>Go to prerequisite</Button>}
        />
      </PageContainer>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Learning path"
        title={path.title}
        description={path.description}
        icon={path.icon}
        actions={
          <div className="flex flex-wrap gap-2">
            <Badge variant={difficultyBadgeVariant(path.level)}>{path.level}</Badge>
            {isPathCompleted(path.id) && <Badge variant="success">Path certified</Badge>}
          </div>
        }
      />
      <PageContainer className="py-10">
        <PathContent
          path={path}
          pathLessons={pathLessons}
          progress={progress}
          completed={completed}
          allLessonsDone={allLessonsDone}
          assessment={assessment}
          nextId={nextId}
          isCompleted={isCompleted}
          isLessonUnlocked={isLessonUnlocked}
          isPathCompleted={isPathCompleted}
        />
      </PageContainer>
    </>
  );
}

function PathContent({
  path,
  pathLessons,
  progress,
  completed,
  allLessonsDone,
  assessment,
  nextId,
  isCompleted,
  isLessonUnlocked,
  isPathCompleted,
}: {
  path: (typeof learningPaths)[0];
  pathLessons: ReturnType<typeof getLessonsByPath>;
  progress: number;
  completed: number;
  allLessonsDone: boolean;
  assessment: ReturnType<typeof getPathAssessment>;
  nextId: string | undefined;
  isCompleted: (id: string) => boolean;
  isLessonUnlocked: (pathId: string, lessonId: string) => boolean;
  isPathCompleted: (pathId: string) => boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Progress</span>
          <span className="font-medium text-white">{progress}%</span>
        </div>
        <PathProgressBar progress={progress} />
        <p className="text-sm text-slate-400">
          {completed} of {pathLessons.length} lessons completed
          {path.estimatedHours && ` · ~${path.estimatedHours} hours total`}
        </p>
        {path.skills && (
          <div className="flex flex-wrap gap-2">
            {path.skills.map((s) => (
              <Badge key={s} variant="neutral">
                {s}
              </Badge>
            ))}
          </div>
        )}
        {nextId && !isPathCompleted(path.id) && (
          <Button to={`${paths.lessons}/${path.id}/${nextId}`} size="sm" className="self-start">
            Continue learning →
          </Button>
        )}
      </Card>

      {path.practiceLinks && path.practiceLinks.length > 0 && (
        <Card className="flex flex-wrap gap-2 p-4">
          <span className="w-full text-sm font-medium text-slate-300">Associated labs</span>
          {path.practiceLinks.map((link) => (
            <Button key={link.to} to={link.to} variant="secondary" size="sm">
              {link.label}
            </Button>
          ))}
        </Card>
      )}

      <ul className="flex flex-col gap-3">
        {pathLessons.map((lesson, index) => {
          const done = isCompleted(lesson.id);
          const unlocked = isLessonUnlocked(path.id, lesson.id);
          return (
            <li key={lesson.id}>
              {unlocked ? (
                <Link to={`${paths.lessons}/${path.id}/${lesson.id}`} className="block">
                  <LessonRow lesson={lesson} index={index} done={done} locked={false} />
                </Link>
              ) : (
                <LessonRow lesson={lesson} index={index} done={done} locked />
              )}
            </li>
          );
        })}
      </ul>

      {assessment && allLessonsDone && (
        <Card className="flex flex-col gap-3 border-accent-400/20 bg-accent-400/[0.04] p-5">
          <h3 className="text-base font-semibold text-white">Final assessment</h3>
          <p className="text-sm text-slate-400">
            Pass the path assessment to earn +{assessment.xpReward} XP and your completion badge.
          </p>
          {isPathCompleted(path.id) ? (
            <Badge variant="success">Assessment passed</Badge>
          ) : (
            <Button to={`${paths.lessons}/${path.id}/assessment`} size="sm" className="self-start">
              Take final assessment
            </Button>
          )}
        </Card>
      )}

      <Button to={paths.lessons} variant="ghost" size="sm" className="self-start">
        ← All learning paths
      </Button>
    </div>
  );
}

function PathProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-accent-400 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function LessonRow({
  lesson,
  index,
  done,
  locked,
}: {
  lesson: ReturnType<typeof getLessonsByPath>[0];
  index: number;
  done: boolean;
  locked: boolean;
}) {
  return (
    <Card
      interactive={!locked}
      className={`flex items-start justify-between gap-4 p-5 ${locked ? "opacity-60" : ""}`}
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Lesson {index + 1}
        </span>
        <h3 className="text-base font-semibold text-white">{lesson.title}</h3>
        <p className="text-sm text-slate-400">{lesson.summary}</p>
        <span className="text-xs text-slate-500">~{lesson.estimatedMinutes} min</span>
      </div>
      {locked ? (
        <LockIcon className="text-slate-500" />
      ) : done ? (
        <Badge variant="success">
          <CheckIcon className="text-xs" /> Done
        </Badge>
      ) : null}
    </Card>
  );
}
