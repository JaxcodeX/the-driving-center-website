-- Migration 011: Mission Control Activity Log
-- Live table for Everest's action feed

CREATE TABLE IF NOT EXISTS public.mc_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  details TEXT,
  source TEXT DEFAULT 'Everest',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'done', 'error', 'idle')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mc_activity_log ENABLE ROW LEVEL SECURITY;

-- Allow all for anon (demo mode — add auth in production)
CREATE POLICY "mc_activity_all" ON public.mc_activity_log FOR ALL USING (true);

-- Seed initial entries
INSERT INTO public.mc_activity_log (action, details, source, status) VALUES
  ('Mission Control initialized', 'Operational dashboard deployed at /mission-control', 'Everest', 'active'),
  ('Schema updated', 'Added mc_activity_log table to Supabase', 'Everest', 'active'),
  ('API routes live', 'POST/GET /api/mc/tasks and /api/mc/events ready', 'Everest', 'active')
ON CONFLICT DO NOTHING;
