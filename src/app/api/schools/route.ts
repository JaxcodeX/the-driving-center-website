import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { schoolName, email } = body

    if (!schoolName || !email) {
      return NextResponse.json({ error: 'schoolName and email required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const demoMode = process.env.DEMO_MODE
    const stripeKey = process.env.STRIPE_SECRET_KEY ? '[SET]' : '[NOT SET]'

    // Try to create school record directly
    const supabase = createSupabaseAdmin(supabaseUrl, supabaseKey)
    const slug = schoolName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) + '-' + Date.now().toString(36)

    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .insert({
        name: schoolName,
        slug,
        owner_email: email,
        active: true,
        plan_tier: 'starter',
        state: 'TN',
      })
      .select('id, name')
      .single()

    return NextResponse.json({
      ok: true,
      demoMode,
      stripeKey,
      supabaseUrl,
      school: school,
      schoolError: schoolError?.message,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
