'use client'

import AdminSidebar from '@/components/dashboard/AdminSidebar'
import '@/app/globals.css'

export default function SchoolAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 240 }}>
        {children}
      </main>
    </div>
  )
}
