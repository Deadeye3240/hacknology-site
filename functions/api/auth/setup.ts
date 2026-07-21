/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { toSelfUser } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok, error, badRequest, tooMany, readJson, asString, serverError } from "../../_lib/http";
import { hashPassword, safeEqualStrings } from "../../_lib/crypto";
import { createSession } from "../../_lib/session";

/** GET: report whether initial admin setup is still required. */
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const db = new Db(env.DB);
  const admins = await db.countAdmins();
  return ok({ setupRequired: admins === 0 });
};

/**
 * POST: bootstrap the initial `admin` account. Permanently disabled once any
 * admin exists. The caller must supply the value of the ADMIN_INITIAL_PASSWORD
 * server secret to prove they control the deployment.
 */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const db = new Db(env.DB);
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  if (!(await db.rateLimit(`setup:${ip}`, 5, 900))) {
    return tooMany();
  }

  if ((await db.countAdmins()) > 0) {
    return error(403, "Setup has already been completed.");
  }

  const configured = env.ADMIN_INITIAL_PASSWORD ?? "";
  if (!configured || configured.length < 8) {
    return serverError(
      "ADMIN_INITIAL_PASSWORD is not configured on the server. See README.",
    );
  }

  const body = await readJson(request);
  const provided = asString((body as Record<string, unknown> | null)?.password);
  if (!provided) return badRequest("The initial admin password is required.");
  if (!safeEqualStrings(provided, configured)) {
    return error(401, "Incorrect initial admin password.");
  }

  try {
    const passwordHash = await hashPassword(configured);
    const admin = await db.createUser({
      username: "admin",
      email: "admin@hacknology.local",
      passwordHash,
      role: "admin",
      mustChangePassword: true,
    });
    await db.logAudit(admin.id, "admin.bootstrap", "user", admin.id, "Initial admin created");
    const session = await createSession(env, request, admin);
    return ok(
      { user: toSelfUser(admin), csrfToken: session.csrfSecret },
      { "Set-Cookie": session.cookie },
    );
  } catch {
    return serverError("Could not complete setup. Is the database migrated?");
  }
};
