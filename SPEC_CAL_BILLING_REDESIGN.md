# SPEC — Calendar + Billing Pages Redesign

## Calendar (`src/app/school-admin/calendar/page.tsx`)

### Issues
1. Prev/next month buttons: inline styled → use `btn-ghost` class
2. Today highlight circle: `#38BDF8` → `var(--accent)`
3. Session block in calendar cell: `rgba(56,189,248,0.2)` + `#38BDF8` → `var(--accent-dim)` + `var(--accent)`
4. Sessions list card (each item): `var(--bg-surface)` + `var(--card-border)` → `className="glass-card"`
5. Session date in list: `#38BDF8` → `var(--accent)`
6. Status badge in session list: `rgba(74,222,128,0.15)` + `var(--success)` → already correct

### Changes
- Prev/next buttons: `className="btn-ghost p-2"`
- Today: `style={{ background: 'var(--accent)', color: '#fff' }}`
- Session chip in calendar cell: `style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}`
- Session list item: `className="glass-card flex items-center gap-4 p-3"`
- Session date label: `style={{ color: 'var(--accent)' }}`

---

## Billing (`src/app/school-admin/billing/page.tsx`)

### Issues
1. Status banner: `rgba(...)` hardcoded colors → CSS vars for background/border colors
2. Status icons in banner: `#f59e0b` orange → `var(--accent-secondary)`, `#38BDF8` → `var(--accent)`
3. Plan card: `var(--bg-surface)` + `var(--card-border)` → `className="glass-card"`
4. Plan price: `#38BDF8` → `var(--accent)`
5. "Manage subscription" button: inline styled → `className="btn-ghost w-full text-center py-3 text-sm font-semibold"`
6. Payment method card: same as plan card → `className="glass-card"`

### Changes
- Status banner: `className="glass-card flex items-start gap-4 p-5 mb-6"` (remove inline bg/border styles)
- Banner icons: `#38BDF8` → `var(--accent)`, `#f59e0b` → `var(--accent-secondary)`
- Plan card: `className="glass-card p-6 mb-6"` (remove inline styles)
- Plan price: `style={{ color: 'var(--accent)' }}`
- Manage button: `className="btn-ghost w-full text-center py-3 text-sm font-semibold"`
- Payment card: `className="glass-card p-6"`

## Build + Commit
`npm run build` → 0 errors → commit "feat: calendar + billing pages — glass-card, btn-ghost, CSS vars"