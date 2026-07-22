import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { ScanMeHint } from "@/data/scanme";

interface ScanMeHintPanelProps {
  hints: ScanMeHint[];
  onHintCountChange?: (count: number) => void;
}

export function ScanMeHintPanel({ hints, onHintCountChange }: ScanMeHintPanelProps) {
  const [revealed, setRevealed] = useState(0);

  if (hints.length === 0) return null;

  function revealNext() {
    if (revealed >= hints.length) return;
    const next = revealed + 1;
    setRevealed(next);
    onHintCountChange?.(next);
  }

  return (
    <div className="rounded-lg border border-white/10 bg-base-950/80 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">Progressive hints</h3>
        <span className="text-xs text-slate-500">
          {revealed} / {hints.length}
        </span>
      </div>
      {revealed > 0 && (
        <ul className="mb-3 flex flex-col gap-2">
          {hints.slice(0, revealed).map((hint, i) => (
            <li
              key={hint.label}
              className="rounded-md border border-accent-400/15 bg-accent-400/[0.04] px-3 py-2 text-sm text-slate-300"
            >
              <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-accent-300">
                Hint {i + 1} — {hint.label}
              </span>
              <span className="whitespace-pre-wrap">{hint.text}</span>
            </li>
          ))}
        </ul>
      )}
      {revealed < hints.length ? (
        <Button variant="ghost" size="sm" onClick={revealNext}>
          {revealed === 0 ? "Need a hint?" : "Next hint"}
        </Button>
      ) : (
        <p className="text-xs text-slate-500">All hints revealed for this mission.</p>
      )}
    </div>
  );
}
