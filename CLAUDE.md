# CLAUDE.md — The Driving Center SaaS
**Multi-tenant SaaS for driving schools. Not Matt's project — a product.**
**Mode: FSO Workflow (Full Stack Open)**

---

## The FSO Workflow — How This Project Runs

**Every feature request follows this exact sequence:**

```
Zax: "Build [feature]"
        ↓
Everest (conductor): Write SPEC.md first
        ↓
Everest: Verify connections (L — Link)
        ↓
Everest: Spawn coding agent → implements from spec (A — Architect)
        ↓
Everest: Review diffs, test in browser, approve or send back (S — Stylize)
        ↓
Push to main → Vercel auto-deploys (T — Trigger)
        ↓
Log failures in WORKFLOW_LOG.md
        ↓
Next feature
```

**No exceptions.** If there's no SPEC.md, there's no implementation. Ever.

---

## Role Rules (Enforced)

| Who | What they do |
|-----|-------------|
| **Zax** | Directs, tests, approves or rejects output |
| **Everest** | Writes SPEC.md, spawns agents, reviews output, makes architecture decisions |
| **Coding Agent** | Implements exactly what SPEC.md says. Reports what was done. Never writes SPEC.md |

**Everest's job is not to write code — it's to write specs and review code.**

---

## The SPEC.md Template (for every feature)

```markdown
# SPEC.md — [Feature Name]

## What it does (one sentence)
## How it works (data flow)
## API shapes (request/response)
## Edge cases
## Success criteria
## Files to change
## Out of scope
```

---

## The WORKFLOW_LOG.md (tracks every cycle)

Format per entry:
```
## Cycle N — [Feature]
Date:
SPEC.md: [linked]
Implemented by: [agent]
Result: [passed / failed / partial]
Failures: [what went wrong]
Next action: [what we do about it]
```

---

## What Changes When FSO is Enforced

1. **Less drift** — every message is either advancing the spec, reviewing output, or logging
2. **Better failure tracking** — when something breaks, we know exactly which cycle and why
3. **Faster builds** — coding agent does the implementation, I'm reviewing not typing
4. **Clearer accountability** — each change has a spec, a diff, and a log entry

---

## Current Project State

**Live URL:** https://the-driving-center-website.vercel.app/
**GitHub:** github.com/JaxcodeX/the-driving-center-website
**Project path:** `~/projects/the-driving-center-website/`

### What Works
- School signup → Stripe checkout → magic link → school admin dashboard
- Student booking wizard → Stripe payment → seat incremented
- Landing page, pricing, FAQ, legal pages

### P0 Fixes Needed (before any school can actually use it)
1. Run SQL: `ALTER TABLE schools ADD COLUMN owner_user_id UUID;`
2. Add `DEMO_OWNER_EMAIL` to Vercel dashboard
3. Wire booking confirmation email (webhook → notify API)
4. Build CSV import (stub → real feature)

---

## FSO Workflow Log

## Cycle 1 — School Owner Auth Link Fix
Date: 2026-04-24
SPEC: SPEC_BLAST_01_SCHOOL_OWNER_FIX.md
Implemented by: Everest (manual — should have been sub-agent)
Result: Partial — code fixed, DB migration still pending
Fixes applied: auth callback dual write, complete-profile redirect, school sessions linked
DB migration needed: `ALTER TABLE schools ADD COLUMN owner_user_id UUID;`
Vercel env needed: DEMO_OWNER_EMAIL

---

## Build Plan (Priority Order)

### Phase 0 — Foundation (right now)
- P0-1: owner_user_id column + DEMO_OWNER_EMAIL (5 min SQL + 2 min Vercel)
- P0-2: Wire booking confirmation email (webhook → /api/notify/booking)
- P0-3: Build CSV import feature

### Phase 1 — Core Product
- P1-A: Student profile edit + TCA hours tracking
- P1-B: Session create/edit/delete + series duplication
- P1-C: Email/SMS reminders wired to OpenClaw cron

### Phase 2 — Payments
- Handle failed Stripe payments gracefully
- Referral program

### Phase 3 — Launch
- First 5 paying schools via B.L.A.S.T. outreach protocol