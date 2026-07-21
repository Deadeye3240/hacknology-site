import type { LessonExample } from "@/types/education";
import { Card } from "@/components/ui/Card";

export function LessonExampleBlock({ example }: { example: LessonExample }) {
  const base = "rounded-lg border border-white/10 bg-base-950 p-4 font-mono text-xs leading-relaxed";
  const colors: Record<LessonExample["kind"], string> = {
    command: "text-emerald-300",
    code: "text-accent-200",
    http: "text-sky-300",
    log: "text-amber-200/90",
    alert: "text-red-200/90 border-red-400/20 bg-red-400/[0.04]",
    diagram: "text-slate-300 font-sans text-sm",
  };

  return (
    <Card className="flex flex-col gap-2">
      {example.title && (
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {example.title}
        </h4>
      )}
      <pre className={`${base} ${colors[example.kind]} whitespace-pre-wrap`}>{example.content}</pre>
    </Card>
  );
}
