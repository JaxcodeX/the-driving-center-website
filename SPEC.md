# B.L.A.S.T. Protocol — Phase 2 SPEC
## The Driving Center SaaS — Booking + School Admin

**Date:** 2026-04-22
**Conductor:** OpenClaw
**Coder:** Codex + Kimi K2.6 (via `ollama launch codex --model kimi-k2.6:cloud`)
**Target:** Schools can book lessons, owners can manage their data, SMS reminders fire

---

## Context

Phase 1 MVP is built and passing. Schools can sign up, pay, and log in to a dashboard.
Phase 2 makes it a real product: booking calendar + school admin panel + SMS reminders.

Key research:
- `RESEARCH_TRACK_A_PRODUCT_GAP.md` — booking calendar is the #1 missing feature
- `RESEARCH_TRACK_A_LEADS.md` — outreach templates ready
- No-shows cost schools $200-500/mo in lost revenue — this is why they'll pay

---

## What to Build (Priority Order)

### PRIORITY 1 — Native Booking Calendar
**File:** `src/app/book/page.tsx` (student-facing booking)
**File:** `src/app/api/sessions/route.ts` (session management API)
**File:** `src/app/book/confirmation/page.tsx`

**User flow (student books a lesson):**
1. Student visits `/book?school_id=XXX` (school_id from school owner's shared link)
2. Sees available sessions (fetched from `sessions` table, filtered by school)
3. Selects a session → fills name + email + phone (no account needed to browse)
4. Submits → Stripe checkout for the lesson fee OR free booking if school sets it free
5. On completion → row created in `students_driver_ed` + confirmation page shown
6. Student receives SMS reminder 72h before + 24h before (via Twilio agent later)

**Session object:**
```ts
type Session = {
  id: UUID
  school_id: UUID
  start_date: string      // ISO date '2026-05-01'
  start_time: string      // '09:00'
  end_time: string       // '10:30'
  instructor_id: UUID    // which instructor
  max_seats: number
  seats_booked: number
  price_cents: number
  location: string       // 'Oak Ridge, TN'
}
```

**IMPORTANT: No Calendly dependency.** Build a native date/time picker. It's faster to build and fully customisable. Calendly is for Phase 3 if we need it.

### PRIORITY 2 — School Admin Panel
**File:** `src/app/school-admin/page.tsx` (school owner dashboard)
**File:** `src/app/school-admin/sessions/page.tsx` (manage sessions)
**File:** `src/app/school-admin/students/page.tsx` (student list)

**School owner can:**
1. See all their students (name, permit status, driving hours, cert issued?)
2. Add a student manually (name, email, phone, permit number)
3. Create/edit/delete sessions (date, time, instructor, max seats, price)
4. See booking requests (students who booked, pending confirmation)
5. Confirm or cancel a booking
6. View revenue for the month (from `payments` table)

**Security:** All queries filtered by `school_id` from the session. School owner only sees their own data. Enforced at RLS level.

### PRIORITY 3 — Session CRUD API Routes
**File:** `src/app/api/sessions/route.ts` (GET all sessions, POST new session)
**File:** `src/app/api/sessions/[id]/route.ts` (GET single, PUT update, DELETE)

All routes protected by middleware auth. `school_id` extracted from auth session, not from request body.

```ts
// GET /api/sessions?school_id=XXX
// Returns sessions for the school, ordered by start_date ASC

// POST /api/sessions
// Body: { start_date, start_time, end_time, instructor_id, max_seats, price_cents, location }
// Creates session for the school

// PUT /api/sessions/[id]
// Updates the session. Only if school_id matches session.school_id

// DELETE /api/sessions/[id]
// Soft-delete: sets a `cancelled` flag. Does NOT hard-delete (audit trail).
```

### PRIORITY 4 — Student CRUD API Routes
**File:** `src/app/api/students/route.ts` (GET all, POST new)
**File:** `src/app/api/students/[id]/route.ts` (GET, PUT update, DELETE)

```ts
// GET /api/students?school_id=XXX
// Returns all students for school (decrypted names only on server side)

// POST /api/students
// Body: { legal_name, dob, permit_number, parent_email, emergency_contact_name, emergency_contact_phone }
// Encrypts legal_name + permit_number before INSERT

// PUT /api/students/[id]
// Update fields. Re-encrypts if permit_number changes.
```

### PRIORITY 5 — Twilio SMS Integration
**File:** `src/lib/twilio.ts` (Twilio client)
**File:** `src/app/api/reminders/route.ts` (reminder trigger)
**File:** `src/components/BookingReminders.tsx`

Reminder logic (runs via OpenClaw cron, not n8n):
```
72h before lesson: "Hi [student name], reminder: your driving lesson at [school name] is in 3 days at [time]. Reply C to confirm, R to reschedule."
24h before lesson: "Hi [student name], reminder: your lesson is tomorrow at [time]. See you there!"
```

**Twilio setup:**
- `TWILIO_ACCOUNT_SID` in env
- `TWILIO_AUTH_TOKEN` in env
- `TWILIO_PHONE_NUMBER` in env
- `TWILIO_FROM` = the school phone number (school owner provides theirs, or we provide a shared number)

**Reminder schedule (OpenClaw cron):**
- Every hour: check `sessions` table for lessons in next 72h → send 72h reminder if not already sent
- Every hour: check for lessons in next 24h → send 24h reminder if not already sent
- Track `reminder_sent_72h` and `reminder_sent_24h` boolean columns on `students_driver_ed`

### PRIORITY 6 — Instructor Management
**File:** `src/app/school-admin/instructors/page.tsx`
**File:** `src/app/api/instructors/route.ts`
**File:** `src/lib/migrations/002_instructors.sql`

**Instructor object:**
```ts
type Instructor = {
  id: UUID
  school_id: UUID
  name: string
  email: string
  phone: string
  license_number: string
  license_expiry: date
  active: boolean
}
```

**School owner can:**
1. Add instructor (name, email, phone, license number, license expiry)
2. Edit instructor details
3. Deactivate instructor (soft delete — don't lose history)
4. See instructor's schedule (which sessions they're assigned to)

---

## File Map

```
src/
  app/
    book/
      page.tsx                   ← PRIORITY 1 (student booking)
      confirmation/page.tsx      ← PRIORITY 1 (post-booking confirmation)
    school-admin/
      page.tsx                   ← PRIORITY 2 (school dashboard)
      sessions/page.tsx         ← PRIORITY 2 (session CRUD)
      students/page.tsx         ← PRIORITY 2 (student list + add)
      instructors/page.tsx       ← PRIORITY 6 (instructor management)
    api/
      sessions/
        route.ts                ← PRIORITY 3 (GET list, POST create)
        [id]/route.ts           ← PRIORITY 3 (GET, PUT, DELETE)
      students/
        route.ts                ← PRIORITY 4 (GET list, POST create)
        [id]/route.ts          ← PRIORITY 4 (GET, PUT, DELETE)
      instructors/
        route.ts               ← PRIORITY 6 (GET, POST)
        [id]/route.ts         ← PRIORITY 6 (GET, PUT, DELETE)
      reminders/
        route.ts              ← PRIORITY 5 (Twilio reminder sender)
  lib/
    twilio.ts                  ← PRIORITY 5 (Twilio client wrapper)
    migrations/
      002_instructors.sql      ← PRIORITY 6 (instructors table + FK)
```

---

## Success Criteria

1. A student can browse available sessions for a school and book one → row created in `students_driver_ed`
2. School owner can log in and see their students, sessions, and revenue — all isolated to their school
3. School owner can create a session, add a student, add an instructor
4. SMS reminders are triggered 72h and 24h before a lesson (stubbed with Twilio, can be real once keys added)
5. All API routes return correct HTTP status codes and proper error messages
6. Build passes with zero errors

---

## What NOT to Build in Phase 2

- Multi-state certificate templates (hard-code TN for now)
- Payment history export to CSV/PDF
- Instructor scheduling algorithm
- Parent portal (student-facing portal — confirmation page is enough for MVP)
- DMV compliance alerts (Phase 3)

---

## Env Vars to Add

```env
# Twilio (add when ready — SMS works without this in test mode)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
```

---

## Agent Instructions for Codex

Build in this order. Commit after each file. Keep it simple — no overengineering.

**Order:**
1. `src/app/api/sessions/route.ts` + `[id]/route.ts`
2. `src/app/book/page.tsx` (booking page with session picker)
3. `src/app/book/confirmation/page.tsx`
4. `src/app/school-admin/page.tsx` (school admin dashboard)
5. `src/app/school-admin/sessions/page.tsx`
6. `src/app/school-admin/students/page.tsx`
7. `src/app/api/students/route.ts` + `[id]/route.ts`
8. `src/lib/migrations/002_instructors.sql`
9. `src/app/school-admin/instructors/page.tsx`
10. `src/app/api/instructors/route.ts` + `[id]/route.ts`
11. `src/lib/twilio.ts`
12. `src/app/api/reminders/route.ts`

When ALL 12 files are built, run:
```
openclaw system event --text "B.L.A.S.T. Phase 2 complete: booking + admin + reminders" --mode now
```
