/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { CmsDb } from "../../_lib/cms-db";
import { ok } from "../../_lib/http";

/** GET /api/cms/navigation — public navigation (empty array if not configured). */
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const cms = new CmsDb(env.DB);
  const [groups, items] = await Promise.all([cms.listNavGroups(), cms.listNavItems()]);
  if (groups.length === 0) return ok({ navigation: null });
  const navigation = groups.map((g) => ({
    label: g.label,
    items: items
      .filter((i) => i.group_id === g.id)
      .sort((a, b) => a.position - b.position)
      .map((i) => ({ label: i.label, to: i.url })),
  }));
  return ok({ navigation });
};
