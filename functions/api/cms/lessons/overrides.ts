/// <reference types="@cloudflare/workers-types" />
import type { Env } from "../../../_lib/types";
import { CmsDb } from "../../../_lib/cms-db";
import { ok } from "../../../_lib/http";

/** GET /api/cms/lessons/overrides — published CMS lesson/path overrides for client merge. */
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const cms = new CmsDb(env.DB);
  const [paths, lessons, assessments] = await Promise.all([
    cms.listPaths("published"),
    cms.listLessons(undefined, "published"),
    cms.listAssessments("published"),
  ]);
  return ok({
    paths: paths.map((p) => ({
      pathId: p.path_id,
      title: p.title,
      description: p.description,
      level: p.level,
      skills: JSON.parse(p.skills || "[]"),
      estimatedHours: p.estimated_hours,
      orderIndex: p.order_index,
      prerequisitePathId: p.prerequisite_path_id,
      specialization: p.specialization,
      practiceLinks: JSON.parse(p.practice_links || "[]"),
    })),
    lessons: lessons.map((l) => ({
      lessonId: l.lesson_id,
      pathId: l.path_id,
      orderIndex: l.order_index,
      title: l.title,
      summary: l.summary,
      payload: JSON.parse(l.payload || "{}"),
    })),
    assessments: assessments.map((a) => ({
      pathId: a.path_id,
      title: a.title,
      passingScore: a.passing_score,
      xpReward: a.xp_reward,
      questions: JSON.parse(a.questions || "[]"),
    })),
  });
};
