'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, Calendar, Clock, CreditCard,
  Settings, LogOut, Bell, Menu, X, Upload, UserCheck,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',    href: '/school-admin' },
  { icon: Users,           label: 'Students',     href: '/school-admin/students' },
  { icon: Calendar,        label: 'Sessions',      href: '/school-admin/sessions' },
  { icon: Calendar,        label: 'Calendar',      href: '/school-admin/calendar' },
  { icon: UserCheck,       label: 'Instructors',   href: '/school-admin/instructors' },
  { icon: CreditCard,      label: 'Billing',        href: '/school-admin/billing' },
  { icon: Upload,          label: 'Import',         href: '/school-admin/import' },
]

function Sidebar({ schoolName, onClose }: { schoolName?: string; onClose?: () => void }) {
  const pathname = usePathname()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside className="flex flex-col h-full sidebar">
      {/* Logo */}
      <div className="logo-bar">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="dc-badge">DC</div>
          <span className="logo-name">The Driving Center</span>
        </Link>
        {onClose && (
          <button className="ml-auto p-1 md:hidden sidebar-close" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          // Check if current pathname matches href
          // For /school-admin (dashboard), exact match; for others, startsWith
          const isActive = href === '/school-admin'
            ? pathname === '/school-admin' || pathname === '/school-admin/'
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`nav-item ${isActive ? 'nav-item--active' : ''}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <Link href="/school-admin/profile" className="nav-item">
          <Settings className="w-4 h-4" />
          Settings
        </Link>

        {/* School name + avatar */}
        <div className="school-chip">
          <div className="avatar-circle">
            {schoolName ? schoolName[0].toUpperCase() : 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {schoolName || 'Your School'}
            </div>
          </div>
          <button onClick={handleLogout} className="flex-shrink-0 logout-btn" title="Log out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default function SchoolAdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [schoolName, setSchoolName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSchool() {
      const demoUserCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
      if (demoUserCookie) {
        try {
          const payload = JSON.parse(atob(decodeURIComponent(demoUserCookie.split('=')[1])))
          if (payload.schoolId) {
            const supabase = createClient()
            const { data: school } = await supabase
              .from('schools')
              .select('name')
              .eq('id', payload.schoolId)
              .single()
            setSchoolName(school?.name || '')
            setLoading(false)
            return
          }
        } catch { /* fall through */ }
      }

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="layout-root">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col sticky top-0 h-screen">
        <Sidebar schoolName={schoolName} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
          <div className="relative">
            <Sidebar schoolName={schoolName} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="topbar">
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -ml-2 topbar-hamburger"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block" />

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button className="topbar-icon-btn">
              <Bell className="w-5 h-5" />
            </button>
            <div className="avatar-circle">
              {schoolName ? schoolName[0].toUpperCase() : 'S'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
