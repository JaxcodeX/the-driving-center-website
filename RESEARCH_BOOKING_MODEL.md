# Driving School Booking Model Research

*Research Date: April 22, 2026*
*Scope: The Driving Center (Matt Reedy, Oak Ridge TN) + comparable driving schools in TN/KY/GA*

---

## 1. How Matt's School (The Driving Center) Books Today

**Who:** Matt Reedy, The Driving Center — Oak Ridge, TN. Licensed by TN Dept. of Safety and Homeland Security. Also licensed as a Cooperative Driver Program. Fully insured and bonded.

**Services offered:**
- Driver Education (36-hour program: 30 hrs classroom + 6 hrs behind-the-wheel)
- Traffic School (4-hr and 8-hr court referral programs)
- Private Lessons (students ages 14+, price varies by pickup location)
- Driving Assessments for medical clearance ($200, 90 min, with physician follow-up form)

**Booking Methods (current state):**

| Channel | Tool | Details |
|---|---|---|
| Private Lessons | **Phone / Text** | Contact Matt directly at 865.719.1816. No online booking. |
| Traffic School | **Google Form** | Registration form hosted on Google Forms. Fields: name, email, address, license #, DOB, offense, referral source, date selection, acknowledgment checkbox. Payment collected in-person, cash only. |
| Driver Education | **In-person / Phone** | $125 non-refundable deposit required to register. Classroom schedule built per cohort; BTW scheduling done manually after class begins. |
| Assessments | **Phone** | By appointment only, via phone call. |

**What stands out about The Driving Center:**
- Booking is fragmented — each product has its own channel
- Traffic school registration is the most structured (Google Form + fixed date schedule)
- No online payment; cash only at arrival for traffic school
- No online scheduling for private lessons — phone/text is the only path
- No reminder system observed (no automated email/text reminders)
- No visible cancellation policy

---

## 2. Comparable Schools — How They Handle Booking

### Nashville Driving School (Nashville, TN)
**Website:** nashvilledrivingschool.com

**Booking model:**
- No public online booking visible. Calls or emails to inquire.
- After registration, students log into an account to schedule driving lessons online.
- Packages sold upfront (Starter $675 → Premium $1,590), which bundle classroom + BTW + road test.
- Road test included in packages (they test instead of DMV — notable differentiator).
- Flexible scheduling offered post-registration via online portal.

**No-show/cancellation policy:** Not explicitly stated on site.

**Payment:** Packages priced; unclear if deposit required. Payment likely collected at registration.

---

### Quick Driving School (Northern Virginia — comparable market)
**Website:** quickdrivingschool.com

**Booking model:**
- Phone-based inquiry and scheduling (no visible online booking tool)
- Pricing clearly posted: 1hr=$60, 1.5hr=$90, 2hr=$120, 5-day course=$500
- Behind-the-wheel course: $360 (5 sessions, 2 hrs/day)
- DMV Road Test Service: $150 extra
- Pickup/dropoff included in all prices

**No-show/cancellation:** Not explicitly stated on site.

**Payment:** Unknown upfront model; pricing is transparent.

---

### Smart Driving Academy (Washington DC / Maryland — reference market)
**Website:** smartdrivingacademy.com

**Booking model:**
- Online registration available via their site
- Online DEP courses run via Zoom on scheduled sessions (session-based, not continuous)
- Students register and pay online for course sessions
- $295 per DEP course session

**No-show/cancellation:** Not explicitly stated.

**Payment:** Online payment at registration.

---

### Certified Driving School (Oklahoma — reference market)
**Website:** certifieddrivingschool.com

**Booking model:**
- Phone/contact form for inquiries
- No visible online booking
- Emphasizes classroom quality as differentiator
- Contact-us form for communication

**Payment:** Unknown; no online payment visible.

---

### 123driving.com (Florida — online traffic school reference)
**Website:** 123driving.com

**Booking model:**
- 100% online — course is self-paced, start immediately
- Certificate delivery options (instant upgrade for additional fee)
- Course options: 4hr BDI ($50 range), DETS permit course, DATA course
- Completely online, no instructor scheduling needed

**No-show model:** N/A for online self-paced courses.

**Payment:** Online payment at checkout.

---

## 3. Industry Standard Booking Flow (Driving Schools, Small Operations)

Based on the schools reviewed, the industry standard flow for small-to-mid sized driving schools looks like this:

```
Inquiry → [Phone/Form] → Registration/Deposit → Cohort/Session Assignment
                                                              ↓
                                       Student Self-Schedules (post-class) via online portal
                                            OR
                                       Admin builds schedule manually and communicates via phone/text
```

**Typical patterns:**

1. **Fixed-date cohort model** (traffic school, driver ed classroom): Student selects from available session dates via a form or first-come-first-served list. No real-time availability shown.

2. **Phone-first model** (private lessons): Student calls/texts instructor → instructor checks their own calendar → books slot → confirms via phone/text. No self-service.

3. **Package-lock model** (driver ed programs): Student buys a package upfront → gets login or is added to a scheduling system → picks lesson times from available slots.

4. **Hybrid**: Schools that have grown use a scheduling tool (Calendly, Acuity, Squarespace Appointments) or a dedicated app. Most small operations don't have this.

**Key insight:** Most small driving schools operate on phone/text + spreadsheets or paper. Scheduling is manual and instructor-owned.

---

## 4. How Schools Currently Handle No-Shows

**Industry patterns observed:**

### Deposits / Pre-payment
- **The Driving Center (Matt):** $125 non-refundable deposit for driver education classroom registration. This is the primary no-show protection.
- **Nashville Driving School:** Package-based; students pay upfront for multi-session programs.
- Most small schools use deposits to deter no-shows on multi-session commitments.

### Reminders
- **The Driving Center:** Email confirmation sent "the day before class" for traffic school (per Google Form copy). No other reminders observed.
- **Most other small schools:** No visible automated reminder system. Rely on the student to remember.

### Cancellation Policies
- **The Driving Center:** "Non-refundable deposit" language on driver ed registration — signals strict policy on no-shows for paid registration.
- **Other schools reviewed:** No visible cancellation policy stated on their public-facing websites. Very few small schools communicate cancellation terms proactively.

### What most schools do NOT have:
- Automated SMS/email reminders (24hr, same-day)
- Online self-serve cancellation/rescheduling
- No-show fees beyond deposit forfeiture
- Clear late-cancellation windows
- Waitlist management

**The core problem:** No-shows are handled reactively (deposit loss) rather than preventatively (reminders, easy rescheduling). There's no system in place to help students reschedule before they become no-shows.

---

## 5. Minimum Viable Booking Flow for a SaaS Targeting Driving Schools

A SaaS product targeting small driving schools needs to be simple enough for a solo instructor running on a phone and a notebook, while solving the core pain points:

### The MVP Flow

```
STUDENT PATH
──────────────────────────────────────────────────────────────
1. Discover → Land on school website or see a booking link
2. Select Service → Choose lesson type (private, traffic school, assessment, package)
3. Pick Date/Time → See available slots, select one (self-service)
4. Enter Info → Name, phone, email, notes (license # if relevant)
5. Confirm → Gets SMS/email confirmation instantly
6. Reminder → Auto-reminder 24hr before (SMS or email)
7. Reschedule → Can reschedule online up to X hours before (configurable)
──────────────────────────────────────────────────────────────

ADMIN PATH
──────────────────────────────────────────────────────────────
1. Dashboard → See all bookings, cancel, reschedule, manually add
2. Calendar view → Instructor availability at a glance
3. No-show标记 → Mark student no-show with one click
4. Deposit tracking → Flag whether deposit was collected
5. Notification → Admin notified when student books/cancels
──────────────────────────────────────────────────────────────
```

### MVP Feature Set (Priority Order)

| Priority | Feature | Why |
|---|---|---|
| P1 | **Service/Program selector** | Every school has multiple offerings (private, traffic school, driver ed, assessment) |
| P1 | **Simple calendar with available slots** | Replaces phone/text scheduling |
| P1 | **Student info capture** | Name, phone, email, permit status, notes |
| P1 | **Email/SMS confirmation** | Instant reassurance for the student |
| P1 | **Admin dashboard** | Simple list view of day's bookings |
| P2 | **Automated reminder (24hr)** | No-show prevention — biggest bang for buck |
| P2 | **Reschedule link in confirmation** | Reduces no-shows by making it easy to reschedule |
| P2 | **Deposit tracking** | Flag if deposit was collected; unpaid = not confirmed |
| P3 | **Waitlist** | When a slot fills, student can join waitlist for that slot |
| P3 | **Multi-instructor support** | When school has >1 instructor |
| P3 | **Reporting** | No-show rate, booking volume, revenue |

### Payment Integration (MVP vs Full)
- **MVP:** Cash/check on arrival — manual, no integration needed
- **Post-MVP:** Stripe/Zelle capture at booking with refundable hold (deposit model)

### The simplest possible implementation:
A single instructor can run this with:
1. A landing page with their services and calendar
2. A link they text to students to self-book
3. Email confirmations and reminders (automated)
4. A phone-responsive dashboard

The biggest value prop to sell: **Stop texting students to book. Let them book online, send reminders, reduce no-shows.**

### No-show prevention hierarchy:
1. Easy rescheduling → student corrects before they miss
2. Automated reminder → student remembers
3. Deposit tracking → admin can see who hasn't paid (incentive to show)
4. Waitlist → slot always filled

---

## Summary of Key Findings

| Finding | Detail |
|---|---|
| **Matt's school booking** | Phone/text for private, Google Form for traffic school, cash on arrival, no online scheduling |
| **Industry booking norm** | Phone-first or Google Form; fragmented by service type; no unified calendar |
| **Industry no-show handling** | Deposit-based (non-refundable), minimal automated reminders |
| **Biggest gap** | No self-serve scheduling, no automated reminders, no easy rescheduling — all handled manually by instructor |
| **MVP opportunity** | Replace phone/text scheduling with a self-serve booking page + automated reminders |
| **Key differentiator to sell** | "You handle everything manually. Your students still miss appointments. Here's a 15-minute setup that fixes it." |