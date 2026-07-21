import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface SecurityHeadersChallengeProps {
  onSolve: () => void;
}

const PRESENT_HEADERS = [
  "HTTP/1.1 200 OK",
  "Content-Type: text/html; charset=utf-8",
  "Server: FakeCorp/1.0",
  "Set-Cookie: session=abc123; Path=/",
  "Cache-Control: no-cache",
];

const MISSING_HEADERS = [
  "content-security-policy",
  "strict-transport-security",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
];

const HEADER_OPTIONS = [
  { id: "content-security-policy", label: "Content-Security-Policy" },
  { id: "strict-transport-security", label: "Strict-Transport-Security (HSTS)" },
  { id: "x-frame-options", label: "X-Frame-Options" },
  { id: "x-content-type-options", label: "X-Content-Type-Options" },
  { id: "referrer-policy", label: "Referrer-Policy" },
  { id: "etag", label: "ETag" },
  { id: "accept-language", label: "Accept-Language" },
];

export function SecurityHeadersChallenge({ onSolve }: SecurityHeadersChallengeProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function check() {
    const missingSelected = MISSING_HEADERS.filter((h) => selected.has(h));
    const wrongSelected = [...selected].filter((h) => !MISSING_HEADERS.includes(h));

    if (
      missingSelected.length === MISSING_HEADERS.length &&
      wrongSelected.length === 0
    ) {
      setFeedback("Correct! You identified all missing security headers.");
      setSolved(true);
      onSolve();
    } else if (wrongSelected.length > 0) {
      setFeedback("Some selected headers are actually present or not security-related.");
    } else {
      setFeedback(`You found ${missingSelected.length}/${MISSING_HEADERS.length} missing headers.`);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-white/10 bg-base-950/80">
        <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">
          Simulated HTTP response
        </p>
        <pre className="mb-4 rounded-lg border border-white/10 bg-base-950 p-3 font-mono text-xs text-slate-300">
          {PRESENT_HEADERS.join("\n")}
        </pre>
        <p className="mb-3 text-sm text-white">
          Select all security headers that are <strong>missing</strong> from this response:
        </p>
        <ul className="flex flex-col gap-2">
          {HEADER_OPTIONS.map((opt) => (
            <li key={opt.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 px-3 py-2 hover:bg-white/[0.03]">
                <input
                  type="checkbox"
                  checked={selected.has(opt.id)}
                  onChange={() => toggle(opt.id)}
                  className="rounded border-white/20"
                />
                <span className="text-sm text-slate-200">{opt.label}</span>
              </label>
            </li>
          ))}
        </ul>
        {feedback && (
          <p className={`mt-3 text-sm ${solved ? "text-emerald-300" : "text-amber-200"}`}>
            {feedback}
          </p>
        )}
        {!solved && (
          <Button size="sm" className="mt-4" onClick={check}>
            Submit audit
          </Button>
        )}
      </Card>
    </div>
  );
}
