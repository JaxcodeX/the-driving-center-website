# Errors — The Driving Center

Command failures, integration errors, and tool failures encountered during development.

---

## How to Use

After each subagent run or session:
1. Check if any build/runtime errors map to existing entries
2. Add new error entries with root cause + fix
3. Look for recurring errors — those get promoted to LEARNINGS.md as `best_practice`

---

## Template for New Entry

```markdown
## [Error Title] — [YYYY-MM-DD]

**Command/Tool:** [what failed]
**First Occurrence:** [date]
**Occurrence Count:** [n]

**Exact Error:**
```
[paste exact error text]
```

**Root Cause:**
[why it happened]

**Fix Applied:**
[what solved it]

**Prevention:**
[how to avoid it next time]

**See Also:** #n (link to related error entries)
```

---

## Error Patterns (Resolved)

### E001 — Schema Column Name Drift — RESOLVED
**Root Cause:** Code was written based on design assumptions, not actual DB inspection. `start_time` didn't exist in `sessions` table.

**Fix:** Inspect actual DB via REST API before writing queries. Created `ACTUAL_SCHEMA.md` as verified source of truth.

**Prevention:** Always query `ACTUAL_SCHEMA.md` first. Never assume column names.

---

### E002 — RLS Blocking Public Routes — RESOLVED
**Root Cause:** API routes used `createClient()` (user auth) instead of admin client. RLS policies based on `auth.jwt() ->> 'email'` blocked unauthenticated requests.

**Fix:** Public booking endpoints use `getSupabaseAdmin()` when `DEMO_MODE=true`.

**Prevention:** Public endpoints must verify auth client vs admin client. Test with both authenticated and unauthenticated requests.

---

### E003 — Inline getSupabaseAdmin() Duplication — RESOLVED
**Root Cause:** `getSupabaseAdmin()` was defined inline in 13+ API route files. Changing the function signature required updating all of them.

**Fix:** Centralized to `@/lib/supabase/server`. All routes import from single source.

**Prevention:** Never duplicate utility functions. Centralize anything used in 3+ files.

---

### E004 — Auth Callback Identity Mismatch — RESOLVED
**Root Cause:** Auth callback wrote `user_metadata.school_id` but dashboard read `schools.owner_email` — two separate identity systems that never got reconciled.

**Fix:** Dual-write: `user_metadata.school_id` + `schools.owner_email` written at same time.

**Prevention:** Auth identity and business identity must be linked explicitly. Test auth changes end-to-end.

---

### E006 — Non-existent Column Name in SELECT Query — RESOLVED
**Command/Tool:** `/api/test-error` route — Supabase REST API
**First Occurrence:** 2026-05-16
**Occurrence Count:** 1 (deliberate test)

**Exact Error:**
```
{
  "message": "column schools.nonexistent_test_column does not exist",
  "code": "42703",
  "details": null,
  "hint": null
}
```

**Root Cause:**
The SELECT query referenced a column `nonexistent_test_column` that doesn't exist in the `schools` table. The actual `schools` table has `owner_email`, not `nonexistent_test_column`.

**Fix Applied:**
Changed the column from `nonexistent_test_column` to `owner_email`, which exists in the actual DB schema (verified in ACTUAL_SCHEMA.md).

**Prevention:**
Always verify column names against ACTUAL_SCHEMA.md before writing SELECT queries. Never assume column names based on design — inspect the live DB schema.

**See Also:** E001 (Schema Column Name Drift)

---

## Recurring Errors (Unresolved)

### E005 — Hardcoded Hex Colors in Components
**Root Cause:** Components use hardcoded `style={}` with hex values instead of CSS variables from globals.css.

**Status:** Phase 5 refactor in progress (school-admin/page.tsx completed 2026-05-16).

**Prevention:** New components must use CSS variables. No hardcoded hex in style={} props.

---

*Auto-managed. Commit after updates.*