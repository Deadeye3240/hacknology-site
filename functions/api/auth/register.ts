/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { toSelfUser } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { created, badRequest, tooMany, readJson, asString, serverError } from "../../_lib/http";
import { hashPassword } from "../../_lib/crypto";
import { createSession } from "../../_lib/session";
import { normalizeLine } from "../../_lib/sanitize";
import {
  validateUsername,
  validateEmail,
  validatePassword,
} from "../../_lib/validate";
import { notifyNewUserSignup } from "../../_lib/discord";

export const onRequestPost: PagesFunction<Env> = async ({ request, env, context }) => {
  const db = new Db(env.DB);
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  if (!(await db.rateLimit(`register:${ip}`, 10, 3600))) {
    return tooMany("Too many sign-up attempts. Try again later.");
  }

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");

  const username = normalizeLine((body as Record<string, unknown>).username, 24);
  const email = asString((body as Record<string, unknown>).email).toLowerCase();
  const password = asString((body as Record<string, unknown>).password);
  const confirm = asString((body as Record<string, unknown>).confirmPassword);

  const fields: Record<string, string> = {};
  const uErr = validateUsername(username);
  if (uErr) fields.username = uErr;
  const eErr = validateEmail(email);
  if (eErr) fields.email = eErr;
  const pErr = validatePassword(password);
  if (pErr) fields.password = pErr;
  if (password && confirm !== password) {
    fields.confirmPassword = "Passwords do not match.";
  }
  if (Object.keys(fields).length > 0) {
    return badRequest("Please correct the errors below.", fields);
  }

  if (await db.isUsernameTaken(username)) {
    return badRequest("Please correct the errors below.", {
      username: "That username is already taken.",
    });
  }
  if (await db.isEmailTaken(email)) {
    return badRequest("Please correct the errors below.", {
      email: "An account with this email already exists.",
    });
  }

  try {
    const passwordHash = await hashPassword(password);
    const user = await db.createUser({ username, email, passwordHash });
    void notifyNewUserSignup(env, env.DB, context, {
      username: user.username,
      userId: user.id,
    });
    const session = await createSession(env, request, user);
    return created(
      { user: toSelfUser(user), csrfToken: session.csrfSecret },
      { "Set-Cookie": session.cookie },
    );
  } catch {
    return serverError("Could not create your account. Please try again.");
  }
};
