/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../_lib/types";
import { Db } from "../../_lib/db";
import { created, badRequest, tooMany, readJson, asString } from "../../_lib/http";
import { getAuth } from "../../_lib/auth";
import { normalizeText } from "../../_lib/sanitize";
import {
  validateEmail,
  validateSupportMessage,
  validateSupportName,
  validateSubject,
} from "../../_lib/validate";
import { notifySupportRequest } from "../../_lib/discord";

function clientIp(request: Request): string {
  return request.headers.get("CF-Connecting-IP") ?? "unknown";
}

/** POST /api/support/messages — contact form (public, rate-limited). */
export const onRequestPost: PagesFunction<Env> = async ({ request, env, context }) => {
  const db = new Db(env.DB);
  const ip = clientIp(request);
  if (!(await db.rateLimit(`support:${ip}`, 5, 3600))) {
    return tooMany();
  }

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");
  const b = body as Record<string, unknown>;

  const name = normalizeText(b.name, { maxLength: 80 });
  const email = asString(b.email).trim().slice(0, 254);
  const subject = normalizeText(b.subject, { maxLength: 140 });
  const message = normalizeText(b.message, { maxLength: 5000, allowNewlines: true });

  const fields: Record<string, string> = {};
  const nameErr = validateSupportName(name);
  if (nameErr) fields.name = nameErr;
  const emailErr = validateEmail(email);
  if (emailErr) fields.email = emailErr;
  const subjectErr = validateSubject(subject);
  if (subjectErr) fields.subject = subjectErr;
  const messageErr = validateSupportMessage(message);
  if (messageErr) fields.message = messageErr;
  if (Object.keys(fields).length > 0) {
    return badRequest("Please correct the errors below.", fields);
  }

  const auth = await getAuth(env, request);
  const id = await db.createSupportMessage({
    userId: auth?.user.id ?? null,
    name,
    email,
    subject,
    message,
  });

  void notifySupportRequest(env, env.DB, context, {
    id,
    name,
    email,
    subject,
    messagePreview: message.slice(0, 400),
  });

  return created({ ok: true, id });
};
