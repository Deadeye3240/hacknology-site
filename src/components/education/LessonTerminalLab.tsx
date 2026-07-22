import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { HacknologyTerminal, useTerminalHistory } from "@/components/terminal/HacknologyTerminal";
import type { Lesson } from "@/types/education";
import type { TerminalLine } from "@/types/lessonTerminal";
import { resolveLessonTerminal } from "@/data/lessons/terminals";
import {
  createInitialState,
  executeCommand,
  getPrompt,
  validateStep,
} from "@/lib/lessonTerminal/engine";

interface LessonTerminalLabProps {
  lesson: Lesson;
}

export function LessonTerminalLab({ lesson }: LessonTerminalLabProps) {
  const lab = useMemo(() => resolveLessonTerminal(lesson), [lesson]);
  const [sessionState, setSessionState] = useState(() => createInitialState(lab.scenario));
  const [stepIndex, setStepIndex] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [input, setInput] = useState("");
  const { push, handleKeyDown, resetHistory } = useTerminalHistory();

  const currentStep = lab.steps[stepIndex];
  const allComplete = stepIndex >= lab.steps.length;
  const prompt = getPrompt(sessionState, lab.scenario);

  const [lines, setLines] = useState<TerminalLine[]>(() => {
    const intro: TerminalLine[] = [];
    if (lab.scenario.banner) intro.push({ type: "system", text: lab.scenario.banner });
    intro.push({
      type: "system",
      text: `Lesson lab: ${lab.title ?? lesson.title} — Step 1 of ${lab.steps.length}`,
    });
    intro.push({ type: "system", text: currentStep?.objective ?? "" });
    return intro;
  });

  function append(newLines: TerminalLine[]) {
    setLines((prev) => [...prev, ...newLines]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd || allComplete || !currentStep) return;

    append([{ type: "input", text: `${prompt} ${cmd}` }]);
    push(cmd);
    setInput("");

    const exec = executeCommand(cmd, sessionState, lab.scenario);
    setSessionState(exec.state);

    if (exec.output === "__CLEAR__") {
      setLines([
        { type: "system", text: "Terminal cleared." },
        { type: "system", text: `Step ${stepIndex + 1}: ${currentStep.objective}` },
      ]);
      return;
    }

    const outputLines: TerminalLine[] = [];

    if (exec.error) {
      outputLines.push({ type: "error", text: exec.error });
      append(outputLines);
      return;
    }

    if (exec.output) {
      outputLines.push({ type: "output", text: exec.output });
    }

    const validation = validateStep(cmd, currentStep, exec.state);

    if (validation.ok && validation.advance) {
      outputLines.push({ type: "success", text: `✓ ${validation.message}` });
      append(outputLines);

      const nextIndex = stepIndex + 1;
      if (nextIndex >= lab.steps.length) {
        append([
          {
            type: "success",
            text: "✓ Hands-on lab complete — continue to the knowledge check below.",
          },
        ]);
        setStepIndex(nextIndex);
      } else {
        setStepIndex(nextIndex);
        append([
          {
            type: "system",
            text: `Step ${nextIndex + 1} of ${lab.steps.length}: ${lab.steps[nextIndex].objective}`,
          },
        ]);
      }
      return;
    }

    if (!validation.ok) {
      outputLines.push({ type: "error", text: validation.message });
    }

    append(outputLines);
  }

  function resetLab() {
    setSessionState(createInitialState(lab.scenario));
    setStepIndex(0);
    setHintsUsed(0);
    resetHistory();
    setInput("");
    setLines([
      ...(lab.scenario.banner ? [{ type: "system" as const, text: lab.scenario.banner }] : []),
      { type: "system", text: `Lab reset — Step 1 of ${lab.steps.length}` },
      { type: "system", text: lab.steps[0].objective },
    ]);
  }

  function clearScreen() {
    setLines([{ type: "system", text: `Step ${Math.min(stepIndex + 1, lab.steps.length)}: ${currentStep?.objective ?? "Complete"}` }]);
  }

  const hints = currentStep?.hints ?? [];

  return (
    <Card className="flex flex-col gap-3 border-emerald-500/15 bg-emerald-500/[0.03] p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-white">{lab.title ?? "Hands-on terminal"}</h2>
          <p className="mt-0.5 text-xs leading-snug text-slate-400">
            {lab.introduction ?? "Sandboxed training shell — commands are simulated, not executed on a real server."}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {allComplete ? (
            <Badge variant="success">Lab complete</Badge>
          ) : (
            <Badge variant="neutral">
              Step {stepIndex + 1}/{lab.steps.length}
            </Badge>
          )}
        </div>
      </div>

      {!allComplete && currentStep && (
        <div className="flex flex-col gap-2">
          <p className="rounded-md border border-white/[0.06] bg-base-950/50 px-3 py-2 text-xs text-slate-300">
            <span className="font-medium text-accent-300">Objective: </span>
            {currentStep.objective}
          </p>
          {currentStep.why && (
            <p className="rounded-md border border-emerald-500/10 bg-emerald-500/[0.04] px-3 py-2 text-xs text-slate-400">
              <span className="font-medium text-emerald-300">Why: </span>
              {currentStep.why}
            </p>
          )}
        </div>
      )}

      <HacknologyTerminal
        prompt={prompt}
        windowTitle="hacknology-lesson-terminal"
        lines={lines}
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onKeyDown={(e) => handleKeyDown(e, input, setInput)}
        disabled={allComplete}
        placeholder="Enter command…"
        hints={hints}
        onHintCountChange={setHintsUsed}
        onClear={clearScreen}
        onReset={resetLab}
        showHints={!allComplete}
      />

      {hintsUsed > 0 && !allComplete && (
        <p className="text-[10px] text-slate-600">Hints used: {hintsUsed}</p>
      )}
    </Card>
  );
}
