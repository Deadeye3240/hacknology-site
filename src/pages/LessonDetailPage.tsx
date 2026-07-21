import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListChecksIcon } from "@/components/ui/icons";
import { KnowledgeCheck } from "@/components/education/KnowledgeCheck";
import { LessonExampleBlock } from "@/components/education/LessonExampleBlock";
import { getLessonById, getLessonsByPath } from "@/data/lessons";
import { learningPaths } from "@/data/learningPaths";
import { useLessonProgress } from "@/context/LessonProgressContext";
import { paths } from "@/routes/paths";

export default function LessonDetailPage() {
  const { pathId, lessonId } = useParams();
  const {
    isCompleted,
    isLessonUnlocked,
    getQuizResult,
    completeLessonWithQuiz,
    resetLesson,
  } = useLessonProgress();
  const lesson = lessonId ? getLessonById(lessonId) : undefined;
  const path = learningPaths.find((p) => p.id === pathId);
  const pathLessons = pathId ? getLessonsByPath(pathId) : [];
  const index = pathLessons.findIndex((l) => l.id === lessonId);
  const next = index >= 0 ? pathLessons[index + 1] : undefined;
  const done = lessonId ? isCompleted(lessonId) : false;
  const unlocked = pathId && lessonId ? isLessonUnlocked(pathId, lessonId) : false;
  const quizResult = lessonId ? getQuizResult(lessonId) : undefined;

  if (!lesson || !path || lesson.pathId !== pathId) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          title="Lesson not found"
          description="This lesson does not exist or belongs to a different path."
          action={<Button to={paths.lessons}>Back to Learn</Button>}
        />
      </PageContainer>
    );
  }

  if (!unlocked) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          title="Lesson locked"
          description="Complete the previous lesson and pass its knowledge check to unlock this one."
          action={<Button to={`${paths.lessons}/${pathId}`}>Back to path</Button>}
        />
      </PageContainer>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={path.title}
        title={lesson.title}
        description={lesson.summary}
        icon={ListChecksIcon}
      />
      <PageContainer className="py-10">
        <LessonContent
          lesson={lesson}
          done={done}
          quizResult={quizResult}
          onPass={(score: number, total: number) => completeLessonWithQuiz(lesson.id, score, total)}
          onReset={() => resetLesson(lesson.id)}
          next={next}
          path={path}
        />
      </PageContainer>
    </>
  );
}

function LessonContent({
  lesson,
  done,
  quizResult,
  onPass,
  onReset,
  next,
  path,
}: {
  lesson: NonNullable<ReturnType<typeof getLessonById>>;
  done: boolean;
  quizResult: ReturnType<ReturnType<typeof useLessonProgress>["getQuizResult"]>;
  onPass: (score: number, total: number) => void;
  onReset: () => void;
  next: ReturnType<typeof getLessonById>;
  path: (typeof learningPaths)[0];
}) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-white">Introduction</h2>
        <p className="text-sm leading-relaxed text-slate-300">{lesson.introduction}</p>
      </Card>

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-white">Learning objectives</h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
          {lesson.objectives.map((obj) => (
            <li key={obj}>{obj}</li>
          ))}
        </ul>
      </Card>

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-white">Core concepts</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-slate-300">
          {lesson.coreConcepts.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-white">Detailed explanation</h2>
        {lesson.detailedExplanation.split("\n\n").map((para) => (
          <p key={para.slice(0, 40)} className="text-sm leading-relaxed text-slate-300">
            {para}
          </p>
        ))}
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-white">Real-world example</h2>
        <p className="text-sm leading-relaxed text-slate-300">{lesson.realWorldExample}</p>
      </Card>

      <Card className="flex flex-col gap-2 border-accent-400/15 bg-accent-400/[0.03]">
        <h2 className="text-lg font-semibold text-white">Cybersecurity scenario</h2>
        <p className="text-sm leading-relaxed text-slate-300">{lesson.scenario}</p>
      </Card>

      {lesson.practicalExamples.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-white">Practical examples</h2>
          {lesson.practicalExamples.map((ex) => (
            <LessonExampleBlock key={ex.title ?? ex.content.slice(0, 30)} example={ex} />
          ))}
        </div>
      )}

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-white">Key terminology</h2>
        <dl className="grid gap-2 text-sm">
          {lesson.terminology.map((t) => (
            <TermRow key={t.term} term={t.term} definition={t.definition} />
          ))}
        </dl>
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-white">Common mistakes</h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
          {lesson.commonMistakes.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-white">Defensive considerations</h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
          {lesson.defensiveConsiderations.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-white">Summary</h2>
        <p className="text-sm leading-relaxed text-slate-300">{lesson.conclusion}</p>
      </Card>

      {lesson.practiceLink && (
        <Card className="flex flex-col gap-3 border-emerald-400/20 bg-emerald-400/[0.04] sm:flex-row sm:items-center sm:justify-between">
          <PracticeCallout lesson={lesson} />
          <Button to={lesson.practiceLink.to} variant="secondary" size="sm" className="shrink-0">
            {lesson.practiceLink.label}
          </Button>
        </Card>
      )}

      <KnowledgeCheck
        questions={lesson.knowledgeCheck}
        onPass={onPass}
        alreadyPassed={done}
        previousScore={
          quizResult ? { score: quizResult.quizScore, total: quizResult.quizTotal } : undefined
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        {done && (
          <>
            <Badge variant="success">Lesson complete · +25 XP</Badge>
            <Button variant="ghost" size="sm" onClick={onReset}>
              Reset progress
            </Button>
          </>
        )}
        {next && done && (
          <Button to={`${paths.lessons}/${path.id}/${next.id}`} variant="secondary" size="sm">
            Next lesson →
          </Button>
        )}
        <Button to={`${paths.lessons}/${path.id}`} variant="ghost" size="sm">
          Back to path
        </Button>
      </div>
    </div>
  );
}

function TermRow({ term, definition }: { term: string; definition: string }) {
  return (
    <div className="grid gap-1 border-b border-white/5 pb-2 sm:grid-cols-3">
      <dt className="font-medium text-accent-200">{term}</dt>
      <dd className="text-slate-400 sm:col-span-2">{definition}</dd>
    </div>
  );
}

function PracticeCallout({ lesson }: { lesson: NonNullable<ReturnType<typeof getLessonById>> }) {
  if (!lesson.practiceLink) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-emerald-200">Hands-on practice</h3>
      <p className="text-sm text-slate-400">
        Apply what you learned in the {lesson.practiceLink.label} environment.
      </p>
    </div>
  );
}
