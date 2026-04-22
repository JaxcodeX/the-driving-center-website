import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: instructor, error } = await supabase
    .from('instructors')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !instructor) {
    return new NextResponse('Instructor not found', { status: 404 })
  }

  return NextResponse.json(instructor)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const body = await request.json()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const schoolId = request.headers.get('x-school-id')
  const supabaseAdmin = await createClient()

  const { data: updated, error } = await supabaseAdmin
    .from('instructors')
    .update({
      name: body.name,
      email: body.email,
      phone: body.phone,
      license_number: body.license_number,
      license_expiry: body.license_expiry,
      active: body.active ?? true,
    })
    .eq('id', id)
    .eq('school_id', schoolId)
    .select()
    .single()

  if (error || !updated) {
    return NextResponse.json({ error: error?.message ?? 'Update failed' }, { status: 500 })
  }

  return NextResponse.json(updated)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const schoolId = _request.headers.get('x-school-id')
  const supabaseAdmin = await createClient()

  const { error } = await supabaseAdmin
    .from('instructors')
    .update({ active: false })
    .eq('id', id)
    .eq('school_id', schoolId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse('OK')
}
