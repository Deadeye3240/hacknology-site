/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../../_lib/types";
import { Db } from "../../../_lib/db";
import { CmsDb } from "../../../_lib/cms-db";
import { ok, notFound } from "../../../_lib/http";
import { requireAdminMutation } from "../../../_lib/admin";
import { deleteFromR2 } from "../../../_lib/upload";

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const cms = new CmsDb(env.DB);
  const id = String(params.id);
  const existing = await cms.getMediaById(id);
  if (!existing) return notFound("Media not found.");
  await deleteFromR2(env, existing.file_key);
  await cms.deleteMedia(id);
  await new Db(env.DB).logAudit(gate.auth.user.id, "cms.media.delete", "cms_media", id, null);
  return ok({ deleted: true });
};
