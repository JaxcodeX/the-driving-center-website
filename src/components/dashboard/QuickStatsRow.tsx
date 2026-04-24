'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Stats = {
  revenue: number
  drives: number
  certs: number
  revenueHidden: boolean
}

export default function QuickStatsRow({ schoolId }: { schoolId?: string }) {
  const [stats, setStats] = useState<Stats>({
    revenue: 0,
    drives: 0,
    certs: 0,
    revenueHidden: true,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient()

      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      let revenue = 0
      let drives = 0
      let certs = 0

      if (schoolId) {
        // Revenue: sum of paid payments this calendar month
        const { data: paymentData } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'paid')
          .eq('school_id', schoolId)
          .gte('created_at', startOfMonth.toISOString())

        revenue = (paymentData ?? []).reduce((sum, p) => sum + (p.amount ?? 0), 0) / 100

        // Drives: students with at least some TCA driving hours logged
        const { count: driveCount } = await supabase
          .from('students')
          .select('id', { count: 'exact' })
          .eq('school_id', schoolId)
          .gt('tca_driving_hours', 0)

        drives = driveCount ?? 0

        // Certs: students who have been issued a TCA certificate
        const { count: certCount } = await supabase
          .from('students')
          .select('id', { count: 'exact' })
          .eq('school_id', schoolId)
          .eq('tca_certificate_issued', true)

        certs = certCount ?? 0
      } else {
        // Fallback: global counts if no school_id (dev mode)
        const { data: paymentData } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'paid')
          .gte('created_at', startOfMonth.toISOString())

        revenue = (paymentData ?? []).reduce((sum, p) => sum + (p.amount ?? 0), 0) / 100

        const { count: driveCount } = await supabase
          .from('students')
          .select('id', { count: 'exact' })
          .gt('tca_driving_hours', 0)

        drives = driveCount ?? 0

        const { count: certCount } = await supabase
          .from('students')
          .select('id', { count: 'exact' })
          .eq('tca_certificate_issued', true)

        certs = certCount ?? 0
      }

      setStats({ revenue, drives, certs, revenueHidden: true })
      setLoading(false)
    }

    loadStats()
  }, [schoolId])

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Revenue */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Revenue</div>
        {loading ? (
          <div className="h-6 w-16 bg-white/5 rounded animate-pulse mx-auto" />
        ) : (
          <button
            className="text-xl font-bold text-white cursor-pointer"
            onClick={() => setStats((s) => ({ ...s, revenueHidden: !s.revenueHidden }))}
            title="Click to toggle"
          >
            {stats.revenueHidden ? '••••' : `$${stats.revenue.toLocaleString()}`}
          </button>
        )}
        <div className="text-xs text-gray-600 mt-0.5">this month</div>
      </div>

      {/* Drives */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Drives</div>
        {loading ? (
          <div className="h-6 w-8 bg-white/5 rounded animate-pulse mx-auto" />
        ) : (
          <div className="text-xl font-bold text-white">{stats.drives}</div>
        )}
        <div className="text-xs text-gray-600 mt-0.5">students</div>
      </div>

      {/* Certs */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Certs</div>
        {loading ? (
          <div className="h-6 w-8 bg-white/5 rounded animate-pulse mx-auto" />
        ) : (
          <div className="text-xl font-bold text-white">{stats.certs}</div>
        )}
        <div className="text-xs text-gray-600 mt-0.5">issued</div>
      </div>
    </div>
  )
}
