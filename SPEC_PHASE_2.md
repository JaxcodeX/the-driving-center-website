# SPEC.md — Phase 2: Stripe Subscription Flow

## What it does
Gate `/school-admin` behind active Stripe subscription. Schools are created but not granted admin access until payment succeeds.

## Current flow (broken)

1. `/signup` → POST `/api/schools` → creates school in Supabase → starts Stripe checkout
2. Stripe redirects to `/onboarding?school_id=X` on success
3. Magic link sent via Supabase — user clicks → `/auth/callback` → `/onboarding`
4. `/onboarding` → school owner sets up their profile → redirected to `/school-admin`

**Problem:** School admin is accessible immediately after magic link — no subscription check. Anyone can bypass Stripe by creating a school and clicking the magic link.

## What to build

### 1. Subscription status check on school admin pages

In `src/app/school-admin/page.tsx` (and all school-admin sub-pages), check subscription status before showing content.

The school has `stripe_customer_id` (written after checkout session created). We can use the Stripe API to check subscription status:

```typescript
const subscription = await stripe.subscriptions.list({
  customer: school.stripe_customer_id,
  limit: 1,
})
const isActive = subscription.data[0]?.status === 'active'
```

If not active: show a "Payment required" banner + link to update billing. Do NOT block the page entirely — they can see the dashboard but all write operations are gated.

**Simpler approach:** Add a `subscription_status` field to the schools table (`trial | active | past_due | cancelled`). Update it via webhook. Check it in the dashboard.

### 2. Webhook: activate school on `checkout.session.completed`

When Stripe confirms payment for a school signup (`metadata.school_id` present, no `booking_id`), set school's `subscription_status = 'active'` and clear any trial expiration.

### 3. Webhook: handle subscription lifecycle events

```
customer.subscription.updated  → update plan_tier + subscription_status
customer.subscription.deleted   → set subscription_status = 'cancelled'
invoice.payment_failed          → set subscription_status = 'past_due'
```

### 4. Schools table migration

Add `subscription_status TEXT DEFAULT 'trial'` and `subscription_id TEXT` to schools table. This avoids calling Stripe API on every dashboard load.

### 5. Dashboard banner

If `subscription_status !== 'active'`, show a dismissible banner:
" subscription not active — click to update billing"

## API changes

### `POST /api/webhooks/stripe` (update)
Add handling for:
- `checkout.session.completed` with `metadata.school_id` (no `booking_id`) → activate trial school
- `customer.subscription.updated` → update plan + status
- `customer.subscription.deleted` → mark cancelled
- `invoice.payment_failed` → mark past_due

### `GET /api/schools/[id]/subscription` (new)
Return subscription status for the authenticated school owner. Called by the dashboard on load.

## UI changes

### School admin dashboard
- On load: fetch subscription status
- If not active: show banner with Stripe billing portal link

## Files to change

- `src/app/api/webhooks/stripe/route.ts` — add subscription lifecycle handlers
- `src/app/school-admin/page.tsx` — fetch and display subscription status banner
- `src/lib/migrations/006_subscription_status.sql` — add fields to schools table

## Out of scope
- Stripe billing portal integration (use `stripe.billingPortal.sessions.create`)
- $25 setup fee discussion
- Referral program

## Success criteria
1. New school created via `/signup` → redirected to Stripe → pays → lands on `/school-admin` with active status
2. School that hasn't paid: dashboard shows banner, read-only view works, write operations are gated
3. Subscription cancelled in Stripe dashboard → school admin shows "cancelled" banner within minutes (webhook)

## Database migration

```sql
ALTER TABLE schools ADD COLUMN subscription_status TEXT DEFAULT 'trial';
ALTER TABLE schools ADD COLUMN subscription_id TEXT;
ALTER TABLE schools ADD COLUMN trial_ends_at TIMESTAMPTZ;
```