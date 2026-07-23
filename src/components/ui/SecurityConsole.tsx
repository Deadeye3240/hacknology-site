import { CheckIcon, LockIcon, RadarIcon } from "@/components/ui/icons";
import { HacknologyMark } from "@/components/brand/HacknologyMark";
import { platformStats } from "@/data/platformStats";

const capabilities = [
  { label: "Lesson terminal labs", value: "Every lesson" },
  { label: "ScanMe missions", value: String(platformStats.scanMeMissionCount) },
  { label: "Sandbox challenges", value: String(platformStats.vulnerableLabCount) },
] as const;

/**
 * Decorative platform overview panel. Shows real product capabilities only —
 * no fabricated uptime, user counts, or operational metrics.
 */
export function SecurityConsole() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2rem] bg-radial-accent blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface/80 shadow-glow backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-white/10" />
          <span className="h-3 w-3 rounded-full bg-white/10" />
          <span className="h-3 w-3 rounded-full bg-white/10" />
          <span className="ml-2 font-mono text-xs text-slate-500">hacknology://platform</span>
        </div>

        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center gap-4">
            <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-accent-400/30 bg-base-950/80 shadow-glow-sm">
              <HacknologyMark size={40} />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Hands-on training platform</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-400" />
                Learn · practice · discuss
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {capabilities.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
              >
                <div className="font-mono text-lg font-semibold text-white">{item.value}</div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {[
              "Structured lessons with embedded terminal labs",
              "Progressive ScanMe Nmap training",
              "Community forum for discussion",
            ].map((row) => (
              <div
                key={row}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"
              >
                <span className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckIcon className="text-sm text-accent-300" />
                  {row}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-white/5 pt-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/5 px-2 py-1">
              <LockIcon className="text-xs" /> Sandboxed
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/5 px-2 py-1">
              <RadarIcon className="text-xs" /> Practical
            </span>
            <span className="ml-auto font-mono">{platformStats.lessonCount} lessons</span>
          </div>
        </div>
      </div>
    </div>
  );
}
