/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok, badRequest, unauthorized, forbidden, readJson, asString } from "../../_lib/http";
import { getAuth, verifyCsrf } from "../../_lib/auth";
import { normalizeLine } from "../../_lib/sanitize";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  const rows = await new Db(env.DB).getPathProgress(auth.user.id);
  return ok({
    paths: rows.map((r) => ({
      pathId: r.path_id,
      assessmentScore: r.assessment_score,
      completedAt: r.completed_at,
    })),
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!verifyCsrf(request, auth)) return forbidden("Invalid or missing CSRF token.");

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;
  const db = new Db(env.DB);

  if (Array.isArray(b.migrate)) {
    let migrated = 0;
    for (const item of b.migrate.slice(0, 50)) {
      const row = item as Record<string, unknown>;
      const pathId = normalizeLine(row.pathId, 120);
      if (!pathId) continue;
      const completed = row.completed !== false;
      if (completed) {
        const score =
          typeof row.assessmentScore === "number" ? Math.round(row.assessmentScore) : null;
        await db.upsertPathProgress(auth.user.id, pathId, score);
        migrated++;
      } else {
        await db.deletePathProgress(auth.user.id, pathId);
        migrated++;
      }
    }
    return ok({ migrated });
  }

  const pathId = normalizeLine(asString(b.pathId), 120);
  if (!pathId) return badRequest("pathId is required.");
  const completed = b.completed !== false;

  if (completed) {
    const score =
      typeof b.assessmentScore === "number" ? Math.round(b.assessmentScore) : null;
    await db.upsertPathProgress(auth.user.id, pathId, score);
  } else {
    await db.deletePathProgress(auth.user.id, pathId);
  }

  return ok({ ok: true });
};
