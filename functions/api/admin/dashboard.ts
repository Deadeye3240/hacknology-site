/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { CmsDb } from "../../_lib/cms-db";
import { ok } from "../../_lib/http";
import { requireAdmin } from "../../_lib/admin";

/** GET /api/admin/dashboard — combined admin overview stats. */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(env, request);
  if (!gate.ok) return gate.response;
  const db = new Db(env.DB);
  const cms = new CmsDb(env.DB);
  const [stats, cmsStats] = await Promise.all([db.stats(), cms.cmsStats()]);
  return ok({ stats, cms: cmsStats });
};
