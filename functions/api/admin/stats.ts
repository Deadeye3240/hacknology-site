/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok, unauthorized, forbidden } from "../../_lib/http";
import { getAuth, roleAtLeast } from "../../_lib/auth";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!roleAtLeast(auth.user.role, "moderator")) return forbidden();
  const stats = await new Db(env.DB).stats();
  return ok({ stats });
};
