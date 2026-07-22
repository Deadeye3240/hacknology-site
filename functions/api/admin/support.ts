/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok, badRequest, readJson, asString } from "../../_lib/http";
import { requireAdmin, requireAdminMutation } from "../../_lib/admin";

/** GET /api/admin/support — list support messages. */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(env, request);
  if (!gate.ok) return gate.response;
  const messages = await new Db(env.DB).listSupportMessages();
  return ok({ messages });
};

/** POST /api/admin/support — update message status. */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;

  const body = await readJson(request);
  if (!body) return badRequest("Invalid payload.");
  const b = body as Record<string, unknown>;
  const id = asString(b.id);
  const status = asString(b.status);
  if (!id) return badRequest("Message id is required.");
  if (status !== "open" && status !== "read" && status !== "closed") {
    return badRequest("Invalid status.");
  }

  await new Db(env.DB).updateSupportMessageStatus(id, status, gate.auth.user.id);
  await new Db(env.DB).logAudit(
    gate.auth.user.id,
    "support.status.update",
    "support_messages",
    id,
    status,
  );
  return ok({ ok: true });
};
