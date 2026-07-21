import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";

export default function SetupPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [setupRequired, setSetupRequired] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get<{ setupRequired: boolean }>("/auth/setup")
      .then((res) => setSetupRequired(res.setupRequired))
      .catch(() => setSetupRequired(false));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/auth/setup", { password });
      await refresh();
      navigate(paths.settings, { replace: true, state: { forcePassword: true } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Setup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Initial admin setup"
      subtitle="One-time bootstrap for a new deployment."
    >
      {setupRequired === false ? (
        <Alert variant="info">
          Setup has already been completed. This page is now disabled.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {error && <Alert variant="error">{error}</Alert>}
          <p className="text-sm text-slate-400">
            Enter the value of the server&apos;s <code className="text-accent-300">ADMIN_INITIAL_PASSWORD</code>{" "}
            secret to create the initial <strong>admin</strong> account. You will be
            required to change it immediately.
          </p>
          <TextField
            label="Initial admin password"
            type="password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
          <Button type="submit" disabled={submitting || setupRequired === null} className="w-full">
            {submitting ? "Creating admin…" : "Create admin account"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
