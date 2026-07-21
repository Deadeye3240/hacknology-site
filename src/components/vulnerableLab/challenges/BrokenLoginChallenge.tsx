import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Card } from "@/components/ui/Card";

interface BrokenLoginChallengeProps {
  onSolve: () => void;
}

const FAKE_USERS = [
  { username: "guest", password: "guest", role: "user" },
  { username: "admin", password: "Sup3rS3cret!", role: "admin" },
];

function buildQuery(username: string, password: string): string {
  return `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
}

function isInjectionBypass(username: string, password: string): boolean {
  const combined = `${username}${password}`.toLowerCase();
  return (
    combined.includes("' or '1'='1") ||
    combined.includes("' or 1=1") ||
    combined.includes("\" or \"1\"=\"1") ||
    (username.includes("'") && username.includes("or"))
  );
}

export function BrokenLoginChallenge({ onSolve }: BrokenLoginChallengeProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [adminAccess, setAdminAccess] = useState(false);

  function login(e: React.FormEvent) {
    e.preventDefault();
    const q = buildQuery(username, password);
    setQuery(q);

    const validUser = FAKE_USERS.find(
      (u) => u.username === username && u.password === password,
    );
    const bypass = isInjectionBypass(username, password);

    if (validUser?.role === "admin") {
      setAdminAccess(true);
      setMessage("Welcome, administrator.");
      onSolve();
    } else if (bypass) {
      setAdminAccess(true);
      setMessage("Authentication bypassed! Query returned a row because OR 1=1 is always true.");
      onSolve();
    } else if (validUser) {
      setMessage("Logged in as guest. You need admin access.");
    } else {
      setMessage("Login failed. No matching user.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-white/10 bg-base-950/80 font-mono text-sm">
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Simulated portal</p>
        {adminAccess ? (
          <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-200">
            <p className="font-semibold">Admin Dashboard</p>
            <p className="mt-1 text-sm">FLAG{"{BROKEN_AUTH}"}</p>
          </div>
        ) : (
          <form onSubmit={login} className="flex flex-col gap-3">
            <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" size="sm" className="self-start">
              Log in
            </Button>
          </form>
        )}
        {message && <p className="mt-3 text-xs text-slate-400">{message}</p>}
      </Card>
      {query && (
        <Card className="font-mono text-xs text-amber-200/90">
          <p className="mb-1 text-slate-500">Executed query (simulated):</p>
          <code className="break-all">{query}</code>
        </Card>
      )}
    </div>
  );
}
