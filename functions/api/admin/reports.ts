/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok, badRequest, readJson, asString } from "../../_lib/http";
import { requireAdmin, requireAdminMutation } from "../../_lib/admin";

/** GET /api/admin/reports — list reports (admin only). */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(env, request);
  if (!gate.ok) return gate.response;
  const reports = await new Db(env.DB).listReports();
  return ok({ reports });
};

/** POST /api/admin/reports — mark a report reviewed or dismissed. */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;

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
  await db.reviewReport(id, status, gate.auth.user.id);
  await db.logAudit(gate.auth.user.id, "report.review", "report", id, status);
  return ok({ ok: true });
};
