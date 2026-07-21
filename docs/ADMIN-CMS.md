# Admin CMS — Deployment Guide

Hacknology's Admin CMS lives at `/admin` inside the existing React app. All privileged APIs are under `/api/admin/*` and enforce the `admin` role server-side.

## Cloudflare stack

Hacknology runs entirely on Cloudflare — there is no external database or object store.

| Component | Product | Binding / name | Purpose |
|-----------|---------|----------------|---------|
| Frontend | **Cloudflare Pages** (Vite → `dist/`) | — | Static React app |
| API | **Cloudflare Pages Functions** (`functions/`) | — | `/api/*` backend (Workers runtime) |
| Database | **Cloudflare D1** (SQLite at the edge) | `DB` → `hacknology-db` | Users, forum, CMS metadata, progress |
| Media | **Cloudflare R2** | `MEDIA` → `hacknology-media` | CMS uploads, downloadable resources |

> **Note on “D2”:** Cloudflare does not offer a product called D2. If documentation or conversation refers to “D2”, it means **Cloudflare D1** — the SQLite database configured in `wrangler.toml`.

Configured in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "hacknology-db"
database_id = "dc3a2356-a8de-41fd-ba48-c5d746b6400d"

[[r2_buckets]]
binding = "MEDIA"
bucket_name = "hacknology-media"
```

Pages Functions access these via `env.DB` and `env.MEDIA` (see `functions/_lib/types.ts`).

## Prerequisites

- Cloudflare account with a **Pages** project connected to this repo
- **D1** database `hacknology-db` bound as `DB` (required)
- **R2** bucket `hacknology-media` bound as `MEDIA` (optional locally; required for file uploads in production)

## 1. Apply database migration

The CMS tables are appended to `schema.sql`.

**Local development:**

```bash
npm run db:migrate:local
```

**Production (remote D1):**

```bash
npm run db:migrate
```

This creates: `cms_pages`, `cms_learning_paths`, `cms_lessons`, `cms_assessments`, `cms_resources`, `cms_media`, `nav_groups`, `nav_items`, `site_settings`.

## 2. Create an admin account

Admin access uses the `users.role` column only — no hardcoded usernames.

### Option A: Initial setup (no admins yet)

1. Set the secret: `wrangler pages secret put ADMIN_INITIAL_PASSWORD`
2. Visit `/setup` and complete bootstrap (creates user `admin` with role `admin`).

### Option B: Promote an existing account (recommended)

Run against your D1 database (replace `YOUR_USER_ID`):

```bash
wrangler d1 execute hacknology-db --remote --command \
  "UPDATE users SET role = 'admin', updated_at = datetime('now') WHERE id = 'YOUR_USER_ID';"
```

Find user IDs:

```bash
wrangler d1 execute hacknology-db --remote --command \
  "SELECT id, username, email, role FROM users;"
```

**Local:**

```bash
wrangler d1 execute hacknology-db --local --command \
  "UPDATE users SET role = 'admin' WHERE username_lower = 'yourusername';"
```

Log in with that account, then open `/admin`.

## 3. Configure R2 (media & downloads)

```bash
wrangler r2 bucket create hacknology-media
```

`wrangler.toml` already declares:

```toml
[[r2_buckets]]
binding = "MEDIA"
bucket_name = "hacknology-media"
```

In the Cloudflare Pages dashboard, add an R2 binding named `MEDIA` pointing to `hacknology-media` if not synced from `wrangler.toml`.

Without R2, the CMS works for pages, navigation, settings, and lesson overrides; file upload returns a clear error.

## 4. Build & deploy (Cloudflare Pages)

### Local full-stack preview

```bash
npm run db:migrate:local   # apply schema to local D1 (first time / after schema changes)
npm run cf:dev               # build + wrangler pages dev (Functions + D1 + R2 from wrangler.toml)
```

### Production deploy (Git-connected Pages)

1. **Build settings** (Cloudflare dashboard → Pages → your project → Settings → Builds):

   | Setting | Value |
   |---------|-------|
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version | `18` or higher |

2. **D1 binding** (Settings → Functions → D1 database bindings):

   | Variable name | D1 database |
   |---------------|-------------|
   | `DB` | `hacknology-db` |

3. **R2 binding** (Settings → Functions → R2 bucket bindings):

   | Variable name | R2 bucket |
   |---------------|-----------|
   | `MEDIA` | `hacknology-media` |

4. **Secrets** (Settings → Environment variables, or CLI):

   ```bash
   npx wrangler pages secret put ADMIN_INITIAL_PASSWORD
   ```

5. **Apply schema to remote D1** (after CMS schema changes):

   ```bash
   npm run db:migrate
   ```

6. **Deploy:** push to the connected Git branch, or run `npm run build` and upload via the dashboard. Pages Functions in `functions/` deploy automatically with each build.

`public/_redirects` (`/* /index.html 200`) handles SPA routing; `/api/*` is served by Pages Functions before the SPA fallback.

### Verify after deploy

| Check | Expected |
|-------|----------|
| `/admin` logged out | "You are not an administrator." |
| `/admin` as admin | Full CMS dashboard |
| Create page slug `test-page`, publish | Available at `/test-page` and `/pages/test-page` |
| `/lessons`, `/scanme`, forum | Unchanged |
| `/resources` | Static links + CMS uploads |

## Architecture summary

```
Browser (React /admin/*)
    → AdminGate (role === admin UI only)
    → /api/admin/* (requireAdmin + CSRF on mutations)

Public site
    → /api/cms/pages/:slug
    → /api/cms/navigation
    → /api/cms/settings
    → /api/cms/resources
    → /api/cms/files/*
    → /api/cms/lessons/overrides
```

### Lessons

Static lesson data in `src/data/lessons/` remains the source of truth. Published rows in `cms_lessons` / `cms_learning_paths` / `cms_assessments` merge via `/api/cms/lessons/overrides` (client can consume for future runtime merge). `LessonProgressContext` and XP are unchanged.

### Pages

Content is JSON blocks (`heading`, `paragraph`, `list`, `code`) rendered without `dangerouslySetInnerHTML`.

### Security

- Admin role verified on every `/api/admin/*` request
- CSRF on POST/PATCH/PUT/DELETE
- Upload type/size validation (10 MB, allowlisted MIME)
- Reserved slug list prevents CMS pages from shadowing app routes
- Passwords/tokens never exposed in admin user list APIs

## API reference (admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/dashboard` | Combined stats |
| GET/POST | `/api/admin/pages` | List/create pages |
| GET/PATCH/DELETE | `/api/admin/pages/:id` | Page CRUD |
| GET/POST | `/api/admin/lessons` | Lesson overrides |
| GET/PATCH/DELETE | `/api/admin/lessons/:id` | Lesson override |
| GET/POST | `/api/admin/paths` | Path overrides |
| GET/POST | `/api/admin/assessments` | Assessment overrides |
| GET/POST | `/api/admin/resources` | Resources |
| PATCH/DELETE | `/api/admin/resources/:id` | Resource update/delete |
| GET/POST | `/api/admin/media` | Media library |
| DELETE | `/api/admin/media/:id` | Delete media |
| GET/PUT | `/api/admin/navigation` | Nav groups/items |
| GET/PUT | `/api/admin/settings` | Site key-value settings |
| POST | `/api/admin/upload` | R2 file upload |
| GET/PATCH | `/api/admin/users`, `/api/admin/users/:id` | User admin |
| GET/POST | `/api/admin/reports` | Moderation reports |

## Public CMS APIs

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cms/pages/:slug` | Published page |
| GET | `/api/cms/navigation` | Nav (null = use static defaults) |
| GET | `/api/cms/settings` | Public settings |
| GET | `/api/cms/resources` | Public downloads |
| GET | `/api/cms/files/*` | R2 file serve |
| GET | `/api/cms/lessons/overrides` | Published lesson/path overrides |
