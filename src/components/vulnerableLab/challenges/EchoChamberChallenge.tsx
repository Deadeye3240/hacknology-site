import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Card } from "@/components/ui/Card";

interface EchoChamberChallengeProps {
  onSolve: () => void;
}

export function EchoChamberChallenge({ onSolve }: EchoChamberChallengeProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const sandboxRef = useRef<HTMLDivElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, input]);

    const lower = input.toLowerCase();
    const hasScript =
      lower.includes("<script") ||
      lower.includes("onerror") ||
      lower.includes("onclick") ||
      lower.includes("javascript:");

    if (hasScript) {
      setSolved(true);
      onSolve();
    }
    setInput("");
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-white/10 bg-base-950/80">
        <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">
          Guestbook (unsanitized reflection — sandboxed)
        </p>
        <form onSubmit={submit} className="mb-4 flex gap-2">
          <TextField
            label="Your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" size="sm" className="self-end">
            Post
          </Button>
        </form>
        <div
          ref={sandboxRef}
          className="min-h-[120px] rounded-lg border border-red-400/20 bg-red-400/[0.03] p-4"
        >
          <p className="mb-2 text-xs text-red-300/80">Reflected output (vulnerable):</p>
          {messages.length === 0 ? (
            <p className="text-sm text-slate-500">No messages yet.</p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={`${i}-${msg.slice(0, 20)}`}
                className="mb-2 border-b border-white/5 pb-2 text-sm text-slate-200"
                dangerouslySetInnerHTML={{ __html: msg }}
              />
            ))
          )}
          <p
            id="xss-flag"
            className={`mt-3 font-mono text-emerald-300 ${solved ? "block" : "hidden"}`}
          >
            FLAG{"{XSS_ECHO}"}
          </p>
        </div>
        {solved && (
          <p className="mt-3 text-xs text-emerald-300">
            Your payload executed in the sandbox. In production, this could steal sessions.
          </p>
        )}
      </Card>
    </div>
  );
}
