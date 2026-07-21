/**
 * Normalise untrusted text before storage.
 *
 * User-generated content is stored and later rendered strictly as plain text
 * (React escapes it; we never use dangerouslySetInnerHTML). This function only
 * removes dangerous control characters and normalises whitespace/length — it is
 * defence-in-depth, not the sole XSS protection.
 */
export function normalizeText(
  input: unknown,
  options: { maxLength: number; allowNewlines?: boolean } = { maxLength: 10_000 },
): string {
  if (typeof input !== "string") return "";
  let value = input.replace(/\r\n/g, "\n");

  // Strip control characters. Keep newline (\n) and tab (\t) when allowed.
  if (options.allowNewlines) {
    value = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  } else {
    value = value.replace(/[\u0000-\u001F\u007F]/g, " ");
  }

  // Collapse excessive blank lines and trim.
  value = value.replace(/\n{4,}/g, "\n\n\n").trim();

  if (value.length > options.maxLength) {
    value = value.slice(0, options.maxLength);
  }
  return value;
}

/** Normalise a single-line field (usernames, titles, display names). */
export function normalizeLine(input: unknown, maxLength: number): string {
  return normalizeText(input, { maxLength, allowNewlines: false });
}
