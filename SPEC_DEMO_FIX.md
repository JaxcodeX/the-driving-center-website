# SPEC.md — School→Auth Link Fix

**Feature:** Magic link auth users must be linked to their school on signup
**Date:** 2026-04-24
**Status:** READY TO IMPLEMENT
**Priority:** P0 — foundation for everything

---

## Problem

When a school owner signs up:
1. `/api/schools` creates a `schools` record ✅
2. Magic link sent to owner's email ✅
3. Owner clicks magic link → `/auth/callback` → session created ✅
4. **BROKEN:** `schools.owner_id` is never set
5. **BROKEN:** `auth.users.user_metadata.school_id` is never set
6. **RESULT:** RLS blocks the owner from their own data. Dashboard is empty.

---

## Solution

Two changes only:

### Change 1 — Fix auth callback

**File:** `src/app/auth/callback/route.ts`

After `exchangeCodeForSession` succeeds:
1. Get `user.email` from the session
2. Query `schools` table for row where `email = user.email` AND `owner_id IS NULL` (takes the most recently created one)
3. If found: `UPDATE schools SET owner_id = user.id`
4. `UPDATE auth.users` via admin client: set `user_metadata.school_id = school.id`
5. Redirect to the requested path

**Code pattern:**
```typescript
// After successful code exchange
const { data: { user } } = await supabase.auth.getUser()

// Find the school this user owns (by email, unclaimed)
const { data: school } = await supabaseAdmin
  .from('schools')
  .select('id, name')
  .eq('email', user.email)
  .is('owner_id', null)
  .order('created_at', { ascending: false })
  .limit(1)
  .single()

if (school) {
  // Link school → owner
  await supabaseAdmin.from('schools')
    .update({ owner_id: user.id })
    .eq('id', school.id)
  
  // Set school_id on the auth user so RLS works
  await supabaseAdmin.auth.admin.updateUserById(user.id, {
    user_metadata: { school_id: school.id, ...user.user_metadata }
  })
}
```

### Change 2 — Fix onboarding page

**File:** `src/app/onboarding/page.tsx`

Currently: reads `school_id` only from URL param (`?school_id=XXX`)
Problem: refresh page → `school_id` gone → onboarding broken

Fix: also check `user.user_metadata.school_id` from the auth session.
```typescript
const { data: { user } } = await supabase.auth.getUser()
const schoolIdFromUrl = params.get('school_id')
const schoolId = schoolIdFromUrl || user?.user_metadata?.school_id
```

---

## Files to Modify

| File | Change |
|---|---|
| `src/app/auth/callback/route.ts` | Add school→user linking after code exchange |
| `src/app/onboarding/page.tsx` | Fall back to user metadata for school_id |

## Files NOT to modify
- `/api/schools` — works fine
- `/signup` — works fine
- `/api/webhooks/stripe` — works fine
- Any RLS policies — don't touch

---

## Success Criteria

- [ ] Owner clicks magic link → `schools.owner_id` is set to their auth user ID
- [ ] Owner's `user_metadata.school_id` is populated after first login
- [ ] Owner lands on `/school-admin` → sees their school data (not empty)
- [ ] Owner can refresh `/school-admin` without losing access (no URL param required)
- [ ] `npm run build` passes
- [ ] Demo school (Oak Ridge, id: `00000000-0000-0000-0000-000000000001`) still loads correctly

## Notes

- Use `getSupabaseAdmin()` for all writes to `auth.users` and `schools` — these bypass RLS
- The onboarding redirect from Stripe (`success_url`) still works — owner arrives with `?school_id=` in URL. This fix makes the flow work even without that param.
- Demo school has no auth user — no conflict with the email-matching logic
