# B.L.A.S.T. Phase 4 SPEC — Pre-Launch Without Credentials
**Date:** 2026-04-22
**Conductor:** Everest (Everest)
**Constraint:** No Supabase/Stripe credentials needed — everything here works locally and deploys without external services

---

## Context

We can't test the full booking/payment flow until Cayden fills `.env.local`. But we can build everything that doesn't require credentials:
- Pages that have static content
- API routes with no external dependencies
- Email HTML templates
- Legal pages
- SEO infrastructure
- Demo video script
- OpenClaw cron configuration

---

## Build Order

### PRE-1: Public Landing Page (`/`)
**File:** `src/app/page.tsx`

Goal: Convert a visitor who finds us via Google into a sign-up.

Sections:
1. **Hero** — "The software built for driving schools, by someone who knows the business" / Primary CTA: "Start Free Trial"
2. **Problem** — What schools deal with today (phone calls, cash, Google Forms, no-shows, spreadsheets)
3. **Product** — 5 feature cards (Booking, SMS Reminders, Student Tracking, Compliance, Online Payments)
4. **How It Works** — 3-step visual (Sign up → Import students → Take bookings)
5. **Pricing** — $99/mo Starter, $199/mo Growth, $399/mo Enterprise
6. **Social Proof** — "Built for real driving instructors in Tennessee"
7. **FAQ** — Top 5 questions
8. **CTA** — "Get started free" / "Book a demo"

Design: Dark theme, cyan accent (#06b6d4), clean professional SaaS look. No animations for now — just clean HTML.

---

### PRE-2: Demo Video Script
**File:** `DEMO_SCRIPT.md`

2-minute Loom script. When we get credentials, this gets filmed in one take.

```
HOOK (0:00-0:05)
"Running a driving school means answering 30 phone calls a day, chasing cash payments,
and hoping students actually show up. What if it didn't have to?"

PROBLEM (0:05-0:20)
Show: Screenshot of Matt's Google Form + phone + spreadsheet
"This is how most driving schools run today. Phone calls, Google Forms, cash in envelopes.
And the no-shows — they just kill your week."

SOLUTION (0:20-1:10)
Show: Our product
"Let me show you what we built. This is The Driving Center SaaS."

1. [0:20] School signs up, imports their existing student list in 30 seconds
2. [0:40] Sets their weekly schedule once — instructors' availability sorted
3. [0:55] Students book online — no more phone tag
4. [1:00] Automated reminders 48 hours and 4 hours before
5. [1:08] Student shows up or doesn't — deposit is already captured

DEMO (1:10-1:50)
Show: Booking flow end-to-end
"Here's what it looks like from the student's side..."

CLOSE (1:50-2:00)
"Your first month is $99. No setup fee. Cancel anytime.
Get started at thedrrivingcenter.com"
```

---

### PRE-3: Email HTML Templates
**Files:** `src/lib/email-templates/welcome.ts`, `booking-confirmed.ts`, `reminder-48h.ts`, `reminder-4h.ts`

Each template: Resend-compatible HTML email with:
- Mobile-responsive layout
- School branding slot (logo, name)
- One clear CTA button
- Plain text fallback

Email types:
1. **Welcome** — sent Day 0 when school completes profile
2. **Booking Confirmed** — sent to student immediately after booking
3. **48h Reminder** — structured reminder with confirm/reschedule link
4. **4h Reminder** — short final reminder
5. **Cancellation** — confirmation of cancellation + reschedule link

---

### PRE-4: Terms of Service + Privacy Policy
**Files:** `src/app/legal/terms/page.tsx`, `src/app/legal/privacy/page.tsx`

Required before we can legally charge money via Stripe. Write from scratch for this specific product:
- Services provided: scheduling software, student record management, compliance tracking
- Payment terms: $99/mo, annual option, cancellation at any time
- Data handled: student names, DOBs, permit numbers (encrypted), payment info (Stripe handles)
- Retention: 3 years per TCA § 40-35-102
- DMCA/liability disclaimers
- FERPA compliance note (student education records)

---

### PRE-5: SEO + Meta Infrastructure
**Files:**
- `src/app/sitemap.ts` — dynamic sitemap including `/school/[slug]` routes
- `src/app/robots.txt` — allow all, point to sitemap
- `src/app/api/sitemap.xml/route.ts` — server-generated sitemap
- Update `src/app/layout.tsx` — proper OG tags, canonical URLs, structured data

For each page:
- Title: `[Page Name] | The Driving Center SaaS`
- Description: 155-char meta description
- OG image: `/og-image.png` (placeholder for now)

---

### PRE-6: Instructor Schedule View
**File:** `src/app/instructor/schedule/page.tsx`

Simple page for instructors (not school owners) to see:
- Their upcoming booked sessions (next 2 weeks)
- Student names + lesson type + time
- Location
- No editing — read-only for instructors

This is a "day 1 win" for Matt — he can log in and see exactly what he has scheduled this week.

---

### PRE-7: OpenClaw Cron Setup
**Files:** OpenClaw cron configuration (no code file)

Register these cron jobs via OpenClaw cron skill:
```
Every 60 min: GET /api/reminders    → fires 48h/4h SMS reminders
Every day 9am:  GET /api/health    → school health check
Every Monday 9am: marketing report → update OPERATIONS_LOG
```

---

### PRE-8: Onboarding Wizard
**File:** `src/app/onboarding/page.tsx`

5-step setup flow for new schools:
1. **Welcome** — "Let's set up your school in 5 minutes"
2. **Profile** — School name, tagline, contact info, slug (public URL)
3. **Import** — CSV upload (drag and drop)
4. **Availability** — Set weekly hours per instructor
5. **First Session** — Create their first session right now
6. **Done** — "You're ready to take bookings. Here's your public link: `/school/[slug]`"

This is the Adobe Creative Cloud onboarding moment — get them set up in 5 minutes, they're invested.

---

## Success Criteria

1. Landing page communicates value clearly — visitor understands what we do and why it's worth $99/mo
2. Demo script is ready to film the moment credentials are ready
3. Email templates are code-complete and will work the second Resend key is added
4. Legal pages exist and are accurate for Tennessee law
5. SEO is set up correctly so Google can index us
6. Instructor can log in and see their schedule
7. New school can complete full onboarding without talking to us
8. OpenClaw cron is configured and running
9. Build passes with zero errors throughout

---

## What NOT to Build Here

- Any API route that requires Supabase credentials to test
- The full Stripe checkout flow (needs real keys)
- Multi-school dashboard (after Stripe works)
- PDF certificate generation (needs real DB)
- Mobile app

---

## File Map (Phase 4)

```
src/
  app/
    page.tsx                           ← PRE-1: Landing page
    legal/
      terms/page.tsx                   ← PRE-4: Terms of Service
      privacy/page.tsx                 ← PRE-4: Privacy Policy
    instructor/
      schedule/page.tsx                ← PRE-6: Instructor schedule view
    onboarding/page.tsx               ← PRE-8: Onboarding wizard
    sitemap.xml/route.ts              ← PRE-5: Sitemap generator
  app/
    robots.txt                        ← PRE-5: robots.txt
  src/lib/
    email-templates/
      welcome.ts                      ← PRE-3: Welcome email HTML
      booking-confirmed.ts             ← PRE-3: Booking confirmation email
      reminder-48h.ts                 ← PRE-3: 48h reminder email
      reminder-4h.ts                   ← PRE-3: 4h reminder email
  DEMO_SCRIPT.md                      ← PRE-2: Demo video script
```

---

## Execution

Build in order. Commit after each PRE-#. Run `npm run build` after each file — no exceptions.

```
PRE-1  → SPEC_PHASE_4.md written (DONE)
PRE-2  → DEMO_SCRIPT.md
PRE-3  → email-templates/
PRE-4  → legal pages
PRE-5  → SEO infrastructure
PRE-6  → instructor schedule
PRE-7  → OpenClaw cron setup
PRE-8  → onboarding wizard
```

Every file: B → L → A → S → T. No skipping.
