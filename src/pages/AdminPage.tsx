import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import { ShieldIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { api, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/date";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types/auth";

interface Stats {
  users: number;
  disabledUsers: number;
  discussions: number;
  replies: number;
  openReports: number;
}
interface AdminUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: Role;
  disabled: boolean;
  createdAt: string;
}
interface ReportRow {
  id: string;
  reporter_username: string;
  target_type: string;
  target_id: string;
  reason: string;
  status: string;
  created_at: string;
}

type Tab = "overview" | "users" | "reports";
type PendingUserAction =
  | { kind: "role"; user: AdminUser; role: Role }
  | { kind: "toggle"; user: AdminUser };

export default function AdminPage() {
  const { isAdmin, user: me } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingUserAction | null>(null);
  const [busy, setBusy] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const res = await api.get<{ stats: Stats }>("/admin/stats");
      setStats(res.stats);
    } catch {
      /* ignore */
    }
  }, []);

  const loadUsers = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get<{ users: AdminUser[] }>("/admin/users");
      setUsers(res.users);
    } catch {
      /* ignore */
    }
  }, [isAdmin]);

  const loadReports = useCallback(async () => {
    try {
      const res = await api.get<{ reports: ReportRow[] }>("/admin/reports");
      setReports(res.reports);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void loadStats();
    void loadUsers();
    void loadReports();
  }, [loadStats, loadUsers, loadReports]);

  async function confirmUserAction() {
    if (!pending) return;
    setBusy(true);
    setError(null);
    try {
      if (pending.kind === "role") {
        await api.patch(`/admin/users/${pending.user.id}`, { role: pending.role });
      } else {
        await api.patch(`/admin/users/${pending.user.id}`, {
          disabled: !pending.user.disabled,
        });
      }
      setPending(null);
      await Promise.all([loadUsers(), loadStats()]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  }

  async function reviewReport(id: string, status: "reviewed" | "dismissed") {
    try {
      await api.post("/admin/reports", { id, status });
      await Promise.all([loadReports(), loadStats()]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update report.");
    }
  }

  const tabs: { id: Tab; label: string; show: boolean }[] = [
    { id: "overview", label: "Overview", show: true },
    { id: "users", label: "Users", show: isAdmin },
    { id: "reports", label: "Reports", show: true },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Admin dashboard"
        description="Manage members, moderate the community, and review reports."
        icon={ShieldIcon}
      />
      <PageContainer className="py-10">
        <div className="flex flex-col gap-6">
          {error && <Alert variant="error">{error}</Alert>}

          <div className="flex gap-1 border-b border-white/10">
            {tabs
              .filter((t) => t.show)
              .map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                    tab === t.id
                      ? "border-accent-400 text-white"
                      : "border-transparent text-slate-400 hover:text-white",
                  )}
                >
                  {t.label}
                </button>
              ))}
          </div>

          {tab === "overview" && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
              {[
                { label: "Users", value: stats?.users },
                { label: "Disabled", value: stats?.disabledUsers },
                { label: "Discussions", value: stats?.discussions },
                { label: "Replies", value: stats?.replies },
                { label: "Open reports", value: stats?.openReports },
              ].map((s) => (
                <Card key={s.label} className="flex flex-col gap-1 p-5">
                  <span className="text-2xl font-bold text-white">{s.value ?? "—"}</span>
                  <span className="text-sm text-slate-400">{s.label}</span>
                </Card>
              ))}
            </div>
          )}

          {tab === "users" && isAdmin && (
            <Card className="overflow-x-auto p-0">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => {
                    const isSelf = u.id === me?.id;
                    return (
                      <tr key={u.id}>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-100">{u.displayName}</span>
                            <span className="text-xs text-slate-500">@{u.username}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={u.role}
                            disabled={isSelf}
                            onChange={(e) =>
                              setPending({ kind: "role", user: u, role: e.target.value as Role })
                            }
                            className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-slate-200 disabled:opacity-50"
                          >
                            <option value="user" className="bg-base-900">user</option>
                            <option value="moderator" className="bg-base-900">moderator</option>
                            <option value="admin" className="bg-base-900">admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={u.disabled ? "warning" : "success"}>
                            {u.disabled ? "Disabled" : "Active"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{formatDate(u.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isSelf}
                            onClick={() => setPending({ kind: "toggle", user: u })}
                          >
                            {u.disabled ? "Enable" : "Disable"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          )}

          {tab === "reports" && (
            <div className="flex flex-col gap-3">
              {reports.length === 0 ? (
                <p className="text-sm text-slate-400">No reports.</p>
              ) : (
                reports.map((r) => (
                  <Card key={r.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="neutral" className="capitalize">{r.target_type}</Badge>
                        <Badge
                          variant={
                            r.status === "open"
                              ? "warning"
                              : r.status === "reviewed"
                                ? "success"
                                : "neutral"
                          }
                        >
                          {r.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-200">{r.reason}</p>
                      <p className="text-xs text-slate-500">
                        by @{r.reporter_username} · {formatDate(r.created_at)} · target {r.target_id}
                      </p>
                    </div>
                    {r.status === "open" && (
                      <div className="flex shrink-0 gap-2">
                        <Button variant="secondary" size="sm" onClick={() => reviewReport(r.id, "reviewed")}>
                          Mark reviewed
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => reviewReport(r.id, "dismissed")}>
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </PageContainer>

      <Modal
        open={pending !== null}
        onClose={() => setPending(null)}
        title={
          pending?.kind === "role"
            ? "Change user role?"
            : pending?.user.disabled
              ? "Enable account?"
              : "Disable account?"
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setPending(null)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={confirmUserAction} disabled={busy}>
              {busy ? "Working…" : "Confirm"}
            </Button>
          </>
        }
      >
        {pending?.kind === "role"
          ? `Change @${pending.user.username}'s role to "${pending.role}"? This affects their permissions immediately.`
          : pending?.user.disabled
            ? `Re-enable @${pending?.user.username}? They will be able to sign in again.`
            : `Disable @${pending?.user.username}? They will be signed out and unable to log in.`}
      </Modal>
    </>
  );
}
