# SPEC.md — P0-4: CSV Student Import

## What it does
A school admin can paste CSV content from Excel or Google Sheets into the import page and bulk-upload students. Each student gets encrypted PII fields (name, permit number, phone) before storage.

## What exists
The UI page and API route already exist — but the API route has three bugs that make it fail silently.

---

## Bug 1 — No school ownership check
The API accepts `x-school-id` from the client with zero verification that the authenticated user owns that school. Any authenticated user could import students into any school by guessing the school ID.

**Fix:** Query `schools` table, verify `owner_email = auth.jwt() ->> 'email'`.

## Bug 2 — Wrong client used for admin inserts
Line 98: `const supabaseAdmin = await createClient()` — this uses the auth-aware server client (reads cookies), not the service role client. When called from a client-side fetch with no browser cookies, this client has no auth context, meaning the inserts run with no user identity.

**Fix:** Use service role client: `createSupabaseAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY)`.

## Bug 3 — No deduplication
Re-importing the same student (same name + DOB) creates a duplicate instead of updating the existing record.

**Fix:** Upsert with `ON CONFLICT (school_id, legal_name, dob) DO UPDATE`.

---

## Data shape

**Input CSV columns (all aliases supported):**
- `legal_name` / `name` / `student_name` — required
- `dob` / `date_of_birth` — required, YYYY-MM-DD
- `permit_number` / `permit` / `license` — optional
- `parent_email` / `email` — optional
- `emergency_contact_name` — optional
- `emergency_contact_phone` — optional
- `driving_hours` / `classroom_hours` — optional, integer

**Output:**
```json
{
  "total": 10,
  "imported": 8,
  "failed": 2,
  "errors": ["Row 3: Invalid DOB format: '03/15/2010'", "Row 7: Missing student name"]
}
```

---

## Edge cases
- Empty CSV → clear error message
- Headers missing → descriptive error with accepted column names
- Duplicate student (same name+DOB) → update existing, don't create duplicate
- Invalid DOB format → report per row, skip that row, continue
- Missing required fields → skip row, report
- CSV with extra columns → ignore extras

---

## Success criteria
1. School admin can import 50+ students in one request
2. Re-importing same student updates existing record (not duplicate)
3. Invalid rows reported individually, valid rows still imported
4. PII (name, permit, phone) is encrypted at rest in the database
5. Audit log entry created per import

## Files to change
- `src/app/api/import/students/route.ts` — fix auth client, add ownership check, add upsert logic
- `src/app/school-admin/import/page.tsx` — pass correct school_id from session, not URL param

## Out of scope
- File upload (drag-and-drop) — paste-only for now
- CSV template download
- Partial import retry