# DISCOVERIES.md — What We Know

*Key findings, constraints, and lessons learned. Updated after every meaningful discovery.*

---

## Technical Constraints

### Supabase
- `uuid_generate_v4()` for all primary keys
- Service role key → server-side only, never exposed
- Anon key → public-facing, RLS enforces access
- Auth: magic link via `supabase.auth.signInWithOtp()` + `getUser()` for verification
- Webhook forward: Supabase can forward webhooks to serverless functions

### Stripe
- Checkout: server creates Checkout Session with PRICE_ID (never trust client price)
- Webhook: HMAC-SHA256 signature verified before any DB write
- Webhook secret: `STRIPE_WEBHOOK_SECRET` — different from live key
- Price ID: stored in env var, not client-side

### Next.js 16 (React 19)
- `useSearchParams()` MUST be wrapped in `<Suspense>` — build fails otherwise
- Pages using `searchParams` are dynamic (`force-dynamic` or Suspense)
- Middleware runs on every request — keep it lean
- Middleware convention: `proxy.ts` (not `middleware.ts`) in Next.js 16+

### Encryption (Web Crypto API)
- AES-256-GCM: 12-byte IV prepended to ciphertext, result base64'd
- Key must be ≥32 chars, stored in `ENCRYPTION_KEY` env var
- Encrypt at WRITE time (before INSERT/UPDATE), decrypt at READ time (server-side only)
- `ENCRYPTION_KEY` must throw at runtime if missing — never silently use a default

### Kimi K2.6 via Ollama
- `ollama launch codex --model kimi-k2.6:cloud` — Kimi K2.6 powers Claude Code interface
- Codex cannot inject custom Ollama models — uses ChatGPT API only
- `pi` agent (Pi) works well for lightweight tasks

---

## Compliance (T.C.A. § 1340-03-07)

- **Retention:** 3 years minimum from certificate_issued_at
- **Soft deletes only:** use `deleted_at` column, never hard delete
- **Student minimum age:** 15 years old (DOB validation required)
- **Permit numbers:** stored encrypted, validated alphanumeric 5-20 chars
- **Audit logs:** never delete, never log PII

---

## Competitor Research Findings

- Market rate: $99-299/mo per school
- No-shows are the #1 pain point (SMS reminders = key differentiator)
- Most competitors don't offer multi-tenant SaaS — one school per install
- TN/KY/GA market: ~20+ schools identified in RESEARCH_TRACK_A_LEADS.md
- Sweet spot: $99/mo Starter tier, $199/mo Growth, $399/mo Enterprise

---

## What We Tried That Didn't Work

### Ollama Codex
- `ollama launch codex` sounds like Kimi K2.6 powering Codex
- Reality: Codex binary uses OpenAI API, cannot use Ollama models
- Fix: Build directly with me (Everest) for most features, use `pi` agent for research tasks

### pi agent
- pi/CLAUDE.md syntax doesn't work with `pi` CLI
- Fix: `--model kimi-k2.6:cloud` flag works for research subagents

---

## Multi-Tenant Isolation Rules

Every query touching `students_driver_ed`, `sessions`, `instructors`, `payments` MUST:
1. Include `school_id` in WHERE clause
2. Verify `school_id` matches the authenticated user's school
3. Return only records belonging to that school

RLS policies are the last line of defense — not the first.

---

## Session State

- Sessions stored as `start_date` (YYYY-MM-DD) + `start_time` (HH:MM) separate columns
- `seats_booked` incremented via `increment_seats_booked` RPC (atomic, ownership-checked)
- `cancelled` flag for soft-cancel (not hard delete)
- Booking link: `/book?school=[school_id]`

---

*Last updated: 2026-04-22 — Everest*
