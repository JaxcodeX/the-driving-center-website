-- Migration 003: Security hardening
-- Run this in Supabase SQL Editor after copying the output

-- 1. Secure increment_seats_booked with school ownership check
CREATE OR REPLACE FUNCTION increment_seats_booked(target_session_id UUID, target_school_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE sessions
  SET seats_booked = seats_booked + 1
  WHERE id = target_session_id
    AND school_id = target_school_id
    AND seats_booked < max_seats
    AND cancelled = false;
$$;

-- 2. Add deleted_at column to sessions (soft delete for retention compliance)
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 3. Ensure audit_logs table exists and has the right structure
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_id TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS details JSONB;

-- 4. Index for fast session lookups by school + date
CREATE INDEX IF NOT EXISTS idx_sessions_school_date
  ON sessions(school_id, start_date)
  WHERE cancelled = false;

-- 5. Index for audit log lookups by action + timestamp
CREATE INDEX IF NOT EXISTS idx_audit_logs_action
  ON audit_logs(action, timestamp DESC);

-- 6. Add constraint: dob must be at least 15 years ago (TN driver ed minimum age)
ALTER TABLE students_driver_ed
  ADD CONSTRAINT check_student_min_age
  CHECK (dob <= (CURRENT_DATE - INTERVAL '15 years'));

-- 7. Ensure RLS is enabled on all tables (idempotent)
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE students_driver_ed ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 8. Schools: only service role can write; schools can read their own record
CREATE OR REPLACE POLICY "service_role_schools_all" ON schools
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE OR REPLACE POLICY "auth_schools_read_own" ON schools
  FOR SELECT TO authenticated
  USING (owner_email = (auth.jwt() ->> 'email'));

-- 9. Students: service role full access; auth can only read own school (via school_id join)
CREATE OR REPLACE POLICY "service_role_students_all" ON students_driver_ed
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE OR REPLACE POLICY "service_role_sessions_all" ON sessions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE OR REPLACE POLICY "service_role_payments_all" ON payments
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE OR REPLACE POLICY "service_role_audit_all" ON audit_logs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 10. Add deleted_at index for fast soft-delete queries
CREATE INDEX IF NOT EXISTS idx_students_deleted ON students_driver_ed(deleted_at)
  WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_deleted ON sessions(deleted_at)
  WHERE deleted_at IS NOT NULL;
