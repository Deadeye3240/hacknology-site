import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { QuizQuestion } from "@/types/education";

interface KnowledgeCheckProps {
  questions: QuizQuestion[];
  onPass: (score: number, total: number) => void;
  alreadyPassed?: boolean;
  previousScore?: { score: number; total: number };
}

const PASS_RATIO = 0.7;

export function KnowledgeCheck({
  questions,
  onPass,
  alreadyPassed,
  previousScore,
}: KnowledgeCheckProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[index];

  if (alreadyPassed) {
    return (
      <Card className="flex flex-col gap-2 border-emerald-400/20 bg-emerald-400/[0.04]">
        <Badge variant="success">Knowledge check passed</Badge>
        {previousScore && previousScore.total > 0 && (
          <p className="text-sm text-slate-300">
            Score: {previousScore.score}/{previousScore.total}
          </p>
        )}
      </Card>
    );
  }

  function choose(optionIndex: number) {
    if (selected !== null || !q) return;
    setSelected(optionIndex);
    const correct = optionIndex === q.correctIndex;
    if (correct) setScore((s) => s + 1);
    setFeedback(correct ? `Correct. ${q.explanation}` : `Incorrect. ${q.explanation}`);
  }

  function finishQuiz(finalScore: number) {
    setFinished(true);
    const total = questions.length;
    if (finalScore / total >= PASS_RATIO) onPass(finalScore, total);
  }

  function next() {
    if (!q) return;
    if (index + 1 >= questions.length) {
      finishQuiz(score);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setFeedback(null);
  }

  function retry() {
    setIndex(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const passed = score / questions.length >= PASS_RATIO;
    return (
      <Card className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-white">Knowledge check complete</h3>
        <p className="text-sm text-slate-300">
          Score: {score}/{questions.length} ({passed ? "Passed" : "Not passed — 70% required"})
        </p>
        {!passed && (
          <Button size="sm" className="self-start" onClick={retry}>
            Retry quiz
          </Button>
        )}
      </Card>
    );
  }

  if (!q) return null;

  return (
    <Card className="flex flex-col gap-4">
      <QuizHeader index={index} total={questions.length} />
      <p className="text-sm font-medium text-white">{q.prompt}</p>
      <ul className="flex flex-col gap-2">
        {q.options.map((opt, i) => {
          let cls = "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]";
          if (selected !== null) {
            if (i === q.correctIndex) cls = "border-emerald-400/40 bg-emerald-400/10";
            else if (i === selected) cls = "border-red-400/40 bg-red-400/10";
          }
          return (
            <li key={opt}>
              <button
                type="button"
                disabled={selected !== null}
                onClick={() => choose(i)}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm text-slate-200 transition-colors ${cls}`}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      {feedback && <p className="text-sm text-slate-400">{feedback}</p>}
      {selected !== null && (
        <Button size="sm" className="self-end" onClick={next}>
          {index + 1 >= questions.length ? "Finish" : "Next question"}
        </Button>
      )}
    </Card>
  );
}

function QuizHeader({ index, total }: { index: number; total: number }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-base font-semibold text-white">Knowledge check</h3>
      <Badge variant="neutral">
        {index + 1} / {total}
      </Badge>
    </div>
  );
}
