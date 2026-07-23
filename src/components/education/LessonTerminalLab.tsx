import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { HacknologyTerminal, useTerminalHistory } from "@/components/terminal/HacknologyTerminal";
import { ScanMeHintPanel } from "@/components/scanme/ScanMeHintPanel";
import type { Lesson } from "@/types/education";
import type { TerminalLine } from "@/types/lessonTerminal";
import { resolveLessonTerminal } from "@/data/lessons/terminals";
import { kaliMotdLines } from "@/lib/lessonTerminal/kali";
import {
  createInitialState,
  executeCommand,
  getPrompt,
  validateStep,
} from "@/lib/lessonTerminal/engine";

interface LessonTerminalLabProps {
  lesson: Lesson;
}

function motdLines(): TerminalLine[] {
  return kaliMotdLines().map((text) => ({ type: "output" as const, text }));
}

export function LessonTerminalLab({ lesson }: LessonTerminalLabProps) {
  const lab = useMemo(() => resolveLessonTerminal(lesson), [lesson]);
  const [sessionState, setSessionState] = useState(() => createInitialState(lab.scenario));
  const [stepIndex, setStepIndex] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [input, setInput] = useState("");
  const [stepFeedback, setStepFeedback] = useState<{ kind: "error" | "success"; text: string } | null>(
    null,
  );
  const { history, push, handleKeyDown, resetHistory } = useTerminalHistory();

  const currentStep = lab.steps[stepIndex];
  const allComplete = stepIndex >= lab.steps.length;
  const prompt = getPrompt(sessionState, lab.scenario);
  const theme = lab.scenario.theme ?? "kali";

  const [lines, setLines] = useState<TerminalLine[]>(() => motdLines());

  function append(newLines: TerminalLine[]) {
    setLines((prev) => [...prev, ...newLines]);
  }

  function appendCommandOutput(exec: ReturnType<typeof executeCommand>) {
    if (exec.output === "__CLEAR__") {
      setLines(motdLines());
      return;
    }

    const outputLines: TerminalLine[] = [];
    if (exec.error) {
      outputLines.push({ type: "error", text: exec.error });
    } else if (exec.output) {
      outputLines.push({ type: "output", text: exec.output });
    }

    if (outputLines.length > 0) append(outputLines);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd || allComplete || !currentStep) return;

    append([{ type: "input", text: `${prompt} ${cmd}` }]);
    push(cmd);
    setInput("");

    setStepFeedback(null);

    const exec = executeCommand(cmd, sessionState, lab.scenario, [...history, cmd]);
    setSessionState(exec.state);
    appendCommandOutput(exec);

    const validation = validateStep(cmd, currentStep, exec.state);

    if (validation.ok && validation.advance) {
      setStepFeedback({
        kind: "success",
        text: validation.message ?? "Step complete — continue to the next objective.",
      });
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      if (nextIndex >= lab.steps.length) {
        setStepFeedback({
          kind: "success",
          text: "Hands-on lab complete — continue to the knowledge check below.",
        });
      }
      return;
    }

    if (!validation.ok) {
      setStepFeedback({ kind: "error", text: validation.message });
    }
  }

  function resetLab() {
    setSessionState(createInitialState(lab.scenario));
    setStepIndex(0);
    setHintsUsed(0);
    setStepFeedback(null);
    resetHistory();
    setInput("");
    setLines(motdLines());
  }

  function clearScreen() {
    setLines(motdLines());
  }

  const hints = currentStep?.hints ?? [];

  return (
    <Card className="flex flex-col gap-3 border-emerald-500/15 bg-emerald-500/[0.03] p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-white">{lab.title ?? "Hands-on terminal"}</h2>
          <p className="mt-0.5 text-xs leading-snug text-slate-400">
            {lab.introduction ??
              "Sandboxed Kali training shell — commands are simulated. Objectives and hints appear below the terminal chrome."}
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
          {stepFeedback && (
            <p
              className={
                stepFeedback.kind === "success"
                  ? "rounded-md border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200"
                  : "rounded-md border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-100"
              }
            >
              {stepFeedback.kind === "success" ? "✓ " : "↻ "}
              {stepFeedback.text}
            </p>
          )}
        </div>
      )}

      {allComplete && stepFeedback && (
        <p className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
          ✓ {stepFeedback.text}
        </p>
      )}

      <HacknologyTerminal
        prompt={prompt}
        theme={theme}
        lines={lines}
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onKeyDown={(e) => handleKeyDown(e, input, setInput)}
        disabled={allComplete}
        placeholder=""
        showHints={false}
        onClear={clearScreen}
        onReset={resetLab}
      />

      {!allComplete && hints.length > 0 && (
        <ScanMeHintPanel hints={hints} onHintCountChange={setHintsUsed} />
      )}

      {hintsUsed > 0 && !allComplete && (
        <p className="text-[10px] text-slate-600">Hints used: {hintsUsed}</p>
      )}
    </Card>
  );
}
