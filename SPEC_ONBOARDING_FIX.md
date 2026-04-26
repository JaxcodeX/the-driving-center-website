# SPEC: Onboarding Profile Save Fix

## Problem

`StepProfile` uses `form.slug` (e.g. `"wilson-driving"`) as the API URL for the PUT request:
```
PUT /api/schools/wilson-driving  →  404 (school not found)
```

The API looks up schools by their **full slug** (e.g. `"wilson-driving-academy-1777163068-mof10b7m"`), not the partial user-typed slug. The school was created with the full slug at signup, but `StepProfile` only knows the short version.

## Root Cause

1. Signup creates school with full slug: `wilson-driving-academy-1777163068-mof10b7m`
2. Redirect: `/onboarding?school_id=UUID&step=profile`
3. `schoolSlug` in parent state is set from URL params (not from school creation response)
4. `StepProfile` sees only the short slug in `form.slug`
5. PUT goes to `/api/schools/wilson-driving` → 404

## Fix

**In `onboarding/page.tsx`:**
1. Add `schoolSlug` prop to `StepProfile` (pass the full slug from parent state)
2. Initialize `form.slug` with the full slug on mount (via a `useEffect`)
3. PUT to `/api/schools/${fullSlug}` instead of `/api/schools/${form.slug}`

```tsx
// Parent passes full slug down
{step === 2 && <StepProfile onNext={advance} schoolId={schoolId} schoolSlug={schoolSlug} onSlug={setSchoolSlug} />}

// StepProfile initializes with full slug
useEffect(() => {
  if (schoolSlug) {
    setForm(prev => ({ ...prev, slug: schoolSlug }))
  }
}, [schoolSlug])

// PUT uses full slug
const res = await fetch(`/api/schools/${schoolSlug || form.slug}`, {
```

## Files Changed
- `src/app/onboarding/page.tsx` — StepProfile component and parent step routing

## Verification
1. Sign up → gets redirected to onboarding
2. Fill in profile → click Save → no 404
3. `school_profiles` table has a new row for the school_id
4. Proceed to next onboarding step