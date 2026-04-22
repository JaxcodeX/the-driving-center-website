# B.L.A.S.T. Protocol — Phase 1 SPEC
## The Driving Center SaaS — Core Fixes

**Date:** 2026-04-22
**Conductor:** OpenClaw
**Coder:** Codex + Kimi K2.6 (via ollama launch codex --model kimi-k2.6:cloud)
**Target:** Fix all 6 RW blockers. Build the MVP that a school owner can actually use.

---

## Context (What We Know)

Research documents in `/Users/cayden/projects/the-driving-center-website/`:
- `RESEARCH_TRACK_A_PRODUCT_GAP.md` — full codebase audit
- `RESEARCH_TRACK_A_COMPETITOR_ANALYSIS.md` — pain points and pricing
- `RESEARCH_TRACK_A_LEADS.md` — 20 early access targets
- `RESEARCH_TRACK_A_STATE_COMPLIANCE.md` — TN/KY/GA compliance

Key insight from research:
> Schools don't buy features. They buy relief from pain. The sales pitch is: "You spend 8 hours/week managing schedule changes and chasing no-shows. We eliminate that. Net positive: $301/mo."

**The codebase is a landing page with fake stats.** Zero API routes. Zero auth. Zero booking flow. Zero student data.

---

## What to Build (Priority Order)

### PRIORITY 1 — Magic Link Auth + Login Page
**File:** `src/app/login/page.tsx`
**File:** `src/app/auth/callback/route.ts`
**File:** `src/middleware.ts`

User flow:
1. User visits `/login`, enters email
2. Supabase sends magic link to email
3. User clicks link → redirected to `/auth/callback` → session created → redirected to `/dashboard`
4. Middleware guards all `/dashboard/*` and `/admin/*` routes — checks session, redirects to `/login` if none

**Middleware logic:**
```ts
// Protect /dashboard and /admin routes
// Use supabase.auth.getUser() (server-side JWT verification)
// Redirect to /login if no valid session
// NO login page exists currently — BUILD THIS FIRST
```

Supabase magic link setup requires:
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env.local`
- Auth redirect URL: `${origin}/auth/callback`

---

### PRIORITY 2 — Stripe Webhook Fix (RW-03)
**File:** `src/app/api/stripe/webhook/route.ts`

Current problem: Inserts `dob: '2000-01-01'` and `permit_number: 'PENDING'` — fake data, real money taken.

Fix: When `checkout.session.completed` fires:
1. Read student email from `session.customer_details.email`
2. Create row in `students_driver_ed` with real email, no placeholder data
3. Create row in `payments` with `status='paid'`
4. Increment `seats_booked` in `sessions` table
5. Trigger n8n webhook → sends welcome email to student

```ts
// Stripe webhook must:
// 1. Verify HMAC-SHA256 signature (this already works per docs)
// 2. Extract: email, school_id, session_id from session.metadata
// 3. INSERT students_driver_ed with real email (dob + permit_number from form)
// 4. UPDATE sessions SET seats_booked = seats_booked + 1 WHERE id = session_id
// 5. INSERT payments { student_email, stripe_session_id, status: 'paid' }
// 6. POST to n8n webhook URL
```

**Note:** Real student data (DOB, permit number) comes from a POST-payment form, not Stripe. Build a minimal "complete your profile" form that fires after checkout.

---

### PRIORITY 3 — School Signup + Onboarding Flow (Multi-Tenant Foundation)
**New file:** `src/app/signup/page.tsx`
**New file:** `src/lib/schools.ts`

Create the `schools` table first:

```sql
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_email TEXT NOT NULL UNIQUE,
  owner_name TEXT,
  phone TEXT,
  state TEXT NOT NULL, -- 'TN' | 'KY' | 'GA'
  license_number TEXT,
  plan_tier TEXT DEFAULT 'starter', -- 'starter' | 'growth' | 'enterprise'
  stripe_customer_id TEXT,
  service_zips TEXT[], -- array of covered ZIP codes
  created_at TIMESTAMPTZ DEFAULT now()
);
```

Signup flow:
1. School enters: business name, owner name, email, phone, state
2. System creates Supabase Auth user (magic link)
3. System creates `schools` record
4. School redirected to onboarding → enter ZIP codes, instructor count, select plan
5. Stripe Checkout triggered for subscription

---

### PRIORITY 4 — Dashboard with Live Stats (RW-05)
**File:** `src/components/dashboard/QuickStatsRow.tsx`

Currently: hardcoded `$4.2k revenue, 2/4 drives, 3 certs`
Fix: Server-side Supabase queries

```tsx
// Replace hardcoded stats with:
const { data: revenue } = await supabase
  .from('payments')
  .select('amount')
  .eq('status', 'paid')
  .gte('created_at', startOfMonth)

const { data: students } = await supabase
  .from('students_driver_ed')
  .select('id', { count: 'exact' })

const { data: certs } = await supabase
  .from('students_driver_ed')
  .select('id')
  .not('certificate_issued_at', 'is', null)
```

Revenue privacy toggle (eye icon to show/hide) — keep this feature, it prevents shoulder-surfing.

---

### PRIORITY 5 — Seats Booked Auto-Increment (RW-04)
**In:** `src/app/api/stripe/webhook/route.ts`

Add to the webhook handler after payment confirmed:
```ts
const sessionId = metadata.session_id
await supabase.rpc('increment_seats_booked', { session_id: sessionId })
```

SQL function:
```sql
CREATE OR REPLACE FUNCTION increment_seats_booked(session_id UUID)
RETURNS void AS $$
  UPDATE sessions
  SET seats_booked = seats_booked + 1
  WHERE id = session_id AND seats_booked < max_seats;
$$ LANGUAGE sql SECURITY DEFINER;
```

---

### PRIORITY 6 — Post-Payment Student Profile Form
**New file:** `src/app/complete-profile/[token]/page.tsx`

After Stripe checkout, student receives email with link to complete their profile:
- Full legal name (encrypted before DB insert)
- Date of birth (checked: age >= 15 via SQL CHECK constraint)
- Permit number (encrypted)
- Emergency contact name + phone
- Parent email (if student is under 18)

This is what fills in the data that the webhook currently leaves as placeholder.

---

## What NOT to Build (Out of Scope for Phase 1)

- Kill Switch SMS (Twilio) — nice-to-have, not why schools pay
- Instructor management UI — build after first school is paying
- DMV compliance module — build after first 5 schools
- Calendly integration — use a native booking form instead
- Multi-state certificate templates — hard-code TN for now
- PWA manifest — post-MVP

---

## File Map

```
src/
  app/
    (new) login/page.tsx           ← PRIORITY 1
    (new) auth/callback/route.ts   ← PRIORITY 1
    (new) signup/page.tsx           ← PRIORITY 3
    (new) complete-profile/[token]/page.tsx  ← PRIORITY 6
    api/
      (new) stripe/
        (existing) webhook/route.ts ← PRIORITY 2 + 5 (fix + seats_booked)
  (new) middleware.ts               ← PRIORITY 1
  lib/
    (new) schools.ts                ← PRIORITY 3
    (existing) supabase/server.ts  ← verify exists, update if needed
    (existing) supabase/client.ts  ← verify exists, update if needed
  components/dashboard/
    (existing) QuickStatsRow.tsx   ← PRIORITY 4 (wire to live data)
```

---

## Success Criteria

1. A new school can sign up and receive a magic link
2. School can complete Stripe checkout ($99/mo test mode)
3. After payment, student receives "complete your profile" email
4. Student fills profile form → row created in `students_driver_ed` with real data
5. `seats_booked` increments in `sessions` table
6. Dashboard shows real revenue total (from `payments` table)
7. Middleware guards `/dashboard` — unauthenticated users redirected to `/login`

---

## Env Vars Needed

```env
# Already exists (placeholder per docs — replace with real keys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_ANON_KEY=eyJ...
ENCRYPTION_KEY=... (32-byte hex for AES-256)

# Add these:
INSTRUCTOR_UUID=... (your Supabase Auth user UUID — for single-school demo)
N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/student-onboarding
STRIPE_STARTER_PRICE_ID=price_... (create in Stripe Dashboard)
```

---

## B.L.A.S.T. Completion Check

| Pillar | Task | Status |
|---|---|---|
| **B**uild | Login + auth flow | ⬜ |
| **B**uild | Stripe webhook → real student INSERT | ⬜ |
| **B**uild | School signup + schools table | ⬜ |
| **L**ock | Middleware auth guard | ⬜ |
| **L**ock | Encryption on INSERT (legal_name, permit_number) | ⬜ |
| **A**lert | Seats booked auto-increment | ⬜ |
| **S**ync | Stripe → Supabase pipeline | ⬜ |
| **T**race | Audit log on payment completion | ⬜ |

---

## Agent Instructions for Codex

You are fixing the 6 critical blockers in a Next.js 16 + Supabase + Stripe driving school SaaS. The codebase is at `/Users/cayden/projects/the-driving-center-website/`.

Work in this order:
1. Create `src/middleware.ts` — auth guard for `/dashboard/*` and `/admin/*`
2. Create `src/app/login/page.tsx` — magic link email form
3. Create `src/app/auth/callback/route.ts` — handle magic link callback
4. Fix `src/app/api/stripe/webhook/route.ts` — real student INSERT + seats_booked increment
5. Create `src/app/signup/page.tsx` — school registration form
6. Create SQL migration for `schools` table
7. Fix `src/components/dashboard/QuickStatsRow.tsx` — live Supabase queries
8. Create `src/app/complete-profile/[token]/page.tsx` — post-payment form

Commit after each file. Use descriptive commit messages.

When done, run:
```
openclaw system event --text "B.L.A.S.T. Phase 1 complete: 6 RW blockers fixed" --mode now
```