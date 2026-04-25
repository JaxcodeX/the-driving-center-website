# The Driving Center SaaS — Build Plan
**Phase 0 (Foundation Fixes) through Phase 3 (First Paying Customer)**

---

## What Exists Right Now

```
~/projects/the-driving-center-website/
├── src/app/
│   ├── page.tsx                    # Landing page ✅
│   ├── signup/page.tsx             # School signup ✅
│   ├── auth/callback/route.ts      # Magic link → school link ✅ (fixed)
│   ├── login/page.tsx              # Magic link request ✅
│   ├── dashboard/page.tsx          # Student dashboard ✅
│   ├── school-admin/               # 7 admin pages (UI exists, wiring mixed)
│   │   ├── page.tsx                # Overview
│   │   ├── students/page.tsx      # Student list
│   │   ├── sessions/page.tsx       # Session list
│   │   ├── calendar/page.tsx       # Visual calendar
│   │   ├── instructors/page.tsx   # Instructor management
│   │   ├── profile/page.tsx        # School profile edit
│   │   ├── availability/page.tsx   # Availability settings
│   │   ├── import/page.tsx          # CSV import (stub)
│   │   └── ops/page.tsx            # Vercel/Supabase/Stripe panel
│   ├── book/page.tsx               # 5-step booking wizard ✅
│   ├── book/confirmation/page.tsx  # Post-booking confirmation
│   ├── complete-profile/page.tsx   # Student profile completion (fixed)
│   ├── onboarding/page.tsx         # 5-step onboarding wizard
│   └── instructor/schedule/page.tsx # Read-only instructor view
├── src/app/api/
│   ├── schools/                    # POST creates school + Stripe checkout ✅
│   ├── sessions/                  # CRUD for sessions ✅
│   ├── students/                  # CRUD for students ✅
│   ├── instructors/               # CRUD for instructors ✅
│   ├── bookings/                  # Booking management ✅
│   ├── stripe/checkout/           # Creates Stripe checkout session ✅
│   ├── webhooks/stripe/           # Handles payment events ✅
│   ├── seed/route.ts              # Demo data seeding ✅
│   └── ops/                       # Vercel/DB/Stripe ops panel ✅
├── src/lib/
│   ├── supabase/server.ts + client.ts  ✅
│   ├── email.ts + email-templates/     # 4 email templates ✅
│   ├── security.ts                     # Audit log ✅
│   ├── migrations/001-005             # SQL migrations ✅
│   └── twilio.ts                       # Stub (not wired)
└── middleware.ts                      # Protects /school-admin/* ✅
```

**Working end-to-end:**
- School owner signs up → Stripe checkout → magic link → auth callback → school admin dashboard
- Students book sessions → Stripe payment → webhook → seat incremented
- 48h + 4h email reminders (stub, not wired to cron yet)

---

## What Is Broken

### P0 — Must Fix Before Any School Can Use It

| # | Issue | Impact | Fix |
|---|-------|--------|-----|
| P0-1 | `owner_user_id` column missing in `schools` table | Auth callback writes owner claim to wrong column | Run SQL migration |
| P0-2 | `DEMO_OWNER_EMAIL` not in Vercel | Ops panel is inaccessible | Add to Vercel dashboard |
| P0-3 | Booking confirmation email not wired | Students don't get email after paying | Wire webhook → notify/booking API |
| P0-4 | CSV import page is a stub | Schools can't bulk-import students | Build actual import logic |
| P0-5 | Instructor schedule API uses `decryptField` (wrong) | Instructor schedule page returns 500 | Fix to `decrypt` |

### P1 — Core School Admin Features

| # | Feature | Status |
|---|---------|--------|
| P1-1 | Student profile edit (name, permit, DOB update) | Stub |
| P1-2 | Session create/edit/delete | Create and delete only, no edit |
| P1-3 | Instructor create/edit/delete | CRUD mostly there |
| P1-4 | TCA compliance: certificate issuance + court clerk notification | Stub |
| P1-5 | SMS reminders (48h + 4h) | Stub (Twilio not wired) |
| P1-6 | GeofenceCalendly embed | Placeholder div only |

---

## Phase 0 Plan (Foundation — 1-2 hours)

**Goal:** Make the existing signup flow actually work for a new school.

### Step 1: Run SQL Migration (you, in Supabase SQL Editor)

```sql
-- Add owner_user_id column so auth callback has a place to write owner claim
ALTER TABLE schools ADD COLUMN owner_user_id UUID;

-- Link existing demo school to a placeholder owner
UPDATE schools SET owner_user_id = '00000000-0000-0000-0000-000000000001'
WHERE id = '1576f434-8b52-41fb-a5c4-a21cf3b40086';
```

### Step 2: Add DEMO_OWNER_EMAIL to Vercel
- Go to: Vercel Dashboard → Project Settings → Environment Variables
- Key: `DEMO_OWNER_EMAIL`
- Value: `zax@the-driving-center.com` (or your email)
- Target: Production

### Step 3: Verify Flow End-to-End
1. Open incognito window
2. Go to `the-driving-center-website.vercel.app/signup`
3. Sign up as a new school
4. Check email for magic link
5. Click link → should land on `/school-admin` with real data

### Step 4: Fix Instructor Schedule API
- File: `src/app/api/instructor/schedule/route.ts`
- Change `decryptField` → `decrypt`

---

## Phase 1 Plan (Core Product — 1-2 weeks)

**Goal:** A school owner can run their entire operation from the dashboard.

### P1-A: Student Management
- Student profile edit page
- View enrolled sessions per student
- TCA hours tracking (classroom + driving)
- Certificate issuance with PDF download

### P1-B: Session Management
- Create session: pick date range, session type, instructor, max seats
- Edit session (inline from calendar)
- Cancel session (with notification to enrolled students)
- Duplicate session series (e.g., every Monday for 8 weeks)

### P1-C: Notifications & Reminders
- Wire 48h and 4h email reminders to OpenClaw cron
- Wire Twilio SMS (requires Twilio API keys)
- Confirm bookings → send email via Resend

### P1-D: CSV Import
- Upload CSV with student list
- Map columns to fields (name, email, phone, permit#, DOB, parent email)
- Preview before import
- Run import with error reporting

---

## Phase 2 Plan (Stripe + Payments — 1 week)

**Goal:** Actually collect money.

- Review and finalize Stripe checkout flow
- Handle `checkout.session.expired` (retry option)
- Handle `invoice.payment_failed` (pause access)
- Add $25 setup fee vs $99/mo only (discuss with Zax)
- Referral program: give existing schools incentive to refer others

---

## Phase 3 Plan (Marketing + Launch)

**Goal:** First 5 paying schools.

Based on B.L.A.S.T. Protocol (adapted for OpenClaw):
- **B:** Define personas — who is the ideal first customer?
- **L:** Verify email deliverability, Stripe works in live mode
- **A:** Sub-agents: Researcher (find leads), Marketing (write outreach), Coder (landing page for lead capture)
- **S:** Polish referral program UI, email sequences
- **T:** Cold outreach to 10 Tennessee driving schools, set up cron for follow-ups

---

## Architecture Decisions (Locked)

1. **Multi-tenant by `school_id`** — every table, every query
2. **Auth via Supabase Magic Links** — no passwords
3. **Payments via Stripe** — subscriptions only, no direct card storage
4. **No n8n** — OpenClaw sub-agents handle automation
5. **Encryption for PII** — legal_name and permit_number encrypted at app level
6. **OpenClaw as orchestration layer** — coding agent for implementation, me as conductor

---

## What We're NOT Building (Out of Scope for MVP)

- Mobile app
- Native SMS from the app (Twilio stub only)
- Multi-school franchise management
- Parent portal (separate from student)
- Automated marketing sequences (beyond reminders)
- API for third-party integrations

---

## How to Run Each Phase

**B.L.A.S.T. Cycle per feature:**
1. Write SPEC.md for the feature
2. Verify connections (L)
3. Spawn coding agent to implement (A)
4. Review output (S)
5. Deploy (T)
6. Log failures in LOG.md

**Example — P1-D (CSV Import):**
```
SPEC.md: defines CSV column mapping, preview UI, error reporting
L: test Supabase write access for bulk insert
A: spawn agent → builds upload + preview + import
S: review the import flow, check error edge cases
T: push to main → Vercel deploys
LOG: document what failed during testing
```