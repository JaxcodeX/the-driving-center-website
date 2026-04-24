# PROGRESS.md — The Driving Center SaaS

---

## WHERE WE ARE (2026-04-24)

**Two-phase build plan confirmed with Zax:**

```
Phase 1: Demo Version    ← we are here
Phase 2: Live Version
```

**Current status:**
- Core codebase: built (~26 commits, 92 files)
- PR #2 (audit fixes A+B+C+D, 1, 4, 5): merged ✅
- Live URL: https://the-driving-center-website.vercel.app/
- Branch after merge: main
- Stripe live price ID: `price_1TPVQ4CAzTRp2T1Gud8V0Z1I` ($99/mo)
- Demo school seeded: Oak Ridge Driving Academy

---

## BUILD PHASES

### ✅ PHASE COMPLETE: Core MVP Build
**Date:** 2026-04-22
- Auth (magic links), Stripe checkout, webhook, dashboard, booking wizard, school admin panels, sessions/students/instructors CRUD, SMS stubs, email templates, landing page

### 🔴 PHASE 1A IN PROGRESS: Demo Foundation Fixes
**Date:** 2026-04-24

| # | Fix | Priority | Status |
|---|---|---|---|
| 2a | Fix school→auth link (magic link users have no school_id) | P0 | Pending |
| 2b | Add STRIPE_STARTER_PRICE_ID to Vercel | P0 | **Zax must do (5 min)** |
| 2c | End-to-end test with Stripe test mode card | P0 | Pending |
| 6 | Remove encryption key fallback in complete-profile | P1 | Pending |
| 7 | Wire booking confirmation email to webhook | P1 | Pending |
| 8 | CSV import actual parsing | P1 | Pending |

### 🟡 PHASE 1B: Demo Infrastructure
**After Phase 1A verified working**

| # | Task | Status |
|---|---|---|
| 9 | Add `NEXT_PUBLIC_DEMO_MODE=true` flag to Vercel | Pending |
| 10 | Demo seed route (`/api/seed-demo`) — injects fake schools/students/bookings on demand | Pending |
| 11 | Demo signup flow — skip Stripe, create school + user directly | Pending |
| 12 | Demo reset button (admin clears and reseeds demo data) | Pending |
| 13 | Stripe test mode switch (sk_test vs sk_live, test price IDs) | Pending |
| 14 | Demo script — step-by-step walkthrough for Zax to run before meetings | Pending |

### 🟡 PHASE 1C: Demo Testing & Verification
**After Phase 1B complete**

| # | Task | Status |
|---|---|---|
| 15 | Stress test: 500 students, 200 sessions — does dashboard still load? | Pending |
| 16 | Concurrent webhook test: 10 simultaneous Stripe checkouts | Pending |
| 17 | Full demo run-through (Zax tests every feature manually) | Pending |
| 18 | Fix any bugs found in demo run | Pending |

### 🟢 PHASE 2: Live Version
**After Phase 1C demo verified with real prospect**

| # | Task | Status |
|---|---|---|
| 19 | Replace Stripe test keys with live keys | Pending |
| 20 | Switch price IDs from test to live | Pending |
| 21 | Replace demo school data with real prospect data | Pending |
| 22 | Supabase — enable production RLS policies | Pending |
| 23 | Onboarding flow — real Stripe checkout integration | Pending |
| 24 | First real paying customer onboarding | Pending |

---

## WHAT ZAX MUST DO

**TODAY (5 min):**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard) → The Driving Center → Settings → Environment Variables
2. Add: `STRIPE_STARTER_PRICE_ID` = `price_1TPVQ4CAzTRp2T1Gud8V0Z1I` (Production)
3. Come back and tell me when done

**THIS WEEK:**
- Test the full signup → Stripe checkout → school admin flow live
- Report every bug / broken step immediately

---

## EXECUTION RULES

1. Every feature starts with SPEC.md written by me before any code is written
2. FSO workflow: SPEC → Codex implement → review diffs → test → fix → merge
3. Demo infrastructure does NOT touch live Stripe keys
4. No new features until Phase 1A foundation is verified working
5. Zax tests each feature the same day it's built

---

*This file is a living log. Update after every session.*
