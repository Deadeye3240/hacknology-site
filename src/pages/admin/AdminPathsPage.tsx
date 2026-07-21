import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextField, TextAreaField } from "@/components/ui/TextField";
import { api, ApiError } from "@/lib/api";
import { learningPathMeta } from "@/data/lessons/learningPathMeta";

interface CmsPath {
  id: string;
  pathId: string;
  title: string;
  description: string;
  level: string;
  status: string;
}

export default function AdminPathsPage() {
  const [paths, setPaths] = useState<CmsPath[]>([]);
  const [pathId, setPathId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await api.get<{ paths: CmsPath[] }>("/admin/paths");
    setPaths(res.paths);
  }, []);

  useEffect(() => {
    void load().catch(() => setError("Failed to load paths."));
  }, [load]);

  function pickMeta(id: string) {
    const meta = learningPathMeta.find((p) => p.id === id);
    if (!meta) return;
    setPathId(meta.id);
    setTitle(meta.title);
    setDescription(meta.description);
  }

  async function save(publish: boolean) {
    if (!pathId || !title) return;
    setError(null);
    try {
      const meta = learningPathMeta.find((p) => p.id === pathId);
      await api.post("/admin/paths", {
        pathId,
        title,
        description,
        level: meta?.level ?? "Beginner",
        skills: meta?.skills ?? [],
        estimatedHours: meta?.estimatedHours ?? 0,
        orderIndex: meta?.order ?? 0,
        prerequisitePathId: meta?.prerequisitePathId ?? null,
        specialization: meta?.specialization ?? null,
        practiceLinks: meta?.practiceLinks ?? [],
        status: publish ? "published" : "draft",
      });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-white">Courses / Learning Paths</h2>
      {error && <Alert variant="error">{error}</Alert>}
      <Card className="flex flex-col gap-4 p-5">
        <p className="text-sm text-slate-400">Pick a static path to create a CMS override:</p>
        <div className="flex flex-wrap gap-2">
          {learningPathMeta.map((p) => (
            <Button key={p.id} variant="ghost" size="sm" onClick={() => pickMeta(p.id)}>
              {p.title}
            </Button>
          ))}
        </div>
        <TextField label="Path ID" value={pathId} onChange={(e) => setPathId(e.target.value)} />
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextAreaField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="flex gap-2">
          <Button onClick={() => void save(false)}>Save draft</Button>
          <Button variant="secondary" onClick={() => void save(true)}>Publish</Button>
        </div>
      </Card>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Path</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paths.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3"><Badge variant={p.status === "published" ? "success" : "neutral"}>{p.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
