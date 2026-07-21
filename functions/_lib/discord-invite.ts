/// <reference types="@cloudflare/workers-types" />

export const DEFAULT_DISCORD_INVITE_CODE = "R6JQy9b9ey";
export const DEFAULT_DISCORD_INVITE_URL = "https://discord.gg/R6JQy9b9ey";

export interface DiscordInviteInfo {
  code: string;
  inviteUrl: string;
  guildId: string | null;
  name: string;
  description: string | null;
  iconUrl: string | null;
  memberCount: number;
  onlineCount: number;
}

interface DiscordInviteApiGuild {
  id?: string;
  name?: string;
  description?: string | null;
  icon?: string | null;
}

interface DiscordInviteApiResponse {
  code?: string;
  guild?: DiscordInviteApiGuild;
  guild_id?: string;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  profile?: {
    name?: string;
    member_count?: number;
    online_count?: number;
    icon_hash?: string | null;
  };
}

/** Extract an invite code from a full URL or bare code string. */
export function parseInviteCode(input: string | null | undefined): string | null {
  if (!input?.trim()) return null;
  const trimmed = input.trim();
  const short = trimmed.match(/discord\.gg\/([a-zA-Z0-9-]+)/i);
  if (short) return short[1];
  const long = trimmed.match(/discord(?:app)?\.com\/invite\/([a-zA-Z0-9-]+)/i);
  if (long) return long[1];
  if (/^[a-zA-Z0-9-]+$/.test(trimmed)) return trimmed;
  return null;
}

function guildIconUrl(guildId: string, icon: string | null | undefined): string | null {
  if (!icon) return null;
  const ext = icon.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/icons/${guildId}/${icon}.${ext}?size=128`;
}

/** Fetch public invite metadata and member counts from Discord. */
export async function fetchDiscordInvite(code: string): Promise<DiscordInviteInfo | null> {
  const res = await fetch(
    `https://discord.com/api/v10/invites/${encodeURIComponent(code)}?with_counts=true`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Hacknology/1.0 (+https://hacknology.xyz)",
      },
    },
  );

  if (!res.ok) return null;

  const data = (await res.json()) as DiscordInviteApiResponse;
  const guildId = data.guild?.id ?? data.guild_id ?? null;
  const icon =
    data.guild?.icon ??
    (guildId && data.profile?.icon_hash ? data.profile.icon_hash : null);

  const name = data.guild?.name ?? data.profile?.name ?? "Discord Server";
  const memberCount =
    data.approximate_member_count ?? data.profile?.member_count ?? 0;
  const onlineCount =
    data.approximate_presence_count ?? data.profile?.online_count ?? 0;

  return {
    code: data.code ?? code,
    inviteUrl: `https://discord.gg/${data.code ?? code}`,
    guildId,
    name,
    description: data.guild?.description ?? null,
    iconUrl: guildId ? guildIconUrl(guildId, icon) : null,
    memberCount,
    onlineCount,
  };
}
