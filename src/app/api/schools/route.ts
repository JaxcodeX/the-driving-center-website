import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const body = await request.json()
  const { schoolName, email } = body

  if (!schoolName || !email) {
    return NextResponse.json({ error: 'schoolName and email required' }, { status: 400 })
  }

  // Demo mode: skip Supabase entirely
  if (process.env.DEMO_MODE === 'true') {
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'https://the-driving-center-website.vercel.app'
    return NextResponse.json({
      schoolId: 'demo-' + Date.now().toString(36),
      slug: 'demo-school',
      checkoutUrl: `${origin}/onboarding?school_id=demo-${Date.now().toString(36)}&step=profile&demo=true`,
      demoMode: true,
      msg: 'DEMO_MODE=true, skipped Supabase',
    })
  }

  // Non-demo: try Supabase
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const slug = schoolName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) + '-' + Date.now().toString(36)
    const { data, error } = await supabase
      .from('schools')
      .insert({ name: schoolName, slug, owner_email: email, active: true, plan_tier: 'starter', state: 'TN' })
      .select('id, name')

    return NextResponse.json({ ok: true, data, error: error?.message })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err), demoMode: process.env.DEMO_MODE }, { status: 500 })
  }
}
