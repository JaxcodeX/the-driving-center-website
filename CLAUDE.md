# CLAUDE.md — The Driving Center SaaS

> **Conductor:** Everest (OpenClaw) — writes specs, reviews diffs, approves merges
> **Coder:** Coding agent (Gemini CLI / Codex) — implements exactly what this file specifies
> **Tester:** Zax — clicks through the result and reports bugs

**When Everest asks you to implement something, read this file first. It is the source of truth for this project.**

---

## Project Overview

**The Driving Center** — multi-tenant SaaS for driving schools
- **Live URL:** https://the-driving-center-website.vercel.app/
- **GitHub:** github.com/JaxcodeX/the-driving-center-website
- **Stack:** Next.js 16 (App Router), React 19, Supabase (Auth + Postgres + RLS), Stripe, TailwindCSS 4, Framer Motion
- **Deploy:** Vercel (auto-deploys on push to `main`)
- **Project path:** `~/projects/the-driving-center-website/`

---

## Architecture

### Multi-tenant data model

Every table has a `school_id` column. RLS policies restrict access to rows where `school_id` matches the authenticated user's `user_metadata.school_id`.

```
auth.users (Supabase Auth)
  └── user_metadata.school_id ──→ schools.id (owner link)
                                        │
sessions, students, bookings, instructors, session_types
  └── school_id ──→ schools.id
```

### The broken link (the bug to fix)

When a school owner signs up:
1. `/api/schools` creates a `schools` record ✅
2. Magic link sent to owner's email ✅
3. Owner clicks magic link → `/auth/callback` → session created ✅
4. **MISSING:** `schools.owner_id` is never set
5. **MISSING:** `auth.users.user_metadata.school_id` is never set
6. **RESULT:** RLS blocks the owner from their own data → empty dashboard

### Auth callback flow (CORRECT version)

```
/auth/callback?code=XXX&redirect=/onboarding
    ↓
supabase.auth.exchangeCodeForSession(code)
    ↓
Get user.email from the session
    ↓
Find schools record WHERE email = user.email AND owner_id IS NULL
    ↓
UPDATE schools SET owner_id = user.id
    ↓
UPDATE auth.users SET user_metadata.school_id = school.id
    ↓
Redirect to the redirect param URL
```

---

## Database Schema (source of truth)

### schools
```sql
id              UUID PK
name            TEXT
slug            TEXT UNIQUE
email           TEXT  -- the owner's email
phone           TEXT
state           TEXT
plan_tier       TEXT  -- 'starter' or 'professional'
active          BOOLEAN DEFAULT true
owner_id        UUID REFERENCES auth.users(id)  -- NEW: link owner to school
created_at      TIMESTAMPTZ
```

### students
```sql
id              UUID PK
school_id       UUID FK → schools.id
name            TEXT
email           TEXT
phone           TEXT
tca_classroom_hours  FLOAT
tca_driving_hours   FLOAT
tca_certificate_issued  BOOLEAN
permit_number   TEXT
dob             DATE
parent_email    TEXT
created_at      TIMESTAMPTZ
```

### sessions
```sql
id              UUID PK
school_id       UUID FK → schools.id
instructor_id   UUID FK → instructors.id (nullable)
session_type_id UUID FK → session_types.id
start_date      DATE
start_time      TIME
end_time        TIME
max_seats       INT
seats_booked    INT DEFAULT 0
price_cents     INT
location        TEXT
cancelled       BOOLEAN DEFAULT false
```

### bookings
```sql
id              UUID PK
session_id      UUID FK → sessions.id (nullable)
student_name    TEXT
student_email   TEXT
student_phone   TEXT
status          TEXT  -- 'pending' | 'confirmed' | 'expired' | 'cancelled'
deposit_amount_cents  INT
deposit_paid_at       TIMESTAMPTZ
confirmation_token    TEXT UNIQUE
stripe_payment_intent_id  TEXT
created_at      TIMESTAMPTZ
```

### session_types
```sql
id              UUID PK
school_id       UUID FK → schools.id
name            TEXT
description     TEXT
duration_minutes INT
price_cents     INT
deposit_cents   INT
color           TEXT  -- hex color for UI
tca_hours_credit FLOAT
active          BOOLEAN
```

### instructors
```sql
id              UUID PK
school_id       UUID FK → schools.id
name            TEXT
email           TEXT
phone           TEXT
license_number  TEXT
license_expiry  DATE
active          BOOLEAN
```

---

## API Routes

```
POST /api/schools
  Body: { schoolName, ownerName, email, phone, state }
  → Creates schools record, sends magic link, starts Stripe checkout
  → Returns: { schoolId, slug, checkoutUrl }

GET /api/auth/callback?code=XXX&redirect=/path
  → Exchanges magic link code for session
  → FIX: Links school → user by email match
  → Redirects to /path

GET /api/auth/me
  → Returns: { user.id, user.user_metadata.school_id, school }

GET /api/sessions?school_id=XXX
  → List sessions for school

POST /api/bookings
  → Create booking (status: 'pending')
  → Returns: { bookingId, checkoutUrl }

POST /api/webhooks/stripe
  → Handles: checkout.session.completed, checkout.session.expired
  → On completed: update booking status, increment seats_booked, send email
```

---

## Key Files (do not break)

```
src/
  app/
    api/
      schools/route.ts          — school creation (works, don't touch)
      auth/
        callback/route.ts       — ⬅️ FIX THIS: add school→user linking
      webhooks/stripe/route.ts  — webhook handler (works, don't touch)
    auth/callback/route.ts      — same as above (symlink)
    onboarding/page.tsx         — ⬅️ FIX THIS: read school_id from user metadata
    complete-profile/page.tsx    — for students post-booking, NOT school owners
    signup/page.tsx            — works, don't touch
    school-admin/              — protected by middleware (works, don't touch)
  lib/
    supabase/
      server.ts                 — createServerClient
      client.ts                 — createClient (browser)
    security.ts                 — auditLog, input validation
  middleware.ts                  — protects /school-admin/* routes
```

---

## Environment Variables (runtime)

```
NEXT_PUBLIC_SUPABASE_URL       — https://evswdlsqlaztvanjutajigta.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY  — anon key
NEXT_PUBLIC_APP_URL            — https://the-driving-center-website.vercel.app
NEXT_PUBLIC_ENCRYPTION_KEY     — AES-256 key
STRIPE_SECRET_KEY              — sk_live_...
STRIPE_WEBHOOK_SECRET          — whsec_...
STRIPE_STARTER_PRICE_ID        — price_1TPVQ4CAzTRp2T1Gud8V0Z1I
SUPABASE_SERVICE_ROLE_KEY     — service role key (server only, never exposed)
```

---

## Rules for Coding Agents

1. **Never touch auth unless told.** Auth routes are the most fragile part. If the spec doesn't say "fix auth callback," don't touch it.
2. **Always use service role client for admin operations.** `getSupabaseAdmin()` bypasses RLS. Regular API routes use `createClient()`.
3. **Never commit secrets.** `.env.local` is gitignored. All secrets go in Vercel dashboard.
4. **Small commits, clear messages.** One logical change per commit.
5. **Test after every change.** Run `npm run build` locally before pushing.
6. **If confused, stop and ask.** Don't guess. Ask Everest.

---

## Success Criteria (for this fix cycle)

After the school→auth link fix:
- [ ] New school signup → magic link → click → school owner_id is set
- [ ] `/auth/callback` redirects with correct school_id in user metadata
- [ ] Owner lands on `/school-admin` and sees their school's data
- [ ] Owner can refresh `/school-admin` and still see their data (no URL param needed)
- [ ] Demo school (Oak Ridge, id: `00000000-0000-0000-0000-000000000001`) still works
