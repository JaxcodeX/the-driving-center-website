# SPEC.md — P1-A: Student Profile Edit + TCA Tracking

## What it does
School admin clicks a student row in `/school-admin/students` → opens an edit panel with full profile, TCA hours progress, and certificate issuance.

## Data shape

**Student record in DB:**
- `legal_name` — encrypted
- `permit_number` — encrypted
- `dob` — plain text
- `driving_hours` — integer (TN requires 6 behind-wheel)
- `classroom_hours` — integer (TN requires 30 classroom)
- `certificate_issued_at` — timestamp or null

**TN TCA minimums:**
- Classroom: 30 hours
- Behind-wheel: 6 hours
- Total: 36 hours before certificate eligible

## API changes

### `GET /api/students?school_id=X`
Add decrypted student names for the admin view. Decrypt `legal_name` server-side, return real names to the school admin. (DOB and permit_number still withheld from list view — only shown in the edit panel.)

### `GET /api/students/[id]`
Return full student record for edit panel: legal_name (decrypted), permit_number (decrypted), dob, driving_hours, classroom_hours, certificate_issued_at, parent_email, emergency contacts.

### `PATCH /api/students/[id]`
Update any field: legal_name, permit_number, parent_email, emergency contacts, driving_hours, classroom_hours. Only school owner can update their school's students.

### `POST /api/students/[id]/issue-certificate`
Set `certificate_issued_at = NOW()`, returns certificate data. Only callable when driving_hours >= 6 AND classroom_hours >= 30.

## UI changes

### Student list (page.tsx)
- School ID from session, not URL param (same fix as P0-4)
- Decrypt names server-side, show real names instead of "Student"
- Show TCA hours progress bar per student
- Show certificate status badge
- Click row → opens edit slide-over panel

### Edit slide-over panel
- Full profile: name, DOB, permit number, parent email, emergency contacts
- TCA hours: driving hours + classroom hours inputs, progress bar
- Certificate button: enabled when eligible, disabled when already issued

## Edge cases
- Certificate already issued → show issued date, disable issue button
- Hours below minimum → show "Not eligible yet" with required vs current
- No student found → 404 in panel
- Not school owner → 403

## Success criteria
1. Admin can view full decrypted student list (names, not `[encrypted]`)
2. Admin can click any student row and edit all fields
3. TCA hours update and persist
4. Certificate button only active when eligible (≥6 driving + ≥30 classroom)
5. Certificate issuance creates audit log entry

## Files to change
- `src/app/api/students/route.ts` — GET returns decrypted names
- `src/app/api/students/[id]/route.ts` — new PATCH handler
- `src/app/api/students/[id]/issue-certificate/route.ts` — new certificate endpoint
- `src/app/school-admin/students/page.tsx` — row click → slide-over, real names, TCA progress

## Out of scope
- Student-facing view (parents/students don't log in yet)
- PDF certificate download (just the issuance record for now)
- Session enrollment view (P1-B)
- SMS/email notifications (P1-C)