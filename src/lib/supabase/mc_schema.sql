-- Mission Control Supabase Schema
-- Run this in Supabase SQL Editor

-- Tasks table for mission control
CREATE TABLE IF NOT EXISTS mc_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  project TEXT NOT NULL DEFAULT 'personal', -- saas | fso | personal | admin
  assigned_to TEXT NOT NULL DEFAULT 'everest', -- me | everest | subagent
  status TEXT NOT NULL DEFAULT 'todo', -- todo | in_progress | done
  last_activity TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memory index for the viewer
CREATE TABLE IF NOT EXISTS mc_memory_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  path TEXT NOT NULL,
  content_preview TEXT,
  modified_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar events (work windows, cron jobs, scheduled tasks)
CREATE TABLE IF NOT EXISTS mc_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  event_type TEXT NOT NULL DEFAULT 'scheduled', -- work_window | cron | scheduled
  source TEXT NOT NULL DEFAULT 'manual', -- openclaw | manual
  recurring BOOLEAN DEFAULT FALSE,
  metadata JSONB
);

-- Enable RLS
ALTER TABLE mc_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mc_memory_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE mc_calendar_events ENABLE ROW LEVEL SECURITY;

-- Policy: allow all for anon (OpenClaw writes, dashboard reads)
CREATE POLICY "mc_tasks_all" ON mc_tasks FOR ALL USING (true);
CREATE POLICY "mc_memory_all" ON mc_memory_index FOR ALL USING (true);
CREATE POLICY "mc_events_all" ON mc_calendar_events FOR ALL USING (true);

-- Seed work window (Cayden's daily deep work block)
INSERT INTO mc_calendar_events (title, start_time, end_time, event_type, source, recurring, metadata)
VALUES (
  'Deep Work Window',
  '21:00:00', -- 5PM ET = 21:00 UTC
  '01:00:00', -- 9PM ET = 01:00 UTC next day
  'work_window',
  'manual',
  true,
  '{"days": ["mon", "tue", "wed", "thu", "fri"], "timezone": "America/New_York"}'
) ON CONFLICT DO NOTHING;

-- Seed example tasks
INSERT INTO mc_tasks (title, project, assigned_to, status, last_activity)
VALUES
  ('Build Mission Control dashboard', 'saas', 'everest', 'in_progress', 'Creating SPEC and initial page structure'),
  ('Fix tdc-reminders cron (bookings schema error)', 'saas', 'everest', 'todo', 'Database schema mismatch in /api/reminders'),
  ('FSO session with Mark Martin', 'fso', 'me', 'todo', 'Next session scheduled'),
  ('Driving Center landing page redesign', 'saas', 'everest', 'in_progress', 'Hero section spec complete')
ON CONFLICT DO NOTHING;
