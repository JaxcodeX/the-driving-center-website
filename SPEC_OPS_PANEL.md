# SPEC.md — Ops Control Panel

**Feature:** Unified admin panel for Supabase, Stripe, and Vercel management
**Date:** 2026-04-24
**Status:** READY TO IMPLEMENT
**Priority:** P1 — Zax needs direct control, not scattered dashboards

---

## Problem

Zax is managing three platforms simultaneously:
- **Supabase** — database, auth, schema
- **Stripe** — payments, webhooks, subscriptions
- **Vercel** — deployments, env vars

Every time something breaks or needs updating, he has to open a browser, log in, navigate to a dashboard, find the right section. That's slow for a solo dev who needs to move fast.

## Solution

Build an **Ops Control Panel** at `/school-admin/ops` — a single page inside the app where Zax can:
1. See the status of all three platforms at a glance
2. Trigger key actions without leaving the app
3. See what's broken immediately

---

## What to Build

### Page: `/school-admin/ops`

A dark-themed admin panel with three sections:

---

### Section 1 — Vercel Deploys

**Show:**
- Current deployment status (live / building / error)
- Last deployed at (timestamp)
- Commit hash + message

**Actions:**
- [ ] Trigger redeploy (POST to Vercel API)
- [ ] List recent deployments (GET from Vercel API)

**Implementation:** Uses `VERCEL_TOKEN` via server-side API route. No new secrets needed.

---

### Section 2 — Database (Supabase)

**Show:**
- Connected: yes/no (probe with a simple auth.users count)
- Table counts: schools, students, sessions, bookings
- Recent auth users (last 5)

**Actions:**
- [ ] Run demo seed (POST `/api/seed`) — reseeds all demo data
- [ ] Clear demo bookings (DELETE from bookings where status = 'pending' or test records)
- [ ] Check RLS policies are in place

**Implementation:** Uses `SUPABASE_SERVICE_ROLE_KEY` via server-side API route.

---

### Section 3 — Stripe

**Show:**
- Webhook endpoint status (connected / not configured)
- Recent events (last 10 from Stripe API)
- Test mode indicator

**Actions:**
- [ ] List recent payments / subscriptions
- [ ] Trigger a test webhook event (manual fire from Stripe dashboard link)
- [ ] View Stripe dashboard link (opens new tab)

**Implementation:** Uses `STRIPE_SECRET_KEY` via server-side API route.

---

### Section 4 — Env Vars Status

**Show:** Current runtime env var status (from Vercel API):
- Which vars are set
- Which are missing
- Flag STRIPE_STARTER_PRICE_ID as missing if not confirmed

---

## Pages & Files

| File | Purpose |
|---|---|
| `src/app/school-admin/ops/page.tsx` | The ops panel UI |
| `src/app/api/ops/deploy/route.ts` | Vercel deploy status + trigger |
| `src/app/api/ops/db/route.ts` | Supabase probe + seed trigger |
| `src/app/api/ops/stripe/route.ts` | Stripe recent events |
| `src/app/api/ops/env/route.ts` | Vercel env var status |

---

## Access Control

This page is only for Zax. Use a simple hardcoded check:
- Check `user.user_metadata.school_id === DEMO_SCHOOL_ID` (Oak Ridge: `00000000-0000-0000-0000-000000000001`)
- OR check a `DEMO_OWNER_EMAIL` env var matches the logged-in user's email
- Only grant access if `user.email === configured owner email`

---

## Success Criteria

- [ ] Zax can see Vercel deploy status without opening vercel.com
- [ ] Zax can trigger a database seed without using curl
- [ ] Zax can see recent Stripe events without opening stripe.com
- [ ] All actions work from the deployed app (no local terminal needed)
- [ ] Ops page is protected by auth — only logged-in owner can access
