/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok } from "../../_lib/http";
import { requireAdmin } from "../../_lib/admin";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(env, request);
  if (!gate.ok) return gate.response;
  const stats = await new Db(env.DB).stats();
  return ok({ stats });
};
