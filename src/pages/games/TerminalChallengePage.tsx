import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TerminalIcon } from "@/components/ui/icons";
import { paths } from "@/routes/paths";

const CHALLENGES = [
  {
    prompt: "Which command lists files in a directory, including hidden ones?",
    options: ["ls -la", "cat /etc/passwd", "chmod 777", "ping google.com"],
    answer: 0,
  },
  {
    prompt: "Which command shows your current working directory?",
    options: ["pwd", "cd", "whoami", "grep"],
    answer: 0,
  },
  {
    prompt: "Which tool is commonly used to scan open ports on a host?",
    options: ["nmap", "nano", "tar", "ssh-keygen"],
    answer: 0,
  },
  {
    prompt: "Which command searches for a pattern inside files recursively?",
    options: ["grep -r", "rm -rf", "mount", "ifconfig"],
    answer: 0,
  },
  {
    prompt: "Which command securely copies files over SSH?",
    options: ["scp", "ftp", "telnet", "curl"],
    answer: 0,
  },
];

export default function TerminalChallengePage() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const challenge = CHALLENGES[index];

  function choose(option: number) {
    if (selected !== null) return;
    setSelected(option);
    if (option === challenge.answer) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= CHALLENGES.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  return (
    <>
      <PageHeader eyebrow="Nerd Games" title="Terminal Challenge" icon={TerminalIcon} />
      <PageContainer className="py-10">
        <div className="mx-auto max-w-xl">
          <Card className="flex flex-col gap-4">
            <div className="rounded-lg border border-emerald-500/20 bg-base-950 px-4 py-3 font-mono text-sm text-emerald-300">
              hacker@hacknology:~$ mission_{index + 1}
            </div>
            {finished ? (
              <>
                <h2 className="text-xl font-semibold text-white">Session complete</h2>
                <p className="text-slate-300">
                  {score} / {CHALLENGES.length} commands matched correctly.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setIndex(0);
                      setScore(0);
                      setSelected(null);
                      setFinished(false);
                    }}
                  >
                    Retry
                  </Button>
                  <Button to={paths.games} variant="ghost">
                    All games
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-white">{challenge.prompt}</p>
                <ul className="flex flex-col gap-2">
                  {challenge.options.map((opt, i) => {
                    let cls = "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]";
                    if (selected !== null) {
                      if (i === challenge.answer) cls = "border-emerald-400/40 bg-emerald-400/10";
                      else if (i === selected) cls = "border-red-400/40 bg-red-400/10";
                    }
                    return (
                      <li key={opt}>
                        <button
                          type="button"
                          disabled={selected !== null}
                          onClick={() => choose(i)}
                          className={`w-full rounded-lg border px-4 py-3 text-left font-mono text-sm text-slate-200 transition-colors ${cls}`}
                        >
                          $ {opt}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {selected !== null && (
                  <Button onClick={next} className="self-end">
                    {index + 1 >= CHALLENGES.length ? "Finish" : "Next command"}
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
