# STATUS.md — The Driving Center SaaS

**Last updated:** 2026-04-25
**Current phase:** Phase 2 (Stripe Subscriptions)
**Next: Phase 3 (First Paying Customers)**

---

## What's Happening Right Now

Phase 2 is partially done — webhook handlers + dashboard banner deployed. SQL migration needs to be run manually in Supabase SQL Editor.

---

## Phase 1 Complete ✅

- [x] P1-A: Student profile edit + TCA + certificate issuance
- [x] P1-B: Session management (create/edit/cancel/duplicate)
- [x] P1-C: Email + SMS reminders wired to OpenClaw cron

---

## Phase 2 Progress

**Done (deployed):**
- Webhook: `checkout.session.completed` → activates school (sets `subscription_status = 'active'`)
- Webhook: `customer.subscription.updated/deleted` → updates status
- Webhook: `invoice.payment_failed` → sets `past_due`
- Dashboard: amber banner when `subscription_status !== 'active'`
- Migration: `006_subscription_status.sql`

**Needs Zax to run SQL in Supabase SQL Editor:**
```sql
ALTER TABLE schools ADD COLUMN subscription_status TEXT DEFAULT 'trial';
ALTER TABLE schools ADD COLUMN subscription_id TEXT;
ALTER TABLE schools ADD COLUMN trial_ends_at TIMESTAMPTZ;
UPDATE schools SET subscription_status = 'trial' WHERE subscription_status IS NULL;
```

---

## FSO Cycle Log

| Cycle | Feature | Result |
|---|---|---|
| 1 | P0-3: Booking confirmation email | ✅ Deployed |
| 2 | P0-4: CSV import | ✅ Deployed |
| 3 | P1-A: Student profile edit + TCA | ✅ Deployed |
| 4 | P1-B: Session management | ✅ Deployed |
| 5 | P1-C: Email + SMS reminders | ✅ Deployed |
| 6 | Phase 2: Subscription flow (webhook + banner) | ✅ Deployed |

---

## What's Blocked

- **SQL migration** — Zax needs to run the SQL in Supabase SQL Editor
- **Stripe keys not configured** — `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_STARTER_PRICE_ID` not in Vercel

---

## Next Actions

1. Run SQL migration in Supabase (Zax — 2 min)
2. Add Stripe keys to Vercel (Zax — 5 min)
3. Phase 3: First paying customer outreach — cold email to 10 TN driving schools