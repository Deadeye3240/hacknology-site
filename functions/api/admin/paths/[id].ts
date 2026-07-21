/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../../_lib/types";
import { Db } from "../../../_lib/db";
import { CmsDb } from "../../../_lib/cms-db";
import { ok, notFound } from "../../../_lib/http";
import { requireAdminMutation } from "../../../_lib/admin";

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const cms = new CmsDb(env.DB);
  const id = String(params.id);
  const existing = await cms.getPathById(id);
  if (!existing) return notFound("Path not found.");
  await cms.deletePath(id);
  await new Db(env.DB).logAudit(gate.auth.user.id, "cms.path.delete", "cms_path", id, existing.path_id);
  return ok({ deleted: true });
};
