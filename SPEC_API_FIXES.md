# SPEC — API Schema Fixes

## Problem

Multiple API routes reference columns that don't exist in the actual Supabase database. All routes were written against a design schema, never verified against the live DB.

---

## Fix 1: `/api/session-types` — remove `requires_permit`

**File:** `src/app/api/session-types/route.ts`

The query selects `requires_permit` — column does not exist in `session_types`.

```typescript
// Before
.select('id, name, description, duration_minutes, price_cents, deposit_cents, color, tca_hours_credit, requires_permit')

// After
.select('id, name, description, duration_minutes, price_cents, deposit_cents, color, tca_hours_credit')
```

---

## Fix 2: `/api/slots` — verify all column references

**File:** `src/app/api/slots/route.ts`

Current code references `session.session_time` and `session.end_time` as fallbacks. Let these be nullable — the sessions table has `start_date` (DATE) and `end_date` (DATE) but no time columns.

The booking page maps slot fields:
```typescript
type Slot = {
  session_date: string; start_time: string; end_time: string
  instructor_id: string; instructor_name: string; seats_available: number
}
```

The `/api/slots` response maps:
```typescript
{
  id, start_date, end_date,
  start_time: session.session_time ?? '09:00',  // non-existent column
  location,
  instructor,
  max_seats, seats_booked,
  available,
  deposit_cents, price_cents
}
```

`session_time` doesn't exist in the sessions table. Slots return `start_date` (date only) + `session_time` (not a column). The booking page tries to use `session.start_time` for display.

**Action:** Keep the fallback `'09:00'` as default since there's no time column in sessions. The real issue is Step 2 of booking using `s.start_time === selectedSlot.start_time` to match — but `start_time` doesn't exist on sessions.

**Real fix:** The matching in `handleSubmit`:
```typescript
const matched = sessions.find((s: any) => s.start_date === selectedSlot!.session_date && s.start_time === selectedSlot!.start_time && s.instructor_id === selectedSlot!.instructor_id)
```
This compares `s.start_time` (which doesn't exist) against `selectedSlot.start_time` (which is a text string like `'09:00'`). The match will always fail.

**Fix:** Match on `start_date` + `instructor_id` only (both exist and are real):
```typescript
const matched = sessions.find((s: any) =>
  s.start_date === selectedSlot!.session_date &&
  s.instructor_id === selectedSlot!.instructor_id
)
```

---

## Fix 3: `/school-admin` dashboard — `monthly_revenue` doesn't exist

**File:** `src/app/school-admin/page.tsx`

```typescript
// Line ~73
supabase.from('schools').select('monthly_revenue').eq('id', schoolId).single(),
// Line ~84
const monthlyRevenue = (revenueData as any)?.monthly_revenue || 0
```

`monthly_revenue` doesn't exist in `schools`. The demo dashboard already handles this correctly (calculates from bookings). Fix the non-demo path too:
- Remove `monthly_revenue` query
- Calculate monthly revenue from `bookings.deposit_amount_cents` where `status = 'confirmed'` and `created_at` is this month

---

## Scope

- `src/app/api/session-types/route.ts`
- `src/app/api/slots/route.ts`
- `src/app/book/page.tsx` (handleSubmit matching)
- `src/app/school-admin/page.tsx`

No new features. No DB changes.

---

## Success Criteria

1. `GET /api/session-types?school_id=X` returns session types without 500 error
2. `GET /api/slots?school_id=X&session_type_id=Y` returns slots without "Session type not found"
3. Booking flow: selecting a slot → submitting form → creates a booking
4. School admin dashboard: monthly revenue shows correctly (calculated from bookings)
5. `npm run build` passes with 0 errors
