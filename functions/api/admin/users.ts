/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok, unauthorized, forbidden } from "../../_lib/http";
import { getAuth, roleAtLeast } from "../../_lib/auth";

/** GET /api/admin/users — list accounts (admin only). No secrets returned. */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!roleAtLeast(auth.user.role, "admin")) return forbidden();

  const rows = await new Db(env.DB).listUsers(200);
  return ok({
    users: rows.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      displayName: u.display_name,
      role: u.role,
      disabled: u.disabled_at !== null,
      createdAt: u.created_at,
    })),
  });
};
