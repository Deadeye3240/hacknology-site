import { HacknologyTerminal } from "@/components/terminal/HacknologyTerminal";
import { platformStats } from "@/data/platformStats";
import type { TerminalLine } from "@/types/lessonTerminal";

const previewLines: TerminalLine[] = [
  { type: "system", text: "Lesson lab: Linux Terminal Navigation — Step 1 of 4" },
  { type: "system", text: "Objective: Print your current working directory." },
  { type: "input", text: "trainee@hacknology:~$ pwd" },
  { type: "output", text: "/home/trainee" },
  { type: "success", text: "✓ Correct — you know where you are in the filesystem." },
  { type: "system", text: "Step 2 of 4: List files in the current directory." },
  { type: "input", text: "trainee@hacknology:~$ ls" },
  { type: "output", text: "notes.txt  scripts  lab-readme.md" },
];

const catalogFacts = [
  { label: "Lessons", value: String(platformStats.lessonCount) },
  { label: "Learning paths", value: String(platformStats.pathCount) },
  { label: "ScanMe missions", value: String(platformStats.scanMeMissionCount) },
] as const;

/**
 * Homepage hero visual — real terminal UI preview and factual product scope.
 * No fabricated uptime, user counts, or operational metrics.
 */
export function PlatformHeroVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-[2rem] bg-radial-accent blur-3xl opacity-70" />

      <div className="relative flex flex-col gap-4">
        <HacknologyTerminal
          prompt="trainee@hacknology:~$"
          windowTitle="hacknology-lesson-terminal"
          lines={previewLines}
          input=""
          onInputChange={() => {}}
          onSubmit={(e) => e.preventDefault()}
          disabled
          showHints={false}
        />

        <div className="grid grid-cols-3 gap-3">
          {catalogFacts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-xl border border-white/10 bg-surface/70 px-3 py-3 text-center backdrop-blur-sm"
            >
              <div className="font-mono text-lg font-semibold text-white">{fact.value}</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-500">
                {fact.label}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center font-mono text-[10px] uppercase tracking-wider text-slate-600">
          Simulated training shell · learn by doing
        </p>
      </div>
    </div>
  );
}
