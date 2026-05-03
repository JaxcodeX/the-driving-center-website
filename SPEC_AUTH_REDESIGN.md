# SPEC — Auth Pages Redesign

## Goal
Polish the login and signup pages using the design system. Both pages already use CSS vars and `btn-glow` — the task is to fix inconsistencies, apply `glass-card` correctly, and kill hardcoded color values.

## Login Page (`src/app/login/page.tsx`)

### Current Issues
- Outer card: uses inline styles instead of `glass-card` class
- Input focus: hardcoded `rgba(26,86,255,0.6)` instead of `var(--accent)`
- Error text: hardcoded `#ef4444` instead of CSS var
- "Demo Mode" badge: hardcoded `#F97316` instead of `var(--accent-secondary)`
- Demo panel: inline styles instead of `glass-card`

### Changes
1. Outer card: replace style block with `className="glass-card"` (remove backdropFilter/border from inline style, keep only position/width/px/py)
2. All `onFocus` border color: `rgba(26,86,255,0.6)` → `var(--accent)`
3. Error text color: `style={{ color: '#ef4444' }}` → `style={{ color: 'var(--accent-secondary)' }}`
4. Demo badge: `style={{ color: '#F97316' }}` → `style={{ color: 'var(--accent-secondary)' }}` + icon color same
5. Demo panel: replace style block with `className="glass-card"`
6. Demo PIN input: replace with `input-pill` class + center align
7. "Demo Login" button: add arrow → "Demo Login →"

## Signup Page (`src/app/signup/page.tsx`)

### Current Issues
- Step connectors: hardcoded `rgba(255,255,255,0.15)` and `rgba(26,86,255,0.5)` instead of CSS vars
- Step circle active border: hardcoded `rgba(255,255,255,0.12)` instead of `var(--border)`
- Step inactive text: hardcoded colors instead of CSS vars
- Signup link: hardcoded `#7ED4FD` instead of CSS var
- Outer card: uses inline styles instead of `glass-card` class

### Changes
1. Outer card: replace style block with `className="glass-card"`
2. Step connector lines: `rgba(255,255,255,0.15)` → `var(--border)`, `rgba(26,86,255,0.5)` → `var(--accent)`
3. Step circles: hardcoded `rgba(255,255,255,0.06)` → `var(--card-bg)`, `rgba(255,255,255,0.12)` → `var(--border)`
4. Step labels: hardcoded `var(--text-secondary)` / `var(--text-muted)` already correct — verify
5. "Sign in" link: `style={{ color: '#7ED4FD' }}` → `style={{ color: 'var(--accent)' }}`
6. Input focus border: same fix as login
7. CTA button text: "Create school account" → "Create school account →" (already has ArrowRight, just add → in text)

## Shared Fixes
- Footer "Sign in" / "Sign up" link: use `style={{ color: 'var(--accent)' }}`
- All icon `style={{ color: ... }}` values: verify they use CSS vars

## Build + Commit
After changes: `npm run build` → verify 0 errors → commit "feat: auth pages — glass-card, CSS vars, design system consistency"
