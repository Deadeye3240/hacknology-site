import { lessons } from "@/data/lessons";
import { learningPaths } from "@/data/learningPaths";
import { scanMeMissions } from "@/data/scanme";
import { vulnerableLabs } from "@/data/vulnerableLabs";
import { nerdGames } from "@/data/games";

/** Factual catalog counts — product scope, not social proof. */
export const platformStats = {
  lessonCount: lessons.length,
  pathCount: learningPaths.length,
  scanMeMissionCount: scanMeMissions.length,
  vulnerableLabCount: vulnerableLabs.length,
  gameCount: nerdGames.length,
} as const;
