import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextField, TextAreaField } from "@/components/ui/TextField";
import { api, ApiError } from "@/lib/api";
import { learningPathMeta } from "@/data/lessons/learningPathMeta";
import { getLessonsByPath } from "@/data/lessons";

interface CmsLessonRow {
  id: string;
  lessonId: string;
  pathId: string;
  orderIndex: number;
  title: string;
  summary: string;
  status: string;
}

export default function AdminLessonsPage() {
  const [overrides, setOverrides] = useState<CmsLessonRow[]>([]);
  const [pathId, setPathId] = useState(learningPathMeta[0]?.id ?? "fundamentals");
  const [lessonId, setLessonId] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [payload, setPayload] = useState("{}");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await api.get<{ lessons: CmsLessonRow[] }>("/admin/lessons");
    setOverrides(res.lessons);
  }, []);

  useEffect(() => {
    void load().catch(() => setError("Failed to load lesson overrides."));
  }, [load]);

  const staticLessons = getLessonsByPath(pathId);

  async function saveOverride(publish: boolean) {
    if (!lessonId || !title) {
      setError("Lesson ID and title are required.");
      return;
    }
    setError(null);
    try {
      await api.post("/admin/lessons", {
        lessonId,
        pathId,
        orderIndex: staticLessons.find((l) => l.id === lessonId)?.order ?? 0,
        title,
        summary,
        payload,
        status: publish ? "published" : "draft",
      });
      setLessonId("");
      setTitle("");
      setSummary("");
      setPayload("{}");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed.");
    }
  }

  function pickStatic(id: string) {
    const lesson = staticLessons.find((l) => l.id === id);
    if (!lesson) return;
    setLessonId(lesson.id);
    setTitle(lesson.title);
    setSummary(lesson.summary);
    setPayload(JSON.stringify({ override: true, originalId: lesson.id }, null, 2));
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-white">Lessons CMS</h2>
      <p className="text-sm text-slate-400">
        Static lessons remain the source of truth. Published overrides in D1 merge at runtime via{" "}
        <code className="text-slate-300">/api/cms/lessons/overrides</code>.
      </p>
      {error && <Alert variant="error">{error}</Alert>}

      <Card className="flex flex-col gap-4 p-5">
        <label className="text-sm font-medium text-slate-200">Learning path</label>
        <select
          value={pathId}
          onChange={(e) => setPathId(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100"
        >
          {learningPathMeta.map((p) => (
            <option key={p.id} value={p.id} className="bg-base-900">{p.title}</option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2">
          {staticLessons.map((l) => (
            <Button key={l.id} variant="ghost" size="sm" onClick={() => pickStatic(l.id)}>
              Override: {l.title.slice(0, 24)}
            </Button>
          ))}
        </div>
        <TextField label="Lesson ID" value={lessonId} onChange={(e) => setLessonId(e.target.value)} />
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextAreaField label="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
        <TextAreaField
          label="Payload JSON"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          rows={8}
        />
        <div className="flex gap-2">
          <Button onClick={() => void saveOverride(false)}>Save draft</Button>
          <Button variant="secondary" onClick={() => void saveOverride(true)}>Publish</Button>
        </div>
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Lesson</th>
              <th className="px-4 py-3">Path</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {overrides.map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-3">{l.title}</td>
                <td className="px-4 py-3 text-slate-400">{l.pathId}</td>
                <td className="px-4 py-3">
                  <Badge variant={l.status === "published" ? "success" : "neutral"}>{l.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
