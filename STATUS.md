# STATUS.md — The Driving Center SaaS
**Updated: 2026-04-26** (honest audit)

---

## What Works Right Now

**Signup → Dashboard (DEMO_MODE):**
- ✅ School signup → creates real school in Supabase → redirect to onboarding
- ✅ Onboarding flow steps 1-4 working end-to-end
- ✅ Step 5 (First Session) creates session via DEMO_MODE bypass
- ✅ Student booking wizard (5-step, Stripe checkout)
- ✅ School admin dashboard (overview, students, sessions, calendar, instructors, availability)
- ✅ TCA certificate issuance (students with ≥30h classroom + ≥6h driving)
- ✅ 48h + 4h email/SMS reminders (stub mode)
- ✅ Magic link auth (Supabase)

**Demo site live:** `the-driving-center-website-nbohurmrb-jaxcodexs-projects.vercel.app`

---

## What's Broken

| Issue | Impact | Fix |
|---|---|---|
| RLS cross-school access never tested | School A could read School B data | Manual SQL test in Supabase SQL Editor |
| `processed_stripe_events` table doesn't exist yet | Webhook idempotency not active in prod | Run migration 008 |
| `safe_increment_seats()` migration not run | Seats double-booking possible | Run migration 007 |
| Subscription status not enforced | Canceled schools still access dashboard | Build + deploy middleware |
| CSV import is a stub | Schools can't bulk-import students | Build it (Phase 2) |
| Email/SMS stubs only | Reminders don't actually send | Add Resend/Twilio keys |

---

## What's Pending (Phase 1D — Criticals)

Remaining fixes before the product is demo-ready for a real prospect:

1. **Run SQL migrations** (you, in Supabase SQL Editor):
   - `008_processed_stripe_events.sql` — webhook idempotency
   - `007_safe_seats_increment.sql` — seats race condition protection

2. **Build subscription status middleware** — redirect canceled/past_due schools to billing

3. **Test RLS** — create two test schools, try cross-school query with wrong school_id

4. **Wire email/SMS** — add RESEND_API_KEY + Twilio keys to Vercel, enable real reminders

5. **CSV import** — real file parsing + student creation

---

## Phase Roadmap

```
Phase 0     ✅  Core MVP built + DEMO_MODE working
Phase 1D    ⏳  Critical security/infrastructure fixes (we are here)
Phase 2     ⏳  Student intake + CSV import + instructor flows
Phase 3     ⏳  Real Stripe wiring + first paying school
Phase 4     ⏳  Outreach (B.L.A.S.T. cold email)
```

---

## What Needs To Happen Before First Customer

**You (Zax) must do:**
- Run migration 007 + 008 in Supabase SQL Editor (5 min)
- Complete Stripe test account onboarding (`charges_enabled: true`)
- Get Resend API key for real email reminders (free tier: 100/day)
- Get Twilio account for real SMS (optional, email-only MVP fine)

**Everest must build:**
- Subscription status middleware
- CSV import (real parsing)
- RLS test + fix if broken
- Ops panel hardening

---

## Who Approves What

| Decision | Who |
|---|---|
| Architecture (stack, schema) | Mark or Everest |
| Feature spec | Everest → Zax reviews |
| Code review | Everest |
| Go/no-go on first customer | Zax |
| Marketing message | Zax |
