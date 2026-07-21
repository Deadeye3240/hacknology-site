/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { CmsDb } from "../../_lib/cms-db";
import { ok, badRequest, created, readJson, asString } from "../../_lib/http";
import { requireAdmin, requireAdminMutation } from "../../_lib/admin";
import { normalizeLine, normalizeText } from "../../_lib/sanitize";
import { isValidSlug } from "../../_lib/upload";
import type { CmsStatus } from "../../_lib/cms-db";

function mapPage(row: Awaited<ReturnType<CmsDb["getPageById"]>>) {
  if (!row) return null;
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

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(env, request);
  if (!gate.ok) return gate.response;
  const pages = await new CmsDb(env.DB).listPages();
  return ok({ pages: pages.map((p) => mapPage(p)) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;
  const slug = normalizeLine(b.slug, 80).toLowerCase();
  const title = normalizeLine(b.title, 200);
  if (!isValidSlug(slug)) return badRequest("Invalid slug. Use lowercase letters, numbers, and hyphens.");
  if (!title) return badRequest("Title is required.");
  const cms = new CmsDb(env.DB);
  if (await cms.getPageBySlug(slug)) return badRequest("Slug is already in use.");
  const status = (asString(b.status) === "published" ? "published" : "draft") as CmsStatus;
  const content =
    typeof b.content === "string" ? b.content : JSON.stringify({ blocks: [] });
  const id = await cms.createPage({
    slug,
    title,
    description: normalizeText(b.description, { maxLength: 500 }),
    seoTitle: normalizeLine(b.seoTitle, 120) || null,
    seoDescription: normalizeText(b.seoDescription, { maxLength: 300 }) || null,
    content,
    status,
    authorId: gate.auth.user.id,
  });
  await new Db(env.DB).logAudit(gate.auth.user.id, "cms.page.create", "cms_page", id, slug);
  const page = mapPage(await cms.getPageById(id));
  return created({ page });
};
