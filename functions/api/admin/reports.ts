/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok, badRequest, unauthorized, forbidden, readJson, asString } from "../../_lib/http";
import { getAuth, verifyCsrf, roleAtLeast } from "../../_lib/auth";

/** GET /api/admin/reports — list reports (moderator/admin). */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!roleAtLeast(auth.user.role, "moderator")) return forbidden();
  const reports = await new Db(env.DB).listReports();
  return ok({ reports });
};

/** POST /api/admin/reports — mark a report reviewed or dismissed. */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!roleAtLeast(auth.user.role, "moderator")) return forbidden();
  if (!verifyCsrf(request, auth)) return forbidden("Invalid or missing CSRF token.");

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;
  const id = asString(b.id);
  const status = asString(b.status);
  if (!id) return badRequest("Report id is required.");
  if (status !== "reviewed" && status !== "dismissed") {
    return badRequest("Invalid status.");
  }

  const db = new Db(env.DB);
  await db.reviewReport(id, status, auth.user.id);
  await db.logAudit(auth.user.id, "report.review", "report", id, status);
  return ok({ ok: true });
};
