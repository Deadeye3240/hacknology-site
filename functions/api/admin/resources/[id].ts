/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../../_lib/types";
import { Db } from "../../../_lib/db";
import { CmsDb } from "../../../_lib/cms-db";
import { ok, badRequest, notFound, readJson, asString } from "../../../_lib/http";
import { requireAdminMutation } from "../../../_lib/admin";
import { normalizeLine, normalizeText } from "../../../_lib/sanitize";
import { deleteFromR2 } from "../../../_lib/upload";

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const cms = new CmsDb(env.DB);
  const id = String(params.id);
  const existing = await cms.getResourceById(id);
  if (!existing) return notFound("Resource not found.");
  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;
  await cms.updateResource(id, {
    name: typeof b.name === "string" ? normalizeLine(b.name, 200) : undefined,
    description:
      typeof b.description === "string"
        ? normalizeText(b.description, { maxLength: 2000 })
        : undefined,
    category: typeof b.category === "string" ? normalizeLine(b.category, 80) : undefined,
    visibility: b.visibility === "hidden" ? "hidden" : b.visibility === "public" ? "public" : undefined,
    website: typeof b.website === "string" ? asString(b.website) || null : undefined,
    resourceLink:
      typeof b.resourceLink === "string" ? asString(b.resourceLink) || null : undefined,
  });
  await new Db(env.DB).logAudit(gate.auth.user.id, "cms.resource.update", "cms_resource", id, null);
  return ok({ resource: await cms.getResourceById(id) });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const cms = new CmsDb(env.DB);
  const id = String(params.id);
  const existing = await cms.getResourceById(id);
  if (!existing) return notFound("Resource not found.");
  if (existing.file_key) await deleteFromR2(env, existing.file_key);
  if (existing.thumbnail_key) await deleteFromR2(env, existing.thumbnail_key);
  await cms.deleteResource(id);
  await new Db(env.DB).logAudit(gate.auth.user.id, "cms.resource.delete", "cms_resource", id, null);
  return ok({ deleted: true });
};
