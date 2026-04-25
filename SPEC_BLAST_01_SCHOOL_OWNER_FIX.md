# SPEC.md Addendum — Additional Fixes (B.L.A.S.T. Cycle 1 continued)

## Bug Fix: stripe_customer_id collision

### Problem
The auth callback uses `stripe_customer_id` as an owner claim token (stores `user.id` after magic link click). But the Stripe checkout flow ALSO writes the real Stripe customer ID (`cus_xxx`) into `stripe_customer_id` after checkout. These two uses collide — whoever writes last wins, and the owner claim is lost.

### Fix
Split into two fields:
- `owner_user_id` (UUID) — set by auth callback, holds the auth user's ID, never touched by Stripe
- `stripe_customer_id` (TEXT) — set by Stripe checkout, holds real Stripe customer ID

Add `owner_user_id` column to schools table via Supabase direct API.

### Files to change
- Migration SQL (add `owner_user_id` column)
- Auth callback (write to `owner_user_id`, not `stripe_customer_id`)
- Stripe webhook (writes to `stripe_customer_id` as now)
- RLS policies (use `owner_user_id` for owner check)

---

## Bug Fix: School owner dead end at /complete-profile

### Problem
School owners have no `students_driver_ed` record. When they hit `/complete-profile`, the page queries `students_driver_ed` by permit number = 'PENDING', finds nothing, and shows "Not authenticated."

### Fix
In the complete-profile page server component:
1. Check if user has `school_id` in metadata
2. If yes AND no student record found → redirect to `/school-admin/profile` (school owner flow)
3. If no school_id → student flow continues as now

### Files to change
- `src/app/complete-profile/page.tsx` — add school owner detection and redirect