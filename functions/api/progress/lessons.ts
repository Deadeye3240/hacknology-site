/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok, badRequest, unauthorized, forbidden, readJson, asString } from "../../_lib/http";
import { getAuth, verifyCsrf } from "../../_lib/auth";
import { normalizeLine } from "../../_lib/sanitize";
import { notifyLessonCompleted } from "../../_lib/discord";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  const rows = await new Db(env.DB).getLessonProgress(auth.user.id);
  return ok({
    lessons: rows.map((r) => ({
      lessonId: r.lesson_id,
      completed: r.completed === 1,
      completedAt: r.completed_at,
    })),
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, context }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!verifyCsrf(request, auth)) return forbidden("Invalid or missing CSRF token.");

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;
  const db = new Db(env.DB);

  // Bulk migration from localStorage: merge completed lessons into the account.
  if (Array.isArray(b.migrate)) {
    let migrated = 0;
    for (const item of b.migrate.slice(0, 500)) {
      const lessonId = normalizeLine((item as Record<string, unknown>)?.lessonId, 120);
      if (!lessonId) continue;
      const completed = (item as Record<string, unknown>)?.completed !== false;
      await db.upsertLessonProgress(auth.user.id, lessonId, completed);
      migrated++;
    }
    return ok({ migrated });
  }

  const lessonId = normalizeLine(asString(b.lessonId), 120);
  if (!lessonId) return badRequest("lessonId is required.");
  const completed = b.completed !== false;

  let wasCompleted = false;
  if (completed) {
    const existing = await db.getLessonProgress(auth.user.id);
    wasCompleted = existing.some((row) => row.lesson_id === lessonId && row.completed === 1);
  }

  await db.upsertLessonProgress(auth.user.id, lessonId, completed);

  if (completed && !wasCompleted) {
    void notifyLessonCompleted(env, env.DB, context, {
      username: auth.user.username,
      lessonId,
    });
  }

  return ok({ ok: true });
};
