import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { learningPaths } from "@/data/learningPaths";
import { roadmapSpecializations } from "@/data/lessons/learningPathMeta";
import { useLessonProgress } from "@/context/LessonProgressContext";
import { paths } from "@/routes/paths";
import { ArrowRightIcon } from "@/components/ui/icons";

export function LearningRoadmap() {
  const { isPathCompleted, pathProgressPercent } = useLessonProgress();
  const corePaths = [...learningPaths].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, 5);
  const specPaths = learningPaths.filter((p) => p.specialization);

  return (
    <Card className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Learning roadmap</h2>
        <Link
          to={paths.lessons}
          className="inline-flex items-center gap-1 text-sm text-accent-300 hover:text-accent-200"
        >
          All paths <ArrowRightIcon className="text-xs" />
        </Link>
      </div>
      <CorePathsSection corePaths={corePaths} pathProgressPercent={pathProgressPercent} isPathCompleted={isPathCompleted} />
      <div className="border-t border-white/10 pt-4">
        <p className="mb-3 text-center text-sm font-medium text-slate-300">
          Choose a specialization
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {roadmapSpecializations.map((spec) => {
            const path = specPaths.find((p) => p.specialization === spec);
            if (!path) {
              return (
                <span
                  key={spec}
                  className="rounded-lg border border-white/5 px-3 py-2 text-center text-xs text-slate-500"
                >
                  {spec}
                </span>
              );
            }
            return (
              <Link
                key={spec}
                to={`${paths.lessons}/${path.id}`}
                className="rounded-lg border border-white/10 px-3 py-2 text-center text-xs text-accent-300 hover:bg-white/[0.04]"
              >
                {spec}
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function CorePathsSection({
  corePaths,
  pathProgressPercent,
  isPathCompleted,
}: {
  corePaths: typeof learningPaths;
  pathProgressPercent: (id: string) => number;
  isPathCompleted: (id: string) => boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Badge variant="accent">Start here</Badge>
      <Link
        to={`${paths.lessons}/fundamentals`}
        className="text-center text-lg font-semibold text-white hover:text-accent-200"
      >
        Cybersecurity Fundamentals
      </Link>
      {corePaths.slice(1).map((path) => (
        <div key={path.id} className="flex w-full max-w-md flex-col items-center">
          <span className="text-slate-600">↓</span>
          <Link
            to={`${paths.lessons}/${path.id}`}
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-center transition-colors hover:border-accent-400/30"
          >
            <span className="font-medium text-slate-100">{path.title}</span>
            <span className="mt-1 block text-xs text-slate-500">
              {pathProgressPercent(path.id)}% complete
              {isPathCompleted(path.id) && " · Certified"}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
}
