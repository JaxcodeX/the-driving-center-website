# PLAN_ENTERPRISE_READY.md — The Driving Center SaaS
**Audited: 2026-05-14**
**Goal:** Make this product usable by a real driving school owner (e.g., Matt Reedy) for $99/mo

---

## Executive Summary

The Driving Center has a beautiful dark-themed UI, working demo mode, and a solid architectural foundation (multi-tenant RLS, Supabase auth, Stripe webhook integration, encrypted PII). However, **it is not ready for a paying production customer.** Several critical gaps block a real instructor from signing up, paying, and using the system:

- **No working Stripe subscription** ($99/mo); `STRIPE_STARTER_PRICE_ID` is likely not configured
- **No instructor login/dashboard** — instructors can't log in and see their schedule
- **Email notifications are stubs** — no RESEND_API_KEY configured, so booking confirmations and reminders are silently logged to console
- **Booking confirmation email is never sent** — notification route exists but nobody calls it
- **No public booking page per school** — students need a school-specific booking link
- **Login is magic-link only** — no password-based login for production users who want it

The list below identifies everything that MUST work end-to-end before onboarding a real school. It is ordered by criticality.

---

## Already Working (Don't Redo)

These features work end-to-end in both demo and production modes:

| Feature | Notes |
|---|---|
| School signup (`/signup` → `POST /api/auth/signup`) | Creates school record + auth user. Handles demo + production. |
| Demo login (`/login` → `POST /api/auth/demo-login`) | PIN: 0000, 7-day session cookie, JWT for Supabase client |
| School admin dashboard (`/school-admin`) | KPIs, upcoming sessions, pending actions, modal breakdowns |
| Student CRUD (`POST/GET /api/students`) | Create, list with encryption/decryption, ownership check |
| Session CRUD (`POST/GET /api/sessions`) | Create, list with ownership check |
| Instructor CRUD (`POST/GET /api/instructors`) | Create, list with ownership check |
| Session types API (`GET /api/session-types`) | Public + admin routes work |
| Slots API (`GET /api/slots`) | Returns available sessions with seat count |
| Booking creation (`POST /api/bookings`) | Uses `book_seat` RPC for atomic seat locking |
| Stripe checkout for booking (`POST /api/bookings/[id]/checkout`) | Creates Stripe Checkout session |
| Stripe webhook handler (`POST /api/webhooks/stripe`) | Handles checkout.completed, subscription.updated/deleted, invoice.payment_failed |
| Booking confirmation page (`/book/confirmation?token=`) | Fetches by token, shows booking details |
| CSV import tool (`/school-admin/import`) | File upload, preview, row-by-row progress, dedup |
| Onboarding wizard (`/school-admin/onboarding`) | 4-step flow: school info → instructors → session types → subscription |
| Reminder system (`/api/reminders`) | 48h + 4h cron-ready with both email and SMS channels |
| Instructor availability (`/instructor/schedule`) | Set weekly availability by day |
| Middleware (`/school-admin/*` guard) | Checks demo_session cookie or Supabase auth + subscription_status |
| RLS isolation | Cross-tenant isolation tested and working |
| Migration 010 (`UNIQUE on owner_email`) | Applied in Supabase Management API |
| `getSupabaseAdmin()` centralized | Single import from `@/lib/supabase/server` |
| Dark mode design system | CSS variables, glass cards, bento grid — consistent UI |

---

## Critical Path — What MUST Work Before a Real Instructor Can Pay and Use

### Phase 1: Auth & Onboarding (Must Work to Get First Paying Customer)

#### 1.1 Configure Stripe Subscription ($99/mo)
**What it is:** Set `STRIPE_SECRET_KEY` and `STRIPE_STARTER_PRICE_ID` environment variables in Vercel so the onboarding wizard actually creates a real Stripe Checkout session for $99/mo.

**Why it matters:** Without this, no one can pay. The onboarding wizard silently skips Stripe in DEMO_MODE and returns an error in production.

**What file/endpoint to build/modify:**
- `src/app/api/onboarding/create-subscription/route.ts` — already handles this, just needs env vars set
- Vercel project settings → Environment Variables

**Estimated complexity:** Low (configuration only, no code changes)

---

#### 1.2 Enable Email (Resend API Key)
**What it is:** Set `RESEND_API_KEY` in Vercel so welcome emails, booking confirmations, and reminders actually get delivered.

**Why it matters:** Right now ALL emails silently log to `console.log`. A real user signing up gets no welcome email, no booking confirmation, and no reminders. This is a dealbreaker.

**What files to modify:**
- `src/lib/email.ts` — already handles sending when key is configured
- Vercel environment variables: `RESEND_API_KEY`

**Estimated complexity:** Low (configuration only)

**Additional work:**
- The `from` address currently uses `onboarding@resend.dev` — this needs to be changed to a verified domain (e.g., `noreply@thedrivingcenter.com`) for production deliverability
- `src/lib/email.ts` line: `from: 'The Driving Center <onboarding@resend.dev>'`

**Estimated complexity:** Low

---

#### 1.3 Send Booking Confirmation Email on Successful Payment
**What it is:** When a student pays the deposit via Stripe and the webhook confirms the booking, the system should automatically send a booking confirmation email.

**Why it matters:** Students need to know their booking was confirmed, with date/time/location. Currently the webhook marks the booking as `confirmed` but never calls `/api/notify/booking` or `sendBookingConfirmationEmail()`.

**What files to modify:**
- `src/app/api/webhooks/stripe/route.ts` — after updating booking to `confirmed`, call `sendBookingConfirmationEmail()`
- Or trigger via a database webhook / post-payment hook

**The exact fix:**
In the webhook handler, inside the `if (bookingId)` block for `checkout.session.completed`, add:
```typescript
import { sendBookingConfirmationEmail } from '@/lib/email'
// After updating booking to confirmed:
try {
  const { data: school } = await supabaseAdmin
    .from('schools').select('name, phone').eq('id', sessionSchoolId).single()
  await sendBookingConfirmationEmail(
    studentEmail, studentName, sessionTypeName,
    school?.name ?? 'Your School', school?.phone ?? '',
    dateStr, timeStr, location,
    rescheduleUrl, cancelUrl
  )
} catch (e) { console.error('Confirmation email failed', e) }
```

**Estimated complexity:** Medium (needs data plumbing for date/time/location from webhook context)

---

#### 1.4 Add Password-Based Login
**What it is:** Currently login is magic-link only (email OTP). Add email + password login as an option for production users.

**Why it matters:** Magic links are great but not everyone wants to check their email every time. Password login is table stakes for a production SaaS.

**What files to modify:**
- `src/app/login/page.tsx` — add password email/password tab below magic link tab
- `src/app/api/auth/login/route.ts` — new route that calls `supabase.auth.signInWithPassword()`
- OR add password field to existing magic link form and call `signInWithPassword` on the client

**The simplest approach:** Add a "Password" tab (alongside "Magic Link") on the login page that shows email + password fields and calls `supabase.auth.signInWithPassword()`.

**Estimated complexity:** Low (add form + API call)

---

#### 1.5 Instructor Login Flow
**What it is:** Instructors need their own login mechanism so they can see their schedule without relying on a magic invite link every time.

**Why it matters:** A real school will have 1-3 instructors who need daily access to see their schedule. Currently the only way in is via an invite URL that requires a magic link email. There's no `/instructor/login` page.

**What to build:**

1. **Create `/instructor/login/page.tsx`** — simple email/password or magic link login
2. **Create `/api/instructor/login/route.ts`** — validates instructor credentials, returns JWT
3. **Create `/api/instructor/dashboard/route.ts`** — returns the instructor's upcoming schedule
4. **Create `/instructor/dashboard/page.tsx`** — shows their assigned sessions, bookings, calendar
5. **Middleware for `/instructor/*`** — check instructor session/auth

**Alternative (simpler):** Add an instructor role to Supabase users. When an instructor accepts an invite, they create a password and get a Supabase auth user with `user_metadata.role = 'instructor'` and `user_metadata.school_id`.

**The current `/instructor/schedule` page** loads by reading `instructor_id` and `school` from URL params — this is not authenticated. Anyone with the link can see/edit the schedule.

**Estimated complexity:** High (new pages, auth flow, middleware)

---

### Phase 2: Core School Operations

#### 2.1 Instructor Invite → Account Creation
**What it is:** When a school owner invites an instructor, the instructor should receive an email with a link to create their own login (set password, confirm identity), not just a magic link to view their schedule.

**Why it matters:** The current invite flow generates a magic link or a direct URL with `instructor_id` in the query string. This isn't secure enough for production.

**What files to modify:**
- `src/app/api/instructors/invite/route.ts` — generate a real invite token, store it, send email with invite link
- New: `src/app/invite/accept/[token]/page.tsx` — accept invite, create auth user, set password
- `src/lib/email-templates/invite.ts` — new email template for instructor invitation

**Estimated complexity:** Medium

---

#### 2.2 Public Booking Page Per School (School-Specific `/book/[school_slug]`)
**What it is:** Each school needs a shareable booking link like `thedrivingcenter.com/book/safe-drive-academy` that shows only that school's session types and availability.

**Why it matters:** The current `/book` page requires `school_id` and `session_type_id` as query parameters. Students can't just "go to their school's page and book."

**What files to modify:**
- New: `src/app/book/[slug]/page.tsx` — school-specific booking page
- `src/app/api/slots/route.ts` — already accepts `school_id`, just needs slug resolution
- New: `src/app/api/schools/resolve-slug/route.ts` — resolve slug → school_id

**Alternatively:** Route `/school/[slug]` already exists. Enhance it with a "Book Now" that passes school_id to `/book`.

**Estimated complexity:** Medium

---

#### 2.3 Navigate Back to Login from Signup
**What it is:** The signup page has a link to "/login" but the login page has a "Forgot password?" link that 404s (`/forgot-password` doesn't exist).

**Why it matters:** This is a usability bug that a real user will hit immediately.

**What files to modify:**
- `src/app/login/page.tsx` — remove or fix the "Forgot password?" link (currently links to `/forgot-password` which does not exist)
- Either create `/forgot-password` or remove the link

**Estimated complexity:** Low

---

#### 2.4 Subscription Expiry / Past Due Handling
**What it is:** When a subscription expires or payment fails, the middleware redirects to `/school-admin/billing?reason=past_due`. The billing page should show clear messaging and a "Pay Now" button.

**Why it matters:** A school owner whose card was declined needs to know what happened and how to fix it.

**What files to modify:**
- `src/app/school-admin/billing/page.tsx` — check `searchParams.reason` and show appropriate status message
- The middleware (`src/middleware.ts`) already handles this — just need the UI

**Estimated complexity:** Low

---

#### 2.5 School Admin — Students Page
**What it is:** The students admin page needs full CRUD (edit, delete, search).

**Why it matters:** A real school admin needs to manage their student roster.

**What files to check:** `src/app/school-admin/students/page.tsx` exists. Check if it has edit/delete/search functionality or is read-only.

**Estimated complexity:** Low-Medium (depends on current state)

---

### Phase 3: Public Booking & Email

#### 3.1 Stripe Billing Portal
**What it is:** Allow school owners to manage their subscription (upgrade, cancel, update payment method) via Stripe's hosted billing portal.

**Why it matters:** A real customer needs to be able to update their credit card, download invoices, and manage their subscription.

**What files to modify:**
- `src/app/api/schools/billing-portal/route.ts` — already creates a Stripe Billing Portal session, just needs the school's `stripe_customer_id` to be set
- `src/app/school-admin/billing/page.tsx` — "Manage Subscription" button that calls this route

**Prerequisite:** `stripe_customer_id` must be set on the school record (done during subscription checkout in Stripe webhook).

**Estimated complexity:** Low (UI button + stripe billing portal)

---

#### 3.2 Booking Notification Email — Auto-Send After Booking
**What it is:** When a student books a session (pre-payment), they should get an immediate email with booking details and payment link.

**Why it matters:** The student needs to know their booking was received and how to complete payment.

**What files to modify:**
- `src/app/api/bookings/route.ts` — after successful `book_seat` RPC, call `sendEmail` with a "booking received" template
- OR add a separate trigger that fires after booking creation

**Estimated complexity:** Medium

---

#### 3.3 48h + 4h Reminder Emails (Cron Setup)
**What it is:** The `/api/reminders` endpoint is built and ready. It needs a cron trigger (Vercel Cron Jobs or an external cron service) to hit it every hour.

**Why it matters:** Reminders are the #1 value proposition for schools. Without cron, they never fire.

**What files to modify:**
- Add `vercel.json` cron job config:
```json
{
  "crons": [
    {
      "path": "/api/reminders",
      "schedule": "0 * * * *"
    }
  ]
}
```
- Or set up with an external cron service (e.g., cron-job.org, EasyCron)

**Prerequisite:** RESEND_API_KEY must be configured (item 1.2)

**Estimated complexity:** Low

---

#### 3.4 Booking Cancellation Flow
**What it is:** Allow students to cancel their booking via the booking-link `/api/booking-links/[token]` (POST with `action: 'cancel'`).

**Why it matters:** The API supports it (see `booking-links/[token]/route.ts`) but the confirmation page and booking page don't have a "Cancel" button.

**What files to modify:**
- `src/app/book/confirmation/page.tsx` — add "Cancel Booking" button that calls `POST /api/booking-links/[token]` with `{ action: 'cancel' }`
- `src/app/book/cancel/[token]/page.tsx` — currently doesn't exist

**Estimated complexity:** Low-Medium

---

#### 3.5 Instructor Schedule Auth
**What it is:** The `/instructor/schedule` page loads availability by reading `instructor_id` and `school` from URL query params. Anyone with the URL can view and modify an instructor's availability.

**Why it matters:** This is a security vulnerability. A student who gets the invite URL could change the instructor's schedule.

**What files to modify:**
- `src/app/instructor/schedule/page.tsx` — require auth before loading
- Add middleware for `/instructor/*`
- The POST handler also needs auth validation

**Estimated complexity:** Medium

---

#### 3.6 Booking Page Polish — "Next Available" Fast Path
**What it is:** The booking page currently requires the student to pick session type, then a date/time. Add a "Next Available" button that shows the soonest available slot.

**Why it matters:** Reduces friction for students who just want to book the next lesson.

**What files to modify:**
- `src/app/book/page.tsx` — add "Next Available" CTA at the top

**Estimated complexity:** Low

---

#### 3.7 Email Template Personalization
**What it is:** Email templates should use the school's actual name, phone, and address throughout, not hardcoded "The Driving Center SaaS" in footers.

**Why it matters:** White-label experience. A school paying $99/mo wants their branding in student-facing emails.

**What files to modify:**
- `src/lib/email-templates/booking-confirmed.ts` — check for hardcoded footer text
- `src/lib/email-templates/reminder-48h.ts` — same
- `src/lib/email-templates/reminder-4h.ts` — same
- `src/lib/email-templates/welcome.ts` — already personalized

**Estimated complexity:** Low

---

## Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| Stripe webhook secret not configured | High | Must be configured before subscription checkout works. Webhook endpoint must be registered in Stripe dashboard for the production URL. |
| `book_seat` RPC function may not exist | High | Cycle 7 notes mention it was created for race-condition-safe booking. Verify it exists in the Supabase database. |
| `processed_stripe_events` table may not exist | Medium | Referenced in webhook for idempotency. If it doesn't exist, webhook will error on first event. |
| `session_id` FK column may not exist on `bookings` | Medium | Referenced in code but ACTUAL_SCHEMA.md says `session_id` on bookings is UUID FK → sessions. Verify it exists. |
| Instructor invite emails may get bounced | Medium | Resend's `onboarding@resend.dev` has sending limits. Use a verified domain. |
| Vercel Pro account required for cron jobs | Low | Vercery Cron Jobs require Pro plan ($20/mo). Alternative: use cron-job.org (free). |

---

## Environment Variables Required for Production

| Variable | Where Set | Status |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + `.env.local` | ✅ Should be set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + `.env.local` | ✅ Should be set |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel + `.env.local` | ✅ Should be set |
| `SUPABASE_JWT_SECRET` | Vercel + `.env.local` | ✅ Should be set |
| `STRIPE_SECRET_KEY` | Vercel + `.env.local` | ❌ May not be set |
| `STRIPE_STARTER_PRICE_ID` | Vercel + `.env.local` | ❌ May not be set |
| `STRIPE_WEBHOOK_SECRET` | Vercel + `.env.local` | ❌ May not be set |
| `RESEND_API_KEY` | Vercel + `.env.local` | ❌ May not be set |
| `NEXT_PUBLIC_APP_URL` | Vercel | ⚠️ Must be production URL |
| `DEMO_MODE` | Vercel (set to `false` for production) | ⚠️ Must be unset or `false` |

---

## Summary: What to Build vs. What to Configure

### Configuration Only (no code changes needed)
1. `STRIPE_SECRET_KEY` — set in Vercel
2. `STRIPE_STARTER_PRICE_ID` — create a $99/mo recurring price in Stripe, set in Vercel
3. `STRIPE_WEBHOOK_SECRET` — register webhook endpoint in Stripe dashboard, set in Vercel
4. `RESEND_API_KEY` — set in Vercel
5. `DEMO_MODE=false` — unset or set to false for production

### Code Changes Required
1. Send booking confirmation email on successful payment (webhook)
2. Add password-based login to login page
3. Instructor login flow (page + auth + middleware)
4. Instructor invite acceptance flow (accept invite → create account)
5. School-specific booking page (`/book/[slug]`)
6. Cancel "Forgot password?" link (remove or create page)
7. Billing page subscription management UI
8. Booking cancel button on confirmation page
9. Auth-required instructor schedule page
10. Vercel cron job config for reminders
11. Email template footer personalization
12. Booking notification email on booking creation
