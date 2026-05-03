# SPEC — Sessions Page Redesign

## Goal
Apply design system to `src/app/school-admin/sessions/page.tsx`.

## Changes

### 1. "New Session" header button
- FROM: inline gradient + boxShadow
- TO: `className="btn-glow inline-flex items-center gap-2 text-sm"`

### 2. Filter tabs
The filter tabs use hardcoded inline styles per active state. Replace with pill-style tab buttons:
- Active: `background: var(--accent-dim)` + `color: var(--accent)` + `border: 1px solid var(--accent)`
- Inactive: `background: var(--card-bg)` + `color: var(--text-muted)` + `border: 1px solid var(--border)`
- Base button: `className="text-sm font-semibold px-4 py-2 rounded-full transition-all"`

### 3. Table header border
- `rgba(255,255,255,0.06)` → `var(--border)`

### 4. Session row hover
- `rgba(255,255,255,0.025)` → `var(--card-bg)` (since it's adding to glass-card's bg)

### 5. Modal — same pattern as students
- Modal container: `glass-card` class
- `inputStyle` border: `rgba(255,255,255,0.08)` → `var(--border)`
- Input focus: `rgba(56,189,248,0.6)` → `var(--accent)`
- Cancel: `btn-ghost flex-1`
- Schedule: `btn-glow flex-1` with → arrow
- Note: select elements can't use `inputStyle` — need inline style replacement too

## Build + Commit
`npm run build` → 0 errors → commit "feat: sessions page — btn-glow, pill filters, glass-card modal, CSS vars"