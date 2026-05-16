# WORKFLOW_LOG.md — The Driving Center

**Format:** What we tried → What failed → What fixed it → Root cause
**Rule:** Append to this file at the end of every significant unit of work. Commit after each entry.
**Autonomy mode:** When spawned with `mode=autonomous`, work completely offline. Update this log as you go. Commit + push when done. Do not ask for clarification unless you hit a Blocker you cannot resolve.

---

## Entry Format

```markdown
## [Title] — [Date]

**Task:** [What was asked of me]

**What I did:**
- [Step taken]
- [Step taken]

**Result:** ✅ Passed / ❌ Failed / ⏳ In Progress

**If failed — What failed:**
[What broke]

**If failed — Root cause:**
[Why it broke]

**If failed — What I'd try next:**
[If this were continued]

**Completed:** [commit hash]

---
```

## Blocker Rules

A Blocker is:
- A missing env var with no fallback
- A schema column referenced but confirmed missing from actual DB
- A build error that cannot be resolved with available information

Not a Blocker:
- A design decision (make one, log it, move on)
- A TypeScript error (fix it, move on)
- A missing dependency (install it, move on)
- An unclear requirement (make a reasonable assumption, log it, move on)

If you hit a Blocker: stop, log what was tried, log the blocker, commit with `[blocked]` tag, include the specific question in the log entry.

---

## Autonomy Workflow

1. Read `SPEC.md` — understand what needs to be built
2. Read `ACTUAL_SCHEMA.md` — understand the DB as it actually is
3. Read `CLAUDE.md` — understand the workflow rules
4. **Read `AGENT_RUN_LOG.md` first** — know what has been tried before, what failed, why
5. Work from SPEC.md, do not deviate
6. After each significant step: append to `AGENT_RUN_LOG.md` (steps taken, results)
7. After task completion: append to `WORKFLOW_LOG.md` (full story: what was tried, what failed, what fixed it)
8. Run `npm run build` after every file change — must pass
9. If build fails: fix, rebuild, then continue
10. When task is complete: commit with descriptive message, push
11. If blocked: log attempt + blocker to AGENT_RUN_LOG, commit with `[blocked]`, stop

---

## AGENT_RUN_LOG.md — Companion File

Every subagent run logs to `AGENT_RUN_LOG.md` during execution. This is the working log:
- Timestamps for every step
- Model used
- Build results per file
- Failures with exact error text

`WORKFLOW_LOG.md` gets the final summary entry after completion.

Both files are committed. Both grow over time. Future agents read both.

---

## Model Selection Criteria

| Task Type | Preferred Model | Why |
|---|---|---|
| UI/CSS refactor, well-defined | DeepSeek V4 Flash | Fast, context handles full files |
| Complex API logic, multi-file | DeepSeek V4 Flash | Better at architecture reasoning |
| Quick fixes, one-liners | MiniMax M2.7 | Fast, no subagent overhead |
| Heavy debugging, failure recovery | DeepSeek V4 Flash | Better at tracing failures |
| Decisions, planning | MiniMax M2.7 | Better reasoning in main session |

---

*Last updated: 2026-05-16*