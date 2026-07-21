/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok } from "../../_lib/http";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const categories = await new Db(env.DB).listCategories();
  return ok({ categories });
};
