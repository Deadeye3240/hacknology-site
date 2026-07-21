import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TargetIcon } from "@/components/ui/icons";
import { paths } from "@/routes/paths";

const QUESTIONS = [
  {
    q: "What does the 'C' in the CIA triad stand for?",
    options: ["Confidentiality", "Compliance", "Cryptography", "Continuity"],
    answer: 0,
  },
  {
    q: "Which port is typically used for HTTPS?",
    options: ["21", "80", "443", "3389"],
    answer: 2,
  },
  {
    q: "What attack tricks users into revealing credentials on a fake site?",
    options: ["SQL injection", "Phishing", "Buffer overflow", "ARP spoofing"],
    answer: 1,
  },
  {
    q: "Which HTTP header helps mitigate XSS by restricting script sources?",
    options: ["Content-Security-Policy", "User-Agent", "Accept-Language", "ETag"],
    answer: 0,
  },
  {
    q: "What does MFA add beyond a password?",
    options: ["Another layer of verification", "Faster login", "Plaintext storage", "Open Wi-Fi"],
    answer: 0,
  },
];

export default function CyberTriviaPage() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const current = QUESTIONS[index];

  function choose(option: number) {
    if (selected !== null) return;
    setSelected(option);
    if (option === current.answer) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= QUESTIONS.length) {
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
  }

  return (
    <>
      <PageHeader eyebrow="Nerd Games" title="Cybersecurity Trivia" icon={TargetIcon} />
      <PageContainer className="py-10">
        <div className="mx-auto max-w-xl">
          <Card className="flex flex-col gap-4">
            {finished ? (
              <>
                <h2 className="text-xl font-semibold text-white">Round complete!</h2>
                <p className="text-slate-300">
                  You scored <strong>{score}</strong> out of {QUESTIONS.length}.
                </p>
                <div className="flex gap-2">
                  <Button onClick={restart}>Play again</Button>
                  <Button to={paths.games} variant="ghost">
                    All games
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <Badge variant="neutral">
                    Question {index + 1} / {QUESTIONS.length}
                  </Badge>
                  <span className="text-sm text-slate-400">Score: {score}</span>
                </div>
                <p className="text-lg font-medium text-white">{current.q}</p>
                <ul className="flex flex-col gap-2">
                  {current.options.map((opt, i) => {
                    let variant = "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]";
                    if (selected !== null) {
                      if (i === current.answer) variant = "border-emerald-400/40 bg-emerald-400/10";
                      else if (i === selected) variant = "border-red-400/40 bg-red-400/10";
                    }
                    return (
                      <li key={opt}>
                        <button
                          type="button"
                          disabled={selected !== null}
                          onClick={() => choose(i)}
                          className={`w-full rounded-lg border px-4 py-3 text-left text-sm text-slate-200 transition-colors ${variant}`}
                        >
                          {opt}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {selected !== null && (
                  <Button onClick={next} className="self-end">
                    {index + 1 >= QUESTIONS.length ? "See results" : "Next question"}
                  </Button>
                )}
              </>
            )}
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
