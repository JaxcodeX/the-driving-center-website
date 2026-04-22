import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { auditLog } from '@/lib/security'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  // Look up school by slug (used as public URL: /school/[slug])
  const { data: school, error } = await supabase
    .from('schools')
    .select('id, name, phone, state, service_zips, plan_tier')
    .eq('slug', slug)
    .single()

  if (error || !school) {
    return new NextResponse('School not found', { status: 404 })
  }

  // Get active session types
  const { data: sessionTypes } = await supabase
    .from('session_types')
    .select('id, name, description, duration_minutes, price_cents, deposit_cents, color, tca_hours_credit')
    .eq('school_id', school.id)
    .eq('active', true)
    .order('price_cents', { ascending: true })

  // Get school profile (public info)
  const { data: profile } = await supabase
    .from('school_profiles')
    .select('tagline, about, address, city, zip, email, website, facebook, instagram')
    .eq('school_id', school.id)
    .single()

  return NextResponse.json({
    school: {
      name: school.name,
      phone: school.phone,
      state: school.state,
      slug,
    },
    profile: profile ?? {},
    session_types: sessionTypes ?? [],
  })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const body = await request.json()

  const supabaseAdmin = await createClient()

  // Get school
  const { data: school } = await supabaseAdmin
    .from('schools')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!school) return new NextResponse('School not found', { status: 404 })

  // Upsert school profile
  const { data: profile, error } = await supabaseAdmin
    .from('school_profiles')
    .upsert(
      {
        school_id: school.id,
        tagline: body.tagline ?? null,
        about: body.about ?? null,
        address: body.address ?? null,
        city: body.city ?? null,
        zip: body.zip ?? null,
        email: body.email ?? null,
        website: body.website ?? null,
        facebook: body.facebook ?? null,
        instagram: body.instagram ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'school_id' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabaseAdmin.from('audit_logs').insert(
    auditLog('SCHOOL_PROFILE_UPDATED', user.id, { school_id: school.id })
  )

  return NextResponse.json(profile)
}
