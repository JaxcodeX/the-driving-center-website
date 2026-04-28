# CLAUDE.md — The Driving Center SaaS
**Mode: Vibe Coding Protocol + FSO Workflow**
**Updated: 2026-04-27**

---

## Core Protocol

**Rule 1 — Always write SPEC.md first.**
Plans live in project files. Discord is for coordination only.

**Rule 2 — One-pass builds, no chat iteration.**
Give the AI the full context in one prompt: design system + reference components + complete spec. Ask for the whole section or page in one pass. If it takes more than 2-3 back-and-forth rounds to get it right, the approach is wrong — write a new SPEC and try again.

**Rule 3 — Log everything.** Every build cycle goes into WORKFLOW_LOG.md.

---

## Vibe Coding Protocol (How to Prompt)

The bottleneck is never AI capability — it's prompt context. Follow this pattern every time:

```
CONTEXT GIVEN TO AI EVERY TIME:
├── 1. Design system     → globals.css (copy full content)
├── 2. Reference example → 1-2 similar working components from the project
├── 3. Complete spec     → full SPEC.md for the feature
└── 4. Constraints       → tech stack version, patterns to follow

PROMPT STRUCTURE:
"Follow the patterns in [existing component]. Use the design tokens from globals.css.
Build [complete feature] matching SPEC.md. Do it in one pass — no partial commits."
```

**Never do this:**
- "Change the button color to blue" → "now make it rounded" → "now add a shadow"
- Iterating CSS via chat one property at a time
- Giving partial context and adding more in follow-up messages

**Always do this:**
- "Here is globals.css, here are 3 working glassmorphism components, here is the full SPEC. Build the entire redesigned landing page in one pass."

**The 50-line rule:** If a change requires more than ~50 lines of back-and-forth in a chat, stop and write a new SPEC.md instead. The SPEC is the work order, not the chat.

---

## Feature Build Sequence

Every feature follows this sequence:

```
Zax: "Build [feature]"
        ↓
Everest: Write SPEC.md (blueprint first, full context)
        ↓
Everest: Assemble context package (design tokens + reference components + spec)
        ↓
Everest: Spawn DeepSeek-Claude sub-agent with complete context package
        ↓
Sub-agent: reads context → builds complete feature in one pass → commits → pushes
        ↓
Everest: Verify build passes + report back
        ↓
Log result in WORKFLOW_LOG.md
```

**If there's no SPEC.md, there's no implementation.**

---

## Context Package Template

For every sub-agent task, include this in the prompt:

```
## Design System
[copy full content of globals.css]

## Reference Components (1-3 examples of similar working code)
[copy-paste working components from the project that demonstrate the pattern]

## Tech Stack
- Next.js 16 + React 19 + TailwindCSS 4
- Supabase auth + PostgreSQL + RLS
- API routes in src/app/api/

## SPEC.md
[paste complete spec]

## Task
[describe what to build — reference the SPEC above, do not re-explain]
```

---

## Who Does What

| Role | What |
|---|---|
| **Zax** | Directs, reviews output, approves or rejects |
| **Everest** | Writes specs, assembles context, spawns coding agents, reviews output |
| **DeepSeek-Claude** | Claude Code CLI routed through DeepSeek V4 Flash — one-pass build from context package |
| **Mark** | Reviews architecture decisions, not code implementation |

---

## Current Stack

| Role | Tool |
|---|---|
| Primary AI | MiniMax-M2.7 (daily driver, planning, review) |
| Code generation | DeepSeek V4 Flash (deepseek-v4-flash model) via `scripts/deepseek-claude` |
| Web app | Next.js 16 + React 19 + TailwindCSS 4 |
| Database | Supabase (PostgreSQL + RLS + Magic Links) |
| Payments | Stripe ($99/mo subscription, DEMO_MODE bypass for demo) |
| Email | Resend (live — `re_ZwCTERGk_8eesZtYHGkR32GPv6YAgEs2P`) |
| SMS | Twilio (stub — not needed for MVP) |
| Hosting | Vercel |
| Automation | OpenClaw cron |

---

## File Structure (Source of Truth)

```
the-driving-center-website/
├── CLAUDE.md              ← THIS FILE
├── STATUS.md              ← current state: works / broken / next
├── WORKFLOW_LOG.md        ← every build cycle logged
├── SPEC_FULL_REDESIGN.md ← active UI redesign spec
├── SPEC_LANDING_REDESIGN.md ← landing page spec (pending)
├── SPEC.md                ← phase specs (archived after use)
├── src/app/               ← all routes + pages
├── src/lib/
│   ├── supabase/          ← client + server helpers
│   ├── migrations/        ← SQL (run in Supabase SQL Editor)
│   ├── email-templates/   ← Resend email templates
│   └── security.ts        ← encryption, validation
└── tests/e2e/            ← automated tests
```

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

**Glassmorphism card:** `background: rgba(255,255,255,0.04)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.08)`, `border-radius: 16px`

**Primary button:** `background: #006FFF`, `border-radius: 999px`, `box-shadow: 0 4px 30px rgba(0,111,255,0.25)`

**Typography:** Inter via `next/font/google`, H1 60-72px bold -0.02em tracking, body 16-18px 1.6 line-height

---

## Security Rules (Non-Negotiable)

Every API route must have:
- [ ] Auth check (`getUser()`)
- [ ] Ownership check (does this school own this data?)
- [ ] `school_id` in every WHERE clause
- [ ] Input validation
- [ ] PII encrypted at write, stripped at read

**Never:** skip ownership check, log PII, allow cross-tenant access, pass real keys to client.

---

## WORKFLOW_LOG.md Format

```
## Cycle N — [Feature]
Date: YYYY-MM-DD
SPEC: [file name + link]
Context package: [what design tokens + reference components were given]
Implemented by: DeepSeek-Claude (scripts/deepseek-claude)
Result: passed / failed / partial
Build time: [approximate]
Failures: [what went wrong]
Next action: [what we do next]
```

---

## Current Sprint — Mark Martin Demo

| Day | Goal |
|---|---|
| 1 | Migrations, RLS test, subscription middleware |
| 2 | End-to-end flow test |
| 3 | UI polish — one-pass coding agent, consistent design tokens |
| 4 | CSV import + school profile editor |
| 5 | Demo script + 5 dry runs |
| 6 | Buffer — fix anything from dry runs |
| 7 | **DEMO TO MARK** |

**Migration 009 pending:** `src/lib/migrations/009_bookings_missing_columns.sql` — Zax runs in Supabase SQL Editor
