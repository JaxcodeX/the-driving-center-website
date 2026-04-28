# SPEC.md — Landing Page Rebuild (Golden Screen Method)

**Source:** 5 reference screenshots + DesignJoy.co aesthetic
**Method:** Golden screen — exact design tokens extracted from reference images
**Goal:** Premium, non-generic landing page that doesn't look AI-generated

---

## Reference Sites Analyzed

| Site | Style | Use For |
|---|---|---|
| Origin Studios (Image 1) | Premium serif headlines, sky hero, glassmorphism AI prompt bar | Hero typography + layout |
| Dashboard light (Image 2) | Light gray bg (#F4F4F0), white cards, 24px radius, Inter font | Card system + spacing |
| FinPoint dark (Image 3) | Dark bg (#0B0C0E), orange→pink gradient cards, lime green accent | Dark booking section |
| Dashboard+AI (Image 4) | Glassmorphism AI search bar, mesh gradients, pill nav | AI/interactive elements |
| 24SOLAR (Image 5) | Oversized headlines, architectural feel, warm neutrals, pill badges | Typography scale + badges |

---

## Design Tokens (Locked — Use These Exactly)

### Colors

**Light mode:**
```
--bg-base: #F4F4F0          (warm cool gray — from Dashboard Image 2)
--bg-surface: #FFFFFF        (pure white cards)
--text-primary: #111827      (near-black)
--text-secondary: #6B7280   (medium gray)
--text-muted: #9A9FA5        (light gray)
--border: #E5E7EB            (subtle border)
--accent: #3B82F6            (vibrant blue — from Image 4)
--accent-deep: #2563EB        (deep blue gradient)
--success: #10B981           (green)
--card-bg: #FFFFFF
--card-border: #E5E7EB
```

**Dark mode:**
```
--bg-base: #0B0C0E          (deep charcoal — from FinPoint Image 3)
--bg-surface: #141517         (dark grey card)
--text-primary: #FFFFFF
--text-secondary: #8E8E93
--text-muted: #6B6B6B
--border: #262626
--accent: #3B82F6
--accent-glow: rgba(59,130,246,0.25)
--success: #A0FF41            (vibrant lime green — FinPoint)
--card-bg: #141517
--card-border: #262626
```

**Brand gradient (booking section always dark):**
```
gradient: linear-gradient(135deg, #FF512F, #DD2476)   (orange→pink from FinPoint)
```

### Typography

**Font:** Inter (already in our stack via next/font)

**Scale:**
- Hero headline: 72px, font-weight 800, tight tracking (-0.03em), line-height 1.0
- Section headline: 48px, font-weight 700, tracking -0.02em
- Card headline: 24px, font-weight 600
- Body: 16px, font-weight 400, line-height 1.6
- Small/label: 13px, font-weight 500
- Eyebrow/badge: 12px, font-weight 600, all-caps, letter-spacing 0.05em

### Spacing (8px base unit)

```
spacing-1: 8px
spacing-2: 16px
spacing-3: 24px
spacing-4: 32px
spacing-5: 40px
spacing-6: 48px
spacing-8: 64px
spacing-10: 80px
spacing-12: 96px
```

### Card System

- Border radius: 24px (cards), 12px (buttons/inputs), 999px (pills/badges)
- Card padding: 32px
- Card shadow (light): `0 10px 25px -5px rgba(0,0,0,0.05)`
- Card shadow (dark): `0 4px 24px rgba(0,0,0,0.3)`
- Card border: 1px solid var(--card-border)

### Buttons

**Primary (cta-pill):**
- Background: #111827 (dark) or #1A1D1F (light) — NOT blue, NOT gradient
- Text: #FFFFFF
- Border-radius: 12px
- Padding: 14px 28px
- Font: 15px, font-weight 600
- Hover: slight lift (translateY -1px), shadow intensifies

**Secondary (cta-ghost):**
- Background: transparent
- Border: 1.5px solid var(--border)
- Text: var(--text-primary)
- Border-radius: 12px
- Hover: background var(--card-bg)

### Badges/Pills

- Border-radius: 999px (fully rounded)
- Padding: 5px 14px
- Font: 12px, font-weight 600
- Background: var(--card-bg)
- Border: 1px solid var(--card-border)

### Status/Trend Pills

**Positive:** bg rgba(16,185,129,0.15), text #10B981 (light) / #A0FF41 (dark)
**Negative:** bg rgba(239,68,68,0.15), text #EF4444 (light) / #FF5E5E (dark)
**Neutral:** bg var(--card-bg), text var(--text-muted)

---

## Page Sections (8 Sections)

### 1. Hero
**Layout:** Split 55/45 — headline + CTA left, dashboard mockup right
**Background:** Solid `--bg-base` — NO particle starfield, NO gradient mesh
**Headline:** "Run your driving school. Not spreadsheets." — 72px/800, Inter
**Sub-headline:** 18px/400 — "Automate bookings, track progress, get paid. The all-in-one platform for driving schools in Tennessee."
**Trust badge:** Pill badge above headline — "Trusted by 50+ driving schools" with green dot
**CTA 1:** Primary button "Start free trial" → /signup
**CTA 2:** Ghost button "See how it works" → #features
**Dashboard mockup:** Theme-aware glassmorphism card with KPI row, sidebar, upcoming sessions. Border-radius 24px. Uses current CSS variable system.
**Navbar:** Sticky, blurred bg, logo left, nav links center, CTA right. NO heavy shadow.

### 2. Features (Bento Grid)
**Layout:** 3-column bento grid. First card spans 2 cols (`.bento-large`)
**Cards:** 6 cards — each is white/dark glass-card with:
- Icon block: 48px rounded square, blue→purple gradient background, white icon centered
- Title: 18px, font-weight 600
- Description: 14px, text-secondary, line-height 1.6
**Card 1 (wide):** Track every student — TCA hours, progress, certificates
**Card 2:** Schedule without friction — online booking, parent payments
**Card 3:** Get paid and stay compliant — Stripe + Tennessee TCA
**Card 4:** Multi-tenant by design — isolated school data, RLS enforced
**Card 5:** Automated reminders — SMS + email, zero no-shows
**Card 6:** Instructor management — availability, schedules, invites

### 3. Social Proof
**Label:** "Trusted by driving schools in:" — eyebrow badge
**Logos:** City names in a clean row — Knoxville | Nashville | Chattanooga | Memphis | Oneida | Cumberland (NOT fake company logos — real places)
**Style:** Muted text-secondary, small font, horizontal pill separators

### 4. Pricing (3-Tier)
**Layout:** 3 cards side by side, middle highlighted
**Highlighted card (Growth):**
- Border: 1.5px solid var(--accent)
- Shadow: `0 0 60px var(--accent-glow)`
- Badge: "Most popular" pill with accent bg
**Tiers:**
- Starter: $99/mo — Up to 25 students, Stripe, TCA tracking, email reminders
- Growth: $199/mo — Up to 100 students, + instructor management, parent portal, priority support ← HIGHLIGHTED
- Enterprise: $399/mo — Unlimited, + multi-location, API access, dedicated success manager
**Features:** Green checkmarks (var(--success)), clean list
**CTA buttons:** Primary button at bottom of each card

### 5. Testimonials (2 Cards)
**Style:** Glass-card with 24px radius
**Layout:** Side by side, full-width on mobile
**Card content:**
- Quote: 16px body text, italic feel
- Avatar: Gradient circle with initials (MR, MM)
- Name + role: 14px bold name, 12px muted role
**Person 1:** "This platform cut my administrative work in half. I spend less time on the phone and more time teaching." — Matt Reedy, Driving Instructor
**Person 2:** "Finally, a tool that actually understands how a driving school works. TCA tracking alone is worth the price." — Mark Martin, CS Teacher

### 6. Booking Widget (ALWAYS DARK)
**Background:** Hardcoded `#0D1117` — never changes with theme
**Layout:** 45% text left / 55% calendar right
**Left side:**
- Headline: "Book a session." or "Let's talk."
- 3 bullets with green checkmarks
- Decorative circles (vibrant overlapping: cyan #38BDF8, pink #F472B6, orange #FB923C, yellow #FBBF24) — use DecorativeCircles component
**Right side:** BookingCalendar component (already built, keep as-is)
**Background circles:** Three `.bg-circle` elements — one cyan, one pink, one orange — positioned behind the left content

### 7. FAQ (Accordion)
**Style:** Glass-card accordion, one open at a time
**Items:** 4-5 common questions
- "Do I need a credit card to start?" → "No. Start with a 14-day free trial."
- "Is my school data isolated from other schools?" → "Yes. Multi-tenant RLS ensures complete data isolation."
- "How does TCA tracking work?" → Full explanation
- "What happens after the free trial?" → Pricing explanation
**Chevron:** Rotates 180° when open (CSS transform)

### 8. CTA Section
**Headline:** "Ready to grow your school?" — 48px/700
**Subtext:** "14-day free trial. No credit card required. Cancel anytime."
**Buttons:** "Start free trial" (primary) + "Book a call" (ghost)
**Background:** var(--bg-base), full-width, generous padding (96px top/bottom)

### 9. Footer
- DC logo badge + "The Driving Center" left
- Links: Privacy | Terms | Login | Sign up
- Copyright: "© 2026 The Driving Center"
- Clean 1-column layout, subtle top border

---

## What NOT to Do (Anti-patterns)

- ❌ NO particle starfield backgrounds
- ❌ NO "vibrant gradient hero" with purple/blue glow
- ❌ NO generic blue→purple gradient on backgrounds
- ❌ NO glassmorphism on the whole page (use it only for cards)
- ❌ NO dark mode default (light mode is the PRIMARY vibe)
- ❌ NO rounded-2px buttons — use 12px minimum
- ❌ NO "Get Started" hero CTA as the ONLY CTA (add secondary ghost)
- ❌ NO generic stock photos of dashboards

---

## Tech Stack Constraints

- Next.js App Router + React 19 + TypeScript
- TailwindCSS 4 with CSS variables
- Inter font via next/font (already configured)
- Lucide React for icons
- DO NOT touch globals.css or any backend files
- Keep existing working components: `ThemeToggle`, `DashboardMockup`, `BookingCalendar`, `DecorativeCircles`, `PricingCard`, `FaqItem`, `ScrollToTop`

---

## Animation

- Scroll-triggered `.fade-up` on all sections (IntersectionObserver — already in page)
- Button hover: `translateY(-1px)` + shadow intensify
- Card hover: `translateY(-2px)` (from glass-card CSS class)
- FAQ chevron: CSS `details[open] .faq-chevron { transform: rotate(180deg) }`
- Smooth transitions: `transition: all 0.2s ease`

---

## Success Criteria

1. Hero is light mode by default (warm gray bg, not white, not dark)
2. Headlines use Inter 800, not a random serif
3. Primary buttons are dark (#111827), NOT blue gradient
4. Cards have 24px radius, NOT 16px
5. NO particle starfield
6. Booking section is always dark (#0D1117)
7. Build passes 0 TypeScript/ESLint errors
8. Page feels "Premium Minimalist Modern Clean" (Dashboard Image 2 aesthetic), NOT "generic AI-generated"
