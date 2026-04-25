# STATUS.md — The Driving Center SaaS

**Last updated:** 2026-04-25
**Current phase:** Phase 0 (Foundation Fixes)

---

## What's Happening Right Now

We're running FSO cycles — one feature at a time through: SPEC.md → agent → review → deploy → log.

The app is live but broken in ways that block a real school from using it. Phase 0 is about making the foundation actually work.

---

## Current Task

**P0-3 — Booking Confirmation Email**
Wire the Stripe webhook → send confirmation email to student after payment.

**Status:** SPEC.md not yet written. Next action: write it.

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
| P0-3 | Booking confirmation email wired | Needs SPEC.md written first |
| P0-4 | CSV import page | Stub — needs real feature build |
| P0-5 | Instructor schedule API fix | `decryptField` → `decrypt` |

---

## What's Done (Phase 0)

- [x] Auth callback — `stripe_customer_id` collision fixed, writes to both columns
- [x] complete-profile page — school owners redirected to `/school-admin`
- [x] Sessions table — all linked to demo school
- [x] School `owner_email` — repaired via direct API

---

## Project Files (What Each One Does)

| File | Purpose |
|---|---|
| `STATUS.md` | **This file.** Current state, what's blocked, what's next. Updated at start of every session. |
| `BUILD_PLAN.md` | Full roadmap — all phases, all features, priority order |
| `CLAUDE.md` | Project context, schema, active bugs, FSO workflow rules |
| `WORKFLOW_LOG.md` | FSO cycle log — one entry per cycle, tracks what was built and what failed |
| `BLAST_PROTOCOL.md` | Our adapted B.L.A.S.T. protocol for The Driving Center |
| `PROJECT_CONSTITUTION.md` | Tech stack, 3-layer architecture, operating principles |

---

## Phase 1 Preview (After Phase 0)

- Student profile edit
- Session create/edit/delete
- TCA certificate issuance
- SMS reminders wired to OpenClaw cron

---

## How to Run a Cycle

```
1. Write SPEC.md for the feature
2. Verify connections (Supabase, Stripe — L phase)
3. Spawn coding agent to implement (A phase)
4. Review output in VS Code / git diff
5. Push to main → Vercel auto-deploys (T phase)
6. Log in WORKFLOW_LOG.md
```

---

## Next Action

Write SPEC.md for P0-3 (booking confirmation email), then run the cycle.

Once P0-1 and P0-2 are done (Zax's manual steps), verify the full signup-to-admin flow works end-to-end.