/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { CmsDb } from "../../_lib/cms-db";
import { ok, badRequest, created } from "../../_lib/http";
import { requireAdmin, requireAdminMutation } from "../../_lib/admin";
import { uploadToR2 } from "../../_lib/upload";
import { normalizeLine } from "../../_lib/sanitize";

function mapMedia(row: Awaited<ReturnType<CmsDb["getMediaById"]>>) {
  if (!row) return null;
  return {
    id: row.id,
    fileKey: row.file_key,
    fileName: row.file_name,
    mimeType: row.mime_type,
    fileSize: row.file_size,
    altText: row.alt_text,
    url: `/api/cms/files/${encodeURIComponent(row.file_key)}`,
    createdAt: row.created_at,
  };
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(env, request);
  if (!gate.ok) return gate.response;
  const url = new URL(request.url);
  const search = url.searchParams.get("q") ?? undefined;
  const media = await new CmsDb(env.DB).listMedia(search);
  return ok({ media: media.map((m) => mapMedia(m)) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return badRequest("A file is required.");
  const altText = normalizeLine(form.get("altText"), 200);
  const uploaded = await uploadToR2(env, file, "media");
  if ("error" in uploaded) return badRequest(uploaded.error);
  const cms = new CmsDb(env.DB);
  const id = await cms.createMedia({
    fileKey: uploaded.key,
    fileName: file.name,
    mimeType: uploaded.mimeType,
    fileSize: uploaded.size,
    altText,
    uploadedBy: gate.auth.user.id,
  });
  await new Db(env.DB).logAudit(gate.auth.user.id, "cms.media.upload", "cms_media", id, uploaded.key);
  return created({ media: mapMedia(await cms.getMediaById(id)) });
};
