# SPEC: Demo Polish — Mark Martin Meeting

## Goal
A functional, credible demo that shows The Driving Center's core value proposition — admin time saved, no-shows handled, payments automated — without embarrassing bugs or fake social proof.

**Audience:** Mark Martin (technical mentor + potential collaborator)
**Standard:** Must feel like a real product, not a student project.

---

## Priority 1: Remove Fake Social Proof

### Landing Page
- [ ] **Stats bar**: Remove "50+ schools, $2M+ processed, 99.9% uptime" — replace with honest numbers or remove the section entirely
- [ ] **Testimonials**: Remove all 4 fake testimonials. Replace with:
  - Either a single honest testimonial from Matt Reedy (if real)
  - Or no testimonials until real ones exist
- [ ] **Logo strip**: "Trusted by" school names (Smokey Mountain Drivers, etc.) — verify these are real or remove

### Impact
Mark will googling things. If "Smokey Mountain Drivers" returns nothing, credibility collapses.

---

## Priority 2: Landing Page Copy Overhaul

### Core Messaging (B2B — driving school owners)
**Current:** "The simplest way to run your school" — generic

**New angle:** Attack the owner's actual pain:
- *"Stop chasing students for payment the day before the lesson"*
- *"Stop texting reminders by hand — your AI assistant handles it"*
- *"No-shows used to eat your schedule. Not anymore."*

### Specific Fixes
- [ ] Headline: Either pick a specific pain point and hit it hard, or use a proof-first headline like *"Driving schools that use us spend 90% less time on admin"*
- [ ] Stats bar: Either real numbers or cut
- [ ] "How it works" steps: Reframe around owner's objections, not feature descriptions
  - Step 1: "Students book and pay online" (not "Choose a service")
  - Step 2: "Your schedule fills automatically" (not "Pick a time")
  - Step 3: "AI reminders cut no-shows" (not "Get confirmed")
- [ ] Pricing section: Needs realistic pricing or remove. "Contact for pricing" is fine for demo.

---

## Priority 3: Booking Flow Polish

### Functionality Check (verify before demo)
- [ ] `/book?school=TEST` — does the full flow work end-to-end with Stripe?
- [ ] Confirmation email fires via Resend
- [ ] Reminder emails (48h + 4h) actually trigger via n8n/cron
- [ ] Booking confirmation page shows real booking ID

### UX Polish
- [ ] "No school selected" state — make it cleaner, add school search
- [ ] Loading states — skeleton loaders instead of spinners where already implemented
- [ ] Error handling — if Supabase is down or slots fail to load, show clean error not blank page
- [ ] Mobile — calendar strip and time slot grid need to be responsive

---

## Priority 4: Admin Dashboard Polish

### For Mark's Demo
Mark will want to see the admin side. Key things to verify:
- [ ] Dashboard loads with demo mode (PIN 0000) — confirm this works
- [ ] KPI cards show real-looking data in demo mode
- [ ] "Upcoming Sessions" loads without crashing
- [ ] Quick Actions links work

### If there's time:
- [ ] Clean up "Recent Activity" — it's all fake names (Marcus Rivera, Sarah Chen). Either remove or pull from real recent bookings

---

## Priority 5: Demo Walkthrough Script

Before the Mark Martin meeting, know this cold:

1. **Open to landing page** — "This is what school owners see"
2. **Click "Start free trial" → signup** — show how fast onboarding is
3. **Go to `/school-admin`** — "This is the dashboard. This is where owners live."
4. **Click "Schedule Session"** — show how a session is created
5. **Open incognito, go to `/book?school=YOUR_DEMO_SCHOOL`** — show student booking flow
6. **Book a real session** — execute the full Stripe checkout
7. **Show confirmation + email** — prove the loop closes

**Key demo moment:** The owner books a lesson → pays deposit → gets confirmation email → owner sees it in dashboard. That loop is the product.

---

## Priority 6: Technical Smoke Test

Before demo day:
- [ ] `npm run build` passes
- [ ] Vercel deployment succeeds
- [ ] Test booking flow on live URL (not localhost)
- [ ] Verify Stripe webhook fires on successful payment
- [ ] Verify Resend emails send (check Sent messages in Resend dashboard)

---

## Out of Scope (Next Phase)
- Additional pages (FAQ, full marketing site)
- n8n workflow automation
- Instructor portal
- Parent/student portal
- SMS reminders

---

## Definition of Done
- [ ] Mark can click through the full booking → confirmation loop himself
- [ ] Admin dashboard loads without errors in demo mode
- [ ] Landing page has zero easily disproven claims
- [ ] One clean demo script Mark can follow
