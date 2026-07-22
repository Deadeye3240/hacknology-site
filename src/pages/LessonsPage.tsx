import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BookIcon, FlaskIcon, RadarIcon } from "@/components/ui/icons";
import { LearningPathCard } from "@/components/cards/LearningPathCard";
import { LearningRoadmap } from "@/components/education/LearningRoadmap";
import { SecurityNotice } from "@/components/ui/SecurityNotice";
import { learningPaths } from "@/data/learningPaths";
import { useLessonProgress } from "@/context/LessonProgressContext";
import { paths } from "@/routes/paths";

export default function LessonsPage() {
  const {
    completedIds,
    totalXp,
    pathProgressPercent,
    recommendedNextLesson,
    isPathCompleted,
    assessmentPendingForPath,
  } = useLessonProgress();

  const sorted = [...learningPaths].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const featured = sorted[0];
  const continuePath = sorted.find((p) => {
    const pct = pathProgressPercent(p.id);
    return pct > 0 && pct < 100 && !isPathCompleted(p.id);
  });
  const continueLessonId = continuePath ? recommendedNextLesson(continuePath.id) : undefined;
  const assessmentPendingPath = sorted.find((p) => assessmentPendingForPath(p.id));

  const beginner = sorted.filter((p) => p.level === "Beginner");
  const intermediate = sorted.filter((p) => p.level === "Intermediate");
  const advanced = sorted.filter((p) => p.level === "Advanced");
  const completedPaths = sorted.filter((p) => isPathCompleted(p.id));

  return (
    <>
      <PageHeader
        eyebrow="Learn"
        title="Learning Center"
        description="Structured cybersecurity education — from fundamentals through specializations, with knowledge checks and hands-on labs."
        icon={BookIcon}
      />
      <Section>
        <div className="flex flex-col gap-10">
          <SecurityNotice compact />

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <p className="text-2xl font-bold text-accent-300">{totalXp}</p>
              <p className="text-sm text-slate-400">Lesson XP earned</p>
            </Card>
            <Card className="p-5">
              <p className="text-2xl font-bold text-white">{completedIds.length}</p>
              <p className="text-sm text-slate-400">Lessons completed</p>
            </Card>
            <Card className="p-5">
              <p className="text-2xl font-bold text-emerald-300">{completedPaths.length}</p>
              <p className="text-sm text-slate-400">Paths certified</p>
            </Card>
          </div>

          {continuePath && continueLessonId && (
            <Card className="flex flex-col gap-3 border-accent-400/25 bg-accent-400/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-accent-300">
                  Continue learning
                </p>
                <h2 className="text-lg font-semibold text-white">{continuePath.title}</h2>
                <p className="text-sm text-slate-400">{pathProgressPercent(continuePath.id)}% complete</p>
              </div>
              <Button to={`${paths.lessons}/${continuePath.id}/${continueLessonId}`}>
                Resume →
              </Button>
            </Card>
          )}

          {assessmentPendingPath && (
            <Card className="flex flex-col gap-3 border-amber-400/25 bg-amber-400/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-amber-300">
                  Final assessment required
                </p>
                <h2 className="text-lg font-semibold text-white">{assessmentPendingPath.title}</h2>
                <p className="text-sm text-slate-400">
                  All lessons complete — pass the final assessment to earn certification and unlock
                  dependent paths.
                </p>
              </div>
              <Button to={`${paths.lessons}/${assessmentPendingPath.id}/assessment`}>
                Take assessment →
              </Button>
            </Card>
          )}

          {featured && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">Featured learning path</h2>
              <LearningPathCard
                path={{
                  ...featured,
                  moduleCount: featured.moduleCount,
                }}
                progress={pathProgressPercent(featured.id)}
              />
            </div>
          )}

          <LearningRoadmap />

          <PathGroup title="Beginner paths" paths={beginner} pathProgressPercent={pathProgressPercent} />
          <PathGroup title="Intermediate paths" paths={intermediate} pathProgressPercent={pathProgressPercent} />
          {advanced.length > 0 && (
            <PathGroup title="Advanced paths" paths={advanced} pathProgressPercent={pathProgressPercent} />
          )}

          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Hands-on labs</h2>
            <LabsGrid />
          </div>

          {completedPaths.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">Completed paths</h2>
              <div className="flex flex-wrap gap-2">
                {completedPaths.map((p) => (
                  <Badge key={p.id} variant="success">
                    {p.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}

function PathGroup({
  title,
  paths: groupPaths,
  pathProgressPercent,
}: {
  title: string;
  paths: typeof learningPaths;
  pathProgressPercent: (id: string) => number;
}) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groupPaths.map((path) => (
          <LearningPathCard
            key={path.id}
            path={path}
            progress={pathProgressPercent(path.id)}
          />
        ))}
      </div>
    </div>
  );
}

function LabsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Link to={paths.vulnerableLab}>
        <Card interactive className="flex h-full flex-col gap-2 p-5">
          <FlaskIcon className="text-2xl text-accent-300" />
          <h3 className="font-semibold text-white">Vulnerable Lab</h3>
          <p className="text-sm text-slate-400">Sandboxed web security challenges</p>
        </Card>
      </Link>
      <Link to={paths.scanme}>
        <Card interactive className="flex h-full flex-col gap-2 p-5">
          <RadarIcon className="text-2xl text-accent-300" />
          <h3 className="font-semibold text-white">ScanMe Lab</h3>
          <p className="text-sm text-slate-400">Authorized Nmap reconnaissance practice</p>
        </Card>
      </Link>
      <Link to={paths.games}>
        <Card interactive className="flex h-full flex-col gap-2 p-5">
          <BookIcon className="text-2xl text-accent-300" />
          <h3 className="font-semibold text-white">Nerd Games</h3>
          <p className="text-sm text-slate-400">Trivia, crypto puzzles, and more</p>
        </Card>
      </Link>
    </div>
  );
}
