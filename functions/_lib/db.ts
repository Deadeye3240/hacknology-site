/// <reference types="@cloudflare/workers-types" />
import type { Role, SessionRow, UserRow } from "./types";
import { uuid } from "./crypto";

/**
 * Clean, server-only data-access layer over Cloudflare D1.
 *
 * All SQL is parameterised (never string-interpolated) which prevents SQL
 * injection. Endpoints depend on these typed methods rather than touching the
 * database directly, so storage can evolve in one place.
 */
export class Db {
  constructor(private readonly d1: D1Database) {}

  private now(): string {
    return new Date().toISOString();
  }

  // ---- Users -------------------------------------------------------------
  async getUserById(id: string): Promise<UserRow | null> {
    return this.d1
      .prepare("SELECT * FROM users WHERE id = ?")
      .bind(id)
      .first<UserRow>();
  }

  async getUserByLogin(login: string): Promise<UserRow | null> {
    const key = login.trim().toLowerCase();
    return this.d1
      .prepare(
        "SELECT * FROM users WHERE username_lower = ? OR email_lower = ? LIMIT 1",
      )
      .bind(key, key)
      .first<UserRow>();
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const row = await this.d1
      .prepare("SELECT 1 AS x FROM users WHERE username_lower = ? LIMIT 1")
      .bind(username.trim().toLowerCase())
      .first<{ x: number }>();
    return row !== null;
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const row = await this.d1
      .prepare("SELECT 1 AS x FROM users WHERE email_lower = ? LIMIT 1")
      .bind(email.trim().toLowerCase())
      .first<{ x: number }>();
    return row !== null;
  }

  async countAdmins(): Promise<number> {
    const row = await this.d1
      .prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'")
      .first<{ n: number }>();
    return row?.n ?? 0;
  }

  async createUser(input: {
    username: string;
    email: string;
    passwordHash: string;
    role?: Role;
    mustChangePassword?: boolean;
  }): Promise<UserRow> {
    const now = this.now();
    const id = uuid();
    await this.d1
      .prepare(
        `INSERT INTO users
          (id, username, username_lower, email, email_lower, password_hash,
           display_name, bio, avatar, role, profile_public, must_change_password,
           created_at, updated_at, disabled_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, '', NULL, ?, 1, ?, ?, ?, NULL)`,
      )
      .bind(
        id,
        input.username,
        input.username.toLowerCase(),
        input.email,
        input.email.toLowerCase(),
        input.passwordHash,
        input.username,
        input.role ?? "user",
        input.mustChangePassword ? 1 : 0,
        now,
        now,
      )
      .run();
    const created = await this.getUserById(id);
    if (!created) throw new Error("Failed to load created user");
    return created;
  }

  async updateProfile(
    userId: string,
    fields: { displayName: string; bio: string; avatar: string | null; profilePublic: boolean },
  ): Promise<void> {
    await this.d1
      .prepare(
        `UPDATE users SET display_name = ?, bio = ?, avatar = ?,
           profile_public = ?, updated_at = ? WHERE id = ?`,
      )
      .bind(
        fields.displayName,
        fields.bio,
        fields.avatar,
        fields.profilePublic ? 1 : 0,
        this.now(),
        userId,
      )
      .run();
  }

  async updatePassword(
    userId: string,
    passwordHash: string,
    mustChange = false,
  ): Promise<void> {
    await this.d1
      .prepare(
        `UPDATE users SET password_hash = ?, must_change_password = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(passwordHash, mustChange ? 1 : 0, this.now(), userId)
      .run();
  }

  async setRole(userId: string, role: Role): Promise<void> {
    await this.d1
      .prepare("UPDATE users SET role = ?, updated_at = ? WHERE id = ?")
      .bind(role, this.now(), userId)
      .run();
  }

  async setDisabled(userId: string, disabled: boolean): Promise<void> {
    await this.d1
      .prepare("UPDATE users SET disabled_at = ?, updated_at = ? WHERE id = ?")
      .bind(disabled ? this.now() : null, this.now(), userId)
      .run();
  }

  async listUsers(limit = 100): Promise<UserRow[]> {
    const res = await this.d1
      .prepare("SELECT * FROM users ORDER BY created_at DESC LIMIT ?")
      .bind(limit)
      .all<UserRow>();
    return res.results ?? [];
  }

  // ---- Sessions ----------------------------------------------------------
  async createSession(
    userId: string,
    sessionId: string,
    csrfSecret: string,
    expiresAt: string,
    userAgent: string | null,
  ): Promise<void> {
    await this.d1
      .prepare(
        `INSERT INTO sessions (id, user_id, csrf_secret, created_at, expires_at, user_agent)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(sessionId, userId, csrfSecret, this.now(), expiresAt, userAgent)
      .run();
  }

  async getSession(sessionId: string): Promise<SessionRow | null> {
    return this.d1
      .prepare("SELECT * FROM sessions WHERE id = ?")
      .bind(sessionId)
      .first<SessionRow>();
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.d1.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
  }

  async deleteSessionsForUser(userId: string): Promise<void> {
    await this.d1.prepare("DELETE FROM sessions WHERE user_id = ?").bind(userId).run();
  }

  // ---- Lesson / lab progress --------------------------------------------
  async getLessonProgress(userId: string) {
    const res = await this.d1
      .prepare(
        "SELECT lesson_id, completed, completed_at FROM lesson_progress WHERE user_id = ?",
      )
      .bind(userId)
      .all<{ lesson_id: string; completed: number; completed_at: string | null }>();
    return res.results ?? [];
  }

  async upsertLessonProgress(
    userId: string,
    lessonId: string,
    completed: boolean,
  ): Promise<void> {
    await this.d1
      .prepare(
        `INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(user_id, lesson_id) DO UPDATE SET
           completed = excluded.completed,
           completed_at = excluded.completed_at`,
      )
      .bind(userId, lessonId, completed ? 1 : 0, completed ? this.now() : null)
      .run();
  }

  async getLabProgress(userId: string) {
    const res = await this.d1
      .prepare(
        "SELECT lab_id, status, started_at, completed_at FROM lab_progress WHERE user_id = ?",
      )
      .bind(userId)
      .all<{
        lab_id: string;
        status: string;
        started_at: string | null;
        completed_at: string | null;
      }>();
    return res.results ?? [];
  }

  async upsertLabProgress(
    userId: string,
    labId: string,
    status: "in_progress" | "completed",
  ): Promise<void> {
    const now = this.now();
    await this.d1
      .prepare(
        `INSERT INTO lab_progress (user_id, lab_id, status, started_at, completed_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(user_id, lab_id) DO UPDATE SET
           status = excluded.status,
           completed_at = excluded.completed_at`,
      )
      .bind(
        userId,
        labId,
        status,
        now,
        status === "completed" ? now : null,
      )
      .run();
  }

  // ---- Forum -------------------------------------------------------------
  async listCategories() {
    const res = await this.d1
      .prepare(
        "SELECT id, name, description, slug, position FROM forum_categories ORDER BY position ASC",
      )
      .all<{
        id: string;
        name: string;
        description: string;
        slug: string;
        position: number;
      }>();
    return res.results ?? [];
  }

  async getCategory(id: string) {
    return this.d1
      .prepare("SELECT * FROM forum_categories WHERE id = ?")
      .bind(id)
      .first<{ id: string; name: string; description: string; slug: string; position: number }>();
  }

  async createDiscussion(input: {
    categoryId: string;
    authorId: string;
    title: string;
    content: string;
  }): Promise<string> {
    const id = uuid();
    const now = this.now();
    await this.d1
      .prepare(
        `INSERT INTO forum_discussions
          (id, category_id, author_id, title, content, locked, removed, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?)`,
      )
      .bind(id, input.categoryId, input.authorId, input.title, input.content, now, now)
      .run();
    return id;
  }

  async getDiscussion(id: string) {
    return this.d1
      .prepare("SELECT * FROM forum_discussions WHERE id = ?")
      .bind(id)
      .first<{
        id: string;
        category_id: string;
        author_id: string;
        title: string;
        content: string;
        locked: number;
        removed: number;
        created_at: string;
        updated_at: string;
      }>();
  }

  async listDiscussions(categoryId?: string, search?: string) {
    let sql = `
      SELECT d.id, d.category_id, d.title, d.locked, d.removed, d.created_at, d.updated_at,
             u.username AS author_username, u.display_name AS author_display_name, u.avatar AS author_avatar,
             c.name AS category_name, c.slug AS category_slug,
             (SELECT COUNT(*) FROM forum_replies r WHERE r.discussion_id = d.id AND r.removed = 0) AS reply_count
      FROM forum_discussions d
      JOIN users u ON u.id = d.author_id
      JOIN forum_categories c ON c.id = d.category_id
      WHERE d.removed = 0`;
    const binds: unknown[] = [];
    if (categoryId) {
      sql += " AND d.category_id = ?";
      binds.push(categoryId);
    }
    if (search) {
      sql += " AND (d.title LIKE ? OR d.content LIKE ?)";
      const like = `%${search}%`;
      binds.push(like, like);
    }
    sql += " ORDER BY d.updated_at DESC LIMIT 100";
    const res = await this.d1.prepare(sql).bind(...binds).all();
    return res.results ?? [];
  }

  async updateDiscussion(id: string, title: string, content: string): Promise<void> {
    await this.d1
      .prepare(
        "UPDATE forum_discussions SET title = ?, content = ?, updated_at = ? WHERE id = ?",
      )
      .bind(title, content, this.now(), id)
      .run();
  }

  async setDiscussionLocked(id: string, locked: boolean): Promise<void> {
    await this.d1
      .prepare("UPDATE forum_discussions SET locked = ?, updated_at = ? WHERE id = ?")
      .bind(locked ? 1 : 0, this.now(), id)
      .run();
  }

  async setDiscussionRemoved(id: string, removed: boolean): Promise<void> {
    await this.d1
      .prepare("UPDATE forum_discussions SET removed = ?, updated_at = ? WHERE id = ?")
      .bind(removed ? 1 : 0, this.now(), id)
      .run();
  }

  async touchDiscussion(id: string): Promise<void> {
    await this.d1
      .prepare("UPDATE forum_discussions SET updated_at = ? WHERE id = ?")
      .bind(this.now(), id)
      .run();
  }

  async listReplies(discussionId: string) {
    const res = await this.d1
      .prepare(
        `SELECT r.id, r.author_id, r.content, r.removed, r.created_at, r.updated_at,
                u.username AS author_username, u.display_name AS author_display_name,
                u.avatar AS author_avatar, u.role AS author_role
         FROM forum_replies r
         JOIN users u ON u.id = r.author_id
         WHERE r.discussion_id = ?
         ORDER BY r.created_at ASC`,
      )
      .bind(discussionId)
      .all();
    return res.results ?? [];
  }

  async getReply(id: string) {
    return this.d1
      .prepare("SELECT * FROM forum_replies WHERE id = ?")
      .bind(id)
      .first<{
        id: string;
        discussion_id: string;
        author_id: string;
        content: string;
        removed: number;
        created_at: string;
        updated_at: string;
      }>();
  }

  async createReply(discussionId: string, authorId: string, content: string): Promise<string> {
    const id = uuid();
    const now = this.now();
    await this.d1
      .prepare(
        `INSERT INTO forum_replies (id, discussion_id, author_id, content, removed, created_at, updated_at)
         VALUES (?, ?, ?, ?, 0, ?, ?)`,
      )
      .bind(id, discussionId, authorId, content, now, now)
      .run();
    await this.touchDiscussion(discussionId);
    return id;
  }

  async updateReply(id: string, content: string): Promise<void> {
    await this.d1
      .prepare("UPDATE forum_replies SET content = ?, updated_at = ? WHERE id = ?")
      .bind(content, this.now(), id)
      .run();
  }

  async setReplyRemoved(id: string, removed: boolean): Promise<void> {
    await this.d1
      .prepare("UPDATE forum_replies SET removed = ?, updated_at = ? WHERE id = ?")
      .bind(removed ? 1 : 0, this.now(), id)
      .run();
  }

  // ---- Reports -----------------------------------------------------------
  async createReport(input: {
    reporterId: string;
    targetType: "discussion" | "reply";
    targetId: string;
    reason: string;
  }): Promise<void> {
    await this.d1
      .prepare(
        `INSERT INTO reports (id, reporter_id, target_type, target_id, reason, status, created_at)
         VALUES (?, ?, ?, ?, ?, 'open', ?)`,
      )
      .bind(uuid(), input.reporterId, input.targetType, input.targetId, input.reason, this.now())
      .run();
  }

  async listReports() {
    const res = await this.d1
      .prepare(
        `SELECT rp.*, u.username AS reporter_username
         FROM reports rp JOIN users u ON u.id = rp.reporter_id
         ORDER BY (rp.status = 'open') DESC, rp.created_at DESC LIMIT 200`,
      )
      .all();
    return res.results ?? [];
  }

  async reviewReport(
    id: string,
    status: "reviewed" | "dismissed",
    reviewerId: string,
  ): Promise<void> {
    await this.d1
      .prepare(
        "UPDATE reports SET status = ?, reviewed_by = ?, reviewed_at = ? WHERE id = ?",
      )
      .bind(status, reviewerId, this.now(), id)
      .run();
  }

  // ---- Support messages --------------------------------------------------
  async createSupportMessage(input: {
    userId: string | null;
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<string> {
    const id = uuid();
    await this.d1
      .prepare(
        `INSERT INTO support_messages (id, user_id, name, email, subject, message, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'open', ?)`,
      )
      .bind(
        id,
        input.userId,
        input.name,
        input.email,
        input.subject,
        input.message,
        this.now(),
      )
      .run();
    return id;
  }

  async listSupportMessages() {
    const res = await this.d1
      .prepare(
        `SELECT * FROM support_messages
         ORDER BY (status = 'open') DESC, created_at DESC LIMIT 200`,
      )
      .all();
    return res.results ?? [];
  }

  async updateSupportMessageStatus(
    id: string,
    status: "open" | "read" | "closed",
    reviewerId: string,
  ): Promise<void> {
    await this.d1
      .prepare(
        "UPDATE support_messages SET status = ?, reviewed_by = ?, reviewed_at = ? WHERE id = ?",
      )
      .bind(status, reviewerId, this.now(), id)
      .run();
  }

  // ---- Stats -------------------------------------------------------------
  async stats() {
    const one = async (sql: string) =>
      (await this.d1.prepare(sql).first<{ n: number }>())?.n ?? 0;
    return {
      users: await one("SELECT COUNT(*) AS n FROM users"),
      disabledUsers: await one("SELECT COUNT(*) AS n FROM users WHERE disabled_at IS NOT NULL"),
      discussions: await one("SELECT COUNT(*) AS n FROM forum_discussions WHERE removed = 0"),
      replies: await one("SELECT COUNT(*) AS n FROM forum_replies WHERE removed = 0"),
      openReports: await one("SELECT COUNT(*) AS n FROM reports WHERE status = 'open'"),
      openSupport: await one("SELECT COUNT(*) AS n FROM support_messages WHERE status = 'open'"),
    };
  }

  // ---- Audit log ---------------------------------------------------------
  async logAudit(
    actorId: string,
    action: string,
    targetType: string | null,
    targetId: string | null,
    detail: string | null,
  ): Promise<void> {
    await this.d1
      .prepare(
        `INSERT INTO admin_audit_log (id, actor_id, action, target_type, target_id, detail, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(uuid(), actorId, action, targetType, targetId, detail, this.now())
      .run();
  }

  // ---- Rate limiting -----------------------------------------------------
  async rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
    const nowSec = Math.floor(Date.now() / 1000);
    const row = await this.d1
      .prepare("SELECT count, window_start FROM rate_limits WHERE key = ?")
      .bind(key)
      .first<{ count: number; window_start: number }>();

    if (!row || nowSec - row.window_start >= windowSeconds) {
      await this.d1
        .prepare(
          `INSERT INTO rate_limits (key, count, window_start) VALUES (?, 1, ?)
           ON CONFLICT(key) DO UPDATE SET count = 1, window_start = ?`,
        )
        .bind(key, nowSec, nowSec)
        .run();
      return true;
    }

    if (row.count >= limit) return false;

    await this.d1
      .prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?")
      .bind(key)
      .run();
    return true;
  }
}
