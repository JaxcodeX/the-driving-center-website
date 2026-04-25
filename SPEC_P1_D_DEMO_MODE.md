# SPEC: Demo Mode Bypass — P1-D

## Why
Stripe test mode requires full account onboarding (identity, bank account, tax info) which is blocked for sandbox-only accounts. The ops panel cannot be tested without the full school creation flow working. Demo mode lets us test the entire operator workflow before Stripe is wired.

## What
- Add `DEMO_MODE=true` env var
- When set: `/api/schools` creates school + skips Stripe checkout → redirects to `/onboarding?school_id=...`
- When unset: normal Stripe checkout flow (production-ready when Stripe is wired)
- Signup page shows subtle "Demo Mode" indicator so it's clear this isn't a real billing event

## Spec
### `/api/schools` (POST)
```typescript
if (process.env.DEMO_MODE === 'true') {
  // Create school, skip Stripe, return onboarding URL directly
  return NextResponse.json({
    schoolId: school.id,
    slug: school.slug,
    checkoutUrl: `${origin}/onboarding?school_id=${school.id}&step=profile`,
  })
}
// Normal Stripe flow unchanged
```

### Signup page
- Subtle "Demo Mode" badge at top of form when `DEMO_MODE=true`
- Banner: "Free demo — no payment required"
- Removes any payment/charge language from CTA

### Env var
- `DEMO_MODE=true` in Vercel (development/demo)
- Absent or `false` = production Stripe flow

## Deploy
1. Add `DEMO_MODE=true` to Vercel env vars
2. Modify `/api/schools/route.ts`
3. Update signup page
4. Redeploy