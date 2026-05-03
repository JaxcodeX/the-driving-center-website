# The Driving Center — Product Guide

**Stack:** Next.js 16 + React 19 + Supabase + Stripe + Resend  
**Hosting:** Vercel  
**Database:** Supabase (PostgreSQL, RLS enabled)  
**Auth:** Magic links via Supabase Auth  

---

## What This Is

A white-label booking and school management platform for driving schools.

**Two surfaces:**
- **Student booking page** (`/book`) — public, no auth required. Pick a service → pick a time slot → enter details → pay deposit via Stripe
- **School admin dashboard** (`/school-admin/*`) — authenticated. Manage students, instructors, sessions, bookings, billing

**Core loop:** Student books → Stripe deposit → confirmation email → reminder emails → session completed

---

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in your Supabase + Stripe keys
npm run dev
```

**Required env vars:**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_STARTER_PRICE_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000
ENCRYPTION_KEY=               # 32+ char random string
DEMO_MODE=false               # set true for local demo login (PIN: 0000)
```

---

## Architecture

```
src/app/
├── page.tsx                   # Landing page
├── book/page.tsx              # Student booking flow
├── school/[slug]/page.tsx     # Public school profile + booking
├── school-admin/              # Protected admin dashboard
│   ├── page.tsx               # Dashboard — KPIs, upcoming sessions
│   ├── students/page.tsx
│   ├── sessions/page.tsx
│   ├── instructors/page.tsx
│   ├── calendar/page.tsx
│   ├── billing/page.tsx
│   └── profile/page.tsx
├── auth/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── callback/route.ts      # Magic link callback → school linking
└── api/
    ├── bookings/               # Create/list bookings
    ├── booking-links/[token]/ # Public booking lookup + cancel/confirm
    ├── sessions/              # Admin session CRUD
    ├── slots/                 # Public available time slots
    ├── students/             # Admin student management
    ├── instructors/          # Admin instructor management
    ├── webhooks/stripe/      # Stripe events (checkout, subscription)
    ├── reminders/            # Cron: 48h + 4h email reminders
    ├── auth/demo-login/      # Demo instant login (PIN 0000)
    └── demo/                 # Demo-mode data endpoints

src/lib/
├── supabase/
│   ├── server.ts            # createClient() + getSupabaseAdmin()
│   ├── types.ts             # Shared TypeScript interfaces
│   └── database.types.ts    # Actual DB column types (verified against live DB)
├── migrations/              # SQL schema migrations (numbered)
├── email.ts                 # Resend email wrapper
├── email-templates/         # HTML email templates
└── security.ts             # AES-GCM encryption, validation, auditLog
```

---

## Key Design Decisions

**Token storage:** Both `booking_token` and `confirmation_token` are stored as the same UUID at booking creation. `booking-links/[token]` checks `booking_token` first, then falls back to `confirmation_token`.

**Booking flow:** Slots endpoint returns `start_date` + `start_time` per session. Booking endpoint accepts `session_date` + `session_time`. Checkout creates a Stripe Checkout Session, webhook confirms the booking.

**Instructor availability:** Stored in `instructor_availability` table (day_of_week, start_time, end_time). No real-time availability checking — slots come from sessions table only.

**Student PII:** `legal_name`, `permit_number`, `emergency_contact_phone` are encrypted at rest using AES-GCM. Decrypted server-side for admin views only.

---

## Workflow

**Adding a feature:**
1. Write SPEC.md (in project root) — describe the change, the UI, the API contract
2. Build the API route(s) first, verify with `npm run typecheck`
3. Build the UI page
4. Run `npm run build` — must pass before committing

**Commit format:** `feat: [description]` / `fix: [description]` / `chore: [description]`

---

## Current Build Status

- `npm run build` → ✅ passes
- `npm run typecheck` → ⚠️ pre-existing `.next/types/validator.ts` error (Next.js internal, does not block builds)
- RLS policies → verified against live DB
- Design system → `globals.css` (all tokens defined as CSS variables)

---

## Known Items to Address

| Priority | Item | Notes |
|---|---|---|
| High | Sessions table has no `start_time` column | Slot times default to `09:00`; add column for accurate times |
| Medium | CLAUDE.md design token table is stale | Tokens are in `globals.css`, not the table here |
| Medium | Demo-mode artifacts in UI | `DEMO_MODE = true` labels, hardcoded school name in email templates |
| Low | TypeScript types are decorative | Routes use `as any` casts; `Database` type is incomplete |

---

## Database

**Schema source of truth:** `ACTUAL_SCHEMA.md` — verified against live Supabase DB via REST API (2026-04-28). Do not trust migration files alone — always verify against live DB when adding columns.

**Key tables:** `schools`, `students_driver_ed`, `sessions`, `session_types`, `instructors`, `instructor_availability`, `bookings`, `audit_logs`, `processed_stripe_events`