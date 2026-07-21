# ScanMe Lab Architecture

The ScanMe lab is **completely isolated** from the production Hacknology application.

Production Hacknology runs on **Cloudflare Pages + Pages Functions** with a **Cloudflare D1** database (`hacknology-db`, binding `DB`) and optional **R2** media bucket (`hacknology-media`, binding `MEDIA`). ScanMe does not use any of these resources.

## Architecture

```
Hacknology Website (Cloudflare Pages)
        │
        │  Flag submission & progress (client-side only)
        ▼
ScanMe Lab Management (React UI at /scanme)
        │
        │  No production DB, API, or secrets
        ▼
Isolated ScanMe Target (separate deployment)
```

## Security boundaries

| Resource | ScanMe access |
|----------|----------------|
| Production Cloudflare D1 (`hacknology-db`) | **No access** |
| Production APIs / auth | **No access** |
| Forum / user profiles | **No access** |
| Cloudflare secrets | **No access** |
| Real user data | **No access** |

The Hacknology website only provides:

- Mission descriptions and educational content
- A built-in **simulated** Nmap output viewer (fake data)
- Client-side flag validation (training flags, not production secrets)
- Progress stored in browser `localStorage` under `hacknology.scanme.v1`

## Isolated target deployment

The scannable target must run **separately** from Cloudflare Pages.

### Option A: Local Docker lab (recommended for development)

```bash
cd scanme-lab
docker compose up -d
```

Add to your hosts file:

```
127.0.0.1 scanme.hacknology-lab.local
```

Run authorized scans from your terminal:

```bash
nmap scanme.hacknology-lab.local
nmap -sV -p 22,80,443,8080 scanme.hacknology-lab.local
```

### Option B: Dedicated VM / cloud instance

Deploy the `scanme-lab` container on a VM you control. Restrict firewall rules to your IP or VPN. Use a dedicated hostname — **not** `hacknology-site.pages.dev`.

### Option C: Built-in simulator only

If you cannot deploy a target, each mission page includes simulated Nmap output with flags discoverable through the educational workflow.

## What NOT to do

- Do **not** scan `hacknology-site.pages.dev` or any production Hacknology URL
- Do **not** bind the lab target to production Cloudflare Workers/Pages
- Do **not** expose production databases or APIs on scan ports
- Do **not** scan third-party systems without written authorization

## Flag format

Training flags use the format `HACKNOLOGY{...}`. Each flag awards XP only once per browser profile.

## Authorized use

Only scan:

- The isolated `scanme.hacknology-lab.local` training target you deployed
- Systems you own
- Lab environments with explicit written permission
