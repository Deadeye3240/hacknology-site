import { useRef, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Avatar } from "@/components/ui/Avatar";
import { TextField, TextAreaField } from "@/components/ui/TextField";
import { UsersIcon } from "@/components/ui/icons";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import { resizeAvatarFile } from "@/lib/avatarImage";
import type { SelfUser } from "@/types/auth";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [profilePublic, setProfilePublic] = useState(user?.profilePublic ?? true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setMessage(null);
    setUploading(true);
    try {
      const imageData = await resizeAvatarFile(file);
      const res = await api.post<{ user: SelfUser }>("/account/avatar", { imageData });
      setUser(res.user);
      setMessage("Profile picture updated.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload your picture.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function removeAvatar() {
    setError(null);
    setMessage(null);
    setUploading(true);
    try {
      const res = await api.post<{ user: SelfUser }>("/account/avatar", { imageData: "" });
      setUser(res.user);
      setMessage("Profile picture removed.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not remove your picture.");
    } finally {
      setUploading(false);
    }
  }

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
          <Card className="flex flex-col items-center gap-4 text-center lg:col-span-1">
            <Avatar
              name={displayName || user?.username || "?"}
              avatar={user?.avatar}
              size="lg"
            />
            <div>
              <p className="font-semibold text-white">{displayName || user?.username}</p>
              <p className="text-sm text-slate-400">@{user?.username}</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? "Uploading…" : "Change picture"}
              </Button>
              {user?.avatar && (
                <Button type="button" size="sm" variant="ghost" disabled={uploading} onClick={removeAvatar}>
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-slate-500">JPEG, PNG, or WebP. Max 2 MB.</p>
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
