-- ============================================================
-- SEED DATA: Oak Ridge Driving Academy (The Driving Center SaaS)
-- Run after all 5 migrations have been applied
-- ============================================================

-- 1. SCHOOL
INSERT INTO schools (name, owner_email, state, slug, active)
VALUES ('Oak Ridge Driving Academy', 'demo@oakridgedriving.com', 'TN', 'oak-ridge-driving-academy', true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, owner_email = EXCLUDED.owner_email;

-- ============================================================
-- 2. INSTRUCTORS
-- ============================================================
WITH school AS (
  SELECT id FROM schools WHERE slug = 'oak-ridge-driving-academy' LIMIT 1
)
INSERT INTO instructors (school_id, name, email, phone, active)
SELECT school.id, 'Matt Reedy', 'matt@oakridgedriving.com', '765-640-0973', true FROM school
ON CONFLICT DO NOTHING;

WITH school AS (
  SELECT id FROM schools WHERE slug = 'oak-ridge-driving-academy' LIMIT 1
)
INSERT INTO instructors (school_id, name, email, phone, active)
SELECT school.id, 'Sarah Chen', 'sarah@oakridgedriving.com', '865-555-0142', true FROM school
ON CONFLICT DO NOTHING;

-- ============================================================
-- 3. SESSION TYPES
-- ============================================================
WITH school AS (
  SELECT id FROM schools WHERE slug = 'oak-ridge-driving-academy' LIMIT 1
)
INSERT INTO session_types (school_id, name, description, duration_minutes, price_cents, deposit_cents, color, tca_hours_credit, requires_permit, active)
SELECT school.id, 'Traffic School (4 Hour)', 'State-approved driver improvement course — 4 hours classroom', 240, 14900, 2500, '#ef4444', 4.0, false, true FROM school
ON CONFLICT DO NOTHING;

WITH school AS (
  SELECT id FROM schools WHERE slug = 'oak-ridge-driving-academy' LIMIT 1
)
INSERT INTO session_types (school_id, name, description, duration_minutes, price_cents, deposit_cents, color, tca_hours_credit, requires_permit, active)
SELECT school.id, 'Private Lesson', 'One-on-one driving instruction — behind-the-wheel', 60, 5500, 2500, '#06b6d4', NULL, true, true FROM school
ON CONFLICT DO NOTHING;

WITH school AS (
  SELECT id FROM schools WHERE slug = 'oak-ridge-driving-academy' LIMIT 1
)
INSERT INTO session_types (school_id, name, description, duration_minutes, price_cents, deposit_cents, color, tca_hours_credit, requires_permit, active)
SELECT school.id, 'Road Test Prep', 'Practice for TN state road test — vehicle provided', 60, 5500, 2500, '#10b981', NULL, true, true FROM school
ON CONFLICT DO NOTHING;

-- ============================================================
-- 4. INSTRUCTOR AVAILABILITY
-- ============================================================
-- Matt Reedy: Mon-Fri (1-5), 8am-5pm
WITH inst AS (SELECT id FROM instructors WHERE email = 'matt@oakridgedriving.com' LIMIT 1)
INSERT INTO instructor_availability (instructor_id, day_of_week, start_time, end_time)
SELECT inst.id, d.day, t.slot::time, (t.slot::time + interval '1 hour')::time
FROM inst,
  generate_series(0, 6) AS d(day),
  generate_series(8, 16) AS t(slot)
WHERE d.day BETWEEN 1 AND 5
ON CONFLICT (instructor_id, day_of_week, start_time) DO NOTHING;

-- Sarah Chen: Tue-Sat (2-6), 9am-6pm
WITH inst AS (SELECT id FROM instructors WHERE email = 'sarah@oakridgedriving.com' LIMIT 1)
INSERT INTO instructor_availability (instructor_id, day_of_week, start_time, end_time)
SELECT inst.id, d.day, t.slot::time, (t.slot::time + interval '1 hour')::time
FROM inst,
  generate_series(0, 6) AS d(day),
  generate_series(9, 17) AS t(slot)
WHERE d.day BETWEEN 2 AND 6
ON CONFLICT (instructor_id, day_of_week, start_time) DO NOTHING;

-- ============================================================
-- 5. STUDENTS (8 total, varied TCA progress)
-- ============================================================
DO $$
DECLARE
  school_id UUID;
  key_bytes bytea;
  enc_key TEXT := '121000048a9def66801a315e9fc2d968d3aac378deb06f35e2861478539f2c11';
BEGIN
  SELECT id INTO school_id FROM schools WHERE slug = 'oak-ridge-driving-academy' LIMIT 1;
  key_bytes := decode(enc_key, 'hex');

  -- Student 1: COMPLETE (cert issued) — Liam Thornton, 16, DOB 2009-08-14
  INSERT INTO students_driver_ed (school_id, first_name, last_name, email, phone, dob,
    permit_number, classroom_hours, driving_hours, observation_hours,
    road_test_passed, certificate_issued_at, enrollment_date, completion_date, active)
  VALUES (
    school_id, 'Liam', 'Thornton', 'thornton.liam@gmail.com', '615-882-3341',
    encrypt_dob('2009-08-14'::date, key_bytes),
    'TN-P-449182',
    6.0, 5.0, 0.0,
    true,
    '2026-02-14'::timestamptz,
    '2025-11-03'::date,
    '2026-02-14'::date,
    true
  );

  -- Student 2: NEARLY COMPLETE (6hr + 5hr) — Emma Whitfield, 17, DOB 2008-12-03
  INSERT INTO students_driver_ed (school_id, first_name, last_name, email, phone, dob,
    permit_number, classroom_hours, driving_hours, observation_hours,
    road_test_passed, enrollment_date, active)
  VALUES (
    school_id, 'Emma', 'Whitfield', 'ewhitfield@msn.com', '731-555-7823',
    encrypt_dob('2008-12-03'::date, key_bytes),
    'TN-P-551003',
    6.0, 5.0, 0.0,
    true,
    '2025-10-20'::date,
    true
  );

  -- Student 3: NEARLY COMPLETE (6hr + 4hr) — Noah Castellano, 16, DOB 2009-06-22
  INSERT INTO students_driver_ed (school_id, first_name, last_name, email, phone, dob,
    permit_number, classroom_hours, driving_hours, observation_hours,
    road_test_passed, enrollment_date, active)
  VALUES (
    school_id, 'Noah', 'Castellano', 'n.castellano@gmail.com', '423-774-9128',
    encrypt_dob('2009-06-22'::date, key_bytes),
    'TN-P-662841',
    6.0, 4.0, 0.0,
    false,
    '2025-11-10'::date,
    true
  );

  -- Student 4: MID-PROGRESS (3hr + 2hr) — Olivia Nguyen, 15, DOB 2010-03-09
  INSERT INTO students_driver_ed (school_id, first_name, last_name, email, phone, dob,
    permit_number, classroom_hours, driving_hours, observation_hours,
    road_test_passed, enrollment_date, active)
  VALUES (
    school_id, 'Olivia', 'Nguyen', 'l.nguyen@vols.tennessee.edu', '865-303-4455',
    encrypt_dob('2010-03-09'::date, key_bytes),
    'TN-P-330912',
    3.0, 2.0, 0.0,
    false,
    '2026-01-06'::date,
    true
  );

  -- Student 5: MID-PROGRESS (3hr + 1hr) — James Pickett, 16, DOB 2009-09-17
  INSERT INTO students_driver_ed (school_id, first_name, last_name, email, phone, dob,
    permit_number, classroom_hours, driving_hours, observation_hours,
    road_test_passed, enrollment_date, active)
  VALUES (
    school_id, 'James', 'Pickett', 'jpickett4820@gmail.com', '931-661-2091',
    encrypt_dob('2009-09-17'::date, key_bytes),
    'TN-P-771055',
    3.0, 1.0, 0.0,
    false,
    '2026-01-20'::date,
    true
  );

  -- Student 6: NEW ENROLLEE (classroom started) — Ava Lindsey, 15, DOB 2010-07-30
  INSERT INTO students_driver_ed (school_id, first_name, last_name, email, phone, dob,
    permit_number, classroom_hours, driving_hours, observation_hours,
    road_test_passed, enrollment_date, active)
  VALUES (
    school_id, 'Ava', 'Lindsey', 'alindsey.k12@cltn.org', '615-992-8471',
    encrypt_dob('2010-07-30'::date, key_bytes),
    'TN-P-229430',
    1.0, 0.0, 0.0,
    false,
    '2026-03-17'::date,
    true
  );

  -- Student 7: NEW ENROLLEE (just enrolled) — Elijah Foster, 16, DOB 2009-11-05
  INSERT INTO students_driver_ed (school_id, first_name, last_name, email, phone, dob,
    permit_number, classroom_hours, driving_hours, observation_hours,
    road_test_passed, enrollment_date, active)
  VALUES (
    school_id, 'Elijah', 'Foster', 'efoster4821@gmail.com', '423-218-7730',
    encrypt_dob('2009-11-05'::date, key_bytes),
    'TN-P-883109',
    0.0, 0.0, 0.0,
    false,
    '2026-04-01'::date,
    true
  );

  -- Student 8: NEW ENROLLEE (awaiting classroom) — Sophia Randall, 15, DOB 2010-02-28
  INSERT INTO students_driver_ed (school_id, first_name, last_name, email, phone, dob,
    permit_number, classroom_hours, driving_hours, observation_hours,
    road_test_passed, enrollment_date, active)
  VALUES (
    school_id, 'Sophia', 'Randall', 'srandall.k12@cltn.org', '731-404-3366',
    encrypt_dob('2010-02-28'::date, key_bytes),
    'TN-P-110298',
    0.0, 0.0, 0.0,
    false,
    '2026-04-15'::date,
    true
  );
END $$;

-- ============================================================
-- 6. UPCOMING SESSIONS (next 14 days, 14 sessions)
-- ============================================================
DO $$
DECLARE
  school_id UUID;
  matt_id UUID;
  sarah_id UUID;
  traffic_school_id UUID;
  private_lesson_id UUID;
  road_test_id UUID;

  d DATE;
  sessions_inserted INT := 0;
BEGIN
  SELECT id INTO school_id FROM schools WHERE slug = 'oak-ridge-driving-academy';
  SELECT id INTO matt_id FROM instructors WHERE email = 'matt@oakridgedriving.com';
  SELECT id INTO sarah_id FROM instructors WHERE email = 'sarah@oakridgedriving.com';
  SELECT id INTO traffic_school_id FROM session_types WHERE name = 'Traffic School (4 Hour)' AND school_id = school_id;
  SELECT id INTO private_lesson_id FROM session_types WHERE name = 'Private Lesson' AND school_id = school_id;
  SELECT id INTO road_test_id FROM session_types WHERE name = 'Road Test Prep' AND school_id = school_id;

  -- Generate sessions from today for 14 days
  FOR d IN SELECT generate_series(CURRENT_DATE, CURRENT_DATE + interval '13 days', interval '1 day')::date LOOP
    -- Mon-Fri sessions for Matt
    IF EXTRACT(DOW FROM d) BETWEEN 1 AND 5 THEN
      INSERT INTO sessions (school_id, instructor_id, session_type_id, start_date, start_at, max_seats, seats_booked, cancelled)
      VALUES (school_id, matt_id, traffic_school_id, d::text, (d + interval '8 hours')::timestamptz, 10, 0, false)
      ON CONFLICT DO NOTHING;
      sessions_inserted := sessions_inserted + 1;

      INSERT INTO sessions (school_id, instructor_id, session_type_id, start_date, start_at, max_seats, seats_booked, cancelled)
      VALUES (school_id, matt_id, private_lesson_id, d::text, (d + interval '10 hours')::timestamptz, 4, 0, false)
      ON CONFLICT DO NOTHING;
      sessions_inserted := sessions_inserted + 1;

      INSERT INTO sessions (school_id, instructor_id, session_type_id, start_date, start_at, max_seats, seats_booked, cancelled)
      VALUES (school_id, matt_id, road_test_id, d::text, (d + interval '13 hours')::timestamptz, 3, 0, false)
      ON CONFLICT DO NOTHING;
      sessions_inserted := sessions_inserted + 1;
    END IF;

    -- Tue-Sat sessions for Sarah
    IF EXTRACT(DOW FROM d) BETWEEN 2 AND 6 THEN
      INSERT INTO sessions (school_id, instructor_id, session_type_id, start_date, start_at, max_seats, seats_booked, cancelled)
      VALUES (school_id, sarah_id, private_lesson_id, d::text, (d + interval '9 hours')::timestamptz, 4, 0, false)
      ON CONFLICT DO NOTHING;
      sessions_inserted := sessions_inserted + 1;

      INSERT INTO sessions (school_id, instructor_id, session_type_id, start_date, start_at, max_seats, seats_booked, cancelled)
      VALUES (school_id, sarah_id, road_test_id, d::text, (d + interval '11 hours')::timestamptz, 3, 0, false)
      ON CONFLICT DO NOTHING;
      sessions_inserted := sessions_inserted + 1;
    END IF;
  END LOOP;

  RAISE NOTICE 'Sessions inserted: %', sessions_inserted;
END $$;

-- ============================================================
-- 7. CONFIRMED BOOKINGS (8 confirmed bookings)
-- ============================================================
DO $$
DECLARE
  session_rec RECORD;
  student_ids UUID[];
  booking_count INT := 0;
BEGIN
  -- Get a sampling of upcoming sessions (first 8 different session type combos)
  FOR session_rec IN
    SELECT s.id, s.session_type_id, st.name AS session_name
    FROM sessions s
    JOIN session_types st ON st.id = s.session_type_id
    WHERE s.start_at > NOW()
      AND s.cancelled = false
      AND s.seats_booked < s.max_seats
    ORDER BY s.start_at
    LIMIT 8
  LOOP
    -- Pick student by session type progression
    SELECT ARRAY(
      CASE session_rec.session_name
        WHEN 'Traffic School (4 Hour)' THEN
          (SELECT id FROM students_driver_ed WHERE email = 'thornton.liam@gmail.com' LIMIT 1)
        WHEN 'Private Lesson' THEN
          (SELECT id FROM students_driver_ed WHERE email = 'ewhitfield@msn.com' LIMIT 1)
        WHEN 'Road Test Prep' THEN
          (SELECT id FROM students_driver_ed WHERE email = 'n.castellano@gmail.com' LIMIT 1)
        ELSE
          (SELECT id FROM students_driver_ed WHERE email = 'l.nguyen@vols.tennessee.edu' LIMIT 1)
      END
    ) INTO student_ids;

    INSERT INTO bookings (session_id, student_id, student_name, student_email, student_phone,
      status, deposit_amount_cents, deposit_paid_at, reminder_48h_sent, created_at)
    VALUES (
      session_rec.id,
      student_ids[1],
      CASE (SELECT first_name FROM students_driver_ed WHERE id = student_ids[1])
        || ' ' || (SELECT last_name FROM students_driver_ed WHERE id = student_ids[1]),
      (SELECT email FROM students_driver_ed WHERE id = student_ids[1]),
      (SELECT phone FROM students_driver_ed WHERE id = student_ids[1]),
      'confirmed',
      2500,
      (SELECT start_at FROM sessions WHERE id = session_rec.id) - interval '3 days',
      CASE WHEN (SELECT start_at FROM sessions WHERE id = session_rec.id) < NOW() + interval '48 hours'
           THEN true ELSE false END,
      NOW()
    );

    UPDATE sessions SET seats_booked = seats_booked + 1 WHERE id = session_rec.id;
    booking_count := booking_count + 1;
  END LOOP;

  RAISE NOTICE 'Bookings inserted: %', booking_count;
END $$;
