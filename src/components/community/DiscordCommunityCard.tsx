import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DiscordIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";

interface DiscordInviteResponse {
  code: string;
  inviteUrl: string;
  guildId: string | null;
  name: string;
  description: string | null;
  iconUrl: string | null;
  memberCount: number;
  onlineCount: number;
  widgetUrl: string | null;
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/** Live Discord server preview with member counts and optional widget embed. */
export function DiscordCommunityCard() {
  const [info, setInfo] = useState<DiscordInviteResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/discord/invite")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: DiscordInviteResponse | null) => {
        if (!cancelled && data) setInfo(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const inviteUrl = info?.inviteUrl ?? site.discordInviteUrl;
  const name = info?.name ?? `${site.nameFormatted} Community`;
  const memberCount = info?.memberCount;
  const onlineCount = info?.onlineCount;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch">
      <Card className="relative overflow-hidden border-[#5865F2]/25 bg-surface/70 p-0">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#5865F2]/10 via-transparent to-accent-400/5" />
        <div className="relative flex h-full flex-col gap-6 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#5865F2]/30 bg-[#5865F2]/15 text-3xl text-[#5865F2]">
              {info?.iconUrl ? (
                <img
                  src={info.iconUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <DiscordIcon />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5865F2]">
                Discord community
              </p>
              <h3 className="mt-1 truncate text-2xl font-bold text-white">{name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {info?.description ??
                  "Join learners, share progress, ask questions, and stay in the loop on new labs and lessons."}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Members</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {loading ? "…" : memberCount != null ? formatCount(memberCount) : "—"}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Online now</p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-semibold text-white">
                {!loading && onlineCount != null && onlineCount > 0 && (
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                )}
                {loading ? "…" : onlineCount != null ? formatCount(onlineCount) : "—"}
              </p>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 sm:flex-row">
            <Button href={inviteUrl} size="lg" className="bg-[#5865F2] hover:bg-[#4752c4]">
              <DiscordIcon />
              Join Discord
            </Button>
            <p className="self-center text-xs text-slate-500">
              {site.discordInviteUrl.replace("https://", "")}
            </p>
          </div>
        </div>
      </Card>

      {info?.widgetUrl ? (
        <Card className="overflow-hidden p-0">
          <iframe
            title={`${name} Discord widget`}
            src={info.widgetUrl}
            width="100%"
            height="100%"
            className="min-h-[420px] w-full border-0 bg-[#2f3136]"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            loading="lazy"
          />
        </Card>
      ) : (
        !loading && (
          <Card className="flex min-h-[420px] flex-col items-center justify-center gap-3 border-dashed border-white/10 bg-white/[0.02] text-center">
            <DiscordIcon className="text-4xl text-[#5865F2]" />
            <p className="max-w-xs text-sm text-slate-400">
              Enable the server widget in Discord (Server Settings → Widget) to show live
              online members here.
            </p>
            <Button href={inviteUrl} variant="secondary" size="sm">
              Open invite
            </Button>
          </Card>
        )
      )}
    </div>
  );
}
