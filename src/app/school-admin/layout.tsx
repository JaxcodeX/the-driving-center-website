'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logoBar}>
        <Link href="/" style={styles.logoLink}>
          <div style={styles.dcBadge}>DC</div>
          <span style={styles.logoName}>The Driving Center</span>
        </Link>
        {onClose && (
          <button style={styles.sidebarClose} onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = href === '/school-admin'
            ? pathname === '/school-admin' || pathname === '/school-admin/'
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={styles.sidebarFooter}>
        <Link href="/school-admin/profile" style={styles.navItem}>
          <Settings className="w-5 h-5" />
          Settings
        </Link>

        {/* School name + avatar */}
        <div style={styles.schoolChip}>
          <div style={styles.avatarCircle}>
            {schoolName ? schoolName[0].toUpperCase() : 'S'}
          </div>
          <div style={styles.minW0}>
            <div style={styles.schoolNameText}>
              {schoolName || 'Your School'}
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn} title="Log out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  )
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '260px',
    background: '#0A0A0B',
    borderRight: '1px solid #1A1A1A',
    flexShrink: 0,
  },
  logoBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px 16px',
    borderBottom: '1px solid #1A1A1A',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  dcBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: '#4ADE80',
    color: '#000',
    fontSize: '13px',
    fontWeight: '800',
    fontFamily: 'Outfit, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Outfit, sans-serif',
  },
  sidebarClose: {
    marginLeft: 'auto',
    padding: '4px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#9CA3AF',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    flex: 1,
    padding: '12px 8px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 12px',
    height: '44px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#9CA3AF',
    textDecoration: 'none',
    transition: 'background 0.15s, color 0.15s',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    width: '100%',
    textAlign: 'left',
  },
  navItemActive: {
    color: '#FFFFFF',
    background: '#1A1A1A',
    borderLeft: '2px solid #4ADE80',
    paddingLeft: '10px',
  },
  sidebarFooter: {
    padding: '12px 8px',
    borderTop: '1px solid #1A1A1A',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  schoolChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '12px',
    background: '#0F1117',
    border: '1px solid #1A1A1A',
  },
  avatarCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4ADE80, #22D3EE)',
    color: '#000',
    fontSize: '12px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  minW0: {
    minWidth: 0,
    flex: 1,
    overflow: 'hidden',
  },
  schoolNameText: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#FFFFFF',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutBtn: {
    padding: '4px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#6B7280',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.15s',
    flexShrink: 0,
  },
}

export default function SchoolAdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [schoolName, setSchoolName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSchool() {
      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))

      if (demoCookie) {
        try {
          const res = await fetch('/api/demo/school')
          if (res.ok) {
            const data = await res.json()
            setSchoolName(data.name || '')
            setLoading(false)
            return
          }
        } catch { /* fall through */ }
        setLoading(false)
        return
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
        <div style={{ fontSize: '14px', color: '#6B7280' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={layoutStyles.root}>
      {/* Desktop sidebar */}
      <div style={layoutStyles.desktopSidebar}>
        <Sidebar schoolName={schoolName} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div style={layoutStyles.mobileOverlay}>
          <div style={layoutStyles.mobileBackdrop} onClick={() => setMobileOpen(false)} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Sidebar schoolName={schoolName} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={layoutStyles.main}>
        {/* Top bar */}
        <header style={layoutStyles.topbar}>
          {/* Mobile hamburger */}
          <button
            style={layoutStyles.hamburger}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div style={{ display: 'block' }} />

          {/* Right side */}
          <div style={layoutStyles.topbarRight}>
            <button style={layoutStyles.topbarIconBtn}>
              <Bell className="w-5 h-5" />
            </button>
            <div style={layoutStyles.topbarAvatar}>
              {schoolName ? schoolName[0].toUpperCase() : 'S'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={layoutStyles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  )
}

const layoutStyles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: '#050505',
  },
  desktopSidebar: {
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
    flexShrink: 0,
  },
  mobileOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
  },
  mobileBackdrop: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  topbar: {
    height: '64px',
    background: '#050505',
    borderBottom: '1px solid #1A1A1A',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    gap: '16px',
    flexShrink: 0,
  },
  hamburger: {
    padding: '8px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#9CA3AF',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '-8px',
  },
  topbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  topbarIconBtn: {
    padding: '8px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#9CA3AF',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s, color 0.15s',
  },
  topbarAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4ADE80, #22D3EE)',
    color: '#000',
    fontSize: '13px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px',
  },
}
