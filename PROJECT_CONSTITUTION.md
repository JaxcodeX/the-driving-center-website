# PROJECT CONSTITUTION — The Driving Center SaaS
**Version:** 1.0 | Built from Jack Roberts' B.L.A.S.T. Protocol
**Owner:** Everest (AI Operator) + Cayden Wilson (Founder)

---

## Our B.L.A.S.T. Protocol

**B.L.A.S.T.** is how we build. Every feature, every fix, every decision goes through this:

- **B**lueprint — Define the goal and data shape before touching code
- **L**ink — Verify connections and credentials before building logic
- **A**rchitect — Build in layers (Plan → Security Review → Code → Test)
- **S**tylize — Polish for production delivery
- **T**rigger — Deploy and set up the automation

---

## Our 5 Discovery Questions

Before any new feature or project:

1. **North Star** — What does success look like in 1 sentence?
2. **Integrations** — What external services are involved? Are keys ready?
3. **Source of Truth** — Where does the data live? (Supabase = primary DB)
4. **Delivery Payload** — Where does the result go? (Dashboard, email, SMS, Stripe)
5. **Behavioral Rules** — What must it absolutely NOT do? (Leak PII, allow cross-tenant access, accept invalid DOB)

---

## Our Tech Stack (The "Tools" Layer)

These are our execution tools. We don't guess at alternatives.

| Role | Tool |
|---|---|
| AI Operator | OpenClaw (me) + MiniMax model |
| Coding Agent | Kimi K2.6 via Ollama |
| Web App | Next.js 16 + React 19 + TailwindCSS 4 |
| Database | Supabase (PostgreSQL + RLS + Auth) |
| Payments | Stripe ($99/mo subscription) |
| SMS | Twilio (stub mode until keys added) |
| Email | Resend (stub mode until keys added) |
| Hosting | Vercel |
| Cron/Automation | OpenClaw agents (no n8n) |

---

## Our 3-Layer Architecture

### Layer 1: Architecture (`*.md files — The SOPs`)
Technical decisions, schemas, and rules. The "law" of the project.

### Layer 2: Navigation (`OPERATIONS_LOG.md — The Decision Layer`)
I route work through the right SOPs and tools. I don't try to hold all the context in my head — I route, delegate, and document.

### Layer 3: Tools (The Code — `src/app/**`)
Deterministic code. Every function does one thing. No guessing.

---

## Our File Structure

```
the-driving-center-website/
├── PROJECT_PLAN.md      ← Current phase goals + checklist (replaces task_plan.md)
├── DISCOVERIES.md       ← Key findings, constraints, what we learned
├── PROGRESS.md          ← Session logs, what was done, errors, results
├── SPEC.md              ← Phase 1 + 2 + 3 work orders
├── SPEC_PHASE_3.md      ← Phase 3 work order
├── SECURITY_TESTING_PLAN.md ← Pre-launch security checklist
├── OPERATIONS_LOG.md    ← Daily standup + current state
├── OPERATIONS_MANUAL.md ← How the business runs (agent roles, cadence)
└── src/
    ├── app/             ← All routes + pages
    ├── lib/
    │   ├── security.ts  ← Encryption, validation, audit helpers
    │   ├── email.ts     ← Resend client
    │   ├── twilio.ts   ← Twilio client
    │   └── migrations/  ← SQL migrations (run in Supabase SQL Editor)
    └── components/      ← Reusable UI components
```

---

## Our Operating Principles

### 1. Data-First Rule
Before writing any API route:
- Define the JSON input/output shape in `DISCOVERIES.md`
- Identify which fields are PII and must be encrypted
- Confirm RLS policy covers this new table/query

### 2. Security Before Speed
Every new endpoint must pass the Security Checklist before it's committed:
- [ ] Auth check (`getUser()`)
- [ ] Ownership check (does this school own this data?)
- [ ] PII fields encrypted at write, stripped at read
- [ ] Input validation on all user input
- [ ] Audit log on all writes
- [ ] No secrets in `NEXT_PUBLIC_` namespace

### 3. Self-Annealing (The Repair Loop)
When something breaks:
1. **Analyze** — Read the error. Don't guess.
2. **Patch** — Fix the specific file.
3. **Test** — Run `npm run build`.
4. **Document** — Update `PROGRESS.md` with the error + fix.

### 4. Fail Fast on Missing Credentials
If `STRIPE_SECRET_KEY`, `ENCRYPTION_KEY`, or `STRIPE_WEBHOOK_SECRET` is missing → app throws before accepting any traffic. No silent degradation.

### 5. Retention Compliance (T.C.A. § 1340-03-07)
- Student records: 3-year minimum retention
- No hard deletes — soft delete only (`deleted_at` column)
- Audit logs: never delete, never modify

### 6. Multi-Tenant Isolation (Non-Negotiable)
- School A can NEVER see School B's data
- Every query must include `school_id` in WHERE clause
- RLS policies tested after every migration

---

## Our Build Protocol (B.L.A.S.T. Applied)

### For Every Feature:

**B — Blueprint**
```
1. Write or update SPEC.md entry
2. Identify: what data changes? What PII is involved?
3. Identify: what external service calls? Are credentials ready?
4. Identify: what RLS policies need updating?
5. Write the test case BEFORE writing code
```

**L — Link**
```
1. Verify env vars are present (check .env.local)
2. Verify Supabase project is accessible
3. Run any new SQL migrations in Supabase SQL Editor
4. Verify Stripe webhook is receiving test events
```

**A — Architect**
```
1. Write the API route (security checks first, then logic)
2. Add input validation (security.ts helpers)
3. Add audit log on every POST/PUT/DELETE
4. Add Suspense boundary if using useSearchParams
5. Run npm run build — must pass
6. Update PROGRESS.md
```

**S — Stylize**
```
1. Update the relevant admin page if UI changed
2. Check mobile responsiveness
3. Verify loading/empty states
4. Check error messages are human-readable
```

**T — Trigger**
```
1. git commit with descriptive message
2. git push
3. If new env vars needed: document in .env.local.example
4. If new cron job needed: set up via OpenClaw cron-setup skill
```

---

## Our Security Rules (Non-Negotiable)

### PII Fields — Must Be Encrypted
```
legal_name          → AES-256-GCM via src/lib/security.ts
permit_number       → AES-256-GCM via src/lib/security.ts
emergency_phone     → AES-256-GCM via src/lib/security.ts
```

### PII Fields — Never Returned to Client
```
dob                 → Stored, never in API responses
permit_number       → Encrypted in DB, never in API responses
legal_name          → Encrypted in DB, [encrypted] in API responses
emergency_phone     → Encrypted in DB, never in API responses
```

### Never Do These
- [ ] Never log PII in audit_logs.details
- [ ] Never pass raw student data to external services
- [ ] Never use `getSession()` — always `getUser()`
- [ ] Never commit a real API key
- [ ] Never allow a school to pass their own price to Stripe
- [ ] Never skip the ownership check on a PUT/DELETE

---

## Our Progress Tracking

After every session, update `PROGRESS.md`:
```markdown
## Session — [Date]

**What was built:**
- [file]: what changed

**Errors encountered:**
- Error: [exact error]
- Fix: [what I did]

**Next session:**
- [ ] Priority 1
- [ ] Priority 2
```

---

*This file is the law. Update it when the architecture changes. Before writing any code, read this file.*
