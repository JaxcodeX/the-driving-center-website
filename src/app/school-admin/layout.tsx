'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, Calendar, Clock, CreditCard,
  Settings, LogOut, Bell, ChevronRight, Menu, X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const T = {
  bg:        '#050505',
  surface:   '#0D0D0D',
  elevated:  '#18181b',
  border:    '#1A1A1A',
  borderLt:  '#27272a',
  text:      '#ffffff',
  secondary: '#94A3B8',
  muted:     '#52525b',
  cyan:      '#38BDF8',
  purple:    '#818CF8',
  green:     '#10B981',
  grad:      'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/school-admin' },
  { icon: Users,          label: 'Students',   href: '/school-admin/students' },
  { icon: Calendar,      label: 'Sessions',   href: '/school-admin/sessions' },
  { icon: Clock,         label: 'Calendar',   href: '/school-admin/calendar' },
  { icon: CreditCard,    label: 'Billing',   href: '/school-admin/billing' },
  { icon: Settings,      label: 'Settings',   href: '/school-admin/profile' },
]

function Sidebar({
  schoolName,
  onClose,
}: {
  schoolName?: string
  onClose?: () => void
}) {
  const pathname = usePathname()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside
      className="flex flex-col h-full"
      style={{ background: T.surface, borderRight: `1px solid ${T.border}` }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: T.border }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
            style={{ background: T.grad }}
          >
            DC
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight" style={{ color: T.text }}>
              {schoolName || 'Your School'}
            </div>
            <div className="text-xs" style={{ color: T.muted }}>School Admin</div>
          </div>
        </Link>
        {onClose && (
          <button
            className="ml-auto p-1 md:hidden"
            onClick={onClose}
            style={{ color: T.muted }}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active ? T.elevated : 'transparent',
                color: active ? T.cyan : T.secondary,
                borderLeft: active ? `2px solid ${T.cyan}` : '2px solid transparent',
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" style={{ color: active ? T.cyan : T.muted }} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: T.border }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all"
          style={{ color: T.muted }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = T.elevated)}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
        >
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
    </aside>
  )
}

export default function SchoolAdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [schoolName, setSchoolName] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSchool() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data: school } = await supabase
        .from('schools')
        .select('name')
        .eq('owner_user_id', user.id)
        .single()

      setSchoolName(school?.name || '')
      setLoading(false)
    }
    loadSchool()
  }, [])

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: T.bg }}
      >
        <div className="text-sm" style={{ color: T.muted }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: T.bg }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-60 flex-shrink-0 sticky top-0 h-screen">
        <Sidebar schoolName={schoolName} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 flex-shrink-0">
            <Sidebar
              schoolName={schoolName}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 h-16 flex-shrink-0"
          style={{
            background: T.surface,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -ml-2"
            style={{ color: T.secondary }}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block" />

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-xl transition-colors"
              style={{ color: T.muted }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = T.elevated)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <Bell className="w-5 h-5" />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: T.grad, color: T.text }}
            >
              {schoolName ? schoolName[0].toUpperCase() : 'S'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
