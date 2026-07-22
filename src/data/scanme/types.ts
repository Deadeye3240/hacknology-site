import type { MissionCommandRules } from "@/lib/nmapCommand";

export interface ScanMeHint {
  label: string;
  text: string;
}

export interface ScanMeLevel {
  id: string;
  order: number;
  title: string;
  description: string;
}

export interface ScanMeMission {
  id: string;
  levelId: string;
  order: number;
  code: string;
  title: string;
  objective: string;
  targetIp: string;
  xpReward: number;
  /** XP deducted per hint after the first free hint */
  hintPenalty: number;
  hints: ScanMeHint[];
  commandRules: MissionCommandRules;
  simulatedOutput: string;
  /** Shown when scan succeeds but rules fail (e.g. basic scan on -sV mission) */
  partialOutput?: string;
  learnSummary: string;
  achievementId?: string;
  estimatedMinutes: number;
}
