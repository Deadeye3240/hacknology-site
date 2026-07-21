/// <reference types="@cloudflare/workers-types" />
import type { Env, Role } from "../../../_lib/types";
import { Db } from "../../../_lib/db";
import { ok, badRequest, unauthorized, forbidden, notFound, readJson, asString } from "../../../_lib/http";
import { getAuth, verifyCsrf, roleAtLeast } from "../../../_lib/auth";

const ROLES: Role[] = ["user", "moderator", "admin"];

/**
 * PATCH /api/admin/users/:id — change a user's role and/or account status.
 * Admin only. Includes guards against an admin locking themselves out or
 * removing the last remaining admin.
 */
export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!roleAtLeast(auth.user.role, "admin")) return forbidden();
  if (!verifyCsrf(request, auth)) return forbidden("Invalid or missing CSRF token.");

  const db = new Db(env.DB);
  const targetId = String(params.id);
  const target = await db.getUserById(targetId);
  if (!target) return notFound("User not found.");

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;

  const isSelf = target.id === auth.user.id;

  // ---- Role change -------------------------------------------------------
  if (typeof b.role !== "undefined") {
    const role = asString(b.role) as Role;
    if (!ROLES.includes(role)) return badRequest("Invalid role.");
    if (isSelf && role !== "admin") {
      return badRequest("You cannot remove your own admin role.");
    }
    if (target.role === "admin" && role !== "admin" && (await db.countAdmins()) <= 1) {
      return badRequest("Cannot demote the last remaining admin.");
    }
    if (role !== target.role) {
      await db.setRole(target.id, role);
      await db.logAudit(auth.user.id, "user.set_role", "user", target.id, `-> ${role}`);
    }
  }

  // ---- Enable / disable --------------------------------------------------
  if (typeof b.disabled !== "undefined") {
    const disabled = b.disabled === true;
    if (isSelf && disabled) return badRequest("You cannot disable your own account.");
    if (disabled && target.role === "admin" && (await db.countAdmins()) <= 1) {
      return badRequest("Cannot disable the last remaining admin.");
    }
    await db.setDisabled(target.id, disabled);
    if (disabled) await db.deleteSessionsForUser(target.id);
    await db.logAudit(
      auth.user.id,
      disabled ? "user.disable" : "user.enable",
      "user",
      target.id,
      null,
    );
  }

  const updated = await db.getUserById(target.id);
  return ok({
    user: updated
      ? {
          id: updated.id,
          username: updated.username,
          email: updated.email,
          displayName: updated.display_name,
          role: updated.role,
          disabled: updated.disabled_at !== null,
          createdAt: updated.created_at,
        }
      : null,
  });
};
