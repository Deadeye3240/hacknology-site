/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { toSelfUser } from "../../_lib/types";
import { ok } from "../../_lib/http";
import { getAuth } from "../../_lib/auth";

/**
 * Returns the current authenticated user (or `{ user: null }`) plus the CSRF
 * token bound to the session. The frontend calls this on load to establish
 * auth state.
 */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(env, request);
  if (!auth) return ok({ user: null, csrfToken: null });
  return ok({ user: toSelfUser(auth.user), csrfToken: auth.session.csrf_secret });
};
