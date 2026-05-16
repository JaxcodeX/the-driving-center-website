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

## Failure History (Newest First)

[Append new entries at top — keep newest first for quick context]

---

*Last updated: 2026-05-16*