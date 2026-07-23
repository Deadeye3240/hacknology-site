import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AlertTriangleIcon } from "@/components/ui/icons";
import { useGameScore } from "@/hooks/useGameScore";
import { paths } from "@/routes/paths";
import { cn } from "@/lib/cn";

type Verdict = "Phishing" | "Legitimate";

interface EmailRound {
  from: string;
  subject: string;
  preview: string;
  answer: Verdict;
  explanation: string;
}

const ROUNDS: EmailRound[] = [
  {
    from: "security@paypa1-support.com",
    subject: "Urgent: verify your account within 1 hour",
    preview: "Your account will be suspended. Click here to confirm billing details immediately.",
    answer: "Phishing",
    explanation: "Typosquatted domain, urgency, and credential-harvesting language.",
  },
  {
    from: "noreply@github.com",
    subject: "[GitHub] New sign-in from Chrome on Windows",
    preview: "We noticed a sign-in to your account. If this was you, no action is needed.",
    answer: "Legitimate",
    explanation: "Expected security notification format from the real domain with no pressure to click blindly.",
  },
  {
    from: "it-helpdesk@hacknology-internal.net",
    subject: "Password reset required today",
    preview: "All employees must reset passwords via the attached link before end of day.",
    answer: "Phishing",
    explanation: "Unfamiliar internal domain and forced immediate action via external link.",
  },
  {
    from: "billing@stripe.com",
    subject: "Your receipt from Hacknology",
    preview: "Thanks for your payment. View receipt #1042 in your dashboard — no action required.",
    answer: "Legitimate",
    explanation: "Informational receipt with no credential request or threatening deadline.",
  },
  {
    from: "admin@microsft-login.support",
    subject: "Unusual activity detected",
    preview: "Sign in with your Microsoft password to review suspicious downloads.",
    answer: "Phishing",
    explanation: "Misspelled brand domain and direct password prompt.",
  },
];

const OPTIONS: Verdict[] = ["Phishing", "Legitimate"];

export default function PhishingDetectorPage() {
  const { bestScore, saveScore } = useGameScore("phishing-detector");
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
      <PageHeader eyebrow="Nerd Games" title="Phishing Detector" icon={AlertTriangleIcon} />
      <PageContainer className="py-10">
        <div className="mx-auto max-w-2xl">
          <Card className="flex flex-col gap-5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Email {finished ? ROUNDS.length : index + 1} / {ROUNDS.length}</span>
              {bestScore !== null && !finished && (
                <span className="font-mono text-accent-300">Best {bestScore}</span>
              )}
            </div>

            {finished ? (
              <>
                <h2 className="text-xl font-semibold text-white">Inbox review complete</h2>
                <p className="text-slate-300">
                  {score} / {ROUNDS.length} messages classified correctly.
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
                <p className="text-sm text-slate-400">Is this message phishing or legitimate?</p>
                <div className="rounded-xl border border-white/10 bg-base-950/80 p-4 font-mono text-xs sm:text-sm">
                  <p className="text-slate-500">
                    From: <span className="text-slate-300">{round.from}</span>
                  </p>
                  <p className="mt-2 text-slate-500">
                    Subject: <span className="text-white">{round.subject}</span>
                  </p>
                  <p className="mt-3 leading-relaxed text-slate-400">{round.preview}</p>
                </div>
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
                  {index + 1 >= ROUNDS.length ? "Finish" : "Next email"}
                </Button>
              </>
            )}
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
