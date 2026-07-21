/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { toSelfUser } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok, badRequest, unauthorized, forbidden, readJson } from "../../_lib/http";
import { getAuth, verifyCsrf } from "../../_lib/auth";
import { normalizeLine, normalizeText } from "../../_lib/sanitize";
import { validateDisplayName, validateBio } from "../../_lib/validate";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!verifyCsrf(request, auth)) return forbidden("Invalid or missing CSRF token.");

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;

  const displayName = normalizeLine(b.displayName, 40);
  const bio = normalizeText(b.bio, { maxLength: 500, allowNewlines: true });
  const avatarRaw = normalizeLine(b.avatar, 300);
  const avatar = avatarRaw.length > 0 ? avatarRaw : null;
  const profilePublic = b.profilePublic !== false;

  const fields: Record<string, string> = {};
  const dErr = validateDisplayName(displayName);
  if (dErr) fields.displayName = dErr;
  const bErr = validateBio(bio);
  if (bErr) fields.bio = bErr;
  if (Object.keys(fields).length > 0) {
    return badRequest("Please correct the errors below.", fields);
  }

  // Note: role, id and permissions are intentionally NOT read from the body.
  const db = new Db(env.DB);
  await db.updateProfile(auth.user.id, { displayName, bio, avatar, profilePublic });
  const updated = await db.getUserById(auth.user.id);
  return ok({ user: updated ? toSelfUser(updated) : null });
};
