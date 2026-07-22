/**
 * Central site configuration.
 *
 * Keep global, presentational constants here so branding and metadata can be
 * updated in one place rather than being duplicated across components.
 */
export const site = {
  name: "HACKNOLOGY",
  nameFormatted: "Hacknology",
  domain: "hacknology.xyz",
  url: "https://hacknology.xyz",
  tagline: "Learn. Test. Defend.",
  description:
    "Hacknology is a cybersecurity education platform built to help students understand security concepts, practice in controlled environments, and develop responsible defensive security skills.",
  discordInviteUrl: "https://discord.gg/R6JQy9b9ey",
  discordInviteCode: "R6JQy9b9ey",
  githubUrl: "https://github.com/Deadeye3240",
  year: 2026,
} as const;

export type Site = typeof site;
