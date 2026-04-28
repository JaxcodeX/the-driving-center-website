# STATUS.md — The Driving Center SaaS
**Updated: 2026-04-27**

---

## Demo Site

**Live:** `the-driving-center-website.vercel.app`
**GitHub:** `github.com/JaxcodeX/the-driving-center-website`
**Branch:** `main` (auto-deploys on push)
**Demo PIN:** `0000` (any email works)
**Demo school:** `autotest1777248097@demo-test.com` / `0daea68b-06ed-445b-bf52-91d4f16b9e01`

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
| Migration 009 not run | `bookings.session_id` FK + `booking_time` column missing | Zax must run in Supabase SQL Editor |
| `POST /api/students` auth | Reads `x-school-id` header instead of verifying session | Pre-production risk, not a demo blocker |

---

## What Needs Building

| Item | Priority |
|---|---|
| Instructor availability UI | Low (after demo) |
| SMS reminders | Low (email MVP fine) |
| Real domain + Resend verification | After Mark meeting |

---

## Workflow Protocol

**Current mode:** Vibe Coding Protocol (CLAUDE.md)
- Always write SPEC.md before building
- Give AI full context package (design tokens + reference components + spec)
- One-pass builds, no chat iteration
- 50-line rule: if >50 lines back-and-forth, write new SPEC instead

---

## Stack (Locked)

| Component | Value |
|---|---|
| Supabase project | `evswdlsqlaztvajibgta` |
| Resend API key | `re_ZwCTERGk_8eesZtYHGkR32GPv6YAgEs2P` (live) |
| DeepSeek API key | `sk-7c4c86239406412ba3385f32db8b959d` |
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
SPEC_LANDING_REDESIGN.md ← landing page spec (pending execution)
SPEC.md                ← phase specs (archived)
src/app/               ← all routes + pages
src/lib/
  supabase/            ← client + server helpers
  migrations/          ← SQL (migration 009 pending)
  email-templates/      ← Resend templates
  security.ts          ← encryption, validation
tests/e2e/             ← automated tests
scripts/
  deepseek-claude      ← Claude Code + DeepSeek wrapper
```

---

## Sprint: Mark Martin Demo

**Demo ready.** The site is deployed, demo data is seeded, demo login is fixed.

Zax's remaining task before demo:
1. Run migration 009 in Supabase SQL Editor (one SQL paste, 2 minutes)
2. Test full demo flow: `/login` → PIN 0000 → school admin → students → sessions

Mark will evaluate: architecture decisions, multi-tenant schema, subscription flow, auth system. Not CSS quality.