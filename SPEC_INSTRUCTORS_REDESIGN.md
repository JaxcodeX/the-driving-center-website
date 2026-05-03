# SPEC — Instructors Page Redesign

## Goal
Apply design system to `src/app/school-admin/instructors/page.tsx`.

## Changes

### 1. "Invite Instructor" header button
- FROM: `style={{ background: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)' }}`
- TO: `className="btn-glow inline-flex items-center gap-2 text-sm"`

### 2. Empty state
- FROM: inline bg + border
- TO: `className="glass-card text-center py-16"`

### 3. Instructor card grid
- FROM: `style={{ background: 'var(--bg-surface)', border: '1px solid var(--card-border)' }}`
- TO: `className="glass-card"`

### 4. Avatar block (inside card)
- `background: 'rgba(56,189,248,0.15)', color: '#38BDF8'` → `background: 'var(--accent-dim)', color: 'var(--accent)'`

### 5. Status badge (inside card)
- Active: `rgba(74,222,128,0.15)` + `var(--success)` ✅ (already correct)
- Pending: `rgba(245,158,11,0.15)` + `#f59e0b` → `rgba(249,115,22,0.15)` + `var(--accent-secondary)`

### 6. "Awaiting response" badge
- `background: 'rgba(56,189,248,0.15)', color: '#38BDF8'` → `background: 'var(--accent-dim)', color: 'var(--accent)'`

### 7. Modal container
- `style={{ background: 'var(--bg-surface)', border: '1px solid var(--card-border)' }}` → `className="glass-card"`

### 8. Modal buttons (Cancel + Send Invite)
- Cancel: `style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}` → `className="btn-ghost flex-1 text-center py-3 text-sm font-medium"`
- Send Invite: `style={{ background: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)' }}` → `className="btn-glow flex-1 text-center py-3 text-sm font-semibold disabled:opacity-50"` + add →

### 9. Input focus color
- `rgba(56,189,248,0.6)` → `var(--accent)`

## Build + Commit
`npm run build` → 0 errors → commit "feat: instructors page — btn-glow, glass-card grid, CSS vars"