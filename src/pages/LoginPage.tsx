import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import { paths } from "@/routes/paths";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? paths.dashboard;

  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to={from} replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(loginValue, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to sign in. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Hacknology account."
      footer={
        <>
          New to Hacknology?{" "}
          <Link to={paths.register} className="font-medium text-accent-300 hover:text-accent-200">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert variant="error">{error}</Alert>}
        <TextField
          label="Username or email"
          type="text"
          autoComplete="username"
          value={loginValue}
          onChange={(e) => setLoginValue(e.target.value)}
          required
          autoFocus
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex items-center justify-end">
          <span
            className="cursor-not-allowed text-xs text-slate-500"
            title="Password recovery is coming soon."
          >
            Forgot password?
          </span>
        </div>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
