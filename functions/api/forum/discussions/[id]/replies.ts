/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../../../_lib/types";
import { Db } from "../../../../_lib/db";
import { created, badRequest, unauthorized, forbidden, notFound, tooMany, readJson } from "../../../../_lib/http";
import { getAuth, verifyCsrf } from "../../../../_lib/auth";
import { normalizeText } from "../../../../_lib/sanitize";
import { validateForumContent } from "../../../../_lib/validate";

/** POST /api/forum/discussions/:id/replies — add a reply (authenticated). */
export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!verifyCsrf(request, auth)) return forbidden("Invalid or missing CSRF token.");

  const db = new Db(env.DB);
  const d = await db.getDiscussion(String(params.id));
  if (!d || d.removed === 1) return notFound("Discussion not found.");
  if (d.locked === 1) return forbidden("This discussion is locked.");

  if (!(await db.rateLimit(`reply:${auth.user.id}`, 20, 600))) {
    return tooMany("You're posting too quickly. Please wait a moment.");
  }

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const content = normalizeText((body as Record<string, unknown>).content, {
    maxLength: 10_000,
    allowNewlines: true,
  });
  const cErr = validateForumContent(content);
  if (cErr) return badRequest("Please correct the errors below.", { content: cErr });

  const id = await db.createReply(d.id, auth.user.id, content);
  return created({ id });
};
