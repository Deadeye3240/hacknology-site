/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { CmsDb } from "../../_lib/cms-db";
import { ok, badRequest, readJson } from "../../_lib/http";
import { requireAdmin, requireAdminMutation } from "../../_lib/admin";
import { normalizeLine } from "../../_lib/sanitize";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdmin(env, request);
  if (!gate.ok) return gate.response;
  const cms = new CmsDb(env.DB);
  const [groups, items] = await Promise.all([cms.listNavGroups(), cms.listNavItems()]);
  const nav = groups.map((g) => ({
    id: g.id,
    label: g.label,
    position: g.position,
    items: items
      .filter((i) => i.group_id === g.id)
      .map((i) => ({ id: i.id, label: i.label, url: i.url, position: i.position })),
  }));
  return ok({ navigation: nav });
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  const gate = await requireAdminMutation(env, request);
  if (!gate.ok) return gate.response;
  const body = await readJson(request);
  if (!body || !Array.isArray((body as { groups?: unknown }).groups)) {
    return badRequest("Invalid navigation payload.");
  }
  const groups = (body as { groups: unknown[] }).groups.map((g, gi) => {
    const group = g as Record<string, unknown>;
    const items = Array.isArray(group.items) ? group.items : [];
    return {
      label: normalizeLine(group.label, 60) || `Group ${gi + 1}`,
      position: typeof group.position === "number" ? group.position : gi,
      items: items.map((item, ii) => {
        const it = item as Record<string, unknown>;
        return {
          label: normalizeLine(it.label, 60) || "Link",
          url: normalizeLine(it.url, 200) || "/",
          position: typeof it.position === "number" ? it.position : ii,
        };
      }),
    };
  });
  await new CmsDb(env.DB).replaceNavigation(groups);
  await new Db(env.DB).logAudit(gate.auth.user.id, "cms.navigation.update", "navigation", null, null);
  return ok({ saved: true });
};
