import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { getLessonById, getLessonsByPath, getPathAssessment } from "@/data/lessons";
import { learningPathMeta } from "@/data/lessons/learningPathMeta";
import type { LessonProgressRecord, PathCompletionRecord } from "@/types/education";

const STORAGE_KEY = "hacknology.lesson-progress.v2";
const XP_PER_LESSON = 25;
const QUIZ_PASS_RATIO = 0.7;

interface LessonProgressState {
  lessons: Record<string, LessonProgressRecord>;
  paths: Record<string, PathCompletionRecord>;
  xp: number;
}

interface LessonProgressContextValue {
  isCompleted: (lessonId: string) => boolean;
  isLessonUnlocked: (pathId: string, lessonId: string) => boolean;
  isPathUnlocked: (pathId: string) => boolean;
  getQuizResult: (lessonId: string) => LessonProgressRecord | undefined;
  completeLessonWithQuiz: (lessonId: string, quizScore: number, quizTotal: number) => void;
  completePathAssessment: (pathId: string, score: number, total: number) => void;
  isPathCompleted: (pathId: string) => boolean;
  resetLesson: (lessonId: string) => void;
  completedIds: string[];
  totalXp: number;
  pathProgressPercent: (pathId: string) => number;
  recommendedNextLesson: (pathId: string) => string | undefined;
  allLessonsCompletedForPath: (pathId: string) => boolean;
  assessmentPendingForPath: (pathId: string) => boolean;
}

const LessonProgressContext = createContext<LessonProgressContextValue | null>(null);

function computeTotalXp(
  lessons: Record<string, LessonProgressRecord>,
  paths: Record<string, PathCompletionRecord>,
): number {
  let xp = 0;
  for (const rec of Object.values(lessons)) {
    if (rec.quizPassed) xp += XP_PER_LESSON;
  }
  for (const pathId of Object.keys(paths)) {
    const assessment = getPathAssessment(pathId);
    if (assessment) xp += assessment.xpReward;
  }
  return xp;
}

function readState(): LessonProgressState {
  if (typeof window === "undefined") {
    return { lessons: {}, paths: {}, xp: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LessonProgressState;
      const lessons = parsed.lessons ?? {};
      const paths = parsed.paths ?? {};
      return {
        lessons,
        paths,
        xp: parsed.xp ?? computeTotalXp(lessons, paths),
      };
    }
    const legacy = window.localStorage.getItem("hacknology.lesson-progress.v1");
    if (legacy) {
      const old = JSON.parse(legacy) as Record<string, boolean>;
      const lessons: Record<string, LessonProgressRecord> = {};
      for (const [id, done] of Object.entries(old)) {
        if (done) {
          lessons[id] = {
            completedAt: new Date().toISOString(),
            quizScore: 0,
            quizTotal: 0,
            quizPassed: true,
          };
        }
      }
      return { lessons, paths: {}, xp: computeTotalXp(lessons, {}) };
    }
  } catch {
    /* ignore */
  }
  return { lessons: {}, paths: {}, xp: 0 };
}

export function LessonProgressProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<LessonProgressState>(readState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.all([
      api.get<{ lessons: { lessonId: string; completed: boolean; completedAt?: string | null }[] }>(
        "/progress/lessons",
      ),
      api.get<{ paths: { pathId: string; assessmentScore: number | null; completedAt: string }[] }>(
        "/progress/paths",
      ),
    ])
      .then(([lessonsRes, pathsRes]) => {
        const lessonRows = Array.isArray(lessonsRes?.lessons) ? lessonsRes.lessons : [];
        const pathRows = Array.isArray(pathsRes?.paths) ? pathsRes.paths : [];
        if (lessonRows.length === 0 && pathRows.length === 0) return;

        setState((prev) => {
          const lessons = { ...prev.lessons };
          for (const row of lessonRows) {
            if (row.completed && !lessons[row.lessonId]?.quizPassed) {
              lessons[row.lessonId] = {
                completedAt: row.completedAt ?? new Date().toISOString(),
                quizScore: 0,
                quizTotal: 0,
                quizPassed: true,
              };
            }
          }

          const paths = { ...prev.paths };
          for (const row of pathRows) {
            if (!paths[row.pathId]) {
              paths[row.pathId] = {
                completedAt: row.completedAt,
                assessmentScore: row.assessmentScore ?? 0,
              };
            }
          }

          return {
            lessons,
            paths,
            xp: computeTotalXp(lessons, paths),
          };
        });
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const isCompleted = useCallback(
    (lessonId: string) => Boolean(state.lessons[lessonId]?.quizPassed),
    [state.lessons],
  );

  const isPathCompleted = useCallback(
    (pathId: string) => Boolean(state.paths[pathId]),
    [state.paths],
  );

  const isPathUnlocked = useCallback(
    (pathId: string) => {
      const meta = learningPathMeta.find((p) => p.id === pathId);
      if (!meta?.prerequisitePathId) return true;
      return Boolean(state.paths[meta.prerequisitePathId]);
    },
    [state.paths],
  );

  const isLessonUnlocked = useCallback(
    (pathId: string, lessonId: string) => {
      if (!isPathUnlocked(pathId)) return false;
      const pathLessons = getLessonsByPath(pathId);
      const index = pathLessons.findIndex((l) => l.id === lessonId);
      if (index <= 0) return true;
      for (let i = 0; i < index; i++) {
        if (!isCompleted(pathLessons[i].id)) return false;
      }
      return true;
    },
    [isPathUnlocked, isCompleted],
  );

  const allLessonsCompletedForPath = useCallback(
    (pathId: string) => {
      const pathLessons = getLessonsByPath(pathId);
      if (pathLessons.length === 0) return false;
      return pathLessons.every((l) => isCompleted(l.id));
    },
    [isCompleted],
  );

  const assessmentPendingForPath = useCallback(
    (pathId: string) => allLessonsCompletedForPath(pathId) && !isPathCompleted(pathId),
    [allLessonsCompletedForPath, isPathCompleted],
  );

  const completeLessonWithQuiz = useCallback(
    (lessonId: string, quizScore: number, quizTotal: number) => {
      const passed = quizTotal === 0 || quizScore / quizTotal >= QUIZ_PASS_RATIO;
      if (!passed) return;

      setState((prev) => {
        if (prev.lessons[lessonId]?.quizPassed) return prev;
        const lessons = {
          ...prev.lessons,
          [lessonId]: {
            completedAt: new Date().toISOString(),
            quizScore,
            quizTotal,
            quizPassed: true,
          },
        };
        if (isAuthenticated) {
          void api.post("/progress/lessons", { lessonId, completed: true }).catch(() => {});
        }
        return { ...prev, lessons, xp: computeTotalXp(lessons, prev.paths) };
      });
    },
    [isAuthenticated],
  );

  const completePathAssessment = useCallback(
    (pathId: string, score: number, _total: number) => {
      const assessment = getPathAssessment(pathId);
      if (!assessment) return;
      const passed = score >= assessment.passingScore;
      if (!passed) return;

      setState((prev) => {
        if (prev.paths[pathId]) return prev;
        const paths = {
          ...prev.paths,
          [pathId]: { completedAt: new Date().toISOString(), assessmentScore: score },
        };
        if (isAuthenticated) {
          void api
            .post("/progress/paths", { pathId, completed: true, assessmentScore: score })
            .catch(() => {});
        }
        return { ...prev, paths, xp: computeTotalXp(prev.lessons, paths) };
      });
    },
    [isAuthenticated],
  );

  const resetLesson = useCallback(
    (lessonId: string) => {
      const lesson = getLessonById(lessonId);
      if (!lesson) return;

      setState((prev) => {
        if (!prev.lessons[lessonId]) return prev;

        const pathLessons = getLessonsByPath(lesson.pathId);
        const index = pathLessons.findIndex((l) => l.id === lessonId);
        if (index < 0) return prev;

        const lessons = { ...prev.lessons };
        const toClear = pathLessons.slice(index);
        for (const l of toClear) {
          if (lessons[l.id]) {
            delete lessons[l.id];
            if (isAuthenticated) {
              void api.post("/progress/lessons", { lessonId: l.id, completed: false }).catch(() => {});
            }
          }
        }

        const paths = { ...prev.paths };
        if (paths[lesson.pathId]) {
          delete paths[lesson.pathId];
          if (isAuthenticated) {
            void api.post("/progress/paths", { pathId: lesson.pathId, completed: false }).catch(() => {});
          }
        }

        return { lessons, paths, xp: computeTotalXp(lessons, paths) };
      });
    },
    [isAuthenticated],
  );

  const pathProgressPercent = useCallback(
    (pathId: string) => {
      const pathLessons = getLessonsByPath(pathId);
      if (pathLessons.length === 0) return 0;
      const done = pathLessons.filter((l) => isCompleted(l.id)).length;
      return Math.round((done / pathLessons.length) * 100);
    },
    [isCompleted],
  );

  const recommendedNextLesson = useCallback(
    (pathId: string) => {
      const pathLessons = getLessonsByPath(pathId);
      const next = pathLessons.find((l) => !isCompleted(l.id) && isLessonUnlocked(pathId, l.id));
      return next?.id;
    },
    [isCompleted, isLessonUnlocked],
  );

  const value = useMemo<LessonProgressContextValue>(
    () => ({
      isCompleted,
      isLessonUnlocked,
      isPathUnlocked,
      getQuizResult: (id) => state.lessons[id],
      completeLessonWithQuiz,
      completePathAssessment,
      isPathCompleted,
      resetLesson,
      completedIds: Object.keys(state.lessons).filter((k) => state.lessons[k]?.quizPassed),
      totalXp: state.xp,
      pathProgressPercent,
      recommendedNextLesson,
      allLessonsCompletedForPath,
      assessmentPendingForPath,
    }),
    [
      isCompleted,
      isLessonUnlocked,
      isPathUnlocked,
      completeLessonWithQuiz,
      completePathAssessment,
      isPathCompleted,
      resetLesson,
      state,
      pathProgressPercent,
      recommendedNextLesson,
      allLessonsCompletedForPath,
      assessmentPendingForPath,
    ],
  );

  return (
    <LessonProgressContext.Provider value={value}>{children}</LessonProgressContext.Provider>
  );
}

export function useLessonProgress(): LessonProgressContextValue {
  const ctx = useContext(LessonProgressContext);
  if (!ctx) throw new Error("useLessonProgress must be used within LessonProgressProvider");
  return ctx;
}

/** @deprecated Use completeLessonWithQuiz after passing knowledge check */
export function useLegacyLessonComplete() {
  const { completeLessonWithQuiz } = useLessonProgress();
  return (lessonId: string) => completeLessonWithQuiz(lessonId, 1, 1);
}
