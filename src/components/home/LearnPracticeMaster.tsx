import { Link } from "react-router-dom";
import { learnPracticeSteps } from "@/data/platformFeatures";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const phaseColors = [
  "border-accent-400/25 bg-accent-400/[0.06] text-accent-200",
  "border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-200",
  "border-brand-500/25 bg-brand-500/[0.06] text-brand-300",
  "border-violet-400/25 bg-violet-400/[0.06] text-violet-200",
];

export function LearnPracticeMaster() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />

      <div className="grid gap-5 lg:grid-cols-4">
        {learnPracticeSteps.map((step, index) => (
          <article
            key={step.phase}
            className="group relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface/40 p-5 backdrop-blur-sm transition hover:border-white/20"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]",
                  phaseColors[index],
                )}
              >
                {step.phase}
              </span>
              {index < learnPracticeSteps.length - 1 && (
                <ArrowRightIcon className="hidden text-slate-600 lg:block" />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{step.description}</p>
            </div>

            <ul className="flex flex-wrap gap-2">
              {step.examples.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md border border-white/10 bg-base-950/50 px-2 py-0.5 font-mono text-[10px] text-slate-500"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <Link
              to={step.href}
              className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-accent-300 transition group-hover:text-accent-200"
            >
              Explore
              <ArrowRightIcon className="text-[10px] transition group-hover:translate-x-0.5" />
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button to={learnPracticeSteps[0].href} variant="secondary">
          Start the journey
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}
