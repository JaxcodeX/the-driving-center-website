# SPEC.md — The Driving Center Homepage Redesign

## Goal
Redesign the Hero and Features sections of the landing page to match premium B2B SaaS standards (Linear/Vercel/Stripe quality), aligned with Jack Roberts' brand patterns.

---

## 1. Design Tokens (Applied)

| Token | Value | Usage |
|---|---|---|
| bg | `#050505` | Page background |
| surface | `#0D0D0D` | Cards, elevated surfaces |
| elevated | `#18181b` | Sidebar, inputs |
| border | `#1A1A1A` | Card borders, dividers |
| primary | `#006FFF` | Accent, CTA backgrounds |
| button-shadow | `0 4px 30px rgba(0,111,255,0.25)` | Primary CTA glow |
| button-radius | `12px` | All CTA buttons |
| body-text | `#5C6370` | Body / description text |
| secondary-tint | `#E6F1FF` | Light blue section backgrounds |
| green | `#10B981` | Success / confirmation states |
| grad | `linear-gradient(135deg, #006FFF, #818CF8)` | Headline accent, popular badge |

---

## 2. Hero Section

### Layout
- Two-column grid: 55% copy / 45% browser mockup
- Eyebrow badge → H1 → Subheadline → CTAs → Trust badges → **Stats Bar**

### H1
- Outcome-focused, ≤8 words
- Copy: "Run your driving school without the chaos."
- Style: clamp(3rem, 5vw, 4.5rem), bold, tracking -0.02em, leading 0.97
- Accent word: "chaos." in gradient (006FFF → 818CF8)

### Primary CTA
- Solid `#006FFF` background
- Border-radius: `12px`
- Box-shadow: `0 4px 30px rgba(0, 111, 255, 0.25)`
- Never use black-on-white buttons again

### Stats Bar (New — Jack Roberts Pattern)
- Full-width strip directly below hero CTAs
- 3 stats: large bold number + small label
- Example: `240+ Students` · `1,400+ Sessions booked` · `98% Retention`
- Border top/bottom, centered, compact

### Browser Mockup
- 3D tilt: `rotateY(-4deg) rotateX(2deg)`
- Full browser chrome with traffic lights
- Dashboard inside showing: greeting, stat cards, upcoming sessions
- Floating badge (bottom-left): "Certificate issued — Jordan K."
- No stock photos; real UI only

---

## 3. Features Section — Bento Grid

### Layout: Asymmetric 2-row bento grid
```
Row 1: [Online Booking — 2/3 width] [Automated Reminders — 1/3]
Row 2: [TCA Compliance — 1/3] [Student Management — 1/3] [Payments — 1/3]
Row 3: [Progress Dashboard — full width]
```

### Card sizes
- **Large (2/3):** Online Booking
- **Standard (1/3 each):** Reminders, TCA, Students, Payments
- **Full-width:** Progress Dashboard

### Card styling
- `bg: #0D0D0D`, border: `1px solid #1A1A1A`
- Hover: border lifts to `#27272a`, translateY(-2px), elevated shadow
- Icon container: 48×48px, rounded-2xl, with color-matched background at 12% opacity + border
- Title: `text-base font-semibold`, color `#ffffff`
- Description: `text-sm leading-relaxed`, color `#5C6370`

### Social Proof Integration
- TCA card: include micro-badge "Used by 40+ TN schools"
- Payments card: "Stripe certified" trust note

---

## 4. What NOT To Do
- No black-on-white primary CTA buttons
- No uniform 3-column feature grid (must be bento)
- No decorative gradients throughout
- No rounded-lg on cards (minimum rounded-2xl)
- No emojis as icons (Lucide only)