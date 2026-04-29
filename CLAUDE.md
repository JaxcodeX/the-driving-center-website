# CLAUDE.md — The Driving Center SaaS
**Mode: Vibe Coding Protocol + FSO Workflow**
**Updated: 2026-04-28**

---

## Critical — Frontend Design Skill (ALWAYS INVOKE FIRST)

**Before writing ANY frontend code, ALWAYS invoke the frontend-design skill.**

The `frontend-design` skill is installed at `.claude/skills/frontend-design/SKILL.md`.

In every session that involves UI:
```
Before writing code: Read .claude/skills/frontend-design/SKILL.md and follow it exactly.
```

The skill overrides generic AI aesthetics with premium, distinctive design. Do not skip this.

---

## Core Protocol

**Rule 1 — Always write SPEC.md first.**
Plans live in project files. Discord is for coordination only.

**Rule 2 — Invoke frontend-design skill first, then build.**
Read the skill → read SPEC.md → assemble context package → build. Not the other way around.

**Rule 3 — One-pass builds, no chat iteration.**
Give the AI full context: skill + design tokens + reference components + spec. Ask for the whole section in one pass. If it takes more than 2 rounds, stop and write a new SPEC.

**Rule 4 — Log everything.** Every cycle goes in WORKFLOW_LOG.md.

---

## Design Tokens (Current — Dark Theme Landing)

| Token | Hex | Usage |
|---|---|---|
| bg | `#0B0C0E` | Page background |
| surface | `#131316` | Card backgrounds |
| elevated | `#1C1D21` | Elevated surfaces |
| border | `rgba(255,255,255,0.07)` | Card borders |
| text-primary | `#FFFFFF` | Headlines |
| text-secondary | `#8A8F98` | Subheadings |
| text-muted | `#555660` | Captions |
| accent | `#3B82F6` | Interactive elements |

**Font:** Distinctive display + body pairing (NOT Inter/Roboto/Arial — see frontend-design SKILL for guidance)
**Display:** 52px / 800 weight / -0.025em tracking
**H2:** 36px / 700 / -0.02em
**Body:** 16-17px / 400 / #667085 / 1.6 line-height

---

## Screenshot Workflow

For every UI build, use this iteration loop:

1. Build the component/page
2. Take a screenshot of what was built
3. Compare to reference screenshot
4. Fix the specific mismatches
5. Repeat until satisfied

```bash
# Puppeteer screenshot setup (run once in project)
npx @anthropic-ai/puppeteer-screenshot
```

---

## Feature Build Sequence

```
Zax: "Build [feature]"
        ↓
Everest: Write SPEC.md
        ↓
Everest: Read .claude/skills/frontend-design/SKILL.md
        ↓
Everest: Assemble context package (skill + tokens + reference + spec)
        ↓
Everest: Build directly OR spawn OpenCode sub-agent with context package
        ↓
Sub-agent (if spawned): reads skill → reads context → builds → screenshots → compares → fixes
        ↓
Everest: Verify build passes + screenshot comparison
        ↓
Log result in WORKFLOW_LOG.md
```

### Spawning OpenCode (when used as sub-agent)

```bash
cd ~/Projects/the-driving-center-website
opencode agent --provider deepseek --model deepseek-v4-flash --cwd ~/Projects/the-driving-center-website
```

OpenCode runs in PTY mode — interactive terminal required. Pass the full context package as a prompt file or heredoc.

---

## Stack

| Layer | Tool |
|---|---|
| AI (planning + code) | MiniMax-M2.7 (Everest) + OpenCode (sub-agent, when used) |
| Web | Next.js 16 + React 19 + TailwindCSS 4 |
| Database | Supabase (PostgreSQL + RLS + Magic Links) |
| Payments | Stripe (DEMO_MODE bypass for demo) |
| Email | Resend |
| Hosting | Vercel |

---

## File Structure

```
the-driving-center-website/
├── CLAUDE.md              ← this file (workflow source of truth)
├── STATUS.md              ← project state (updated 2026-04-28)
├── WORKFLOW_LOG.md        ← build cycle history
├── SPEC_FULL_REDESIGN.md  ← active redesign spec
├── SPEC.md                ← phase specs (archived)
├── brand_assets/          ← logo, brand guidelines
├── .claude/skills/
│   └── frontend-design/
│       └── SKILL.md       ← Frontend Design Skill (ALWAYS READ FIRST)
├── src/app/               ← all routes + pages
└── src/lib/
    ├── supabase/          ← client + server helpers
    ├── migrations/        ← SQL migrations
    ├── email-templates/   ← Resend templates
    └── security.ts        ← encryption, validation
```

---

## Security Rules (Non-Negotiable)

Every API route: auth check + ownership check + `school_id` in WHERE + input validation.

**school_id always comes from `user.user_metadata.school_id` or middleware headers — never from client-supplied headers alone.**

---

## Current State

- RLS: PASS (tested 2026-04-28)
- `POST /api/students` auth: FIXED (derives from session, not client header)
- Migration 009: APPLIED (columns already exist in DB)
- OpenCode: installed at `/usr/local/bin/opencode` v1.14.29, not yet wired into workflow