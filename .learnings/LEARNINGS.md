# Learnings — The Driving Center

Corrections, insights, and knowledge gaps captured during development.

**Categories:**
- `correction` — User had to correct a mistake
- `insight` — Discovered a better approach
- `knowledge_gap` — Something we didn't know and had to figure out
- `best_practice` — Pattern worth repeating

---

## How to Use

After each significant session:
1. Review this file
2. Look for patterns (entries with 2+ `See Also` links)
3. Promote high-value learnings to CLAUDE.md or as skills

After subagent runs:
1. Check if any new errors map to existing entries
2. Add new entries for failures that don't match existing patterns
3. Update this file, commit, push

---

## Template for New Entry

```markdown
## [Short Title] — [YYYY-MM-DD]

**Category:** correction | insight | knowledge_gap | best_practice
**Status:** new | recurring | resolved

**What happened:**
[What went wrong or what we learned]

**What fixed it / Key insight:**
[The solution or takeaway]

**See Also:** #n (link to related entries by number)
```

---

*Auto-managed. Commit after updates.*