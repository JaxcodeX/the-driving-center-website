# SPEC — Dark Mode Landing Page Redesign
# Target: Calendr (design3) + beatgig (design4) hybrid

---

## Design Direction

Dark, premium SaaS landing page. Deep charcoal/near-black base with vibrant accent colors. Glassmorphism cards. Electric yellow/orange primary CTA. Pink/magenta for status and highlights.

---

## Color Palette

```css
--bg-base: #0B0B0E;           /* deep charcoal (beatgig) */
--bg-surface: #131316;         /* elevated dark */
--bg-elevated: #1C1D21;        /* cards */
--text-primary: #FFFFFF;
--text-secondary: #8A8F98;
--text-muted: #555660;
--border: rgba(255,255,255,0.07);
--accent: #0052FF;             /* electric blue (beatgig sidebar blue) */
--accent-glow: rgba(0,82,255,0.2);
--accent-secondary: #F97316;   /* orange for secondary actions */
--accent-yellow: #FACC15;      /* electric yellow — primary CTA (beatgig) */
--accent-pink: #E879F9;        /* magenta/pink accents */
--success: #4ADE80;
--card-bg: #1C1D21;
--card-border: rgba(255,255,255,0.08);
--card-shadow: 0 8px 32px rgba(0,0,0,0.4);
--glass-bg: rgba(255,255,255,0.05);
--glass-border: rgba(255,255,255,0.1);
--glass-shadow: 0 8px 32px rgba(0,0,0,0.3);
```

---

## Typography

- **Font**: Inter (loaded via next/font in layout.tsx — already configured)
- **Display**: 800 weight, clamp 56px–80px, letter-spacing -0.03em
- **Headlines**: 700 weight, 36px–48px
- **Body**: 400 weight, 16-17px, line-height 1.7
- **Labels**: 600 weight, 11px, uppercase, letter-spacing 0.08em

---

## Section Breakdown

### 1. Navbar
- Height: 64px, sticky, backdrop blur
- Logo left: DC icon + "The Driving Center" wordmark (white text)
- Nav center: Features | Pricing | FAQ (white text, small, hover underline)
- Right: "Log in" (text link) + "Start free trial" (pill, electric yellow `#FACC15`, black text)
- Border bottom: 1px solid var(--border)

### 2. Hero Section
- **Background**: `#0B0B0E` with subtle radial gradient from center (darker edges)
- **Layout**: Two-column — headline/text LEFT (60%), dashboard mockup RIGHT (40%)
- **Eyebrow**: Small pill badge — "Scheduling Software for Driving Schools" (glass pill style)
- **Headline**: Two lines, massive Inter 800, white
  - "The simplest way to"
  - "run your driving school"
- **Subheadline**: One line, text-secondary, 18px
- **CTAs**: 
  - Primary: "Start free trial" — electric yellow pill (`#FACC15`), black text, bold, `padding: 14px 28px`
  - Secondary: "See a demo" — ghost pill (white border, white text, transparent fill)
- **Trust line**: Small gray text "Trusted by 50+ driving schools across Tennessee"
- **Right — Dashboard Mockup**: 
  - Glassmorphism card (dark bg `#131316`, border + blur)
  - Shows a clean admin dashboard preview (sidebar + main content area)
  - Sits on subtle glow/gradient backdrop
  - Radius: 16px, shadow: var(--card-shadow)
- **Spacing**: Padding 120px top, 80px bottom

### 3. Features (Bento Grid)
- **Background**: `#0B0B0E` (same as hero, continuous feel)
- **Section eyebrow**: "EVERYTHING YOUR SCHOOL NEEDS" — small caps label, blue accent color
- **Layout**: Bento asymmetric grid
  - 2 large feature cards (span 2 cols each in a 3-col grid)
  - 4 small metric/feature cards
- **Large feature cards** (Online Booking + Automated Reminders):
  - Glassmorphism style: `#1C1D21` bg, subtle border
  - Icon at top (Lucide, 24px, blue accent)
  - Title: bold, white, 20px
  - Description: text-secondary, 14px, line-height 1.7
  - Bottom: small colored bar/accent line in blue
- **Small cards** (Student Tracking, Stripe Billing, Instructor Management, Multi-tenant Security):
  - Glassmorphism compact style
  - Icon + title + single line description
  - Smaller padding, tighter
- **Spacing**: 80px top/bottom padding

### 4. Stats Bar
- **Background**: `#131316`
- **Layout**: 4 stats in a row, centered
  - "50+ Schools", "10,000+ Sessions Booked", "$2M+ Processed", "99.9% Uptime"
- **Style**: Each stat — huge bold number (white), tiny label below (text-muted)
- **Dividers**: subtle vertical lines between stats

### 5. How It Works (dark section with glassmorphism)
- **Background**: `#0B0B0E`
- **Section eyebrow**: "HOW IT WORKS"
- **Layout**: 3 step cards, horizontal, equal width
- **Step cards**:
  - Glassmorphism card: `#1C1D21` bg + border + subtle blur
  - Step number: huge muted number (80px, very low opacity)
  - Step title: bold white
  - Step description: text-secondary
  - Connecting line/dots between steps (decorative)
- **Steps**: 1. Create your school → 2. Add instructors & students → 3. Start accepting bookings
- **Spacing**: 80px top/bottom

### 6. Pricing
- **Background**: `#0B0B0E`
- **Section eyebrow**: "PRICING"
- **Layout**: 3 cards, horizontal
- **Card style**:
  - Glassmorphism: `#1C1D21` bg, border
  - Card name: small caps label
  - Price: huge bold number + "/mo" in muted
  - Feature list with checkmarks (blue or green)
  - CTA pill button at bottom
- **Middle card (highlighted)**:
  - Blue accent border glow
  - "Most Popular" pill badge in accent blue
  - Same structure otherwise
- **Tiers**: Starter $99/mo, Professional $199/mo (highlighted), Enterprise $499/mo
- **Spacing**: 80px top/bottom

### 7. FAQ
- **Background**: `#131316`
- **Section eyebrow**: "FAQ"
- **Layout**: centered accordion, max-width 680px
- **Style**: Accordion panel with glassmorphism treatment
  - Each item: subtle bottom border
  - Trigger: bold white, hover shows blue text
  - Content: text-secondary
- **Style matches**: Existing accordion but cleaner, better spacing

### 8. CTA Section (high contrast)
- **Background**: `#0B0B0E`
- **Layout**: centered
- **Headline**: Large, white, bold
- **Subheadline**: text-secondary
- **CTA**: "Start free trial" pill — electric yellow (`#FACC15`), black text (same as navbar CTA)
- **Spacing**: 80px top/bottom

### 9. Footer
- **Background**: border-top only (no full bg)
- **Logo + wordmark left**
- **Links center**: Privacy | Terms | Sign in
- **Copyright right**
- **Style**: minimal, text-muted, small

---

## Component Classes (in globals.css — already exist, use them)
- `glass-card` — backdrop-filter blur, semi-transparent bg, border, hover lift
- `btn-glow` — white fill pill with glow (use for primary CTA)
- `btn-ghost` — outlined pill (use for secondary CTA)
- `btn-pill` — small pill button
- `bento-grid` — `display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px`
- `bento-large` — `grid-column: span 2`
- `status-pill` — rounded pill with colored bg
- `section-eyebrow` — small caps label with blue accent bar
- `accordion-panel` — glassmorphism accordion container
- `accordion-item` — accordion row with border
- `footer-link` — small muted text link
- `bg-circle` — decorative blurred circle

---

## Implementation Notes

1. **Dashboard mockup in hero**: Reuse/upgrade the existing `DashboardMockup` component in page.tsx. Style it with glassmorphism (dark bg + blur + border). Make it feel like the beatgig dark dashboard.

2. **Feature cards use glass-card class**: Apply `className="glass-card"` and remove inline surface colors. The glass-card class already handles the dark glassmorphism style.

3. **Stats bar**: Simple component, pure CSS + HTML. No API calls.

4. **Electric yellow CTA**: This is the key visual differentiator from the current site. Use inline style `background: #FACC15; color: #000;` on the primary CTA pill. Bold, high contrast.

5. **Pricing highlighted card**: Add a blue border glow style:
```css
.pricing-highlight {
  border: 1.5px solid var(--accent) !important;
  box-shadow: 0 0 60px rgba(0,82,255,0.25) !important;
}
```

6. **Section spacing**: Each section has 80-120px vertical padding. Don't compress sections.

7. **Build rule**: Run `npm run build` after the page.tsx rewrite. Fix any TypeScript errors. Commit only on clean build.

---

## Design Reference
- design3.png (Calendr) — dark hero with midnight navy + electric blue, clean sidebar mockup
- design4.png (beatgig) — deep charcoal #0B0B0C, electric yellow CTA, pink/magenta status colors, glassmorphism calendar cards
- Current `globals.css` — dark theme tokens, glass-card, btn-glow, btn-ghost already defined
- Current `layout.tsx` — Inter font loaded via next/font
