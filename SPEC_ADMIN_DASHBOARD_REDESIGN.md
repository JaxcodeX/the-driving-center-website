# SPEC — School Admin Dashboard Redesign

## Goal
Apply the design system to the school admin dashboard (`src/app/school-admin/page.tsx`). The page already uses `glass-card` and `kpi-value` — this pass removes inline style duplications, adds missing elements (recent activity table), and ensures the quick actions strip is consistent.

## Current State
- KPI cards: already use `glass-card` + `kpi-value` ✅
- Quick actions: `glass-card` strip with pill buttons ✅
- Sessions strip: exists, horizontal scroll, glass cards per session ✅
- Recent activity: MISSING — needs to be added
- Sidebar: layout already clean, untouched

## Changes

### 1. Quick Actions Strip
Currently: `<div className="glass-card" style={{ padding: '16px 20px' }}>`
Fix: `<div className="glass-card" style={{ padding: '16px 20px' }}>` — already correct, just verify pill buttons use `quick-action` class instead of `btn-ghost`

### 2. Sessions Strip — session-card
Verify each session card uses `className="glass-card session-card"` with a `border-left` colored by status.
Status colors via inline style:
- scheduled → `style={{ borderLeftColor: 'var(--accent)' }}`
- completed → `style={{ borderLeftColor: 'var(--success)' }}`
- canceled → `style={{ borderLeftColor: 'var(--accent-secondary)' }}`

### 3. Recent Activity Table — ADD (currently missing)
Add below the sessions strip:

```jsx
{/* Recent Activity */}
<div className="glass-card">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Activity</h2>
    <Link href="/school-admin/activity" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>View all →</Link>
  </div>
  <div>
    {[
      { user: 'Jake Thompson', action: 'completed Parallel Parking Mastery', time: '2h ago', type: 'completed' },
      { user: 'Sarah Miller', action: 'booked Traffic Court Awareness for May 12', time: '4h ago', type: 'booked' },
      { user: 'Marcus Lee', action: 'enrolled in Basic Driving Package', time: 'Yesterday', type: 'enrolled' },
      { user: 'Emma Wilson', action: 'cancelled May 8 session', time: 'Yesterday', type: 'canceled' },
    ].map((item, i) => (
      <div key={i} className="activity-row">
        <div className="flex items-center gap-3">
          <div className="avatar-circle" style={{ width: '32px', height: '32px', fontSize: '11px' }}>
            {item.user.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.user}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.action}</p>
          </div>
        </div>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.time}</span>
      </div>
    ))}
  </div>
</div>
```

### 4. KPI Cards — verify border-left accent per card
The KPI cards should have a colored left border matching their icon color:
- Total Students: blue accent
- Active Sessions: green success
- Monthly Revenue: purple (#818CF8)
- Completion Rate: orange (var(--accent-secondary))

Add to each card: `style={{ borderLeft: '3px solid <color>' }}`

### 5. Remove any remaining inline style duplications
- Any `style={{ background: 'var(--card-bg)' }}` that could be `className="glass-card"` should be converted
- Keep data-fetching logic exactly as-is

## Build + Commit
After changes: `npm run build` → verify 0 errors → commit "feat: school admin dashboard — design system, activity table, accent borders"
