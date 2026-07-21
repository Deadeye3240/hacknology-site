/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { CmsDb } from "../../_lib/cms-db";
import { ok } from "../../_lib/http";

/** GET /api/cms/settings — public site settings with static fallbacks applied client-side. */
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const settings = await new CmsDb(env.DB).getAllSettings();
  return ok({ settings });
};
