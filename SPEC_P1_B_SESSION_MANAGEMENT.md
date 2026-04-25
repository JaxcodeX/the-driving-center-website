# SPEC.md — P1-B: Session Management

## What it does
Full session CRUD for school admins — create, edit, cancel, and duplicate sessions. Calendar-style list view with enrollment counts.

## Current state
- `GET /api/sessions?school_id=X` — works, no school ownership check
- `POST /api/sessions` — works, school ownership check via auth
- `PUT /api/sessions/[id]` — works, has school ownership check
- `DELETE /api/sessions/[id]` — works (soft-cancel), has school ownership check
- Sessions page: basic create form, list view, school_id from URL params (BUG)

## Bugs to fix

### Bug 1: GET /api/sessions has no school ownership check
Any authenticated user could read any school's sessions via `?school_id=X`. Needs same fix as students API — verify `schools.owner_email = user.email`.

### Bug 2: Sessions page uses URL params for school_id
Same bug as students page fixed in P0-4. Sessions page uses `useSearchParams` to get `school_id` from URL. Must switch to fetching from `/api/auth/session` like P1-A does.

### Bug 3: No instructor selector
Create form has a text input for `instructor_id`. Should be a dropdown fetching the school's instructors from `/api/instructors`.

## Features to add

### Feature 1: Edit session (slide-over panel)
Click any session card → slide-over edit panel with all fields:
- Date, start time, end time
- Location, max seats, price
- Instructor (dropdown)
- Cancel session button (soft cancel, sets `cancelled: true`)

### Feature 2: Duplicate session series
Button on session card: "Duplicate Series". Opens a modal:
- How many weeks to run (1-12)
- Day of week (same as original)
- Option to change time/instructor for the series

### Feature 3: Better session list view
- Show enrollment: "3/10 seats filled"
- Show instructor name
- Show session type (from session_types table if joined)
- Future vs past sessions visually separated
- Past sessions grayed out

## API changes

### `GET /api/sessions?school_id=X`
Add school ownership check (verify owner_email matches auth user). Return instructor name via join.

### `POST /api/sessions/duplicate/[id]`
Body: `{ weeks: number }`. Duplicates the session for N weeks forward (same day, same time, same instructor/location). Creates multiple session records.

## UI changes

### Sessions page
- Fetch school_id from `/api/auth/session` on mount (not URL params)
- Session list: date, time, location, instructor, seats badge, price
- Click session → slide-over edit panel
- "Duplicate" button per session → opens duplicate modal
- Cancel button in edit panel (soft deletes, sets `cancelled: true`)
- Instructor dropdown fetched from `/api/instructors?school_id=X`

### Edit slide-over
- All session fields editable
- Save button → PUT /api/sessions/[id]
- Cancel session → DELETE /api/sessions/[id] (soft cancel)
- Shows enrollment count (seats_booked/max_seats)

## Edge cases
- Session in the past → disable editing, show "Completed" badge
- Cancel session with students enrolled → confirm "This will notify all enrolled students" (stub notification for now)
- Seats overbooked → show warning badge (shouldn't happen but defensive)

## Success criteria
1. Sessions list shows real instructor names and enrollment counts
2. School ownership verified on GET sessions
3. Edit slide-over works for all session fields
4. Duplicate series creates N sessions at correct intervals
5. Cancel/soft-delete works with audit log

## Files to change
- `src/app/api/sessions/route.ts` — add ownership check to GET
- `src/app/api/sessions/duplicate/[id]/route.ts` — new endpoint for series duplication
- `src/app/school-admin/sessions/page.tsx` — fetch school_id from session, add edit panel + duplicate modal + instructor dropdown

## Out of scope
- Email/SMS notifications on cancel (P1-C)
- Calendar view (future feature)
- Session type management (P1-B extended)