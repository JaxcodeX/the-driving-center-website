# SPEC.md — Critical Schema Fix
**Date:** 2026-04-26
**Priority:** P0 — Fix broken bookings flow

---

## Problem

Code assumes database columns that don't exist in `evswdlsqlaztvajibgta`:

| Code expects | Actual DB |
|---|---|
| `bookings.session_id` (UUID FK) | Not exists — use `session_date` + `session_time` TEXT |
| `bookings.deposit_amount_cents` | Not exists |
| `bookings.confirmation_token` | `booking_token` (TEXT) |
| `bookings.cancellation_reason` | Not exists |
| `bookings.cancelled_at` | Not exists |
| `sessions.cancelled` (bool) | `sessions.status` (TEXT: 'scheduled'/'cancelled') |
| `sessions.start_time` | Not exists |

**Result:** `POST /api/bookings` throws 500 on every call.

---

## Step 1 — Migration 009: Add Missing Columns to `bookings`

```sql
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES sessions(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deposit_amount_cents INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS confirmation_token TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
```

Run in Supabase SQL Editor.

---

## Step 2 — Fix `POST /api/bookings`

- Use `session_id` (UUID FK from sessions.id) for proper relational join
- Insert `deposit_amount_cents` + `confirmation_token`
- Keep `session_date` + `session_time` for display purposes
- Replace `.eq('cancelled', false)` with `.eq('status', 'scheduled')`

## Step 3 — Fix `GET /api/sessions` query

- Replace `.eq('cancelled', false)` → `.eq('status', 'scheduled')`
- Remove `sessions.start_time` references

## Step 4 — Add Auth to `/api/schools` POST

Add `getUser()` check + school ownership verification before creating school.

## Step 5 — Centralize `getSupabaseAdmin()`

7 files define it inline. Replace all with import from `@/lib/supabase/server`.

## Step 6 — Run RLS Test

Execute `tests/e2e/rls-test.js` to confirm tenant isolation works.

## Step 7 — Force Vercel Production Redeploy

Push dummy commit to force GitHub→production deployment.

---

## Schema Summary (Actual — Source of Truth)

**bookings:** `id, school_id, session_type_id, instructor_id, session_date, session_time, student_name, student_email, student_phone, status, payment_status, stripe_payment_intent_id, booking_token, notes, created_at, reminder_48h_sent, reminder_4h_sent`

**sessions:** `id, start_date, end_date, max_seats, seats_booked, created_at, school_id, instructor_id, session_type_id, status, location`

**students_driver_ed:** `id, legal_name, permit_number, dob, parent_email, contract_signed_url, classroom_hours, driving_hours, certificate_issued_at, class_session_id, created_at, permit_expiration, date_of_birth, address_street, address_city, emergency_contact_name, emergency_contact_phone, signature_url, school_id, enrollment_date, completion_date, certificate_number, reminder_72h_sent, reminder_24h_sent, dob_encrypted, permit_encrypted`

**session_types:** `id, school_id, name, description, duration_minutes, price_cents, deposit_cents, color, tca_hours_credit, active, created_at`