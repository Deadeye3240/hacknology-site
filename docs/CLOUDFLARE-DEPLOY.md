# Cloudflare Production Deployment

This document lists production steps for Hacknology on **Cloudflare Pages + Pages Functions + D1 + R2**.  
Do **not** run remote commands until you have reviewed the pre-deploy fix pass.

## Architecture (verified in repo)

| Component | Location | Binding |
|-----------|----------|---------|
| Static frontend | `dist/` (Vite build) | Cloudflare Pages |
| API routes | `functions/api/**` | Pages Functions |
| Database | `schema.sql` | D1 binding `DB` (`hacknology-db`) |
| Media | CMS uploads | R2 binding `MEDIA` (`hacknology-media`) |
| Auth | HTTP-only session cookie + CSRF | Pages Functions `_lib/auth.ts` |

`wrangler.toml` database ID: `dc3a2356-a8de-41fd-ba48-c5d746b6400d`

---

## D1 migrations required for this release

The project uses a **single idempotent schema file** (`schema.sql`), not numbered migrations.

### What changed in this release

1. **Forum tables + category seeds** (if not already applied on production):
   - `forum_categories`, `forum_discussions`, `forum_replies`
   - 8 seeded categories (`cat-general` … `cat-offtopic`)

2. **New table: `path_progress`** (path certification persistence):
   ```sql
   CREATE TABLE IF NOT EXISTS path_progress (
     user_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     path_id           TEXT NOT NULL,
     assessment_score  INTEGER,
     completed_at      TEXT NOT NULL,
     PRIMARY KEY (user_id, path_id)
   );
   ```

Existing tables (`users`, `sessions`, `lesson_progress`, `lab_progress`, CMS tables) are unchanged except by the full schema re-apply.

### Production command (DO NOT RUN YET)

From the repo root, after authenticating Wrangler to the production account:

```bash
npm run db:migrate
```

Which executes:

```bash
wrangler d1 execute hacknology-db --remote --file=./schema.sql
```

This is **idempotent** (`CREATE TABLE IF NOT EXISTS`, `INSERT OR IGNORE` for forum categories). Safe to re-run; it will add `path_progress` without dropping existing data.

### Local verification command (safe to run during dev)

```bash
npm run db:migrate:local
```

---

## API routes added/changed in this release

| Route | Purpose |
|-------|---------|
| `GET/POST /api/progress/paths` | Server-side path certification sync |
| `GET/POST /api/progress/lessons` | Existing lesson completion (unchanged) |
| `GET/POST /api/progress/labs` | Existing lab progress (unchanged) |
| `/api/forum/*` | Forum (requires D1 forum schema + seeds) |

All authenticated writes require CSRF (session cookie from login).

---

## Production deployment steps (HELD — run after review)

1. **Apply D1 schema to production** (command above).
2. **Verify CMS navigation** in `/admin/navigation` includes Forum + ScanMe (code now merges missing core links, but audit admin config).
3. **Build locally**: `npm run build`
4. **Deploy Pages** (when ready — not part of this pass):
   ```bash
   npm run build && wrangler pages deploy dist
   ```
   Or push to the connected Git branch if CI deploys automatically.
5. **Smoke test production**:
   - `/forum`, `/forum/new`, `/forum/:id`
   - `/scanme`, `/scanme/first-scan`
   - Lesson path assessment gating + login sync
   - Path certification persists after logout/login

---

## Environment / secrets

Set via Cloudflare dashboard or `wrangler pages secret put`:

- Session/auth secrets (existing)
- `ADMIN_INITIAL_PASSWORD` (if used)
- `DISCORD_WEBHOOK_URL` (optional lesson completion notify)

Ensure Pages project bindings match `wrangler.toml`: `DB`, `MEDIA`.
