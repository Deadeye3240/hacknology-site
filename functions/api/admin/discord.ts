/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { CmsDb } from "../../_lib/cms-db";
import { ok, badRequest, readJson, asString } from "../../_lib/http";
import { requireAdmin, requireAdminMutation } from "../../_lib/admin";
import {
  DISCORD_SETTING_KEYS,
  getDiscordNotificationSettings,
  getDiscordPersona,
  isDiscordConfigured,
} from "../../_lib/discord";

function boolToSetting(value: unknown, fallback: boolean): string {
  if (typeof value === "boolean") return value ? "1" : "0";
  if (value === "1" || value === "0") return value;
  return fallback ? "1" : "0";
}

/** GET /api/admin/discord — webhook status and editable settings (not the secret URL). */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(env, request);
  if (!gate.ok) return gate.response;

  const [persona, notifications] = await Promise.all([
    getDiscordPersona(env.DB),
    getDiscordNotificationSettings(env.DB),
  ]);

  return ok({
    configured: isDiscordConfigured(env),
    persona,
    notifications,
  });
};

/** PUT /api/admin/discord — save bot persona and notification toggles. */
export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;

  const body = await readJson(request);
  if (!body || typeof body !== "object") return badRequest("Invalid payload.");

  const b = body as Record<string, unknown>;
  const cms = new CmsDb(env.DB);
  const settings: Record<string, string> = {};

  if ("username" in b) {
    const username = asString(b.username).slice(0, 80);
    settings[DISCORD_SETTING_KEYS.username] = username || "Hacknology Bot";
  }
  if ("avatarUrl" in b) {
    const avatarUrl = asString(b.avatarUrl).slice(0, 512);
    settings[DISCORD_SETTING_KEYS.avatarUrl] = avatarUrl;
  }
  if ("notifications" in b && b.notifications && typeof b.notifications === "object") {
    const n = b.notifications as Record<string, unknown>;
    if ("forum" in n) {
      settings[DISCORD_SETTING_KEYS.notifyForum] = boolToSetting(n.forum, true);
    }
    if ("signups" in n) {
      settings[DISCORD_SETTING_KEYS.notifySignups] = boolToSetting(n.signups, true);
    }
    if ("lessons" in n) {
      settings[DISCORD_SETTING_KEYS.notifyLessons] = boolToSetting(n.lessons, false);
    }
  }

  if (Object.keys(settings).length === 0) {
    return badRequest("No valid settings provided.");
  }

  await cms.setSettings(settings);
  await new Db(env.DB).logAudit(
    gate.auth.user.id,
    "discord.settings.update",
    "site_settings",
    null,
    JSON.stringify(Object.keys(settings)),
  );

  const [persona, notifications] = await Promise.all([
    getDiscordPersona(env.DB),
    getDiscordNotificationSettings(env.DB),
  ]);

  return ok({ saved: true, configured: isDiscordConfigured(env), persona, notifications });
};
