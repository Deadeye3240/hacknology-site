import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextField, TextAreaField } from "@/components/ui/TextField";
import { api, ApiError } from "@/lib/api";
import { learningPathMeta } from "@/data/lessons/learningPathMeta";
import { getPathAssessment } from "@/data/lessons";

interface CmsAssessment {
  id: string;
  pathId: string;
  title: string;
  status: string;
}

export default function AdminAssessmentsPage() {
  const [items, setItems] = useState<CmsAssessment[]>([]);
  const [pathId, setPathId] = useState(learningPathMeta[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState("[]");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await api.get<{ assessments: CmsAssessment[] }>("/admin/assessments");
    setItems(res.assessments);
  }, []);

  useEffect(() => {
    void load().catch(() => setError("Failed to load assessments."));
  }, [load]);

  function loadStatic() {
    const a = getPathAssessment(pathId);
    if (!a) return;
    setTitle(a.title);
    setQuestions(JSON.stringify(a.questions, null, 2));
  }

  async function save(publish: boolean) {
    setError(null);
    try {
      await api.post("/admin/assessments", {
        pathId,
        title,
        passingScore: 70,
        xpReward: 100,
        questions,
        status: publish ? "published" : "draft",
      });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-white">Assessments</h2>
      {error && <Alert variant="error">{error}</Alert>}
      <Card className="flex flex-col gap-4 p-5">
        <select
          value={pathId}
          onChange={(e) => setPathId(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100"
        >
          {learningPathMeta.map((p) => (
            <option key={p.id} value={p.id} className="bg-base-900">{p.title}</option>
          ))}
        </select>
        <Button variant="ghost" size="sm" onClick={loadStatic}>Load static assessment</Button>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextAreaField label="Questions JSON" value={questions} onChange={(e) => setQuestions(e.target.value)} rows={12} />
        <div className="flex gap-2">
          <Button onClick={() => void save(false)}>Save draft</Button>
          <Button variant="secondary" onClick={() => void save(true)}>Publish</Button>
        </div>
      </Card>
      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Assessment</th><th className="px-4 py-3">Path</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3">{a.title}</td>
                <td className="px-4 py-3 text-slate-400">{a.pathId}</td>
                <td className="px-4 py-3"><Badge variant={a.status === "published" ? "success" : "neutral"}>{a.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
