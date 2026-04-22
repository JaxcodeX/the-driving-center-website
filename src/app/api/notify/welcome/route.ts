import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const schoolId = request.headers.get('x-school-id')
  if (!schoolId) return new NextResponse('Missing x-school-id', { status: 400 })

  // Get school details
  const supabaseAdmin = await createClient()
  const { data: school } = await supabaseAdmin
    .from('schools')
    .select('id, name, email')
    .eq('id', schoolId)
    .single()

  if (!school) return new NextResponse('School not found', { status: 404 })

  try {
    await sendWelcomeEmail(school.email, school.name, school.id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}