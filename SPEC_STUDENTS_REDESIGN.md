# SPEC — Students Page Redesign

## Goal
Apply design system to `src/app/school-admin/students/page.tsx`.

## Issues
1. "Add Student" header button: inline gradient + box-shadow → use `btn-glow`
2. Modal background/border: inline styles → already uses CSS vars, just fix focus color
3. Modal buttons: inline styled "Cancel" + "Add Student" → use `btn-ghost` + `btn-glow`
4. TCA progress bar: `linear-gradient(90deg, #38BDF8, #818CF8)` → `var(--accent)` + `var(--accent-secondary)` or keep current gradient (it's intentional brand gradient, keep)
5. Input focus in modal: `rgba(56,189,248,0.6)` → `var(--accent)`
6. Table header: `rgba(255,255,255,0.06)` → `var(--border)`

## Changes

### Header button
```jsx
// FROM:
className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90"
style={{ background: 'linear-gradient(135deg, #38BDF8, #818CF8)', boxShadow: '0 0 20px rgba(56,189,248,0.2)' }}

// TO:
className="btn-glow inline-flex items-center gap-2 text-sm"
```

### Modal
- Container: `className="glass-card"` + keep width/maxW (remove bg/border inline styles)
- Cancel button: `className="btn-ghost flex-1"`
- Add Student button: `className="btn-glow flex-1"`
- Input focus: `var(--accent)` instead of `rgba(56,189,248,0.6)`

### Table header
- `borderBottom: '1px solid rgba(255,255,255,0.06)'` → `borderBottom: '1px solid var(--border)'`

## Build + Commit
`npm run build` → 0 errors → commit "feat: students page — btn-glow, glass-card modal, CSS vars"