import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    const admin = getSupabaseAdmin()
    const { data, error } = await admin.from('schools').select('id').limit(1)
    return NextResponse.json({ ok: true, hasData: !!data, error: error?.message })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
