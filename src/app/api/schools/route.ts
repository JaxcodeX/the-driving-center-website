import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const body = await request.json()
  const { schoolName, email } = body

  if (!schoolName || !email) {
    return NextResponse.json({ error: 'schoolName and email required' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  const supabase = createClient(url, key)
  
  const slug = schoolName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) + '-' + Date.now().toString(36)

  const { data, error } = await supabase
    .from('schools')
    .insert({ name: schoolName, slug, owner_email: email, active: true, plan_tier: 'starter', state: 'TN' })
    .select('id, name')

  return NextResponse.json({ ok: !!data, data, error: error?.message, url: url.slice(0, 20) })
}
