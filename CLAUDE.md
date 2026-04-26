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
**Plans live in project files. Discord is for coordination only.**

---

## Sprint — Mark Martin Demo (7 Days)

**Active spec:** `SPEC_ONE_WEEK_SPRINT.md`

| Day | Goal |
|---|---|
| 1 | Critical infrastructure: migrations, RLS test, subscription middleware |
| 2 | End-to-end flow: Zax clicks everything, document/fix failures |
| 3 | UI polish: one-shot coding agent, consistent design tokens |
| 4 | CSV import + school profile editor |
| 5 | Demo script + 5 dry runs |
| 6 | Buffer — fix anything from dry runs |
| 7 | **DEMO TO MARK** |

---

## Who Does What

| Role | What |
|---|---|
| **Zax** | Directs, reviews output, approves or rejects |
| **Everest** | Writes specs, spawns DeepSeek, reviews code, makes architecture calls |
| **DeepSeek** | Generates code from SPEC.md only |
| **Mark** | Reviews architecture decisions, not code implementation |

**Everest's job is not to write code — it's to write specs and review code.**
DeepSeek generates the implementation. You approve it.

---

## Current Stack

| Role | Tool |
|---|---|
| Primary AI | MiniMax-M2.7 (daily driver, planning, review) |
| Code generation | DeepSeek V4 Flash (deepseek-v4-flash) |
| Web app | Next.js 16 + React 19 + TailwindCSS 4 |
| Database | Supabase (PostgreSQL + RLS + Magic Links) |
| Payments | Stripe ($99/mo subscription, DEMO_MODE bypass for demo) |
| Email | Resend (live — `re_ZwCTERGk_8eesZtYHGkR32GPv6YAgEs2P`) |
| SMS | Twilio (stub — not needed for MVP demo) |
| Hosting | Vercel |
| Automation | OpenClaw cron (no n8n) |

---

## File Structure (Source of Truth)

```
the-driving-center-website/
├── CLAUDE.md              ← THIS FILE — how we work
├── STATUS.md             ← current state: what works, what's broken, what's next
├── SPEC_ONE_WEEK_SPRINT  ← active sprint spec
├── WORKFLOW_LOG.md       ← every build cycle logged
├── src/app/              ← all routes + pages
├── src/lib/
│   ├── supabase/
│   ├── migrations/       ← SQL (run in Supabase SQL Editor)
│   ├── email-templates/
│   └── security.ts
├── tests/e2e/           ← automated tests
└── SPEC_*.md            ← all specs (one active, rest archived)
```

**Delete these — redundant Legos that spilled:**
`BUILD_PLAN.md`, `PROGRESS.md`, `DISCOVERIES.md`, `PROJECT_CONSTITUTION.md`, `OPERATIONS_LOG.md`, `OPERATIONS_MANUAL.md`, `SPEC_WEBSITE_OVERHAUL.md`

---

## Design Tokens (Locked — Every Page Uses These)

| Token | Hex | Usage |
|---|---|---|
| bg | `#050505` | Page background |
| surface | `#0D0D0D` | Cards, panels |
| elevated | `#18181b` | Inputs, hover |
| border | `#1A1A1A` | Card borders |
| borderLt | `#27272a` | Hover borders |
| text | `#FFFFFF` | Primary text |
| secondary | `#94A3B8` | Secondary text |
| muted | `#52525b` | Placeholders |
| body | `#5C6370` | Body text |
| blue | `#006FFF` | Primary accent |
| cyan | `#38BDF8` | Secondary accent |
| purple | `#818CF8` | Gradient |
| green | `#10B981` | Success |
| amber | `#f59e0b` | Warnings |

**Buttons:**
- Primary: `background: #006FFF`, `border-radius: 12px`, `box-shadow: 0 4px 30px rgba(0,111,255,0.25)`
- Secondary: `background: #18181b`, `border: 1px solid #1A1A1A`, `border-radius: 12px`
- Hover: `transform: scale(1.02)`, `150ms ease`

**Typography:** Inter via `next/font/google`, H1 60-72px bold -0.02em tracking, body 16-18px 1.6 line-height

---

## Security Rules (Non-Negotiable)

Every API route must have:
- [ ] Auth check (`getUser()`)
- [ ] Ownership check (does this school own this data?)
- [ ] PII encrypted at write, stripped at read
- [ ] Input validation
- [ ] `school_id` in every WHERE clause

**Never:** skip ownership check, log PII, allow cross-tenant access, pass real keys to client.

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
