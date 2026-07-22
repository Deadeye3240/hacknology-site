import { useState, type FormEvent } from "react";
import { TextField, TextAreaField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { api, ApiError } from "@/lib/api";

interface SupportContactFormProps {
  compact?: boolean;
  onSuccess?: () => void;
}

/** Shared contact form — posts to admin support inbox (+ Discord alert when configured). */
export function SupportContactForm({ compact = false, onSuccess }: SupportContactFormProps) {
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      await api.post("/support/messages", values);
      setSuccess(true);
      setValues({ name: "", email: "", subject: "", message: "" });
      onSuccess?.();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.fields ? null : err.message);
        setFieldErrors(err.fields ?? {});
      } else {
        setError("Could not send your message. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate id="contact">
      {error && <Alert variant="error">{error}</Alert>}
      {success && (
        <Alert variant="success">
          Message received. {compact ? "We'll follow up by email." : "Dylan or the admin team will follow up soon."}
        </Alert>
      )}
      <div className={compact ? "flex flex-col gap-3" : "grid gap-4 sm:grid-cols-2"}>
        <TextField
          label="Name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          error={fieldErrors.name}
          required
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          error={fieldErrors.email}
          required
        />
      </div>
      <TextField
        label="Subject"
        value={values.subject}
        onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))}
        error={fieldErrors.subject}
        required
      />
      <TextAreaField
        label="Message"
        value={values.message}
        onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
        error={fieldErrors.message}
        hint={compact ? "Brief description of your question or issue." : undefined}
        required
        rows={compact ? 4 : 6}
      />
      <Button type="submit" disabled={submitting} className={compact ? "w-full" : undefined}>
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
