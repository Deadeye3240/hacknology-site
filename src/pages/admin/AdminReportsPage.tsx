import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { api, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/date";

interface ReportRow {
  id: string;
  reporter_username: string;
  target_type: string;
  target_id: string;
  reason: string;
  status: string;
  created_at: string;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await api.get<{ reports: ReportRow[] }>("/admin/reports");
    setReports(res.reports);
  }, []);

  useEffect(() => {
    void load().catch(() => setError("Failed to load reports."));
  }, [load]);

  async function review(id: string, status: "reviewed" | "dismissed") {
    try {
      await api.post("/admin/reports", { id, status });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-white">Reports</h2>
      {error && <Alert variant="error">{error}</Alert>}
      {reports.length === 0 ? (
        <p className="text-sm text-slate-400">No reports.</p>
      ) : (
        reports.map((r) => (
          <Card key={r.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex gap-2">
                <Badge variant="neutral" className="capitalize">{r.target_type}</Badge>
                <Badge variant={r.status === "open" ? "warning" : "success"}>{r.status}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-200">{r.reason}</p>
              <p className="text-xs text-slate-500">@{r.reporter_username} · {formatDate(r.created_at)}</p>
            </div>
            {r.status === "open" && (
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => void review(r.id, "reviewed")}>Reviewed</Button>
                <Button variant="ghost" size="sm" onClick={() => void review(r.id, "dismissed")}>Dismiss</Button>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
