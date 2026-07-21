/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok, created, badRequest, unauthorized, forbidden, tooMany, readJson, asString } from "../../_lib/http";
import { getAuth, verifyCsrf } from "../../_lib/auth";
import { normalizeLine, normalizeText } from "../../_lib/sanitize";
import { validateTitle, validateForumContent } from "../../_lib/validate";

/** GET /api/forum/discussions?category=<id>&search=<q> */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") ?? undefined;
  const search = (url.searchParams.get("search") ?? "").trim().slice(0, 80) || undefined;
  const rows = await new Db(env.DB).listDiscussions(category || undefined, search);
  return ok({ discussions: rows });
};

/** POST /api/forum/discussions — create a discussion (authenticated). */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!verifyCsrf(request, auth)) return forbidden("Invalid or missing CSRF token.");

  const db = new Db(env.DB);
  if (!(await db.rateLimit(`discussion:${auth.user.id}`, 8, 3600))) {
    return tooMany("You're posting too quickly. Please wait a moment.");
  }

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;

  const categoryId = asString(b.categoryId);
  const title = normalizeLine(b.title, 140);
  const content = normalizeText(b.content, { maxLength: 10_000, allowNewlines: true });

  const fields: Record<string, string> = {};
  const tErr = validateTitle(title);
  if (tErr) fields.title = tErr;
  const cErr = validateForumContent(content);
  if (cErr) fields.content = cErr;
  if (!categoryId || !(await db.getCategory(categoryId))) {
    fields.categoryId = "Choose a valid category.";
  }
  if (Object.keys(fields).length > 0) {
    return badRequest("Please correct the errors below.", fields);
  }

  const id = await db.createDiscussion({
    categoryId,
    authorId: auth.user.id,
    title,
    content,
  });
  return created({ id });
};
