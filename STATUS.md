# STATUS.md — The Driving Center SaaS

**Last updated:** 2026-04-25
**Current phase:** Phase 0 (Foundation Fixes)

---

## What's Happening Right Now

We're running FSO cycles — one feature at a time through: SPEC.md → agent → review → deploy → log.

The app is live but broken in ways that block a real school from using it. Phase 0 is about making the foundation actually work.

---

## Current Task

**P0-5 — Instructor Schedule API Fix** — Next to run.

---

## What's Blocked (Needs Zax's Action)

| # | Task | How long | What to do |
|---|---|---|---|
| P0-1 | Add `owner_user_id` column to `schools` table | 2 min | Run 2 SQL commands in Supabase SQL Editor |
| P0-2 | Add `DEMO_OWNER_EMAIL` to Vercel | 2 min | Add env var in Vercel dashboard |

**Why this matters:** Auth callback can't write the owner claim until `owner_user_id` column exists. The whole school admin flow is incomplete until this is done.

---

## What's Unblocked (Ready to Code)

| # | Task | Status |
|---|---|---|
| P0-4 | CSV import page | ✅ Done — deployed |

## Phase 0 Complete ✅

All Phase 0 items done:
- [x] P0-1: `owner_user_id` column — confirmed via API
- [x] P0-2: `DEMO_OWNER_EMAIL` in Vercel
- [x] P0-3: Booking confirmation email wired, template active, reschedule/cancel links
- [x] P0-4: CSV import — service role client, ownership check, deduplication
- [x] P0-5: Instructor schedule API — `decryptField` confirmed correct

---

## Phase 1 Preview (Next Session)

- Student profile edit
- Session create/edit/delete
- TCA certificate issuance
- SMS reminders wired to OpenClaw cron

---

## FSO Cycle Log

| Cycle | Feature | Result |
|---|---|---|
| 1 | P0-3: Booking confirmation email | ✅ Passed — deployed |
| 2 | P0-4: CSV import (school ownership, deduplication) | ✅ Passed — deployed |

---

## Next Actions

Phase 0 is **done**. Move to Phase 1 next session.

1. Student profile edit (P1-A)
2. Session CRUD (P1-B)
3. TCA certificate issuance