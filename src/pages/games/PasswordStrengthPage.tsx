import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LockIcon } from "@/components/ui/icons";
import { useGameScore } from "@/hooks/useGameScore";
import { paths } from "@/routes/paths";
import { cn } from "@/lib/cn";

type Strength = "Weak" | "Fair" | "Strong";

interface Round {
  password: string;
  answer: Strength;
  hint: string;
}

const ROUNDS: Round[] = [
  { password: "password123", answer: "Weak", hint: "Common dictionary word plus digits." },
  { password: "P@ssw0rd!", answer: "Weak", hint: "Predictable substitutions on a leaked base password." },
  { password: "correct-horse-battery-staple", answer: "Strong", hint: "Long passphrase with unrelated words." },
  { password: "Summer2024!", answer: "Fair", hint: "Season + year patterns are guessable but length helps." },
  { password: "qwertyuiop", answer: "Weak", hint: "Keyboard walk with no entropy." },
  { password: "k9#mP2$vL8@nQ4!xR", answer: "Strong", hint: "Random length and mixed character classes." },
];

const OPTIONS: Strength[] = ["Weak", "Fair", "Strong"];

export default function PasswordStrengthPage() {
  const { bestScore, saveScore } = useGameScore("password-strength");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<Strength | null>(null);
  const [finished, setFinished] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  const round = ROUNDS[index];

  function choose(option: Strength) {
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
      <PageHeader eyebrow="Nerd Games" title="Password Strength Challenge" icon={LockIcon} />
      <PageContainer className="py-10">
        <div className="mx-auto max-w-xl">
          <Card className="flex flex-col gap-5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Round {finished ? ROUNDS.length : index + 1} / {ROUNDS.length}
              </span>
              {bestScore !== null && !finished && (
                <span className="font-mono text-accent-300">Best {bestScore}</span>
              )}
            </div>

            {finished ? (
              <>
                <h2 className="text-xl font-semibold text-white">Assessment complete</h2>
                <p className="text-slate-300">
                  {score} / {ROUNDS.length} passwords rated correctly.
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
                <p className="text-sm text-slate-400">How strong is this password?</p>
                <div className="break-all rounded-lg border border-white/10 bg-base-950 px-4 py-3 font-mono text-sm text-emerald-200">
                  {round.password}
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => choose(option)}
                      disabled={selected !== null}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-sm font-medium transition",
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
                    {round.hint}
                  </p>
                )}
                <Button onClick={next} disabled={selected === null} className="self-end" size="sm">
                  {index + 1 >= ROUNDS.length ? "Finish" : "Next"}
                </Button>
              </>
            )}
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
