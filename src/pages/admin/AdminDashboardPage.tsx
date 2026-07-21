import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { api } from "@/lib/api";
import type { AdminDashboardStats } from "@/types/cms";

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void api
      .get<AdminDashboardStats>("/admin/dashboard")
      .then(setData)
      .catch(() => setError("Could not load dashboard stats."));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">Overview</h2>
        <Button to="/admin/pages/new" size="sm">
          New page
        </Button>
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Users", value: data?.stats.users },
          { label: "Published pages", value: data?.cms.publishedPages },
          { label: "CMS lessons", value: data?.cms.lessons },
          { label: "Resources", value: data?.cms.resources },
          { label: "Media files", value: data?.cms.media },
          { label: "Discussions", value: data?.stats.discussions },
          { label: "Open reports", value: data?.stats.openReports },
          { label: "Total pages", value: data?.cms.pages },
        ].map((s) => (
          <Card key={s.label} className="flex flex-col gap-1 p-4">
            <span className="text-2xl font-bold text-white">{s.value ?? "—"}</span>
            <span className="text-sm text-slate-400">{s.label}</span>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <h3 className="mb-3 text-sm font-semibold text-white">Quick links</h3>
        <div className="flex flex-wrap gap-2">
          <Button to="/admin/pages" variant="secondary" size="sm">Pages</Button>
          <Button to="/admin/lessons" variant="secondary" size="sm">Lessons</Button>
          <Button to="/admin/resources" variant="secondary" size="sm">Resources</Button>
          <Button to="/admin/navigation" variant="secondary" size="sm">Navigation</Button>
          <Button to="/admin/settings" variant="secondary" size="sm">Settings</Button>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Published CMS pages are available at <code className="text-slate-400">/{`{slug}`}</code> or{" "}
          <Link to="/pages/example" className="text-accent-300 hover:underline">/pages/{`{slug}`}</Link>.
        </p>
      </Card>
    </div>
  );
}
