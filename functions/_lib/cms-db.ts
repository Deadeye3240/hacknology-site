/// <reference types="@cloudflare/workers-types" />
import { uuid } from "./crypto";

export type CmsStatus = "draft" | "published";

export interface CmsPageRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  seo_title: string | null;
  seo_description: string | null;
  content: string;
  status: CmsStatus;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CmsPathRow {
  id: string;
  path_id: string;
  title: string;
  description: string;
  level: string;
  skills: string;
  estimated_hours: number;
  order_index: number;
  prerequisite_path_id: string | null;
  specialization: string | null;
  practice_links: string;
  status: CmsStatus;
  created_at: string;
  updated_at: string;
}

export interface CmsLessonRow {
  id: string;
  lesson_id: string;
  path_id: string;
  order_index: number;
  title: string;
  summary: string;
  payload: string;
  status: CmsStatus;
  created_at: string;
  updated_at: string;
}

export interface CmsAssessmentRow {
  id: string;
  path_id: string;
  title: string;
  passing_score: number;
  xp_reward: number;
  questions: string;
  status: CmsStatus;
  created_at: string;
  updated_at: string;
}

export interface CmsResourceRow {
  id: string;
  name: string;
  description: string;
  category: string;
  visibility: "public" | "hidden";
  file_key: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  thumbnail_key: string | null;
  website: string | null;
  resource_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface CmsMediaRow {
  id: string;
  file_key: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  alt_text: string;
  uploaded_by: string | null;
  created_at: string;
}

export interface NavGroupRow {
  id: string;
  label: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface NavItemRow {
  id: string;
  group_id: string;
  label: string;
  url: string;
  position: number;
  created_at: string;
  updated_at: string;
}

/** CMS data access over D1. */
export class CmsDb {
  constructor(private readonly d1: D1Database) {}

  private now(): string {
    return new Date().toISOString();
  }

  // ---- Pages -------------------------------------------------------------
  async listPages(status?: CmsStatus): Promise<CmsPageRow[]> {
    let sql = "SELECT * FROM cms_pages";
    const binds: unknown[] = [];
    if (status) {
      sql += " WHERE status = ?";
      binds.push(status);
    }
    sql += " ORDER BY updated_at DESC";
    const res = await this.d1.prepare(sql).bind(...binds).all<CmsPageRow>();
    return res.results ?? [];
  }

  async getPageById(id: string): Promise<CmsPageRow | null> {
    return this.d1.prepare("SELECT * FROM cms_pages WHERE id = ?").bind(id).first<CmsPageRow>();
  }

  async getPageBySlug(slug: string): Promise<CmsPageRow | null> {
    return this.d1
      .prepare("SELECT * FROM cms_pages WHERE slug = ?")
      .bind(slug)
      .first<CmsPageRow>();
  }

  async createPage(input: {
    slug: string;
    title: string;
    description: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    content: string;
    status: CmsStatus;
    authorId: string | null;
  }): Promise<string> {
    const id = uuid();
    const now = this.now();
    await this.d1
      .prepare(
        `INSERT INTO cms_pages
          (id, slug, title, description, seo_title, seo_description, content, status, author_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        input.slug,
        input.title,
        input.description,
        input.seoTitle ?? null,
        input.seoDescription ?? null,
        input.content,
        input.status,
        input.authorId,
        now,
        now,
      )
      .run();
    return id;
  }

  async updatePage(
    id: string,
    fields: Partial<{
      slug: string;
      title: string;
      description: string;
      seoTitle: string | null;
      seoDescription: string | null;
      content: string;
      status: CmsStatus;
    }>,
  ): Promise<void> {
    const existing = await this.getPageById(id);
    if (!existing) return;
    await this.d1
      .prepare(
        `UPDATE cms_pages SET
          slug = ?, title = ?, description = ?, seo_title = ?, seo_description = ?,
          content = ?, status = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(
        fields.slug ?? existing.slug,
        fields.title ?? existing.title,
        fields.description ?? existing.description,
        fields.seoTitle !== undefined ? fields.seoTitle : existing.seo_title,
        fields.seoDescription !== undefined ? fields.seoDescription : existing.seo_description,
        fields.content ?? existing.content,
        fields.status ?? existing.status,
        this.now(),
        id,
      )
      .run();
  }

  async deletePage(id: string): Promise<void> {
    await this.d1.prepare("DELETE FROM cms_pages WHERE id = ?").bind(id).run();
  }

  // ---- Learning paths ----------------------------------------------------
  async listPaths(status?: CmsStatus): Promise<CmsPathRow[]> {
    let sql = "SELECT * FROM cms_learning_paths";
    const binds: unknown[] = [];
    if (status) {
      sql += " WHERE status = ?";
      binds.push(status);
    }
    sql += " ORDER BY order_index ASC, title ASC";
    const res = await this.d1.prepare(sql).bind(...binds).all<CmsPathRow>();
    return res.results ?? [];
  }

  async getPathById(id: string): Promise<CmsPathRow | null> {
    return this.d1
      .prepare("SELECT * FROM cms_learning_paths WHERE id = ?")
      .bind(id)
      .first<CmsPathRow>();
  }

  async getPathByPathId(pathId: string): Promise<CmsPathRow | null> {
    return this.d1
      .prepare("SELECT * FROM cms_learning_paths WHERE path_id = ?")
      .bind(pathId)
      .first<CmsPathRow>();
  }

  async upsertPath(input: {
    pathId: string;
    title: string;
    description: string;
    level: string;
    skills: string;
    estimatedHours: number;
    orderIndex: number;
    prerequisitePathId?: string | null;
    specialization?: string | null;
    practiceLinks: string;
    status: CmsStatus;
  }): Promise<string> {
    const existing = await this.getPathByPathId(input.pathId);
    const now = this.now();
    if (existing) {
      await this.d1
        .prepare(
          `UPDATE cms_learning_paths SET
            title = ?, description = ?, level = ?, skills = ?, estimated_hours = ?,
            order_index = ?, prerequisite_path_id = ?, specialization = ?,
            practice_links = ?, status = ?, updated_at = ?
           WHERE path_id = ?`,
        )
        .bind(
          input.title,
          input.description,
          input.level,
          input.skills,
          input.estimatedHours,
          input.orderIndex,
          input.prerequisitePathId ?? null,
          input.specialization ?? null,
          input.practiceLinks,
          input.status,
          now,
          input.pathId,
        )
        .run();
      return existing.id;
    }
    const id = uuid();
    await this.d1
      .prepare(
        `INSERT INTO cms_learning_paths
          (id, path_id, title, description, level, skills, estimated_hours, order_index,
           prerequisite_path_id, specialization, practice_links, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        input.pathId,
        input.title,
        input.description,
        input.level,
        input.skills,
        input.estimatedHours,
        input.orderIndex,
        input.prerequisitePathId ?? null,
        input.specialization ?? null,
        input.practiceLinks,
        input.status,
        now,
        now,
      )
      .run();
    return id;
  }

  async deletePath(id: string): Promise<void> {
    await this.d1.prepare("DELETE FROM cms_learning_paths WHERE id = ?").bind(id).run();
  }

  // ---- Lessons -----------------------------------------------------------
  async listLessons(pathId?: string, status?: CmsStatus): Promise<CmsLessonRow[]> {
    let sql = "SELECT * FROM cms_lessons WHERE 1=1";
    const binds: unknown[] = [];
    if (pathId) {
      sql += " AND path_id = ?";
      binds.push(pathId);
    }
    if (status) {
      sql += " AND status = ?";
      binds.push(status);
    }
    sql += " ORDER BY path_id ASC, order_index ASC";
    const res = await this.d1.prepare(sql).bind(...binds).all<CmsLessonRow>();
    return res.results ?? [];
  }

  async getLessonById(id: string): Promise<CmsLessonRow | null> {
    return this.d1.prepare("SELECT * FROM cms_lessons WHERE id = ?").bind(id).first<CmsLessonRow>();
  }

  async getLessonByLessonId(lessonId: string): Promise<CmsLessonRow | null> {
    return this.d1
      .prepare("SELECT * FROM cms_lessons WHERE lesson_id = ?")
      .bind(lessonId)
      .first<CmsLessonRow>();
  }

  async upsertLesson(input: {
    lessonId: string;
    pathId: string;
    orderIndex: number;
    title: string;
    summary: string;
    payload: string;
    status: CmsStatus;
  }): Promise<string> {
    const existing = await this.getLessonByLessonId(input.lessonId);
    const now = this.now();
    if (existing) {
      await this.d1
        .prepare(
          `UPDATE cms_lessons SET
            path_id = ?, order_index = ?, title = ?, summary = ?, payload = ?, status = ?, updated_at = ?
           WHERE lesson_id = ?`,
        )
        .bind(
          input.pathId,
          input.orderIndex,
          input.title,
          input.summary,
          input.payload,
          input.status,
          now,
          input.lessonId,
        )
        .run();
      return existing.id;
    }
    const id = uuid();
    await this.d1
      .prepare(
        `INSERT INTO cms_lessons
          (id, lesson_id, path_id, order_index, title, summary, payload, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        input.lessonId,
        input.pathId,
        input.orderIndex,
        input.title,
        input.summary,
        input.payload,
        input.status,
        now,
        now,
      )
      .run();
    return id;
  }

  async deleteLesson(id: string): Promise<void> {
    await this.d1.prepare("DELETE FROM cms_lessons WHERE id = ?").bind(id).run();
  }

  // ---- Assessments -------------------------------------------------------
  async listAssessments(status?: CmsStatus): Promise<CmsAssessmentRow[]> {
    let sql = "SELECT * FROM cms_assessments";
    const binds: unknown[] = [];
    if (status) {
      sql += " WHERE status = ?";
      binds.push(status);
    }
    sql += " ORDER BY path_id ASC";
    const res = await this.d1.prepare(sql).bind(...binds).all<CmsAssessmentRow>();
    return res.results ?? [];
  }

  async getAssessmentByPathId(pathId: string): Promise<CmsAssessmentRow | null> {
    return this.d1
      .prepare("SELECT * FROM cms_assessments WHERE path_id = ?")
      .bind(pathId)
      .first<CmsAssessmentRow>();
  }

  async upsertAssessment(input: {
    pathId: string;
    title: string;
    passingScore: number;
    xpReward: number;
    questions: string;
    status: CmsStatus;
  }): Promise<string> {
    const existing = await this.getAssessmentByPathId(input.pathId);
    const now = this.now();
    if (existing) {
      await this.d1
        .prepare(
          `UPDATE cms_assessments SET
            title = ?, passing_score = ?, xp_reward = ?, questions = ?, status = ?, updated_at = ?
           WHERE path_id = ?`,
        )
        .bind(
          input.title,
          input.passingScore,
          input.xpReward,
          input.questions,
          input.status,
          now,
          input.pathId,
        )
        .run();
      return existing.id;
    }
    const id = uuid();
    await this.d1
      .prepare(
        `INSERT INTO cms_assessments
          (id, path_id, title, passing_score, xp_reward, questions, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        input.pathId,
        input.title,
        input.passingScore,
        input.xpReward,
        input.questions,
        input.status,
        now,
        now,
      )
      .run();
    return id;
  }

  // ---- Resources ---------------------------------------------------------
  async listResources(visibility?: "public" | "hidden"): Promise<CmsResourceRow[]> {
    let sql = "SELECT * FROM cms_resources";
    const binds: unknown[] = [];
    if (visibility) {
      sql += " WHERE visibility = ?";
      binds.push(visibility);
    }
    sql += " ORDER BY created_at DESC";
    const res = await this.d1.prepare(sql).bind(...binds).all<CmsResourceRow>();
    return res.results ?? [];
  }

  async getResourceById(id: string): Promise<CmsResourceRow | null> {
    return this.d1
      .prepare("SELECT * FROM cms_resources WHERE id = ?")
      .bind(id)
      .first<CmsResourceRow>();
  }

  async createResource(input: {
    name: string;
    description: string;
    category: string;
    visibility: "public" | "hidden";
    fileKey?: string | null;
    fileName?: string | null;
    fileType?: string | null;
    fileSize?: number | null;
    thumbnailKey?: string | null;
    website?: string | null;
    resourceLink?: string | null;
  }): Promise<string> {
    const id = uuid();
    const now = this.now();
    await this.d1
      .prepare(
        `INSERT INTO cms_resources
          (id, name, description, category, visibility, file_key, file_name, file_type, file_size,
           thumbnail_key, website, resource_link, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        input.name,
        input.description,
        input.category,
        input.visibility,
        input.fileKey ?? null,
        input.fileName ?? null,
        input.fileType ?? null,
        input.fileSize ?? null,
        input.thumbnailKey ?? null,
        input.website ?? null,
        input.resourceLink ?? null,
        now,
        now,
      )
      .run();
    return id;
  }

  async updateResource(
    id: string,
    fields: Partial<{
      name: string;
      description: string;
      category: string;
      visibility: "public" | "hidden";
      fileKey: string | null;
      fileName: string | null;
      fileType: string | null;
      fileSize: number | null;
      thumbnailKey: string | null;
      website: string | null;
      resourceLink: string | null;
    }>,
  ): Promise<void> {
    const existing = await this.getResourceById(id);
    if (!existing) return;
    await this.d1
      .prepare(
        `UPDATE cms_resources SET
          name = ?, description = ?, category = ?, visibility = ?,
          file_key = ?, file_name = ?, file_type = ?, file_size = ?,
          thumbnail_key = ?, website = ?, resource_link = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(
        fields.name ?? existing.name,
        fields.description ?? existing.description,
        fields.category ?? existing.category,
        fields.visibility ?? existing.visibility,
        fields.fileKey !== undefined ? fields.fileKey : existing.file_key,
        fields.fileName !== undefined ? fields.fileName : existing.file_name,
        fields.fileType !== undefined ? fields.fileType : existing.file_type,
        fields.fileSize !== undefined ? fields.fileSize : existing.file_size,
        fields.thumbnailKey !== undefined ? fields.thumbnailKey : existing.thumbnail_key,
        fields.website !== undefined ? fields.website : existing.website,
        fields.resourceLink !== undefined ? fields.resourceLink : existing.resource_link,
        this.now(),
        id,
      )
      .run();
  }

  async deleteResource(id: string): Promise<void> {
    await this.d1.prepare("DELETE FROM cms_resources WHERE id = ?").bind(id).run();
  }

  // ---- Media -------------------------------------------------------------
  async listMedia(search?: string): Promise<CmsMediaRow[]> {
    let sql = "SELECT * FROM cms_media";
    const binds: unknown[] = [];
    if (search) {
      sql += " WHERE file_name LIKE ? OR alt_text LIKE ?";
      const like = `%${search}%`;
      binds.push(like, like);
    }
    sql += " ORDER BY created_at DESC LIMIT 200";
    const res = await this.d1.prepare(sql).bind(...binds).all<CmsMediaRow>();
    return res.results ?? [];
  }

  async getMediaById(id: string): Promise<CmsMediaRow | null> {
    return this.d1.prepare("SELECT * FROM cms_media WHERE id = ?").bind(id).first<CmsMediaRow>();
  }

  async createMedia(input: {
    fileKey: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    altText: string;
    uploadedBy: string | null;
  }): Promise<string> {
    const id = uuid();
    await this.d1
      .prepare(
        `INSERT INTO cms_media
          (id, file_key, file_name, mime_type, file_size, alt_text, uploaded_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        input.fileKey,
        input.fileName,
        input.mimeType,
        input.fileSize,
        input.altText,
        input.uploadedBy,
        this.now(),
      )
      .run();
    return id;
  }

  async deleteMedia(id: string): Promise<void> {
    await this.d1.prepare("DELETE FROM cms_media WHERE id = ?").bind(id).run();
  }

  // ---- Navigation --------------------------------------------------------
  async listNavGroups(): Promise<NavGroupRow[]> {
    const res = await this.d1
      .prepare("SELECT * FROM nav_groups ORDER BY position ASC")
      .all<NavGroupRow>();
    return res.results ?? [];
  }

  async listNavItems(): Promise<NavItemRow[]> {
    const res = await this.d1
      .prepare("SELECT * FROM nav_items ORDER BY group_id ASC, position ASC")
      .all<NavItemRow>();
    return res.results ?? [];
  }

  async replaceNavigation(
    groups: { label: string; position: number; items: { label: string; url: string; position: number }[] }[],
  ): Promise<void> {
    const now = this.now();
    await this.d1.prepare("DELETE FROM nav_items").run();
    await this.d1.prepare("DELETE FROM nav_groups").run();
    for (const group of groups) {
      const groupId = uuid();
      await this.d1
        .prepare(
          "INSERT INTO nav_groups (id, label, position, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        )
        .bind(groupId, group.label, group.position, now, now)
        .run();
      for (const item of group.items) {
        await this.d1
          .prepare(
            `INSERT INTO nav_items (id, group_id, label, url, position, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(uuid(), groupId, item.label, item.url, item.position, now, now)
          .run();
      }
    }
  }

  // ---- Site settings -----------------------------------------------------
  async getSetting(key: string): Promise<string | null> {
    const row = await this.d1
      .prepare("SELECT value FROM site_settings WHERE key = ?")
      .bind(key)
      .first<{ value: string }>();
    return row?.value ?? null;
  }

  async getAllSettings(): Promise<Record<string, string>> {
    const res = await this.d1.prepare("SELECT key, value FROM site_settings").all<{
      key: string;
      value: string;
    }>();
    const out: Record<string, string> = {};
    for (const row of res.results ?? []) out[row.key] = row.value;
    return out;
  }

  async setSetting(key: string, value: string): Promise<void> {
    await this.d1
      .prepare(
        `INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      )
      .bind(key, value, this.now())
      .run();
  }

  async setSettings(settings: Record<string, string>): Promise<void> {
    for (const [key, value] of Object.entries(settings)) {
      await this.setSetting(key, value);
    }
  }

  // ---- Dashboard stats ---------------------------------------------------
  async cmsStats() {
    const one = async (sql: string) =>
      (await this.d1.prepare(sql).first<{ n: number }>())?.n ?? 0;
    return {
      pages: await one("SELECT COUNT(*) AS n FROM cms_pages"),
      publishedPages: await one("SELECT COUNT(*) AS n FROM cms_pages WHERE status = 'published'"),
      lessons: await one("SELECT COUNT(*) AS n FROM cms_lessons"),
      resources: await one("SELECT COUNT(*) AS n FROM cms_resources"),
      media: await one("SELECT COUNT(*) AS n FROM cms_media"),
    };
  }
}
