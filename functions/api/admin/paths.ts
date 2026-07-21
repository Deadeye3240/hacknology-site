/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { CmsDb } from "../../_lib/cms-db";
import { ok, badRequest, readJson, asString } from "../../_lib/http";
import { requireAdmin, requireAdminMutation } from "../../_lib/admin";
import { normalizeLine, normalizeText } from "../../_lib/sanitize";
import type { CmsStatus } from "../../_lib/cms-db";

function mapPath(row: Awaited<ReturnType<CmsDb["getPathById"]>>) {
  if (!row) return null;
  return {
    id: row.id,
    pathId: row.path_id,
    title: row.title,
    description: row.description,
    level: row.level,
    skills: JSON.parse(row.skills || "[]") as string[],
    estimatedHours: row.estimated_hours,
    orderIndex: row.order_index,
    prerequisitePathId: row.prerequisite_path_id,
    specialization: row.specialization,
    practiceLinks: JSON.parse(row.practice_links || "[]"),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(env, request);
  if (!gate.ok) return gate.response;
  const paths = await new CmsDb(env.DB).listPaths();
  return ok({ paths: paths.map((p) => mapPath(p)) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;
  const pathId = normalizeLine(b.pathId, 80);
  const title = normalizeLine(b.title, 200);
  if (!pathId || !title) return badRequest("pathId and title are required.");
  const cms = new CmsDb(env.DB);
  const status = (asString(b.status) === "published" ? "published" : "draft") as CmsStatus;
  const skills = Array.isArray(b.skills) ? JSON.stringify(b.skills) : "[]";
  const practiceLinks = Array.isArray(b.practiceLinks)
    ? JSON.stringify(b.practiceLinks)
    : "[]";
  const id = await cms.upsertPath({
    pathId,
    title,
    description: normalizeText(b.description, { maxLength: 2000 }),
    level: normalizeLine(b.level, 40) || "Beginner",
    skills,
    estimatedHours: typeof b.estimatedHours === "number" ? b.estimatedHours : 0,
    orderIndex: typeof b.orderIndex === "number" ? b.orderIndex : 0,
    prerequisitePathId: normalizeLine(b.prerequisitePathId, 80) || null,
    specialization: normalizeLine(b.specialization, 80) || null,
    practiceLinks,
    status,
  });
  await new Db(env.DB).logAudit(gate.auth.user.id, "cms.path.upsert", "cms_path", id, pathId);
  return ok({ path: mapPath(await cms.getPathById(id)) });
};
