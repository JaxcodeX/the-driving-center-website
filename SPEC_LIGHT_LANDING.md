# SPEC — Landing Page Redesign (Clean Light Aesthetic)

## Source Reference
openclaw.ai — clean white SaaS landing page

## Design System

| Token | Hex | Usage |
|---|---|---|
| background | `#FFFFFF` | Page background |
| surface | `#FFFFFF` | Card backgrounds |
| primary | `#0F172A` | Headings, primary text |
| secondary | `#64748B` | Body text, muted |
| accent | `#3B82F6` | Buttons, links, highlights |
| accent-hover | `#2563EB` | Button hover |
| border | `#E2E8F0` | Card borders |
| border-dark | `#CBD5E1` | FAQ borders |
| card-shadow | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)` | Card shadow |
| card-shadow-hover | `0 10px 25px rgba(0,0,0,0.08)` | Card hover shadow |

## Typography
- Font: Inter (Google Fonts, default Next.js)
- H1: 3.5rem, bold, tight tracking
- H2: 2.5rem, bold
- Body: 1rem, relaxed line-height

## Layout — All White, Generous Spacing

### Navbar
- White background, subtle bottom border
- Logo left (DC badge + "The Driving Center" in navy)
- Right: "Sign in" text link + "Start free trial" solid blue button
- Mobile: hamburger menu

### Hero (Centered, Minimal)
- Background: white (#FFFFFF)
- Headline: "Run your driving school without the chaos." — 3.5rem, bold, navy, centered
- Subline: gray text, centered, max-width 600px
- One blue CTA button: "Start free trial"
- NO stats bar, NO dashboard mockup, NO particle background

### Social Proof
- Gray label: "Trusted by driving schools across Tennessee"
- City names horizontally centered, gray, spaced

### Features — 3-Column White Card Grid
- 6 feature cards in 2-row grid
- Card: white bg, #E2E8F0 border, subtle shadow, icon + title + description
- Icon in blue-tinted background circle
- NO dark backgrounds anywhere

### Pricing — 3 Clean Cards
- White cards, border
- Growth tier highlighted with blue ring/border
- Clean, no shadows needed

### FAQ
- details/summary accordion
- Gray borders between items
- Clean minimal styling

### Footer
- Simple copyright + links

## Files to Rebuild
1. `src/app/page.tsx` — full hero + all sections
2. `src/app/globals.css` — design tokens, white space
3. `tailwind.config.ts` — new color palette

## Remove
- ParticleBackground component
- Dark backgrounds (#050505)
- Dot grid / starfield
- Glowing blue text effects
- Stats bar in hero
- Dashboard mockup in hero
- Cramped padding