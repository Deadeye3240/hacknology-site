/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../../../_lib/types";
import { Db } from "../../../../_lib/db";
import { ok, badRequest, unauthorized, forbidden, notFound, readJson } from "../../../../_lib/http";
import { getAuth, verifyCsrf, roleAtLeast } from "../../../../_lib/auth";

/** POST /api/forum/discussions/:id/lock — moderator/admin locks or unlocks. */
export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!roleAtLeast(auth.user.role, "moderator")) return forbidden();
  if (!verifyCsrf(request, auth)) return forbidden("Invalid or missing CSRF token.");

  const db = new Db(env.DB);
  const d = await db.getDiscussion(String(params.id));
  if (!d || d.removed === 1) return notFound("Discussion not found.");

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const locked = (body as Record<string, unknown>).locked !== false;

  await db.setDiscussionLocked(d.id, locked);
  await db.logAudit(
    auth.user.id,
    locked ? "forum.lock_discussion" : "forum.unlock_discussion",
    "discussion",
    d.id,
    null,
  );
  return ok({ ok: true, locked });
};
