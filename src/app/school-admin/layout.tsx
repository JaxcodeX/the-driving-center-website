'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  GraduationCap,
  Calendar,
  Car,
  Clock,
  DollarSign,
  Settings,
} from 'lucide-react'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/school-admin' },
  { icon: GraduationCap, label: 'Students', href: '/school-admin/students' },
  { icon: Calendar, label: 'Sessions', href: '/school-admin/sessions' },
  { icon: Car, label: 'Instructors', href: '/school-admin/instructors' },
  { icon: Clock, label: 'Calendar', href: '/school-admin/calendar' },
  { icon: DollarSign, label: 'Billing', href: '/school-admin/billing' },
  { icon: Settings, label: 'Settings', href: '/school-admin/profile' },
]

function isActive(href: string, pathname: string) {
  if (href === '/school-admin') return pathname === '/school-admin' || pathname === '/school-admin/'
  return pathname.startsWith(href)
}

export default function SchoolAdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--admin-bg, #000000)',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Background mesh gradient */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at 20% 20%, rgba(139,92,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(236,72,153,0.06) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Sidebar */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        background: 'var(--admin-surface, #0F0F0F)',
        borderRight: '1px solid var(--admin-border, rgba(255,255,255,0.06))',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflowY: 'auto',
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{
          padding: '28px 20px 20px',
          borderBottom: '1px solid var(--admin-border, rgba(255,255,255,0.06))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--admin-accent, #4ADE80), var(--status-cyan, #22D3EE))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Car className="w-4 h-4" style={{ color: '#000' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.2 }}>Driving Center</div>
              <div style={{ fontSize: '10px', color: 'var(--admin-text-secondary, #9CA3AF)', fontWeight: '500' }}>School Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV_ITEMS.map(({ icon: NavIcon, label, href }) => {
              const active = isActive(href, pathname)
              return (
                <Link
                  key={label}
                  href={href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                    borderLeft: active ? '3px solid var(--admin-accent, #4ADE80)' : '3px solid transparent',
                    boxShadow: active ? '0 0 12px rgba(74,222,128,0.2)' : 'none',
                    transition: 'background 0.15s',
                  }}
                >
                  <NavIcon className="w-4 h-4" style={{ color: active ? 'var(--admin-accent, #4ADE80)' : 'var(--admin-text-secondary, #9CA3AF)', flexShrink: 0 }} />
                  <span style={{
                    fontSize: '13px',
                    fontWeight: active ? '600' : '500',
                    color: active ? '#FFFFFF' : 'var(--admin-text-secondary, #9CA3AF)',
                  }}>
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--admin-border, rgba(255,255,255,0.06))',
        }}>
          <p style={{ fontSize: '10px', color: 'var(--admin-text-secondary, #9CA3AF)', fontWeight: '500' }}>Your Driving School</p>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: '240px',
        padding: '40px 48px',
        maxWidth: '1200px',
        position: 'relative',
        zIndex: 1,
      }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-main { margin-left: 0 !important; padding: 24px 16px !important; }
        }
      `}</style>
    </div>
  )
}
