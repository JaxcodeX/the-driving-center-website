# SPEC.md — Phase 1D: Critical Infrastructure Fixes

**Date:** 2026-04-26
**Status:** Active
**Goal:** Clear every remaining critical before first prospect demo

---

## What Phase 1D Fixes (and Why)

These are not features. These are the things that if broken, kill the business:

1. **Webhook idempotency** — Stripe sends events twice. Without `processed_stripe_events`, double-charges possible.
2. **Seats race condition** — two students book the same session simultaneously. Without `safe_increment_seats()`, one gets a seat that doesn't exist.
3. **Subscription middleware** — a canceled school still has dashboard access. They see real student data they shouldn't.
4. **RLS not tested** — school A querying school B's data. This is the worst possible bug. We haven't proven it can't happen.
5. **CSV import** — schools can't bulk-load their existing students. Manual entry for 50 students is a deal-killer.

---

## What You Must Do (Zax — 5 min Supabase SQL Editor)

**Migration 008 (webhook idempotency):**
```sql
CREATE TABLE IF NOT EXISTS processed_stripe_events (
  event_id TEXT PRIMARY KEY,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Migration 007 (seats increment):**
```sql
CREATE OR REPLACE FUNCTION safe_increment_seats(session_uuid UUID)
RETURNS SETOF sessions AS $$
DECLARE
  current_seats integer;
  max_seats integer;
BEGIN
  SELECT seats_booked, max_seats INTO current_seats, max_seats
  FROM sessions WHERE id = session_uuid FOR UPDATE;
  IF current_seats >= max_seats THEN
    RAISE EXCEPTION 'Session is fully booked';
  END IF;
  UPDATE sessions SET seats_booked = current_seats + 1 WHERE id = session_uuid;
  RETURN QUERY SELECT * FROM sessions WHERE id = session_uuid;
END;
$$ LANGUAGE plpgsql;
```

---

## Implementation Plan (DeepSeek Generates)

### Fix 1: Subscription Status Middleware
**File:** `src/middleware.ts`
**What:** Every request to `/school-admin/*` checks `subscription_status` from the school. If `canceled` or `past_due`, redirect to `/billing`. Skip check if `DEMO_MODE=true`.

### Fix 2: RLS Test Script
**File:** `tests/e2e/rls-test.js`
**What:** Node.js script that:
1. Creates school A (with service role key)
2. Creates school B (with service role key)
3. Uses school B's anon key to try to query school A's students via REST API
4. If response has rows → RLS BROKEN (critical)
5. If 403/empty → RLS working (secure)

### Fix 3: Wire email/SMS (stubs → real)
**Files:** `src/lib/email.ts`, `src/lib/twilio.ts`
**What:** Read RESEND_API_KEY + TWILIO_* from env. If present, send real emails/SMS. If not, continue stub mode (log only).

### Fix 4: CSV Import
**File:** `src/app/api/import/students/route.ts` (currently stub)
**What:**
- Accepts multipart CSV upload
- Parses columns: name, email, phone, permit_number, dob, parent_email
- Validates each row — returns preview with error count
- Bulk inserts valid rows
- Returns: `{ created: N, errors: [{ row: N, error: '...' }] }`

---

## Out of Scope

- Student booking wizard changes
- New frontend pages
- Marketing/email sequences
- Stripe live key swap

---

## Success Criteria

- [ ] Migration 007 + 008 run in Supabase SQL Editor
- [ ] `npm run test:e2e` passes (basic API tests green)
- [ ] `tests/e2e/rls-test.js` confirms no cross-school data leak
- [ ] Subscription middleware deployed and working
- [ ] CSV import creates students in test school
