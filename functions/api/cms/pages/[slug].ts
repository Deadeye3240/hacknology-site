/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../../_lib/types";
import { CmsDb } from "../../../_lib/cms-db";
import { ok, notFound } from "../../../_lib/http";

/** GET /api/cms/pages/:slug — public published page by slug. */
export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const slug = String(params.slug);
  const page = await new CmsDb(env.DB).getPageBySlug(slug);
  if (!page || page.status !== "published") return notFound("Page not found.");
  let content: unknown;
  try {
    content = JSON.parse(page.content);
  } catch {
    content = { blocks: [{ type: "paragraph", text: page.content }] };
  }
  return ok({
    page: {
      slug: page.slug,
      title: page.title,
      description: page.description,
      seoTitle: page.seo_title,
      seoDescription: page.seo_description,
      content,
      updatedAt: page.updated_at,
    },
  });
};
