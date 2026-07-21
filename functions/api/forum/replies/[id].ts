/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../../_lib/types";
import { Db } from "../../../_lib/db";
import { ok, badRequest, unauthorized, forbidden, notFound, readJson } from "../../../_lib/http";
import { getAuth, verifyCsrf, roleAtLeast } from "../../../_lib/auth";
import { normalizeText } from "../../../_lib/sanitize";
import { validateForumContent } from "../../../_lib/validate";

/** PATCH /api/forum/replies/:id — author edits their own reply. */
export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!verifyCsrf(request, auth)) return forbidden("Invalid or missing CSRF token.");

  const db = new Db(env.DB);
  const r = await db.getReply(String(params.id));
  if (!r || r.removed === 1) return notFound("Reply not found.");
  if (r.author_id !== auth.user.id) return forbidden("You can only edit your own replies.");

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const content = normalizeText((body as Record<string, unknown>).content, {
    maxLength: 10_000,
    allowNewlines: true,
  });
  const cErr = validateForumContent(content);
  if (cErr) return badRequest("Please correct the errors below.", { content: cErr });

  await db.updateReply(r.id, content);
  return ok({ ok: true });
};

/** DELETE /api/forum/replies/:id — author deletes, or moderator removes. */
export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!verifyCsrf(request, auth)) return forbidden("Invalid or missing CSRF token.");

  const db = new Db(env.DB);
  const r = await db.getReply(String(params.id));
  if (!r || r.removed === 1) return notFound("Reply not found.");

  const isMod = roleAtLeast(auth.user.role, "moderator");
  if (r.author_id !== auth.user.id && !isMod) {
    return forbidden("You can only delete your own replies.");
  }

  await db.setReplyRemoved(r.id, true);
  if (isMod && r.author_id !== auth.user.id) {
    await db.logAudit(auth.user.id, "forum.remove_reply", "reply", r.id, null);
  }
  return ok({ ok: true });
};
