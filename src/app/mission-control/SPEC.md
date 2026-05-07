# Mission Control — Operational Dashboard SPEC

## Context

Mission Control is Everest's operator dashboard for The Driving Center SaaS. It lives at `/mission-control` inside the existing TDC Next.js app at `~/Projects/the-driving-center-website/`. Accessible from any device via Vercel URL. Shareable with Mark Martin.

This is NOT a separate app — it's a page in TDC that both Cayden and Everest use as the shared source of truth for what's being worked on.

## Design Language

Matches existing TDC design:
- Background: `#0D0D12` with radial gradient glow
- Glass cards: `rgba(255,255,255,0.03)` with `1px solid rgba(255,255,255,0.08)` border
- Primary accent: `#006FFF` (blue)
- Success/active: `#10B981`
- Text: `#ffffff` primary, `#94A3B8` muted
- Font: Outfit (already loaded in TDC)

## Pages & Features

### `/mission-control` — Main Dashboard Page

**4-column top section:**
1. My Tasks (assigned to "me" / Cayden)
2. Everest Tasks (assigned to "everest" or "subagent")
3. Upcoming Calendar Events (next 5 events)
4. Agent Status (Everest online, Codex standby, subagents)

**Activity Feed (bottom half):**
- Last 20 actions from `mc_activity_log`
- Each entry: timestamp, action, details, source (Everest/You/Cron)
- Scrollable

**Navigation sidebar:**
- Mission Control (current)
- Dashboard (TDC school dashboard)
- School Admin
- Login / Logout

### API Routes

**`POST/GET /api/mc/tasks`**
- GET: returns all tasks ordered by updated_at DESC
- POST: creates new task `{ title, project, assigned_to, status }`
- Body: `{ title, project, assigned_to, status, last_activity }`

**`PATCH /api/mc/tasks/[id]`**
- Updates task status, last_activity, or any field
- Body: `{ status?, last_activity?, title? }`

**`POST/GET /api/mc/events`**
- GET: returns upcoming calendar events ordered by start_time ASC
- POST: creates new event `{ title, start_time, end_time, event_type, recurring }`

### Everest Operator Script

`scripts/mc-log.ts` — Node script for logging actions

Usage:
```bash
npx tsx scripts/mc-log.ts --action "task-done" --details "Fixed schools INSERT owner_email column" --status "active"
```

Writes to `mc_activity_log` via Supabase REST API using service role key.

### Supabase Schema

Tables already exist in TDC Supabase project:
- `mc_tasks` — tasks board
- `mc_calendar_events` — calendar

New additions:
- `mc_activity_log` — action feed
  ```sql
  CREATE TABLE IF NOT EXISTS mc_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    details TEXT,
    source TEXT DEFAULT 'Everest',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

### Daily Sync Cron Job

OpenClaw cron at `0 21 * * *` (9 PM ET):
1. Read `memory/YYYY-MM-DD.md` for today
2. Insert summary to `mc_activity_log`
3. Check `mc_tasks` for stale `in_progress` tasks → flag if no update in 48h
4. Update `mc_calendar_events.next_run` from OpenClaw cron list

## Data Model

### `mc_tasks`
```
id uuid, title text, project text, assigned_to text, status text, last_activity text, created_at timestamptz, updated_at timestamptz
```

### `mc_calendar_events`
```
id uuid, title text, start_time timestamptz, end_time timestamptz, event_type text, source text, recurring boolean, metadata jsonb
```

### `mc_activity_log`
```
id uuid, action text, details text, source text, status text, created_at timestamptz
```

## Accessibility

- No auth wall on `/mission-control` — anyone with the URL can view
- Write APIs are unprotected in DEMO_MODE (TDC runs in demo mode)
- For production: add Bearer token auth to write APIs

## Implementation Order

1. Add `mc_activity_log` schema to Supabase via migration file
2. Build API routes: `/api/mc/tasks`, `/api/mc/events`
3. Replace `/mission-control` page with full Alex Finn-style dashboard
4. Build `scripts/mc-log.ts`
5. Set up daily OpenClaw cron at 9 PM
6. Test locally, commit, deploy
7. Share URL with Mark
