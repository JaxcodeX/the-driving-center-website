# BLUEPRINT — Dark Mode Landing Page Rebuild
# The Driving Center SaaS

## Core Architecture

**The page is a linear list of full-width sections.** Each section is a named React component function, composed in the main Page export. Simple.

**Layout rule:** Every section has a `max-width: 1200px` centered container. Layout inside uses flexbox or CSS grid. No deep nesting.

**Style approach:**
- Prefer `className` from globals.css (glass-card, btn-glow, btn-ghost, bento-grid, bento-large, section-eyebrow, etc.)
- Inline styles ONLY for per-section nuances that don't repeat
- No inline flex/grid on wrappers — use class names from globals.css

---

## Section Components

### 1. Navbar
- 68px height, sticky top
- Transparent → `background: rgba(9,9,11,0.85) + backdrop-filter: blur(16px)` on scroll
- Logo: DC icon (blue square with SVG triangle) + "The Driving Center" text left
- Nav links center: Features | Pricing | FAQ — 15px, Inter 500, text-secondary
- Right: "Log in" text link + "Start free trial" pill (yellow `#FACC15`, black text, Inter 700)
- Border bottom: 1px solid rgba(255,255,255,0.08)

### 2. Hero
- Background: `#09090B` with subtle radial yellow glow at bottom
- Layout: CSS grid, 2 columns — 60% LEFT / 40% RIGHT, gap: 64px
- LEFT column:
  - Eyebrow pill: "SCHEDULING SOFTWARE FOR DRIVING SCHOOLS" — blue text + bar
  - Headline: "The simplest way to run your driving school" — Inter 800, clamp(52px,7vw,88px), white, line-height 1.05, tight letter-spacing
  - Subheadline: "Everything you need to manage bookings, track students, and grow your school — all from one dashboard." — 17px, text-secondary
  - CTA row: "Start free trial" yellow pill + "Book a demo" ghost pill
  - Trust line: "Trusted by 50+ driving schools across Tennessee" — 13px, text-muted
- RIGHT column: Single large mesh gradient card
  - Size: fills the column, ~480px tall
  - Background: pink→purple→blue mesh gradient (radial gradients layered)
  - Border-radius: 32px
  - Content inside (centered):
    - "Start today" black badge pill at top
    - "The Driving Center" large white serif-like headline
    - "See pricing" white button pill
    - Subtle avatar row at bottom
  - `box-shadow: 0 0 80px rgba(250,204,21,0.12), 0 32px 64px rgba(0,0,0,0.6)`
- Padding: 140px top, 100px bottom

### 3. Logo Strip
- Background: `#18181B`
- Padding: 48px top/bottom
- Label: "Trusted by schools across Tennessee" — 11px caps, text-muted
- Logos: styled as school NAME text (Inter 600, 14px, text-muted), NOT abbreviations
  - Use real-sounding names: "Smokey Mountain Drivers", "Volunteer Auto School", "River City Driving", "Delta Advanced Drivers", "Summit Traffic School"
  - Horizontal row, centered, gap: 48px
  - Grayscale + 45% opacity → full opacity on hover
  - Simple text, no logo boxes

### 4. Features
- Background: `#09090B`
- Section eyebrow: "FEATURES" — small caps label with blue accent bar
- Section headline: "Everything your school needs to grow" — Inter 700, clamp(36px,4vw,52px)
- Bento grid: CSS grid 3 columns, gap: 20px
  - Two LARGE cards: `grid-column: span 2` each (go in left column, stacked)
  - Four SMALL cards: normal grid cells
- LARGE card structure:
  - Top: 80px mesh gradient strip (pink/purple/blue for first, yellow/orange for second)
  - Body: icon + title + description
  - Bottom: 3px solid blue accent bar (`#3B82F6`, NOT rainbow gradient)
  - Border-radius: 24px
  - `box-shadow: 0 8px 40px rgba(0,0,0,0.5)`
- SMALL card structure:
  - No mesh strip — just icon + title + description
  - Border-radius: 20px
  - Hover: lift + border brightens
- Feature content:
  - Large 1: "Online Booking" — students book 24/7, choose session types + instructors, pay upfront
  - Large 2: "Automated Reminders" — SMS + email reminders cut no-shows by 60%, custom timing rules
  - Small 1: "Student Tracking" — TCA progress, session history, certification docs
  - Small 2: "Stripe Billing" — instant payments, auto receipts, dispute handling
  - Small 3: "Instructor Management" — assign schedules, track hours, manage availability
  - Small 4: "Multi-tenant Security" — SOC 2 Type II, bank-level encryption, GDPR compliant
- Padding: 100px top, 100px bottom

### 5. How It Works
- Background: `#09090B`
- Section eyebrow: "HOW IT WORKS"
- Section headline: centered, "Simple, transparent, effective"
- 3 cards in flex row, gap: 24px
- Each card:
  - Top half: mesh gradient — yellow/orange (card 1), blue/cyan (card 2), green/blue (card 3)
  - Bottom half: `#18181B` with title + description
  - Border-radius: 28px
  - Step number: 40px, Inter 800, `color: rgba(255,255,255,0.08)` — VISIBLE but muted
  - Dashed connector line between cards (CSS pseudo-element or border)
- Steps:
  1. "Create your school profile" — Set up your school in under 5 minutes. Add your school name, logo, session types, and pricing.
  2. "Add instructors and students" — Invite your instructors, add your student roster, and start accepting bookings immediately.
  3. "Accept bookings online" — Students book and pay directly. You manage everything from your dashboard — no more phone tag.
- Padding: 100px top, 100px bottom

### 6. Stats Bar
- Background: `#18181B`
- 4 stats centered in a row:
  - "50+" / "Schools" — 48px Inter 800 white number, 12px muted label
  - "10,000+" / "Sessions Booked"
  - "$2M+" / "Processed"
  - "99.9%" / "Uptime"
- Vertical dividers between stats
- Padding: 60px top/bottom

### 7. Pricing
- Background: `#09090B`
- Section eyebrow: "PRICING"
- Section headline: centered
- 3 cards in flex row, gap: 24px
- Each card:
  - `#18181B` background, border-radius: 24px, padding: 32px
  - Plan name (small caps), price (48px Inter 800), description, feature list, CTA
  - Feature checkmarks: Lucide Check, blue color
- Center card (Growth $199):
  - `box-shadow: 0 0 60px rgba(37,99,235,0.25)`
  - `border: 1.5px solid #2563EB`
  - "Most Popular" badge pill
  - Yellow CTA pill
- Side cards: ghost pill CTA
- Tiers:
  - Starter $99: Up to 25 students, unlimited sessions, email+SMS reminders, Stripe payments, TCA tracking
  - Growth $199: Up to 100 students, everything in Starter, instructor management, parent portal, priority support
  - Enterprise $499: Unlimited students, everything in Growth, multi-location support, API access, dedicated success manager
- Padding: 100px top, 100px bottom

### 8. FAQ
- Background: `#18181B`
- Section eyebrow: "FAQ"
- Centered, max-width: 680px
- Accordion: native `<details>` element
  - Each item: border-bottom, trigger hover turns blue
  - Content: text-secondary
- Items:
  - "How long does it take to set up?" → "Most schools are up and running in under 5 minutes. Create your school profile, add your instructors, and you're ready to accept bookings."
  - "Can I import my existing student data?" → "Yes. Import CSV files or connect via our API. All student records, session history, and TCA progress transfers automatically."
  - "What happens if a student doesn't show up?" → "Automated reminders go out 24 hours and 2 hours before each session. You can set your own cancellation policy and the system enforces it."
  - "Is my school's data secure?" → "We use bank-level encryption (AES-256), SOC 2 Type II infrastructure, and never share your data with third parties. You're the only one who sees your student information."
  - "Do you offer refunds?" → "Yes. If you cancel within your first 30 days and you're not satisfied, we'll refund your first month — no questions asked."
- Padding: 80px top, 80px bottom

### 9. CTA Section
- Background: `#09090B`
- Centered text
- Headline: "Ready to run your school better?" — Inter 700, clamp(36px,4vw,52px)
- Subheadline: "Join 50+ driving schools across Tennessee already using The Driving Center."
- CTA: "Start free trial" yellow pill — `padding: 16px 36px`, `box-shadow: 0 0 60px rgba(250,204,21,0.2)`
- Padding: 100px top, 100px bottom

### 10. Footer
- Border-top only, no full background
- Layout: logo left | links center | copyright right
- Links: Privacy | Terms | Login — 13px, text-muted
- Copyright: "© 2026 The Driving Center. All rights reserved."
- Padding: 32px top/bottom

---

## CSS Values Reference

```
--bg-base: #09090B
--bg-surface: #18181B
--bg-elevated: #1F1F23
--text-primary: #FFFFFF
--text-secondary: #A1A1AA
--text-muted: #52525B
--accent-yellow: #FACC15
--accent-blue: #3B82F6
```

---

## Mesh Gradient Recipes

```css
/* Pink → Purple → Blue (Hero card, HowItWorks step 2) */
background:
  radial-gradient(ellipse 80% 60% at 20% 20%, rgba(236,72,153,0.55) 0%, transparent 60%),
  radial-gradient(ellipse 60% 80% at 80% 80%, rgba(59,130,246,0.5) 0%, transparent 60%),
  radial-gradient(ellipse 60% 60% at 50% 50%, rgba(168,85,247,0.4) 0%, transparent 70%),
  #18181B;

/* Yellow → Orange → Red (HowItWorks step 1) */
background:
  radial-gradient(ellipse 70% 50% at 30% 30%, rgba(250,204,21,0.55) 0%, transparent 55%),
  radial-gradient(ellipse 50% 70% at 70% 70%, rgba(249,115,22,0.45) 0%, transparent 60%),
  radial-gradient(ellipse 40% 40% at 60% 40%, rgba(239,68,68,0.3) 0%, transparent 50%),
  #18181B;

/* Blue → Cyan → Purple (HowItWorks step 3) */
background:
  radial-gradient(ellipse 60% 60% at 20% 80%, rgba(6,182,212,0.5) 0%, transparent 50%),
  radial-gradient(ellipse 70% 50% at 80% 20%, rgba(59,130,246,0.5) 0%, transparent 60%),
  radial-gradient(ellipse 50% 60% at 50% 50%, rgba(168,85,247,0.4) 0%, transparent 65%),
  #18181B;

/* Green → Blue → Cyan (feature large card 2) */
background:
  radial-gradient(ellipse 60% 60% at 70% 30%, rgba(16,185,129,0.5) 0%, transparent 55%),
  radial-gradient(ellipse 60% 60% at 30% 70%, rgba(59,130,246,0.45) 0%, transparent 55%),
  radial-gradient(ellipse 50% 50% at 50% 50%, rgba(6,182,212,0.35) 0%, transparent 60%),
  #18181B;
```

---

## Class Names from globals.css (use these first)
- `glass-card` — dark glassmorphism card
- `btn-glow` — white fill pill
- `btn-ghost` — outlined pill
- `btn-pill` — small pill button
- `bento-grid` — 3-column grid
- `bento-large` — span 2 columns
- `section-eyebrow` — small caps + blue bar
- `accordion-panel` — FAQ container
- `accordion-item` — FAQ row
- `status-pill` — rounded status badge
- `status-active`, `status-pending`, `status-completed` — colored variants
