import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { achievements } from "@/data/achievements";
import { beginnerLabCount, vulnerableLabs } from "@/data/vulnerableLabs";
import type { AchievementUnlock, ChallengeCompletion } from "@/types/gamification";

const STORAGE_KEY = "hacknology.vulnerable-lab.v1";

interface VulnerableLabState {
  completed: Record<string, ChallengeCompletion>;
  achievements: Record<string, AchievementUnlock>;
  totalXp: number;
}

interface VulnerableLabContextValue {
  isCompleted: (challengeId: string) => boolean;
  completeChallenge: (challengeId: string) => { xpEarned: number; newAchievements: string[] };
  resetChallenge: (challengeId: string) => void;
  completedIds: string[];
  totalXp: number;
  unlockedAchievements: AchievementUnlock[];
  hasAchievement: (id: string) => boolean;
}

const VulnerableLabContext = createContext<VulnerableLabContextValue | null>(null);

function readState(): VulnerableLabState {
  if (typeof window === "undefined") {
    return { completed: {}, achievements: {}, totalXp: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: {}, achievements: {}, totalXp: 0 };
    const parsed = JSON.parse(raw) as VulnerableLabState;
    return {
      completed: parsed.completed ?? {},
      achievements: parsed.achievements ?? {},
      totalXp: parsed.totalXp ?? 0,
    };
  } catch {
    return { completed: {}, achievements: {}, totalXp: 0 };
  }
}

function evaluateAchievements(
  completed: Record<string, ChallengeCompletion>,
  existing: Record<string, AchievementUnlock>,
): { unlocked: Record<string, AchievementUnlock>; bonusXp: number; newIds: string[] } {
  const unlocked = { ...existing };
  const newIds: string[] = [];
  let bonusXp = 0;
  const now = new Date().toISOString();
  const completedIds = Object.keys(completed);

  function grant(id: string) {
    if (unlocked[id]) return;
    const def = achievements.find((a) => a.id === id);
    if (!def) return;
    unlocked[id] = { achievementId: id, unlockedAt: now };
    bonusXp += def.xpBonus;
    newIds.push(id);
  }

  if (completedIds.length >= 1) grant("first-exploit");

  const webCategories = new Set([
    "Authentication",
    "Access Control",
    "XSS",
    "Injection",
    "Session",
    "Information Disclosure",
  ]);
  const webCompleted = completedIds.filter((id) => {
    const lab = vulnerableLabs.find((c) => c.id === id);
    return lab && webCategories.has(lab.category);
  });
  if (webCompleted.length >= 5) grant("web-hunter");

  const beginnerTotal = beginnerLabCount();
  const beginnerDone = completedIds.filter((id) => {
    const lab = vulnerableLabs.find((c) => c.id === id);
    return lab?.level === "Beginner";
  });
  if (beginnerDone.length >= beginnerTotal && beginnerTotal > 0) grant("bug-hunter");

  const hasAdvanced = completedIds.some((id) => {
    const lab = vulnerableLabs.find((c) => c.id === id);
    return lab?.level === "Advanced";
  });
  if (hasAdvanced) grant("security-researcher");

  return { unlocked, bonusXp, newIds };
}

export function VulnerableLabProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VulnerableLabState>(readState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const completeChallenge = useCallback((challengeId: string) => {
    const lab = vulnerableLabs.find((c) => c.id === challengeId);
    if (!lab) return { xpEarned: 0, newAchievements: [] };

    let result = { xpEarned: 0, newAchievements: [] as string[] };

    setState((prev) => {
      if (prev.completed[challengeId]) {
        result = { xpEarned: 0, newAchievements: [] };
        return prev;
      }

      const completed = {
        ...prev.completed,
        [challengeId]: { completedAt: new Date().toISOString() },
      };
      const { unlocked, bonusXp, newIds } = evaluateAchievements(completed, prev.achievements);
      const xpEarned = lab.xpReward + bonusXp;
      result = { xpEarned, newAchievements: newIds };

      return {
        completed,
        achievements: unlocked,
        totalXp: prev.totalXp + xpEarned,
      };
    });

    return result;
  }, []);

  const resetChallenge = useCallback((challengeId: string) => {
    setState((prev) => {
      if (!prev.completed[challengeId]) return prev;
      const lab = vulnerableLabs.find((c) => c.id === challengeId);
      const completed = { ...prev.completed };
      delete completed[challengeId];
      return {
        ...prev,
        completed,
        totalXp: Math.max(0, prev.totalXp - (lab?.xpReward ?? 0)),
      };
    });
  }, []);

  const isCompleted = useCallback(
    (challengeId: string) => Boolean(state.completed[challengeId]),
    [state.completed],
  );

  const value = useMemo<VulnerableLabContextValue>(
    () => ({
      isCompleted,
      completeChallenge,
      resetChallenge,
      completedIds: Object.keys(state.completed),
      totalXp: state.totalXp,
      unlockedAchievements: Object.values(state.achievements),
      hasAchievement: (id: string) => Boolean(state.achievements[id]),
    }),
    [isCompleted, completeChallenge, resetChallenge, state],
  );

  return (
    <VulnerableLabContext.Provider value={value}>{children}</VulnerableLabContext.Provider>
  );
}

export function useVulnerableLab(): VulnerableLabContextValue {
  const ctx = useContext(VulnerableLabContext);
  if (!ctx) throw new Error("useVulnerableLab must be used within VulnerableLabProvider");
  return ctx;
}
