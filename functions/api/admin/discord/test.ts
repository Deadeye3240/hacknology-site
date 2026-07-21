/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../../_lib/types";
import { Db } from "../../../_lib/db";
import { ok, badRequest } from "../../../_lib/http";
import { requireAdminMutation } from "../../../_lib/admin";
import { sendDiscordTest } from "../../../_lib/discord";

/** POST /api/admin/discord/test — send a test webhook message. */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;

  const result = await sendDiscordTest(env, env.DB);
  if (!result.ok) return badRequest(result.error ?? "Test failed.");

  await new Db(env.DB).logAudit(
    gate.auth.user.id,
    "discord.webhook.test",
    "discord",
    null,
    null,
  );

  return ok({ sent: true });
};
