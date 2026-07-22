import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { api, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/date";

interface SupportRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "open" | "read" | "closed";
  created_at: string;
}

export default function AdminSupportPage() {
  const [messages, setMessages] = useState<SupportRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await api.get<{ messages: SupportRow[] }>("/admin/support");
    setMessages(res.messages as SupportRow[]);
  }, []);

  useEffect(() => {
    void load().catch(() => setError("Failed to load support messages."));
  }, [load]);

  async function setStatus(id: string, status: SupportRow["status"]) {
    setError(null);
    try {
      await api.post("/admin/support", { id, status });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-white">Support inbox</h2>
      {error && <Alert variant="error">{error}</Alert>}
      {messages.length === 0 ? (
        <p className="text-sm text-slate-400">No support messages yet.</p>
      ) : (
        messages.map((m) => (
          <Card key={m.id} className="flex flex-col gap-3 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-white">{m.subject}</h3>
                  <Badge variant={m.status === "open" ? "warning" : "neutral"}>{m.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  {m.name} ·{" "}
                  <a href={`mailto:${m.email}`} className="text-accent-300 hover:underline">
                    {m.email}
                  </a>
                </p>
                <p className="text-xs text-slate-500">{formatDate(m.created_at)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {m.status !== "read" && (
                  <Button size="sm" variant="secondary" onClick={() => void setStatus(m.id, "read")}>
                    Mark read
                  </Button>
                )}
                {m.status !== "closed" && (
                  <Button size="sm" variant="ghost" onClick={() => void setStatus(m.id, "closed")}>
                    Close
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                >
                  {expanded === m.id ? "Hide" : "View"}
                </Button>
              </div>
            </div>
            {expanded === m.id && (
              <pre className="whitespace-pre-wrap rounded-lg border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
                {m.message}
              </pre>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
