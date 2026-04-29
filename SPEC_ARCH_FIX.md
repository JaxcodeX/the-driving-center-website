# SPEC_ARCH_FIX.md — Supabase Client Architecture Fix

**Date:** 2026-04-28
**Status:** IN PROGRESS
**Root issue:** Multiple API routes call `await createClient()` expecting an admin client but getting a user-context client instead. Admin operations silently run with user-level RLS restrictions.

---

## Problem Description

`src/lib/supabase/server.ts` exports:
- `createClient()` → user-context server client (respects RLS based on session cookie)
- `getSupabaseAdmin()` → singleton service-role client (bypasses RLS)

Several API routes do `await createClient()` twice — once for user auth, once for "admin" operations — but both calls return user-context clients. The admin operations then run with RLS restrictions, meaning:
- Cross-school data could leak (RLS not enforcing correctly in some query shapes)
- Audit log writes could fail silently
- Billing/school operations could fail

**Specifically broken:**
1. `src/app/api/notify/welcome/route.ts:17` — `await createClient()` used for school lookup
2. `src/app/api/bookings/[booking_id]/checkout/route.ts:22` — `await createClient()` used for booking/school queries
3. `src/app/api/instructors/route.ts:44` — `await createClient()` used for instructor insert
4. `src/app/api/students/[id]/tca/route.ts:62,99` — `await createClient()` used for student lookups/updates
5. `src/app/api/booking-links/[token]/route.ts:66` — `await createClient()` used for booking confirmation

---

## Fix Pattern

For every route that needs admin access:

```typescript
// BEFORE (BROKEN)
const supabase = await createClient()  // user context
const supabaseAdmin = await createClient()  // ALSO user context — wrong!

// AFTER (CORRECT)
const supabase = await createClient()  // user context — for auth checks
const supabaseAdmin = getSupabaseAdmin()  // service role — for data operations
```

**Rule:** `createClient()` is for auth/session operations. `getSupabaseAdmin()` is for all data mutations, inserts, updates, and cross-school reads.

---

## Files to Fix

| File | Change |
|---|---|
| `src/app/api/notify/welcome/route.ts` | `await createClient()` → `getSupabaseAdmin()` |
| `src/app/api/bookings/[booking_id]/checkout/route.ts` | `await createClient()` → `getSupabaseAdmin()` |
| `src/app/api/instructors/route.ts` | `await createClient()` → `getSupabaseAdmin()` |
| `src/app/api/students/[id]/tca/route.ts` | `await createClient()` → `getSupabaseAdmin()` (2 occurrences) |
| `src/app/api/booking-links/[token]/route.ts` | `await createClient()` → `getSupabaseAdmin()` |
| `src/app/api/students/route.ts` | `await createClient()` → `getSupabaseAdmin()` (POST handler) |

---

## Also Fix: Inconsistent Admin Import Patterns

Routes use THREE different ways to get admin client:
1. `getSupabaseAdmin()` from `@/lib/supabase/server` ← **CORRECT**
2. `createSupabaseAdmin()` from `@supabase/supabase-js` (inline, creates new client each call) ← **ACCEPTABLE but inconsistent**
3. `await createClient()` expecting admin ← **WRONG**

After fixing the broken `await createClient()` calls, we should standardize on `getSupabaseAdmin()` for all admin operations.

---

## Migration 010

`src/lib/migrations/010_schools_owner_email_unique.sql` — needs running in Supabase SQL Editor.

---

## Testing

After fixes, run:
```bash
npm run typecheck
node tests/e2e/run-all.js
```