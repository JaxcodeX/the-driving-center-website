/**
 * V3 - targeted text replacement for each page.
 * Each page has the same pattern elements. We replace exact known strings.
 */
import { readFileSync, writeFileSync } from 'fs'

const pages = {
  'src/app/school-admin/profile/page.tsx': {
    imports: { from: "import { Check, Backpack, Camera, LayoutDashboard, GraduationCap, Calendar, Car, Settings, DollarSign, Clock, User, Save } from 'lucide-react'", to: "import { Check, Backpack, Camera, User, Save } from 'lucide-react'" },
    navItems: true,
  },
  'src/app/school-admin/availability/page.tsx': {
    imports: { from: "import { useState, useEffect, Suspense } from 'react'\nimport { useSearchParams } from 'next/navigation'\nimport Link from 'next/link'\nimport { CheckCircle, XCircle, ChevronLeft, ChevronRight, LayoutDashboard, GraduationCap, Calendar, Car, Settings, DollarSign, Clock } from 'lucide-react'\nimport { createClient } from '@/lib/supabase/client'", to: "import { useState, useEffect, Suspense } from 'react'\nimport { useSearchParams } from 'next/navigation'\nimport Link from 'next/link'\nimport { CheckCircle, XCircle, ChevronLeft, ChevronRight, Clock } from 'lucide-react'\nimport { createClient } from '@/lib/supabase/client'" },
    navItems: true,
  },
  'src/app/school-admin/instructors/page.tsx': {
    imports: { from: "import { Plus, Mail, Shield, Pencil, X, User, LayoutDashboard, Calendar, Clock, Settings, DollarSign, Car, GraduationCap } from 'lucide-react'", to: "import { Plus, Mail, Shield, Pencil, X, User } from 'lucide-react'" },
    navItems: true,
  },
  'src/app/school-admin/ops/page.tsx': {
    imports: { from: "import { LayoutDashboard, GraduationCap, Calendar, Car, Settings, DollarSign, Clock } from 'lucide-react'", to: "// nav icons removed — layout provides sidebar" },
    navItems: true,
  },
}

const BG_DIV_OPEN = `<div style={{ display: 'flex', minHeight: '100vh', background: BG, fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, background: BG_GRADIENT, pointerEvents: 'none', zIndex: 0 }} />`

const BG_DIV_OPEN_ALT = `<div style={{ display: 'flex', minHeight: '100vh', background: BG, fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, background: BG_GRADIENT, pointerEvents: 'none', zIndex: 0 }} />`

for (const [relPath, config] of Object.entries(pages)) {
  console.log(`Processing: ${relPath}`)
  let content = readFileSync(relPath, 'utf-8')
  const original = content

  // 1. Fix imports
  if (config.imports) {
    content = content.replace(config.imports.from, config.imports.to)
  }

  // 2. Replace NAV_ITEMS
  if (config.navItems) {
    // Remove the multiline NAV_ITEMS constant 
    content = content.replace(/const NAV_ITEMS = \[[\s\S]*?\];/, '// NAV_ITEMS removed — layout provides the sidebar')
  }

  // 3. Replace opening wrapper + gradient div
  content = content.replace(BG_DIV_OPEN, '<>')

  // 4. Remove sidebar block (from {/* Sidebar */} to </aside>)
  content = content.replace(/\s*\{\/\* Sidebar \*\/\}[\s\S]*?<\/aside>/, '')

  // 5. Remove mobile nav pills block (from nav with admin-nav-pills to </nav>)
  content = content.replace(/\s*<nav[\s\S]*?className="admin-nav-pills"[\s\S]*?<\/nav>/, '')

  // 6. Replace the main/content wrapper div that has marginLeft: '220px'
  content = content.replace(/<div style=\{\s*flex:\s*1,\s*marginLeft:\s*'220px',\s*padding:\s*'40px\s*48px',\s*maxWidth:\s*'[^']*',\s*position:\s*'relative',\s*zIndex:\s*1\s*\}\s*className="admin-main">/g, '<div className="admin-main">')

  // 7. Remove @media style blocks
  content = content.replace(/<style>\{`[\s\S]*?@media[\s\S]*?`\}<\/style>/, '')

  // 8. Remove the closing </div> for the outer wrapper (right before </> or ))
  // The closing pattern is: </div>\n    </div>\n  )
  // We need to remove ONE </div> before the closing tag
  content = content.replace(/\n\s*<\/div>\n\s*\)/, '\n  )')

  // 9. Handle the closing - replace </div>\n  ) with </>\n  ) if it hasn't been done
  // The outer wrapper started with <div ... >, its closing is </div>
  // Since we replaced the opening with <>, we need to replace the closing with </>
  // But which </div> to change? The LAST one before ).
  content = content.replace(/\n\s*<\/div>\n\s*\)/, '\n    </>\n  )')

  if (content !== original) {
    writeFileSync(relPath, content, 'utf-8')
    console.log(`  Written. ${content.length} bytes`)
  } else {
    console.log(`  No changes!`)
  }
}

console.log('\nDone!')
