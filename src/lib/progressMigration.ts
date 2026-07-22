import { api } from "@/lib/api";

/**
 * Bridges localStorage progress into an authenticated account (labs, lessons, paths).
 */

const LAB_STORAGE_KEY = "hacknology.lab-progress.v1";
const LESSON_STORAGE_KEY = "hacknology.lesson-progress.v2";

type LocalStatus = "In Progress" | "Completed";

interface LabMigrationItem {
  labId: string;
  status: "in_progress" | "completed";
}

interface LessonMigrationItem {
  lessonId: string;
  completed: boolean;
}

interface PathMigrationItem {
  pathId: string;
  completed: boolean;
  assessmentScore?: number;
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

/** Read local lesson completions for server migration. */
export function readLocalLessonProgress(): LessonMigrationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LESSON_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as {
      lessons?: Record<string, { quizPassed?: boolean }>;
    };
    return Object.entries(parsed.lessons ?? {})
      .filter(([, rec]) => rec.quizPassed)
      .map(([lessonId]) => ({ lessonId, completed: true }));
  } catch {
    return [];
  }
}

/** Read local path certifications for server migration. */
export function readLocalPathProgress(): PathMigrationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LESSON_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as {
      paths?: Record<string, { assessmentScore?: number }>;
    };
    return Object.entries(parsed.paths ?? {}).map(([pathId, rec]) => ({
      pathId,
      completed: true,
      assessmentScore: rec.assessmentScore,
    }));
  } catch {
    return [];
  }
}

export function localLabProgressCount(): number {
  return readLocalLabProgress().length;
}

export function localLessonProgressCount(): number {
  return readLocalLessonProgress().length;
}

export function localPathProgressCount(): number {
  return readLocalPathProgress().length;
}

/** Push local lab progress to the authenticated account. */
export async function migrateLabProgress(): Promise<number> {
  const migrate = readLocalLabProgress();
  if (migrate.length === 0) return 0;
  const res = await api.post<{ migrated: number }>("/progress/labs", { migrate });
  return res.migrated;
}

/** Push local lesson progress to the authenticated account. */
export async function migrateLessonProgress(): Promise<number> {
  const migrate = readLocalLessonProgress();
  if (migrate.length === 0) return 0;
  const res = await api.post<{ migrated: number }>("/progress/lessons", { migrate });
  return res.migrated;
}

/** Push local path certifications to the authenticated account. */
export async function migratePathProgress(): Promise<number> {
  const migrate = readLocalPathProgress();
  if (migrate.length === 0) return 0;
  const res = await api.post<{ migrated: number }>("/progress/paths", { migrate });
  return res.migrated;
}

/** Push all local learning progress (lessons + paths) to the server. */
export async function migrateAllLessonProgress(): Promise<{ lessons: number; paths: number }> {
  const [lessons, paths] = await Promise.all([migrateLessonProgress(), migratePathProgress()]);
  return { lessons, paths };
}
