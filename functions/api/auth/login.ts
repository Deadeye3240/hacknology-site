/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { toSelfUser } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { ok, badRequest, error, tooMany, readJson, asString } from "../../_lib/http";
import { verifyPassword } from "../../_lib/crypto";
import { createSession } from "../../_lib/session";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const db = new Db(env.DB);
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  if (!(await db.rateLimit(`login:${ip}`, 15, 900))) {
    return tooMany("Too many login attempts. Please wait a few minutes.");
  }

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");

  const login = asString((body as Record<string, unknown>).login);
  const password = asString((body as Record<string, unknown>).password);
  if (!login || !password) {
    return badRequest("Enter your username/email and password.");
  }

  const user = await db.getUserByLogin(login);
  // Always run a verification to keep timing consistent and avoid revealing
  // whether the account exists.
  const dummyHash =
    "pbkdf2$100000$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  const valid = await verifyPassword(password, user?.password_hash ?? dummyHash);

  if (!user || !valid) {
    return error(401, "Invalid username/email or password.");
  }
  if (user.disabled_at) {
    return error(403, "This account has been disabled. Contact an administrator.");
  }

  const session = await createSession(env, request, user);
  return ok(
    { user: toSelfUser(user), csrfToken: session.csrfSecret },
    { "Set-Cookie": session.cookie },
  );
};
