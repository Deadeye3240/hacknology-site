import { Link } from "react-router-dom";
import type { LearningPath } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRightIcon } from "@/components/ui/icons";
import { difficultyBadgeVariant } from "@/lib/difficulty";

interface LearningPathCardProps {
  path: LearningPath;
}

/** Preview card for a structured learning path. */
export function LearningPathCard({ path }: LearningPathCardProps) {
  const { title, description, icon: Icon, level, moduleCount } = path;

  return (
    <Card interactive className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-xl text-accent-300">
          <Icon />
        </span>
        <Badge variant={difficultyBadgeVariant(level)}>{level}</Badge>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-xs font-medium text-slate-500">
          {moduleCount} modules
        </span>
        <Link
          to="/lessons"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent-300 transition-colors hover:text-accent-200"
        >
          Explore
          <ArrowRightIcon className="text-sm" />
        </Link>
      </div>
    </Card>
  );
}
