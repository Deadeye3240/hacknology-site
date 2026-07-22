import { useCallback, useEffect, useRef, useState } from "react";
import { validateMissionCommand } from "@/lib/nmapCommand";
import type { ScanMeMission } from "@/data/scanme";
import { ScanMeHintPanel } from "./ScanMeHintPanel";

const PROMPT = "student@hacknology:~$";

export interface TerminalLine {
  type: "system" | "input" | "output" | "error" | "success";
  text: string;
}

interface ScanMeTerminalProps {
  mission: ScanMeMission;
  completed: boolean;
  onComplete: (hintsUsed: number) => void;
}

function buildIntro(mission: ScanMeMission, practiceMode: boolean): TerminalLine[] {
  const intro: TerminalLine[] = [
    {
      type: "system",
      text: practiceMode
        ? `Practice mode — XP already earned. Target: ${mission.targetIp}. Objective: ${mission.objective}`
        : `Mission ${mission.code} — ${mission.title}. Target: ${mission.targetIp}. Type your command and press Enter.`,
    },
  ];
  if (mission.commandRules.type === "report") {
    intro.push(
      { type: "system", text: "Review the scan output below, then report the open port numbers." },
      { type: "output", text: mission.simulatedOutput },
    );
  }
  return intro;
}

export function ScanMeTerminal({ mission, completed, onComplete }: ScanMeTerminalProps) {
  const practiceMode = completed;
  const [lines, setLines] = useState<TerminalLine[]>(() => buildIntro(mission, practiceMode));
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputLocked = !practiceMode && sessionComplete;

  useEffect(() => {
    setLines(buildIntro(mission, practiceMode));
    setSessionComplete(false);
  }, [mission.id, practiceMode]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const appendLines = useCallback((newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd || inputLocked) return;

    appendLines([{ type: "input", text: `${PROMPT} ${cmd}` }]);
    setHistory((h) => [...h, cmd]);
    setHistoryIdx(-1);
    setInput("");

    const result = validateMissionCommand(mission.commandRules, cmd);

    if (result.kind === "success") {
      appendLines([
        { type: "output", text: mission.simulatedOutput },
        {
          type: "success",
          text: practiceMode
            ? "✓ Correct — practice run (XP already earned)."
            : "✓ Mission complete — processing XP…",
        },
      ]);
      if (!practiceMode) {
        setSessionComplete(true);
        onComplete(hintsUsed);
      }
      return;
    }

    const output =
      result.showOutput && mission.partialOutput ? mission.partialOutput : undefined;
    const feedback: TerminalLine[] = [{ type: "error", text: result.message }];
    if (output) feedback.splice(0, 0, { type: "output", text: output });
    appendLines(feedback);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx < 0 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInput(history[nextIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx < 0) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(nextIdx);
        setInput(history[nextIdx] ?? "");
      }
    }
  }

  function clearTerminal() {
    setLines(buildIntro(mission, practiceMode));
  }

  function retryMission() {
    setLines(buildIntro(mission, practiceMode));
    setInput("");
    setHistory([]);
    setHistoryIdx(-1);
    setSessionComplete(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-emerald-500/20 bg-base-950 shadow-lg shadow-black/40">
        <div className="flex items-center gap-2 border-b border-white/10 bg-base-900/80 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 font-mono text-xs text-slate-500">hacknology-scanme-terminal</span>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={clearTerminal}
              className="font-mono text-[10px] uppercase tracking-wide text-slate-500 hover:text-slate-300"
            >
              clear
            </button>
            {!inputLocked && (
              <button
                type="button"
                onClick={retryMission}
                className="font-mono text-[10px] uppercase tracking-wide text-slate-500 hover:text-slate-300"
              >
                reset
              </button>
            )}
          </div>
        </div>

        <div ref={scrollRef} className="max-h-[420px] min-h-[280px] overflow-y-auto p-4 font-mono text-xs leading-relaxed">
          {lines.map((line, i) => (
            <div
              key={`${line.type}-${i}-${line.text.slice(0, 24)}`}
              className={
                line.type === "input"
                  ? "mb-2 text-emerald-300"
                  : line.type === "output"
                    ? "mb-3 whitespace-pre-wrap text-slate-300"
                    : line.type === "error"
                      ? "mb-2 text-amber-200"
                      : line.type === "success"
                        ? "mb-2 font-semibold text-emerald-400"
                        : "mb-2 text-slate-500"
              }
            >
              {line.text}
            </div>
          ))}
        </div>

        {!inputLocked && (
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
            <span className="shrink-0 font-mono text-xs text-emerald-400">{PROMPT}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent font-mono text-xs text-white outline-none placeholder:text-slate-600"
              placeholder={
                mission.commandRules.type === "report"
                  ? "Enter open ports (e.g. 22,80)…"
                  : "nmap …"
              }
            />
            <span className="animate-pulse font-mono text-emerald-400/80">▋</span>
          </form>
        )}
      </div>

      {!inputLocked && !practiceMode && (
        <ScanMeHintPanel hints={mission.hints} onHintCountChange={setHintsUsed} />
      )}
    </div>
  );
}
