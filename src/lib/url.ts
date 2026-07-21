/** Helpers for classifying and describing link destinations. */

/**
 * True when `href` points to a different-origin http(s) website (i.e. leaving
 * Hacknology). Internal routes, anchors, and non-web schemes (mailto:, tel:)
 * are treated as internal and do not trigger a warning.
 */
export function isExternalHref(href: string): boolean {
  if (!href) return false;
  if (href.startsWith("#") || href.startsWith("/")) return false;

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://hacknology.xyz";

  let url: URL;
  try {
    url = new URL(href, origin);
  } catch {
    return false;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  return url.origin !== origin;
}

/** Best-effort hostname extraction for display in the warning dialog. */
export function hostnameOf(href: string): string {
  try {
    return new URL(href).hostname;
  } catch {
    return href;
  }
}
