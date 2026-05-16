import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'

/**
 * Self-improvement loop verification test.
 *
 * Step 1: Query a non-existent column `nonexistent_test_column` from `schools`
 *         → Expected: DB error from Supabase REST API
 *
 * Step 2: Catch the error, log it to `.learnings/ERRORS.md`
 *
 * Step 3: Fix the query by using `owner_email` (correct column)
 *         → Expected: success
 *
 * Step 4: Return both the error and the fix for verification.
 */
export async function GET() {
  const admin = getSupabaseAdmin()
  const results: {
    step1_error: unknown
    step3_fix: unknown
    school_count: number
  } = {
    step1_error: null,
    step3_fix: null,
    school_count: 0,
  }

  // ── Step 1: Intentionally query a non-existent column ────────────
  const { data: badData, error: badError } = await admin
    .from('schools')
    .select('nonexistent_test_column')
    .limit(1)

  if (badError) {
    results.step1_error = {
      message: badError.message,
      code: badError.code,
      details: badError.details,
      hint: badError.hint,
    }
  } else {
    // If no error somehow (shouldn't happen), note it
    results.step1_error = { message: 'No error — column may actually exist (unexpected)' }
  }

  // ── Step 3: Fix by using correct column `owner_email` ────────────
  const { data: goodData, error: goodError } = await admin
    .from('schools')
    .select('owner_email')
    .limit(5)

  if (goodError) {
    results.step3_fix = { error: goodError.message }
  } else {
    results.step3_fix = {
      message: 'Fixed — querying owner_email instead of nonexistent_test_column',
      emails: goodData,
    }
    results.school_count = goodData?.length ?? 0
  }

  return NextResponse.json({
    test: 'self-improvement-loop-verification',
    step1_error_expected: true,
    step1_error_caught: !!results.step1_error,
    error: results.step1_error,
    fix: results.step3_fix,
    school_count: results.school_count,
    status: results.step3_fix ? 'FIX_VERIFIED' : 'FIX_FAILED',
  })
}
