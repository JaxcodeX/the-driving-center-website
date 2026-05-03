# SPEC — Booking Loop Fix

## Problem

The booking confirmation page (`/book/confirmation`) calls the wrong API endpoint:
- **Broken:** `GET /api/bookings/${token}` — requires `school_id` + authenticated user
- **Correct:** `GET /api/booking-links/${token}` — looks up by `confirmation_token`

Result: confirmation page always fails or shows "pending" even after successful Stripe payment.

---

## Fix 1: Confirmation page → correct endpoint

`src/app/book/confirmation/page.tsx`

Change the fetch URL from `/api/bookings/${token}` to `/api/booking-links/${token}`.

```typescript
// Before
fetch(`/api/bookings/${token}`)

// After
fetch(`/api/booking-links/${token}`)
```

## Fix 2: Checkout success URL → point to confirmation page

`src/app/api/bookings/[id]/checkout/route.ts` (or wherever checkout redirect URL is set)

The Stripe success URL should be: `/book/confirmation?token=${booking_token}`

Verify the success URL uses `booking_token` (not `booking_id`).

## Fix 3: Stripe webhook → ensure status update is robust

The webhook at `/api/webhooks/stripe` updates booking status on payment success. Verify:
1. It handles `payment_intent.succeeded`
2. It updates booking status to `confirmed`
3. Idempotency is working (no double-charges)

---

## Scope

- UI: `src/app/book/confirmation/page.tsx`
- Checkout redirect: `src/app/api/bookings/[id]/checkout/route.ts`
- Webhook: `src/app/api/webhooks/stripe/route.ts`

No new features. No schema changes. Fixing the broken link only.

---

## Success Criteria

1. After paying via Stripe, user lands on `/book/confirmation?token=<token>` and sees booking details
2. Booking status shows as confirmed (not pending)
3. `npm run build` passes with 0 errors
