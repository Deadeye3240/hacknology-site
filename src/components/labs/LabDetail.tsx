import { Link } from "react-router-dom";
import type { Lab } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SecurityNotice } from "@/components/ui/SecurityNotice";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  FlaskIcon,
  ListChecksIcon,
  LockIcon,
  TargetIcon,
} from "@/components/ui/icons";
import { difficultyBadgeVariant } from "@/lib/difficulty";
import { labStatusBadgeVariant } from "@/lib/status";
import { useLabProgress } from "@/context/LabProgressContext";

interface LabDetailProps {
  lab: Lab;
}

/** Full detail view for a single lab, including progress actions. */
export function LabDetail({ lab }: LabDetailProps) {
  const { getStatus, startLab, completeLab, resetLab } = useLabProgress();
  const status = getStatus(lab.id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          to="/labs"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-accent-300"
        >
          <ArrowRightIcon className="rotate-180 text-sm" />
          Back to labs
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">
            <FlaskIcon className="text-xs" />
            {lab.category}
          </Badge>
          <Badge variant={difficultyBadgeVariant(lab.level)}>{lab.level}</Badge>
          <Badge variant={labStatusBadgeVariant(status)}>
            {status === "Completed" && <CheckIcon className="text-xs" />}
            {status}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">{lab.title}</h1>
        <p className="max-w-3xl text-pretty text-base leading-relaxed text-slate-400">
          {lab.description}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="text-base" />~{lab.estimatedMinutes} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ListChecksIcon className="text-base" />
            {lab.instructions.length} steps
          </span>
        </div>
      </div>

      <SecurityNotice />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          <section className="flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <TargetIcon className="text-accent-300" />
              Learning objectives
            </h2>
            <ul className="flex flex-col gap-2">
              {lab.objectives.map((objective) => (
                <li
                  key={objective}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-300"
                >
                  <CheckIcon className="mt-0.5 shrink-0 text-accent-300" />
                  {objective}
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <ListChecksIcon className="text-accent-300" />
              Instructions
            </h2>
            <p className="text-sm text-slate-500">
              These steps are educational and simulated. Any commands shown are
              illustrative — run them only in a lab environment you own or are
              authorized to use.
            </p>
            <ol className="flex flex-col gap-4">
              {lab.instructions.map((step, index) => (
                <li key={step.title}>
                  <Card className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-accent-400/30 bg-accent-400/10 font-mono text-xs font-semibold text-accent-300">
                        {index + 1}
                      </span>
                      <h3 className="text-base font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {step.description}
                    </p>
                    {step.command && (
                      <pre className="overflow-x-auto rounded-lg border border-white/5 bg-base-950 p-3 font-mono text-xs leading-relaxed text-slate-300">
                        <span className="mb-1 block text-[10px] uppercase tracking-wider text-slate-600">
                          command (illustrative)
                        </span>
                        {step.command}
                      </pre>
                    )}
                    {step.output && (
                      <pre className="overflow-x-auto rounded-lg border border-white/5 bg-base-950 p-3 font-mono text-xs leading-relaxed text-emerald-200/80">
                        <span className="mb-1 block text-[10px] uppercase tracking-wider text-slate-600">
                          simulated output
                        </span>
                        {step.output}
                      </pre>
                    )}
                  </Card>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <Card className="flex flex-col gap-5">
            <h2 className="text-sm font-semibold text-white">Lab details</h2>

            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Difficulty</dt>
                <dd>
                  <Badge variant={difficultyBadgeVariant(lab.level)}>
                    {lab.level}
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Estimated time</dt>
                <dd className="text-slate-300">~{lab.estimatedMinutes} min</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Status</dt>
                <dd>
                  <Badge variant={labStatusBadgeVariant(status)}>{status}</Badge>
                </dd>
              </div>
            </dl>

            <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Skills learned
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {lab.skills.map((skill) => (
                  <li key={skill}>
                    <Badge variant="accent">{skill}</Badge>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
              <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <LockIcon className="text-sm" />
                Prerequisites
              </h3>
              {lab.prerequisites.length > 0 ? (
                <ul className="flex flex-col gap-1.5 text-sm text-slate-400">
                  {lab.prerequisites.map((prereq) => (
                    <li key={prereq} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-600" />
                      {prereq}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">None — start anytime.</p>
              )}
            </div>

            {/* Progress actions */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
              {status === "Not Started" && (
                <Button onClick={() => startLab(lab.id)} className="w-full">
                  Start Lab
                  <ArrowRightIcon />
                </Button>
              )}

              {status === "In Progress" && (
                <>
                  <Button onClick={() => completeLab(lab.id)} className="w-full">
                    <CheckIcon />
                    Mark as complete
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => resetLab(lab.id)}
                    className="w-full"
                  >
                    Reset progress
                  </Button>
                </>
              )}

              {status === "Completed" && (
                <>
                  <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/[0.06] px-4 py-2.5 text-sm font-medium text-emerald-200">
                    <CheckIcon />
                    Lab completed
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => resetLab(lab.id)}
                    className="w-full"
                  >
                    Reset progress
                  </Button>
                </>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
