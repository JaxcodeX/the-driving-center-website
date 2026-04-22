# Product Gap Analysis — Current vs Sellable SaaS

**Date:** 2026-02-25 (from live DB sync)
**Product:** The Driving Center — SaaS Platform for Driving Schools
**Target state:** MVP capable of collecting $49-99/month from one real school owner

---

## What Exists (from codebase audit)

### Frontend Components (7 files — all on landing page only)

| File | State | Notes |
|---|---|---|
| `src/app/page.tsx` | ✅ Working | Mounts landing page: ParticleBackground → Navbar → Hero → Features → Stats → Footer |
| `src/components/Hero.tsx` | ✅ Working | Typewriter animation headline, CTA buttons (non-functional), trust badges |
| `src/components/Features.tsx` | ✅ Working (visual only) | 6-card grid of feature descriptions. No actual functionality behind any card |
| `src/components/Stats.tsx` | ✅ Working | Animated counters — all fake data (1,200 schools, 50,000 lessons, 99.9% uptime, 4.9/5 rating) |
| `src/components/Navbar.tsx` | ✅ Working | Sticky nav with scroll effect. "Get Started" button goes nowhere |
| `src/components/ParticleBackground.tsx` | ✅ Working | Canvas particle effect, purely decorative |
| `src/components/Stats.tsx` | ✅ Working | Social proof counters — fully fabricated, zero real data |

**No other pages exist.** The entire Next.js app is a single-page landing site.

### Backend / API Routes
**None exist.** There are zero `src/app/api/` routes in the codebase. The architecture doc references `/api/admin/emergency-log` and Stripe webhook handlers — none are present in the file system.

### Dashboard & Admin
**Does not exist.** The architecture doc describes a `/dashboard` route with `QuickStatsRow`, `LogDriveDrawer`, and a Kill Switch — but the `src/app/` directory contains only one page. No dashboard, no student management UI, no session logging.

### Student Portal
**Does not exist.** Referenced in `Features.tsx` as a selling point but has no implementation.

### PWA
`@ducanh2912/next-pwa` is mentioned as configured in architecture docs. No `manifest.json` or service worker config found in codebase audit.

### Database (Supabase — live, 5 tables)

| Table | Rows | Status |
|---|---|---|
| `students_driver_ed` | 0 | Schema exists; no student data |
| `sessions` | 8 | Live rows with `start_date`, `end_date`, `max_seats`, `seats_booked` |
| `payments` | 0 | Stripe payments table — empty |
| `traffic_school_compliance` | 0 | Court jurisdiction tracking — empty |
| `audit_logs` | 0 | Audit log table — empty |

**Critical:** `seats_booked` stays at 0 on all 8 live sessions because the Stripe webhook pipeline is not wired.

### Authentication
**Not implemented.** Supabase magic link auth is in the architecture but no auth routes, no login page, no middleware auth guard, no school-specific routing. The `src/app/layout.tsx` has no auth provider.

### Payments (Stripe)
**Not wired.** Business plan says "Priority 1: Wire Stripe to the website." No Stripe Checkout integration exists in the codebase. `payments` table exists but is empty.

### Scheduling (Calendly)
**Not wired.** The `GeofenceCheck` component is described in the architecture doc but not in the codebase. The Calendly inline widget is a dashed-border placeholder.

---

## What Needs to Be Built for MVP

Ranked by what blocks a school from paying you.

### 🔴 Priority 1 — Auth & Multi-Tenancy
**Supabase magic link auth with school-specific UUID routing**

Every request must route to the school's data. Without this, you can't have multi-tenant SaaS.

Implementation:
- `src/app/auth/callback/route.ts` — magic link callback handler
- `src/middleware.ts` — intercepts all `/dashboard/*` and `/admin/*` routes, verifies session, attaches `school_id` to request headers
- `src/lib/supabase/server.ts` — server-side Supabase client using `createServerClient` with cookie-based session
- `src/lib/supabase/client.ts` — client-side Supabase client for signed-in browser sessions
- RLS policies must be updated: add `school_id` column to every table, rewrite all policies to filter by `auth.jwt() -> school_id`

### 🔴 Priority 2 — School Onboarding Flow
**New school signs up → creates account → sets up their profile**

Missing entirely. No signup page, no onboarding wizard.

Implementation:
- `src/app/signup/page.tsx` — school registration form (school name, owner name, email, phone)
- `src/app/onboarding/page.tsx` — ZIP code service area, instructor count, pricing tier selection
- `src/lib/onboarding.ts` — creates school record in `schools` table (new table needed), sends magic link
- Supabase Edge Function to create the school tenant on signup

### 🔴 Priority 3 — Stripe Payment Integration
**Collect money. This is the entire point.**

Implementation:
- `src/app/api/stripe/checkout/route.ts` — creates Stripe Checkout session with `school_id` metadata
- `src/app/api/stripe/webhook/route.ts` — verifies HMAC-SHA256 signature, handles `checkout.session.completed`, increments `seats_booked` on correct session, creates `payments` row
- Stripe portal for schools to manage subscription (embedded Stripe Customer Portal)
- Prerequisite: create Stripe product/price for the $49-99/mo subscription

### 🔴 Priority 4 — Admin Dashboard
**The thing the school owner logs in to see.**

Implementation:
- `src/app/dashboard/page.tsx` — mobile-first PWA layout (locked 448px max-width)
- `src/components/dashboard/QuickStatsRow.tsx` — drives completed, pending certs, revenue (privacy toggle)
- `src/components/dashboard/ActiveSessionCard.tsx` — current student, session timer
- `src/components/dashboard/LogDriveDrawer.tsx` — bottom-sheet for logging completed drives
- `src/components/dashboard/KillSwitch.tsx` — red emergency button, GPS capture, calls `/api/admin/emergency-log`
- Dashboard fetches data server-side via Supabase server client (no client-side key exposure)

### 🔴 Priority 5 — Booking / Scheduling
**Students can book lessons.**

Implementation:
- `src/app/book/page.tsx` — student-facing booking page (per-school, school_id in URL)
- `src/app/api/sessions/route.ts` — fetches available sessions for the school
- Either embed real Calendly (requires account URL from school) or build a native booking form
- GeofenceCheck component (ZIP validation before Calendly reveal) — exists in docs but not in codebase; needs to be built as `src/components/GeofenceCheck.tsx`
- Student receives confirmation email (via n8n workflow triggered by session booked)

### 🟡 Priority 6 — Student Portal (Lite)
**What students see after booking.**

- Booking confirmation page with details
- Student can see upcoming sessions, driving hours accumulated
- No full portal needed for MVP — a confirmation page is enough

### 🟡 Priority 7 — Twilio SMS (Kill Switch Phase 2)
**Emergency SMS to school owner.**

Currently `console.log` in the emergency-log handler. Needs:
- `src/lib/twilio.ts` — Twilio client
- Update `/api/admin/emergency-log` to actually send SMS after audit log insert

### 🟡 Priority 8 — PWA Manifest
**For in-vehicle install on instructor phone.**

- `public/manifest.json` — PWA manifest with icons, theme color, display: standalone
- Service worker registration for offline shell caching

---

## The 6 RW Items That Block Everything

These are the critical unresolved items that every developer touching this project will hit and not know how to fix.

### RW1: School Identity & Multi-Tenant Isolation

**The problem:** There is no `schools` table. The entire multi-tenant architecture is described in docs but has no implementation. Every table (`students_driver_ed`, `sessions`, `payments`) lacks a `school_id` column. All data is global.

**The fix:**
```sql
-- Add schools table
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  plan_tier TEXT DEFAULT 'starter',
  service_zips TEXT[], -- array of covered ZIP codes
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add school_id to every data table
ALTER TABLE students_driver_ed ADD COLUMN school_id UUID REFERENCES schools(id);
ALTER TABLE sessions ADD COLUMN school_id UUID REFERENCES schools(id);
ALTER TABLE payments ADD COLUMN school_id UUID REFERENCES schools(id);

-- Rewrite RLS: every policy becomes
CREATE POLICY "service_role_all_school" ON students_driver_ed
  FOR ALL TO service_role
  USING (school_id = (SELECT school_id FROM schools WHERE owner_email = auth.jwt()->>'email'));
```

Until this is done, there is no SaaS — only a single-school app.

### RW2: Auth Callback & Session Flow

**The problem:** No magic link auth flow exists in the codebase. `src/middleware.ts` doesn't exist. Every protected route will be accessible to anyone.

**The fix:**
`src/app/auth/callback/route.ts`:
```ts
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  if (code) {
    const supabase = createServerComponentClient({ cookies })
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return redirect('/dashboard')
  }
  return redirect('/login-error')
}
```

`src/middleware.ts`:
```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Protect /dashboard and /admin routes
  // Check session cookie, redirect to login if missing
  // Attach school_id to headers for downstream use
}
```

### RW3: Stripe Webhook Signature Verification

**The problem:** The architecture doc claims webhook signature verification exists but the route doesn't exist in the codebase. Without it, anyone can POST fake payment events and get free enrollment.

**The fix:**
`src/app/api/stripe/webhook/route.ts`:
```ts
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!
  
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const schoolId = session.metadata?.school_id
    // Look up session ID from metadata, increment seats_booked
    // Create payments row with status='paid'
  }

  return new Response('OK')
}
```

### RW4: n8n → Supabase Wire (Stripe Checkout to Enrolled Student)

**The problem:** When a student pays via Stripe, nothing happens. The payment is recorded in Stripe but the student isn't actually enrolled in the course. The `payments` table has 0 rows. The onboarding workflow exists in n8n but isn't triggered.

**The fix:**
The Stripe webhook must be the trigger. When `checkout.session.completed` fires:
1. Supabase: create row in `payments` with `status='paid'`
2. Supabase: create row in `students_driver_ed` (minimal student record from Stripe email)
3. Trigger n8n webhook: `POST https://your-n8n-instance/webhook/student-onboarding` with student email
4. n8n workflow: sends welcome email, creates Calendly booking link, initializes driving_hours=0

Without this, paying a customer produces nothing.

### RW5: seats_booked Auto-Increment on Payment

**The problem:** The `sessions` table has 8 live rows but `seats_booked` is 0 on all of them and never changes. The architecture doc explicitly calls this out. The Stripe webhook doesn't update it.

**The fix:**
In the Stripe webhook handler, when `checkout.session.completed`:
```ts
const sessionId = event.data.object.metadata?.session_id
if (sessionId) {
  await supabase.rpc('increment_seats_booked', { session_id: sessionId })
}
```
Where the RPC is:
```sql
CREATE OR REPLACE FUNCTION increment_seats_booked(session_id UUID)
RETURNS void AS $$
  UPDATE sessions
  SET seats_booked = seats_booked + 1
  WHERE id = session_id AND seats_booked < max_seats;
$$ LANGUAGE sql SECURITY DEFINER;
```

### RW6: legal_name & permit_number App-Level Encryption

**The problem:** The architecture doc says these fields must be encrypted at the application layer. This is a TCA 1340-03-07 compliance requirement. The schema has comments saying 🔒 but no actual encryption exists.

**The fix:**
These fields should be encrypted with a per-school key before insertion and decrypted on read. Implementation requires:
- Add `encryption_key` column to `schools` table
- Build `src/lib/encryption.ts` using Node.js `crypto` module (AES-256-GCM)
- Encrypt on insert: `student.legal_name = encrypt(formData.legal_name, schoolKey)`
- Decrypt on read: `student.legal_name = decrypt(dbRow.legal_name, schoolKey)`
- RLS must prevent one school from decrypting another's records (ensured by school_id isolation in RW1)

---

## MVP Feature Priority

If you could only build 5 things before the first sale, in this exact order:

1. **School signup + magic link auth** — without this you can't have accounts. You need schools to be able to sign up and log in. Signup page + auth callback + middleware guard.

2. **Stripe checkout (collect money)** — create the subscription product in Stripe Dashboard ($49/mo Starter tier). Build the checkout API route + webhook handler + payments table write. This is the entire business model.

3. **Admin dashboard (the thing they see)** — build the `QuickStatsRow` with real revenue pulled from `payments` table, a student list view, a session view. This is what makes it feel real vs. a landing page.

4. **Session availability + booking** — schools need to create/manage sessions. Students (or school staff on behalf of students) need to see open seats and book. This is the core product workflow.

5. **Student enrollment wire (Stripe → Supabase)** — when a student pays, they must appear in the `students_driver_ed` table and increment `seats_booked`. Right now paying does nothing. This is the gap that makes the entire product feel broken even when it looks like it's working.

Skip: Kill Switch SMS, PWA manifest, instructor management, DMV compliance module. These are nice-to-have but none of them are why a school pays you.

---

## What's Missing That Nobody Talks About

These are the things a real school owner will expect on day one that are completely absent from all current specs:

### "How do I add my first student?"

Every spec talks about student management but there is no "Add Student" form. In the real world, a school owner has existing students they want to migrate or enter manually. There is no bulk import, no CSV upload, no manual student creation form. They will ask "can I just type in my students?" and the answer right now is no.

### "What happens when a student doesn't have an email?"

Some teenage driving students don't have email addresses. The entire auth flow is email-based (magic links). There is no fallback: phone number login, student code, or parent email as proxy. This will come up immediately in a real sales conversation.

### "Can I change my school name / logo?"

There is no school branding system. No way to set a school name, logo, colors, or custom domain. Every school will want this. Right now it's a generic "The Driving Center" everywhere with no per-tenant theming.

### "What if I have multiple instructors?"

Instructor management is listed as a feature in `Features.tsx` but there is zero implementation. No way to add instructors, assign them to students, track their hours, or set availability. Any school with 2+ instructors hits a wall immediately.

### "How do I handle a refund?"

Stripe refund flow is not built. If a school owner needs to refund a student, there is no UI to do that. They would have to go directly to Stripe dashboard. There's also no policy defined: what is the refund window? Who approves refunds? This is a support nightmare waiting to happen.

### "I need a student to sign a contract"

The `students_driver_ed` table has `contract_signed_url` and `signature_url` columns. The architecture mentions DocuSign integration. There is no contract signing flow, no signature capture, no way to store or retrieve signed contracts. This is legally important for a driving school and completely missing.

### "Can I see all payment history?"

No payments UI exists. No transaction history, no invoice generation, no monthly revenue report. The `payments` table is sitting empty with zero UI to view it.

### "What's my monthly summary?"

No reporting. No export to CSV or PDF. No tax-ready summary. A school owner doing their books at month-end will have no data to pull from this system.

### "Show me a demo login"

There is no demo/sandbox mode. To show a prospective customer the product, you'd need to create a real account with real data, which means either spinning up a fake school manually or giving them access to a real one. A demo mode with fake data pre-populated would close sales much faster.