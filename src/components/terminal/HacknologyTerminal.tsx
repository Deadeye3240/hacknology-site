import { useCallback, useEffect, useRef, useState } from "react";
import type { TerminalLine } from "@/types/lessonTerminal";
import { ScanMeHintPanel } from "@/components/scanme/ScanMeHintPanel";
import type { ScanMeHint } from "@/data/scanme";
import { cn } from "@/lib/cn";

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
  theme?: "default" | "kali" | "windows";
}

function KaliPrompt({ prompt }: { prompt: string }) {
  const match = prompt.match(/^([^@]+)@([^:]+):(.+)([$#])$/);
  if (!match) {
    return <span className="font-mono text-xs text-emerald-400">{prompt}</span>;
  }
  const [, user, host, path, symbol] = match;
  return (
    <span className="shrink-0 font-mono text-xs">
      <span className="text-[#2ecc71]">{user}</span>
      <span className="text-slate-400">@</span>
      <span className="text-[#ef4444]">{host}</span>
      <span className="text-[#5dade2]">:{path}</span>
      <span className="text-[#2ecc71]">{symbol}</span>
    </span>
  );
}

function renderKaliInput(text: string) {
  const match = text.match(/^(.+\$)\s*(.*)$/);
  if (!match) return text;
  return (
    <>
      <KaliPrompt prompt={match[1]} />
      {match[2] ? <span className="text-white"> {match[2]}</span> : null}
    </>
  );
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
  theme = "default",
}: HacknologyTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isKali = theme === "kali";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "overflow-hidden rounded-xl shadow-lg shadow-black/40",
          isKali
            ? "border border-[#333]/80 bg-[#0c0c0c]"
            : "border border-emerald-500/20 bg-base-950",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 border-b px-3 py-1.5",
            isKali ? "border-[#333]/80 bg-[#1a1a1a]" : "border-white/10 bg-base-900/80",
          )}
        >
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <span className={cn("ml-2 font-mono text-[10px]", isKali ? "text-[#888]" : "text-slate-500")}>
            {isKali ? "kali@Kali: ~" : windowTitle}
          </span>
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
          className={cn(
            "max-h-[360px] min-h-[240px] overflow-y-auto p-3 font-mono text-xs leading-relaxed",
            isKali ? "text-[#d4d4d4]" : "",
          )}
        >
          {lines.map((line, i) => (
            <div
              key={`${line.type}-${i}-${line.text.slice(0, 20)}`}
              className={
                line.type === "input"
                  ? isKali
                    ? "mb-1.5 whitespace-pre-wrap"
                    : "mb-1.5 text-emerald-300"
                  : line.type === "output"
                    ? "mb-2 whitespace-pre-wrap text-slate-300"
                    : line.type === "error"
                      ? isKali
                        ? "mb-1.5 whitespace-pre-wrap text-[#f85149]"
                        : "mb-1.5 text-amber-200"
                      : line.type === "success"
                        ? "mb-1.5 font-semibold text-emerald-400"
                        : "mb-1.5 text-slate-500"
              }
            >
              {line.type === "input" && isKali ? renderKaliInput(line.text) : line.text}
            </div>
          ))}
        </div>

        {!disabled && (
          <form
            onSubmit={onSubmit}
            className={cn(
              "flex items-center gap-2 border-t px-3 py-2",
              isKali ? "border-[#333]/80 bg-[#0c0c0c]" : "border-white/10",
            )}
          >
            {isKali ? <KaliPrompt prompt={prompt} /> : (
              <span className="shrink-0 font-mono text-xs text-emerald-400">{prompt}</span>
            )}
            <input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={onKeyDown}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              className={cn(
                "min-w-0 flex-1 bg-transparent font-mono text-xs outline-none placeholder:text-slate-600",
                isKali ? "text-white caret-[#2ecc71]" : "text-white",
              )}
              placeholder={placeholder}
            />
            {isKali ? (
              <span className="animate-pulse font-mono text-[#2ecc71]/80">█</span>
            ) : (
              <span className="animate-pulse font-mono text-emerald-400/80">▋</span>
            )}
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

  return { history, push, handleKeyDown, resetHistory };
}
