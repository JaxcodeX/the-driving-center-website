# AGENT_RUN_LOG.md — The Driving Center

**Purpose:** Complete history of every autonomous agent run — what was attempted, what model was used, what failed, what succeeded, how long it took.
**Rule:** Every subagent spawn appends to this file. Every failure is logged with root cause. Every success is logged with proof.

---

## How It Works

When a subagent runs autonomously:
1. Subagent starts → appends "Run started" entry with timestamp + model + task
2. Subagent logs each significant step
3. On completion → appends final entry with result + commit hash
4. If blocked → logs what was tried + the blocker + what would be done next

Future agents read this file to know:
- What has been tried before
- What failed and why
- What approach worked
- How long different types of tasks take

---

## Entry Structure

```markdown
## [Task Name] — Model: [model] — Started: [YYYY-MM-DD HH:MM]

**Task:** [what the agent was asked to do]

**Context package:**
- Read: [files read at start]
- Working from: [SPEC version]

**Steps:**
1. [step] — [result]
2. [step] — [result]

**Build:** [pass/fail] — [error count]

**Result:** ✅ Passed / ❌ Failed / 🚫 Blocked
- Commit: [hash or "none"]
- Duration: [how long]

**If failed:**
- What failed: [exact failure]
- Root cause: [why it broke]
- What was tried: [approaches that didn't work]

**If blocked:**
- Blocker: [exact blocker]
- Question for Mark/Everest: [what needs decision]

---
```

---

## Model Selection Criteria

| Task Type | Preferred Model | Why |
|---|---|---|
| UI/CSS refactor, well-defined | DeepSeek V4 Flash | Fast, context window handles full file |
| Complex API logic, multi-file | DeepSeek V4 Flash | Better at architecture reasoning |
| Quick fixes, one-liners | MiniMax M2.7 | Fast, no subagent overhead |
| Heavy debugging, failure recovery | DeepSeek V4 Flash | Better at tracing through failures |
| Research, analysis | DeepSeek V4 Flash | Larger context for synthesis |
| Decisions, planning | MiniMax M2.7 | Better reasoning in main session |

---

## Phase 5 CSS Refactor (signup) — Model: deepseek/deepseek-v4-flash — Started: 2026-05-16 14:01

**Task:** Replace all hardcoded hex/rgba colors in style={} props in signup/page.tsx with CSS variables from globals.css

**Context package:**
- Read: AGENT_RUN_LOG.md, workspace ERRORS.md/LEARNINGS.md, project ERRORS.md, SPEC.md, globals.css, frontend-design-pro SKILL.md
- Working from: SPEC.md design tokens section

**Steps:**
1. Read all context files — done
2. Replaced #0D0D12 → var(--bg-surface) — done
3. Replaced rgba(74,222,128,0.06) → color-mix(in srgb, var(--success), transparent 94%) — done
4. Replaced rgba(0,0,0,0.5) shadow → color-mix(in srgb, var(--bg-base), transparent 50%) — done
5. Replaced rgba(255,255,255,0.03) → color-mix(in srgb, var(--text-primary), transparent 97%) — done
6. Replaced rgba(255,255,255,0.06) → var(--border) where exact match — done
7. Replaced #FFFFFF → var(--text-primary) across all style props — done
8. Replaced #9CA3AF → var(--text-secondary) — done
9. Replaced #4ADE80 → var(--success) — done
10. Replaced #EF4444 → var(--danger) — done
11. Replaced #0D0D0D → var(--bg-elevated) for input backgrounds — done
12. Replaced rgba(255,255,255,0.1) → color-mix(in srgb, var(--text-primary), transparent 90%) — done
13. Replaced rgba(255,255,255,0.3) → color-mix(in srgb, var(--text-primary), transparent 70%) — done
14. Replaced #4179E8 / #1E5BD6 gradient → var(--accent) — done
15. Replaced rgba(255,255,255,0.15/0.2/0.25) → color-mix variants — done
16. Replaced rgba(239,68,68,0.1/0.2) → color-mix(in srgb, var(--danger), transparent 90%/80%) — done
17. Replaced rgba(74,222,128,0.35) → color-mix(in srgb, var(--success), transparent 65%) — done
18. Replaced rgba(255,255,255,0.04) → var(--glass-bg) — done
19. Replaced rgba(255,255,255,0.08) → var(--glass-border) — done
20. Replaced onMouseEnter/onMouseLeave inline JS colors — done

**Build:** ✅ Pass — 0 errors

**Result:** ✅ Passed
- Commit: pending
- Duration: ~5 min

**Changes:** ~55 insertions, ~55 deletions in signup/page.tsx — all hardcoded colors replaced with CSS variables/color-mix

---

## Phase 5 CSS Refactor (login) — Model: deepseek/deepseek-v4-flash — Started: 2026-05-16 13:59

**Task:** Replace all hardcoded hex/rgba colors in style={} props in login/page.tsx with CSS variables from globals.css

**Context package:**
- Read: AGENT_RUN_LOG.md, workspace ERRORS.md/LEARNINGS.md, project ERRORS.md, SPEC.md, globals.css, SKILL.md
- Working from: SPEC.md design tokens section

**Steps:**
1. Read all context files — done
2. Replaced #FFFFFF → var(--text-primary) across all style props — done
3. Replaced #9CA3AF → var(--text-secondary) — done
4. Replaced #4ADE80 → var(--success) — done
5. Replaced #EF4444 → var(--danger) — done
6. Replaced rgba(74,222,128,0.10) → color-mix(in srgb, var(--success), transparent 90%) — done
7. Replaced rgba(74,222,128,0.25) → color-mix(in srgb, var(--success), transparent 75%) — done
8. Replaced rgba(74,222,128,0.20) → color-mix(in srgb, var(--success), transparent 80%) — done
9. Replaced rgba(255,255,255,0.06) → var(--border) in style props — done
10. Replaced rgba(255,255,255,0.05) → color-mix(in srgb, var(--text-primary), transparent 95%) — done
11. Replaced rgba(255,255,255,0.10) → color-mix(in srgb, var(--text-primary), transparent 90%) — done
12. Replaced rgba(255,255,255,0.03) → color-mix(in srgb, var(--text-primary), transparent 97%) — done
13. Replaced rgba(255,255,255,0.15) → color-mix(in srgb, var(--text-primary), transparent 85%) — done
14. Replaced rgba(0,0,0,0.1) shadow → color-mix(in srgb, var(--bg-base), transparent 90%) — done
15. Replaced onMouseEnter/onMouseLeave inline JS colors — done

**Build:** ✅ Pass — 0 errors

**Result:** ✅ Passed
- Commit: `3d9b181`
- Duration: ~5 min

**Changes:** 48 insertions, 47 deletions in login/page.tsx — all hardcoded colors replaced with CSS variables/color-mix

---

## Failure History (Newest First)

[Append new entries at top — keep newest first for quick context]

---

## Phase 5 CSS Refactor — Model: deepseek/deepseek-v4-flash — Started: 2026-05-16 11:15

**Task:** Replace all hardcoded hex/rgba colors in style={} props in school-admin/page.tsx with CSS variables from globals.css

**Context package:**
- Read: WORKFLOW_LOG_HEADER.md, AGENT_RUN_LOG.md, SPEC.md, ACTUAL_SCHEMA.md, CLAUDE.md, globals.css
- Working from: SPEC.md design tokens section

**Steps:**
1. Read all context files and design tokens — done
2. Replaced constants block (BG, GRADIENT, GLASS_*, TEXT_*, ACCENT_*, CARD_SHADOW*) with CSS var()/color-mix() equivalents — done
3. Replaced kpiCards accentBg values — done
4. Replaced '#FFFFFF' → var(--admin-text) across all style props — done
5. Replaced '#6B7280' → var(--admin-text-muted) — done
6. Replaced '#9CA3AF' → var(--admin-text-secondary) — done
7. Replaced '#000' → var(--admin-bg) — done
8. Replaced '#13161F' → var(--admin-elevated) — done
9. Replaced '#FBBF24' → var(--warning) — done
10. Replaced statusConfig dot colors with CSS variables (--status-blue, --admin-accent, --warning, --status-cancelled) — done
11. Replaced rgba(74,222,128,*) → color-mix(in srgb, var(--admin-accent), *) in style props — done
12. Replaced rgba(255,140,66,*) → color-mix(in srgb, var(--accent-secondary), *) in style props — done
13. Replaced rgba(103,232,249,*) → color-mix(in srgb, var(--status-blue), *) in style props — done
14. Replaced rgba(167,139,250,*) → color-mix(in srgb, var(--status-purple), *) in style props — done
15. Replaced rgba(255,255,255,0.06) → var(--admin-border) in style props — done
16. Replaced rgba(255,255,255,0.04) → var(--glass-bg) in style props — done
17. Replaced rgba(255,255,255,0.08) → var(--glass-border) in style props — done
18. Replaced rgba(255,255,255,0.05) borders → var(--admin-border) in style props — done
19. Replaced rgba(255,255,255,0.1) → var(--border-hover) in style props — done

**Build:** ✅ Pass — 0 errors

**Result:** ✅ Passed
- Commit: pending
- Duration: ~15 min

**Changes:** 66 insertions, 66 deletions in school-admin/page.tsx — all hardcoded colors replaced with CSS variables

## [Self-Improvement Loop Verification] — Model: deepseek/deepseek-v4-flash — Started: 2026-05-16 11:48

**Task:** Create `/api/test-error` endpoint that queries a non-existent column, catches the error, fixes it, and logs to .learnings/ERRORS.md

**Steps:**
1. Read all context files — done
2. Created `/api/test-error/route.ts` — deliberately queries `nonexistent_test_column` from schools table — done
3. `npm run build` — passed with 0 errors — done
4. Hit the endpoint in production mode — captured exact error — done
5. Fixed query to use `owner_email` — verified fix works (5 schools returned) — done
6. Logged error to `.learnings/ERRORS.md` as E006 — done

**Build:** ✅ Pass — 0 errors

**Result:** ✅ Passed
- Commit: pending
- Duration: ~10 min

**Error captured:** `column schools.nonexistent_test_column does not exist` (PostgreSQL code 42703)
**Fix:** Replaced with `owner_email` — returned 5 schools

---

*Last updated: 2026-05-16*