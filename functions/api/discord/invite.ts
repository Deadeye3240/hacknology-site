/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { CmsDb } from "../../_lib/cms-db";
import { ok, error } from "../../_lib/http";
import {
  DEFAULT_DISCORD_INVITE_CODE,
  fetchDiscordInvite,
  parseInviteCode,
} from "../../_lib/discord-invite";

/** GET /api/discord/invite — public Discord server preview (name, icon, member counts). */
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const cms = new CmsDb(env.DB);
  const stored = await cms.getSetting("social.discord");
  const code = parseInviteCode(stored) ?? DEFAULT_DISCORD_INVITE_CODE;

  const info = await fetchDiscordInvite(code);
  if (!info) {
    return error(502, "Could not load Discord server info.");
  }

  return ok(
    {
      ...info,
      widgetUrl: info.guildId
        ? `https://discord.com/widget?id=${info.guildId}&theme=dark`
        : null,
    },
    { "Cache-Control": "public, max-age=300, s-maxage=300" },
  );
};
