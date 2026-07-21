import { CheckIcon, LockIcon, RadarIcon, ShieldIcon } from "@/components/ui/icons";

const statusRows = [
  { label: "Perimeter monitoring", value: "Active" },
  { label: "Endpoint coverage", value: "98.6%" },
  { label: "Log ingestion", value: "Nominal" },
];

const stats = [
  { label: "Uptime", value: "99.9%" },
  { label: "Alerts triaged", value: "1,284" },
  { label: "Playbooks", value: "42" },
];

/**
 * Purely decorative "security operations" panel used as the homepage hero
 * visual. Built entirely with UI/CSS — no stock imagery — to convey a modern
 * SOC/dashboard aesthetic.
 */
export function SecurityConsole() {
  return (
    <div className="relative">
      {/* Ambient glow behind the panel */}
      <div className="absolute -inset-6 rounded-[2rem] bg-radial-accent blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface/80 shadow-glow backdrop-blur-sm">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-white/10" />
          <span className="h-3 w-3 rounded-full bg-white/10" />
          <span className="h-3 w-3 rounded-full bg-white/10" />
          <span className="ml-2 font-mono text-xs text-slate-500">
            hacknology://secure-console
          </span>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {/* Primary status */}
          <div className="flex items-center gap-4">
            <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-accent-400/30 bg-accent-400/10 text-3xl text-accent-300 shadow-glow-sm">
              <ShieldIcon />
              <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-accent-400/20" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                Environment secure
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-400" />
                All monitored services nominal
              </span>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
              >
                <div className="font-mono text-lg font-semibold text-white">
                  {stat.value}
                </div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Status rows */}
          <div className="flex flex-col gap-2">
            {statusRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"
              >
                <span className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckIcon className="text-sm text-accent-300" />
                  {row.label}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Footer chips */}
          <div className="flex items-center gap-2 border-t border-white/5 pt-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/5 px-2 py-1">
              <LockIcon className="text-xs" /> Authorized
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/5 px-2 py-1">
              <RadarIcon className="text-xs" /> Defensive
            </span>
            <span className="ml-auto font-mono">read-only demo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
