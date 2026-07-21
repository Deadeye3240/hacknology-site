/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok, badRequest, created } from "../../_lib/http";
import { requireAdminMutation } from "../../_lib/admin";
import { uploadToR2 } from "../../_lib/upload";

/** POST /api/admin/upload — upload a file to R2 (resources or general). */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const form = await request.formData();
  const file = form.get("file");
  const prefix = (form.get("prefix") as string | null) ?? "uploads";
  if (!(file instanceof File)) return badRequest("A file is required.");
  const safePrefix = ["media", "resources", "uploads"].includes(prefix) ? prefix : "uploads";
  const uploaded = await uploadToR2(env, file, safePrefix);
  if ("error" in uploaded) return badRequest(uploaded.error);
  await new Db(env.DB).logAudit(
    gate.auth.user.id,
    "cms.file.upload",
    "file",
    null,
    uploaded.key,
  );
  return created({
    file: {
      key: uploaded.key,
      mimeType: uploaded.mimeType,
      size: uploaded.size,
      url: `/api/cms/files/${encodeURIComponent(uploaded.key)}`,
    },
  });
};
