# STATUS.md — The Driving Center SaaS
**Updated: 2026-04-28**

---

## Demo Site

**Live:** `the-driving-center-website.vercel.app`
**GitHub:** `github.com/JaxcodeX/the-driving-center-website`
**Branch:** `main` (auto-deploys on push)
**Demo PIN:** `0000` (any email works)
**Demo school:** `autotest1777248097@demo-test.com` / `0daea68b-06ed-445b-bf52-91d4f16b9e01`

---

## Auth & Security

| Check | Status |
|---|---|
| RLS cross-school isolation | ✅ PASS (tested 2026-04-28) |
| `POST /api/students` school_id source | ✅ FIXED — derives from user metadata, not client header |
| `schools.owner_email` UNIQUE constraint | ❌ MISSING — needs migration |
| Demo routes `/api/demo/*` auth | ⚠️ No auth — demo-only, acceptable for DEMO_MODE |

---

## What Works

### Auth & Multi-Tenancy
- ✅ Supabase Magic Links (no password auth)
- ✅ RLS policies — school_id injected on every query
- ✅ Session cookies via `@supabase/ssr`
- ✅ DEMO_MODE bypasses Stripe (demo keeps working without real payments)
- ✅ Demo login fixed — uses fixed demo school, ignores user email input (2026-04-27)

### Core Flow (end-to-end verified)
- ✅ School signup → creates real record in Supabase
- ✅ Redirect to `/onboarding?school=<slug>`
- ✅ Onboarding 4-step wizard: school info → instructor → session type → done
- ✅ School admin dashboard (KPIs, quick actions, upcoming sessions)
- ✅ Student CRUD (add, edit, search, TCA tracking)
- ✅ Session CRUD (schedule, confirm/cancel)
- ✅ TCA compliance tracking (≥30h classroom + ≥6h driving → certificate)
- ✅ Email confirmations via Resend (live, real emails send)
- ✅ Stripe billing portal (`/api/schools/billing-portal`)
- ✅ Webhook idempotency (`processed_stripe_events` table)
- ✅ `safe_increment_seats()` (migration 007)

### UI Pages
- ✅ `/` — Marketing homepage (glassmorphism, dark mode)
- ✅ `/login` — Magic link + Demo Mode
- ✅ `/signup` — School registration
- ✅ `/onboarding` — 4-step setup wizard
- ✅ `/school-admin` — Dashboard home
- ✅ `/school-admin/students` — Table + add modal
- ✅ `/school-admin/instructors` — Card grid + invite modal
- ✅ `/school-admin/sessions` — List with date blocks + status toggle
- ✅ `/school-admin/calendar` — Monthly grid view
- ✅ `/school-admin/billing` — Status banner + Stripe portal link
- ✅ `/school-admin/import` — CSV student import
- ✅ `/book` — Public booking widget
- ✅ `/book/confirmation` — Booking confirmation page

### Pre-built Demo Data (seeded 2026-04-27)
- 4 students: Olivia Chen, Jaylen Brooks, Priya Nair, Mason Torres
- 3 instructors: Marcus Rivera, Diana Okonkwo, Jake Thornton
- 5 upcoming sessions across next 9 days
- 4 bookings (3 confirmed, 1 pending)

---

## What Needs Fixing

| Item | Impact | Status |
|---|---|---|
| `schools.owner_email` UNIQUE constraint | Security — duplicate emails allowed | Needs SQL migration |

---

## What Needs Building

| Item | Priority |
|---|---|
| Instructor availability UI | Low (after demo) |
| SMS reminders | Low (email MVP fine) |
| Real domain + Resend verification | After Mark meeting |

---

## Stack (Locked)

| Component | Value |
|---|---|
| Supabase project | `evswdlsqlaztvajibgta` |
| Resend API key | `re_ZwCTERGk_8eesZtYHGkR32GPv6YAgEs2P` (live) |
| Stripe account | `jaxcodewe@protonmail.com` (test mode) |
| Vercel project | `jaxcodexs-projects/the-driving-center-website` |
| Demo mode | `true` (Vercel env var) |

---

## File Structure (current)

```
CLAUDE.md              ← workflow protocol (source of truth)
STATUS.md              ← this file
WORKFLOW_LOG.md        ← build cycle history
SPEC_FULL_REDESIGN.md  ← active redesign spec
SPEC.md                ← phase specs (archived)
src/app/               ← all routes + pages
src/lib/
  supabase/            ← client + server helpers
  migrations/          ← SQL (all applied except owner_email UNIQUE)
  email-templates/     ← Resend templates
  security.ts          ← encryption, validation
tests/e2e/             ← automated tests
scripts/
  deepseek-claude      ← placeholder (not currently used — OpenCode is target)
```

---

## Sprint: Mark Martin Demo

**Demo ready.** The site is deployed, demo data is seeded, demo login is fixed.

Mark will evaluate: architecture decisions, multi-tenant schema, subscription flow, auth system. Not CSS quality.

---

## Workflow

**Current mode:** Vibe Coding Protocol (CLAUDE.md)
- Always write SPEC.md before building
- Give AI full context package (design tokens + reference components + spec)
- One-pass builds, no chat iteration

**Sub-agent:** OpenCode (target — not yet wired into workflow)