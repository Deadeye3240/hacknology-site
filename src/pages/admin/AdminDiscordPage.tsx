import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { TextField, TextAreaField } from "@/components/ui/TextField";
import { api, ApiError } from "@/lib/api";

interface DiscordConfig {
  configured: boolean;
  webhookUrl: string | null;
  webhookSource: "env" | "database" | null;
  persona: { username: string; avatarUrl: string | null };
  notifications: { forum: boolean; signups: boolean; lessons: boolean };
}

const TEMPLATES = [
  {
    label: "Announcement",
    embedTitle: "Hacknology update",
    embedDescription: "We pushed a new update to hacknology.xyz. Check it out!",
    embedColor: "34d399",
  },
  {
    label: "Maintenance",
    embedTitle: "Scheduled maintenance",
    embedDescription: "The site will be briefly unavailable while we apply updates.",
    embedColor: "f59e0b",
  },
  {
    label: "Community",
    embedTitle: "Join the conversation",
    embedDescription: "New discussions are live in the forum — come share what you're learning.",
    embedColor: "5865f2",
  },
] as const;

export default function AdminDiscordPage() {
  const [config, setConfig] = useState<DiscordConfig | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [persona, setPersona] = useState({ username: "", avatarUrl: "" });
  const [notifications, setNotifications] = useState({
    forum: true,
    signups: true,
    lessons: false,
  });
  const [message, setMessage] = useState({
    content: "",
    embedTitle: "",
    embedDescription: "",
    embedColor: "a855f7",
    username: "",
    avatarUrl: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await api.get<DiscordConfig>("/admin/discord");
    setConfig(res);
    setWebhookUrl(res.webhookUrl ?? "");
    setPersona({
      username: res.persona.username,
      avatarUrl: res.persona.avatarUrl ?? "",
    });
    setNotifications(res.notifications);
  }, []);

  useEffect(() => {
    void load().catch(() => setError("Could not load Discord settings."));
  }, [load]);

  async function saveSettings() {
    setError(null);
    setSuccess(null);
    setBusy("settings");
    try {
      const res = await api.put<DiscordConfig & { saved: boolean }>("/admin/discord", {
        webhookUrl,
        username: persona.username,
        avatarUrl: persona.avatarUrl,
        notifications,
      });
      setConfig(res);
      setWebhookUrl(res.webhookUrl ?? "");
      setPersona({
        username: res.persona.username,
        avatarUrl: res.persona.avatarUrl ?? "",
      });
      setNotifications(res.notifications);
      setSuccess("Discord settings saved.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed.");
    } finally {
      setBusy(null);
    }
  }

  async function testWebhook() {
    setError(null);
    setSuccess(null);
    setBusy("test");
    try {
      await api.post("/admin/discord/test");
      setSuccess("Test message sent to Discord.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Test failed.");
    } finally {
      setBusy(null);
    }
  }

  async function sendMessage() {
    setError(null);
    setSuccess(null);
    setBusy("message");
    try {
      await api.post("/admin/discord/message", {
        content: message.content || undefined,
        embedTitle: message.embedTitle || undefined,
        embedDescription: message.embedDescription || undefined,
        embedColor: message.embedColor || undefined,
        username: message.username || undefined,
        avatarUrl: message.avatarUrl || undefined,
      });
      setSuccess("Message sent to Discord.");
      setMessage((m) => ({ ...m, content: "", embedTitle: "", embedDescription: "" }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Send failed.");
    } finally {
      setBusy(null);
    }
  }

  function applyTemplate(template: (typeof TEMPLATES)[number]) {
    setMessage((m) => ({
      ...m,
      embedTitle: template.embedTitle,
      embedDescription: template.embedDescription,
      embedColor: template.embedColor,
    }));
  }

  const webhookReady = config?.configured === true;
  const hasMessage =
    message.content.trim().length > 0 ||
    message.embedTitle.trim().length > 0 ||
    message.embedDescription.trim().length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-white">Discord webhook</h2>
        {config && (
          <Badge variant={config.configured ? "success" : "warning"}>
            {config.configured ? "Webhook configured" : "Webhook not configured"}
          </Badge>
        )}
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {config && !config.configured && (
        <Alert variant="info">
          Paste your webhook URL above and click <strong>Save webhook &amp; settings</strong> to
          enable Test and Send. Or set{" "}
          <code className="text-accent-200">DISCORD_WEBHOOK_URL</code> as a Cloudflare secret.
        </Alert>
      )}
      {config?.webhookSource === "env" && (
        <Alert variant="success">
          Webhook is active via Cloudflare secret. A saved URL below is kept as backup but the
          secret takes priority.
        </Alert>
      )}

      <Card className="flex flex-col gap-4 p-5">
        <h3 className="text-sm font-semibold text-white">Webhook URL</h3>
        <TextField
          label="Discord webhook URL"
          hint="Paste the full URL from Discord → channel → Integrations → Webhooks."
          placeholder="https://discord.com/api/webhooks/..."
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
        />
        <Button disabled={busy === "settings"} onClick={() => void saveSettings()}>
          {busy === "settings" ? "Saving…" : "Save webhook & settings"}
        </Button>
      </Card>

      <Card className="flex flex-col gap-4 p-5">
        <h3 className="text-sm font-semibold text-white">Setup instructions</h3>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-400">
          <li>
            In Discord, open your server → channel settings → Integrations → Webhooks → New
            Webhook. Copy the webhook URL.
          </li>
          <li>
            Store it as a Cloudflare Pages secret (production):
            <code className="mt-1 block rounded bg-black/30 px-2 py-1 text-xs text-accent-200">
              npx wrangler pages secret put DISCORD_WEBHOOK_URL
            </code>
          </li>
          <li>
            For local dev with <code className="text-accent-200">npm run cf:dev</code>, add to{" "}
            <code className="text-accent-200">.dev.vars</code>:
            <code className="mt-1 block rounded bg-black/30 px-2 py-1 text-xs text-accent-200">
              DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
            </code>
          </li>
          <li>
            Use the Test webhook button below to verify. The secret URL cannot be read back from
            Cloudflare — only a configured/not configured status is shown here.
          </li>
        </ol>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={!webhookReady || busy === "test"}
            onClick={() => void testWebhook()}
          >
            {busy === "test" ? "Sending…" : "Test webhook"}
          </Button>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-5">
        <h3 className="text-sm font-semibold text-white">Bot persona & automatic notifications</h3>
        <TextField
          label="Display name"
          hint="Shown as the webhook bot name in Discord."
          value={persona.username}
          onChange={(e) => setPersona((p) => ({ ...p, username: e.target.value }))}
        />
        <TextField
          label="Avatar URL (optional)"
          hint="Public image URL for the webhook avatar."
          value={persona.avatarUrl}
          onChange={(e) => setPersona((p) => ({ ...p, avatarUrl: e.target.value }))}
        />
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={notifications.forum}
              onChange={(e) => setNotifications((n) => ({ ...n, forum: e.target.checked }))}
              className="rounded border-white/20 bg-white/5 text-accent-400"
            />
            Notify on new forum discussions and replies
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={notifications.signups}
              onChange={(e) => setNotifications((n) => ({ ...n, signups: e.target.checked }))}
              className="rounded border-white/20 bg-white/5 text-accent-400"
            />
            Notify on new user sign-ups
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={notifications.lessons}
              onChange={(e) => setNotifications((n) => ({ ...n, lessons: e.target.checked }))}
              className="rounded border-white/20 bg-white/5 text-accent-400"
            />
            Notify on lesson completions (off by default — can be noisy)
          </label>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-white">Send custom message</h3>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <Button key={t.label} variant="ghost" size="sm" onClick={() => applyTemplate(t)}>
                {t.label}
              </Button>
            ))}
          </div>
        </div>
        <TextAreaField
          label="Message text"
          hint="Plain text shown above the embed (optional if embed fields are set)."
          value={message.content}
          onChange={(e) => setMessage((m) => ({ ...m, content: e.target.value }))}
        />
        <TextField
          label="Embed title"
          value={message.embedTitle}
          onChange={(e) => setMessage((m) => ({ ...m, embedTitle: e.target.value }))}
        />
        <TextAreaField
          label="Embed description"
          value={message.embedDescription}
          onChange={(e) => setMessage((m) => ({ ...m, embedDescription: e.target.value }))}
        />
        <TextField
          label="Embed color (hex)"
          hint="6-digit hex without #, e.g. a855f7"
          value={message.embedColor}
          onChange={(e) => setMessage((m) => ({ ...m, embedColor: e.target.value }))}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="One-off display name (optional)"
            value={message.username}
            onChange={(e) => setMessage((m) => ({ ...m, username: e.target.value }))}
          />
          <TextField
            label="One-off avatar URL (optional)"
            value={message.avatarUrl}
            onChange={(e) => setMessage((m) => ({ ...m, avatarUrl: e.target.value }))}
          />
        </div>
        <Button
          disabled={!webhookReady || !hasMessage || busy === "message"}
          onClick={() => void sendMessage()}
        >
          {busy === "message" ? "Sending…" : "Send to Discord"}
        </Button>
      </Card>
    </div>
  );
}
