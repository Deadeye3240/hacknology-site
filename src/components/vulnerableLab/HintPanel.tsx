import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface HintPanelProps {
  hints: string[];
}

export function HintPanel({ hints }: HintPanelProps) {
  const [revealed, setRevealed] = useState(0);

  if (hints.length === 0) return null;

  return (
    <Card className="flex flex-col gap-3 border-white/5 bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Hints</h3>
        <span className="text-xs text-slate-500">
          {revealed} / {hints.length} revealed
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {hints.slice(0, revealed).map((hint, i) => (
          <li key={hint} className="rounded-lg border border-white/5 bg-base-950/50 px-3 py-2 text-sm text-slate-300">
            <span className="mr-2 font-medium text-accent-300">#{i + 1}</span>
            {hint}
          </li>
        ))}
      </ul>
      {revealed < hints.length && (
        <Button variant="ghost" size="sm" className="self-start" onClick={() => setRevealed((n) => n + 1)}>
          Reveal next hint
        </Button>
      )}
    </Card>
  );
}
