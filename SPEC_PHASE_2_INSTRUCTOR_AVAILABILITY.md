# SPEC.md — Phase 2: Instructor Self-Service Availability

**Date:** 2026-04-26
**Status:** Draft
**Goal:** Allow instructors to manage their own availability without requiring the school owner to do it for them.

---

## Why This Matters

Currently the school owner sets instructor availability manually in the ops panel. For a school with 3+ instructors, this doesn't scale. An instructor who wants to change their Thursday hours has to message the owner, wait, and hope it gets updated correctly.

With self-service, instructors log in, set their own schedule, and the owner only manages exceptions.

---

## Data Model

**`instructors`** — already exists with: `id, school_id, name, email, phone, license_number, active`

**`instructor_availability`** — already exists with: `instructor_id, day_of_week (1-7), start_time, end_time, active`

The missing piece is the **instructor-facing UI** and **auth flow** — instructors don't have their own dashboard login yet.

---

## What to Build

### 1. Instructor Magic Link Auth

Instructors receive a magic link to set their password/view their schedule. Flow:
1. Owner adds instructor by email in `/school-admin/instructors`
2. System sends magic link to instructor's email
3. Instructor clicks link → lands on `/instructor/schedule` page
4. Instructor sets/updates their availability
5. Changes are immediate

**Auth:** Instructor email is matched to their `instructors` record via magic link. No separate auth system — Supabase handles it.

**API:** `POST /api/instructors/invite` — sends magic link to instructor email.

### 2. Instructor Schedule Page

`/instructor/schedule` — accessible via magic link token, shows:
- Instructor's name and school
- Current weekly availability (Mon-Sun grid)
- Toggle to enable/disable days
- Time range picker for each enabled day
- Save button → updates `instructor_availability` table

**UI:** Simple, mobile-friendly. Instructors are often on their phone when checking their schedule.

### 3. Owner View of Instructor Schedules

School owner already has `/school-admin/instructors` page. Add:
- View each instructor's current availability
- See who has no availability set this week

---

## API Changes

### `POST /api/instructors/invite` (new)
```typescript
// Body: { instructorId: string }
// Action: sends Supabase magic link to instructor's email
// Returns: { success: true }
```

### `GET /api/instructor-availability?instructor_id=X` (existing, needs verify)
Returns instructor's availability records from `instructor_availability` table.

### `PUT /api/instructor-availability` (new)
```typescript
// Body: { instructor_id: string, availability: DayAvailability[] }
// DayAvailability: { day_of_week: 1-7, start_time: "09:00", end_time: "17:00", active: boolean }
// Replaces all availability for this instructor with the submitted set
```

### `GET /api/instructors/[id]/schedule` (new)
```typescript
// Returns instructor's availability for owner view
// Auth: school owner only
```

---

## UI Changes

### `/school-admin/instructors` — Add invite button
- "Add Instructor" form already exists
- Add: "Send schedule link" button next to each instructor
- Shows pending/accepted status of magic link

### `/instructor/schedule` — New page (instructor-facing)
- Header: "Your Schedule — [School Name]"
- Weekly grid: 7 days, each with toggle + time range
- Save button
- No sidebar, no dashboard chrome — clean single-purpose page

---

## Files to Change

- `src/app/api/instructors/invite/route.ts` — new, sends magic link
- `src/app/api/instructor-availability/route.ts` — GET + PUT for availability
- `src/app/api/instructors/[id]/schedule/route.ts` — new, owner view
- `src/app/instructor/schedule/page.tsx` — new instructor-facing page
- `src/app/school-admin/instructors/page.tsx` — add "send schedule link" action
- `src/middleware.ts` — add `/instructor/*` to protected routes

---

## Out of Scope

- Instructor dashboard with booking view (Phase 3)
- Email/SMS notifications to owner when instructor changes availability
- Instructor mobile app

---

## Success Criteria

1. Owner can send a magic link to an instructor from `/school-admin/instructors`
2. Instructor clicking the link lands on their schedule page
3. Instructor can enable Mon-Fri 8am-5pm, save, and see it reflected in the bookings calendar
4. School owner sees updated availability in the ops panel within seconds
5. Demo mode works without real email (stub log)
