/// <reference types="@cloudflare/workers-types" />

/** JSON success/error helpers and small request utilities. */

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
};

export function json(
  data: unknown,
  init: ResponseInit = {},
  extraHeaders: HeadersInit = {},
): Response {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    ...SECURITY_HEADERS,
    ...Object.fromEntries(new Headers(extraHeaders)),
  });
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function ok(data: unknown = { ok: true }, extraHeaders: HeadersInit = {}) {
  return json(data, { status: 200 }, extraHeaders);
}

export function created(data: unknown, extraHeaders: HeadersInit = {}) {
  return json(data, { status: 201 }, extraHeaders);
}

export interface ApiErrorBody {
  error: string;
  /** Optional field-level messages for form validation. */
  fields?: Record<string, string>;
}

export function error(
  status: number,
  message: string,
  fields?: Record<string, string>,
): Response {
  const body: ApiErrorBody = { error: message };
  if (fields) body.fields = fields;
  return json(body, { status });
}

export const badRequest = (m: string, f?: Record<string, string>) =>
  error(400, m, f);
export const unauthorized = (m = "Authentication required.") => error(401, m);
export const forbidden = (m = "You do not have permission to do that.") =>
  error(403, m);
export const notFound = (m = "Not found.") => error(404, m);
export const tooMany = (m = "Too many requests. Please slow down.") =>
  error(429, m);
export const serverError = (m = "Something went wrong.") => error(500, m);

/** Safely parse a JSON request body, returning null on any failure. */
export async function readJson<T = Record<string, unknown>>(
  request: Request,
): Promise<T | null> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) return null;
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

/** Coerce an unknown value to a trimmed string (empty string if not a string). */
export function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
