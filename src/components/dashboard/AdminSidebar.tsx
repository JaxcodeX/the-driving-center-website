'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  UserCircle,
  Upload,
  Settings,
  LogOut,
  Car,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/school-admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/school-admin/calendar', label: 'Calendar', icon: Calendar },
  { href: '/school-admin/students', label: 'Students', icon: Users },
  { href: '/school-admin/sessions', label: 'Sessions', icon: Clock },
  { href: '/school-admin/instructors', label: 'Instructors', icon: UserCircle },
  { href: '/school-admin/import', label: 'Import CSV', icon: Upload },
  { href: '/school-admin/profile', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex flex-col"
      style={{ width: 240, background: 'linear-gradient(180deg, #0f0f14 0%, #0a0a0f 100%)' }}>
      {/* Glass border right */}
      <div className="absolute inset-y-0 right-0 w-px bg-white/[0.06]" />

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <Car className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-white font-semibold text-sm truncate">Driving Center</div>
          <div className="text-gray-500 text-xs truncate">Admin Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        <div className="space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact)
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group
                  ${active
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                  }
                `}
              >
                {/* Active left border */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-400 rounded-r-full" />
                )}
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom: logout + back to site */}
      <div className="p-3 border-t border-white/[0.06] space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-white/[0.05] transition-all"
        >
          <Car className="w-4 h-4" />
          Back to site
        </Link>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-white/[0.05] transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
