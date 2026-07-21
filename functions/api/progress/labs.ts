/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok, badRequest, unauthorized, forbidden, readJson, asString } from "../../_lib/http";
import { getAuth, verifyCsrf } from "../../_lib/auth";
import { normalizeLine } from "../../_lib/sanitize";

function normalizeStatus(value: unknown): "in_progress" | "completed" | null {
  const s = asString(value).toLowerCase();
  if (s === "completed") return "completed";
  if (s === "in_progress" || s === "in progress") return "in_progress";
  return null;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  const rows = await new Db(env.DB).getLabProgress(auth.user.id);
  return ok({
    labs: rows.map((r) => ({
      labId: r.lab_id,
      status: r.status,
      startedAt: r.started_at,
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
    for (const item of b.migrate.slice(0, 500)) {
      const labId = normalizeLine((item as Record<string, unknown>)?.labId, 120);
      const status = normalizeStatus((item as Record<string, unknown>)?.status);
      if (!labId || !status) continue;
      await db.upsertLabProgress(auth.user.id, labId, status);
      migrated++;
    }
    return ok({ migrated });
  }

  const labId = normalizeLine(asString(b.labId), 120);
  const status = normalizeStatus(b.status);
  if (!labId) return badRequest("labId is required.");
  if (!status) return badRequest("status must be 'in_progress' or 'completed'.");
  await db.upsertLabProgress(auth.user.id, labId, status);
  return ok({ ok: true });
};
