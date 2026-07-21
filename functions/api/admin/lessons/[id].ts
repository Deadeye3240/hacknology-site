/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../../_lib/types";
import { Db } from "../../../_lib/db";
import { CmsDb } from "../../../_lib/cms-db";
import { ok, badRequest, notFound, readJson, asString } from "../../../_lib/http";
import { requireAdmin, requireAdminMutation } from "../../../_lib/admin";
import { normalizeLine, normalizeText } from "../../../_lib/sanitize";
import type { CmsStatus } from "../../../_lib/cms-db";

function mapLesson(row: NonNullable<Awaited<ReturnType<CmsDb["getLessonById"]>>>) {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    pathId: row.path_id,
    orderIndex: row.order_index,
    title: row.title,
    summary: row.summary,
    payload: row.payload,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(env, request);
  if (!gate.ok) return gate.response;
  const lesson = await new CmsDb(env.DB).getLessonById(String(params.id));
  if (!lesson) return notFound("Lesson not found.");
  return ok({ lesson: mapLesson(lesson) });
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const cms = new CmsDb(env.DB);
  const id = String(params.id);
  const existing = await cms.getLessonById(id);
  if (!existing) return notFound("Lesson not found.");
  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;
  await cms.upsertLesson({
    lessonId: existing.lesson_id,
    pathId: typeof b.pathId === "string" ? normalizeLine(b.pathId, 80) : existing.path_id,
    orderIndex: typeof b.orderIndex === "number" ? b.orderIndex : existing.order_index,
    title: typeof b.title === "string" ? normalizeLine(b.title, 200) : existing.title,
    summary:
      typeof b.summary === "string"
        ? normalizeText(b.summary, { maxLength: 500 })
        : existing.summary,
    payload: typeof b.payload === "string" ? b.payload : existing.payload,
    status:
      asString(b.status) === "published" || asString(b.status) === "draft"
        ? (asString(b.status) as CmsStatus)
        : existing.status,
  });
  await new Db(env.DB).logAudit(gate.auth.user.id, "cms.lesson.update", "cms_lesson", id, null);
  const lesson = await cms.getLessonById(id);
  return ok({ lesson: lesson ? mapLesson(lesson) : null });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const cms = new CmsDb(env.DB);
  const id = String(params.id);
  const existing = await cms.getLessonById(id);
  if (!existing) return notFound("Lesson not found.");
  await cms.deleteLesson(id);
  await new Db(env.DB).logAudit(
    gate.auth.user.id,
    "cms.lesson.delete",
    "cms_lesson",
    id,
    existing.lesson_id,
  );
  return ok({ deleted: true });
};
