# B.L.A.S.T. Cycle 1 — Execution Log

**Date:** 2026-04-24
**Goal:** Fix school owner auth link

---

## What Was Done

### L — Link: Database verified via REST API
- `schools` table: columns confirmed (no `owner_user_id` column exists yet)
- `students_driver_ed` table: exists with `school_id` column ✅
- `sessions`: school_id is null on all records — UPDATED to link to demo school
- School `id=1576f434-8b52-41fb-a5c4-a21cf3b40086` now has `owner_email=demo@oakridgedriving.com` ✅

### A — Architect: Bugs identified

**Bug 1 — schools INSERT (FIXED in code, was already corrected)**
- `src/app/api/schools/route.ts` already uses `owner_email: email` ✅
- Current state: code is correct, existing school records had NULL owner_email (repaired manually)

**Bug 2 — stripe_customer_id collision**
- Auth callback writes `user.id` into `stripe_customer_id` as owner claim
- Stripe webhook writes real Stripe customer ID (`cus_xxx`) into `stripe_customer_id`
- Collision: one overwrites the other
- Fix needed: Add `owner_user_id` column to schools table, auth callback writes there instead

**Bug 3 — complete-profile page dead end**
- School owners have no `students_driver_ed` record
- Page queries by permit_number = 'PENDING' → finds nothing → "Not authenticated"
- Fix needed: separate school owner flow from student flow

**Bug 4 — DEMO_OWNER_EMAIL not in Vercel**
- Ops panel locked for everyone (access check always fails)
- Fix needed: add to Vercel dashboard

---

## What Needs to Be Done

### 1. Run this SQL in Supabase SQL Editor (manual step)

```sql
-- Add owner_user_id column to separate auth claim from Stripe customer ID
ALTER TABLE schools ADD COLUMN owner_user_id UUID;

-- Update existing school to set owner_user_id (claim the school)
UPDATE schools SET owner_user_id = '00000000-0000-0000-0000-000000000001'
WHERE id = '1576f434-8b52-41fb-a5c4-a21cf3b40086';
```

### 2. Fix complete-profile page
- Add school owner detection → redirect school owners to /school-admin/profile
- File: `src/app/complete-profile/page.tsx`

### 3. Add DEMO_OWNER_EMAIL to Vercel
- Key: `DEMO_OWNER_EMAIL`
- Value: `demo@oakridgedriving.com` (or matt@thedrivingcenter.org for production)
- Add via: Vercel Dashboard → Project Settings → Environment Variables

### 4. Update auth callback
- Change `stripe_customer_id` write → `owner_user_id` write
- File: `src/app/auth/callback/route.ts`

---

## Status

| Fix | Status |
|-----|--------|
| schools INSERT correct | ✅ Code fixed previously |
| Existing school owner_email | ✅ Repaired via API |
| Sessions linked to school | ✅ Repaired via API |
| owner_user_id column | ❌ Needs SQL migration |
| Auth callback → owner_user_id | ❌ Code change needed |
| complete-profile school owner redirect | ❌ Code change needed |
| DEMO_OWNER_EMAIL in Vercel | ❌ Manual add needed |