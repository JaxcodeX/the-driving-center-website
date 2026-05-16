## LEARNINGS.md — Project Blind Spots & Productivity Gaps

**Captured:** 2026-05-16 — Full audit of 275 commits, WORKFLOW_LOG.md, AGENT_RUN_LOG.md, ERRORS.md

---

## L001 — Design Rewrites Wasted The Most Time — 2026-05-16

**Category:** best_practice
**Status:** resolved

**What happened:**
Across 275 commits, the single biggest time sink was design. Login page was redesigned 3-4 times. Landing page redesigned 5+ times. Mobile responsiveness revisited 6+ times. Each redesign = 3-10 commits. Total wasted: ~60-80% of all commit output.

**Key evidence:**
- `fix: mobile design improvements` — 4 separate commits
- `login: premium glassmorphism redesign` + `login: split-screen redesign` — 2 full redesigns in 1 week
- `feat: landing page rebuild — blueprint architecture` → then immediately `fix: landing page hero` → then `fix: complete landing page rebuild` → then `fix: landing page rebuild with real screenshot design tokens` → then `feat: landing page golden screen rebuild` → then `fix: landing page — light mode default` → then `fix: complete landing page rebuild — remove all AI-slop patterns`
- 7 full redesigns of the landing page in 3 weeks. Each one replaced the last.

**What fixed it:**
CLAUDE.md Rule 5 + vibe coding protocol: full context package before building. But this was applied TOO LATE — after already wasting 3 weeks.

**Prevention:**
Design decisions must be locked BEFORE subagent spawns. One-pass builds, no iteration. If redesigning more than once, the first spec was wrong.

**See Also:** L002 (no pre-build design review), L003 (no mobile-first rules)

---

## L002 — Schema Drift Cost 4+ Cycles — 2026-05-16

**Category:** knowledge_gap
**Status:** resolved

**What happened:**
Code was written based on design assumptions. `sessions.start_time` doesn't exist (sessions has `start_date` only). `schools.monthly_revenue` doesn't exist. `bookings.deposit_paid_at` doesn't exist. `sessions.cancelled` doesn't exist (has `status` TEXT instead). Each false assumption required a full fix cycle.

**Root cause:** Code written before DB inspection. Every cycle that touched a new table repeated the same mistake.

**Evidence in WORKFLOW_LOG:**
- Cycle 1: auth identity mismatch (school ownership not linked)
- Cycle 3: encrypted PII not decrypted at read time
- Cycle 7: 6 schema columns don't exist — full rebuild of bookings, sessions, schools APIs
- Cycle 12: RLS + `start_time` + `monthly_revenue` all missing

**Prevention:**
Read ACTUAL_SCHEMA.md BEFORE any API route that touches a new table. If table isn't in ACTUAL_SCHEMA.md, inspect it first.

**See Also:** E001, E006, E003 (inline duplications caused by schema changes)

---

## L003 — Mobile Was An Afterthought — 2026-05-16

**Category:** best_practice
**Status:** resolved

**What happened:**
6 commits dedicated to mobile responsiveness: padding fixes, font scaling, tap targets, off-canvas sidebar. Each one introduced new inconsistencies. The desktop worked; mobile was bolted on.

**Prevention:**
Design system must specify mobile-first breakpoints, tap target sizes (44px minimum), font scales per breakpoint, and padding scale. No mobile work without these specified.

**See Also:** L001

---

## L004 — Auth Took 6 Cycles Because Two Identity Systems Were Never Reconciled — 2026-05-16

**Category:** correction
**Status:** resolved

**What happened:**
Auth callback wrote `user_metadata.school_id` but admin dashboard read `schools.owner_email`. Two separate identity systems running in parallel. Every auth check had to walk both paths. Fixing one broke the other.

**Cycles:** 1, 4, 7, 11, 12, 13 (Cycles 11-14 specifically addressed auth gaps)

**Prevention:**
Auth identity (auth.users) and business identity (schools table) must be linked at signup and never allowed to drift. Single identity of record.

**See Also:** E004

---

## L005 — Vibe Coding Protocol Was Written But Never Followed — 2026-05-16

**Category:** correction
**Status:** resolved

**What happened:**
CLAUDE.md was rewritten in Cycle 9 to include the Vibe Coding Protocol (50-line rule, full context package, one-pass builds). Within 48 hours, there were 6 more mobile fix commits and a landing page redesign that violated every rule in the protocol.

**Root cause:** No enforcement mechanism. The protocol existed on paper. Subagents and main session both ignored it.

**Prevention:**
Self-improvement loop (Rule 5) now flags violations. Every time we iterate on a CSS change more than once, that's a flag.

**See Also:** L001

---

## L006 — Booking Flow Blocked For A Month — 2026-05-16

**Category:** knowledge_gap
**Status:** pending

**What happened:**
F001 (date vs time decision) was marked as "pending" in FEATURE_REQUESTS.md. Mark Martin asked for it. Every session circled back to it. It was never decided. The booking page still shows available slots but the flow can't progress without the decision.

**Prevention:**
Decisions that block progress must be resolved before building. "Pending" is not a state to leave features in — it's a queue for decisions that need to happen NOW.

**See Also:** F001

---

## L007 — Frontend-Design Skill Exists But Was Never Used — 2026-05-16

**Category:** knowledge_gap
**Status:** resolved

**What happened:**
CLAUDE.md explicitly says: "ALWAYS read `.claude/skills/frontend-design/SKILL.md` before writing any UI code." Yet across 40+ commits of CSS work, not a single one shows the skill being loaded. 40+ CSS commits were done with generic prompting, not the skill.

**Prevention:**
Frontend-design SKILL.md is now mandatory for UI work. Subagent bootstrap (TDC_BOOTSTRAP.md) updated to include it as a required read.

**See Also:** L001, L003

---

## L008 — Commit Frequency vs Value — 2026-05-16

**Category:** insight
**Status:** new

**What happened:**
275 commits in 3.5 weeks. But 40 commits on 2026-04-26 alone. Most value came in week 1 (build to demo). Most commits in weeks 2-3 were refinements, redesigns, and fixes for things that shouldn't have been built wrong the first time.

**Breakdown:**
- Week 1 (Apr 22-28): ~140 commits — core product built
- Week 2 (Apr 29 - May 5): ~90 commits — redesigns, fixes, mobile
- Week 3 (May 6-16): ~45 commits — CSS refactor, self-improvement loop

**Lesson:**
More commits doesn't mean more progress. The goal is working software, not commit count. Spending 3 weeks on design iterations instead of shipping features is the opposite of productivity.

**See Also:** L001, L005

---

## L009 — Self-Improvement Loop Captures But Doesn't Prevent — 2026-05-16

**Category:** insight
**Status:** recurring

**What happened:**
`.learnings/ERRORS.md` has 5 resolved error patterns (E001-E005). But they were only resolved after being hit multiple times. E001 (schema drift) appears in Cycle 1, Cycle 7, AND Cycle 12 — same root cause, three times before being logged as a pattern.

**Root cause:** The self-improvement loop captures failures but doesn't prevent the agent from repeating them. The agent hits E001, logs it, then the next agent makes the same mistake because the enforcement (CLAUDE.md Rule 5) wasn't being followed.

**What needs to change:**
The loop needs a PREVENT layer, not just a CAPTURE layer. Errors in `.learnings/ERRORS.md` must be checked by subagents BEFORE they touch code. TDC_BOOTSTRAP.md now enforces this.

**Prevention enforcement:**
Subagents must read `.learnings/ERRORS.md` as step 2 (after AGENT_RUN_LOG.md, before SPEC.md). If an error pattern exists for what they're about to do, they see it first.

**See Also:** E001, E002, E003, E004, E006

---

## L010 — `as any` Casts Throughout Codebase = TypeScript Is Decorative — 2026-05-16

**Category:** knowledge_gap
**Status:** new

**What happened:**
STATUS.md notes: "`as any` casts throughout routes — TypeScript types are decorative." The codebase uses TypeScript for type hints but bypasses it constantly with `as any`. This means type errors slip through to runtime.

**Prevention:**
"Must fix, not suppress" — if TypeScript errors, fix the code not the type. `as any` requires a comment explaining why it's necessary.

**See Also:** Cycle 7 (schema mismatches caused type confusion)

---

*Auto-managed. Commit after updates. Recurring patterns promote to CLAUDE.md.*