/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { ok } from "../../_lib/http";
import { destroySession } from "../../_lib/session";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Logout is safe to allow without CSRF: it only ends the caller's session and
  // has no harmful cross-site effect. The session is deleted server-side.
  const clearCookie = await destroySession(env, request);
  return ok({ ok: true }, { "Set-Cookie": clearCookie });
};
