import { Link } from "react-router-dom";
import type { LearningPath } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRightIcon } from "@/components/ui/icons";
import { difficultyBadgeVariant } from "@/lib/difficulty";

interface LearningPathCardProps {
  path: LearningPath;
  progress?: number;
}

/** Preview card for a structured learning path. */
export function LearningPathCard({ path, progress = 0 }: LearningPathCardProps) {
  const { id, title, description, icon: Icon, level, moduleCount, estimatedHours, skills } = path;

  return (
    <Card interactive className="flex h-full flex-col gap-4">
      <PathCardHeader Icon={Icon} level={level} />
      <PathCardBody title={title} description={description} skills={skills} />
      {progress > 0 && (
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-accent-400" style={{ width: `${progress}%` }} />
        </div>
      )}
      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-xs font-medium text-slate-500">
          {moduleCount} lessons
          {estimatedHours ? ` · ~${estimatedHours}h` : ""}
          {progress > 0 ? ` · ${progress}%` : ""}
        </span>
        <Link
          to={`/lessons/${id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent-300 transition-colors hover:text-accent-200"
        >
          Explore
          <ArrowRightIcon className="text-sm" />
        </Link>
      </div>
    </Card>
  );
}

function PathCardHeader({
  Icon,
  level,
}: {
  Icon: LearningPath["icon"];
  level: LearningPath["level"];
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-xl text-accent-300">
        <Icon />
      </span>
      <Badge variant={difficultyBadgeVariant(level)}>{level}</Badge>
    </div>
  );
}

function PathCardBody({
  title,
  description,
  skills,
}: {
  title: string;
  description: string;
  skills?: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      {skills && skills.length > 0 && (
        <p className="text-xs text-slate-500">{skills.slice(0, 3).join(" · ")}</p>
      )}
    </div>
  );
}
