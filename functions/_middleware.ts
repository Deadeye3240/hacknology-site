/// <reference types="@cloudflare/workers-types" />
import type { Env } from "./_lib/types";
import { error } from "./_lib/http";

/**
 * Global middleware: guards API routes when the database binding is missing and
 * applies baseline security headers to every response.
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);

  if (url.pathname.startsWith("/api/") && !context.env.DB) {
    return error(
      503,
      "The backend is not configured. See README for D1 database setup.",
    );
  }

  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (!headers.has("X-Frame-Options")) headers.set("X-Frame-Options", "DENY");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
