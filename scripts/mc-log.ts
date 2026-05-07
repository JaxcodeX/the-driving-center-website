#!/usr/bin/env node
/**
 * scripts/mc-log.ts — Everest's Mission Control action logger
 *
 * Usage:
 *   npx tsx scripts/mc-log.ts --action "task-done" --details "Fixed schools INSERT column"
 *   npx tsx scripts/mc-log.ts --action "task-created" --details "Build the booking flow"
 *   npx tsx scripts/mc-log.ts --action "decision" --details "Going with Stripe billing portal"
 *   npx tsx scripts/mc-log.ts --action "bug-found" --details "students vs students_driver_ed mismatch"
 *
 * Environment:
 *   SUPABASE_URL=https://evswdlsqlaztvajibgta.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=<key>
 */

import { parseArgs } from 'node:util'

interface LogEntry {
  action: string
  details?: string
  source?: string
  status?: string
}

async function main() {
  const { values } = parseArgs({
    options: {
      action: { type: 'string' },
      details: { type: 'string' },
      source: { type: 'string' },
      status: { type: 'string' },
      help: { type: 'boolean' },
    },
    allowPositionals: true,
  })

  if (values.help) {
    console.log(`
Everest Mission Control Logger

Usage:
  npx tsx scripts/mc-log.ts --action <action> [--details <text>] [--source <source>] [--status <status>]

Examples:
  npx tsx scripts/mc-log.ts --action "task-done" --details "Fixed schools INSERT column"
  npx tsx scripts/mc-log.ts --action "decision" --details "Going with date-only booking"
  npx tsx scripts/mc-log.ts --action "bug-found" --details "students vs students_driver_ed mismatch"

Options:
  --action    Required. Short action label (e.g. task-done, decision, bug-fixed)
  --details   Optional. Additional context about the action
  --source    Optional. Who/what triggered this. Default: Everest
  --status    Optional. active|pending|done|error|idle. Default: active
  --help      Show this help message
`)
    process.exit(0)
  }

  const { action, details, source = 'Everest', status = 'active' } = values as LogEntry & { help?: boolean }

  if (!action) {
    console.error('Error: --action is required')
    process.exit(1)
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
    process.exit(1)
  }

  const payload = { action, details, source, status }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/mc_activity_log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`Failed to log: ${res.status} ${err}`)
      process.exit(1)
    }

    const data = await res.json()
    console.log(`✓ Logged: [${source}] ${action}${details ? ` — ${details}` : ''}`)
    return data
  } catch (err) {
    console.error(`Network error: ${err}`)
    process.exit(1)
  }
}

main()
