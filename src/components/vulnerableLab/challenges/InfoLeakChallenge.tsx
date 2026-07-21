import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Card } from "@/components/ui/Card";

interface InfoLeakChallengeProps {
  onSolve: () => void;
}

const PAGE_SOURCE = `<!DOCTYPE html>
<html>
<head><title>FakeCorp Portal</title></head>
<body>
  <h1>Welcome</h1>
  <!-- TODO: remove before prod - API_KEY=sk-fake-FLAG_INFO_DISCLOSURE-7x9k -->
  <p>Employee portal v2.1</p>
</body>
</html>`;

const ENV_BACKUP = `# .env.bak (should not be public!)
DATABASE_URL=postgres://localhost/fake
API_KEY=sk-fake-FLAG_INFO_DISCLOSURE-7x9k
DEBUG=true`;

export function InfoLeakChallenge({ onSolve }: InfoLeakChallengeProps) {
  const [tab, setTab] = useState<"app" | "source" | "env">("app");
  const [flagInput, setFlagInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function submitFlag(e: React.FormEvent) {
    e.preventDefault();
    const normalized = flagInput.trim();
    if (
      normalized === "sk-fake-FLAG_INFO_DISCLOSURE-7x9k" ||
      normalized === "FLAG_INFO_DISCLOSURE"
    ) {
      setMessage("Correct! You found the leaked API key.");
      onSolve();
    } else {
      setMessage("That doesn't match the leaked secret.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-white/10 bg-base-950/80">
        <div className="mb-4 flex gap-2">
          {(["app", "source", "env"] as const).map((t) => (
            <Button
              key={t}
              size="sm"
              variant={tab === t ? "secondary" : "ghost"}
              onClick={() => setTab(t)}
            >
              {t === "app" ? "Application" : t === "source" ? "View Source" : "/.env.bak"}
            </Button>
          ))}
        </div>
        {tab === "app" && (
          <div className="rounded-lg border border-white/10 p-4">
            <h2 className="text-lg font-semibold text-white">Welcome</h2>
            <p className="mt-2 text-sm text-slate-400">Employee portal v2.1</p>
          </div>
        )}
        {tab === "source" && (
          <pre className="max-h-48 overflow-auto rounded-lg border border-white/10 bg-base-950 p-3 font-mono text-xs text-slate-400">
            {PAGE_SOURCE}
          </pre>
        )}
        {tab === "env" && (
          <pre className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 font-mono text-xs text-amber-200/90">
            {ENV_BACKUP}
          </pre>
        )}
        <form onSubmit={submitFlag} className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
          <TextField
            label="Submit the leaked API key"
            value={flagInput}
            onChange={(e) => setFlagInput(e.target.value)}
          />
          {message && (
            <p className={message.startsWith("Correct") ? "text-emerald-300" : "text-red-300"}>
              {message}
            </p>
          )}
          <Button type="submit" size="sm" className="self-start">
            Verify
          </Button>
        </form>
      </Card>
    </div>
  );
}
