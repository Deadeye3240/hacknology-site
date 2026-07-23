import { useEffect, useMemo, useState } from "react";
import { HacknologyTerminal } from "@/components/terminal/HacknologyTerminal";
import type { TerminalLine } from "@/types/lessonTerminal";

const DEMO_SCRIPT: TerminalLine[] = [
  { type: "system", text: "Lesson: Linux Terminal Navigation — Step 1 of 4" },
  { type: "system", text: "Objective: Print your current working directory." },
  { type: "input", text: "trainee@hacknology:~$ pwd" },
  { type: "output", text: "/home/trainee/labs" },
  { type: "success", text: "✓ Correct — you know where you are in the filesystem." },
  { type: "system", text: "Step 2: List files in the current directory." },
  { type: "input", text: "trainee@hacknology:~/labs$ ls" },
  { type: "output", text: "notes.txt  scripts  lab-readme.md" },
  { type: "success", text: "✓ Step cleared — same shell used across every lesson lab." },
];

/**
 * Live lesson-terminal preview for the homepage hero.
 * Uses the real HacknologyTerminal component — not a decorative mockup.
 */
export function HeroTerminalDemo() {
  const [lineCount, setLineCount] = useState(1);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((t) => t + 1);
    }, 1100);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (tick === 0) return;
    setLineCount((c) => (c >= DEMO_SCRIPT.length ? 1 : c + 1));
  }, [tick]);

  const lines = useMemo(() => DEMO_SCRIPT.slice(0, lineCount), [lineCount]);
  const partial = tick % 4 === 0 ? "█" : "";

  return (
    <div className="relative">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
        Embedded lesson terminal · live preview
      </p>
      <HacknologyTerminal
        prompt="trainee@hacknology:~$"
        windowTitle="hacknology-lesson-terminal"
        lines={lines}
        input={lineCount >= DEMO_SCRIPT.length ? `ls${partial}` : ""}
        onInputChange={() => {}}
        onSubmit={(e) => e.preventDefault()}
        disabled
        showHints={false}
      />
    </div>
  );
}
