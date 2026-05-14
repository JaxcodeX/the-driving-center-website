# CLAUDE.md — The Driving Center SaaS

**Project:** The Driving Center — white-label booking and school management platform for driving schools  
**Updated:** 2026-05-03

---

## Workflow (FSO Protocol)

**Rule 1 — Write SPEC.md before any feature work.** One spec file, reference it, build to it.

**Rule 2 — Run `npm run build` before committing.** Must pass. Fix TypeScript errors first.

**Rule 3 — Run Playwright tests before announcing completion.** After a build passes:
   1. `npm run build` — TypeScript compiles (must pass)
   2. `npx playwright test --reporter=line` — functional tests (all must pass)
   3. Only announce "done" after both pass
   4. If tests fail, fix first then re-run before announcing

**Rule 4 — Log failures in WORKFLOW_LOG.md.** Every broken cycle, what failed, what fixed it.

**Rule 5 — Never change schema without verifying against ACTUAL_SCHEMA.md first.** Migration files and live DB drift. Always check the REST API to confirm actual columns.

---

## Frontend Design

**ALWAYS read `.claude/skills/frontend-design/SKILL.md` before writing any UI code.** The skill takes precedence over generic AI aesthetics.

Design tokens are in `src/app/globals.css` as CSS variables (dark + light theme). Do not use hardcoded colors in components — reference the CSS variable.

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 + React 19 + TypeScript |
| Styling | TailwindCSS 4 + CSS variables (design system in `globals.css`) |
| Database | Supabase (PostgreSQL, RLS) |
| Payments | Stripe Checkout + Webhooks |
| Email | Resend |
| Hosting | Vercel |

---

## Architecture Principles

- **Public booking flow** (`/book`, `/school/[slug]`) — no auth, service role for reads
- **Admin dashboard** (`/school-admin/*`) — middleware checks session + school ownership
- **School ownership** — `owner_email` match on auth user, passed via `x-school-id` header (set by middleware)
- **Service role** — bypasses RLS for admin operations, never exposed to client
- **Booking tokens** — `booking_token` and `confirmation_token` both stored as same UUID at creation; lookups check `booking_token` first, fallback to `confirmation_token`
- **Student PII** — `legal_name`, `permit_number`, `emergency_contact_phone` encrypted at rest with AES-GCM

---

## Key Files

```
src/app/api/
├── booking-links/[token]/   # Public — lookup + cancel/confirm by token
├── bookings/                  # Create booking, list by school
├── bookings/[booking_id]/checkout/  # Stripe checkout session creation
├── slots/                     # Public — available sessions for booking
├── webhooks/stripe/          # Stripe event handler
├── reminders/                 # Cron — 48h + 4h email reminders
├── auth/demo-login/          # Demo instant login (PIN 0000)
└── demo/                     # Demo-mode data endpoints

src/lib/
├── supabase/server.ts        # createClient() + getSupabaseAdmin()
├── supabase/types.ts         # Shared interfaces + joined types
├── supabase/database.types.ts  # Actual DB column types (verified against live DB)
├── security.ts              # AES-GCM encrypt/decrypt, validation, auditLog
└── email.ts                 # Resend wrapper + sendWelcomeEmail
```

---

## Critical Rules

- Auth check + ownership check + `school_id` in WHERE clause on every admin route
- `school_id` comes from `user.user_metadata.school_id` or middleware header — never trust client-supplied
- Encryption key required at startup — throws if missing or < 32 chars
- Webhook signature verification always enabled
- `DEMO_MODE=true` skips auth in demo endpoints; never use in production

---

## Design System

Tokens defined in `src/app/globals.css` as CSS variables. Key tokens:

```css
--bg-base, --bg-surface, --bg-elevated
--text-primary, --text-secondary, --text-muted
--accent, --accent-glow, --accent-secondary
--success, --card-bg, --card-border
--border, --glass-bg, --glass-border
```

Key classes: `.glass-card`, `.bento-grid`, `.bento-large`, `.kpi-card`, `.status-pill`, `.nav-pill`, `.bg-circle`, `.metric-card`, `.session-card`, `.quick-action`, `.btn-glow`, `.btn-ghost`, `.btn-pill`

---

## Current Build Status

- `npm run build` → ✅ passes  
- `npm run typecheck` → ⚠️ `.next/types/validator.ts` pre-existing error (Next.js internal, does not block builds)  
- `npm run dev` → ✅ runs

---

## Pre-existing Issues (Known — Do Not Block)

| Issue | Why Not Fixed |
|---|---|
| `.next/types/validator.ts` TypeScript error | Next.js internal generated types, unrelated to project code |
| Migration 004 references `s.cancelled` and `s.start_time` | Migrations not rerun; slots route uses direct queries that bypass the broken function |
| `as any` casts throughout routes | TypeScript types are decorative — would require larger refactor to fix properly |

---

## Schema Source of Truth

`ACTUAL_SCHEMA.md` — verified against live Supabase DB via REST API (2026-04-28). **Always check this file before writing queries against a table you've never touched.** Column names in migrations can drift from actual DB schema.

---

## Additions to This File

Update this file when:
- New API routes are added
- Environment variable requirements change
- Architecture decisions are made
- Known issues list changes