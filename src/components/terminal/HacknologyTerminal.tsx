import { useCallback, useEffect, useRef, useState } from "react";
import type { TerminalLine } from "@/types/lessonTerminal";
import { ScanMeHintPanel } from "@/components/scanme/ScanMeHintPanel";
import type { ScanMeHint } from "@/data/scanme";

export interface HacknologyTerminalProps {
  prompt: string;
  windowTitle?: string;
  lines: TerminalLine[];
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  hints?: ScanMeHint[];
  hintsUsed?: number;
  onHintCountChange?: (count: number) => void;
  onClear?: () => void;
  onReset?: () => void;
  showHints?: boolean;
}

/** Shared Hacknology terminal chrome — used by ScanMe and lesson labs. */
export function HacknologyTerminal({
  prompt,
  windowTitle = "hacknology-terminal",
  lines,
  input,
  onInputChange,
  onSubmit,
  onKeyDown,
  disabled = false,
  placeholder = "Type a command…",
  hints,
  onHintCountChange,
  onClear,
  onReset,
  showHints = true,
}: HacknologyTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl border border-emerald-500/20 bg-base-950 shadow-lg shadow-black/40">
        <div className="flex items-center gap-2 border-b border-white/10 bg-base-900/80 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <span className="ml-2 font-mono text-[10px] text-slate-500">{windowTitle}</span>
          <div className="ml-auto flex gap-2">
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="font-mono text-[10px] uppercase tracking-wide text-slate-500 hover:text-slate-300"
              >
                clear
              </button>
            )}
            {onReset && !disabled && (
              <button
                type="button"
                onClick={onReset}
                className="font-mono text-[10px] uppercase tracking-wide text-slate-500 hover:text-slate-300"
              >
                reset
              </button>
            )}
          </div>
        </div>

        <div
          ref={scrollRef}
          className="max-h-[360px] min-h-[220px] overflow-y-auto p-3 font-mono text-xs leading-relaxed"
        >
          {lines.map((line, i) => (
            <div
              key={`${line.type}-${i}-${line.text.slice(0, 20)}`}
              className={
                line.type === "input"
                  ? "mb-1.5 text-emerald-300"
                  : line.type === "output"
                    ? "mb-2 whitespace-pre-wrap text-slate-300"
                    : line.type === "error"
                      ? "mb-1.5 text-amber-200"
                      : line.type === "success"
                        ? "mb-1.5 font-semibold text-emerald-400"
                        : "mb-1.5 text-slate-500"
              }
            >
              {line.text}
            </div>
          ))}
        </div>

        {!disabled && (
          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/10 px-3 py-2">
            <span className="shrink-0 font-mono text-xs text-emerald-400">{prompt}</span>
            <input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={onKeyDown}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent font-mono text-xs text-white outline-none placeholder:text-slate-600"
              placeholder={placeholder}
            />
            <span className="animate-pulse font-mono text-emerald-400/80">▋</span>
          </form>
        )}
      </div>

      {showHints && hints && hints.length > 0 && !disabled && (
        <ScanMeHintPanel hints={hints} onHintCountChange={onHintCountChange} />
      )}
    </div>
  );
}

/** Hook helpers for command history in terminal inputs. */
export function useTerminalHistory() {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const push = useCallback((cmd: string) => {
    setHistory((h) => [...h, cmd]);
    setHistoryIdx(-1);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, _input: string, setInput: (v: string) => void) => {
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
    },
    [history, historyIdx],
  );

  const resetHistory = useCallback(() => {
    setHistory([]);
    setHistoryIdx(-1);
  }, []);

  return { push, handleKeyDown, resetHistory };
}
