'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  GraduationCap,
  Calendar,
  Car,
  Clock,
  DollarSign,
  Settings,
} from 'lucide-react'

export type NavItem = {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/school-admin' },
  { icon: GraduationCap, label: 'Students', href: '/school-admin/students' },
  { icon: Calendar, label: 'Sessions', href: '/school-admin/sessions' },
  { icon: Car, label: 'Instructors', href: '/school-admin/instructors' },
  { icon: Clock, label: 'Calendar', href: '/school-admin/calendar' },
  { icon: DollarSign, label: 'Billing', href: '/school-admin/billing' },
  { icon: Settings, label: 'Settings', href: '/school-admin/profile' },
]

export function getAdminNavItems(currentPath: string): NavItem[] {
  return ADMIN_NAV_ITEMS.map(item => ({
    ...item,
    active: item.href === '/school-admin'
      ? currentPath === '/school-admin' || currentPath === '/school-admin/'
      : currentPath.startsWith(item.href),
  }))
}

interface SidebarProps {
  navItems: NavItem[]
}

export function Sidebar({ navItems }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="admin-sidebar">
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <Link href="/school-admin" className="admin-sidebar-logo-link">
            <div className="admin-sidebar-logo-icon">
              <Car className="w-4 h-4" style={{ color: '#000' }} />
            </div>
            <div>
              <div className="admin-sidebar-logo-title">Driving Center</div>
              <div className="admin-sidebar-logo-sub">School Admin</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="admin-sidebar-nav">
          {navItems.map(({ icon: NavIcon, label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={`admin-sidebar-nav-item${active ? ' active' : ''}`}
            >
              <NavIcon className="admin-sidebar-nav-icon" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="admin-sidebar-bottom">
          <p className="admin-sidebar-school-name">Your Driving School</p>
        </div>
      </aside>

      {/* Mobile nav pills */}
      <nav className="admin-nav-pills">
        {navItems.map(({ icon: NavIcon, label, href, active }) => (
          <Link
            key={label}
            href={href}
            className={`admin-nav-pill${active ? ' active' : ''}`}
          >
            <NavIcon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}

interface TopBarProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <div className="admin-topbar">
      <div>
        <h1 className="admin-topbar-title">{title}</h1>
        {subtitle && <p className="admin-topbar-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="admin-topbar-actions">{actions}</div>}
    </div>
  )
}

interface AdminShellProps {
  children: ReactNode
  currentPath: string
  topBar?: { title: string; subtitle?: string; actions?: ReactNode }
}

export default function AdminShell({ children, currentPath, topBar }: AdminShellProps) {
  const navItems = getAdminNavItems(currentPath)

  return (
    <div className="admin-shell">
      <Sidebar navItems={navItems} />
      <main className="admin-main">
        {topBar && <TopBar {...topBar} />}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}