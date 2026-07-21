/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { CmsDb } from "../../_lib/cms-db";
import { ok, badRequest, created, readJson, asString } from "../../_lib/http";
import { requireAdmin, requireAdminMutation } from "../../_lib/admin";
import { normalizeLine, normalizeText } from "../../_lib/sanitize";

function mapResource(row: Awaited<ReturnType<CmsDb["getResourceById"]>>) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    visibility: row.visibility,
    fileKey: row.file_key,
    fileName: row.file_name,
    fileType: row.file_type,
    fileSize: row.file_size,
    thumbnailKey: row.thumbnail_key,
    website: row.website,
    resourceLink: row.resource_link,
    downloadUrl: row.file_key ? `/api/cms/files/${encodeURIComponent(row.file_key)}` : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(env, request);
  if (!gate.ok) return gate.response;
  const resources = await new CmsDb(env.DB).listResources();
  return ok({ resources: resources.map((r) => mapResource(r)) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;
  const name = normalizeLine(b.name, 200);
  if (!name) return badRequest("Name is required.");
  const cms = new CmsDb(env.DB);
  const id = await cms.createResource({
    name,
    description: normalizeText(b.description, { maxLength: 2000 }),
    category: normalizeLine(b.category, 80) || "Downloads",
    visibility: b.visibility === "hidden" ? "hidden" : "public",
    fileKey: asString(b.fileKey) || null,
    fileName: asString(b.fileName) || null,
    fileType: asString(b.fileType) || null,
    fileSize: typeof b.fileSize === "number" ? b.fileSize : null,
    thumbnailKey: asString(b.thumbnailKey) || null,
    website: asString(b.website) || null,
    resourceLink: asString(b.resourceLink) || null,
  });
  await new Db(env.DB).logAudit(gate.auth.user.id, "cms.resource.create", "cms_resource", id, name);
  return created({ resource: mapResource(await cms.getResourceById(id)) });
};
