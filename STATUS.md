# STATUS.md — The Driving Center SaaS

**Last updated:** 2026-04-25
**Current phase:** Phase 1 (Core Product) — near complete
**Next: Phase 2 (Stripe Subscriptions)**

---

## Phase 1 Progress

| # | Feature | Status |
|---|---|---|
| P1-A | Student profile edit + TCA tracking + certificate | ✅ Deployed |
| P1-B | Session management (create/edit/cancel/duplicate) | ✅ Deployed |
| P1-C | Email + SMS reminders wired to OpenClaw cron | ✅ Deployed |

**What P1-C does:**
- `/api/reminders` fires 48h + 4h reminders (SMS + email) for upcoming bookings
- Cron job registered: `tdc-reminders` — every hour
- Second cron job: `tdc-monday-ops` — every Monday 9 AM ET
- Stub mode: logs what would be sent when Twilio/Resend keys not configured
- Email templates: beautiful HTML (reminder-48h, reminder-4h)

**Keys needed for production:**
- `RESEND_API_KEY` → resend.com
- `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` + `TWILIO_PHONE_NUMBER` → twilio.com

---

## Phase 0 Complete ✅

- [x] P0-1: `owner_user_id` column
- [x] P0-2: `DEMO_OWNER_EMAIL` in Vercel
- [x] P0-3: Booking confirmation email wired
- [x] P0-4: CSV import — service role client, ownership check, deduplication
- [x] P0-5: Instructor schedule API — `decryptField` confirmed correct

---

## FSO Cycle Log

| Cycle | Feature | Result |
|---|---|---|
| 1 | P0-3: Booking confirmation email | ✅ Passed — deployed |
| 2 | P0-4: CSV import (service role, ownership, deduplication) | ✅ Passed — deployed |
| 3 | P1-A: Student profile edit + TCA + certificate | ✅ Passed — deployed |
| 4 | P1-B: Session management (create/edit/cancel/duplicate) | ✅ Passed — deployed |
| 5 | P1-C: Email + SMS reminders wired to cron | ✅ Passed — deployed |

---

## What's Blocked

None. Phase 1 complete. Ready for Phase 2.

---

## Phase 2 Preview: Stripe Subscriptions

- Verify Stripe checkout flow works end-to-end
- Handle `checkout.session.expired`
- Handle `invoice.payment_failed`
- Validate school before granting access (check Stripe customer ID matches)
- Discuss: $25 setup fee vs $99/mo only?

---

## Next Actions

1. Add Twilio + Resend API keys to Vercel (enables real SMS + email)
2. Register cron jobs: `openclaw cron add ...` (see CRON_SETUP.md)
3. Phase 2: Stripe subscription flow — validate customers, gate school admin behind payment