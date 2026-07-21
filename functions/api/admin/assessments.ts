/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { CmsDb } from "../../_lib/cms-db";
import { ok, badRequest, readJson, asString } from "../../_lib/http";
import { requireAdmin, requireAdminMutation } from "../../_lib/admin";
import { normalizeLine } from "../../_lib/sanitize";
import type { CmsStatus } from "../../_lib/cms-db";

function mapAssessment(row: Awaited<ReturnType<CmsDb["getAssessmentByPathId"]>>) {
  if (!row) return null;
  return {
    id: row.id,
    pathId: row.path_id,
    title: row.title,
    passingScore: row.passing_score,
    xpReward: row.xp_reward,
    questions: row.questions,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(env, request);
  if (!gate.ok) return gate.response;
  const assessments = await new CmsDb(env.DB).listAssessments();
  return ok({ assessments: assessments.map((a) => mapAssessment(a)) });
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
  const questions =
    typeof b.questions === "string" ? b.questions : JSON.stringify(b.questions ?? []);
  const id = await cms.upsertAssessment({
    pathId,
    title,
    passingScore: typeof b.passingScore === "number" ? b.passingScore : 70,
    xpReward: typeof b.xpReward === "number" ? b.xpReward : 100,
    questions,
    status,
  });
  await new Db(env.DB).logAudit(gate.auth.user.id, "cms.assessment.upsert", "cms_assessment", id, pathId);
  const row = await cms.getAssessmentByPathId(pathId);
  return ok({ assessment: mapAssessment(row) });
};
