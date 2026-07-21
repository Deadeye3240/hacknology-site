/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../../_lib/types";
import { Db } from "../../../_lib/db";
import { ok, badRequest, unauthorized, forbidden, notFound, readJson } from "../../../_lib/http";
import { getAuth, verifyCsrf, roleAtLeast } from "../../../_lib/auth";
import { normalizeLine, normalizeText } from "../../../_lib/sanitize";
import { validateTitle, validateForumContent } from "../../../_lib/validate";

/** GET /api/forum/discussions/:id — full discussion with replies. */
export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const id = String(params.id);
  const db = new Db(env.DB);
  const d = await db.getDiscussion(id);
  if (!d || d.removed === 1) return notFound("Discussion not found.");

  const author = await db.getUserById(d.author_id);
  const category = await db.getCategory(d.category_id);
  const replyRows = await db.listReplies(id);
  const auth = await getAuth(env, request);
  const viewerId = auth?.user.id ?? null;
  const isMod = auth ? roleAtLeast(auth.user.role, "moderator") : false;

  return ok({
    discussion: {
      id: d.id,
      categoryId: d.category_id,
      categoryName: category?.name ?? "Unknown",
      title: d.title,
      content: d.content,
      locked: d.locked === 1,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
      author: author
        ? {
            username: author.username,
            displayName: author.display_name,
            avatar: author.avatar,
            role: author.role,
          }
        : null,
      canEdit: viewerId === d.author_id && d.locked === 0,
      canDelete: viewerId === d.author_id || isMod,
      canModerate: isMod,
    },
    replies: replyRows.map((r) => {
      const row = r as Record<string, unknown>;
      const removed = row.removed === 1;
      return {
        id: row.id,
        content: removed ? "" : row.content,
        removed,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        author: {
          username: row.author_username,
          displayName: row.author_display_name,
          avatar: row.author_avatar,
          role: row.author_role,
        },
        canEdit: viewerId === row.author_id && !removed && d.locked === 0,
        canDelete: (viewerId === row.author_id || isMod) && !removed,
      };
    }),
  });
};

/** PATCH /api/forum/discussions/:id — author edits their own discussion. */
export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!verifyCsrf(request, auth)) return forbidden("Invalid or missing CSRF token.");

  const db = new Db(env.DB);
  const d = await db.getDiscussion(String(params.id));
  if (!d || d.removed === 1) return notFound("Discussion not found.");
  if (d.author_id !== auth.user.id) return forbidden("You can only edit your own posts.");
  if (d.locked === 1) return forbidden("This discussion is locked.");

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;
  const title = normalizeLine(b.title, 140);
  const content = normalizeText(b.content, { maxLength: 10_000, allowNewlines: true });

  const fields: Record<string, string> = {};
  const tErr = validateTitle(title);
  if (tErr) fields.title = tErr;
  const cErr = validateForumContent(content);
  if (cErr) fields.content = cErr;
  if (Object.keys(fields).length > 0) {
    return badRequest("Please correct the errors below.", fields);
  }

  await db.updateDiscussion(d.id, title, content);
  return ok({ ok: true });
};

/** DELETE /api/forum/discussions/:id — author deletes, or moderator removes. */
export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!verifyCsrf(request, auth)) return forbidden("Invalid or missing CSRF token.");

  const db = new Db(env.DB);
  const d = await db.getDiscussion(String(params.id));
  if (!d || d.removed === 1) return notFound("Discussion not found.");

  const isMod = roleAtLeast(auth.user.role, "moderator");
  if (d.author_id !== auth.user.id && !isMod) {
    return forbidden("You can only delete your own posts.");
  }

  await db.setDiscussionRemoved(d.id, true);
  if (isMod && d.author_id !== auth.user.id) {
    await db.logAudit(auth.user.id, "forum.remove_discussion", "discussion", d.id, null);
  }
  return ok({ ok: true });
};
