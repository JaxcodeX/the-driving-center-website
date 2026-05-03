## Cycle 12 — Slots API + RLS Fix

**Date:** 2026-05-02
**SPEC.md:** `SPEC_API_FIXES.md`
**Implemented by:** Everest
**Result:** ✅ Passed — committed + pushed + verified

### What was wrong
`/api/session-types` and `/api/slots` returned empty results for the public booking page despite valid data existing in the database.

**Root cause:** Both endpoints used the user's Supabase auth client (`createClient()`). The `session_types` table has an RLS policy that only allows reads if `owner_email = auth.jwt() ->> 'email'`. A public booking page has no authenticated user, so RLS blocked all reads → empty array.

The session-types query was also selecting `requires_permit` (column doesn't exist), causing a 500 on older deploys.

### What was fixed
1. `src/app/api/session-types/route.ts` — use `getSupabaseAdmin()` when `DEMO_MODE=true`
2. `src/app/api/slots/route.ts` — use admin for session type lookup when `DEMO_MODE=true`
3. `src/app/book/page.tsx` — fix session match: removed non-existent `start_time` from comparison
4. `src/app/school-admin/page.tsx` — calculate monthly revenue from `bookings.deposit_amount_cents` instead of non-existent `schools.monthly_revenue`

5. `src/app/api/session-types/route.ts` — removed `requires_permit` from select (column doesn't exist)

### Verified
- `GET /api/session-types?school_id=<uuid>` → returns session types ✅
- `GET /api/slots?school_id=<uuid>&session_type_id=<uuid>` → returns slot info ✅
- Build: 0 errors ✅

### Lesson
RLS policies that depend on `auth.jwt() ->> 'email'` break public-facing API routes. When a route needs to serve public data (booking page), it must use the service role admin client. Conditionally using admin in DEMO_MODE keeps production auth intact while fixing the demo/public flow.

---

## Cycle 11 — Booking Confirmation Fix

**Date:** 2026-05-02
**SPEC.md:** `SPEC_BOOKING_FIX.md`
**Implemented by:** Everest
**Result:** ✅ Passed — committed + pushed

### What was wrong
Confirmation page at `/book/confirmation` called the wrong API endpoint:
- **Broken:** `GET /api/bookings/${token}` — requires `school_id` + authenticated user, always 404'd
- **Correct:** `GET /api/booking-links/${token}` — looks up by `confirmation_token`, no auth needed

Also: the page checked `data.status === 'pending'` and showed a false "pending payment" error even when the booking-link endpoint returned a real confirmed booking.

### What was fixed
1. `src/app/book/confirmation/page.tsx` — fetch URL changed to `/api/booking-links/${token}`
2. Removed stale `data.status === 'pending'` check — booking-links endpoint returns the actual booking on success
3. Build passes with 0 errors, deployed to Vercel

### Root cause
The booking flow has two parallel confirmation paths:
- `/api/bookings` (authenticated, school-scoped)
- `/api/booking-links/${token}` (token-based, public)

The confirmation page was wired to the wrong one from day one.

### Lesson
Public token-based lookups need public endpoints. Never mix authenticated and public token-based flows.

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

---

## Cycle 9 — Vibe Coding Protocol + CLAUDE.md Rewrite

**Date:** 2026-04-27
**Implemented by:** Everest
**Result:** ✅ Passed — committed

### Why this cycle happened
Zax identified the core problem: building a polished website via chat-based CSS iteration takes 10x longer than it should. AI site builders (Bolt, Lovable, Base44) can generate the same quality frontend in 20 minutes, but Zax doesn't want to use those tools for a production-level system.

Research into vibe coding best practices confirmed the real issue: **prompt context size is the bottleneck, not AI capability.** The anti-pattern is iterating on individual CSS properties via chat. The solution is full-section prompts with complete context.

### What was changed

**CLAUDE.md rewritten** to add:

1. **Vibe Coding Protocol** — When prompting AI sub-agents, always give: (1) full design system, (2) 1-3 reference components, (3) complete SPEC.md, (4) constraints. Never iterate one CSS property at a time.

2. **Context Package Template** — Every sub-agent prompt must include: design tokens + reference components + SPEC.md + tech stack. One-pass builds only.

3. **50-line rule** — If a change requires more than ~50 lines of back-and-forth in chat, stop and write a new SPEC.md instead.

4. **Updated file structure** — Removed stale SPEC_ONE_WEEK_SPRINT.md (merged into sprint tracking), added SPEC_LANDING_REDESIGN.md

5. **Updated stack table** — Added `scripts/deepseek-claude` as the execution method

6. **WORKFLOW_LOG.md format updated** — Now tracks context package given, build time, and prompt quality metrics

### Root cause identified
The slow iteration on The Driving Center website wasn't a workflow problem — it was a prompting problem. We were giving the AI partial context (just the spec) instead of complete context (design system + working examples + spec). The AI can generate complete sections in one pass when given everything it needs.

### Demo login bug also fixed in this session
`POST /api/auth/demo-login` was looking up school by user email input (not the demo school email), causing 404 on any non-demo email. Fixed to use fixed `DEMO_SCHOOL_ID` + `demoEmail` constant. Deployed as `2a80608`.

### Key lesson
**Full context → one pass → commit. Partial context → iteration → wasted time.**
The discipline is in what we give the AI before we ask it to build, not in how we direct it during build.


---

## Cycle 10 — Architectural Audit Fixes

**Date:** 2026-04-28
**Implemented by:** Everest
**Result:** ✅ Passed — committed

### What was done

1. **POST /api/students auth fixed** — `school_id` now derives from `user.user_metadata.school_id` first, with `x-school-id` header as DEMO_MODE fallback only. Ownership check always runs.

2. **8 stale SPEC*.md files deleted** — Removed SPEC_LANDING_CLEAN.md, SPEC_LANDING_GOLDEN_SCREEN.md, SPEC_LANDING_HERO_REBUILD.md, SPEC_LANDING_REBUILD.md, SPEC_LANDING_REDESIGN.md, SPEC_ONE_WEEK_SPRINT.md, SPEC_DEMO_FIX.md, SPEC.md (archived). Only SPEC_FULL_REDESIGN.md remains.

3. **STATUS.md updated** — Migration 009 noted as already applied. RLS test result recorded as PASS. `schools.owner_email` UNIQUE constraint flagged as needed fix.

4. **CLAUDE.md rewritten** — Removed broken "DeepSeek-Claude with context package" workflow that never actually existed. Replaced with honest description: Everest builds directly OR spawns OpenCode with context package. Migration 009 removed from "pending" section. Font contradiction resolved (now says "distinctive pairing" instead of Inter specifically).

5. **Migration 010 created** — `010_schools_owner_email_unique.sql` adds UNIQUE constraint on `schools.owner_email`. Needs to run in Supabase SQL Editor.

6. **package.json updated** — Added `typecheck` script (`tsc --noEmit`) and `test` script pointing to E2E runner.

### Architectural issues still pending

- `getSupabaseAdmin()` in supabase/server.ts is defined but multiple API routes call `createClient()` expecting admin access — they get user-context client instead
- Demo routes `/api/demo/*` have zero auth (acceptable for DEMO_MODE but needs production fix before launch)
- Landing page (`page.tsx`) uses inline styles instead of TailwindCSS despite TailwindCSS being in stack

### Action items from this audit

- [ ] Run migration 010 in Supabase SQL Editor (1 SQL statement)
- [ ] Fix `getSupabaseAdmin()` usage in API routes (several routes call `createClient()` expecting admin)
- [ ] Audit `/api/demo/*` routes before production launch
- [ ] OpenCode integration into workflow (spawn command + context package assembly)

### Root cause of friction

CLAUDE.md described an aspirational workflow (sub-agent with context package) that was never actually implemented. Every commit was Everest directly. The "DeepSeek-Claude" script was broken from day one. Fixing this requires either (a) actually building the OpenCode spawn pipeline or (b) being honest that Everest builds directly and dropping the fake sub-agent description.


---

## Cycle 13 — E2E Booking Flow Audit + Demo Mode Hardening

**Date:** 2026-05-03  
**Result:** ✅ Passed — committed + pushed

### What was wrong

**1. Conflicting Next.js dynamic route**  
`src/app/api/bookings/[token]/route.ts` conflicted with `src/app/api/bookings/[booking_id]/route.ts` — Next.js requires same slug name for all segments at the same level. Build failed on `npm run dev` with: `Error: You cannot use different slug names for the same dynamic path ('booking_id' !== 'token')`.

**2. Sessions had null session_type_id** — 4 of 6 demo sessions had no session_type_id, causing `/api/slots` to return empty arrays for all session types. Students clicking the booking page would see no available slots.

**3. All demo sessions were in the past** — sessions were seeded in late April with dates in late April and early May 2026. By May 3rd, all were in the past, making the booking page appear broken.

**4. Duplicate session_types** — Traffic Court Awareness and Behind-the-Wheel each appeared twice in the DB with different UUIDs.

**5. Demo-mode artifacts visible in UI** — Login page explicitly labeled "Demo Mode" with PIN:0000 instructions; billing page said "DEMO_MODE: No Stripe subscription required."

### What was fixed

1. Deleted `bookings/[token]/route.ts` — the [booking_id]/checkout route handles token-based checkout; the [token] route was orphaned and conflicting
2. Removed 4 duplicate session_type records via Supabase REST API
3. Assigned session_type_id to all 6 remaining sessions (was null on 4)
4. Created 2 new sessions for 2026-05-03 (today) so booking page shows live slots
5. Login page: removed "Demo Mode" badge, Zap icon, PIN:0000 instruction text — demo login still works but unlabeled as "quick login"
6. Billing page: replaced "DEMO_MODE: No Stripe subscription required" with neutral "Free plan — upgrade anytime to unlock all features"

### E2E flow test results

```
POST /api/auth/demo-login → 200 ✅ (sets 4 cookies including demo_session)
GET /api/session-types?school_id=... → returns 4 session types ✅
GET /api/slots?school_id=...&session_type_id=... → returns slots with start_time ✅
POST /api/bookings (valid email) → 201 { booking_id, booking_token, status: pending_payment } ✅
POST /api/bookings/[id]/checkout → { confirmed: true } ✅
Booking confirmed in DB with booking_token = confirmation_token ✅
```

### Remaining artifacts (cosmetic — not blocking)

- Email templates still reference `${schoolName}` and `${schoolPhone}` from the school data (correct), not hardcoded values. ✅ This was already fixed.
- `reminder-48h.ts` footer: `"Powered by The Driving Center SaaS"` — this is acceptable branding, not demo-specific

### Pre-existing issues still open

| Issue | Status |
|---|---|
| Migration 010 (UNIQUE on schools.owner_email) | Not run in Supabase SQL Editor yet |
| `/api/demo/*` routes have zero auth | Not audited for production |
| Sessions table has no `start_time` column | Slot times default to '09:00' — needs schema change |
| Email templates hardcoded "The Driving Center SaaS" in footer | Cosmetic — not blocking |

