import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { CheckIcon, FlaskIcon, PlayIcon } from "@/components/ui/icons";
import { labs } from "@/data/labs";
import { useLabProgress } from "@/context/LabProgressContext";

/**
 * Aggregate progress summary across the lab library. Reads from the localStorage
 * -backed progress store, so it updates as learners start and complete labs.
 */
export function LabProgress() {
  const { statuses } = useLabProgress();

  const { total, completed, inProgress, percent } = useMemo(() => {
    const total = labs.length;
    let completed = 0;
    let inProgress = 0;
    for (const lab of labs) {
      const status = statuses[lab.id];
      if (status === "Completed") completed += 1;
      else if (status === "In Progress") inProgress += 1;
    }
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, inProgress, percent };
  }, [statuses]);

  const stats = [
    { label: "Completed", value: completed, icon: CheckIcon },
    { label: "In progress", value: inProgress, icon: PlayIcon },
    { label: "Total labs", value: total, icon: FlaskIcon },
  ];

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Your progress</h2>
          <p className="text-xs text-slate-500">
            Progress is saved in this browser.
          </p>
        </div>
        <span className="font-mono text-2xl font-bold text-accent-300">
          {percent}%
        </span>
      </div>

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Labs completed"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-400 to-brand-500 shadow-glow-sm transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <dl className="grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/[0.02] p-3"
            >
              <dt className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-slate-500">
                <Icon className="text-sm text-accent-300" />
                {stat.label}
              </dt>
              <dd className="font-mono text-lg font-semibold text-white">
                {stat.value}
              </dd>
            </div>
          );
        })}
      </dl>
    </Card>
  );
}
