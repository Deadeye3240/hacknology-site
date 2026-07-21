/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { CmsDb } from "../../_lib/cms-db";
import { ok } from "../../_lib/http";

/** GET /api/cms/resources — public downloadable resources from CMS. */
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const rows = await new CmsDb(env.DB).listResources("public");
  return ok({
    resources: rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      category: r.category,
      website: r.website,
      resourceLink: r.resource_link,
      downloadUrl: r.file_key ? `/api/cms/files/${encodeURIComponent(r.file_key)}` : null,
      fileName: r.file_name,
      fileType: r.file_type,
      fileSize: r.file_size,
      createdAt: r.created_at,
    })),
  });
};
