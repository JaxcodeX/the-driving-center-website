import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SEED_SECRET = process.env.SEED_SECRET || 'tdc-demo-seed-2026';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (body.secret !== SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServiceClient();
    const now = new Date().toISOString();

    // Step 1: Probe actual schema by selecting from each table
    const [{ data: schools, error: sErr }, { data: students, error: stErr }, { data: sessions, error: sessErr }, { data: bookings, error: bErr }] = await Promise.all([
      supabase.from('schools').select('*').limit(1),
      supabase.from('students_driver_ed').select('*').limit(1),
      supabase.from('sessions').select('*').limit(1),
      supabase.from('bookings').select('*').limit(1),
    ]);

    const schemaReport = {
      schools: { cols: schools && schools[0] ? Object.keys(schools[0]) : [], error: sErr?.message },
      students: { cols: students && students[0] ? Object.keys(students[0]) : [], error: stErr?.message },
      sessions: { cols: sessions && sessions[0] ? Object.keys(sessions[0]) : [], error: sessErr?.message },
      bookings: { cols: bookings && bookings[0] ? Object.keys(bookings[0]) : [], error: bErr?.message },
    };

    // Step 2: Get existing school ID
    const { data: existingSchool } = await supabase
      .from('schools')
      .select('id, name, slug')
      .eq('slug', 'oak-ridge-driving-academy')
      .maybeSingle();

    const schoolId = existingSchool?.id || '00000000-0000-0000-0000-000000000001';

    // Step 3: Probe instructor columns
    const { data: instructorSample } = await supabase.from('instructors').select('*').limit(1);
    const instructorCols = instructorSample && instructorSample[0] ? Object.keys(instructorSample[0]) : [];

    const results = [];

    // 4. Instructors (probe FK: school_id must match)
    const { error: instrErr } = await supabase.from('instructors').upsert([
      { id: '00000000-0000-0000-0000-000000000010', school_id: schoolId, name: 'Matt Reedy', email: 'matt@oakridgedriving.com', phone: '7656400973', license_number: 'TN-DL-8821', active: true, created_at: now },
      { id: '00000000-0000-0000-0000-000000000011', school_id: schoolId, name: 'Sarah Chen', email: 'sarah@oakridgedriving.com', phone: '8655550142', license_number: 'TN-DL-5543', active: true, created_at: now },
    ], { onConflict: 'id' });
    results.push({ table: 'instructors', error: instrErr?.message, cols: instructorCols });

    // 5. Session Types
    const { error: stErr2 } = await supabase.from('session_types').upsert([
      { id: '00000000-0000-0000-0000-000000000020', school_id: schoolId, name: 'Traffic School (4 Hour)', description: 'State-approved driver improvement course — 4 classroom hours', duration_minutes: 240, price_cents: 14900, deposit_cents: 2500, color: '#ef4444', tca_hours_credit: 4.0, active: true, created_at: now },
      { id: '00000000-0000-0000-0000-000000000021', school_id: schoolId, name: 'Private Lesson', description: 'One-on-one behind-the-wheel instruction', duration_minutes: 60, price_cents: 5500, deposit_cents: 2500, color: '#06b6d4', active: true, created_at: now },
      { id: '00000000-0000-0000-0000-000000000022', school_id: schoolId, name: 'Road Test Prep', description: 'Practice session to prepare for state road test', duration_minutes: 60, price_cents: 5500, deposit_cents: 2500, color: '#10b981', active: true, created_at: now },
    ], { onConflict: 'id' });
    results.push({ table: 'session_types', error: stErr2?.message });

    // 6. Instructor Availability
    const { error: availErr } = await supabase.from('instructor_availability').upsert([
      { id: '00000000-0000-0000-0000-000000000100', instructor_id: '00000000-0000-0000-0000-000000000010', day_of_week: 1, start_time: '08:00', end_time: '17:00', active: true, created_at: now },
      { id: '00000000-0000-0000-0000-000000000101', instructor_id: '00000000-0000-0000-0000-000000000010', day_of_week: 2, start_time: '08:00', end_time: '17:00', active: true, created_at: now },
      { id: '00000000-0000-0000-0000-000000000102', instructor_id: '00000000-0000-0000-0000-000000000010', day_of_week: 3, start_time: '08:00', end_time: '17:00', active: true, created_at: now },
      { id: '00000000-0000-0000-0000-000000000103', instructor_id: '00000000-0000-0000-0000-000000000010', day_of_week: 4, start_time: '08:00', end_time: '17:00', active: true, created_at: now },
      { id: '00000000-0000-0000-0000-000000000104', instructor_id: '00000000-0000-0000-0000-000000000010', day_of_week: 5, start_time: '08:00', end_time: '17:00', active: true, created_at: now },
      { id: '00000000-0000-0000-0000-000000000110', instructor_id: '00000000-0000-0000-0000-000000000011', day_of_week: 2, start_time: '09:00', end_time: '18:00', active: true, created_at: now },
      { id: '00000000-0000-0000-0000-000000000111', instructor_id: '00000000-0000-0000-0000-000000000011', day_of_week: 3, start_time: '09:00', end_time: '18:00', active: true, created_at: now },
      { id: '00000000-0000-0000-0000-000000000112', instructor_id: '00000000-0000-0000-0000-000000000011', day_of_week: 4, start_time: '09:00', end_time: '18:00', active: true, created_at: now },
      { id: '00000000-0000-0000-0000-000000000113', instructor_id: '00000000-0000-0000-0000-000000000011', day_of_week: 5, start_time: '09:00', end_time: '18:00', active: true, created_at: now },
      { id: '00000000-0000-0000-0000-000000000114', instructor_id: '00000000-0000-0000-0000-000000000011', day_of_week: 6, start_time: '09:00', end_time: '18:00', active: true, created_at: now },
    ], { onConflict: 'id' });
    results.push({ table: 'instructor_availability', error: availErr?.message });

    // 7. Sessions — probe columns from schemaReport
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const day2 = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];
    const day3 = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
    const day4 = new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0];
    const day5 = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
    const day6 = new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0];
    const day8 = new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0];
    const day9 = new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0];

    // Build session insert based on actual columns
    const sessionBase = {
      school_id: schoolId,
      instructor_id: '00000000-0000-0000-0000-000000000010',
      session_type_id: '00000000-0000-0000-0000-000000000020',
      start_date: tomorrow,
      max_seats: 8,
      seats_booked: 3,
      location: 'Oak Ridge, TN',
      created_at: now,
    };
    const sessionCols = schemaReport.sessions.cols;
    const sessionsToInsert = [
      { ...sessionBase, id: '00000000-0000-0000-0000-000000000030', instructor_id: '00000000-0000-0000-0000-000000000010', session_type_id: '00000000-0000-0000-0000-000000000020', start_date: tomorrow, start_time: sessionCols.includes('start_time') ? '09:00' : undefined, end_time: sessionCols.includes('end_time') ? '13:00' : undefined },
      { ...sessionBase, id: '00000000-0000-0000-0000-000000000031', instructor_id: '00000000-0000-0000-0000-000000000010', session_type_id: '00000000-0000-0000-0000-000000000021', start_date: tomorrow, seats_booked: 0, location: 'Oak Ridge, TN', start_time: sessionCols.includes('start_time') ? '14:00' : undefined, end_time: sessionCols.includes('end_time') ? '15:00' : undefined },
      { ...sessionBase, id: '00000000-0000-0000-0000-000000000032', instructor_id: '00000000-0000-0000-0000-000000000011', session_type_id: '00000000-0000-0000-0000-000000000020', start_date: day2, seats_booked: 5, location: 'Knoxville, TN', start_time: sessionCols.includes('start_time') ? '09:00' : undefined, end_time: sessionCols.includes('end_time') ? '13:00' : undefined },
      { ...sessionBase, id: '00000000-0000-0000-0000-000000000033', instructor_id: '00000000-0000-0000-0000-000000000011', session_type_id: '00000000-0000-0000-0000-000000000022', start_date: day2, seats_booked: 1, location: 'Knoxville, TN', start_time: sessionCols.includes('start_time') ? '14:00' : undefined, end_time: sessionCols.includes('end_time') ? '15:00' : undefined },
      { ...sessionBase, id: '00000000-0000-0000-0000-000000000034', instructor_id: '00000000-0000-0000-0000-000000000010', session_type_id: '00000000-0000-0000-0000-000000000021', start_date: day3, seats_booked: 0, start_time: sessionCols.includes('start_time') ? '08:00' : undefined, end_time: sessionCols.includes('end_time') ? '09:00' : undefined },
      { ...sessionBase, id: '00000000-0000-0000-0000-000000000035', instructor_id: '00000000-0000-0000-0000-000000000010', session_type_id: '00000000-0000-0000-0000-000000000020', start_date: day4, seats_booked: 7, start_time: sessionCols.includes('start_time') ? '09:00' : undefined, end_time: sessionCols.includes('end_time') ? '13:00' : undefined },
      { ...sessionBase, id: '00000000-0000-0000-0000-000000000036', instructor_id: '00000000-0000-0000-0000-000000000011', session_type_id: '00000000-0000-0000-0000-000000000021', start_date: day5, seats_booked: 0, location: 'Knoxville, TN', start_time: sessionCols.includes('start_time') ? '10:00' : undefined, end_time: sessionCols.includes('end_time') ? '11:00' : undefined },
      { ...sessionBase, id: '00000000-0000-0000-0000-000000000037', instructor_id: '00000000-0000-0000-0000-000000000010', session_type_id: '00000000-0000-0000-0000-000000000022', start_date: day6, seats_booked: 0, start_time: sessionCols.includes('start_time') ? '09:00' : undefined, end_time: sessionCols.includes('end_time') ? '10:00' : undefined },
      { ...sessionBase, id: '00000000-0000-0000-0000-000000000038', instructor_id: '00000000-0000-0000-0000-000000000010', session_type_id: '00000000-0000-0000-0000-000000000020', start_date: day8, seats_booked: 2, start_time: sessionCols.includes('start_time') ? '09:00' : undefined, end_time: sessionCols.includes('end_time') ? '13:00' : undefined },
      { ...sessionBase, id: '00000000-0000-0000-0000-000000000039', instructor_id: '00000000-0000-0000-0000-000000000011', session_type_id: '00000000-0000-0000-0000-000000000021', start_date: day9, seats_booked: 0, location: 'Knoxville, TN', start_time: sessionCols.includes('start_time') ? '09:00' : undefined, end_time: sessionCols.includes('end_time') ? '10:00' : undefined },
    ].map(s => Object.fromEntries(Object.entries(s).filter(([_, v]) => v !== undefined)));

    const { error: sessionsErr } = await supabase.from('sessions').upsert(sessionsToInsert, { onConflict: 'id' });
    results.push({ table: 'sessions', error: sessionsErr?.message, cols: sessionCols });

    // 8. Students — probe columns
    const studentCols = schemaReport.students.cols;
    const hasPhone = studentCols.includes('phone');
    const hasEmail = studentCols.includes('email');
    const hasPermit = studentCols.includes('permit_number');
    const studentBase = { school_id: schoolId, classroom_hours: 0.0, driving_hours: 0.0, enrollment_date: now.split('T')[0], created_at: now };
    const studentsToInsert = [
      { id: '00000000-0000-0000-0000-000000000040', ...studentBase, legal_name: 'Emma Thompson', ...(hasPhone ? { phone: '8655550001' } : {}), ...(hasPermit ? { permit_number: 'TN-PER-8812' } : {}) },
      { id: '00000000-0000-0000-0000-000000000041', ...studentBase, legal_name: 'James Wilson', ...(hasPhone ? { phone: '8655550002' } : {}), ...(hasPermit ? { permit_number: 'TN-PER-8834' } : {}), classroom_hours: 4.0, driving_hours: 2.0 },
      { id: '00000000-0000-0000-0000-000000000042', ...studentBase, legal_name: 'Sophia Martinez', ...(hasPhone ? { phone: '8655550003' } : {}), ...(hasPermit ? { permit_number: 'TN-PER-7752' } : {}), classroom_hours: 4.0, driving_hours: 4.0 },
      { id: '00000000-0000-0000-0000-000000000043', ...studentBase, legal_name: 'Liam Johnson', ...(hasPhone ? { phone: '8655550004' } : {}), ...(hasPermit ? { permit_number: 'TN-PER-9901' } : {}), classroom_hours: 6.0, driving_hours: 5.0 },
      { id: '00000000-0000-0000-0000-000000000044', ...studentBase, legal_name: 'Olivia Brown', ...(hasPhone ? { phone: '8655550005' } : {}), ...(hasPermit ? { permit_number: 'TN-PER-6621' } : {}), classroom_hours: 6.0, driving_hours: 6.0, certificate_issued_at: now },
      { id: '00000000-0000-0000-0000-000000000045', ...studentBase, legal_name: 'Noah Davis', ...(hasPhone ? { phone: '8655550006' } : {}), ...(hasPermit ? { permit_number: 'TN-PER-4412' } : {}), classroom_hours: 4.0, driving_hours: 3.0 },
      { id: '00000000-0000-0000-0000-000000000046', ...studentBase, legal_name: 'Ava Garcia', ...(hasPhone ? { phone: '8655550007' } : {}) },
      { id: '00000000-0000-0000-0000-000000000047', ...studentBase, legal_name: 'Ethan Miller', ...(hasPhone ? { phone: '8655550008' } : {}), ...(hasPermit ? { permit_number: 'TN-PER-3345' } : {}), classroom_hours: 6.0, driving_hours: 6.0, certificate_issued_at: now },
    ].map(s => Object.fromEntries(Object.entries(s).filter(([_, v]) => v !== undefined)));

    const { error: studentsErr } = await supabase.from('students_driver_ed').upsert(studentsToInsert, { onConflict: 'id' });
    results.push({ table: 'students_driver_ed', error: studentsErr?.message, cols: studentCols });

    // 9. Bookings — probe columns
    const bookingCols = schemaReport.bookings.cols;
    const hasSessionId = bookingCols.includes('session_id');
    const hasStudentId = bookingCols.includes('student_id');
    const bookingBase = { student_name: 'Emma Thompson', student_email: 'emmathompson@email.com', student_phone: '8655550001', status: 'confirmed', created_at: now };
    const bookingsToInsert = [
      { id: '00000000-0000-0000-0000-000000000050', ...(hasSessionId ? { session_id: '00000000-0000-0000-0000-000000000030' } : {}), ...bookingBase },
      { id: '00000000-0000-0000-0000-000000000051', ...(hasSessionId ? { session_id: '00000000-0000-0000-0000-000000000031' } : {}), student_name: 'James Wilson', student_email: 'jameswilson@email.com', student_phone: '8655550002', status: 'confirmed', created_at: now },
      { id: '00000000-0000-0000-0000-000000000052', ...(hasSessionId ? { session_id: '00000000-0000-0000-0000-000000000032' } : {}), student_name: 'Sophia Martinez', student_email: 'sophiamartinez@email.com', student_phone: '8655550003', status: 'confirmed', created_at: now },
      { id: '00000000-0000-0000-0000-000000000053', ...(hasSessionId ? { session_id: '00000000-0000-0000-0000-000000000033' } : {}), student_name: 'Noah Davis', student_email: 'noahdavis@email.com', student_phone: '8655550006', status: 'confirmed', created_at: now },
      { id: '00000000-0000-0000-0000-000000000054', ...(hasSessionId ? { session_id: '00000000-0000-0000-0000-000000000035' } : {}), student_name: 'Liam Johnson', student_email: 'liamjohnson@email.com', student_phone: '8655550004', status: 'confirmed', created_at: now },
    ].map(b => Object.fromEntries(Object.entries(b).filter(([_, v]) => v !== undefined)));

    const { error: bookingsErr } = await supabase.from('bookings').upsert(bookingsToInsert, { onConflict: 'id' });
    results.push({ table: 'bookings', error: bookingsErr?.message, cols: bookingCols });

    const errors = results.filter(r => r.error);
    return NextResponse.json({
      success: errors.length === 0,
      seeded: results.length,
      schemaReport,
      schoolIdFound: schoolId,
      results,
      errors: errors.length ? errors : undefined,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
