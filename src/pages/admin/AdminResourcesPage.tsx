import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextField, TextAreaField } from "@/components/ui/TextField";
import { api, ApiError } from "@/lib/api";
import type { CmsResource } from "@/types/cms";

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<CmsResource[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Downloads");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileMeta, setFileMeta] = useState<{ key: string; fileName: string; fileType: string; fileSize: number } | null>(null);

  const load = useCallback(async () => {
    const res = await api.get<{ resources: CmsResource[] }>("/admin/resources");
    setResources(res.resources);
  }, []);

  useEffect(() => {
    void load().catch(() => setError("Failed to load resources."));
  }, [load]);

  async function uploadFile() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("prefix", "resources");
      const res = await api.upload<{ file: { key: string; mimeType: string; size: number; url: string } }>(
        "/admin/upload",
        fd,
      );
      setFileMeta({
        key: res.file.key,
        fileName: file.name,
        fileType: res.file.mimeType,
        fileSize: res.file.size,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    }
  }

  async function create() {
    if (!name) return;
    setError(null);
    try {
      await api.post("/admin/resources", {
        name,
        description,
        category,
        visibility: "public",
        website: website || null,
        fileKey: fileMeta?.key ?? null,
        fileName: fileMeta?.fileName ?? null,
        fileType: fileMeta?.fileType ?? null,
        fileSize: fileMeta?.fileSize ?? null,
      });
      setName("");
      setDescription("");
      setWebsite("");
      setFileMeta(null);
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Create failed.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this resource?")) return;
    await api.del(`/admin/resources/${id}`);
    await load();
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-white">Resources & Downloads</h2>
      {error && <Alert variant="error">{error}</Alert>}
      <Card className="flex flex-col gap-4 p-5">
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextAreaField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <TextField label="Website (optional)" value={website} onChange={(e) => setWebsite(e.target.value)} />
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-200">File upload</label>
          <input ref={fileRef} type="file" className="text-sm text-slate-400" />
          <Button variant="secondary" size="sm" onClick={() => void uploadFile()}>Upload to R2</Button>
          {fileMeta && (
            <p className="text-xs text-green-300">Uploaded: {fileMeta.fileName}</p>
          )}
        </div>
        <Button onClick={() => void create()}>Create resource</Button>
      </Card>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {resources.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3"><Badge variant="neutral">{r.category}</Badge></td>
                <td className="px-4 py-3 text-slate-400">{r.fileName ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => void remove(r.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
