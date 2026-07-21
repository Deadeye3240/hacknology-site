/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { CmsDb } from "../../_lib/cms-db";
import { ok, badRequest, readJson, asString } from "../../_lib/http";
import { requireAdmin, requireAdminMutation } from "../../_lib/admin";
import { normalizeLine, normalizeText } from "../../_lib/sanitize";
import type { CmsStatus } from "../../_lib/cms-db";

function mapLesson(row: Awaited<ReturnType<CmsDb["getLessonById"]>>) {
  if (!row) return null;
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

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(env, request);
  if (!gate.ok) return gate.response;
  const url = new URL(request.url);
  const pathId = url.searchParams.get("pathId") ?? undefined;
  const lessons = await new CmsDb(env.DB).listLessons(pathId);
  return ok({ lessons: lessons.map((l) => mapLesson(l)) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;
  const lessonId = normalizeLine(b.lessonId, 80);
  const pathId = normalizeLine(b.pathId, 80);
  const title = normalizeLine(b.title, 200);
  if (!lessonId || !pathId || !title) {
    return badRequest("lessonId, pathId, and title are required.");
  }
  const cms = new CmsDb(env.DB);
  const status = (asString(b.status) === "published" ? "published" : "draft") as CmsStatus;
  const payload =
    typeof b.payload === "string" ? b.payload : JSON.stringify(b.payload ?? {});
  const id = await cms.upsertLesson({
    lessonId,
    pathId,
    orderIndex: typeof b.orderIndex === "number" ? b.orderIndex : 0,
    title,
    summary: normalizeText(b.summary, { maxLength: 500 }),
    payload,
    status,
  });
  await new Db(env.DB).logAudit(gate.auth.user.id, "cms.lesson.upsert", "cms_lesson", id, lessonId);
  return ok({ lesson: mapLesson(await cms.getLessonById(id)) });
};
