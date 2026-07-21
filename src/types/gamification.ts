import type { Difficulty } from "@/types";

/** Category tags for vulnerable lab challenges. */
export type VulnLabCategory =
  | "Authentication"
  | "Access Control"
  | "XSS"
  | "Injection"
  | "Path Traversal"
  | "Session"
  | "Information Disclosure"
  | "Configuration";

/** Metadata for a sandboxed vulnerable lab challenge. */
export interface VulnerableLabChallenge {
  id: string;
  title: string;
  description: string;
  category: VulnLabCategory;
  level: Difficulty;
  xpReward: number;
  estimatedMinutes: number;
  scenario: string;
  objectives: string[];
  instructions: string[];
  hints: string[];
  /** Educational content shown after completion. */
  vulnerability: string;
  whyItMatters: string;
  prevention: string;
  /** Suggested next challenge id, if any. */
  nextChallengeId?: string;
}

/** Unlockable achievement tied to vulnerable lab progress. */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  xpBonus: number;
}

export interface AchievementUnlock {
  achievementId: string;
  unlockedAt: string;
}

export interface ChallengeCompletion {
  completedAt: string;
}
