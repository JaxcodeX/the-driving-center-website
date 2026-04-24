# Architecture Cleanup — SPEC.md
**Project:** The Driving Center SaaS
**Date:** 2026-04-23
**Conductor:** Everest (Everest)
**Coding Agent:** Claude Code (implementer)
**Branch:** `fix/seats-bug-Rw04-cleanup`

---

## Context

The Notion BOS identified several high-priority issues (`[RW-01]` through `[RW-13]`). Three are confirmed present in the codebase and form the scope of this cleanup. Additionally, two security/auth issues were discovered during code review. All changes committed to a dedicated branch for PR review before merging to `main`.

---

## What Needs to Be Done

### Bug Fixes

**A — `[RW-04]` `seats_booked` double-increment on pending booking creation**
- **File:** `src/app/api/bookings/route.ts`
- **Problem:** `POST /api/bookings` increments `seats_booked` immediately when a pending booking is created. If the booking is never paid, seats are leaked (reserved but never freed).
- **Fix:** Remove `seats_booked++` from booking creation. Seats should only be incremented when payment is confirmed.

**B — `[RW-04]` `seats_booked` NOT incremented on Stripe deposit payment**
- **File:** `src/app/api/webhooks/stripe/route.ts`
- **Problem:** The webhook sets booking to `confirmed` but does NOT increment `seats_booked`. The seats increment only exists in the legacy school-signup branch.
- **Fix:** In the booking-deposit branch (when `booking_id` metadata exists), call the `increment_seats_booked` RPC after confirming the booking.

**C — `[RW-06]` Pending booking expiry / seat deadlock**
- **File:** `src/app/api/bookings/route.ts`
- **Problem:** If a booking sits at `pending` forever (user starts checkout but abandons), `seats_booked` will have been incremented (once fix B is applied) but the seat is never actually consumed. We need an RPC to decrement seats for expired pending bookings, or handle it in the booking creation flow more carefully.
- **Fix:** After fixing A and B, the cleanest solution: when a new booking is created (pending_payment), increment seats immediately. Then if the Stripe webhook fails or times out, we should also handle the `checkout.session.expired` event type in the webhook to decrement seats if needed. Also add `checkout.session.expired` handler.

### Security / Auth

**D — Stripe webhook uses anon Supabase client (RLS exposure)**
- **File:** `src/app/api/webhooks/stripe/route.ts`
- **Problem:** `createClient()` uses the ANON key with RLS enforced. Stripe webhooks have no user session — they should use the SERVICE ROLE key directly.
- **Fix:** Import `createClient as createSupabaseServer` from the server lib and replace with a direct service-role client. Actually, the existing code uses `supabase.from(...).update(...)` on bookings and payments — RLS on these tables blocks service-role operations. For webhooks, we need a dedicated admin client that bypasses RLS. Look at how `seed/route.ts` does it — it imports `@supabase/supabase-js` directly with `SUPABASE_SERVICE_ROLE_KEY`.

**E — No `school_id` ownership check on session DELETE**
- **File:** `src/app/api/sessions/[id]/route.ts` — `DELETE`
- **Problem:** The delete uses `x-school-id` header but doesn't verify the session belongs to that school before soft-cancelling. Any authenticated user who knows a session ID could delete any school's session.
- **Fix:** Add a ownership check: first fetch the session, verify `school_id` matches the header, then perform the soft delete. Same check needed for the `PUT` endpoint.

**F — Same `school_id` ownership gap in instructors DELETE**
- **File:** `src/app/api/instructors/[id]/route.ts` — `DELETE`
- **Fix:** Same pattern — verify the instructor belongs to the requesting school before delete.

### Schema Audit

**G — Verify production schema vs migration files**
- **Files:** `src/lib/migrations/001_*.sql` through `005_*.sql`
- **Problem:** The live DB schema was discovered via live probe — columns may differ from what migration files describe. API routes should be resilient to column drift (they already use dynamic probes for some operations).
- **Fix:** No code changes. For reference only — this is a known gap. Mark to review schema vs migrations when Supabase is accessible from local dev.

---

## Implementation Order

1. **Fix B first** (webhook increments seats on payment) — since this is the primary data correctness issue
2. **Fix A** (remove premature seats increment from booking creation)
3. **Fix C** (handle `checkout.session.expired` in webhook)
4. **Fix D** (webhook uses service role client)
5. **Fix E** (session ownership check on DELETE + PUT)
6. **Fix F** (instructor ownership check on DELETE)
7. **Verify** — run `npm run build`, confirm zero errors, `git diff` each file before committing

---

## Files to Modify

```
src/app/api/bookings/route.ts                    ← A, C
src/app/api/webhooks/stripe/route.ts             ← B, C, D
src/app/api/sessions/[id]/route.ts               ← E
src/app/api/instructors/[id]/route.ts            ← F
```

---

## Success Criteria

- [ ] `npm run build` passes with zero errors
- [ ] `seats_booked` only incremented after confirmed payment (not on booking creation)
- [ ] Stripe webhook uses service role client (no RLS blocking)
- [ ] Session/instructor DELETE/PUT verified against school ownership
- [ ] All changes on branch `fix/seats-bug-Rw04-cleanup`, one commit per file
- [ ] PR ready for review before merging to `main`
