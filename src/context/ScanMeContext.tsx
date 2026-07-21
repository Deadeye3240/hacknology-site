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
import { scanMeMissions, normalizeFlag } from "@/data/scanme";

const STORAGE_KEY = "hacknology.scanme.v1";

interface ScanMeState {
  submittedFlags: Record<string, string>;
  completedMissions: Record<string, string>;
  achievements: Record<string, string>;
  totalXp: number;
}

interface SubmitResult {
  success: boolean;
  message: string;
  xpEarned: number;
}

interface ScanMeContextValue {
  submitFlag: (missionId: string, flag: string) => SubmitResult;
  isMissionComplete: (missionId: string) => boolean;
  isFlagSubmitted: (missionId: string, flagId: string) => boolean;
  missionProgress: (missionId: string) => { found: number; total: number };
  totalXp: number;
  unlockedAchievements: string[];
}

const ScanMeContext = createContext<ScanMeContextValue | null>(null);

function readState(): ScanMeState {
  if (typeof window === "undefined") {
    return { submittedFlags: {}, completedMissions: {}, achievements: {}, totalXp: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ScanMeState;
  } catch {
    /* ignore */
  }
  return { submittedFlags: {}, completedMissions: {}, achievements: {}, totalXp: 0 };
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

  const missionCount = Object.keys(state.completedMissions).length;
  if (missionCount >= 1) grant("first-scan");
  if (state.completedMissions["recon-rookie"]) grant("recon-rookie");
  if (state.completedMissions["port-hunter"]) grant("port-hunter");
  if (state.completedMissions["service-detective"]) grant("service-detective");
  if (missionCount >= scanMeMissions.length) grant("network-recon");

  return { achievements, bonusXp };
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

  const submitFlag = useCallback((missionId: string, flag: string): SubmitResult => {
    const mission = scanMeMissions.find((m) => m.id === missionId);
    if (!mission) {
      return { success: false, message: "Mission not found.", xpEarned: 0 };
    }

    const normalized = normalizeFlag(flag);
    const match = mission.flags.find((f) => normalizeFlag(f.value) === normalized);
    if (!match) {
      return { success: false, message: "Incorrect flag. Keep investigating the target.", xpEarned: 0 };
    }

    const flagKey = `${missionId}:${match.id}`;
    let outcome: SubmitResult = { success: false, message: "", xpEarned: 0 };

    setState((prev) => {
      if (prev.submittedFlags[flagKey]) {
        outcome = { success: true, message: "Flag already submitted.", xpEarned: 0 };
        return prev;
      }

      const submittedFlags = { ...prev.submittedFlags, [flagKey]: new Date().toISOString() };
      const found = mission.flags.filter((f) => submittedFlags[`${missionId}:${f.id}`]).length;
      const completedMissions = { ...prev.completedMissions };
      let xpGain = match.xpReward;
      let message = `Correct! +${match.xpReward} XP`;

      if (found >= mission.flags.length && !completedMissions[missionId]) {
        completedMissions[missionId] = new Date().toISOString();
        xpGain += mission.xpReward;
        message = `Mission complete! +${xpGain} XP total`;
      }

      const interim: ScanMeState = {
        submittedFlags,
        completedMissions,
        achievements: prev.achievements,
        totalXp: prev.totalXp + xpGain,
      };
      const { achievements, bonusXp } = evaluateAchievements(interim);
      outcome = { success: true, message, xpEarned: xpGain + bonusXp };

      return {
        ...interim,
        achievements,
        totalXp: interim.totalXp + bonusXp,
      };
    });

    return outcome;
  }, []);

  const isMissionComplete = useCallback(
    (missionId: string) => Boolean(state.completedMissions[missionId]),
    [state.completedMissions],
  );

  const isFlagSubmitted = useCallback(
    (missionId: string, flagId: string) => Boolean(state.submittedFlags[`${missionId}:${flagId}`]),
    [state.submittedFlags],
  );

  const missionProgress = useCallback(
    (missionId: string) => {
      const mission = scanMeMissions.find((m) => m.id === missionId);
      if (!mission) return { found: 0, total: 0 };
      const found = mission.flags.filter((f) => state.submittedFlags[`${missionId}:${f.id}`]).length;
      return { found, total: mission.flags.length };
    },
    [state.submittedFlags],
  );

  const value = useMemo<ScanMeContextValue>(
    () => ({
      submitFlag,
      isMissionComplete,
      isFlagSubmitted,
      missionProgress,
      totalXp: state.totalXp,
      unlockedAchievements: Object.keys(state.achievements),
    }),
    [submitFlag, isMissionComplete, isFlagSubmitted, missionProgress, state],
  );

  return <ScanMeContext.Provider value={value}>{children}</ScanMeContext.Provider>;
}

export function useScanMe(): ScanMeContextValue {
  const ctx = useContext(ScanMeContext);
  if (!ctx) throw new Error("useScanMe must be used within ScanMeProvider");
  return ctx;
}
