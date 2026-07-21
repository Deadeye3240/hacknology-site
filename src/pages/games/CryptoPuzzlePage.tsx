import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { LockIcon } from "@/components/ui/icons";
import { paths } from "@/routes/paths";

const PUZZLES = [
  {
    hint: "Base64 decode this flag fragment:",
    encoded: "SEFDS05PTE9HWQ==",
    answer: "HACKNOLOGY",
  },
  {
    hint: "Caesar cipher (shift 1 back). Decode the message:",
    encoded: "Uif dpvou is 42",
    answer: "The count is 42",
  },
  {
    hint: "Hex to ASCII — what word is spelled out?",
    encoded: "4861636b",
    answer: "Hack",
  },
];

export default function CryptoPuzzlePage() {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const puzzle = PUZZLES[index];

  function check() {
    if (input.trim().toLowerCase() === puzzle.answer.toLowerCase()) {
      if (index + 1 >= PUZZLES.length) {
        setMessage("Correct!");
        setDone(true);
      } else {
        setMessage("Correct! Next puzzle…");
        setTimeout(() => {
          setIndex((i) => i + 1);
          setInput("");
          setMessage(null);
        }, 600);
      }
    } else {
      setMessage("Not quite — try again.");
    }
  }

  return (
    <>
      <PageHeader eyebrow="Nerd Games" title="Crypto Decoder" icon={LockIcon} />
      <PageContainer className="py-10">
        <div className="mx-auto max-w-xl">
          <Card className="flex flex-col gap-4">
            {done ? (
              <>
                <h2 className="text-xl font-semibold text-white">All puzzles solved!</h2>
                <p className="text-slate-300">You decoded every challenge. Nice work.</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setIndex(0);
                      setInput("");
                      setMessage(null);
                      setDone(false);
                    }}
                  >
                    Play again
                  </Button>
                  <Button to={paths.games} variant="ghost">
                    All games
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-400">
                  Puzzle {index + 1} of {PUZZLES.length}
                </p>
                <p className="text-white">{puzzle.hint}</p>
                <code className="rounded-lg border border-white/10 bg-base-950 px-3 py-2 font-mono text-sm text-accent-200">
                  {puzzle.encoded}
                </code>
                <TextField
                  label="Your answer"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && check()}
                />
                {message && (
                  <p className={message.startsWith("Correct") ? "text-emerald-300" : "text-red-300"}>
                    {message}
                  </p>
                )}
                <Button onClick={check}>Submit</Button>
              </>
            )}
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
