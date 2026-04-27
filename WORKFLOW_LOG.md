# WORKFLOW_LOG.md — FSO Cycle Log

**Following Mark Martin's FSO workflow. Every cycle logged honestly.**
**Format: What we tried → What failed → What fixed it → Root cause**

---

## Cycle 6 — Architecture Audit + Clean Docs + Test Framework

**Date:** 2026-04-26
**SPEC.md:** `SPEC.md` (Phase 1D)
**Implemented by:** Everest + DeepSeek
**Result:** ✅ Passed — deployed

### What was done
Full architecture audit + documentation cleanup:
- Rewrote `CLAUDE.md` as single source of truth
- Created `STATUS.md` (honest project state, no contradictions)
- Created `tests/e2e/run-all.js` (automated API test runner)
- Defined Phase 1D in `SPEC.md` (5 criticals remaining)
- Deployed to: `the-driving-center-website-3jznxhlb3-jaxcodexs-projects.vercel.app`

### What We Got Wrong Before This Cycle

**Documentation sprawl:** 8 files defining the same project state, all contradicting each other.
- `PROJECT_CONSTITUTION.md` said coding agent was "Kimi K2.6 via Ollama" — hadn't been true for weeks
- `BUILD_PLAN.md` still listed Phase 0 P0-1 fixes that were resolved months ago
- `PROGRESS.md` said Phase 1A "in progress" — most items were done

**Root cause:** We built first, documented later. Docs got stale the moment a session ended. Fix: one source of truth (CLAUDE.md), updated at the end of every session.

**B.L.A.S.T. protocol written but never followed:**
The `PROJECT_CONSTITUTION.md` had a full B.L.A.S.T. protocol. Zero features actually went through it. Every cycle was: Build → Fix → Document retroactively. The spec was written after the code, not before.

**Root cause:** No enforcement mechanism. The workflow existed on paper but had no gate. Fix: CLAUDE.md now enforces "no SPEC.md → no implementation."

### What Still Needs Fixing (Phase 1D)

- [ ] SQL migrations 007 + 008 run in Supabase SQL Editor
- [ ] Subscription status middleware (canceled/past_due schools redirect)
- [ ] RLS cross-school test
- [ ] CSV import (real parsing)
- [ ] Email wiring (Resend key needed)

### Next action
Phase 1D implementation — subscription middleware + RLS test

---

## Cycle 5 — P1-C: Email + SMS Reminders Wired to Cron

**Date:** 2026-04-25
**Result:** ✅ Passed — deployed

### Failure logged
**What failed:** Reminder system was SMS-only. No email confirmation after booking.

**Root cause:** Twilio was wired first (easier stub) because it required only env vars. Email was left as a stub but wasn't implemented at the API level — the reminder route returned SMS but had no email channel.

**Fix:** Extended `/api/reminders` to support both channels. Stub mode logs what would be sent without crashing. Email templates created (48h + 4h). Cron job configured.

**Lesson:** When two delivery mechanisms share a trigger, build them together. SMS-only reminders would have required a second round of API changes to add email.

---

## Cycle 4 — P1-B: Session Management

**Date:** 2026-04-25
**Result:** ✅ Passed — deployed

### Failure logged
**What failed:** Sessions page used `school_id` from URL query params — would break if user navigated directly. Students could see other schools' sessions if they manipulated the URL.

**Root cause:** We trusted client-supplied `school_id` from `useSearchParams` instead of getting it from the authenticated session. First-pass security hole.

**Fix:** `school_id` now comes from `/api/auth/session` server call. URL params used only for initial render.

**Lesson:** Every `school_id` that isn't sourced from the server session is a potential data leak vector. Client-supplied school_id is never trustworthy.

---

## Cycle 3 — P1-A: Student Profile Edit + TCA Tracking

**Date:** 2026-04-25
**Result:** ✅ Passed — deployed

### Failure logged
**What failed:** Student API returned `[encrypted]` for every name. Decryption wasn't happening at read time.

**Root cause:** Encryption was correctly applied at write (legal_name encrypted before INSERT), but the read path in the API route didn't call `decrypt()`. The data was always encrypted in the DB — the API just wasn't decrypting it.

**Fix:** Added server-side decryption in both GET /api/students and GET /api/students/[id].

**Lesson:** If PII is encrypted at rest, every read path must explicitly decrypt. Encryption at write without decryption at read = data you can't use.

---

## Cycle 1 — Auth + Initial Build

**Date:** 2026-04-22
**Result:** ✅ Passed — deployed

### Failure logged
**What failed:** Magic link auth callback didn't create a link between the Supabase auth user and the school_id in our schools table. School owners logged in but the system didn't know which school they owned.

**Root cause:** Auth callback wrote to `user_metadata.school_id` but the admin dashboard was reading `owner_email` from the schools table — two separate identity systems that never got reconciled.

**Fix:** Dual-write in auth callback: `user_metadata.school_id` + `schools.owner_email` written at the same time.

**Lesson:** Auth identity and business identity are separate systems. The link between them must be explicit and tested with every auth change.

---

## Cycle 7 — Schema Fix: Align Code to Actual DB Schema

**Date:** 2026-04-26
**SPEC.md:** `SPEC_SCHEMA_FIX.md`
**Implemented by:** Everest
**Result:** ✅ Passed — committed + pushed

### What was wrong
Code assumed database columns that don't exist in `evswdlsqlaztvajibgta`:
- `POST /api/bookings`: inserted `session_id` (UUID FK) + `deposit_amount_cents` into columns that don't exist → hard error on every booking
- `bookings.confirmation_token` doesn't exist (actual column: `booking_token`)
- `sessions.cancelled` doesn't exist (actual: `sessions.status` TEXT)
- `sessions.start_time` doesn't exist (sessions only have `start_date`)
- `/api/schools` POST had no auth check — anyone could create a school
- `getSupabaseAdmin()` defined inline in 13+ files

### What was fixed
1. `POST /api/bookings` — rewritten to use actual DB columns: `session_date` + `session_time` (TEXT), `booking_token`
2. `GET /api/sessions` — removed `.eq('cancelled', false)`, uses `.eq('status', 'scheduled')` (actual DB has `status` not `cancelled`)
3. `POST /api/sessions` — removed `start_time`/`end_time` references, uses `start_date`/`end_date` only
4. `/api/schools` POST — added auth check (DEMO_MODE requires logged-in user)
5. `/api/notify/booking` — uses `booking_token` instead of `reschedule_token`
6. All routes now import `getSupabaseAdmin()` from `@/lib/supabase/server` (single source)

### Root cause
Schema was designed with certain column names but Supabase project had different actual schema. Code was written based on design assumptions, not actual DB inspection.

### Lesson
Inspect actual DB schema via live API calls before writing code that touches it. Never assume column names — verify.

### What's still pending
- [ ] Migration 009 SQL run in Supabase SQL Editor (add session_id FK + missing columns)
- [ ] RLS test run (`tests/e2e/rls-test.js`)
- [ ] Full end-to-end test with Zax

---

## Cycle 8 — Architecture Audit + CLAUDE.md Cleanup + Demo Data Seed

**Date:** 2026-04-27
**Implemented by:** Everest
**Result:** ✅ Passed — committed

### What was done

1. **Full architecture audit** — reviewed CLAUDE.md, STATUS.md, WORKFLOW_LOG.md, middleware, students API, bookings API, sessions API, security.ts

2. **CLAUDE.md updated:**
   - Fixed workflow description to match reality (Everest directs, DeepSeek generates)
   - Added scripts/ to file structure
   - Removed stale "delete these files" list (files already cleaned in Cycle 6)

3. **8 stale spec files deleted:**
   - `AGENTS.md`, `CRON_SETUP.md`, `DEMO_SCRIPT.md`, `PREMIUM_DESIGN_SYSTEM.md`, `SPEC_CRITICAL_BUGS.md`, `SPEC_LIGHT_LANDING.md`, `SPEC_ONE_SHOT_BUILD.md`, `SPEC_SCHEMA_FIX.md`
   - Root now has: `CLAUDE.md`, `STATUS.md`, `WORKFLOW_LOG.md`, `SPEC_ONE_WEEK_SPRINT.md`, `SPEC_FULL_REDESIGN.md`, `SPEC.md`, `README.md`

4. **Demo school seeded** (via raw HTTPS to bypass supabase-js chaining issues):
   - 4 students: Olivia Chen, Jaylen Brooks, Priya Nair, Mason Torres
   - 3 instructors: Marcus Rivera, Diana Okonkwo, Jake Thornton (already existed)
   - 5 upcoming sessions across next 9 days
   - 4 bookings (confirmed + pending mix)

### Issues found and fixed

**students_driver_ed has no `status` column** — The code was inserting with a `status` field that doesn't exist in the actual DB. Fixed in seed script.

**Supabase service role key in HTTPS requests required reading from .env.local** — The service role key worked when read from .env but not when stored in the script. Root cause: script was using a stale key copied from memory.

### Lesson
Always read keys from `.env.local` at runtime, never hardcode them. The actual DB schema (inspected via REST API) is the source of truth, not the migration files.

### Still needed before Mark demo
- [ ] Migration 009 SQL (add session_id FK to bookings)
- [ ] E2E test: demo PIN → add student → schedule session → booking confirmation

