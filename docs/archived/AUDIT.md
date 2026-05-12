# COMPREHENSIVE ARCHITECTURE AUDIT REPORT
## The Driving Center SaaS — `the-driving-center-website`
**Audited:** 2026-04-28 | **Auditor:** Subagent (Senior Engineer) | **Project:** `/Users/cayden/Projects/the-driving-center-website`

---

## TYPE CHECK RESULT

```
$ npm run typecheck
tsc --noEmit
EXIT_CODE: 0
```

**TypeScript compiles cleanly.** This is the only green signal in this entire audit.

---

## SECTION 1: BROKEN THINGS (Production Risks)

### CRITICAL

#### 1. `get_available_slots` SQL function is BROKEN — references `sessions.cancelled` and `sessions.start_time` which don't exist

**File:** `src/lib/migrations/004_booking_schema.sql`

The SQL function `get_available_slots` (lines ~180-240) contains:
```sql
JOIN sessions s ON s.session_type_id = ps.session_type_id
  AND s.start_date = ps.session_date::text
  AND s.instructor_id = ps.instructor_id
  AND s.cancelled = false   -- ❌ COLUMN DOES NOT EXIST
```
Actual DB `sessions` table: NO `cancelled` column. It uses `status TEXT`.

The function also references `s.start_time` which doesn't exist in the sessions table.

**Impact:** `GET /api/slots` will throw a PostgreSQL error at runtime. Any slot availability query will fail.

---

#### 2. `increment_seats_booked` function references `sessions.cancelled = false` — BROKEN

**File:** `src/lib/migrations/003_security_hardening.sql` (migration 003)

```sql
UPDATE sessions
SET seats_booked = seats_booked + 1
WHERE id = target_session_id
  AND school_id = target_school_id
  AND seats_booked < max_seats
  AND cancelled = false;  -- ❌ COLUMN DOES NOT EXIST
```

Actual sessions table has `status TEXT DEFAULT 'scheduled'`, not a `cancelled BOOLEAN`.

**Impact:** The `safe_increment_seats()` RPC will fail at runtime. The `get_seats_available` RPC also references non-existent `cancelled` column.

---

#### 3. `bookings.booking_token` vs `confirmation_token` — name mismatch breaks confirmations

**Files:** `src/app/api/bookings/route.ts` + `src/app/api/booking-links/[token]/route.ts`

In `POST /api/bookings`:
```typescript
booking_token: bookingToken,  // ✅ inserts as booking_token
```

In `GET /api/booking-links/[token]`:
```typescript
.eq('confirmation_token', token)  // ❌ queries confirmation_token (different column!)
```

In `POST /api/booking-links/[token]` (cancel):
```typescript
.eq('confirmation_token', token)  // ❌ same mismatch
```

The actual bookings table has BOTH `booking_token` AND `confirmation_token` as separate columns (both TEXT). Bookings are created with `booking_token`, but the lookup uses `confirmation_token` — which is always NULL on newly created bookings.

**Impact:** `GET /book/confirmation/[token]` and `POST /book/cancel/[token]` will always return 404 for any booking created via `POST /api/bookings`.

---

#### 4. `students_driver_ed` has no `deleted_at` column — soft deletes broken

**Actual DB:** `students_driver_ed` table has NO `deleted_at` column.

The code in multiple places uses:
```typescript
.is('deleted_at', null)   // students GET
.update({ deleted_at: new Date().toISOString() })  // students DELETE
```

**Migration 003** claims to add `deleted_at TIMESTAMPTZ` to sessions (not students), but:
1. It's not applied to the students table
2. The column doesn't exist in the actual DB for either table

**Impact:** Soft-delete pattern fails silently — no actual data deleted, but no error either (updates succeed on zero rows).

---

#### 5. `schools.monthly_revenue` doesn't exist — demo dashboard always shows $0

**File:** `src/app/api/demo/dashboard/route.ts` (line ~45)

```typescript
const { data: schoolDataRaw } = (admin.from('schools').select('monthly_revenue, name')...)
// ...
const monthlyRevenue = (schoolData as any)?.monthly_revenue || 0
```

Actual `schools` table: NO `monthly_revenue` column. This field doesn't exist in the schema.

**Impact:** Demo dashboard always shows `monthlyRevenue: 0`. KPI card always reads "$0".

---

#### 6. Demo students API selects `enrollment_date` which doesn't exist in students table

**File:** `src/app/api/demo/students/route.ts` (line ~57)

```typescript
.enrollment_date,
```

Actual `students_driver_ed` table: `enrollment_date` is NOT a column. The actual column is `enrollment_date` (it IS in the actual DB — verified via Swagger). Wait — let me recheck... Swagger says `enrollment_date` **is** present. Actually, the Swagger shows:
```
"enrollment_date":{"default":"CURRENT_DATE","format":"date","type":"string"}
```

So `enrollment_date` IS in the actual DB. But the issue is: **migration 003 says it adds `deleted_at` to sessions, not students**. Let me verify the actual `deleted_at` presence by looking at what the code actually queries.

Actually, `students_driver_ed` does NOT have `deleted_at` in the actual DB schema per the Swagger. The code in `GET /api/students` does `.is('deleted_at', null)`. **This query will fail at runtime.**

---

### HIGH

#### 7. `POST /api/schools` bypasses auth in non-DEMO_MODE — anyone can create a school

**File:** `src/app/api/schools/route.ts`

```typescript
// DEMO_MODE: skip auth — school creation is open for demo signups
// The auth link is sent after school creation via magic link
const admin: any = getSupabaseAdmin()
```

No auth check for non-demo mode. Any unauthenticated requester can create unlimited school records.

**Impact:** In production (DEMO_MODE=false), school creation endpoint has zero auth.

#### 8. `POST /api/sessions` — DEMO_MODE bypasses ALL auth, no ownership check

**File:** `src/app/api/sessions/route.ts` (POST handler)

```typescript
if (process.env.DEMO_MODE === 'true') {
  // Bypasses auth entirely — no user, no school ownership check
  const { data: session, error } = await admin.from('sessions').insert({...})
```

In demo mode, ANYONE with the PIN can create sessions for ANY school by setting `x-school-id` header. No verification that the requesting user owns that school.

**Impact:** In demo mode, school-scoped session creation is wide open.

#### 9. `GET /api/sessions` — NO auth guard at all (not even in non-demo mode)

**File:** `src/app/api/sessions/route.ts` (GET handler)

```typescript
// Auth check
const authHeader = request.headers.get('Authorization')
if (!authHeader?.startsWith('Bearer ')) {
  const cookieAuth = await createClient()
  const { data: { user } } = await cookieAuth.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })
}
// ...
const { data: school } = await admin.from('schools').select('id').eq('id', schoolId).single()
if (!school) return new NextResponse('Forbidden', { status: 403 })
```

This LOOKS like it has auth, but critically: **it never verifies the user owns the school**. It checks that the school exists, but not that the authenticated user has any relationship to it. Any authenticated user can query ANY school's sessions by passing `?school_id=X`.

**Impact:** Cross-school data exposure via sessions endpoint.

#### 10. Stripe webhook `auditLog` has a typo: `'stripe-webline'`

**File:** `src/app/api/webhooks/stripe/route.ts` (line ~110)

```typescript
auditLog('SUBSCRIPTION_CANCELLED', 'stripe-webline', {   // ❌ 'stripe-webline' typo
```

Should be `'stripe-webhook'`.

#### 11. `bookings.deposit_paid_at` doesn't exist — webhook updates non-existent column

**File:** `src/app/api/webhooks/stripe/route.ts`

```typescript
.update({
  status: 'confirmed',
  deposit_paid_at: new Date().toISOString(),  // ❌ column doesn't exist
  stripe_payment_intent_id: session.payment_intent,
})
```

Actual bookings table: NO `deposit_paid_at` column. The closest is `cancelled_at` and `confirmation_token`. This update will either fail or silently ignore the non-existent column.

#### 12. Demo routes (`/api/demo/*`) have ZERO auth in non-demo contexts

**Files:** `src/app/api/demo/dashboard/route.ts`, `src/app/api/demo/school/route.ts`, `src/app/api/demo/sessions/route.ts`, `src/app/api/demo/students/route.ts`

All check `DEMO_MODE !== 'true'` and return 403 — but this is NOT auth. It's just a feature flag. If someone bypasses DEMO_MODE check (or if DEMO_MODE env var is misconfigured), these routes are open with no auth whatsoever.

**Impact:** In production, these routes would be completely unauthenticated API endpoints exposing all school data.

---

### MEDIUM

#### 13. `POST /api/bookings` always sets `status = 'pending'` even when `depositAmount === 0`

**File:** `src/app/api/bookings/route.ts`

```typescript
status: depositAmount > 0 ? 'pending' : 'confirmed',
```

If `depositAmount === 0` (edge case where `session_type.deposit_cents` is 0), status becomes `'confirmed'` — but `payment_status` is also `'pending'` in that case. Inconsistent state.

#### 14. `GET /api/students` — school ownership check is correct, BUT the user query does NOT enforce school_id scoping

```typescript
const { data: school } = await supabase
  .from('schools')
  .select('id').eq('id', schoolId).eq('owner_email', user.email).single()
if (!school) return new NextResponse('Forbidden', { status: 403 })
```

This correctly checks ownership. However, if RLS is not properly configured on `students_driver_ed`, a bypass of this check would expose data. (Service role is used for writes, but the GET uses user-context client — RLS must enforce school_id.)

#### 15. `GET /api/demo/students` — unused `enrollment_date` in select

The route selects `enrollment_date` which DOES exist in DB (confirmed via Swagger). But the route also selects `emergency_contact_phone` — which EXISTS in actual DB. The route is functionally OK on this specific point. However, the route selects `dob`, `permit_number` which are encrypted and properly decrypted. Fine.

**Note:** There IS a `deleted_at` issue — the demo students route does NOT filter by `deleted_at` (no soft-delete filter), while `GET /api/students` does. Inconsistency.

---

## SECTION 2: ARCHITECTURAL BLIND SPOTS

### DEMO_MODE Auth Bypass — How It Actually Works

The demo auth system (`POST /api/auth/demo-login`) works like this:

1. User submits email + PIN `0000`
2. Server fetches the fixed `DEMO_SCHOOL_ID` from env
3. Creates/finds a service-role auth user
4. Mints a real Supabase JWT (HS256, using `SUPABASE_JWT_SECRET` or fallback to service role key)
5. Sets `sb-{projectRef}-access-token` + refresh token cookies (real Supabase cookies, HttpOnly)
6. Sets `demo_session` (HttpOnly, base64 JSON with userId, schoolId, exp) + `demo_user` (readable by JS)

**How middleware reads it:**
```typescript
if (process.env.DEMO_MODE === 'true') {
  const demoCookie = request.cookies.get('demo_session')
  if (demoCookie) {
    const session = JSON.parse(Buffer.from(demoCookie.value, 'base64').toString('utf8'))
    if (session.exp > Date.now()) {
      response.headers.set('x-school-id', session.schoolId)  // ✅ validated
```

**Is it safe for production?** NO — the system is designed for demo mode only. The JWT signing uses `SUPABASE_JWT_SECRET ?? serviceKey` — if `SUPABASE_JWT_SECRET` is not set (common in Vercel), it falls back to the service role key, which is a security risk. **The comment says "old Vercel deployments"** — this is an acknowledged edge case but still problematic.

### `demo_session` cookie + middleware — properly gated

The `demo_session` cookie has an expiry (`exp: Date.now() + 7 days`) and is validated in middleware. If expired, middleware clears the cookie and redirects to `/login`. This is correctly implemented.

### `/api/demo/*` routes — data exposure

These routes use `getSupabaseAdmin()` (service role key) to bypass RLS entirely. The auth is ONLY the `demo_user` cookie check. The cookie contains `{schoolId, userId, email, exp}` encoded in base64 (NOT encrypted — just base64). Anyone who can read the cookie can decode it and know the demo school ID. **This is acceptable for DEMO_MODE=true**, but in production (DEMO_MODE=false), the check just returns 403 — so these are effectively unauthenticated endpoints if the flag is wrong.

### `POST /api/students` with `x-school-id` header — now properly gated

**File:** `src/app/api/students/route.ts`

```typescript
let schoolId = request.headers.get('x-school-id')
if (!schoolId) {
  schoolId = user.user_metadata?.school_id  // DEMO_MODE fallback only
}
```

**This is correct.** The `x-school-id` header is the DEMO_MODE fallback, and production always derives from authenticated session. Fixed in Cycle 10.

### `getSupabaseAdmin()` — defined inline in 5+ places

**Files with duplicate inline definitions:**
- `src/app/api/students/[id]/route.ts` — defines its own `getSupabaseAdmin()`
- `src/app/api/webhooks/stripe/route.ts` — defines its own `getSupabaseAdmin()`
- `src/app/api/import/students/route.ts` — defines its own `createSupabaseAdmin`

All three should import from `@/lib/supabase/server` instead. The centralized `getSupabaseAdmin()` in `server.ts` is correct but not universally used.

### `sessions` table — no `start_time`/`end_time`, uses `start_date`/`end_date` TEXT

Code in multiple places assumes `sessions.start_time` exists. The actual table has:
- `start_date` (date)
- `end_date` (date)  
- `status` (text, default 'scheduled')
- NO `start_time`, NO `end_time`, NO `cancelled`

The `get_available_slots` SQL function references `s.start_time` — this will fail.

---

## SECTION 3: DATABASE ISSUES

### Migration vs Actual DB Comparison

| Column/Object | Migration Claims | Actual DB | Status |
|---|---|---|---|
| `sessions.cancelled` | Added in migration 003 | DOES NOT EXIST | ❌ |
| `sessions.start_time` | Added in migration 004 | DOES NOT EXIST | ❌ |
| `sessions.deleted_at` | Added in migration 003 | DOES NOT EXIST | ❌ |
| `students_driver_ed.deleted_at` | Never added | DOES NOT EXIST | ❌ |
| `bookings.deposit_paid_at` | Inferred from booking schema | DOES NOT EXIST | ❌ |
| `schools.monthly_revenue` | Used in dashboard code | DOES NOT EXIST | ❌ |
| `bookings.confirmation_token` | EXISTS in actual DB | EXISTS | ✅ |
| `bookings.booking_token` | EXISTS in actual DB | EXISTS | ✅ |
| `sessions.status` | TEXT, default 'scheduled' | EXISTS | ✅ |
| `schools.owner_email UNIQUE` | Migration 010 (pending) | NOT APPLIED | ❌ |

### Missing Indexes

The actual DB does NOT have these indexes referenced in migrations:
- `idx_sessions_school_date` (migration 003)
- `idx_audit_logs_action` (migration 003)
- `idx_students_deleted` (migration 003)
- `idx_sessions_deleted` (migration 003)
- `idx_bookings_confirmation_token` (migration 004)

Without these indexes, queries at scale will be slow.

### `schools.owner_email` UNIQUE constraint — NOT APPLIED

Migration 010 exists but has NOT been run in Supabase SQL Editor. Duplicate school registrations with the same email are currently possible.

### `payments` table referenced in RLS policies but schema says `payments` exists

Migration 003 creates RLS policy on `payments` table:
```sql
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_payments_all" ON payments FOR ALL TO service_role...
```

The `payments` table IS in the actual DB schema (confirmed via Swagger). But `POST /api/bookings` never inserts into `payments` — there's a `payments` table but it's not used by the booking flow. The `auditLog` for `BOOKING_DEPOSIT_PAID` does NOT insert into `payments` either.

---

## SECTION 4: FRONTEND/UI ISSUES

### Landing page uses ZERO TailwindCSS — pure inline styles

**File:** `src/app/page.tsx` (~450 lines)

The landing page uses ONLY inline JSX `style={{}}` objects. The entire page is hardcoded inline styles. This is NOT using TailwindCSS at all, despite:
- `tailwindcss: "^4"` in package.json
- `@tailwind base/components/utilities` in globals.css
- `CLAUDE.md` saying "Next.js 16 + React 19 + TailwindCSS 4"

The landing page also mixes design systems:
- `DARK = { bg: '#0B0C0E', surface: '#131316', ... }` (from SPEC_FULL_REDESIGN.md design tokens)
- Meanwhile `globals.css` defines `--bg-base: #080809` (different value)
- `design-tokens.css` defines `--bg: #050505` (different value again)

**Three contradictory background values** across three files.

### Design token contradiction

**`src/lib/design-tokens.css`:**
```css
--bg: #050505;
--surface: #0a0a0a;
--accent: #0066FF;
```

**`src/app/globals.css` (dark theme):**
```css
--bg-base: #080809;
--bg-surface: #0F172A;
--accent: #1A56FF;
```

**`src/app/page.tsx` (DARK object):**
```javascript
bg: '#0B0C0E',
surface: '#131316',
accent: '#3B82F6',
```

Three different blue accent values: `#0066FF` vs `#1A56FF` vs `#3B82F6`.

### No loading/error states on dashboard student table

**File:** `src/app/school-admin/students/page.tsx` — not reviewed in detail, but WORKFLOW_LOG Cycle 4 notes: "Sessions page used `school_id` from URL query params" — this was fixed for sessions, but the same pattern likely exists in students page.

### Hardcoded `NEXT_PUBLIC_APP_URL` fallback to `http://localhost:3000`

Multiple files use:
```typescript
const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
```

In production, if `NEXT_PUBLIC_APP_URL` is not set, emails will contain `http://localhost:3000` links. The `.env.production` file exists but it's unknown if `NEXT_PUBLIC_APP_URL` is properly set there.

---

## SECTION 5: CI/CD / DEVOPS BLIND SPOTS

### No pre-push git hook (Husky not installed)

`package.json` has no `husky`, no `lint-staged`, no `prepare` script. Running `npm run typecheck` is NOT automated on commit.

### Vercel auto-deploys without running tests

No Vercel build hook or CI gate. Any push to `main` deploys immediately. No test suite runs in the pipeline.

### `npm run test` — E2E runner doesn't test critical paths

**File:** `tests/e2e/run-all.js`

The test suite tests:
- `GET /api/health` (passes)
- `GET /api/schools` (unauthenticated check)
- `POST /api/schools` (validation + creation)

**Critical paths NOT tested:**
- Student creation (`POST /api/students`)
- Session creation (`POST /api/sessions`)
- Booking creation (`POST /api/bookings`)
- Demo login flow
- Stripe checkout flow
- RLS enforcement (separate file, manual run only)

### `scripts/deepseek-claude` — dead code

This script exists and is listed in `CLAUDE.md` as the execution method. But Cycle 9 explicitly states: "The 'DeepSeek-Claude' script was broken from day one" and "Everest builds directly." This is dead code that misleads anyone reading the workflow.

---

## SECTION 6: WORKFLOW / PROCESS INEFFICIENCIES

### Why 12 cycles for what should have been 3

Root cause: **No initial DB schema verification before writing code.** Every cycle after Cycle 1 was fixing schema mismatches:

- Cycle 3: Encryption at write without decryption at read (schema mismatch in read path)
- Cycle 7: Code assumed columns that don't exist (sessions.cancelled, bookings.confirmation_token, sessions.start_time)
- Cycle 10: POST /api/students auth bypass (x-school-id header trust)

**Systemic issue:** Migrations were written as design documents, not as applied-SQL. The actual Supabase project had a DIFFERENT schema than what migrations described. No one verified the actual DB before writing code against it.

### SPEC.md sprawl

There are 9 stale SPEC*.md files listed in Cycle 8/10 as deleted. Even after cleanup, the project root has:
- `SPEC.md` (archived, per Cycle 10)
- `SPEC_FULL_REDESIGN.md` (active)
- `SPEC_ARCH_FIX.md` (not mentioned in cleanup)

### CLAUDE.md describes aspirational workflow

Cycle 10 explicitly found: "CLAUDE.md described an aspirational workflow (sub-agent with context package) that was never actually implemented." This misleads anyone new to the project about how work actually gets done.

### `scripts/` directory contains 5 scripts, most unused

```
scripts/deepseek-claude    — dead code (broken, never worked)
scripts/deepseek-agent      — unknown if used
scripts/deepseek-task       — unknown if used
scripts/seed-demo-school.ts — used once (Cycle 8)
scripts/seed-demo-school-raw.mjs — used once (Cycle 8)
```

---

## SECTION 7: TESTING GAPS

### Actual test coverage

| Flow | Coverage |
|---|---|
| GET /api/health | ✅ Passes |
| GET /api/schools (unauthenticated) | ✅ Passes |
| POST /api/schools validation | ✅ Passes |
| POST /api/schools creation | ✅ Passes |
| RLS cross-school isolation | ⚠️ Partial — tests explicit filter, not raw query |
| POST /api/students | ❌ NOT tested |
| POST /api/sessions | ❌ NOT tested |
| POST /api/bookings | ❌ NOT tested |
| Demo login flow | ❌ NOT tested |
| Stripe webhook | ❌ NOT tested |
| Public booking page | ❌ NOT tested |
| Cancel/reschedule booking | ❌ NOT tested |
| CSV import | ❌ NOT tested |

### RLS test is ambiguous

The RLS test (`tests/e2e/rls-test.js`) tests explicit `school_id=eq.X` filters, which return the correct rows (since RLS doesn't block explicit filters from service role). The test acknowledges: "RLS APPEARS TO WORK — school_id filter enforced (empty result)" — but the follow-up says "explicit filter bypasses RLS check." The raw query test (no school_id filter) is the real RLS test and is run separately.

---

## SECTION 8: THE BIGGEST BLIND SPOT

### The ONE thing that if fixed, everything else would improve:

**Enforce schema-first development: verify actual DB columns BEFORE writing code that touches them.**

The entire project has been built on assumptions about the database schema that were never verified. Every cycle that fixed a "broken" feature was actually fixing a schema assumption that was wrong. The migrations describe a schema that doesn't match the actual Supabase project.

**Specific systemic issues behind the bug accumulation:**

1. **Migrations are treated as design docs, not applied SQL.** Migration 003 references `sessions.cancelled` which was never in the DB. Migration 004 references `sessions.start_time` which was never added. These migrations were never validated against the actual DB.

2. **No generated Supabase types.** The project uses `as any` casts throughout because there's no `Database` type from `@supabase/supabase-js` codegen. This means TypeScript cannot catch column name mismatches at compile time.

3. **DEMO_MODE is a permanent production vulnerability.** The entire demo auth system is a production-time bomb. If `DEMO_MODE` is ever set to `false` in production but the `/api/demo/*` routes aren't removed, they become unauthenticated admin endpoints.

### Fix order:
1. Generate Supabase types (`npx supabase gen types typescript`)
2. Replace all `as any` casts with properly typed operations
3. Run all migrations against a local Supabase instance (not just the live project)
4. Add typecheck + test to Vercel CI pipeline
5. Remove `DEMO_MODE` routes before production launch

---

## SUMMARY TABLE

| Severity | Count | Top Priority Items |
|---|---|---|
| CRITICAL | 6 | `get_available_slots` broken, `increment_seats_booked` broken, booking confirmation broken (booking_token mismatch), soft deletes broken (no deleted_at), monthly_revenue doesn't exist, students query with deleted_at filter |
| HIGH | 5 | POST /api/schools no auth (non-demo), POST /api/sessions demo bypass, GET /api/sessions no ownership check, stripe webhook typo, deposit_paid_at doesn't exist |
| MEDIUM | 5 | Booking status inconsistency, RLS partial test, inline styles vs Tailwind, three conflicting design tokens, localhost fallback in production |
| LOW | 4 | Dead deepseek-claude script, stale SPEC files, payments table unused, scripts/ not cleaned up |
| INFO | 3 | TypeScript passes, opencode not wired in, no pre-push hooks |

**Total: 23 issues identified.**
