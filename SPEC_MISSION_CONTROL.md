# Mission Control — SPEC.md

## What Is This

A personal Mission Control dashboard for Cayden's OpenClaw setup. Built as a page within The Driving Center SaaS project (same stack: NextJS 16 + React 19 + Supabase + TailwindCSS 4).

**Stack:** NextJS 16, React 19, TailwindCSS 4, Supabase
**Location:** `/mission-control`
**Data connection:** OpenClaw writes to Supabase → React reads real-time

---

## The 4 Core Screens

### 1. Tasks Board
- Columns: "Assigned to Me" | "Assigned to Everest / Subagents"
- Each task shows: title, project tag, status (todo/in-progress/done), last updated
- Real data from Supabase tasks table
- OpenClaw writes new tasks to Supabase via webhook or direct API call
- Tags: `saas`, `fso`, `personal`, `admin`

### 2. Memory Viewer
- Lists all files from `~/Documents/Openclaw Zaxpointx/memory/` and `~/Documents/Openclaw Zaxpointx/MEMORY.md`
- Shows: filename, date modified, content preview (first 200 chars)
- Global search bar — searches across all memory files
- Files read directly from OpenClaw's memory store via sessions API

### 3. Calendar
- Shows: Cayden's work window (5PM-9PM ET daily, recurring)
- Shows: all cron job schedules from OpenClaw (tdc-reminders, daily-briefing, etc.)
- Shows: upcoming scheduled tasks from Supabase
- Calendar grid view (weekly/monthly toggle)

### 4. Agent Status
- Shows all active subagents
- For each: agent name, current task, start time, runtime, status
- Data from OpenClaw sessions API

---

## Data Model (Supabase)

### tasks table
```sql
id uuid primary key
title text
project text (saas|fso|personal|admin)
assigned_to text (me|everest|subagent)
status text (todo|in_progress|done)
created_at timestamptz
updated_at timestamptz
last_activity text
```

### memory_index table
```sql
id uuid primary key
filename text
path text
content_preview text
modified_at timestamptz
```

### calendar_events table
```sql
id uuid primary key
title text
start_time timestamptz
end_time timestamptz
type text (work_window|cron|scheduled)
source text (openclaw|manual)
recurring boolean
```

---

## How OpenClaw Connects

OpenClaw writes to Supabase via:
1. **Cron trigger** — writes task updates after each session
2. **Webhook** — Supabase webhook receives task updates from OpenClaw
3. **Direct write** — I (Everest) can call Supabase REST API directly

Dashboard reads via: Supabase client (same as Driving Center app)

---

## OpenClaw Session Summary (for Agent Status)

Everest reads from `~/.openclaw/agents/main/sessions/sessions.json` or uses OpenClaw's sessions list API to get active agent info.

---

## Design

- Dark theme matching The Driving Center SaaS brand
- bg: #050505, surface: #0D0D0D, elevated: #18181b, border: #1A1A1A
- primary: #006FFF
- Consistent with existing design tokens in SPEC.md
- Clean, functional first. No decorative gradients.
- Minimum rounded-2xl on cards

---

## Build Order

1. Set up Supabase schema (tasks, memory_index, calendar_events)
2. Build Tasks Board page (me vs Everest columns)
3. Add Memory Viewer with global search
4. Add Calendar view with work windows + cron events
5. Add Agent Status (reads from OpenClaw sessions)
6. Hook up OpenClaw → Supabase writes

## Status

[x] SPEC.md written
[x] Supabase schema created (mc_tasks, mc_memory_index, mc_calendar_events)
[x] Initial page built (React Server Components)
[ ] SQL migration needs to be run in Supabase
[ ] Tasks Board connected to real Supabase data
[ ] Memory Viewer built
[ ] Calendar view built
[ ] Agent Status (live from OpenClaw sessions API)
[ ] OpenClaw → Supabase write hook
