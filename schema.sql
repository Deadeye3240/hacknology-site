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
