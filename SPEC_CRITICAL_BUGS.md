# SPEC.md — Critical Bug Fixes (Phase P0)

**Date:** 2026-04-26
**Priority:** P0 — All bugs blocking core functionality

---

## Bug 1 — `owner_id` doesn't exist (CRITICAL)

**What:** Every school-admin frontend page queries `.eq('owner_id', user.id)` — column doesn't exist in DB. Auth callback correctly writes `owner_user_id` but frontend uses wrong column name.

**Files to fix:**
- `src/app/school-admin/layout.tsx` — line 140
- `src/app/school-admin/page.tsx` — line 136
- `src/app/school-admin/students/page.tsx` — lines 69, 157
- `src/app/school-admin/sessions/page.tsx` — lines 35, 55, 131
- `src/app/school-admin/instructors/page.tsx` — lines 93, 110
- `src/app/school-admin/calendar/page.tsx` — line 33
- `src/app/school-admin/billing/page.tsx` — line 33 (billing also uses `stripe_customer_id` fallback)

**Fix:** Replace all `.eq('owner_id', user.id)` → `.eq('owner_user_id', user.id)`

---

## Bug 2 — Students page field names don't match DB (HIGH)

**What:** `students/page.tsx` types + queries expect `name`, `email`, `phone`, `status` fields on students. Actual DB has `legal_name` (encrypted), `parent_email`, `emergency_contact_phone`.

**Actual students_driver_ed columns:** `id, legal_name, permit_number, dob, parent_email, contract_signed_url, classroom_hours, driving_hours, certificate_issued_at, class_session_id, created_at, permit_expiration, date_of_birth, address_street, address_city, emergency_contact_name, emergency_contact_phone, signature_url, school_id, enrollment_date, completion_date, certificate_number, reminder_72h_sent, reminder_24h_sent, dob_encrypted, permit_encrypted`

**Fix:**
- Update Student type to match actual DB columns
- Query `parent_email` instead of `email`
- Handle encrypted `legal_name` (show `[REDACTED]` or call decrypt)
- Remove `status` from query (doesn't exist on students table — use `certificate_issued_at` for completion state)

---

## Bug 3 — Sessions page queries non-existent columns (MEDIUM)

**What:** `sessions/page.tsx` queries:
- `supabase.from('students').select('id, name')` — `name` column doesn't exist
- `supabase.from('instructors').select('id, name').eq('status', 'active')` — `status` column may not exist on instructors
- `supabase.from('session_types').select('id, name, duration_minutes').eq('active', true)` — `active` column may not exist

**Actual instructors columns:** `id, school_id, name, email, phone, license_number, license_expiry, active, created_at`
- `active` EXISTS ✅ (boolean)

**Actual session_types columns:** `id, school_id, name, description, duration_minutes, price_cents, deposit_cents, color, tca_hours_credit, active, created_at`
- `active` EXISTS ✅ (boolean)

**Fix:**
- `students` → use `legal_name` (encrypted, display `[REDACTED]`) or add decryption call
- Remove `.eq('status', 'active')` from students query (status column doesn't exist on students table)

---

## Bug 4 — Stripe price ID env var may crash payment flow (MEDIUM)

**What:** `/api/schools` POST has:
```typescript
line_items: [{ price: process.env.STRIPE_STARTER_PRICE_ID!, quantity: 1 }]
```
No fallback if env var missing.

**Fix:** Add null check + fallback, or log a warning on startup.

---

## Bug 5 — Duplicate design token blocks (MEDIUM)

**What:** Every page has `const T = { bg: ..., surface: ..., ... }` hardcoded inline. 10+ files.

**Fix:** Create `src/lib/design-tokens.ts` with exported `T` object. Import in all pages.

---

## Note on Supabase Generated Types

Do NOT regenerate Supabase types from the current project — the actual DB schema will not match what the generator produces. All API routes and pages using `any` casting on Supabase clients is the correct pattern for this project until the Supabase project is fully schema-audited.