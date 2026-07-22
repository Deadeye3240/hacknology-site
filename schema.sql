-- Hacknology database schema (Cloudflare D1 / SQLite)
--
-- Apply locally:      npm run db:migrate:local
-- Apply to remote D1: npm run db:migrate
--
-- All timestamps are ISO-8601 UTC strings. Booleans are stored as 0/1.

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- Users & sessions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id                   TEXT PRIMARY KEY,
  username             TEXT NOT NULL,
  username_lower       TEXT NOT NULL UNIQUE,
  email                TEXT NOT NULL,
  email_lower          TEXT NOT NULL UNIQUE,
  password_hash        TEXT NOT NULL,
  display_name         TEXT NOT NULL,
  bio                  TEXT NOT NULL DEFAULT '',
  avatar               TEXT,
  role                 TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  profile_public       INTEGER NOT NULL DEFAULT 1,
  must_change_password INTEGER NOT NULL DEFAULT 0,
  created_at           TEXT NOT NULL,
  updated_at           TEXT NOT NULL,
  disabled_at          TEXT
);

-- Session id is the SHA-256 of the opaque token stored in the HTTP-only cookie,
-- so the raw session secret is never persisted server-side or exposed to JS.
CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  csrf_secret TEXT NOT NULL,
  created_at  TEXT NOT NULL,
  expires_at  TEXT NOT NULL,
  user_agent  TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- ---------------------------------------------------------------------------
-- Learning progress (server-side, per account)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id    TEXT NOT NULL,
  completed    INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS lab_progress (
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lab_id       TEXT NOT NULL,
  status       TEXT NOT NULL CHECK (status IN ('in_progress', 'completed')),
  started_at   TEXT,
  completed_at TEXT,
  PRIMARY KEY (user_id, lab_id)
);

-- ---------------------------------------------------------------------------
-- Community forum
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS forum_categories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  slug        TEXT NOT NULL UNIQUE,
  position    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS forum_discussions (
  id          TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES forum_categories(id),
  author_id   TEXT NOT NULL REFERENCES users(id),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  locked      INTEGER NOT NULL DEFAULT 0,
  removed     INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_disc_cat ON forum_discussions(category_id);
CREATE INDEX IF NOT EXISTS idx_disc_author ON forum_discussions(author_id);
CREATE INDEX IF NOT EXISTS idx_disc_updated ON forum_discussions(updated_at);

CREATE TABLE IF NOT EXISTS forum_replies (
  id            TEXT PRIMARY KEY,
  discussion_id TEXT NOT NULL REFERENCES forum_discussions(id) ON DELETE CASCADE,
  author_id     TEXT NOT NULL REFERENCES users(id),
  content       TEXT NOT NULL,
  removed       INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_reply_disc ON forum_replies(discussion_id);

-- ---------------------------------------------------------------------------
-- Moderation
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
  id          TEXT PRIMARY KEY,
  reporter_id TEXT NOT NULL REFERENCES users(id),
  target_type TEXT NOT NULL CHECK (target_type IN ('discussion', 'reply')),
  target_id   TEXT NOT NULL,
  reason      TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'dismissed')),
  created_at  TEXT NOT NULL,
  reviewed_by TEXT REFERENCES users(id),
  reviewed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

CREATE TABLE IF NOT EXISTS support_messages (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES users(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open'
              CHECK (status IN ('open', 'read', 'closed')),
  created_at  TEXT NOT NULL,
  reviewed_by TEXT REFERENCES users(id),
  reviewed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_support_status ON support_messages(status);
CREATE INDEX IF NOT EXISTS idx_support_created ON support_messages(created_at);

-- Append-only log of important administrative actions.
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id          TEXT PRIMARY KEY,
  actor_id    TEXT NOT NULL REFERENCES users(id),
  action      TEXT NOT NULL,
  target_type TEXT,
  target_id   TEXT,
  detail      TEXT,
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_log(created_at);

-- Best-effort fixed-window rate limiting for auth and content endpoints.
CREATE TABLE IF NOT EXISTS rate_limits (
  key          TEXT PRIMARY KEY,
  count        INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);

-- ---------------------------------------------------------------------------
-- Seed forum categories (idempotent)
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO forum_categories (id, name, description, slug, position) VALUES
  ('cat-general',   'General Cybersecurity', 'Broad discussion about cybersecurity concepts and news.', 'general-cybersecurity', 1),
  ('cat-networking','Networking',            'Protocols, packets, routing, and network defense.',       'networking',            2),
  ('cat-linux',     'Linux',                 'Command line, permissions, hardening, and administration.','linux',                 3),
  ('cat-web',       'Web Security',          'Web application security concepts and defensive patterns.','web-security',          4),
  ('cat-defensive', 'Defensive Security',    'Detection, monitoring, incident response, and hardening.', 'defensive-security',    5),
  ('cat-tools',     'Tools',                 'Discussion about security tooling and how to use it well.','tools',                 6),
  ('cat-labs',      'Labs',                  'Questions and discussion about the Hacknology labs.',      'labs',                  7),
  ('cat-offtopic',  'Off Topic',             'Everything else — introductions and community chat.',      'off-topic',             8);

-- ---------------------------------------------------------------------------
-- CMS: dynamic pages, lessons, resources, media, navigation, settings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cms_pages (
  id           TEXT PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  seo_title    TEXT,
  seo_description TEXT,
  content      TEXT NOT NULL DEFAULT '{"blocks":[]}',
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON cms_pages(status);
CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);

CREATE TABLE IF NOT EXISTS cms_learning_paths (
  id                   TEXT PRIMARY KEY,
  path_id              TEXT NOT NULL UNIQUE,
  title                TEXT NOT NULL,
  description          TEXT NOT NULL DEFAULT '',
  level                TEXT NOT NULL DEFAULT 'Beginner',
  skills               TEXT NOT NULL DEFAULT '[]',
  estimated_hours      REAL NOT NULL DEFAULT 0,
  order_index          INTEGER NOT NULL DEFAULT 0,
  prerequisite_path_id TEXT,
  specialization       TEXT,
  practice_links       TEXT NOT NULL DEFAULT '[]',
  status               TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at           TEXT NOT NULL,
  updated_at           TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cms_paths_status ON cms_learning_paths(status);

CREATE TABLE IF NOT EXISTS cms_lessons (
  id           TEXT PRIMARY KEY,
  lesson_id    TEXT NOT NULL UNIQUE,
  path_id      TEXT NOT NULL,
  order_index  INTEGER NOT NULL DEFAULT 0,
  title        TEXT NOT NULL,
  summary      TEXT NOT NULL DEFAULT '',
  payload      TEXT NOT NULL DEFAULT '{}',
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cms_lessons_path ON cms_lessons(path_id);
CREATE INDEX IF NOT EXISTS idx_cms_lessons_status ON cms_lessons(status);

CREATE TABLE IF NOT EXISTS cms_assessments (
  id             TEXT PRIMARY KEY,
  path_id        TEXT NOT NULL UNIQUE,
  title          TEXT NOT NULL,
  passing_score  INTEGER NOT NULL DEFAULT 70,
  xp_reward      INTEGER NOT NULL DEFAULT 100,
  questions      TEXT NOT NULL DEFAULT '[]',
  status         TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cms_resources (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  category     TEXT NOT NULL DEFAULT 'Downloads',
  visibility   TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'hidden')),
  file_key     TEXT,
  file_name    TEXT,
  file_type    TEXT,
  file_size    INTEGER,
  thumbnail_key TEXT,
  website      TEXT,
  resource_link TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cms_resources_visibility ON cms_resources(visibility);

CREATE TABLE IF NOT EXISTS cms_media (
  id          TEXT PRIMARY KEY,
  file_key    TEXT NOT NULL UNIQUE,
  file_name   TEXT NOT NULL,
  mime_type   TEXT NOT NULL,
  file_size   INTEGER NOT NULL,
  alt_text    TEXT NOT NULL DEFAULT '',
  uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cms_media_created ON cms_media(created_at);

CREATE TABLE IF NOT EXISTS nav_groups (
  id          TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS nav_items (
  id          TEXT PRIMARY KEY,
  group_id    TEXT NOT NULL REFERENCES nav_groups(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,
  url         TEXT NOT NULL,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_nav_items_group ON nav_items(group_id);

CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);
