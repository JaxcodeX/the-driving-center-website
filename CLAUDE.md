# CLAUDE.md — The Driving Center SaaS
**Mode: FSO Workflow (strictly enforced)**
**Updated: 2026-04-26**

---

## The One Rule

Every feature request follows this sequence. No exceptions.

```
Zax: "Build [feature]"
        ↓
Everest: Write SPEC.md (blueprint first)
        ↓
Everest: DeepSeek generates code
        ↓
Everest: Review diffs + run build
        ↓
Deploy → Vercel auto-deploys
        ↓
Log result in WORKFLOW_LOG.md
```

**If there's no SPEC.md, there's no implementation.**

---

## Who Does What

| Role | What |
|---|---|
| **Zax** | Directs, reviews output, approves or rejects |
| **Everest** | Writes specs, spawns DeepSeek, reviews code, makes architecture calls |
| **DeepSeek** | Generates code from SPEC.md only |
| **Mark** | Reviews architecture decisions, not code implementation |

**Everest's job is not to write code — it's to write specs and review code.**
DeepSeek generates the implementation. I review it. You approve it.

---

## Current Stack

| Role | Tool |
|---|---|
| Primary AI | MiniMax-M2.7 (daily driver, planning, review) |
| Code generation | DeepSeek V4 Flash (deepseek-v4-flash) |
| Web app | Next.js 16 + React 19 + TailwindCSS 4 |
| Database | Supabase (PostgreSQL + RLS + Magic Links) |
| Payments | Stripe ($99/mo subscription) |
| Email | Resend (stub — needs key) |
| SMS | Twilio (stub — needs key) |
| Hosting | Vercel |
| Automation | OpenClaw cron (no n8n) |

**Coding agents: DeepSeek V4 Flash only.** Codex/Claude/pi are retired for this project.

---

## File Structure (Source of Truth)

```
the-driving-center-website/
├── CLAUDE.md          ← THIS FILE — how we work
├── STATUS.md         ← current state: what works, what's broken, what's next
├── SPEC.md           ← current feature spec (one active spec at a time)
├── WORKFLOW_LOG.md   ← every build cycle logged
│
├── src/app/          ← all routes + pages
├── src/lib/
│   ├── supabase/
│   ├── migrations/   ← SQL (run in Supabase SQL Editor)
│   ├── email-templates/
│   └── security.ts
│
├── SPEC_P1_A_*.md    ← past feature specs (archived after cycle complete)
├── SPEC_P1_B_*.md
├── SPEC_P1_C_*.md
├── SPEC_PHASE_2.md    ← Phase 2 spec
└── SPEC_PHASE_3.md    ← Phase 3 spec
```

**Delete other .md files after reading:**
`BUILD_PLAN.md`, `PROGRESS.md`, `DISCOVERIES.md`, `PROJECT_CONSTITUTION.md`, `OPERATIONS_LOG.md`, `OPERATIONS_MANUAL.md` — these are redundant, contradictory, and maintained nowhere. They are the Legos that spilled.

---

## SPEC.md Template

```markdown
# SPEC.md — [Feature Name]

## What it does (one sentence)
## How it works (data flow)
## API shapes (request/response)
## Edge cases
## Success criteria
## Files to change
## Out of scope
```

---

## Test Framework (Automated, One Command)

Run all tests:
```bash
cd ~/projects/the-driving-center-website
npm run test:e2e
```

All tests live in `tests/e2e/`. Each test hits a real API endpoint with dummy data and verifies the response.

---

## WORKFLOW_LOG.md Format

```
## Cycle N — [Feature]
Date: YYYY-MM-DD
SPEC: [linked]
Implemented by: DeepSeek
Result: passed / failed / partial
Failures: [what went wrong]
Next action: [what we do next]
```

---

## Security Rules (Non-Negotiable)

Every API route must have:
- [ ] Auth check (`getUser()`)
- [ ] Ownership check (does this school own this data?)
- [ ] PII encrypted at write, stripped at read
- [ ] Input validation
- [ ] Audit log on all writes
- [ ] `school_id` in every WHERE clause

Never: skip ownership check, log PII, allow cross-tenant access, pass real keys to client.
