import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import { api, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/date";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types/auth";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: Role;
  disabled: boolean;
  createdAt: string;
}

type PendingAction =
  | { kind: "role"; user: AdminUser; role: Role }
  | { kind: "toggle"; user: AdminUser };

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await api.get<{ users: AdminUser[] }>("/admin/users");
    setUsers(res.users);
  }, []);

  useEffect(() => {
    void load().catch(() => setError("Failed to load users."));
  }, [load]);

  async function confirm() {
    if (!pending) return;
    setBusy(true);
    setError(null);
    try {
      if (pending.kind === "role") {
        await api.patch(`/admin/users/${pending.user.id}`, { role: pending.role });
      } else {
        await api.patch(`/admin/users/${pending.user.id}`, { disabled: !pending.user.disabled });
      }
      setPending(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-white">Users</h2>
        {error && <Alert variant="error">{error}</Alert>}
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
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
                      <div className="font-medium text-slate-100">{u.displayName}</div>
                      <div className="text-xs text-slate-500">@{u.username}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        disabled={isSelf}
                        onChange={(e) =>
                          setPending({ kind: "role", user: u, role: e.target.value as Role })
                        }
                        className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-slate-200"
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
      </div>
      <Modal
        open={pending !== null}
        onClose={() => setPending(null)}
        title="Confirm action"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPending(null)} disabled={busy}>Cancel</Button>
            <Button onClick={() => void confirm()} disabled={busy}>{busy ? "Working…" : "Confirm"}</Button>
          </>
        }
      >
        Confirm this user management action?
      </Modal>
    </>
  );
}
