# CLAUDE.md — The Driving Center SaaS
**Multi-tenant SaaS for driving schools. Not Matt's project — a product.**

---

> **Conductor:** Everest (OpenClaw) — writes specs, reviews diffs, approves merges
> **Coder:** Coding agent — implements exactly what this file specifies
> **Tester:** Zax — clicks through the result and reports bugs

**When working on this project, read this file first. It is the source of truth.**

---

## What This Project Is

**The Driving Center** — a multi-tenant SaaS where driving school operators pay $99/mo for an all-in-one platform (scheduling, student management, payments, compliance, SMS reminders).

Target customers: OTHER driving schools in Tennessee and beyond — not Matt Reedy's school.

Matt Reedy is a **reference customer** — his site (`thedrivingcenter.org`) informed the product requirements. He is not currently a client.

**Current stage:** MVP. Landing page deployed, core auth flow built, Stripe wired, no paying customers yet.

---

## Key Context I Must Not Forget

1. **Multi-tenant SaaS** — any school can sign up and get their own isolated data
2. **Every table has `school_id`** — RLS policies isolate each school from others
3. **Matt is a reference, not a client** — do not build for Matt specifically
4. **Auth users get `user_metadata.school_id`** — this is how RLS knows which school owns which data

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TailwindCSS 4, Framer Motion
- **Database/Auth:** Supabase (Postgres + Auth + RLS)
- **Payments:** Stripe Checkout (subscriptions + webhooks)
- **Deploy:** Vercel (auto-deploys on push to `main`)
- **Automation:** OpenClaw sub-agents (coding, research, marketing)
- **Project path:** `~/projects/the-driving-center-website/`
- **Live URL:** https://the-driving-center-website.vercel.app/
- **GitHub:** github.com/JaxcodeX/the-driving-center-website

---

## Multi-Tenant Data Model

```
auth.users (Supabase Auth)
  └── user_metadata.school_id ──→ schools.id
                                        │
  sessions, students_driver_ed, payments, instructors, session_types
    └── school_id ──→ schools.id
```

Every row in every table is scoped to a `school_id`. RLS policies enforce this — a school admin can only see their own school's data.

---

## Auth Flow (How a school owner gets linked to their school)

```
1. School owner fills /signup form
   → POST /api/schools { schoolName, ownerName, email, phone, state }
   → schools record created with owner_email = email
   → Magic link sent to owner's email

2. Owner clicks magic link
   → GET /auth/callback?code=XXX
   → supabase.auth.exchangeCodeForSession(code)
   → Find schools WHERE owner_email = user.email
   → UPDATE schools SET owner_user_id = user.id (claim token)
   → UPDATE auth.users SET user_metadata.school_id = school.id
   → Redirect to /dashboard or /school-admin
```

---

## Database Schema (source of truth — live schema from Supabase)

### schools
```
id              UUID PK default uuid_generate_v4()
name            TEXT NOT NULL
slug            TEXT UNIQUE
owner_email     TEXT NOT NULL  ← user sets this at signup
owner_name      TEXT
owner_user_id   UUID           ← set by auth callback after magic link click
phone           TEXT
state           TEXT NOT NULL DEFAULT 'TN'
license_number  TEXT
plan_tier       TEXT DEFAULT 'starter'
stripe_customer_id TEXT        ← real Stripe customer ID (cus_xxx) written after checkout
service_zips    TEXT[]
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### students_driver_ed
```
id              UUID PK
school_id       UUID FK → schools.id
legal_name      TEXT  ← encrypted
permit_number   TEXT  ← encrypted
dob             DATE NOT NULL
parent_email    TEXT NOT NULL
emergency_contact_name  TEXT
emergency_contact_phone TEXT
classroom_hours INTEGER DEFAULT 0
driving_hours   INTEGER DEFAULT 0
certificate_issued_at TIMESTAMPTZ
class_session_id UUID
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### sessions
```
id              UUID PK
school_id       UUID FK → schools.id
instructor_id   UUID FK → instructors.id (nullable)
session_type_id UUID FK → session_types.id (nullable)
start_date      DATE NOT NULL
end_date        DATE NOT NULL
max_seats       INTEGER DEFAULT 30
seats_booked    INTEGER DEFAULT 0
status          TEXT DEFAULT 'scheduled'
location        TEXT
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### instructors
```
id              UUID PK
school_id       UUID FK → schools.id
name            TEXT
email           TEXT
phone           TEXT
license_number  TEXT
active          BOOLEAN DEFAULT true
```

### session_types
```
id              UUID PK
school_id       UUID FK → schools.id
name            TEXT
description     TEXT
duration_minutes INT
price_cents     INT
deposit_cents   INT
color           TEXT
tca_hours_credit FLOAT
active          BOOLEAN DEFAULT true
```

### payments
```
id              UUID PK
student_id      UUID FK → students_driver_ed.id
stripe_session_id TEXT UNIQUE
amount          INTEGER NOT NULL
status          TEXT DEFAULT 'pending'
created_at      TIMESTAMPTZ DEFAULT NOW()
```

---

## Key Files

```
src/app/api/schools/route.ts          — school signup (creates school + triggers Stripe)
src/app/auth/callback/route.ts        — magic link callback (links school → auth user)
src/app/webhooks/stripe/route.ts      — Stripe events (payment confirmed, seat booked)
src/app/school-admin/                 — protected by middleware, school owner only
src/lib/supabase/server.ts            — server-side Supabase client
src/lib/supabase/client.ts            — browser Supabase client
src/middleware.ts                     — protects /school-admin/* routes
```

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL       — https://evswdlsqlaztvajibgta.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY  — anon key
NEXT_PUBLIC_APP_URL            — https://the-driving-center-website.vercel.app
NEXT_PUBLIC_ENCRYPTION_KEY      — AES-256-GCM key
STRIPE_SECRET_KEY              — sk_live_...
STRIPE_WEBHOOK_SECRET          — whsec_...
STRIPE_STARTER_PRICE_ID         — price_1TPVQ4CAzTRp2T1Gud8V0Z1I
SUPABASE_SERVICE_ROLE_KEY      — service role key (never exposed to browser)
DEMO_OWNER_EMAIL               — ops panel access (operator email)
```

---

## Rules

1. **Never touch auth without a spec.** Auth routes are the most fragile part. SPEC.md first, then code.
2. **Always use service role client for admin writes.** Regular client respects RLS. Service role bypasses it for webhook/API use.
3. **Small commits.** One logical change per commit with clear message.
4. **If confused, stop and ask.** Don't guess at data model or auth flow.
5. **Multi-tenant reminder.** Every query to a data table must include school_id scoping.

---

## Active Bugs (B.L.A.S.T. Cycle 1)

| # | Bug | Status |
|---|-----|--------|
| 1 | schools.owner_email NULL after signup | ✅ Code fixed, existing records repaired |
| 2 | stripe_customer_id collision (owner claim vs Stripe ID) | 🔴 Partially fixed — auth callback writes owner_user_id too |
| 3 | sessions.school_id = NULL | ✅ Repaired via direct API |
| 4 | owner_user_id column missing in DB | ❌ Needs SQL migration |
| 5 | complete-profile page dead-ends school owners | ✅ Fixed — redirects to /school-admin |
| 6 | DEMO_OWNER_EMAIL not in Vercel | ❌ Manual add needed |

---

## Workflow: B.L.A.S.T.

Every feature follows this sequence:
1. **B** — Write SPEC.md (conductor writes, saves to project)
2. **L** — Link check (verify connections work)
3. **A** — Architect (sub-agent implements from spec)
4. **S** — Stylize (conductor reviews and polishes)
5. **T** — Trigger (deploy to Vercel, mark complete)

**The one rule:** No sub-agent runs without a written SPEC.md first.