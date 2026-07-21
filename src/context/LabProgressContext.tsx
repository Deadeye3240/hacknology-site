import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LabStatus } from "@/types";

/**
 * Persisted progress state.
 *
 * Only non-default states are stored ("In Progress" / "Completed"); the absence
 * of a record implies "Not Started". Persistence currently uses localStorage,
 * but the provider intentionally exposes a small, storage-agnostic API so it can
 * later be backed by an authenticated server without changing consumers.
 */
type StoredStatus = Exclude<LabStatus, "Not Started">;
type ProgressMap = Record<string, StoredStatus>;

const STORAGE_KEY = "hacknology.lab-progress.v1";

interface LabProgressContextValue {
  /** Resolve the display status for a lab (defaults to "Not Started"). */
  getStatus: (labId: string) => LabStatus;
  /** Mark a lab as in progress (no-op if already completed). */
  startLab: (labId: string) => void;
  /** Mark a lab as completed. */
  completeLab: (labId: string) => void;
  /** Clear all stored progress for a lab. */
  resetLab: (labId: string) => void;
  /** Raw map of stored statuses, useful for computing aggregate progress. */
  statuses: ProgressMap;
}

const LabProgressContext = createContext<LabProgressContextValue | null>(null);

function readInitial(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as ProgressMap;
    }
  } catch {
    // Corrupt or unavailable storage — fall back to empty progress.
  }
  return {};
}

export function LabProgressProvider({ children }: { children: ReactNode }) {
  const [statuses, setStatuses] = useState<ProgressMap>(readInitial);

  // Persist on change.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
    } catch {
      // Ignore write failures (e.g. storage disabled) — progress is best-effort.
    }
  }, [statuses]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        setStatuses(readInitial());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const getStatus = useCallback(
    (labId: string): LabStatus => statuses[labId] ?? "Not Started",
    [statuses],
  );

  const startLab = useCallback((labId: string) => {
    setStatuses((prev) => {
      if (prev[labId]) return prev; // Preserve "Completed" / existing state.
      return { ...prev, [labId]: "In Progress" };
    });
  }, []);

  const completeLab = useCallback((labId: string) => {
    setStatuses((prev) => ({ ...prev, [labId]: "Completed" }));
  }, []);

  const resetLab = useCallback((labId: string) => {
    setStatuses((prev) => {
      if (!prev[labId]) return prev;
      const next = { ...prev };
      delete next[labId];
      return next;
    });
  }, []);

  const value = useMemo<LabProgressContextValue>(
    () => ({ getStatus, startLab, completeLab, resetLab, statuses }),
    [getStatus, startLab, completeLab, resetLab, statuses],
  );

  return (
    <LabProgressContext.Provider value={value}>
      {children}
    </LabProgressContext.Provider>
  );
}

/** Access the lab progress store. Must be used within `LabProgressProvider`. */
export function useLabProgress(): LabProgressContextValue {
  const ctx = useContext(LabProgressContext);
  if (!ctx) {
    throw new Error("useLabProgress must be used within a LabProgressProvider");
  }
  return ctx;
}
