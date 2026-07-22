import { paths } from "@/routes/paths";

/** Route prefixes that must never be served as CMS dynamic pages. */
export const RESERVED_SLUGS = new Set([
  paths.home.slice(1) || "home",
  paths.lessons.slice(1),
  paths.labs.slice(1),
  paths.tools.slice(1),
  paths.scan.slice(1),
  paths.scanme.slice(1),
  paths.resources.slice(1),
  paths.about.slice(1),
  paths.legal.slice(1),
  paths.terms.slice(1),
  paths.privacy.slice(1),
  paths.acceptableUse.slice(1),
  paths.support.slice(1),
  paths.login.slice(1),
  paths.register.slice(1),
  paths.dashboard.slice(1),
  paths.profile.slice(1),
  paths.settings.slice(1),
  paths.forum.slice(1),
  paths.forumNew.slice(1),
  paths.games.slice(1),
  paths.vulnerableLab.slice(1),
  paths.admin.slice(1),
  "setup",
  "pages",
  "Game",
  "api",
]);

export function isReservedSlug(slug: string): boolean {
  if (!slug || slug.includes("/") || slug.includes(".")) return true;
  return RESERVED_SLUGS.has(slug) || RESERVED_SLUGS.has(slug.toLowerCase());
}
