import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { auditLog } from '@/lib/security'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const instructorId = searchParams.get('instructor_id')

  if (!instructorId) {
    return NextResponse.json({ error: 'instructor_id required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: windows, error } = await supabase
    .from('instructor_availability')
    .select('*')
    .eq('instructor_id', instructorId)
    .order('day_of_week')
    .order('start_time')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(windows ?? [])
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const schoolId = request.headers.get('x-school-id')
  if (!schoolId) return new NextResponse('Missing x-school-id', { status: 400 })

  const body = await request.json()
  const { availability } = body // array of { instructor_id, day_of_week, start_time, end_time, location }

  if (!Array.isArray(availability)) {
    return NextResponse.json({ error: 'availability array required' }, { status: 400 })
  }

  const supabaseAdmin = await createClient()

  // Delete existing and replace (upsert pattern)
  for (const window of availability) {
    if (!window.instructor_id || window.day_of_week === undefined || !window.start_time || !window.end_time) {
      continue
    }

    const { error } = await supabaseAdmin
      .from('instructor_availability')
      .upsert(
        {
          instructor_id: window.instructor_id,
          day_of_week: window.day_of_week,
          start_time: window.start_time,
          end_time: window.end_time,
          location: window.location ?? null,
        },
        { onConflict: 'instructor_id,day_of_week,start_time' }
      )

    if (error) {
      console.error('Availability upsert error:', error)
    }
  }

  await supabaseAdmin.from('audit_logs').insert(
    auditLog('INSTRUCTOR_AVAILABILITY_UPDATED', user.id, {
      school_id: schoolId,
      instructor_count: availability.length,
    })
  )

  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { searchParams } = new URL(request.url)
  const windowId = searchParams.get('id')

  if (!windowId) return new NextResponse('Window ID required', { status: 400 })

  const supabaseAdmin = await createClient()
  const { error } = await supabaseAdmin
    .from('instructor_availability')
    .delete()
    .eq('id', windowId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse('OK')
}
