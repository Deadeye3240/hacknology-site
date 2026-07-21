import { api } from "@/lib/api";

/**
 * Bridges the existing localStorage lab progress into an authenticated account.
 *
 * Logged-out visitors keep using localStorage (see LabProgressContext). Once a
 * user signs in they can push that local progress to the server without losing
 * it — the local copy is left intact as a fallback.
 */

const LAB_STORAGE_KEY = "hacknology.lab-progress.v1";

type LocalStatus = "In Progress" | "Completed";

interface LabMigrationItem {
  labId: string;
  status: "in_progress" | "completed";
}

/** Read local lab progress as server-ready migration items. */
export function readLocalLabProgress(): LabMigrationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LAB_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, LocalStatus>;
    return Object.entries(parsed)
      .map(([labId, status]) => ({
        labId,
        status: status === "Completed" ? ("completed" as const) : ("in_progress" as const),
      }))
      .filter((item) => item.labId);
  } catch {
    return [];
  }
}

/** Count of locally stored lab progress records available to migrate. */
export function localLabProgressCount(): number {
  return readLocalLabProgress().length;
}

/** Push local lab progress to the authenticated account. Returns count synced. */
export async function migrateLabProgress(): Promise<number> {
  const migrate = readLocalLabProgress();
  if (migrate.length === 0) return 0;
  const res = await api.post<{ migrated: number }>("/progress/labs", { migrate });
  return res.migrated;
}
