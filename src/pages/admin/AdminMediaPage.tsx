import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextField } from "@/components/ui/TextField";
import { api, ApiError } from "@/lib/api";
import type { CmsMediaItem } from "@/types/cms";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<CmsMediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [altText, setAltText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    const res = await api.get<{ media: CmsMediaItem[] }>(`/admin/media${q}`);
    setMedia(res.media);
  }, [search]);

  useEffect(() => {
    void load().catch(() => setError("Failed to load media."));
  }, [load]);

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("altText", altText);
      await api.upload("/admin/media", fd);
      setAltText("");
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this file from storage?")) return;
    await api.del(`/admin/media/${id}`);
    await load();
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-white">Media library</h2>
      {error && <Alert variant="error">{error}</Alert>}
      <Card className="flex flex-col gap-4 p-5">
        <TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <TextField label="Alt text" value={altText} onChange={(e) => setAltText(e.target.value)} />
        <input ref={fileRef} type="file" accept="image/*,.pdf,.txt,.zip" className="text-sm text-slate-400" />
        <Button onClick={() => void upload()}>Upload</Button>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((m) => (
          <Card key={m.id} className="flex flex-col gap-2 p-4">
            {m.mimeType.startsWith("image/") ? (
              <img src={m.url} alt={m.altText || m.fileName} className="h-32 w-full rounded-lg object-cover" />
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg bg-white/[0.03] text-slate-500">
                {m.mimeType}
              </div>
            )}
            <p className="truncate text-sm font-medium text-white">{m.fileName}</p>
            <p className="text-xs text-slate-500">{(m.fileSize / 1024).toFixed(1)} KB</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" href={m.url}>Open</Button>
              <Button variant="ghost" size="sm" onClick={() => void remove(m.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
