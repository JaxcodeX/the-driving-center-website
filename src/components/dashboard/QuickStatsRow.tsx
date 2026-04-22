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
  const [stats, setStats] = useState<Stats>({ revenue: 0, drives: 0, certs: 0, revenueHidden: true })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient()

      // Revenue: sum of paid payments this calendar month
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      let revenue = 0
      let drives = 0
      let certs = 0

      if (schoolId) {
        const { data: paymentData } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'paid')
          .eq('school_id', schoolId)
          .gte('created_at', startOfMonth.toISOString())

        revenue = (paymentData ?? []).reduce((sum, p) => sum + (p.amount ?? 0), 0) / 100

        const { count: driveCount } = await supabase
          .from('students_driver_ed')
          .select('id', { count: 'exact' })
          .eq('school_id', schoolId)
          .gt('driving_hours', 0)

        drives = driveCount ?? 0

        const { count: certCount } = await supabase
          .from('students_driver_ed')
          .select('id', { count: 'exact' })
          .eq('school_id', schoolId)
          .not('certificate_issued_at', 'is', null)

        certs = certCount ?? 0
      } else {
        // Fallback: global counts if no school_id (single-school mode)
        const { data: paymentData } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'paid')
          .gte('created_at', startOfMonth.toISOString())

        revenue = (paymentData ?? []).reduce((sum, p) => sum + (p.amount ?? 0), 0) / 100

        const { count: driveCount } = await supabase
          .from('students_driver_ed')
          .select('id', { count: 'exact' })
          .gt('driving_hours', 0)

        drives = driveCount ?? 0

        const { count: certCount } = await supabase
          .from('students_driver_ed')
          .select('id', { count: 'exact' })
          .not('certificate_issued_at', 'is', null)

        certs = certCount ?? 0
      }

      setStats({ revenue, drives, certs, revenueHidden: true })
      setLoading(false)
    }

    loadStats()
  }, [schoolId])

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-16 mb-2" />
            <div className="h-6 bg-white/10 rounded w-12" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Revenue */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-400 text-xs">Revenue</span>
          <button
            onClick={() => setStats((s) => ({ ...s, revenueHidden: !s.revenueHidden }))}
            className="text-gray-500 hover:text-gray-300 text-xs"
            title={stats.revenueHidden ? 'Show' : 'Hide'}
          >
            {stats.revenueHidden ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        <div className="text-xl font-bold text-white">
          {stats.revenueHidden ? '$••••' : `$${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
        </div>
      </div>

      {/* Drives */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-gray-400 text-xs mb-1">Drives</div>
        <div className="text-xl font-bold text-white">{stats.drives}</div>
      </div>

      {/* Certs */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-gray-400 text-xs mb-1">Certs</div>
        <div className="text-xl font-bold text-white">{stats.certs}</div>
      </div>
    </div>
  )
}
