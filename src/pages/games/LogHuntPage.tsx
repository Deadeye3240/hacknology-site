import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchIcon } from "@/components/ui/icons";
import { useGameScore } from "@/hooks/useGameScore";
import { paths } from "@/routes/paths";
import { cn } from "@/lib/cn";

interface LogRound {
  title: string;
  lines: string[];
  suspiciousIndex: number;
  explanation: string;
}

const ROUNDS: LogRound[] = [
  {
    title: "SSH auth.log",
    lines: [
      "Jan 12 08:01:02 host sshd[2201]: Accepted publickey for deploy from 10.0.1.44",
      "Jan 12 08:04:11 host sshd[2208]: Failed password for root from 203.0.113.88 port 42231",
      "Jan 12 08:04:13 host sshd[2208]: Failed password for root from 203.0.113.88 port 42231",
      "Jan 12 08:04:15 host sshd[2208]: Failed password for admin from 203.0.113.88 port 42231",
      "Jan 12 08:04:17 host sshd[2208]: Accepted password for admin from 203.0.113.88 port 42231",
    ],
    suspiciousIndex: 4,
    explanation: "External IP brute-forced accounts then gained access with password auth.",
  },
  {
    title: "Web access.log",
    lines: [
      '10.0.2.15 - - [12/Jan/2026:09:10:01] "GET /dashboard HTTP/1.1" 200 4120',
      '10.0.2.15 - - [12/Jan/2026:09:10:04] "GET /api/users/1042 HTTP/1.1" 200 890',
      '198.51.100.22 - - [12/Jan/2026:09:10:06] "GET /api/users/1043 HTTP/1.1" 200 902',
      '198.51.100.22 - - [12/Jan/2026:09:10:07] "GET /api/users/1044 HTTP/1.1" 200 911',
      '198.51.100.22 - - [12/Jan/2026:09:10:08] "GET /api/users/1045 HTTP/1.1" 200 887',
    ],
    suspiciousIndex: 2,
    explanation: "Sequential user ID enumeration from an unfamiliar IP suggests IDOR probing.",
  },
  {
    title: "Windows Security",
    lines: [
      "4624: An account was successfully logged on (user: jsmith)",
      "4624: An account was successfully logged on (user: jsmith)",
      "4740: A user account was locked out (user: svc-backup)",
      "4625: An account failed to log on (user: Administrator)",
      "4625: An account failed to log on (user: Administrator)",
    ],
    suspiciousIndex: 3,
    explanation: "Repeated failed logons for Administrator after a service account lockout.",
  },
  {
    title: "DNS query log",
    lines: [
      "query: wiki.hacknology.xyz A",
      "query: status.github.com A",
      "query: update-service-secure.net A",
      "query: packages.cloudflare.com A",
      "query: update-service-secure.net TXT",
    ],
    suspiciousIndex: 2,
    explanation: "Rare domain with security-themed name is a common malware C2 pattern.",
  },
];

export default function LogHuntPage() {
  const { bestScore, saveScore } = useGameScore("log-hunt");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  const round = ROUNDS[index];

  function choose(lineIndex: number) {
    if (selected !== null) return;
    setSelected(lineIndex);
    if (lineIndex === round.suspiciousIndex) setScore((s) => s + 1);
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
      <PageHeader eyebrow="Nerd Games" title="Log Hunt" icon={SearchIcon} />
      <PageContainer className="py-10">
        <div className="mx-auto max-w-3xl">
          <Card className="flex flex-col gap-5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Case {finished ? ROUNDS.length : index + 1} / {ROUNDS.length}</span>
              {bestScore !== null && !finished && (
                <span className="font-mono text-accent-300">Best {bestScore}</span>
              )}
            </div>

            {finished ? (
              <>
                <h2 className="text-xl font-semibold text-white">Shift complete</h2>
                <p className="text-slate-300">
                  {score} / {ROUNDS.length} suspicious entries found.
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
                  Click the log line that triggered the alert — <span className="text-white">{round.title}</span>
                </p>
                <div className="overflow-x-auto rounded-xl border border-white/10 bg-base-950 p-3 font-mono text-[11px] leading-relaxed sm:text-xs">
                  {round.lines.map((line, lineIndex) => (
                    <button
                      key={line}
                      type="button"
                      onClick={() => choose(lineIndex)}
                      disabled={selected !== null}
                      className={cn(
                        "block w-full rounded px-2 py-1.5 text-left transition",
                        selected === null && "hover:bg-white/5",
                        selected === lineIndex &&
                          lineIndex === round.suspiciousIndex &&
                          "bg-emerald-400/10 text-emerald-200",
                        selected === lineIndex &&
                          lineIndex !== round.suspiciousIndex &&
                          "bg-rose-400/10 text-rose-200",
                        selected !== null &&
                          selected !== lineIndex &&
                          lineIndex === round.suspiciousIndex &&
                          "bg-emerald-400/5 text-emerald-300/90",
                        selected !== null && selected !== lineIndex && lineIndex !== round.suspiciousIndex && "opacity-50",
                      )}
                    >
                      <span className="text-slate-600">{String(lineIndex + 1).padStart(2, "0")}</span>{" "}
                      {line}
                    </button>
                  ))}
                </div>
                {selected !== null && (
                  <p className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-slate-400">
                    {round.explanation}
                  </p>
                )}
                <Button onClick={next} disabled={selected === null} className="self-end" size="sm">
                  {index + 1 >= ROUNDS.length ? "Finish" : "Next case"}
                </Button>
              </>
            )}
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
