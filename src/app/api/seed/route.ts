import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const SEED_SECRET = process.env.SEED_SECRET || 'tdc-demo-seed-2026';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    // Simple secret check
    if (body.secret !== SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const now = new Date().toISOString();
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const day2 = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];
    const day3 = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
    const day4 = new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0];
    const day5 = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
    const day6 = new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0];
    const day8 = new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0];
    const day9 = new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0];

    const results = [];

    // 1. School
    const { error: schoolErr } = await supabase.from('schools').upsert({
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Oak Ridge Driving Academy',
      owner_email: 'demo@oakridgedriving.com',
      state: 'TN',
      active: true,
      slug: 'oak-ridge-driving-academy',
      created_at: now,
    }, { onConflict: 'id' });
    results.push({ table: 'schools', error: schoolErr?.message });

    // 2. Instructors
    const { error: instrErr } = await supabase.from('instructors').upsert([
      { id: '00000000-0000-0000-0000-000000000010', school_id: '00000000-0000-0000-0000-000000000001', name: 'Matt Reedy', email: 'matt@oakridgedriving.com', phone: '7656400973', license_number: 'TN-DL-8821', active: true, created_at: now },
      { id: '00000000-0000-0000-0000-000000000011', school_id: '00000000-0000-0000-0000-000000000001', name: 'Sarah Chen', email: 'sarah@oakridgedriving.com', phone: '8655550142', license_number: 'TN-DL-5543', active: true, created_at: now },
    ], { onConflict: 'id' });
    results.push({ table: 'instructors', error: instrErr?.message });

    // 3. Session Types
    const { error: stErr } = await supabase.from('session_types').upsert([
      { id: '00000000-0000-0000-0000-000000000020', school_id: '00000000-0000-0000-0000-000000000001', name: 'Traffic School (4 Hour)', description: 'State-approved driver improvement course — 4 classroom hours', duration_minutes: 240, price_cents: 14900, deposit_cents: 2500, color: '#ef4444', tca_hours_credit: 4.0, active: true, created_at: now },
      { id: '00000000-0000-0000-0000-000000000021', school_id: '00000000-0000-0000-0000-000000000001', name: 'Private Lesson', description: 'One-on-one behind-the-wheel instruction', duration_minutes: 60, price_cents: 5500, deposit_cents: 2500, color: '#06b6d4', tca_hours_credit: null, active: true, created_at: now },
      { id: '00000000-0000-0000-0000-000000000022', school_id: '00000000-0000-0000-0000-000000000001', name: 'Road Test Prep', description: 'Practice session to prepare for state road test', duration_minutes: 60, price_cents: 5500, deposit_cents: 2500, color: '#10b981', tca_hours_credit: null, active: true, created_at: now },
    ], { onConflict: 'id' });
    results.push({ table: 'session_types', error: stErr?.message });

    // 4. Instructor Availability
    const { error: availErr } = await supabase.from('instructor_availability').upsert([
      // Matt: Mon-Fri 8-5
      { instructor_id: '00000000-0000-0000-0000-000000000010', day_of_week: 1, start_time: '08:00', end_time: '17:00', active: true, created_at: now },
      { instructor_id: '00000000-0000-0000-0000-000000000010', day_of_week: 2, start_time: '08:00', end_time: '17:00', active: true, created_at: now },
      { instructor_id: '00000000-0000-0000-0000-000000000010', day_of_week: 3, start_time: '08:00', end_time: '17:00', active: true, created_at: now },
      { instructor_id: '00000000-0000-0000-0000-000000000010', day_of_week: 4, start_time: '08:00', end_time: '17:00', active: true, created_at: now },
      { instructor_id: '00000000-0000-0000-0000-000000000010', day_of_week: 5, start_time: '08:00', end_time: '17:00', active: true, created_at: now },
      // Sarah: Tue-Sat 9-6
      { instructor_id: '00000000-0000-0000-0000-000000000011', day_of_week: 2, start_time: '09:00', end_time: '18:00', active: true, created_at: now },
      { instructor_id: '00000000-0000-0000-0000-000000000011', day_of_week: 3, start_time: '09:00', end_time: '18:00', active: true, created_at: now },
      { instructor_id: '00000000-0000-0000-0000-000000000011', day_of_week: 4, start_time: '09:00', end_time: '18:00', active: true, created_at: now },
      { instructor_id: '00000000-0000-0000-0000-000000000011', day_of_week: 5, start_time: '09:00', end_time: '18:00', active: true, created_at: now },
      { instructor_id: '00000000-0000-0000-0000-000000000011', day_of_week: 6, start_time: '09:00', end_time: '18:00', active: true, created_at: now },
    ], { onConflict: 'id' });
    results.push({ table: 'instructor_availability', error: availErr?.message });

    // 5. Students
    const { error: studentsErr } = await supabase.from('students_driver_ed').upsert([
      { id: '00000000-0000-0000-0000-000000000040', school_id: '00000000-0000-0000-0000-000000000001', legal_name: 'Emma Thompson', email: 'emmathompson@email.com', phone: '8655550001', permit_number: 'TN-PER-8812', classroom_hours: 0.0, driving_hours: 0.0, enrollment_date: now.split('T')[0], certificate_issued_at: null, created_at: now },
      { id: '00000000-0000-0000-0000-000000000041', school_id: '00000000-0000-0000-0000-000000000001', legal_name: 'James Wilson', email: 'jameswilson@email.com', phone: '8655550002', permit_number: 'TN-PER-8834', classroom_hours: 4.0, driving_hours: 2.0, enrollment_date: now.split('T')[0], certificate_issued_at: null, created_at: now },
      { id: '00000000-0000-0000-0000-000000000042', school_id: '00000000-0000-0000-0000-000000000001', legal_name: 'Sophia Martinez', email: 'sophiamartinez@email.com', phone: '8655550003', permit_number: 'TN-PER-7752', classroom_hours: 4.0, driving_hours: 4.0, enrollment_date: now.split('T')[0], certificate_issued_at: null, created_at: now },
      { id: '00000000-0000-0000-0000-000000000043', school_id: '00000000-0000-0000-0000-000000000001', legal_name: 'Liam Johnson', email: 'liamjohnson@email.com', phone: '8655550004', permit_number: 'TN-PER-9901', classroom_hours: 6.0, driving_hours: 5.0, enrollment_date: now.split('T')[0], certificate_issued_at: null, created_at: now },
      { id: '00000000-0000-0000-0000-000000000044', school_id: '00000000-0000-0000-0000-000000000001', legal_name: 'Olivia Brown', email: 'oliviabrown@email.com', phone: '8655550005', permit_number: 'TN-PER-6621', classroom_hours: 6.0, driving_hours: 6.0, enrollment_date: now.split('T')[0], certificate_issued_at: now, created_at: now },
      { id: '00000000-0000-0000-0000-000000000045', school_id: '00000000-0000-0000-0000-000000000001', legal_name: 'Noah Davis', email: 'noahdavis@email.com', phone: '8655550006', permit_number: 'TN-PER-4412', classroom_hours: 4.0, driving_hours: 3.0, enrollment_date: now.split('T')[0], certificate_issued_at: null, created_at: now },
      { id: '00000000-0000-0000-0000-000000000046', school_id: '00000000-0000-0000-0000-000000000001', legal_name: 'Ava Garcia', email: 'avagarcia@email.com', phone: '8655550007', permit_number: null, classroom_hours: 0.0, driving_hours: 0.0, enrollment_date: now.split('T')[0], certificate_issued_at: null, created_at: now },
      { id: '00000000-0000-0000-0000-000000000047', school_id: '00000000-0000-0000-0000-000000000001', legal_name: 'Ethan Miller', email: 'ethanmill@email.com', phone: '8655550008', permit_number: 'TN-PER-3345', classroom_hours: 6.0, driving_hours: 6.0, enrollment_date: now.split('T')[0], certificate_issued_at: now, created_at: now },
    ], { onConflict: 'id' });
    results.push({ table: 'students_driver_ed', error: studentsErr?.message });

    // 6. Sessions
    const { error: sessionsErr } = await supabase.from('sessions').upsert([
      { id: '00000000-0000-0000-0000-000000000030', school_id: '00000000-0000-0000-0000-000000000001', instructor_id: '00000000-0000-0000-0000-000000000010', session_type_id: '00000000-0000-0000-0000-000000000020', start_date: tomorrow, start_time: '09:00', end_time: '13:00', max_seats: 8, seats_booked: 3, location: 'Oak Ridge, TN', cancelled: false, created_at: now },
      { id: '00000000-0000-0000-0000-000000000031', school_id: '00000000-0000-0000-0000-000000000001', instructor_id: '00000000-0000-0000-0000-000000000010', session_type_id: '00000000-0000-0000-0000-000000000021', start_date: tomorrow, start_time: '14:00', end_time: '15:00', max_seats: 1, seats_booked: 0, location: 'Oak Ridge, TN', cancelled: false, created_at: now },
      { id: '00000000-0000-0000-0000-000000000032', school_id: '00000000-0000-0000-0000-000000000001', instructor_id: '00000000-0000-0000-0000-000000000011', session_type_id: '00000000-0000-0000-0000-000000000020', start_date: day2, start_time: '09:00', end_time: '13:00', max_seats: 8, seats_booked: 5, location: 'Knoxville, TN', cancelled: false, created_at: now },
      { id: '00000000-0000-0000-0000-000000000033', school_id: '00000000-0000-0000-0000-000000000001', instructor_id: '00000000-0000-0000-0000-000000000011', session_type_id: '00000000-0000-0000-0000-000000000022', start_date: day2, start_time: '14:00', end_time: '15:00', max_seats: 1, seats_booked: 1, location: 'Knoxville, TN', cancelled: false, created_at: now },
      { id: '00000000-0000-0000-0000-000000000034', school_id: '00000000-0000-0000-0000-000000000001', instructor_id: '00000000-0000-0000-0000-000000000010', session_type_id: '00000000-0000-0000-0000-000000000021', start_date: day3, start_time: '08:00', end_time: '09:00', max_seats: 1, seats_booked: 0, location: 'Oak Ridge, TN', cancelled: false, created_at: now },
      { id: '00000000-0000-0000-0000-000000000035', school_id: '00000000-0000-0000-0000-000000000001', instructor_id: '00000000-0000-0000-0000-000000000010', session_type_id: '00000000-0000-0000-0000-000000000020', start_date: day4, start_time: '09:00', end_time: '13:00', max_seats: 8, seats_booked: 7, location: 'Oak Ridge, TN', cancelled: false, created_at: now },
      { id: '00000000-0000-0000-0000-000000000036', school_id: '00000000-0000-0000-0000-000000000001', instructor_id: '00000000-0000-0000-0000-000000000011', session_type_id: '00000000-0000-0000-0000-000000000021', start_date: day5, start_time: '10:00', end_time: '11:00', max_seats: 1, seats_booked: 0, location: 'Knoxville, TN', cancelled: false, created_at: now },
      { id: '00000000-0000-0000-0000-000000000037', school_id: '00000000-0000-0000-0000-000000000001', instructor_id: '00000000-0000-0000-0000-000000000010', session_type_id: '00000000-0000-0000-0000-000000000022', start_date: day6, start_time: '09:00', end_time: '10:00', max_seats: 1, seats_booked: 0, location: 'Oak Ridge, TN', cancelled: false, created_at: now },
      { id: '00000000-0000-0000-0000-000000000038', school_id: '00000000-0000-0000-0000-000000000001', instructor_id: '00000000-0000-0000-0000-000000000010', session_type_id: '00000000-0000-0000-0000-000000000020', start_date: day8, start_time: '09:00', end_time: '13:00', max_seats: 8, seats_booked: 2, location: 'Oak Ridge, TN', cancelled: false, created_at: now },
      { id: '00000000-0000-0000-0000-000000000039', school_id: '00000000-0000-0000-0000-000000000001', instructor_id: '00000000-0000-0000-0000-000000000011', session_type_id: '00000000-0000-0000-0000-000000000021', start_date: day9, start_time: '09:00', end_time: '10:00', max_seats: 1, seats_booked: 0, location: 'Knoxville, TN', cancelled: false, created_at: now },
    ], { onConflict: 'id' });
    results.push({ table: 'sessions', error: sessionsErr?.message });

    // 7. Bookings
    const { error: bookingsErr } = await supabase.from('bookings').upsert([
      { id: '00000000-0000-0000-0000-000000000050', school_id: '00000000-0000-0000-0000-000000000001', session_type_id: '00000000-0000-0000-0000-000000000020', instructor_id: '00000000-0000-0000-0000-000000000010', session_date: tomorrow, session_time: '09:00', student_name: 'Emma Thompson', student_email: 'emmathompson@email.com', student_phone: '8655550001', status: 'confirmed', reminder_48h_sent: false, reminder_4h_sent: false, created_at: now },
      { id: '00000000-0000-0000-0000-000000000051', school_id: '00000000-0000-0000-0000-000000000001', session_type_id: '00000000-0000-0000-0000-000000000021', instructor_id: '00000000-0000-0000-0000-000000000010', session_date: tomorrow, session_time: '14:00', student_name: 'James Wilson', student_email: 'jameswilson@email.com', student_phone: '8655550002', status: 'confirmed', reminder_48h_sent: false, reminder_4h_sent: false, created_at: now },
      { id: '00000000-0000-0000-0000-000000000052', school_id: '00000000-0000-0000-0000-000000000001', session_type_id: '00000000-0000-0000-0000-000000000020', instructor_id: '00000000-0000-0000-0000-000000000011', session_date: day2, session_time: '09:00', student_name: 'Sophia Martinez', student_email: 'sophiamartinez@email.com', student_phone: '8655550003', status: 'confirmed', reminder_48h_sent: false, reminder_4h_sent: false, created_at: now },
      { id: '00000000-0000-0000-0000-000000000053', school_id: '00000000-0000-0000-0000-000000000001', session_type_id: '00000000-0000-0000-0000-000000000022', instructor_id: '00000000-0000-0000-0000-000000000011', session_date: day2, session_time: '14:00', student_name: 'Noah Davis', student_email: 'noahdavis@email.com', student_phone: '8655550006', status: 'confirmed', reminder_48h_sent: false, reminder_4h_sent: false, created_at: now },
      { id: '00000000-0000-0000-0000-000000000054', school_id: '00000000-0000-0000-0000-000000000001', session_type_id: '00000000-0000-0000-0000-000000000020', instructor_id: '00000000-0000-0000-0000-000000000010', session_date: day4, session_time: '09:00', student_name: 'Liam Johnson', student_email: 'liamjohnson@email.com', student_phone: '8655550004', status: 'confirmed', reminder_48h_sent: false, reminder_4h_sent: false, created_at: now },
    ], { onConflict: 'id' });
    results.push({ table: 'bookings', error: bookingsErr?.message });

    const errors = results.filter(r => r.error);
    
    return NextResponse.json({
      success: errors.length === 0,
      seeded: results.length,
      results,
      errors: errors.length ? errors : undefined,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
