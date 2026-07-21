/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { created, badRequest, unauthorized, forbidden, notFound, tooMany, readJson, asString } from "../../_lib/http";
import { getAuth, verifyCsrf } from "../../_lib/auth";
import { normalizeText } from "../../_lib/sanitize";
import { validateReason } from "../../_lib/validate";

/** POST /api/forum/reports — report a discussion or reply (authenticated). */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!verifyCsrf(request, auth)) return forbidden("Invalid or missing CSRF token.");

  const db = new Db(env.DB);
  if (!(await db.rateLimit(`report:${auth.user.id}`, 15, 3600))) {
    return tooMany();
  }

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;

  const targetType = asString(b.targetType);
  const targetId = asString(b.targetId);
  const reason = normalizeText(b.reason, { maxLength: 500, allowNewlines: true });

  if (targetType !== "discussion" && targetType !== "reply") {
    return badRequest("Invalid report target.");
  }
  const rErr = validateReason(reason);
  if (rErr) return badRequest("Please correct the errors below.", { reason: rErr });

  const exists =
    targetType === "discussion"
      ? await db.getDiscussion(targetId)
      : await db.getReply(targetId);
  if (!exists) return notFound("The reported content no longer exists.");

  await db.createReport({
    reporterId: auth.user.id,
    targetType,
    targetId,
    reason,
  });
  return created({ ok: true });
};
