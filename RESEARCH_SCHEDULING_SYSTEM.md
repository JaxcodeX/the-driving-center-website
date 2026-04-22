# Booking & Scheduling System — Research
**For:** The Driving Center SaaS
**Date:** 2026-04-22
**Sources:** Calendly, Acuity Scheduling, Square Appointments, Vagaro — product analysis + best practices

---

## 1. Core Booking Entities

### What "Session" Looks Like in Data Model

A **Session** is the core booking unit — a time block taught by one instructor, at one location, for one session type. It maps to what Calendly calls an "Event Type" and Acuity calls an "Appointment Type."

```
Session {
  id                    UUID
  school_id             UUID        — tenant isolation
  session_type_id       UUID        — links to session type definition
  instructor_id         UUID
  location_id           UUID

  start_at              timestamptz — canonical UTC datetime
  end_at                timestamptz

  max_seats             int         — 1 for private lessons, N for group
  seats_booked          int         — denormalized count for fast availability checks
  seats_remaining       int         — computed: max_seats - seats_booked

  price_cents           int
  deposit_cents         int?        — zero if no deposit required
  price_label           string?     — "$60 / student" for display

  status                enum (scheduled | cancelled | completed | no_show)

  created_at            timestamptz
  updated_at            timestamptz
}
```

> **Key insight from Calendly:** Sessions are stored as exact UTC datetimes, never dates + times separately. This eliminates timezone conversion bugs entirely. The SPEC.md uses `start_date` + `start_time` as separate fields — move to `start_at` UTC timestamps before Phase 2 ships.

---

### What "Slot" Looks Like in Data Model

A **Slot** is a candidate booking time exposed to students. It's not a separate row — it's a **view/query result** over the Session table.

```
Slot (computed view) {
  session_id            UUID
  instructor_name       string
  session_type_label    string
  start_at              timestamptz
  end_at                timestamptz
  duration_minutes      int
  seats_remaining       int
  price_cents           int
  location_label        string
}
```

> **How Calendly does it:** Slots are derived on the fly from availability rules — never pre-generated. Generating all slots for the next 90 days upfront creates stale data. Instead: a school sets "Instructor Jane works Mon/Wed 9am–5pm" and slots are computed as the intersection of instructor availability × session type duration × existing bookings.

> **How Acuity does it:** Slots are pre-generated nightly per appointment type. Students see real availability, not computed availability. For driving schools with small instructor counts, pre-generation is acceptable and simpler to reason about.

**Recommendation for The Driving Center:** Pre-generate slots 14 days out, refresh nightly. For a school with 3 instructors and 6 session types, that's ~1,000–2,000 slot rows — trivial to compute and easy to query. Flag slots as `booked` or `available` in real time.

---

### What "Instructor" Looks Like in Data Model

```
Instructor {
  id                    UUID
  school_id             UUID

  name                  string
  email                 string
  phone                 string

  bio                   text?
  photo_url             string?     — instructor headshot for booking page

  license_number        string
  license_expiry        date        — alert owner 30 days before expiry

  active                boolean     — soft delete
  display_order         int         — which order on booking page (1 = primary)

  created_at            timestamptz
  updated_at            timestamptz
}
```

> **Vagaro insight:** Instructors have a `display_order` and students see them ranked. First instructor listed gets most bookings. Let school owners control this.

---

### What "Student" Looks Like in Data Model

```
Student {
  id                    UUID
  school_id             UUID

  legal_name            string      — AES-encrypted at rest
  legal_name_hash       string      — for lookups without decryption

  email                 string
  phone                 string

  dob                   date
  permit_number         string?     — AES-encrypted (many states: PDPS integration later)

  parent_name           string?
  parent_email          string?
  parent_phone          string?

  emergency_contact_name   string?
  emergency_contact_phone string?

  total_lessons         int         — count of booked sessions
  total_hours           decimal     — sum of session durations
  tca_cert_issued       boolean
  tca_cert_date         date?

  reminder_72h_sent     boolean
  reminder_24h_sent     boolean

  created_at            timestamptz
  updated_at            timestamptz
}
```

> **Key from Square Appointments:** Students don't need an account to book. They enter name, email, phone per booking. A student record is created on first booking and linked to subsequent bookings by (name + email) or (phone). No password, no login for students.

---

### Supporting Entities

```
SessionType {
  id                    UUID
  school_id             UUID

  label                 string      — "60-Minute Private Lesson"
  description           string?
  duration_minutes      int
  price_cents           int
  deposit_cents         int         — 0 if no deposit
  color                 string      — hex color for calendar display

  active                boolean
}

Location {
  id                    UUID
  school_id             UUID

  label                 string      — "Oak Ridge — Main Office"
  address               string
  notes                 string?     — "corner of RT-9 and Willow"
}

Booking {
  id                    UUID
  session_id            UUID
  student_id            UUID

  status                enum (pending | confirmed | cancelled | completed | no_show)
  payment_status        enum (pending | paid | refunded | no_charge)

  booked_at             timestamptz
  cancelled_at          timestamptz?
  cancellation_reason    string?

  stripe_payment_intent string?
}

InstructorAvailability {
  id                    UUID
  instructor_id         UUID

  day_of_week           int         — 0=Sun, 1=Mon, ... 6=Sat
  start_time            time        — "09:00"
  end_time              time        — "17:00"

  effective_from        date
  effective_until        date?
}
```

---

## 2. Booking Flow

### The Student Booking Flow (step-by-step)

This is modeled after Acuity's consumer flow — cleanest in the industry.

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Landing                                              │
│ Student visits /book?school_id=XXX or school's booking link  │
│ Sees: school name, logo, session type selector               │
│                                                                 │
│ [Session Type dropdown]                                       │
│   "60-Min Private Lesson — $60"                               │
│   "90-Min Lesson — $80"                                       │
│   "Traffic School (8hr) — $150"                               │
│   "Driving Assessment — $90"                                 │
│                                                                 │
│ [Date picker — calendar widget]                               │
│   Shows next 30 days with availability                       │
│   Unavailable dates greyed out                                │
│                                                                 │
│ [Continue →]                                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Time Slot Picker                                      │
│ Shows available time slots for selected date + type          │
│ Grouped by instructor (if multiple instructors available)     │
│                                                                 │
│ [Morning]     [Afternoon]                                    │
│  9:00 AM      1:00 PM                                        │
│  9:30 AM ✓    1:30 PM ✓                                      │
│  10:00 AM     2:00 PM                                        │
│                                                                 │
│ [Instructor: Any] ▼                                          │
│                                                                 │
│ [Continue →]                                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Student Details                                       │
│ Name, Email, Phone (required)                                │
│ DOB, Permit Number (optional but prompted)                   │
│ Parent info (shown if student DOB < 18)                      │
│                                                                 │
│ [Back]  [Continue to Payment →]                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Payment / Deposit                                    │
│ If deposit required: Stripe Checkout or embedded card form   │
│ If no deposit: "Confirm Booking" button                     │
│                                                                 │
│ Shows: session summary, date/time, location, price          │
│ Cancellation policy displayed                               │
│                                                                 │
│ [Complete Booking — Pay $20 Deposit]                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Confirmation                                         │
│ Immediate on-screen confirmation                             │
│ Email sent: confirmation + calendar invite (.ics)           │
│ SMS sent if phone provided                                   │
│                                                                 │
│ "Your lesson is booked for [date] at [time]"               │
│ [Add to Google Calendar] [Download .ics]                    │
│ SMS reminder will be sent 72h and 24h before                 │
└─────────────────────────────────────────────────────────────┘
```

### The Cancellation / Reschedule Flow

> **How Vagaro handles it:** Students get a link in their confirmation email — `book.confirmed.io/reschedule/{booking_id}` or `book.confirmed.io/cancel/{booking_id}`. No login required. Token-based magic link validates the booking and lets student reschedule (if >24h out) or cancel (if >48h out for refund eligibility).

**Cancellation policy enforcement:**
```
IF cancellation > 48h before session:
  → Full deposit refund
ELSE IF cancellation 24–48h before:
  → 50% refund (or forfeit deposit — configurable)
ELSE:
  → No refund (displayed clearly before booking)
```

---

## 3. Instructor Availability

### How Calendly Handles Availability

Calendly has a simple but powerful model:
1. Each event type has "Availability" settings
2. Owner sets **availability windows** (e.g., Mon–Fri 9am–5pm)
3. Available slots are computed as: `availability_windows ∩ event_type_duration`
4. Booked slots are subtracted in real time

**For The Driving Center, the Calendly model maps well** but needs driving-school-specific additions:

```
InstructorAvailability {
  instructor_id
  day_of_week        — 0–6
  start_time         — "09:00"
  end_time          — "17:00"
  location_id        — which location (instructor may cover multiple)
}

InstructorTimeOff {
  id
  instructor_id
  date               — specific date
  all_day            — boolean
  start_time         — if not all_day
  end_time           — if not all_day
  reason             — "Personal", "Sick", "Holiday"
}
```

### Key Availability Rules for Driving Schools

**Drive time buffers:** A session ending at Location A and a session starting at Location B needs buffer time. Calendly has no concept of this. **Recommendation:** Store `travel_minutes` on each Location pair and enforce a `buffer_minutes` between sessions for the same instructor.

**Break blocking:** Instructor is unavailable from 12:00–13:00 every day. Model as a recurring `InstructorAvailability` exception, or add a `breaks` table.

**Multi-location coverage:** Instructor Jane covers "Oak Ridge" on Mon/Wed and "Downtown" on Tue/Thu. Each availability row has a `location_id`. Sessions are only generated for the matching location.

---

## 4. Session Types

### The Driving Center's Session Type Taxonomy

Based on the SPEC.md data model and TCA compliance requirements:

```
SessionType {
  id
  school_id

  label              — "60-Min Private Lesson"
  slug               — "60-min-private"  (URL-safe)

  description
  duration_minutes   — 60
  price_cents        — 6000

  requires_permit    — boolean  (traffic school ≠ permit needed)
  min_age            — int
  max_students        — int     (1 = private, N = group)

  tca_eligible       — boolean (counts toward TCA certificate)
  tca_hours_credit   — decimal (e.g., 6.0 for 6hr traffic school)

  color               — "#4F46E5" (calendar display)
  active
}
```

### Recommended Session Types for The Driving Center

| Label | Duration | Price Range | Deposit | TCA Credit | Notes |
|---|---|---|---|---|---|
| **New Student Orientation** | 30 min | $0–$25 | $0 | No | Meet & greet; no driving |
| **60-Minute Private Lesson** | 60 min | $50–$75 | $20 | Yes (1hr) | Core product |
| **90-Minute Private Lesson** | 90 min | $70–$100 | $25 | Yes (1.5hr) | Most popular |
| **2-Hour Extended Lesson** | 120 min | $90–$130 | $30 | Yes (2hr) | Recurring students |
| **Traffic School (6hr)** | 6 hr | $125–$175 | $50 | Yes (6hr) | One-day or split |
| **Traffic School (8hr)** | 8 hr | $150–$200 | $50 | Yes (8hr) | State minimum |
| **Driving Assessment** | 60 min | $60–$90 | $20 | No | Pre-license evaluation |
| **Road Test Prep** | 90 min | $75–$100 | $25 | Yes (1.5hr) | Pre-road test |
| **Vehicle Rental (with instructor)** | 60 min | $40–$60 | $0 | No | Instructor observes |
| **Behind-the-Wheel Assessment** | 90 min | $80–$110 | $25 | Yes (1.5hr) | For licensing |

> **Acuity insight:** The most successful scheduling products let schools offer **packages** (e.g., "5-Lesson Package — buy 4, get 1 free"). Package bookings reduce no-shows (students have sunk cost) and increase lifetime value. Phase 3 consideration.

---

## 5. Calendar Views

### Student / Public Booking Calendar

**What students see:** A weekly or daily grid, filtered by session type. Instructors shown as labels. Slots shown in 15 or 30-minute increments depending on session type duration.

**Design principles (from Acuity):**
- Show **one day at a time** on mobile (Calendly default — weekly on desktop)
- Grey out fully booked slots, show them as "Full" not hidden
- Show **instructor photo + name** next to each slot
- Show **price clearly** on each slot
- Location shown on slot + again on confirmation page
- No timezone confusion — show times in school's local timezone, labelled

**Mobile behavior:**
- Full-screen date picker → slot picker → details form
- Large touch targets, no pinch/zoom needed
- "Book in 30 seconds" — Acuity data shows 3-step max converts, >3 steps drops off

### School Admin Calendar

**What admins see (admin.caldy.io or school dashboard):**

```
┌─────────────────────────────────────────────────────────────┐
│ ADMIN: Week View (default) — Instructor: [All ▼]            │
│                                                              │
│         Mon 4/21    Tue 4/22    Wed 4/23    Thu 4/24        │
│ ─────────────────────────────────────────────────────────── │
│  9:00   [S1:Jane]   [S2:Bob]   [S1:Jane]   [OFF]           │
│  9:30   [S1:Jane]   [S2:Bob]   [S1:Jane]   [OFF]           │
│  10:00  [───────]   [───────]  [───────]   [───────]        │
│  10:30  [OPEN]      [OPEN]     [OPEN]      [OPEN]          │
│  ...                                                         │
│ ─────────────────────────────────────────────────────────── │
│ Legend: [booked]  [OPEN: 2 seats]  [BLOCKED: instructor]    │
└─────────────────────────────────────────────────────────────┘
```

**Key features from Square Appointments admin view:**
- **Drag-to-create:** Click and drag on calendar to create a session directly
- **Drag-to-reschedule:** Drag a booking to a new time/instructor
- **Click-to-edit:** Click any session to see student list, edit details, mark no-show
- **Utilization bar:** Weekly fill rate % shown per instructor — at-a-glance health metric
- **Conflict warnings:** Double-booking attempted → red warning, not allowed
- **Color coding:** By session type (color from SessionType.color field)

**Instructor Calendar (separate view):**
- Simplified view: "My Schedule for Today / This Week"
- One instructor at a time
- Quick add: "Block this time off"
- Mobile-optimized — instructors check from phone between lessons

### Calendar View Comparison

| Feature | Student/Public | School Admin | Instructor |
|---|---|---|---|
| Date range | 14 days forward | 30 days | 7 days |
| Time increment | Session-type-granular (30min default) | 30min grid | 30min grid |
| Instructors shown | Per-slot label | All / filtered | Self only |
| Session type filter | Dropdown | Checkboxes | All |
| Create session | No | Yes | No |
| Edit session | No | Yes | No |
| Mark no-show | No | Yes | Yes |
| Location shown | Yes | Yes | Yes |
| Utilization metrics | No | Yes | No |

---

## 6. API Design

### Core Booking Endpoints

```
# Availability
GET  /api/schools/{school_id}/availability
     Query: date_from, date_to, session_type_id?
     → Returns available slots grouped by date

GET  /api/schools/{school_id}/slots
     Query: date, session_type_id, instructor_id?
     → Returns time slots for a specific date

# Session Types
GET  /api/schools/{school_id}/session-types
     → Returns active session types with prices

# Bookings
POST /api/bookings
     Body: {
       session_id,
       student_name,
       student_email,
       student_phone,
       student_dob?,
       permit_number?,
       stripe_payment_token?
     }
     → Creates booking, returns { booking_id, status, requires_payment }

POST /api/bookings/{booking_id}/confirm-payment
     Body: { stripe_payment_intent_id }
     → Confirms payment, returns { booking_id, status: "confirmed" }

POST /api/bookings/{booking_id}/cancel
     Body: { reason? }
     → Cancels booking, applies refund logic

GET  /api/bookings/{booking_id}
     → Returns booking details + session info (token or auth required)

# Booking reschedule link (token-based, no auth)
GET  /api/public/booking/{token}/details
POST /api/public/booking/{token}/reschedule
     Body: { new_session_id }
POST /api/public/booking/{token}/cancel

# Sessions (admin)
GET    /api/schools/{school_id}/sessions
       Query: date_from, date_to, instructor_id?, status?
       → List sessions with booking counts

POST   /api/sessions
       Body: { session_type_id, instructor_id, location_id,
               start_at, end_at, max_seats, price_cents }
       → Create session

PUT    /api/sessions/{session_id}
       Body: { ...fields to update }
       → Update session

DELETE /api/sessions/{session_id}
       → Soft-delete (status = "cancelled"), preserve audit trail

# Instructors (admin)
GET    /api/schools/{school_id}/instructors
POST   /api/instructors
PUT    /api/instructors/{instructor_id}
DELETE /api/instructors/{instructor_id}

# Availability (admin)
GET    /api/instructors/{instructor_id}/availability
POST   /api/instructors/{instructor_id}/availability
PUT    /api/instructors/{instructor_id}/availability/{availability_id}
DELETE /api/instructors/{instructor_id}/availability/{availability_id}

POST   /api/instructors/{instructor_id}/time-off
       Body: { date, all_day, start_time?, end_time?, reason? }

# Students (admin)
GET    /api/schools/{school_id}/students
POST   /api/students
PUT    /api/students/{student_id}
GET    /api/students/{student_id}/history
       → Returns all bookings for this student

# School (owner)
GET    /api/schools/{school_id}/dashboard
       → Returns { students_count, sessions_this_month,
                   revenue_this_month, upcoming_sessions[] }

GET    /api/schools/{school_id}/utilization?date_from=&date_to=
       → Returns utilization % per instructor per week
```

### Payment Endpoints (Stripe)

```
POST /api/payments/create-intent
     Body: { booking_id, amount_cents }
     → Creates Stripe PaymentIntent, returns { client_secret }

POST /api/payments/webhook
     → Stripe webhook handler: payment_succeeded, payment_failed
```

---

## 7. Specific Recommendations for The Driving Center

### Recommendation 1: Store Sessions as UTC Timestamps, Not Date + Time

The current SPEC.md uses `start_date` + `start_time` separate fields. **This is the #1 data model problem.** Time zones are a notoriously expensive bug class. Move to `start_at timestamptz` and `end_at timestamptz` before Phase 2 ships.

### Recommendation 2: Build Slot Pre-generation, Not Real-time Computation

Calendly computes availability on the fly. For a small driving school (3 instructors, 6 session types), this is fine — but real-time computation creates race conditions when two students book simultaneously. **Pre-generate slots 14 days out** nightly. Mark slots `booked` atomically at booking time (use `UPDATE sessions SET seats_booked = seats_booked + 1 WHERE id = X AND seats_booked < max_seats RETURNING *` with a DB-level lock or row-level conflict check).

### Recommendation 3: Require Deposits, Not Full Payment (Acuity's Model)

Acuity data shows that requiring full payment upfront drops conversion by ~20%. Requiring a small deposit ($20) retains conversion and dramatically reduces no-shows. **Recommendation:** All session types require a $20 deposit minimum; the balance is collected in person or via a follow-up invoice. Deposit is forfeit on no-show / <24h cancellation.

### Recommendation 4: Instructor Availability Windows First, Then Calendar

Build `InstructorAvailability` first — this is the foundation everything else depends on. Without it, slot generation is broken by design. Vagaro and Square both let instructors set availability by day-of-week before any sessions can be booked.

### Recommendation 5: Magic Link Reschedule/Cancel (No Student Login)

Following Vagaro's pattern: confirmation email includes two links:
- `book.confirmed.io/r/{booking_token}` — reschedule
- `book.confirmed.io/c/{booking_token}` — cancel

No login required. Token is a signed JWT with `booking_id` + `expires_at` (7 days). One-time use. This eliminates the "I can't log in to cancel" friction point that drives no-shows.

### Recommendation 6: Add a Utilization Dashboard Metric

Square Appointments' most-viewed screen is the weekly utilization summary: "Instructor Jane: booked 71% of available hours this week." School owners want to know: am I scheduling my instructors efficiently? Add this as a summary card on the school dashboard.

### Recommendation 7: SMS Confirmation + Reminder in One Flow

Acuity and Vagaro both confirm via email + SMS. Calendly's SMS confirmations are a paid add-on. **The Driving Center should include SMS as standard** — it's the highest-leverage no-show tool. The SPEC.md already has this right (72h + 24h reminders). Make it work in Phase 2, not Phase 3.

### Recommendation 8: TCA Certificate Tracking as a Differentiator

None of the competitors (Calendly, Square, Vagaro) track course completion certificates. TCA 1340-03-07 requires schools to maintain 3-year records. **Make certificate tracking a first-class feature:** track `tca_hours_credit` per session type, sum it per student, flag when a student reaches 6hr / 8hr / 30hr thresholds for road test eligibility. This is compliance-as-a-feature.

### Recommendation 9: Calendar Conflict Prevention

Driving schools have a unique scheduling constraint no generic calendar handles: **travel time between locations.** If Jane finishes a session in Oak Ridge at 10:30am and her next session starts in Downtown at 10:30am (25 min drive), both show as available in a generic calendar. **Solution:** Store `LocationPair` with travel_minutes. At session creation time, validate: no session for same instructor within (previous_end + travel_minutes) of next session start. Block overlapping availability.

### Recommendation 10: Package / Multi-Session Bookings (Phase 3)

Acuity's "multiple event type packages" is the highest-margin feature in driving school SaaS. A "5-Lesson Package" creates a recurring revenue relationship and reduces no-shows via sunk cost. Plan the data model (Package, PackagePurchase, PackageSession) in Phase 2 even if UI ships in Phase 3.

---

## Entity Relationship Summary

```
School
  ├── Instructor (1:N)
  │     ├── InstructorAvailability (1:N)
  │     └── InstructorTimeOff (1:N)
  ├── SessionType (1:N)
  ├── Location (1:N)
  └── Session (1:N)
        └── Booking (1:N)
              └── Student (N:1 — can exist without booking via manual add)

Student (standalone for manually-added students)
  └── Booking (1:N)
        └── Session (N:1)
```

---

## Data Model Changes Needed to SPEC.md

| Change | Reason |
|---|---|
| Add `start_at` + `end_at` (timestamptz) to Session | Eliminate timezone bugs; replace `start_date`/`start_time` |
| Add `session_type_id` to Session | Links to SessionType for label, duration, TCA credit |
| Add `location_id` to Session | Enables multi-location support |
| Add `status` enum to Session | "scheduled \| cancelled \| completed \| no_show" |
| Add `slug` to SessionType | URL-safe session type identifier |
| Add `tca_hours_credit` to SessionType | TCA compliance tracking |
| Add `max_students` to SessionType | Group vs. private lesson differentiation |
| Add `requires_permit` to SessionType | Traffic school vs. lesson differentiation |
| Add `Booking` table | Separates booking from student record |
| Add `InstructorAvailability` table | Availability windows per instructor |
| Add `InstructorTimeOff` table | One-off unavailable dates |
| Add `Location` table | Multi-location support |
| Rename `students_driver_ed` → `Student` | Cleaner name; the "_driver_ed" suffix is a legacy artifact |
