import { NextResponse } from 'next/server'
import { createClient, getSupabaseAdmin } from '@/lib/supabase/server'
import { auditLog } from '@/lib/security'
import type { Instructor } from '@/lib/supabase/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const schoolId = searchParams.get('school_id')

  if (!schoolId) {
    return new NextResponse('Missing school_id', { status: 400 })
  }

  const supabase = await createClient()
  // Cast through any to bypass Supabase schema inference (no generated Database type)
  const { data: instructors, error } = await (supabase as any)
    .from('instructors')
    .select('*')
    .eq('school_id', schoolId)
    .eq('active', true)
    .order('created_at', { ascending: true }) as { data: Instructor[] | null, error: unknown }

  if (error) {
    return NextResponse.json({ error: (error as { message?: string }).message ?? String(error) }, { status: 500 })
  }

  return NextResponse.json(instructors ?? [])
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
  const { name, email, phone, license_number, license_expiry } = body

  if (!name) return new NextResponse('Name required', { status: 400 })

  const supabaseAdmin = getSupabaseAdmin()
  const { data: instructor, error } = await (supabaseAdmin as any)
    .from('instructors')
    .insert({
      school_id: schoolId,
      name,
      email: email ?? null,
      phone: phone ?? null,
      license_number: license_number ?? null,
      license_expiry: license_expiry ?? null,
      active: true,
    })
    .select()
    .single() as { data: Instructor, error: unknown }

  if (error) return NextResponse.json({ error: (error as { message?: string }).message ?? String(error) }, { status: 500 })

  await (supabaseAdmin as any).from('audit_logs').insert(
    auditLog('INSTRUCTOR_CREATED', user.id, {
      instructor_id: instructor.id,
      school_id: schoolId,
      name,
      license_expiry,
    })
  )

  return NextResponse.json(instructor, { status: 201 })
}
