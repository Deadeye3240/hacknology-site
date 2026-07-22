import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import { paths } from "@/routes/paths";

function clientValidate(values: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}): Record<string, string> {
  const fields: Record<string, string> = {};
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(values.username)) {
    fields.username = "3–24 characters: letters, numbers, or underscores.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    fields.email = "Enter a valid email address.";
  }
  if (values.password.length < 8 || !/[a-zA-Z]/.test(values.password) || !/[0-9]/.test(values.password)) {
    fields.password = "At least 8 characters, including letters and numbers.";
  }
  if (values.confirmPassword !== values.password) {
    fields.confirmPassword = "Passwords do not match.";
  }
  if (!values.agreeToTerms) {
    fields.agreeToTerms = "You must agree to the Terms and Privacy Policy.";
  }
  return fields;
}

export default function RegisterPage() {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to={paths.dashboard} replace />;

  function update(key: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const clientErrors = clientValidate(values);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      await register(values);
      navigate(paths.dashboard, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.fields ? null : err.message);
        setFieldErrors(err.fields ?? {});
      } else {
        setError("Unable to create your account. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join the Hacknology learning community."
      footer={
        <>
          Already have an account?{" "}
          <Link to={paths.login} className="font-medium text-accent-300 hover:text-accent-200">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert variant="error">{error}</Alert>}
        <TextField
          label="Username"
          type="text"
          autoComplete="username"
          value={values.username}
          onChange={(e) => update("username", e.target.value)}
          error={fieldErrors.username}
          hint="Letters, numbers, and underscores."
          required
          autoFocus
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          error={fieldErrors.email}
          required
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={(e) => update("password", e.target.value)}
          error={fieldErrors.password}
          hint="At least 8 characters, including letters and numbers."
          required
        />
        <TextField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={(e) => update("confirmPassword", e.target.value)}
          error={fieldErrors.confirmPassword}
          required
        />
        <label className="flex items-start gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={values.agreeToTerms}
            onChange={(e) => setValues((prev) => ({ ...prev, agreeToTerms: e.target.checked }))}
            className="mt-1 rounded border-white/20 bg-white/5 text-accent-400"
            aria-invalid={Boolean(fieldErrors.agreeToTerms)}
          />
          <span>
            I agree to the{" "}
            <Link to={paths.terms} className="text-accent-300 hover:text-accent-200">
              Terms of Service
            </Link>
            ,{" "}
            <Link to={paths.privacy} className="text-accent-300 hover:text-accent-200">
              Privacy Policy
            </Link>
            , and{" "}
            <Link to={paths.acceptableUse} className="text-accent-300 hover:text-accent-200">
              Acceptable Use Policy
            </Link>
            .
          </span>
        </label>
        {fieldErrors.agreeToTerms && (
          <p className="text-sm text-red-300">{fieldErrors.agreeToTerms}</p>
        )}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
