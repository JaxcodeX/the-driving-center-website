# CLAUDE.md — The Driving Center SaaS
**Mode: Vibe Coding Protocol + FSO Workflow + Frontend Design Skill**
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

## Design Tokens (Current — Light Theme)

| Token | Hex | Usage |
|---|---|---|
| bg-base | `#F2F4F7` | Page background (warm gray) |
| bg-surface | `#FFFFFF` | Card backgrounds |
| bg-dark | `#0A0A0A` | Dark sections |
| text-primary | `#101828` | Headlines, important text |
| text-secondary | `#344054` | Card titles, labels |
| text-muted | `#667085` | Body, secondary text |
| text-faint | `#9A9FA5` | Placeholders, captions |
| border | `#E4E7EC` | Card borders, dividers |
| accent-blue | `#2E90FA` | Charts, interactive |
| success | `#12B76A` | Positive metrics |
| error | `#F04438` | Negative metrics |
| card-radius | `24px` | Cards, panels |
| btn-radius | `12px` | Buttons, inputs |
| shadow | `0px 4px 6px -2px rgba(16,24,40,0.03), 0px 12px 16px -4px rgba(16,24,40,0.08)` | Card shadow (two-layer) |

**Font:** Inter via `next/font/google`
**Display:** 52px / 800 weight / -0.025em tracking
**H2:** 36px / 700 / -0.02em
**Body:** 16-17px / 400 / #667085 / 1.6 line-height

---

## Screenshot Workflow (Nate Herk Protocol)

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

After every build, check: does this match the reference? If not, what's different? Fix that specific thing.

---

## Vibe Coding Context Package Template

For every sub-agent task:

```
CONTEXT GIVEN TO AI EVERY TIME:
├── 1. Frontend Design Skill  → .claude/skills/frontend-design/SKILL.md
├── 2. Design tokens          → from CLAUDE.md (above)
├── 3. Reference example       → 1-2 similar working components from src/
├── 4. Complete spec           → full SPEC.md for the feature
└── 5. Constraints            → Next.js 16, React 19, TailwindCSS 4

PROMPT STRUCTURE:
"Invoke the frontend-design skill. Follow the design tokens in CLAUDE.md.
Use [existing component] as reference. Build [feature] matching SPEC.md.
Take screenshots of the output and compare to [reference screenshot].
Fix any deviations. One-pass build — no partial commits."
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
Everest: Spawn DeepSeek-Claude with complete context package
        ↓
Sub-agent: reads skill → reads context → builds → screenshots → compares → fixes
        ↓
Everest: Verify build passes + screenshot comparison
        ↓
Log result in WORKFLOW_LOG.md
```

---

## Stack

| Layer | Tool |
|---|---|
| AI (planning) | MiniMax-M2.7 |
| AI (code) | DeepSeek V4 Flash via `scripts/deepseek-claude` |
| Web | Next.js 16 + React 19 + TailwindCSS 4 |
| Database | Supabase (PostgreSQL + RLS + Magic Links) |
| Payments | Stripe (DEMO_MODE bypass for demo) |
| Email | Resend |
| Hosting | Vercel |

---

## File Structure

```
the-driving-center-website/
├── CLAUDE.md
├── STATUS.md
├── WORKFLOW_LOG.md
├── SPEC*.md
├── brand_assets/            ← logo, brand guidelines (reference these!)
├── .claude/skills/
│   └── frontend-design/
│       └── SKILL.md         ← Frontend Design Skill (ALWAYS READ FIRST)
├── src/app/
│   ├── page.tsx             ← Landing page
│   ├── globals.css
│   └── ...
└── src/lib/migrations/       ← SQL (run in Supabase SQL Editor)
```

---

## Security Rules (Non-Negotiable)

Every API route: auth check + ownership check + `school_id` in WHERE + input validation.

---

## Migration 009 Pending

`src/lib/migrations/009_bookings_missing_columns.sql` — Zax runs in Supabase SQL Editor.
