'use client'

import { ReactNode, useState } from 'react'
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
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/school-admin' },
  { icon: GraduationCap, label: 'Students', href: '/school-admin/students' },
  { icon: Calendar, label: 'Sessions', href: '/school-admin/sessions' },
  { icon: Car, label: 'Instructors', href: '/school-admin/instructors' },
  { icon: Clock, label: 'Calendar', href: '/school-admin/calendar' },
  { icon: DollarSign, label: 'Billing', href: '/school-admin/billing' },
  { icon: Settings, label: 'Settings', href: '/school-admin/settings' },
]

function isActive(href: string, pathname: string) {
  if (href === '/school-admin') return pathname === '/school-admin' || pathname === '/school-admin/'
  return pathname.startsWith(href)
}

const TEXT_SECONDARY = '#9CA3AF'
const GLASS_BORDER = 'rgba(255,255,255,0.06)'
const GLASS_BG = 'rgba(255,255,255,0.03)'
const ACCENT_GREEN = '#4ADE80'

export default function SchoolAdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

      {/* Mobile backdrop overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="admin-sidebar-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}
        style={{
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
          zIndex: 201,
          transition: 'transform 0.3s ease',
        }}
      >
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
                  onClick={() => setSidebarOpen(false)}
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
                    minHeight: '44px',
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

        {/* Close button on mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="admin-sidebar-close"
          style={{
            display: 'none',
            position: 'absolute',
            top: '24px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#9CA3AF',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 202,
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </aside>

      {/* Mobile nav pills */}
      <nav className="admin-nav-pills" style={{
        display: 'none',
        padding: '12px 16px',
        gap: '8px',
        overflowX: 'auto',
        borderBottom: '1px solid var(--admin-border, rgba(255,255,255,0.06))',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}>
        {NAV_ITEMS.map(({ icon: NavIcon, label, href }) => {
          const active = isActive(href, pathname)
          return (
            <Link
              key={label}
              href={href}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '999px',
                textDecoration: 'none',
                background: active ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? '#4ADE80' : 'rgba(255,255,255,0.06)'}`,
                transition: 'background 0.15s',
                flexShrink: 0,
                whiteSpace: 'nowrap',
                minHeight: '44px',
              }}
            >
              <NavIcon className="w-3.5 h-3.5" style={{ color: active ? '#4ADE80' : '#9CA3AF' }} />
              <span style={{
                fontSize: '12px',
                fontWeight: active ? '600' : '500',
                color: active ? '#4ADE80' : '#9CA3AF',
              }}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Hamburger button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="admin-hamburger"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 50,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--admin-accent, #4ADE80), #22D3EE)',
          border: 'none',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(74,222,128,0.4)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M3 6h16M3 11h16M3 16h16" stroke="#000" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Main Content */}
      <main className="admin-main" style={{
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
        @media (max-width: 767px) {
          .admin-sidebar {
            transform: translateX(-100%) !important;
          }
          .admin-sidebar--open {
            transform: translateX(0) !important;
          }
          .admin-sidebar-close {
            display: flex !important;
          }
          .admin-main {
            margin-left: 0 !important;
            padding: 60px 16px 24px !important;
          }
          .admin-nav-pills {
            display: flex !important;
          }
          .admin-hamburger {
            display: flex !important;
          }
        }
        @media (min-width: 768px) {
          .admin-nav-pills {
            display: none !important;
          }
          .admin-sidebar {
            transform: translateX(0) !important;
          }
        }
        /* Hide scrollbar in nav pills */
        .admin-nav-pills::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
