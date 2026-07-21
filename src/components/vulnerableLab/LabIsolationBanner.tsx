import { cn } from "@/lib/cn";
import { ShieldIcon } from "@/components/ui/icons";

interface LabIsolationBannerProps {
  className?: string;
}

/** Prominent notice that the lab is an isolated simulation. */
export function LabIsolationBanner({ className }: LabIsolationBannerProps) {
  return (
    <div
      role="note"
      aria-label="Sandbox isolation notice"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-100",
        "px-4 py-3.5",
        className,
      )}
    >
      <ShieldIcon className="mt-0.5 shrink-0 text-lg text-emerald-300" />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-emerald-200">Isolated Sandbox</span>
        <p className="text-pretty text-sm leading-relaxed text-emerald-100/90">
          This challenge runs entirely in your browser with fake data. It cannot access real
          accounts, the production database, forum data, or server secrets. Exploits only affect
          this fictional simulation.
        </p>
      </div>
    </div>
  );
}
