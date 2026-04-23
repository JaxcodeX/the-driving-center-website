'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CalendarCheck, Users, TrendingUp, Bell, ArrowRight,
  Clock, GraduationCap, CheckCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import QuickStatsRow from '@/components/dashboard/QuickStatsRow'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } as const,
  }),
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  index,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color: string
  index: number
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="glass-card rounded-xl p-5 relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-4 translate-x-4`} style={{ background: color }} />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}22` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
        {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
      </div>
    </motion.div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    completed: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
    cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
  }
  const cls = styles[status?.toLowerCase()] ?? styles.pending
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${cls}`}>
      {status}
    </span>
  )
}

export default function SchoolAdminDashboard() {
  const [students, setStudents] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [schoolId, setSchoolId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const sid = user.user_metadata?.school_id ?? user.id
      setSchoolId(sid)

      const today = new Date().toISOString().split('T')[0]

      const [{ data: studentsData }, { data: sessionsData }, { data: bookingsData }] = await Promise.all([
        supabase
          .from('students_driver_ed')
          .select('id, legal_name, created_at, driving_hours, certificate_issued_at')
          .eq('school_id', sid)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('sessions')
          .select('id, start_date, start_time, seats_booked, max_seats')
          .eq('school_id', sid)
          .eq('cancelled', false)
          .gte('start_date', today)
          .order('start_date', { ascending: true })
          .limit(5),
        supabase
          .from('bookings')
          .select('id, student_name, session_date, start_time, status')
          .eq('school_id', sid)
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      setStudents(studentsData ?? [])
      setSessions(sessionsData ?? [])
      setRecentBookings(bookingsData ?? [])
      setLoading(false)
    }
    load()
  }, [])

  // Quick stats from sub-component
  const quickActions = [
    { href: '/school-admin/sessions', emoji: '📅', label: 'Sessions' },
    { href: '/school-admin/calendar', emoji: '🗓️', label: 'Calendar' },
    { href: '/school-admin/students', emoji: '🎓', label: 'Students' },
    { href: '/school-admin/import', emoji: '📥', label: 'Import CSV' },
    { href: '/school-admin/instructors', emoji: '👨‍🏫', label: 'Instructors' },
    { href: '/school-admin/availability', emoji: '⏰', label: 'Availability' },
  ]

  return (
    <div className="p-6 max-w-4xl">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-400 text-sm">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stats row */}
      <QuickStatsRow schoolId={schoolId} />

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-5"
      >
        {quickActions.map(({ href, emoji, label }, i) => (
          <Link
            key={href}
            href={href}
            className="glass flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl hover:bg-white/[0.08] transition-all text-center group"
          >
            <span className="text-lg">{emoji}</span>
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{label}</span>
          </Link>
        ))}
      </motion.div>

      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-5"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-white text-sm">Recent Bookings</h2>
          <Link href="/school-admin/sessions" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="glass rounded-xl p-5 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-white/[0.04] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <CalendarCheck className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No recent bookings.</p>
          </div>
        ) : (
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Student</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-4 py-3 hidden sm:table-cell">Date</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-4 py-3 hidden md:table-cell">Time</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-white font-medium">{b.student_name}</div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-gray-400">
                        {b.session_date
                          ? new Date(`${b.session_date}T12:00:00`).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric',
                            })
                          : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-400">{b.start_time ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status ?? 'pending'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Upcoming sessions + recent students side by side on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
        {/* Upcoming sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white text-sm">Upcoming Sessions</h2>
            <Link href="/school-admin/sessions" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="glass rounded-xl p-4 space-y-2">
              {[1, 2].map(i => <div key={i} className="h-10 bg-white/[0.04] rounded-lg animate-pulse" />)}
            </div>
          ) : sessions.length === 0 ? (
            <div className="glass rounded-xl p-6 text-center">
              <Clock className="w-6 h-6 text-gray-600 mx-auto mb-1" />
              <p className="text-gray-500 text-xs">No upcoming sessions.</p>
            </div>
          ) : (
            <div className="glass rounded-xl overflow-hidden divide-y divide-white/[0.04]">
              {sessions.map(s => (
                <div key={s.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white font-medium">
                      {new Date(`${s.start_date}T12:00:00`).toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric',
                      })}{' '}
                      at {s.start_time}
                    </div>
                    <div className="text-xs text-gray-500">{s.seats_booked}/{s.max_seats} seats booked</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white text-sm">Recent Students</h2>
            <Link href="/school-admin/students" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="glass rounded-xl p-4 space-y-2">
              {[1, 2].map(i => <div key={i} className="h-10 bg-white/[0.04] rounded-lg animate-pulse" />)}
            </div>
          ) : students.length === 0 ? (
            <div className="glass rounded-xl p-6 text-center">
              <GraduationCap className="w-6 h-6 text-gray-600 mx-auto mb-1" />
              <p className="text-gray-500 text-xs">No students yet.</p>
            </div>
          ) : (
            <div className="glass rounded-xl overflow-hidden divide-y divide-white/[0.04]">
              {students.map(s => (
                <div key={s.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white font-medium">{s.legal_name ?? 'Student'}</div>
                    <div className="text-xs text-gray-500">
                      {s.driving_hours ?? 0}h driven ·{' '}
                      {s.certificate_issued_at
                        ? <span className="text-emerald-400 flex items-center gap-0.5 inline"><CheckCircle className="w-3 h-3" /> Certified</span>
                        : 'In progress'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(s.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
