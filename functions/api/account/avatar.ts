/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { toSelfUser } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok, badRequest, unauthorized, forbidden, readJson, asString } from "../../_lib/http";
import { getAuth, verifyCsrf } from "../../_lib/auth";

const MAX_AVATAR_LENGTH = 150_000;
const DATA_URL_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;

/** POST /api/account/avatar — upload or remove profile picture (data URL stored in D1). */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await getAuth(env, request);
  if (!auth) return unauthorized();
  if (!verifyCsrf(request, auth)) return forbidden("Invalid or missing CSRF token.");

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const imageData = asString((body as Record<string, unknown>).imageData);

  let avatar: string | null = null;
  if (imageData) {
    if (imageData.length > MAX_AVATAR_LENGTH) {
      return badRequest("Image is too large.");
    }
    if (!DATA_URL_RE.test(imageData)) {
      return badRequest("Invalid image format. Use JPEG, PNG, or WebP.");
    }
    avatar = imageData;
  }

  const db = new Db(env.DB);
  await db.updateProfile(auth.user.id, {
    displayName: auth.user.display_name,
    bio: auth.user.bio,
    avatar,
    profilePublic: auth.user.profile_public === 1,
  });
  const updated = await db.getUserById(auth.user.id);
  return ok({ user: updated ? toSelfUser(updated) : null });
};
