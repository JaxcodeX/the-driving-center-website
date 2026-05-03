import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only allow access if DEMO_OWNER_EMAIL is configured — fail if missing
  const DEMO_OWNER_EMAIL = process.env.DEMO_OWNER_EMAIL
  if (!DEMO_OWNER_EMAIL) {
    return NextResponse.json({ error: 'DEMO_OWNER_EMAIL environment variable not configured' }, { status: 500 })
  }
  if (user.email !== DEMO_OWNER_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const VERCEL_TOKEN = process.env.VERCEL_TOKEN ?? process.env.OPENCLAW_VERCEL_TOKEN ?? ''
  const PROJECT_ID = 'prj_V4Pu15pN58SyW7t86wwPkJUORizI'

  if (!VERCEL_TOKEN) {
    return NextResponse.json({ error: 'Vercel token not configured' }, { status: 500 })
  }

  try {
    // Get recent deployments
    const deploymentsRes = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const deploymentsData = await deploymentsRes.json()
    const deployments = (deploymentsData.deployments ?? []).map((d: any) => ({
      uid: d.uid,
      state: d.state,
      createdAt: d.createdAt,
      target: d.target ?? null,
      meta: d.meta ?? {},
    }))

    // Get current env vars
    const envRes = await fetch(
      `https://api.vercel.com/v6/projects/${PROJECT_ID}/env?target=production`,
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      }
    )
    const envData = await envRes.json()
    const envVars = (envData.envs ?? []).map((e: any) => ({
      key: e.key,
      value: e.value?.slice(0, 20) + (e.value?.length > 20 ? '...' : ''),
    }))

    return NextResponse.json({
      deployments,
      envVars,
      connected: true,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, connected: false }, { status: 500 })
  }
}
