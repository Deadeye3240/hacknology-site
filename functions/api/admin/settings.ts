/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { CmsDb } from "../../_lib/cms-db";
import { ok, badRequest, readJson } from "../../_lib/http";
import { requireAdmin, requireAdminMutation } from "../../_lib/admin";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(env, request);
  if (!gate.ok) return gate.response;
  const settings = await new CmsDb(env.DB).getAllSettings();
  return ok({ settings });
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const body = await readJson(request);
  if (!body || typeof body !== "object") return badRequest("Invalid settings payload.");
  const settings: Record<string, string> = {};
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (typeof value === "string" && key.length <= 80) settings[key] = value;
  }
  await new CmsDb(env.DB).setSettings(settings);
  await new Db(env.DB).logAudit(gate.auth.user.id, "cms.settings.update", "site_settings", null, null);
  return ok({ saved: true });
};
