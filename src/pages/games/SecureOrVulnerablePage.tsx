import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShieldIcon } from "@/components/ui/icons";
import { useGameScore } from "@/hooks/useGameScore";
import { paths } from "@/routes/paths";
import { cn } from "@/lib/cn";

type Verdict = "Secure" | "Vulnerable";

interface ConfigRound {
  label: string;
  snippet: string;
  answer: Verdict;
  explanation: string;
}

const ROUNDS: ConfigRound[] = [
  {
    label: "HTTP response header",
    snippet: "Strict-Transport-Security: max-age=31536000; includeSubDomains",
    answer: "Secure",
    explanation: "HSTS enforces HTTPS for the site and subdomains.",
  },
  {
    label: "SQL query (login)",
    snippet: "SELECT * FROM users WHERE email = '\" + userInput + \"'",
    answer: "Vulnerable",
    explanation: "String concatenation allows SQL injection in the email field.",
  },
  {
    label: "Cookie flags",
    snippet: "Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict",
    answer: "Secure",
    explanation: "Session cookie uses HttpOnly, Secure, and strict same-site protection.",
  },
  {
    label: "File upload filter",
    snippet: "if (file.name.endsWith('.jpg')) { saveToWebRoot(file) }",
    answer: "Vulnerable",
    explanation: "Extension-only checks are bypassed with double extensions or polyglots.",
  },
  {
    label: "Password storage",
    snippet: "hash = bcrypt(password, cost=12)",
    answer: "Secure",
    explanation: "Adaptive hashing with bcrypt is appropriate for password storage.",
  },
  {
    label: "CORS policy",
    snippet: "Access-Control-Allow-Origin: *",
    answer: "Vulnerable",
    explanation: "Wildcard CORS on authenticated endpoints leaks cross-origin data.",
  },
];

const OPTIONS: Verdict[] = ["Secure", "Vulnerable"];

export default function SecureOrVulnerablePage() {
  const { bestScore, saveScore } = useGameScore("secure-or-vulnerable");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<Verdict | null>(null);
  const [finished, setFinished] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  const round = ROUNDS[index];

  function choose(option: Verdict) {
    if (selected !== null) return;
    setSelected(option);
    if (option === round.answer) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= ROUNDS.length) {
      const result = saveScore(score);
      setIsNewBest(result.isNewBest);
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setIsNewBest(false);
  }

  return (
    <>
      <PageHeader eyebrow="Nerd Games" title="Secure or Vulnerable" icon={ShieldIcon} />
      <PageContainer className="py-10">
        <div className="mx-auto max-w-2xl">
          <Card className="flex flex-col gap-5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Review {finished ? ROUNDS.length : index + 1} / {ROUNDS.length}</span>
              {bestScore !== null && !finished && (
                <span className="font-mono text-accent-300">Best {bestScore}</span>
              )}
            </div>

            {finished ? (
              <>
                <h2 className="text-xl font-semibold text-white">Review complete</h2>
                <p className="text-slate-300">
                  {score} / {ROUNDS.length} configurations judged correctly.
                </p>
                {isNewBest && (
                  <p className="text-sm text-accent-300">New personal best saved locally.</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button onClick={restart}>Play again</Button>
                  <Button to={paths.games} variant="secondary">
                    Back to arcade
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-400">
                  Is this configuration secure or vulnerable? —{" "}
                  <span className="text-white">{round.label}</span>
                </p>
                <pre className="overflow-x-auto rounded-xl border border-white/10 bg-base-950 p-4 font-mono text-xs text-emerald-100/90 sm:text-sm">
                  {round.snippet}
                </pre>
                <div className="grid gap-2 sm:grid-cols-2">
                  {OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => choose(option)}
                      disabled={selected !== null}
                      className={cn(
                        "rounded-lg border px-4 py-3 text-sm font-medium transition",
                        selected === null &&
                          "border-white/10 bg-surface/60 text-slate-200 hover:border-accent-400/30",
                        selected === option &&
                          option === round.answer &&
                          "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
                        selected === option &&
                          option !== round.answer &&
                          "border-rose-400/40 bg-rose-400/10 text-rose-200",
                        selected !== null &&
                          selected !== option &&
                          option === round.answer &&
                          "border-emerald-400/30 text-emerald-300/80",
                        selected !== null && selected !== option && option !== round.answer && "opacity-40",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {selected !== null && (
                  <p className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-slate-400">
                    {round.explanation}
                  </p>
                )}
                <Button onClick={next} disabled={selected === null} className="self-end" size="sm">
                  {index + 1 >= ROUNDS.length ? "Finish" : "Next review"}
                </Button>
              </>
            )}
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
