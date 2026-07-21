import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { api, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/date";
import type { CmsPage } from "@/types/cms";

export default function AdminPagesPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await api.get<{ pages: CmsPage[] }>("/admin/pages");
      setPages(res.pages);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load pages.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(id: string) {
    if (!confirm("Delete this page permanently?")) return;
    try {
      await api.del(`/admin/pages/${id}`);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Pages</h2>
        <Button to="/admin/pages/new" size="sm">Create page</Button>
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No pages yet. Create your first dynamic page.
                </td>
              </tr>
            ) : (
              pages.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-slate-100">{p.title}</td>
                  <td className="px-4 py-3 text-slate-400">/{p.slug}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.status === "published" ? "success" : "neutral"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(p.updatedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {p.status === "published" && (
                        <Button to={`/${p.slug}`} variant="ghost" size="sm">View</Button>
                      )}
                      <Button to={`/admin/pages/${p.id}`} variant="secondary" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" onClick={() => void remove(p.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
