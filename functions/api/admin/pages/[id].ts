/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../../_lib/types";
import { Db } from "../../../_lib/db";
import { CmsDb } from "../../../_lib/cms-db";
import { ok, badRequest, notFound, readJson, asString } from "../../../_lib/http";
import { requireAdmin, requireAdminMutation } from "../../../_lib/admin";
import { normalizeLine, normalizeText } from "../../../_lib/sanitize";
import { isValidSlug } from "../../../_lib/upload";
import type { CmsStatus } from "../../../_lib/cms-db";

function mapPage(row: NonNullable<Awaited<ReturnType<CmsDb["getPageById"]>>>) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    content: row.content,
    status: row.status,
    authorId: row.author_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdmin(env, request);
  if (!gate.ok) return gate.response;
  const page = await new CmsDb(env.DB).getPageById(String(params.id));
  if (!page) return notFound("Page not found.");
  return ok({ page: mapPage(page) });
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const cms = new CmsDb(env.DB);
  const id = String(params.id);
  const existing = await cms.getPageById(id);
  if (!existing) return notFound("Page not found.");
  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;
  const fields: Parameters<CmsDb["updatePage"]>[1] = {};
  if (typeof b.slug !== "undefined") {
    const slug = normalizeLine(b.slug, 80).toLowerCase();
    if (!isValidSlug(slug)) return badRequest("Invalid slug.");
    const taken = await cms.getPageBySlug(slug);
    if (taken && taken.id !== id) return badRequest("Slug is already in use.");
    fields.slug = slug;
  }
  if (typeof b.title !== "undefined") fields.title = normalizeLine(b.title, 200);
  if (typeof b.description !== "undefined") {
    fields.description = normalizeText(b.description, { maxLength: 500 });
  }
  if (typeof b.seoTitle !== "undefined") {
    fields.seoTitle = normalizeLine(b.seoTitle, 120) || null;
  }
  if (typeof b.seoDescription !== "undefined") {
    fields.seoDescription = normalizeText(b.seoDescription, { maxLength: 300 }) || null;
  }
  if (typeof b.content !== "undefined" && typeof b.content === "string") {
    fields.content = b.content;
  }
  if (typeof b.status !== "undefined") {
    const status = asString(b.status);
    if (status === "published" || status === "draft") fields.status = status as CmsStatus;
  }
  await cms.updatePage(id, fields);
  await new Db(env.DB).logAudit(gate.auth.user.id, "cms.page.update", "cms_page", id, null);
  const page = await cms.getPageById(id);
  return ok({ page: page ? mapPage(page) : null });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const cms = new CmsDb(env.DB);
  const id = String(params.id);
  const existing = await cms.getPageById(id);
  if (!existing) return notFound("Page not found.");
  await cms.deletePage(id);
  await new Db(env.DB).logAudit(gate.auth.user.id, "cms.page.delete", "cms_page", id, existing.slug);
  return ok({ deleted: true });
};
