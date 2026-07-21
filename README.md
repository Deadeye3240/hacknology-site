# HACKNOLOGY

> **Learn. Test. Defend.** — the official website for [hacknology.xyz](https://hacknology.xyz).

Hacknology is a professional cybersecurity **education and training platform**. It is
built to help students understand security concepts, practice in controlled
environments, and develop responsible **defensive** security skills.

The platform is strictly focused on **authorized cybersecurity education, defensive
security, and controlled training environments**.

This repository contains the frontend **and** a secure server-side backend:
user accounts, authentication and sessions, a community forum with moderation,
an administrator area, learning-progress tracking, and secure external-link
warnings — all designed to run on Cloudflare Pages.

---

## 1. Project overview

The site provides a foundation for future features including:

- Cybersecurity lessons and educational learning paths
- Authorized, hands-on cybersecurity labs
- CTF-style educational challenges
- Security tool resources and documentation
- A simulated (educational) security assessment interface
- Defensive security education for students

The architecture is intentionally layered so that authentication, student
accounts, progress tracking, dashboards, and backend/API integration can be added
later **without restructuring** the app.

---

## 2. Technology stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | [React 18](https://react.dev)       |
| Language     | [TypeScript](https://www.typescriptlang.org) |
| Build tool   | [Vite 5](https://vitejs.dev)        |
| Styling      | [Tailwind CSS 3](https://tailwindcss.com) |
| Routing      | [React Router 6](https://reactrouter.com) |
| API / backend | [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/) (Workers runtime) |
| Database     | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) — `hacknology-db`, binding `DB` |
| Media (CMS)  | [Cloudflare R2](https://developers.cloudflare.com/r2/) — `hacknology-media`, binding `MEDIA` |
| Auth         | Server-side sessions (HTTP-only cookies) + PBKDF2 password hashing + CSRF tokens |
| Deployment   | [Cloudflare Pages](https://pages.cloudflare.com) (Git-based) + Pages Functions |

**Security-sensitive logic runs only on the server.** No password hashes,
secrets, or database credentials are ever sent to the browser. The frontend
receives only the minimal user fields required to render the UI.

---

## 2a. Full-stack architecture (Phase 1 decision)

Authentication requires server-side functionality, so Hacknology uses the
Cloudflare-native stack that pairs with Pages with zero extra infrastructure:

- **Cloudflare Pages Functions** (in `functions/`) provide the API under
  `/api/*`. They run in the Workers runtime, right next to the static site — no
  separate server to host, and they deploy automatically with the Pages build.
- **Cloudflare D1** (SQLite) is the database — not “D2”; Cloudflare has no D2
  product. The database is named **`hacknology-db`**, bound to Functions as
  `env.DB`. All access is parameterised through data-access layers
  (`functions/_lib/db.ts`, `functions/_lib/cms-db.ts`), which prevents SQL
  injection and keeps storage concerns in one place.
- **Cloudflare R2** stores CMS media and downloadable resources, bound as
  `env.MEDIA` (bucket `hacknology-media`). Optional for local dev; required
  for admin file uploads in production.
- **Password hashing** uses **PBKDF2-HMAC-SHA-256** (100k iterations, per-user
  random salt) via the Web Crypto API — the only strong KDF available natively
  in the Workers runtime without bundling WASM. Plaintext passwords are never
  stored or logged.
- **Sessions** are opaque random tokens stored in a **`HttpOnly`, `SameSite=Lax`,
  `Secure`** cookie. The database stores only the **SHA-256** of the token, so a
  database leak does not expose usable sessions. JavaScript can never read the
  session cookie.
- **CSRF protection** uses a session-bound token (double-submit): the token is
  returned in JSON (never as an `HttpOnly` cookie) and must be echoed in the
  `X-CSRF-Token` header on every state-changing request. `SameSite=Lax` provides
  a second layer of defence.
- **Authorization is always enforced server-side.** The frontend changes what it
  *shows* based on role, but every privileged action re-checks the session and
  role on the server. There are no hidden admin URLs, hardcoded passwords, or
  client-side-only role checks.

Why not an external DB or JWTs? D1 avoids managing a separate database and
credentials; server-side session cookies avoid storing tokens in JS-accessible
storage (a common XSS foot-gun) and allow instant server-side revocation
(logout, disabling an account, password change).

---

## 3. Local installation

**Prerequisites:** [Node.js](https://nodejs.org) 18+ (LTS recommended) and npm.

```bash
# Clone your repository
git clone <your-repo-url>
cd hacknology-site

# Install dependencies
npm install
```

---

## 4. Running the development server

```bash
npm run dev
```

Vite prints a local URL (default: `http://localhost:5173`). The dev server
supports hot module replacement, so changes appear instantly.

---

## 5. Production build

```bash
# Type-check and build to the dist/ directory
npm run build

# Preview the production build locally
npm run preview
```

The build output is written to `dist/` — a standard static Vite build that any
static host (including Cloudflare Pages) can serve directly.

---

## 6. GitHub setup

This project is compatible with public and **private** GitHub repositories.

```bash
git init
git add .
git commit -m "Initial Hacknology frontend foundation"
git branch -M main
git remote add origin git@github.com:<your-username>/hacknology-site.git
git push -u origin main
```

`node_modules/`, `dist/`, and environment files are already excluded via
`.gitignore`.

---

## 7. Backend, database & environment setup

The backend (Pages Functions + D1) needs a one-time setup. **You must perform
the Cloudflare/database steps below manually** — they create cloud resources and
secrets that cannot be committed to the repository.

### 7.1 Install the CLI and log in

```bash
npm install                 # installs wrangler locally (already a devDependency)
npx wrangler login          # opens a browser to authorize your Cloudflare account
```

### 7.2 Create the D1 database

```bash
npx wrangler d1 create hacknology-db
```

Copy the printed `database_id` into the `[[d1_databases]]` block in
`wrangler.toml` (the `database_name` should be `hacknology-db`). This repo is
already configured for a database named **`hacknology-db`**.

### 7.3 Apply the schema (migrations)

The schema lives in `schema.sql` and is idempotent (safe to re-run).

```bash
npm run db:migrate:local    # local dev database (used by `wrangler pages dev`)
npm run db:migrate          # remote/production D1 database
```

### 7.4 Configure environment variables & secrets

| Name                     | Type   | Purpose                                                    |
| ------------------------ | ------ | ---------------------------------------------------------- |
| `ADMIN_INITIAL_PASSWORD` | secret | One-time password to bootstrap the initial `admin` account |
| `SESSION_TTL_DAYS`       | var    | Optional session lifetime in days (defaults to `30`)       |

- **Local dev:** copy `.env.example` to `.dev.vars` (gitignored) and fill in a
  long, random `ADMIN_INITIAL_PASSWORD`.
- **Production:** set the secret via the CLI or dashboard — never commit it:

  ```bash
  npx wrangler pages secret put ADMIN_INITIAL_PASSWORD
  ```

`.env.example` documents these; it contains **no real secrets**.

### 7.5 Local development with the backend

`npm run dev` runs the Vite frontend only (API calls will 503, and the app shows
a logged-out state). To run the full stack locally, including Functions + D1:

```bash
npm run cf:dev              # builds, then runs `wrangler pages dev` with D1
```

This serves the built site and the API together (default `http://localhost:8788`).

### 7.6 First-run administrator setup

1. Deploy (or run locally) with `ADMIN_INITIAL_PASSWORD` set.
2. Visit **`/setup`**. If no admin exists yet, enter the value of
   `ADMIN_INITIAL_PASSWORD` to create the `admin` account.
3. You are logged in and **required to change the password immediately**.
4. Once an admin exists, `/setup` is permanently disabled server-side.

### 7.7 Deploy to Cloudflare Pages (Git-based)

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages**.
2. **Connect to Git** and select your GitHub repository (private repos work
   after authorizing Cloudflare).
3. Configure the build settings:

   | Setting                | Value           |
   | ---------------------- | --------------- |
   | Framework preset       | `Vite`          |
   | Build command          | `npm run build` |
   | Build output directory | `dist`          |
   | Node version           | `18` or higher  |

4. Under **Settings → Functions → D1 database bindings**, bind variable name
   `DB` to **`hacknology-db`** (this mirrors `wrangler.toml`).
5. Under **Settings → Functions → R2 bucket bindings**, bind variable name
   `MEDIA` to **`hacknology-media`** (create the bucket first:
   `npx wrangler r2 bucket create hacknology-media`).
6. Under **Settings → Environment variables**, add the `ADMIN_INITIAL_PASSWORD`
   secret.
7. Save and deploy. Pages Functions in `functions/` deploy automatically with
   the site.

**SPA routing:** `public/_redirects` (`/* /index.html 200`) ensures client-side
routes resolve on direct load/refresh. Pages serves `/api/*` via Functions
before falling back to the SPA.

### 7.8 Manual steps checklist (things the repo can't do for you)

- [x] `npx wrangler d1 create hacknology-db` and paste `database_id` into `wrangler.toml` *(done: `dc3a2356-…`)*
- [ ] `npx wrangler login`
- [ ] `npm run db:migrate` (and `:local` for local dev)
- [ ] Set `ADMIN_INITIAL_PASSWORD` secret (dashboard or `wrangler pages secret put`)
- [ ] Bind `DB` → `hacknology-db` and `MEDIA` → `hacknology-media` in the Pages project
- [ ] `npx wrangler r2 bucket create hacknology-media` (if not already created)
- [ ] Visit `/setup` once to create the admin, then change the password

---

## 8. Project structure

```text
hacknology-site/
├── public/
│   ├── favicon.svg
│   └── _redirects            # Cloudflare Pages SPA fallback
├── functions/                # Cloudflare Pages Functions (the API, /api/*)
│   ├── _middleware.ts        # Security headers + DB-binding guard
│   ├── _lib/                 # Server-only libs (db, crypto, session, auth, …)
│   └── api/
│       ├── auth/             # register, login, logout, me, setup
│       ├── account/          # profile, password
│       ├── progress/         # lessons, labs (+ migration)
│       ├── forum/            # categories, discussions, replies, reports
│       └── admin/            # users, roles/status, reports, stats
├── src/
│   ├── components/
│   │   ├── auth/             # AuthLayout
│   │   ├── routing/          # ProtectedRoute (role-aware gate)
│   │   ├── layout/ navigation/ ui/ cards/ labs/ tools/ resources/
│   ├── context/              # AuthContext, ExternalLinkContext, LabProgressContext
│   ├── data/                 # Content/data (labs, tools, resources, pages…)
│   ├── hooks/                # Reusable hooks (useLockBodyScroll)
│   ├── lib/                  # api, url, date, progressMigration, cn, site…
│   ├── pages/                # Home, Labs, Forum, Dashboard, Admin, Login…
│   ├── routes/               # Router config and path constants
│   ├── types/                # Shared types (auth, forum, index)
│   ├── App.tsx               # Providers + Router
│   ├── main.tsx              # App entry point
│   └── index.css             # Tailwind layers + global styles
├── schema.sql                # D1 database schema (+ seeded forum categories)
├── wrangler.toml             # Pages + D1 configuration
├── .env.example              # Documents required env vars (NO real secrets)
├── index.html
├── package.json
└── tsconfig*.json / vite.config.ts / tailwind.config.js / postcss.config.js
```

### Architecture notes

- **Content is separated from UI.** Page copy, navigation, learning paths, and
  labs live under `src/data`, so components stay presentational and content is
  easy to iterate on or later swap for an API.
- **Reusable components.** Shared building blocks (`Button`, `Card`, `Badge`,
  `SectionHeader`, `Hero`, `PageContainer`, `Navbar`, `Footer`) keep the UI
  consistent and free of duplicated markup.
- **Path alias.** `@/` maps to `src/` for clean imports.
- **Accessibility.** Semantic HTML, a skip link, keyboard-accessible navigation,
  and visible focus styles are included from the start.

---

## Adding content (labs, tools, resources)

All library content is data-driven — you add entries by editing a data file, and
the existing pages/components render them automatically. No new page components
are required.

### Add a lab

Append a `Lab` object to `src/data/labs.ts`. The `id` becomes the
`/labs/:labId` route slug, so keep it URL-friendly and unique.

```ts
{
  id: "my-new-lab",
  title: "My New Lab",
  description: "One or two sentences shown on the card and detail header.",
  category: "Networking",          // LabCategory
  level: "Beginner",               // Difficulty
  estimatedMinutes: 45,
  skills: ["Skill one", "Skill two"],
  objectives: ["What the learner will be able to do…"],
  prerequisites: ["Recommended prior knowledge"],
  instructions: [
    {
      title: "Step title",
      description: "What to do in this step.",
      command: "optional illustrative command",
      output: "optional simulated output",
    },
  ],
}
```

Progress (Not Started / In Progress / Completed) is tracked automatically via
the `LabProgressContext`, which persists to `localStorage`. The store exposes a
small, storage-agnostic API so it can later be backed by an authenticated
server without changing consumers.

### Add a tool

Append a `Tool` object to `src/data/tools.ts`:

```ts
{
  id: "my-tool",
  name: "My Tool",
  description: "Short, original description of what the tool does.",
  category: "Network Analysis",    // ToolCategory
  platforms: ["Windows", "Linux"],
  skillLevel: "Intermediate",      // Difficulty
  website: "https://example.com",
  documentation: "https://example.com/docs", // optional
}
```

### Add a resource

Append a `Resource` object to `src/data/resources.ts`:

```ts
{
  id: "my-resource",
  name: "My Resource",
  description: "Short, original description (do not copy external content).",
  category: "Documentation",       // ResourceCategory
  website: "https://example.com",
  resourceLink: "https://example.com/most-relevant-page", // optional
}
```

New categories can be added by extending the corresponding union type in
`src/types/index.ts`; the filter chips are derived from those values.

> **Security Notice.** Labs, Tools, Resources, Scan, and the Forum display a
> prominent `SecurityNotice`: Hacknology provides educational information and
> resources for authorized security testing and cybersecurity education. Only
> test systems you own or have explicit permission to test. External websites
> and resources are not controlled or guaranteed by Hacknology. All labs are
> simulated, educational exercises — no real attack infrastructure is included.
>
> **External links.** Every link that leaves the site is routed through a
> reusable `ExternalLink` component that shows a confirmation dialog (with the
> destination hostname) before navigating.

---

## License

© 2026 Hacknology. All rights reserved.
