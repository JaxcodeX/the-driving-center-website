import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import type { McActivityLogRow } from '@/lib/supabase/database.types'

// GET /api/mc/agent-status — returns live status of all agents
export async function GET() {
  try {
    // Always-online agents
    const staticAgents = {
      cayden: 'online',
      everest: 'online',
    }

    // Try to get active subagents from Supabase (seeded in mc_activity_log for now)
    // In production, this would poll the OpenClaw gateway
    const admin = getSupabaseAdmin()
    const { data: recentActivity } = await admin
      .from('mc_activity_log')
      .select('source, action, created_at')
      .order('created_at', { ascending: false })
      .limit(20) as any

    const now = Date.now()
    const fiveMin = 5 * 60 * 1000

    const dynamicAgents: Record<string, string> = {
      minimax: 'offline',
      deepseek: 'offline',
      claudecode: 'offline',
      codex: 'offline',
      subagent: 'offline',
    }

    if (recentActivity) {
      for (const entry of recentActivity as Array<{source?:string; action?:string; created_at:string}>) {
        const age = now - new Date(entry.created_at).getTime()
        if (age > fiveMin) continue

        const source = (entry.source || '').toLowerCase()
        const action = (entry.action || '').toLowerCase()

        if (source.includes('minimax') || action.includes('minimax')) {
          dynamicAgents.minimax = 'online'
        }
        if (source.includes('deepseek') || action.includes('deepseek')) {
          dynamicAgents.deepseek = 'online'
        }
        if (source.includes('claude') || action.includes('claude') || source.includes('codex')) {
          dynamicAgents.claudecode = 'standby'
        }
        if (source.includes('codex') || action.includes('codex')) {
          dynamicAgents.codex = 'standby'
        }
        if (source.includes('subagent') || action.includes('subagent')) {
          dynamicAgents.subagent = 'online'
        }
      }
    }

    const agents = { ...staticAgents, ...dynamicAgents }

    return NextResponse.json({
      agents,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
