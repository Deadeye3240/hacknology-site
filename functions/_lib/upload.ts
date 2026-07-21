/// <reference types="@cloudflare/workers-types" />
import type { Env } from "./types";
import { uuid } from "./crypto";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/zip": [".zip"],
  "application/x-zip-compressed": [".zip"],
  "text/plain": [".txt"],
  "text/markdown": [".md"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "text/javascript": [".js"],
  "application/javascript": [".js"],
  "text/x-python": [".py"],
  "text/x-c": [".c", ".h"],
  "text/html": [".html"],
};

export function isAllowedUpload(mimeType: string, fileName: string): boolean {
  const ext = fileName.includes(".") ? `.${fileName.split(".").pop()?.toLowerCase()}` : "";
  const allowed = ALLOWED_MIME[mimeType];
  if (!allowed) return false;
  if (!ext) return true;
  return allowed.includes(ext);
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export async function uploadToR2(
  env: Env,
  file: File,
  prefix: string,
): Promise<{ key: string; mimeType: string; size: number } | { error: string }> {
  if (!env.MEDIA) {
    return { error: "R2 media bucket is not configured. See docs/ADMIN-CMS.md." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "File exceeds the 10 MB limit." };
  }
  const mimeType = file.type || "application/octet-stream";
  if (!isAllowedUpload(mimeType, file.name)) {
    return { error: "File type is not allowed." };
  }
  const safeName = sanitizeFileName(file.name);
  const key = `${prefix}/${uuid()}-${safeName}`;
  const data = await file.arrayBuffer();
  await env.MEDIA.put(key, data, {
    httpMetadata: { contentType: mimeType },
  });
  return { key, mimeType, size: file.size };
}

export async function deleteFromR2(env: Env, key: string): Promise<void> {
  if (env.MEDIA) await env.MEDIA.delete(key);
}

/** Slug validation for CMS pages. */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 2 && slug.length <= 80;
}
