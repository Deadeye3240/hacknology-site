import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Card } from "@/components/ui/Card";

interface CookieMonsterChallengeProps {
  onSolve: () => void;
}

export function CookieMonsterChallenge({ onSolve }: CookieMonsterChallengeProps) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("user");
  const [cookieInput, setCookieInput] = useState("role=user");
  const [solved, setSolved] = useState(false);

  function login() {
    setLoggedIn(true);
    setRole("user");
    setCookieInput("role=user");
  }

  function applyCookie() {
    const match = cookieInput.match(/role=(\w+)/);
    const newRole = match?.[1] ?? "user";
    setRole(newRole);
    if (newRole === "admin") {
      setSolved(true);
      onSolve();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-white/10 bg-base-950/80">
        <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">
          Simulated session (fake cookies only)
        </p>
        {!loggedIn ? (
          <Button onClick={login}>Log in as testuser</Button>
        ) : (
          <>
            <p className="mb-3 text-sm text-slate-300">
              Logged in. Current role: <strong className="text-white">{role}</strong>
            </p>
            {role === "admin" ? (
              <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-200">
                <p className="font-semibold">Admin Panel</p>
                <p className="mt-1 font-mono text-sm">FLAG{"{COOKIE_FORGE}"}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400">User dashboard — admin features hidden.</p>
            )}
            <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
              <p className="text-xs text-slate-500">Cookie editor (simulated)</p>
              <TextField
                label="document.cookie"
                value={cookieInput}
                onChange={(e) => setCookieInput(e.target.value)}
              />
              <Button size="sm" className="self-start" onClick={applyCookie}>
                Apply cookie
              </Button>
            </div>
          </>
        )}
        {solved && (
          <p className="mt-3 text-xs text-emerald-300">
            Privilege escalated by forging a client-side cookie!
          </p>
        )}
      </Card>
    </div>
  );
}
