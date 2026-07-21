/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { toSelfUser } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok, badRequest, unauthorized, forbidden, readJson, asString } from "../../_lib/http";
import { getAuth, verifyCsrf } from "../../_lib/auth";
import { hashPassword, verifyPassword } from "../../_lib/crypto";
import { createSession } from "../../_lib/session";
import { validatePassword } from "../../_lib/validate";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!verifyCsrf(request, auth)) return forbidden("Invalid or missing CSRF token.");

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;

  const current = asString(b.currentPassword);
  const next = asString(b.newPassword);
  const confirm = asString(b.confirmPassword);

  if (!(await verifyPassword(current, auth.user.password_hash))) {
    return badRequest("Please correct the errors below.", {
      currentPassword: "Your current password is incorrect.",
    });
  }

  const fields: Record<string, string> = {};
  const pErr = validatePassword(next);
  if (pErr) fields.newPassword = pErr;
  if (next !== confirm) fields.confirmPassword = "Passwords do not match.";
  if (next === current) {
    fields.newPassword = "New password must be different from the current one.";
  }
  if (Object.keys(fields).length > 0) {
    return badRequest("Please correct the errors below.", fields);
  }

  const db = new Db(env.DB);
  const hash = await hashPassword(next);
  await db.updatePassword(auth.user.id, hash, false);

  // Rotate sessions: invalidate all existing sessions, then start a fresh one
  // for this device so the user stays logged in but other devices are ejected.
  await db.deleteSessionsForUser(auth.user.id);
  const updated = await db.getUserById(auth.user.id);
  const session = await createSession(env, request, updated!);
  return ok(
    { user: updated ? toSelfUser(updated) : null, csrfToken: session.csrfSecret },
    { "Set-Cookie": session.cookie },
  );
};
