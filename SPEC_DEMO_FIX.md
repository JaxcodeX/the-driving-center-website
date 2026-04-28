# SPEC: Demo Mode Auth Fix

## Problem

After demo login, the school admin pages show empty data:

- Demo login sets `demo_session` + `demo_user` cookies ✓
- But `createClient()` in the browser has **no Supabase JWT session**
- Every Supabase query returns **406 Not Acceptable** — RLS blocking because `auth.uid()` is null
- Result: "0 total / No students" — not empty data, blocked by RLS

## Root Cause

Demo login creates a Supabase auth user via Admin API — but never creates a Supabase browser session.

The `createClient()` call in the browser reads `sb-<project>-access-token` cookie for JWT auth.
Demo login was not setting this cookie.

## Fix

### 1. Demo login sets real Supabase JWT session cookie (`src/app/api/auth/demo-login/route.ts`)

After creating the demo user, also create a JWT and set it as `sb-<project>-access-token`:

- JWT signed with `SUPABASE_JWT_SECRET` (HS256)
- `sub` = demo user ID (created via Admin API, confirmed via `email_confirm: true`)
- `role: 'authenticated'` claim included
- 7-day expiry

### 2. Demo API endpoint for students (`src/app/api/demo/students/route.ts`)

New endpoint that:
- Reads `demo_user` cookie via Next.js `cookies()`
- Uses `getSupabaseAdmin()` (service role) to bypass RLS
- Returns decrypted student data

### 3. Students page uses demo endpoint when in demo mode

`src/app/school-admin/students/page.tsx`:
- Check for `demo_user` cookie client-side
- If found: call `/api/demo/students` (server-side demo endpoint, no RLS)
- If not found: use normal Supabase auth flow

## Files Changed

- `src/app/api/auth/demo-login/route.ts` — add JWT cookie creation
- `src/app/api/demo/students/route.ts` — new demo endpoint
- `src/app/school-admin/students/page.tsx` — use demo endpoint in demo mode

## Verification

After fix:
1. Login at `/login` with PIN `0000`
2. School admin dashboard should show demo school name
3. Students page should show 4 demo students (Olivia Chen, Jaylen Brooks, Priya Nair, Mason Torres)
4. Sessions page should show 5 upcoming sessions
5. No 406 errors in browser console
