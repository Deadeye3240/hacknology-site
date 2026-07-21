/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../../_lib/types";
import { Db } from "../../../_lib/db";
import { ok, badRequest, readJson, asString } from "../../../_lib/http";
import { requireAdminMutation } from "../../../_lib/admin";
import { parseEmbedColor, sendDiscordAdminMessage } from "../../../_lib/discord";

/** POST /api/admin/discord/message — send a custom webhook message from admin. */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;

  const body = await readJson(request);
  if (!body || typeof body !== "object") return badRequest("Invalid payload.");

  const b = body as Record<string, unknown>;
  const result = await sendDiscordAdminMessage(env, env.DB, {
    content: asString(b.content) || undefined,
    embedTitle: asString(b.embedTitle) || undefined,
    embedDescription: asString(b.embedDescription) || undefined,
    embedColor: parseEmbedColor(b.embedColor),
    username: asString(b.username) || undefined,
    avatarUrl: asString(b.avatarUrl) || undefined,
  });

  if (!result.ok) return badRequest(result.error ?? "Could not send message.");

  await new Db(env.DB).logAudit(
    gate.auth.user.id,
    "discord.message.send",
    "discord",
    null,
    asString(b.embedTitle) || truncateAudit(asString(b.content)),
  );

  return ok({ sent: true });
};

function truncateAudit(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "custom message";
  return trimmed.length > 120 ? `${trimmed.slice(0, 119)}…` : trimmed;
}
