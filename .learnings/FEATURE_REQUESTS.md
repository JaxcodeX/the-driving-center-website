# Feature Requests — The Driving Center

Capabilities requested by the user or identified as missing during development.

---

## How to Use

1. Review before building new features
2. Check if a requested feature already exists or is in progress
3. Mark as `implemented` when done, add link to commit/branch

---

## Template for New Entry

```markdown
## [Feature Name] — [YYYY-MM-DD]

**Requested By:** [who asked]
**Status:** pending | in_progress | implemented | rejected

**Description:**
[What the feature should do]

**Use Case:**
[Why it's needed]

**Technical Notes:**
[Any implementation thoughts]

**See Also:** #[n] (related entries)
```

---

## Feature Queue

### F001 — Booking Flow: Date-only vs Time-specific
**Status:** pending
**Requested By:** Mark Martin

**Description:** The booking flow needs to decide whether students pick a date first then a time slot, or pick from pre-defined date+time+instructor cards.

**Blocker:** Decision needed from Cayden. Currently on hold.

---

### F002 — CSV Import Enhancement
**Status:** implemented (Phase 1)

**Description:** Browser-side preview, row-by-row progress, dedup by DOB.

**Implementation:** `school-admin/import` page with file upload + text paste.

---

### F003 — Instructor Availability UI
**Status:** pending (priority: low)

**Description:** Visual calendar for instructors to set their available hours.

**Technical Notes:** Needs `instructor_availability` table integration.

---

*Auto-managed. Commit after updates.*