import { useState, type FormEvent } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextField, TextAreaField } from "@/components/ui/TextField";
import { UsersIcon } from "@/components/ui/icons";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { SelfUser } from "@/types/auth";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [profilePublic, setProfilePublic] = useState(user?.profilePublic ?? true);
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
      const res = await api.post<{ user: SelfUser }>("/account/profile", {
        displayName,
        bio,
        avatar,
        profilePublic,
      });
      setUser(res.user);
      setMessage("Profile updated.");
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fields ?? {});
        if (!err.fields) setError(err.message);
      } else {
        setError("Could not update your profile.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Your account"
        title="Profile"
        description="Manage how you appear to the rest of the community."
        icon={UsersIcon}
      />
      <PageContainer className="py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="flex flex-col items-center gap-3 text-center lg:col-span-1">
            <span className="grid h-20 w-20 place-items-center rounded-full border border-accent-400/30 bg-accent-400/10 text-2xl font-semibold text-accent-200">
              {initials(displayName || user?.username || "?")}
            </span>
            <div>
              <p className="font-semibold text-white">{displayName || user?.username}</p>
              <p className="text-sm text-slate-400">@{user?.username}</p>
            </div>
            <p className="text-xs text-slate-500">
              Avatar uploads are coming soon — for now your initials are shown.
            </p>
          </Card>

          <Card className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="error">{error}</Alert>}
              <TextField
                label="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                error={fieldErrors.displayName}
                maxLength={40}
                required
              />
              <TextAreaField
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                error={fieldErrors.bio}
                maxLength={500}
                hint="Tell the community a little about yourself (max 500 characters)."
              />
              <TextField
                label="Avatar (placeholder)"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                hint="Optional label or image URL — image uploads are not yet enabled."
              />
              <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3.5 py-3">
                <input
                  type="checkbox"
                  checked={profilePublic}
                  onChange={(e) => setProfilePublic(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-transparent accent-accent-400"
                />
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-slate-200">Public profile</span>
                  <span className="text-xs text-slate-500">
                    When off, your bio is hidden from other users.
                  </span>
                </span>
              </label>
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
