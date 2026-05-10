# Mission Control — Alex Finn Kanban Redesign SPEC

## Context

Rebuild Mission Control (`/mission-control`) to match Alex Finn's operational dashboard aesthetic. Full Kanban board with pixel-art office. Lives in the existing TDC Next.js app at `~/Projects/the-driving-center-website/`.

---

## Design Language

**Reference:** Alex Finn's Mission Control (Twitter/X thread screenshots)

### Colors
| Role | Hex |
|---|---|
| Background | `#0F0F0F` |
| Card surface | `#1A1A1A` |
| Card border | `rgba(255,255,255,0.06)` |
| Text primary | `#FFFFFF` |
| Text secondary | `#94A3B8` |
| Text muted | `#64748B` |

**Status accent colors:**
- Recurring: Purple (`#818CF8`)
- Backlog: Red/Maroon (`#EF4444`)
- In Progress: Royal Blue (`#006FFF`)
- Review: Amber (`#F59E0B`)
- Done: Emerald (`#10B981`)

**Primary action:** `#006FFF` (blue)

### Typography
- Font: Inter (loaded via next/font in TDC)
- Card titles: 14px, font-medium, white
- Descriptions: 13px, muted grey, line-clamp-2
- Meta/timestamps: 11px, very small grey
- Column headers: 13px, semi-bold, with status dot

### Visual Effects
- Cards: `#1A1A1A` surface, `border-radius: 12px`, very thin `rgba(255,255,255,0.06)` border
- No shadows — depth via layered dark grey shades
- Hover: subtle border brightening
- Flat Design 2.0 aesthetic

---

## Layout Structure

### Sidebar (left, fixed 200px)
Vertical nav rail. Items: Tasks, Calendar, Projects, Memory, Docs, Office, Team.

Active state: grey background pill behind icon+label.

Bottom-left: small "N" or Everest icon.

### Header (top bar)
**Top row:** KPI pills — "N This week" · "N In progress" · "N Total" · "N% Completion"

**Bottom row:** "+ New task" button (blue) · User filter pills (Cayden, Everest, Codex) · "All projects" dropdown

### Main: Two Views

---

## View 1: Tasks (Kanban)

### Columns
**Recurring | Backlog | In Progress | Review | Done**

Each column:
- Color-coded status dot in header
- Column title + count + "+" icon (add task to that column)
- Scrollable card list
- Card max-height with overflow scroll

### Task Card Anatomy
```
[status dot] [title — bold white 14px]
[description — muted 13px, 2-line clamp]
[project badge pill] [timestamp — small muted]
[assignee avatar circle — initials in colored circle]
```

**Assignee avatars (Q4 answer needed):**
- Cayden: "C" in green (`#10B981`)
- Everest: "E" in blue (`#006FFF`)
- Codex: "X" in purple (`#818CF8`)
- Subagents: "S" in orange (`#F59E0B`)

### Filters
- User filter: Cayden | Everest | Codex | All
- Project filter: All Projects dropdown (SaaS, FSO, Personal, Admin, OpenClaw)

### "+ New task" modal
- Title input
- Description textarea
- Project dropdown
- Assignee dropdown (Cayden / Everest / Codex / Subagent)
- Status: defaults to Backlog
- Submit creates task + logs to activity

---

## View 2: Office (Pixel Art)

### Layout
- Left 2/3: Office floor plan (pixel art style)
- Right 1/3: Live Activity panel

### Office Floor
Pixel-art office with stations for each agent:

| Station | Agent | Color |
|---|---|---|
| Desk 1 | Cayden (You) | Green `#10B981` |
| Desk 2 | Everest | Blue `#006FFF` |
| Desk 3 | Codex | Purple `#818CF8` |
| Desk 4 | Subagent | Orange `#F59E0B` |
| Conference table | Build Council (periodic sync) | — |
| Server rack | OpenClaw / System | Grey |

Each pixel avatar shows:
- Agent initial in colored pixel square
- Agent name below
- Online status dot (green = active in last 5min)
- "Build Council" group badge above certain avatars

### Live Activity Panel (right sidebar)
- Header: "Live Activity"
- Heartbeat/pulse icon
- Event feed — last N events
- "No recent activity" empty state

### Office Controls
- "+ Start Chat" button at top-left of office area

---

## Navigation
Sidebar items → which views:
- Tasks → Kanban board (View 1)
- Calendar → (save for later)
- Projects → (save for later)
- Memory → (save for later)
- Docs → (save for later)
- Office → Pixel office view (View 2)
- Team → (save for later)

For now, build Tasks + Office. Others as future phases.

---

## Data Model (already exists)
`mc_tasks` — id, title, project, assigned_to, status, last_activity, created_at, updated_at

New field needed:
- `description` text (add via migration or patch)

---

## API Routes — What Exists vs New

**Existing:**
- `GET/POST /api/mc/tasks`
- `PATCH /api/mc/tasks/[id]`
- `GET/POST /api/mc/events`
- `GET/POST /api/mc/activity`

**Needed:**
- `GET /api/mc/tasks?status=backlog&assigned_to=me` (status filter already works via Supabase)
- PATCH update accepts `description` now

---

## Implementation Order

1. Write SPEC.md (this file) ← done
2. Write `SPEC_TASK_KANBAN.md` — detailed task card + column specs
3. Write `SPEC_OFFICE_PIXEL.md` — pixel art office specs
4. Build Tasks Kanban view
5. Build Office pixel view
6. Wire sidebar navigation between views
7. Add "+ New task" modal
8. Test + commit + deploy
9. Update tunnel URL

---

## Stack
- Next.js 16 + React 19 + TypeScript
- TailwindCSS 4 (already in TDC)
- Supabase (mc_tasks, mc_activity_log already exist)
- Inter font (already loaded)
