# SECURITY TESTING PLAN — The Driving Center SaaS
**Classification:** INTERNAL — Contains PII handling procedures
**Prepared by:** Everest (Security Analyst Agent)
**Version:** 1.0

---

## Threat Model

### What we're protecting
- Student PII: legal name, DOB, permit number, emergency phone, parent email
- School PII: billing address, license numbers
- Payment data: Stripe customer IDs, transaction amounts
- Audit logs: all system actions

### Adversaries
- External: attackers probing API endpoints, credential stuffers, scrapers
- Internal: one school operator reading another school's student data
- Accidental: DB misconfiguration leaking data across tenants

---

## Security Test Protocol (Pre-Launch Checklist)

### Phase S1: Static Review — Verify PII Data Flow

**S1.1 — PII Inventory**
- [x] `students_driver_ed.legal_name` — ENCRYPTED (AES-256-GCM) ✅
- [x] `students_driver_ed.permit_number` — ENCRYPTED (AES-256-GCM) ✅
- [x] `students_driver_ed.dob` — PLAIN TEXT in DB; returned as-is in API → FIX NEEDED
- [x] `students_driver_ed.emergency_contact_phone` — PLAIN TEXT; no encryption → FIX NEEDED
- [x] `students_driver_ed.parent_email` — PLAIN TEXT; returned as-is → OK (user data)
- [x] `students_driver_ed.emergency_contact_name` — PLAIN TEXT; returned as-is → OK
- [x] `schools.license_number` — stored plain → needs review

**S1.2 — Encryption Gate Test**
Run with `ENCRYPTION_KEY=` (empty) → app must FAIL TO START, not silently use default key.

**S1.3 — RLS Policy Test**
```
1. Create school A + student record
2. Create school B
3. School B API key — try to GET school A's students
4. Expected: 0 rows returned
```
⚠️ CURRENT STATUS: RLS policies exist in migration SQL but have NOT been tested against live Supabase instance.

---

### Phase S2: Authentication & Authorization

**S2.1 — Magic Link Flow**
- [ ] Token expires after 1 hour ✅ (Supabase default)
- [ ] Token single-use ✅ (Supabase default)
- [ ] Already-used token rejected ✅
- [ ] Expired token → clear error message, not a crash

**S2.2 — Session Hijacking**
- [ ] Cookie is HTTP-only ✅ (Supabase SSR default)
- [ ] Cookie is SameSite=strict or lax ✅
- [ ] Cookie requires HTTPS in production ✅
- [ ] `getUser()` used for auth, not `getSession()` ✅

**S2.3 — Authorization on All Routes**
- [ ] All `/api/*` routes check `getUser()` before processing
- [ ] `x-school-id` header validated against authenticated user's school
- [ ] School A cannot modify School B's sessions/students/instructors

---

### Phase S3: API Security

**S3.1 — Input Validation**
- [ ] DOB validates age ≥ 15 (TCA requirement)
- [ ] Permit number format validated (alphanumeric, max length)
- [ ] Email format validated
- [ ] Phone number validated (E.164 format)
- [ ] No SQL injection (Supabase prepared statements used ✅)
- [ ] No NoSQL injection (not applicable — Supabase handles this)

**S3.2 — Rate Limiting**
- [ ] `/api/auth/*` — 10 req/min per IP
- [ ] `/api/stripe/checkout` — 5 req/min per user
- [ ] `/api/sessions POST` — 30 req/min per school
- [ ] `/api/students POST` — 30 req/min per school
- [ ] All other routes — 100 req/min per IP

**S3.3 — Error Messages**
- [ ] No stack traces in production responses ✅
- [ ] Validation errors return 400 with field name only
- [ ] Auth errors return 401 without revealing WHY

---

### Phase S4: Stripe & Payments

**S4.1 — Webhook Security**
- [ ] HMAC-SHA256 signature verified on every POST ✅ (code in place)
- [ ] Replay attacks blocked (event ID deduplication) → NEEDS FIX
- [ ] Webhook secret is not the live key → env var separate ✅
- [ ] `STRIPE_WEBHOOK_SECRET` checked at startup → NEEDS FIX (app should fail fast if missing)

**S4.2 — Checkout**
- [ ] Price not passed in client → server looks up from Stripe PRICE_ID ✅
- [ ] School cannot manipulate price on checkout ✅
- [ ] Refund flow exists → future work

---

### Phase S5: Audit Logging

**S5.1 — Audit Log Completeness**
- [ ] `PAYMENT_COMPLETED` ✅ (webhook)
- [ ] `STUDENT_CREATED` → NEEDS TO BE ADDED
- [ ] `STUDENT_UPDATED` → NEEDS TO BE ADDED
- [ ] `SESSION_CREATED` → NEEDS TO BE ADDED
- [ ] `SESSION_CANCELLED` → NEEDS TO BE ADDED
- [ ] `INSTRUCTOR_CREATED` / `DEACTIVATED` → NEEDS TO BE ADDED
- [ ] `SCHOOL_PROFILE_UPDATED` → NEEDS TO BE ADDED
- [ ] `AUTH_LOGIN` → Supabase handles this
- [ ] `AUTH_FAILED` → NEEDS TO BE ADDED (login failures logged)

**S5.2 — Audit Log Integrity**
- [ ] Audit logs table has RLS blocking deletes ✅ (service_role only)
- [ ] Audit log entries include timestamp, actor (user_id), action, details (JSONB)
- [ ] No PII in audit log details (email addresses OK, but not permit numbers or DOB)

---

### Phase S6: Data Retention (TCA Compliance)

**S6.1 — Retention**
- [ ] No auto-deletion of records < 3 years old ✅ (no purge mechanism)
- [ ] Records > 3 years flagged for manual review → cron job needed
- [ ] Supabase daily backups confirmed enabled → verify in Supabase dashboard

**S6.2 — Data Export**
- [ ] School can export their student data (GDPR-equivalent) → future work
- [ ] School can delete their data (after retention period) → future work

---

### Phase S7: Infrastructure

**S7.1 — Environment Variables**
- [ ] `ENCRYPTION_KEY` is 32+ random bytes, stored in `.env.local`, never in git ✅
- [ ] `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` stored separately ✅
- [ ] `SUPABASE_SERVICE_ROLE_KEY` never exposed to client ✅
- [ ] No `NEXT_PUBLIC_` prefix on any secret key ✅
- [ ] Twilio/Resend keys not in `NEXT_PUBLIC_` namespace ✅

**S7.2 — Dependencies**
- [ ] `npm audit` runs clean (no critical CVEs)
- [ ] No dev-only packages in production build

---

## How to Run These Tests

```bash
# 1. Clone and checkout
cd ~/projects/the-driving-center-website
git checkout blast-phase-1

# 2. Run npm audit
npm audit

# 3. Start dev server and run manual tests
npm run dev

# 4. Test RLS (in Supabase SQL Editor — as service_role)
SELECT * FROM students_driver_ed WHERE school_id = 'wrong-school-id'; 
-- Should return rows as service_role (expected), but with anon key should return 0

# 5. Test encryption key missing
ENCRYPTION_KEY= node -e "require('./src/lib/security')"
# Should throw: "ENCRYPTION_KEY environment variable is required"

# 6. Full build test
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co \
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder \
STRIPE_SECRET_KEY=sk_test_placeholder \
npm run build
```

---

## Priority Fixes (Critical — Fix Before Launch)

| Priority | Issue | Fix |
|---|---|---|
| P0 | `permit_number`, `dob`, `emergency_phone` returned in GET responses | Strip from API responses |
| P0 | Fallback encryption key if env missing | Fail fast — throw on startup |
| P0 | Webhook secret missing | Fail fast on startup |
| P0 | RLS not tested | Test in Supabase after migrations run |
| P1 | Audit logs missing on most actions | Add to all POST/PUT/DELETE handlers |
| P1 | No input validation (DOB age, permit format) | Add validators |
| P1 | Rate limiting | Add upstash-ratelimit |
| P1 | `increment_seats_booked` RPC has no ownership check | Add school_id check |
| P2 | Replay attack prevention on webhook | Deduplicate event IDs in Redis/DB |
| P2 | Data export for schools | Future |
| P3 | 3-year retention cron job | Future |