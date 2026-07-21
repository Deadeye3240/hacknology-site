import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Card } from "@/components/ui/Card";

interface IdorChallengeProps {
  onSolve: () => void;
}

const FAKE_PROFILES: Record<
  number,
  { name: string; role: string; email: string; secret?: string }
> = {
  1: { name: "Alice Chen", role: "Engineer", email: "alice@fakecorp.test" },
  2: { name: "Bob Martinez", role: "Designer", email: "bob@fakecorp.test" },
  3: { name: "Carol White", role: "HR", email: "carol@fakecorp.test" },
  4: { name: "Dana Kim", role: "Intern", email: "dana@fakecorp.test" },
  99: {
    name: "Executive Admin",
    role: "admin",
    email: "ceo@fakecorp.test",
    secret: "FLAG{IDOR_LEAK}",
  },
};

export function IdorChallenge({ onSolve }: IdorChallengeProps) {
  const [idInput, setIdInput] = useState("1");
  const [profile, setProfile] = useState(FAKE_PROFILES[1]);
  const [solved, setSolved] = useState(false);

  function lookup() {
    const id = parseInt(idInput, 10);
    const found = FAKE_PROFILES[id];
    if (found) {
      setProfile(found);
      if (found.secret) {
        setSolved(true);
        onSolve();
      }
    } else {
      setProfile({ name: "Not found", role: "-", email: "-" });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-white/10 bg-base-950/80">
        <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">
          Employee directory (you are logged in as guest)
        </p>
        <div className="flex gap-2">
          <TextField
            label="Profile ID"
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
          />
          <Button size="sm" className="self-end" onClick={lookup}>
            View profile
          </Button>
        </div>
        <dl className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <dt className="text-slate-500">Name</dt>
            <dd className="text-white">{profile.name}</dd>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <dt className="text-slate-500">Role</dt>
            <dd className="text-white">{profile.role}</dd>
          </div>
          <div className="flex justify-between pb-2">
            <dt className="text-slate-500">Email</dt>
            <dd className="text-white">{profile.email}</dd>
          </div>
          {profile.secret && (
            <div className="mt-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-emerald-200">
              Confidential: {profile.secret}
            </div>
          )}
        </dl>
        {solved && (
          <p className="mt-3 text-xs text-emerald-300">
            You accessed a profile that should have been restricted.
          </p>
        )}
      </Card>
    </div>
  );
}
