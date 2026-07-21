import { useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { EmptyState } from "@/components/ui/EmptyState";
import { RadarIcon } from "@/components/ui/icons";
import { LabIsolationBanner } from "@/components/vulnerableLab/LabIsolationBanner";
import { getScanMeMission } from "@/data/scanme";
import { useScanMe } from "@/context/ScanMeContext";
import { difficultyBadgeVariant } from "@/lib/difficulty";
import { paths } from "@/routes/paths";

export default function ScanMeMissionPage() {
  const { missionId } = useParams();
  const mission = missionId ? getScanMeMission(missionId) : undefined;
  const { submitFlag, isMissionComplete, missionProgress, isFlagSubmitted } = useScanMe();
  const [flagInput, setFlagInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState(0);

  if (!mission) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          title="Mission not found"
          description="This ScanMe mission does not exist."
          action={<Button to={paths.scanme}>Back to ScanMe</Button>}
        />
      </PageContainer>
    );
  }

  const progress = missionProgress(mission.id);
  const done = isMissionComplete(mission.id);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mission) return;
    const result = submitFlag(mission.id, flagInput);
    setMessage(result.message);
    if (result.success) setFlagInput("");
  }

  return (
    <>
      <PageHeader
        eyebrow="ScanMe Lab"
        title={mission.title}
        description={mission.description}
        icon={RadarIcon}
        actions={<Badge variant={difficultyBadgeVariant(mission.level)}>{mission.level}</Badge>}
      />
      <PageContainer className="py-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <LabIsolationBanner />

          <Card className="flex flex-col gap-2 p-5">
            <h2 className="font-semibold text-white">Mission briefing</h2>
            <p className="text-sm text-slate-400">{mission.targetNote}</p>
            <p className="font-mono text-sm text-accent-200">Target: {mission.targetHost}</p>
            <ul className="mt-2 list-inside list-disc text-sm text-slate-300">
              {mission.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-slate-500">
              Flags: {progress.found}/{progress.total}
              {done && " · Mission complete"}
            </p>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <h2 className="font-semibold text-white">Built-in scan simulator</h2>
            <p className="text-xs text-slate-500">
              Use this if you have not deployed the isolated lab target locally. Real practice: run{" "}
              <code className="text-slate-400">nmap {mission.targetHost}</code> in your terminal.
            </p>
            <pre className="max-h-64 overflow-auto rounded-lg border border-white/10 bg-base-950 p-4 font-mono text-xs text-emerald-300/90">
              {mission.simulatedScanOutput}
            </pre>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <h2 className="font-semibold text-white">Submit flag</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <TextField
                label="Flag (HACKNOLOGY{...})"
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                placeholder="HACKNOLOGY{...}"
              />
              {message && (
                <p
                  className={
                    message.includes("Correct") || message.includes("complete")
                      ? "text-emerald-300"
                      : "text-amber-200"
                  }
                >
                  {message}
                </p>
              )}
              <Button type="submit" size="sm" className="self-start">
                Submit flag
              </Button>
            </form>
            <ul className="mt-2 flex flex-col gap-1 text-xs text-slate-500">
              {mission.flags.map((f) => (
                <li key={f.id}>
                  {isFlagSubmitted(mission.id, f.id) ? "✓" : "○"} Flag {f.id.replace("-", " ")}
                </li>
              ))}
            </ul>
          </Card>

          {hintsRevealed < mission.hints.length && (
            <Button
              variant="ghost"
              size="sm"
              className="self-start"
              onClick={() => setHintsRevealed((h) => h + 1)}
            >
              Reveal hint ({hintsRevealed}/{mission.hints.length})
            </Button>
          )}
          {mission.hints.slice(0, hintsRevealed).map((h, i) => (
            <Card key={h} className="p-4 text-sm text-slate-300">
              <span className="text-accent-300">Hint {i + 1}:</span> {h}
            </Card>
          ))}

          <Button to={paths.scanme} variant="ghost" size="sm" className="self-start">
            ← All missions
          </Button>
        </div>
      </PageContainer>
    </>
  );
}
