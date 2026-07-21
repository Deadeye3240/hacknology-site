/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../../_lib/types";
import { notFound, serverError } from "../../../_lib/http";

/** GET /api/cms/files/* — serve uploaded files from R2. */
export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const keyParts = params.key;
  const key = Array.isArray(keyParts) ? keyParts.join("/") : String(keyParts ?? "");
  if (!key || key.includes("..")) return notFound("File not found.");
  if (!env.MEDIA) return serverError("Media storage is not configured.");
  const object = await env.MEDIA.get(key);
  if (!object) return notFound("File not found.");
  const headers = new Headers();
  headers.set("Content-Type", object.httpMetadata?.contentType ?? "application/octet-stream");
  headers.set("Cache-Control", "public, max-age=86400");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(object.body, { headers });
};
