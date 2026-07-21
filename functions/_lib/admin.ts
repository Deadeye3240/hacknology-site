/// <reference types="@cloudflare/workers-types" />
import type { Env } from "./types";
import { getAuth, verifyCsrf, roleAtLeast } from "./auth";
import { unauthorized, forbidden } from "./http";

type GateResult =
  | { ok: true; auth: NonNullable<Awaited<ReturnType<typeof getAuth>>> }
  | { ok: false; response: Response };

/** Require an authenticated admin session. Returns auth context or an error Response. */
export async function requireAdmin(env: Env, request: Request): Promise<GateResult> {
  const auth = await getAuth(env, request);
  if (!auth) return { ok: false, response: unauthorized() };
  if (!roleAtLeast(auth.user.role, "admin")) {
    return { ok: false, response: forbidden() };
  }
  return { ok: true, auth };
}

/** Require admin + valid CSRF for mutating requests. */
export async function requireAdminMutation(env: Env, request: Request): Promise<GateResult> {
  const result = await requireAdmin(env, request);
  if (!result.ok) return result;
  if (!verifyCsrf(request, result.auth)) {
    return { ok: false, response: forbidden("Invalid or missing CSRF token.") };
  }
  return result;
}
