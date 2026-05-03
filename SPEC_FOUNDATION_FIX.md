# SPEC — Foundation Fix Phase

**Date:** 2026-05-03
**Goal:** Stop the cycle of breaking things. Fix the root causes.

---

## What's Broken (Root Causes)

### 1. Multiple design systems (no single source of truth)
- `design-tokens.css` — defined but **never imported anywhere** (confirmed: zero references)
- `globals.css` — the actual design system (everything uses this)
- `page.tsx` hero section — defines its own `DARK` object with different values
- Result: engineers reference the wrong file, builds mismatch

### 2. 12 SPEC files (nobody knows which is authoritative)
- `SPEC_FULL_REDESIGN.md` is the most recent and most complete
- `STATUS.md` says "all items resolved" but 23 audit issues contradict it
- Result: every session starts with conflicting context

### 3. Multiple type files that contradict each other
- `database.types.ts` — correct, verified against live DB
- `mc_types.ts` — unknown origin, may not match actual DB
- `types.ts` — likely outdated
- Result: type errors and schema mismatches

### 4. No test coverage on critical paths
- E2E tests only check health + schools creation
- Students, sessions, bookings, webhooks, demo login — all untested
- Result: every "fix" goes to production untested

### 5. DEMO_MODE masks production vulnerabilities
- `/api/demo/*` routes are open with no auth in non-demo context
- Production launch would expose all school data if DEMO_MODE=false was set incorrectly
- Result: production launch is a security landmine

---

## Phase 1: Delete Dead Weight

### Step 1 — Delete `design-tokens.css`
It's imported nowhere. It's dead weight contradicting `globals.css`.
```bash
rm src/lib/design-tokens.css
```

### Step 2 — Delete stale SPEC files
Keep only `SPEC_FULL_REDESIGN.md`. Delete the other 11.
```bash
rm SPEC.md SPEC_ADMIN_DASHBOARD_REDESIGN.md SPEC_API_FIXES.md SPEC_ARCH_FIX.md SPEC_AUTH_REDESIGN.md SPEC_BOOKING_FIX.md SPEC_CAL_BILLING_REDESIGN.md SPEC_INSTRUCTORS_REDESIGN.md SPEC_MISSION_CONTROL.md SPEC_SESSIONS_REDESIGN.md SPEC_STUDENTS_REDESIGN.md
```

### Step 3 — Consolidate type files
Keep only `src/lib/supabase/database.types.ts` as the single source of truth.
- Delete `src/lib/supabase/mc_types.ts`
- Delete `src/lib/supabase/types.ts`

### Step 4 — Update CLAUDE.md
- Remove reference to `design-tokens.css`
- Point to `globals.css` as the single design source
- Remove broken OpenCode workflow reference
- Update `SPEC_FULL_REDESIGN.md` as the only spec

---

## Phase 2: Fix the Types (Blocker: Schema Safety)

### Step 5 — Generate real Supabase types
```bash
cd ~/projects/the-driving-center-website
npx supabase gen types typescript --project-id evswdlsqlaztvajibgta
```
Compare against `database.types.ts`. Replace if different.

### Step 6 — Audit every `as any` cast in API routes
Find all `as any` in routes and replace with properly typed operations.

### Step 7 — Fix AUDIT.md critical issues (runtime errors)

| # | File | Issue | Fix |
|---|---|---|---|
| 1 | `migrations/004_booking_schema.sql` | `get_available_slots` references `s.cancelled` + `s.start_time` (don't exist) | Rewrite function to use `status` text column + remove `start_time` |
| 2 | `migrations/003_security_hardening.sql` | `increment_seats_booked` references `cancelled = false` | Change to `status = 'scheduled'` |
| 3 | `src/app/api/booking-links/[token]/route.ts` | `.eq('confirmation_token', token)` — should check BOTH tokens | Update to `.or('booking_token.eq.' + token + ',confirmation_token.eq.' + token)` |
| 4 | `src/app/api/webhooks/stripe/route.ts` | `deposit_paid_at` column doesn't exist | Remove from UPDATE |
| 5 | `src/app/api/webhooks/stripe/route.ts` | `auditLog('stripe-webline')` typo | Fix to `stripe-webhook` |

---

## Phase 3: Test Coverage

### Step 8 — Write critical path tests
```
POST /api/students       — auth + school isolation
POST /api/sessions       — auth + ownership check
POST /api/bookings       — full flow
POST /api/auth/demo-login — demo auth flow
GET /api/webhooks/stripe  — signature verification
```

---

## Phase 4: Production Hardening (Before Launch)

### Step 9 — Remove DEMO_MODE routes from production paths
`/api/demo/*` routes must be gated behind `DEMO_MODE=true` env check — and the check must NOT be the only protection. Production needs real auth.

### Step 10 — Update STATUS.md honestly
Remove "What Needs Fixing: None". List the actual issues honestly.

---

## Success Criteria
- [ ] `npm run build` passes with 0 errors
- [ ] `npm run typecheck` passes (add it if missing)
- [ ] Only ONE design token source (globals.css)
- [ ] Only ONE spec file (SPEC_FULL_REDESIGN.md)
- [ ] Only ONE types file (database.types.ts)
- [ ] All 5 AUDIT critical runtime errors fixed
- [ ] Critical path tests written

---

## Do NOT change
- UI pages (those will be redesigned after foundation is solid)
- Database schema
- Auth flow logic