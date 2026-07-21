import { useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextField } from "@/components/ui/TextField";
import { LockIcon } from "@/components/ui/icons";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError, setCsrfToken } from "@/lib/api";
import type { SelfUser } from "@/types/auth";

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const forcePassword =
    Boolean((location.state as { forcePassword?: boolean } | null)?.forcePassword) ||
    Boolean(user?.mustChangePassword);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      const res = await api.post<{ user: SelfUser; csrfToken: string }>(
        "/account/password",
        { currentPassword, newPassword, confirmPassword },
      );
      setCsrfToken(res.csrfToken);
      setUser(res.user);
      setMessage("Your password has been changed.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fields ?? {});
        if (!err.fields) setError(err.message);
      } else {
        setError("Could not change your password.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Your account"
        title="Settings"
        description="Manage your password and account security."
        icon={LockIcon}
      />
      <PageContainer className="py-10">
        <div className="mx-auto flex max-w-xl flex-col gap-6">
          {forcePassword && (
            <Alert variant="error">
              For security, you must change your password before continuing.
            </Alert>
          )}
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-white">Change password</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="error">{error}</Alert>}
              <TextField
                label="Current password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                error={fieldErrors.currentPassword}
                required
              />
              <TextField
                label="New password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={fieldErrors.newPassword}
                hint="At least 8 characters, including letters and numbers."
                required
              />
              <TextField
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={fieldErrors.confirmPassword}
                required
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Updating…" : "Update password"}
                </Button>
              </div>
            </form>
          </Card>
          <p className="text-center text-xs text-slate-500">
            Changing your password signs out other devices.
          </p>
        </div>
      </PageContainer>
    </>
  );
}
