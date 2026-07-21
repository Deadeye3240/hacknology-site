/// <reference types="@cloudflare/workers-types" />
import type { AuthContext, Env, Role } from "./types";
import { Db } from "./db";
import { resolveSession } from "./session";
import { safeEqualStrings } from "./crypto";

const ROLE_RANK: Record<Role, number> = { user: 1, moderator: 2, admin: 3 };

/** True when `role` meets or exceeds `min` in the role hierarchy. */
export function roleAtLeast(role: Role, min: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[min];
}

/**
 * Resolve the authenticated user for a request, or null. Disabled accounts are
 * treated as unauthenticated so a disabled user cannot act.
 */
export async function getAuth(env: Env, request: Request): Promise<AuthContext | null> {
  const session = await resolveSession(env, request);
  if (!session) return null;
  const db = new Db(env.DB);
  const user = await db.getUserById(session.user_id);
  if (!user || user.disabled_at) return null;
  return { user, session };
}

/**
 * Verify the double-submit CSRF token for state-changing requests. The token is
 * tied to the session's server-side secret, so it cannot be forged cross-site.
 */
export function verifyCsrf(request: Request, auth: AuthContext): boolean {
  const header = request.headers.get("X-CSRF-Token") ?? "";
  if (!header) return false;
  return safeEqualStrings(header, auth.session.csrf_secret);
}
