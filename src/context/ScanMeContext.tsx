import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { scanMeAchievements } from "@/data/scanmeAchievements";
import { scanMeMissions } from "@/data/scanme";

const STORAGE_KEY = "hacknology.scanme.v2";

interface MissionRecord {
  completedAt: string;
  xpEarned: number;
  hintsUsed: number;
}

interface ScanMeState {
  completedMissions: Record<string, MissionRecord>;
  achievements: Record<string, string>;
  totalXp: number;
}

export interface CompleteMissionResult {
  success: boolean;
  message: string;
  xpEarned: number;
  newAchievements: string[];
  alreadyComplete: boolean;
}

interface ScanMeContextValue {
  completeMission: (missionId: string, hintsUsed: number) => CompleteMissionResult;
  isMissionComplete: (missionId: string) => boolean;
  isMissionUnlocked: (missionId: string) => boolean;
  missionRecord: (missionId: string) => MissionRecord | undefined;
  totalXp: number;
  unlockedAchievements: string[];
  completedCount: number;
  resetProgress: () => void;
}

const ScanMeContext = createContext<ScanMeContextValue | null>(null);

function emptyState(): ScanMeState {
  return { completedMissions: {}, achievements: {}, totalXp: 0 };
}

function readState(): ScanMeState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ScanMeState;
  } catch {
    /* ignore */
  }
  return emptyState();
}

function evaluateAchievements(state: ScanMeState): { achievements: Record<string, string>; bonusXp: number } {
  const achievements = { ...state.achievements };
  let bonusXp = 0;
  const now = new Date().toISOString();

  function grant(id: string) {
    if (achievements[id]) return;
    const def = scanMeAchievements.find((a) => a.id === id);
    if (!def) return;
    achievements[id] = now;
    bonusXp += def.xpBonus;
  }

  const completedIds = new Set(Object.keys(state.completedMissions));

  for (const mission of scanMeMissions) {
    if (mission.achievementId && completedIds.has(mission.id)) {
      grant(mission.achievementId);
    }
  }
  if (completedIds.size >= scanMeMissions.length) grant("scanme-master");

  return { achievements, bonusXp };
}

function calcXp(missionId: string, hintsUsed: number): number {
  const mission = scanMeMissions.find((m) => m.id === missionId);
  if (!mission) return 0;
  const freeHints = 1;
  const penalized = Math.max(0, hintsUsed - freeHints);
  const penalty = penalized * mission.hintPenalty;
  return Math.max(10, mission.xpReward - penalty);
}

export function ScanMeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ScanMeState>(readState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const isMissionComplete = useCallback(
    (missionId: string) => Boolean(state.completedMissions[missionId]),
    [state.completedMissions],
  );

  const isMissionUnlocked = useCallback(
    (missionId: string) => {
      const idx = scanMeMissions.findIndex((m) => m.id === missionId);
      if (idx <= 0) return true;
      const prev = scanMeMissions[idx - 1];
      return Boolean(state.completedMissions[prev.id]);
    },
    [state.completedMissions],
  );

  const completeMission = useCallback((missionId: string, hintsUsed: number): CompleteMissionResult => {
    const mission = scanMeMissions.find((m) => m.id === missionId);
    if (!mission) {
      return { success: false, message: "Mission not found.", xpEarned: 0, newAchievements: [], alreadyComplete: false };
    }

    let outcome: CompleteMissionResult = {
      success: false,
      message: "",
      xpEarned: 0,
      newAchievements: [],
      alreadyComplete: false,
    };

    setState((prev) => {
      if (prev.completedMissions[missionId]) {
        outcome = {
          success: true,
          message: "Mission already complete.",
          xpEarned: 0,
          newAchievements: [],
          alreadyComplete: true,
        };
        return prev;
      }

      const xpEarned = calcXp(missionId, hintsUsed);
      const completedMissions = {
        ...prev.completedMissions,
        [missionId]: {
          completedAt: new Date().toISOString(),
          xpEarned,
          hintsUsed,
        },
      };

      const prevAchievements = Object.keys(prev.achievements);
      const interim: ScanMeState = {
        completedMissions,
        achievements: prev.achievements,
        totalXp: prev.totalXp + xpEarned,
      };
      const { achievements, bonusXp } = evaluateAchievements(interim);
      const newAchievements = Object.keys(achievements).filter((id) => !prevAchievements.includes(id));

      outcome = {
        success: true,
        message: `Mission complete! +${xpEarned + bonusXp} XP`,
        xpEarned: xpEarned + bonusXp,
        newAchievements,
        alreadyComplete: false,
      };

      return {
        completedMissions,
        achievements,
        totalXp: interim.totalXp + bonusXp,
      };
    });

    return outcome;
  }, []);

  const missionRecord = useCallback(
    (missionId: string) => state.completedMissions[missionId],
    [state.completedMissions],
  );

  const resetProgress = useCallback(() => {
    setState(emptyState());
  }, []);

  const value = useMemo<ScanMeContextValue>(
    () => ({
      completeMission,
      isMissionComplete,
      isMissionUnlocked,
      missionRecord,
      totalXp: state.totalXp,
      unlockedAchievements: Object.keys(state.achievements),
      completedCount: Object.keys(state.completedMissions).length,
      resetProgress,
    }),
    [completeMission, isMissionComplete, isMissionUnlocked, missionRecord, state, resetProgress],
  );

  return <ScanMeContext.Provider value={value}>{children}</ScanMeContext.Provider>;
}

export function useScanMe(): ScanMeContextValue {
  const ctx = useContext(ScanMeContext);
  if (!ctx) throw new Error("useScanMe must be used within ScanMeProvider");
  return ctx;
}
