/// <reference types="@cloudflare/workers-types" />

/**
 * Password hashing and token utilities built on the Web Crypto API, which is
 * available in the Cloudflare Workers runtime. Passwords are hashed with
 * PBKDF2-HMAC-SHA-256; the plaintext is never stored or logged.
 */

const PBKDF2_ITERATIONS = 100_000;
const SALT_BYTES = 16;
const KEY_BYTES = 32;

const encoder = new TextEncoder();

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function pbkdf2(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    keyMaterial,
    KEY_BYTES * 8,
  );
  return new Uint8Array(bits);
}

/** Hash a password into a self-describing string: `pbkdf2$iter$salt$hash`. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const derived = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64(salt)}$${toBase64(derived)}`;
}

/** Constant-time comparison of two byte arrays. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Verify a plaintext password against a stored hash. */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number.parseInt(parts[1], 10);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;
  const salt = fromBase64(parts[2]);
  const expected = fromBase64(parts[3]);
  const actual = await pbkdf2(password, salt, iterations);
  return timingSafeEqual(actual, expected);
}

/** Generate a cryptographically strong, URL-safe opaque token. */
export function generateToken(bytes = 32): string {
  const raw = crypto.getRandomValues(new Uint8Array(bytes));
  return toBase64(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** SHA-256 hex digest of a string (used to store session ids, not secrets). */
export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** RFC-4122 v4 UUID via the runtime CSPRNG. */
export function uuid(): string {
  return crypto.randomUUID();
}

/** Constant-time string comparison (e.g. for CSRF tokens). */
export function safeEqualStrings(a: string, b: string): boolean {
  return timingSafeEqual(encoder.encode(a), encoder.encode(b));
}
