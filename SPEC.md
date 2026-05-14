# SPEC.md — The Driving Center SaaS
**Consolidated: 2026-05-13**
**Previous files merged:** SPEC_FULL_REDESIGN.md + CLAUDE.md (archived to `/archive/`)

---

## WHAT THIS IS

Single source of truth. Before any feature work: read this. After any change: update this. One doc, no duplicates.

---

## PRODUCT

**The Driving Center** — white-label booking and school management SaaS for driving schools.
- Schools pay $99/mo for all-in-one management: scheduling, student tracking, TCA compliance, payment collection
- Target customer: small driving schools (1-3 instructors) currently using scattered tools (Wix, Google Calendar, phone/email, paper)
- Migration story: "import everything in one import, pay $99/mo, never go back to the old way"

---

## STACK

| Layer | Tool |
|---|---|
| Framework | Next.js 16 + React 19 + TypeScript |
| Styling | TailwindCSS 4 + CSS variables (design tokens in `globals.css`) |
| Database | Supabase (PostgreSQL, RLS) |
| Payments | Stripe Checkout + Webhooks |
| Email | Resend |
| Hosting | Vercel (auto-deploy on `main`) |

---

## DESIGN SYSTEM

### Color Palette (Dark Only)

```css
--bg-base: #000000           /* True black */
--bg-surface: #0F0F0F         /* Card backgrounds */
--bg-elevated: #141414        /* Elevated elements */
--text-primary: #FFFFFF       /* White */
--text-secondary: #9CA3AF      /* Muted */
--text-muted: #6B7280         /* Dim */
--border: rgba(255,255,255,0.06)
--border-hover: rgba(255,255,255,0.12)

--accent: #1A56FF             /* Vibrant blue (primary CTA) */
--accent-glow: rgba(26,86,255,0.20)
--accent-secondary: #F97316   /* Vibrant orange */
--success: #4ADE80            /* Green */
--danger: #EF4444             /* Red */
--warning: #F59E0B            /* Amber */
```

### Typography
- **Display:** Inter 800, clamp(56px, 7vw, 88px), letter-spacing -0.03em, line-height 1.0
- **Headlines:** Outfit 700, 36-48px, letter-spacing -0.02em
- **Body:** Inter 400, 17px, line-height 1.7, text-secondary color
- **Labels:** Inter 600, 12px, all-caps, letter-spacing 0.08em

### Key Classes
`.glass-card`, `.bento-grid`, `.kpi-card`, `.status-pill`, `.btn-pill`, `.admin-sidebar`, `.admin-card`, `.admin-input`, `.hero-gradient`, `.mesh-gradient`

### Rule: NO hardcoded colors
Use CSS variables or globals.css utility classes. Every component.

---

## PAGES

### Public
- `/` — Landing page (dark premium, DesignJoy-inspired)
- `/login` — Glassmorphic modal, demo PIN support
- `/book` — Student booking flow
- `/school/[slug]` — Public school page

### Admin (`/school-admin/*`)
All admin pages share the same shell:
- **Sidebar:** 240px, #0F0F0F, icon + label nav, active state with left accent border
- **TopBar:** Page title (Outfit 600, 24px), right avatar
- **Content:** #000000 background, max-width 1200px, padding 32px
- **Cards:** #0F0F0F, border 1px rgba(255,255,255,0.06), border-radius 16px

**Sub-pages (MUST match shell exactly):**
`/students`, `/instructors`, `/sessions`, `/calendar`, `/billing`, `/profile`, `/availability`, `/ops`, `/import`, `/onboarding`

### Rule: All sub-pages use shared Sidebar + TopBar components
`@/components/admin/Sidebar.tsx`, `@/components/admin/TopBar.tsx`

---

## BOOKING FLOW — OPEN DECISION

**⚠️ UNRESOLVED — Blocks all scheduling features**

Date-only vs time-specific. One of these must be chosen before any new scheduling work:

**Option A: Date-first**
Student picks: Date → Session Type → Time slot on that date

**Option B: Pre-defined slots**
Student picks from cards showing [Date + Time + Instructor] as one unit

**Option C: Hybrid**
"Next available" fast path + option to pick specific date/time

**Decision required from:** Mark Martin

---

## API ARCHITECTURE

### Public (no auth)
- `POST /api/bookings` — Create booking
- `GET /api/slots?school_id=&session_type_id=` — Available slots
- `GET /api/booking-links/[token]` — Lookup booking by token
- `POST /api/booking-links/[token]/cancel` — Cancel
- `POST /api/booking-links/[token]/checkout` — Stripe checkout or demo confirm

### Admin (auth required)
- `GET|POST /api/students`
- `GET|POST /api/sessions`
- `GET|POST /api/instructors`
- `GET|POST /api/schools`
- `GET /api/demo/dashboard` — Demo mode KPIs

### Rules
- `school_id` from `user.user_metadata.school_id` — never trust client-supplied
- Service role bypasses RLS for admin operations
- `DEMO_MODE=true` skips auth in demo endpoints
- **Production: Stripe key MUST be configured or bookings silently confirm without payment**
- Encryption key throws if < 32 chars at startup

---

## DATA MODEL

### Core Tables
- `schools` — school profile, subscription_status
- `users` — auth users, school_id in user_metadata
- `students` — name, email, phone, permit_number (encrypted), TCA tracking
- `instructors` — name, email, phone
- `sessions` — school_id, instructor_id, session_type_id, start_date, status, seats_booked/max_seats
- `session_types` — name, deposit_cents, duration_minutes
- `bookings` — student info, session_id, deposit_amount_cents, status, booking_token/confirmation_token

### Schema Source of Truth
`ACTUAL_SCHEMA.md` — verified against live Supabase REST API. **Check this file before writing queries against any table.**

---

## CURRENT BUILD STATUS

| Check | Status |
|---|---|
| `npm run build` | ✅ Passes |
| `npm run typecheck` | ⚠️ `.next/types/validator.ts` (Next.js internal, non-blocking) |
| Multi-tenant RLS | ✅ Audited April 2026 |
| Demo mode booking bypass | ❌ **BUG — needs fix** |
| `deposit_paid_at` column | ❌ **Referenced but doesn't exist in DB** |
| CSV Import Tool | ✅ Upgraded — file upload + preview + progress |
| Onboarding Wizard | ✅ `/school-admin/onboarding` — 4 steps + Stripe |

---

## OPEN BUGS

| # | Bug | File | Status |
|---|-----|------|--------|
| 1 | Booking flow confirms WITHOUT Stripe in production | `booking-links/[token]/checkout/route.ts` | OPEN |
| 2 | `deposit_paid_at` selected but column doesn't exist | `booking-links/[token]/route.ts` | OPEN |
| 3 | Migration 010 `owner_email UNIQUE` not applied | Manual Supabase SQL | OPEN |
| 4 | `deposit_paid_at` referenced in GET route | Same as #2 | OPEN |

---

## WORKFLOW RULES

1. **Write SPEC.md before any feature work**
2. **Run `tsc --noEmit` before committing** (fast, 5-8 sec)
3. **Full `npm run build` only after TypeScript passes**
4. **Commit with tag `[prov: everest]`**
5. **Verify against ACTUAL_SCHEMA.md before touching any table**
6. **One phase at a time. No concurrent P0 work.**

---

## PHASES

### P0 — STABLE CORE (current)
Fix bugs 1-4. Sub-page consistency. Playwright tests.

### P0 — STABLE CORE ✅
Fixed: booking flow Stripe confirmation, deposit_paid_at column, sub-page consistency.

### P1 — SCHOOL MIGRATION ✅
- **CSV Import Tool** (`/school-admin/import`): File upload + text paste, browser-side preview, row-by-row progress, dedup by DOB, encrypted PII storage
- **Onboarding Wizard** (`/school-admin/onboarding`): 4-step flow (school info→instructors→session types→Stripe checkout), demo bypass for demo school, service-role API endpoints

### P2 — AGENT INFRASTRUCTURE
Onboarding agent. Migration agent. Ops digest agent.

### P3 — STRIPE LIVE
Real subscriptions. Prorated billing. Plan upgrades.

---

*This file is the only spec. Everything else lives in `/archive/`.*