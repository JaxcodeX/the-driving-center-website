# SPEC — Landing Page Hero Rebuild (Linear-Inspired)

## Reference
Linear.app hero screenshot: `linear_top.png` (in workspace)
Our current hero: `our_hero.png` (in workspace)

## What's Wrong (Pixel-for-Pixel Comparison)

### 1. Color Mode
- **Linear:** Dark (#0B0C0E background), never pure black
- **Us:** Light mode (#F2F4F7 background) — flat, no atmosphere
- **Fix:** Switch to dark mode. Deep charcoal background, not pure black.

### 2. Typography Tracking
- **Linear:** `-0.04em` tracking on headlines, ~96px, weight 600
- **Us:** Standard tracking, 52px — looks loose and generic
- **Fix:** Tighten tracking to `-0.03em` minimum, increase weight contrast

### 3. Atmospheric Lighting (MISSING)
- **Linear:** Radial glow from top, subtle purple/blue bloom behind UI mockup
- **Us:** Flat white background, no depth
- **Fix:** Add CSS radial gradient glow behind the dashboard card. Subtle, not garish.

### 4. Dashboard Mockup (WRONG)
- **Linear:** Crisp UI with real density — issue IDs, labels, status pips, thin borders
- **Us:** Thick "sausage" bar chart, simplified placeholder avatars, looks like a children's app
- **Fix:** Replace bar chart with thin-line sparkline or area chart. Use proper micro-detail.

### 5. Micro-Borders (MISSING)
- **Linear:** 1px subtle borders on cards — creates precision engineering feel
- **Us:** Cards have no borders, just drop shadows
- **Fix:** Add `border: 1px solid rgba(255,255,255,0.06)` to dashboard card

### 6. Locations Row (LOOKS LIKE SEO SPAM)
- **Linear:** Purpose-built UI with intentional density
- **Us:** Plain text row of Tennessee cities — 2012 tag cloud aesthetic
- **Fix:** Replace with a sleek "Serving Tennessee" badge + small map icon. NOT a text list.

### 7. Button Style
- **Linear:** Pill buttons (#FFFFFF bg, #000 text), tight vertical padding
- **Us:** Flat black pills, no border detail
- **Fix:** Add subtle top-border highlight, inner glow on hover

## Design Tokens (Dark Mode)

```css
--bg-base: #0B0C0E        /* Deep charcoal, not pure black */
--bg-surface: #131316     /* Card backgrounds */
--bg-elevated: #1C1D21    /* Inputs, inner panels */
--text-primary: #FFFFFF   /* Headlines */
--text-secondary: #8A8F98 /* Body, muted */
--accent: #3B82F6         /* Electric blue — buttons, highlights */
--border: rgba(255,255,255,0.06)  /* Hairline borders */
--glow: radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 60%)
```

**Font:** Inter (same as Linear) — tight tracking on headlines
**Hero headline:** 72px / 700 / -0.03em tracking
**Subheadline:** 18px / 400 / #8A8F98 / line-height 1.6

## Layout

- Full dark background (#0B0C0E)
- Sticky nav: 64px, border-bottom with hairline border
- Hero: centered, max-width 1100px, generous vertical padding (120px top)
- Two-column layout: headline left (60%), dashboard mockup right (40%)
- Dashboard card: dark surface (#131316), 1px border, subtle blue glow behind it
- "Serving Tennessee" badge below hero — small, sleek, not a text list

## Dashboard Mockup Detail

Inside the dark card, show:
- Top bar: "The Driving Center" label + nav dots
- Sidebar with nav items (Dashboard, Students, Sessions) — icons + labels
- Main content: stylized table rows (not sausage bars) with status pips
- TCA progress indicator — clean, not chunky
- Use thin 1px borders between rows

## Build Instructions

1. Read `linear_top.png` from workspace — extract exact visual cues
2. Read this spec
3. Build the hero section matching the Linear dark aesthetic exactly
4. Screenshot output, compare to `linear_top.png`
5. Fix specific deviations (glow position, tracking, border opacity)
6. One more screenshot pass
7. Commit when satisfied