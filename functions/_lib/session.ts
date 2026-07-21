/// <reference types="@cloudflare/workers-types" />
import type { Env, UserRow } from "./types";
import { Db } from "./db";
import { generateToken, sha256Hex } from "./crypto";

export const SESSION_COOKIE = "hk_session";

function ttlDays(env: Env): number {
  const parsed = Number.parseInt(env.SESSION_TTL_DAYS ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
}

/** Parse the Cookie header into a simple map. */
export function parseCookies(request: Request): Record<string, string> {
  const header = request.headers.get("Cookie") ?? "";
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (name) out[name] = decodeURIComponent(value);
  }
  return out;
}

function isSecure(request: Request): boolean {
  if (request.headers.get("x-forwarded-proto") === "https") return true;
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return false;
  }
}

function serialize(
  name: string,
  value: string,
  request: Request,
  maxAgeSeconds: number,
): string {
  const attrs = [
    `${name}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (isSecure(request)) attrs.push("Secure");
  return attrs.join("; ");
}

export interface CreatedSession {
  cookie: string;
  csrfSecret: string;
}

/**
 * Create a new session for a user. The raw token lives only in the HTTP-only
 * cookie; the database stores only its SHA-256, so leaking the DB does not
 * reveal usable session tokens.
 */
export async function createSession(
  env: Env,
  request: Request,
  user: UserRow,
): Promise<CreatedSession> {
  const db = new Db(env.DB);
  const token = generateToken(32);
  const sessionId = await sha256Hex(token);
  const csrfSecret = generateToken(24);
  const maxAge = ttlDays(env) * 24 * 60 * 60;
  const expiresAt = new Date(Date.now() + maxAge * 1000).toISOString();
  await db.createSession(
    user.id,
    sessionId,
    csrfSecret,
    expiresAt,
    request.headers.get("User-Agent"),
  );
  return { cookie: serialize(SESSION_COOKIE, token, request, maxAge), csrfSecret };
}

/** Resolve the current session id (hashed cookie token) if present and valid. */
export async function resolveSession(env: Env, request: Request) {
  const cookies = parseCookies(request);
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;
  const db = new Db(env.DB);
  const sessionId = await sha256Hex(token);
  const session = await db.getSession(sessionId);
  if (!session) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) {
    await db.deleteSession(sessionId);
    return null;
  }
  return session;
}

export async function destroySession(env: Env, request: Request): Promise<string> {
  const session = await resolveSession(env, request);
  if (session) {
    await new Db(env.DB).deleteSession(session.id);
  }
  // Expire the cookie regardless.
  return serialize(SESSION_COOKIE, "", request, 0);
}
