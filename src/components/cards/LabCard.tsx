import { Link } from "react-router-dom";
import type { Lab, LabStatus } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  FlaskIcon,
  PlayIcon,
} from "@/components/ui/icons";
import { difficultyBadgeVariant } from "@/lib/difficulty";
import { labStatusBadgeVariant } from "@/lib/status";
import { useLabProgress } from "@/context/LabProgressContext";

interface LabCardProps {
  lab: Lab;
}

const ctaLabel: Record<LabStatus, string> = {
  "Not Started": "Start Lab",
  "In Progress": "Continue",
  Completed: "Review",
};

/** Preview card for an authorized, hands-on lab, including saved progress. */
export function LabCard({ lab }: LabCardProps) {
  const { getStatus } = useLabProgress();
  const status = getStatus(lab.id);
  const { id, title, description, category, level, estimatedMinutes, skills } = lab;

  return (
    <Card interactive className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="neutral">
          <FlaskIcon className="text-xs" />
          {category}
        </Badge>
        <Badge variant={difficultyBadgeVariant(level)}>{level}</Badge>
        {status !== "Not Started" && (
          <Badge variant={labStatusBadgeVariant(status)} className="ml-auto">
            {status === "Completed" && <CheckIcon className="text-xs" />}
            {status}
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      </div>

      <ul className="flex flex-wrap gap-1.5" aria-label="Skills learned">
        {skills.map((skill) => (
          <li
            key={skill}
            className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-400"
          >
            {skill}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <ClockIcon className="text-sm" />~{estimatedMinutes} min
        </span>
        <Link
          to={`/labs/${id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-accent-200 transition-colors hover:bg-accent-400/15 hover:text-accent-100"
        >
          <PlayIcon className="text-xs" />
          {ctaLabel[status]}
          <ArrowRightIcon className="text-sm" />
        </Link>
      </div>
    </Card>
  );
}
