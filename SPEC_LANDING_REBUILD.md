# SPEC.md — Landing Page Rebuild (Vibe Coding One-Pass)

**Based on:** AI Prompt Builder output (2026-04-27) + SPEC_LANDING_REDESIGN.md
**Goal:** Complete landing page rebuilt in one sub-agent pass using DeepSeek-Claude
**Context:** Design consistency pass (`0851d74`) just completed — CSS variables now enforced

---

## Design Direction

**Style:** Vibrant gradients + dark base + glowing accents. "Cutting-edge AI startup" feel.
**Palette:** Electric blue primary (`#1A56FF`), cyan accents (`#38BDF8`), dark backgrounds. Colors that feel energetic and tech-forward — not conservative.

| Element | Value |
|---|---|
| Background | `#080809` |
| Primary accent | `#1A56FF` |
| Cyan | `#38BDF8` |
| Purple gradient | `#707BFF` |
| Success | `#4ADE80` |
| Text primary | `#FFFFFF` |
| Text secondary | `#94A3B8` |
| Text muted | `#64748B` |

---

## Page Sections (in order)

### 1. Hero Section
- **Headline:** "The simplest way to run your driving school." (8 words — fits the brief)
- **Description:** One line — "Automate bookings, track student progress, manage instructors, and get paid — all in one place."
- **CTA button:** "Get Started" → `/signup`
- **Secondary button:** "Start free trial" → `/signup`
- **Right side:** Dashboard mockup (dark glassmorphism card showing a real school dashboard — KPI row, upcoming sessions, student count)
- **Above CTA:** Small trust badge — "Trusted by driving schools in Tennessee" with green pulse dot

### 2. Features Grid
6 cards, 3-column bento layout (first card spans 2 cols):
- Track every student — "Log sessions, TCA hours, and progress. Auto-generate certificates when requirements are met."
- Schedule without friction — "Students book online. Parents pay upfront. No more phone tag — just show up."
- Get paid and stay compliant — "Stripe handles payments. TCA tracking is automatic. Tennessee state compliance built in."
- Multi-tenant by design — "Each school gets their own isolated space. Data never leaks between schools."
- Automated reminders — "SMS and email reminders go out automatically. Fewer no-shows, less admin work."
- Instructor management — "Invite instructors, set availability, track their schedules — all from one dashboard."

Each card: gradient icon block (blue→purple), title, one-sentence description. Cards use `.glass-card` class.

### 3. Social Proof — "Trusted by schools in:"
Compact row of city names (no fake logos — they're real):
Knoxville | Nashville | Chattanooga | Memphis | Oneida | Cumberland

Label: "Trusted by driving schools in Tennessee"

### 4. Pricing Section
3 tiers, middle highlighted (blue border + "Most popular" badge):
- **Starter** — $99/mo — Up to 25 students, unlimited sessions, email reminders, Stripe payments, TCA tracking
- **Growth** — $199/mo — Up to 100 students, everything in Starter, instructor management, parent portal, priority support ← HIGHLIGHTED
- **Enterprise** — $399/mo — Unlimited students, everything in Growth, multi-location support, API access, dedicated success manager

Each card: plan name, price, feature list (green checkmarks), CTA button. Highlighted card has `border: 1.5px solid var(--accent)` and glow shadow.

### 5. Testimonials
2-3 cards, glassmorphism style:
- "This platform cut my administrative work in half. I spend less time on the phone and more time teaching." — Matt Reedy, Driving Instructor, East Tennessee (initials: MR, gradient avatar)
- "Finally, a tool that actually understands how a driving school works. TCA tracking alone is worth the price." — Mark Martin, CS Teacher (MM, gradient avatar)

### 6. Booking Widget (ALWAYS DARK — section never changes with theme toggle)
Background: `#0D1117` regardless of theme.
- Left: "Let's talk." headline + 3 benefit bullets + decorative circles (vibrant overlapping circles in cyan, pink, orange, blue — DesignJoy style)
- Right: Interactive calendar widget (month navigation, day grid, time slots below calendar, "Confirm booking" CTA)
- Layout: 45% text / 55% calendar

### 7. Contact / CTA Section
- Headline: "Ready to grow your school?" or similar
- Subtext: "14-day free trial. No credit card required."
- Two CTAs: "Start free trial" (primary) + "Book a call" (ghost)
- No actual form needed — this is a CTA section, not a contact form

### 8. Footer
- Logo: DC badge + "The Driving Center"
- Links: Privacy | Terms | Login | Sign up
- Copyright: "© 2026 The Driving Center"
- Layout: Logo left, links center-right

---

## Design System (Locked)

### CSS Variables (use these — hardcoded hex is the bug)
```css
:root {
  --bg-base: #080809;
  --bg-surface: #0F172A;
  --bg-elevated: #141B2D;
  --text-primary: #FFFFFF;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --border: rgba(255,255,255,0.07);
  --accent: #1A56FF;
  --accent-glow: rgba(26,86,255,0.25);
  --success: #4ADE80;
  --card-bg: rgba(255,255,255,0.04);
  --card-border: rgba(255,255,255,0.08);
}
```

### Shared Classes (use these, don't recreate)
- `.glass-card` — glassmorphism card (blur, border, 16px radius)
- `.btn-glow` — primary CTA button (white text, blue bg, glow shadow, rounded pill)
- `.btn-ghost` — secondary button (border only, rounded pill)
- `.input-pill` — pill-shaped input
- `.eyebrow` — badge with green pulse dot
- `.eyebrow-dot` — animated green pulse (already has `pulse` animation)
- `.section-num` — huge muted number for step sections
- `.fade-up` — scroll-triggered fade-up animation (IntersectionObserver adds `.visible`)

### Buttons
- Primary CTA: `className="btn-glow"` (NOT inline glow styles)
- Secondary: `className="btn-ghost"`
- Button radius: `999px` (pill) for all action buttons

### Animation
- Scroll fade-up on all sections (use `.fade-up` class)
- Hover effects on cards: `.glass-card:hover { transform: translateY(-2px) }`
- Button hover: slight lift + glow intensification via CSS classes

---

## Tech Stack
- Next.js App Router (existing project)
- React 19 + TypeScript
- TailwindCSS 4 (CSS variables + utility classes)
- CSS variables for all colors (no hardcoded hex)
- Inter font via next/font
- Lucide React for icons

---

## What NOT to Change
- Do NOT touch globals.css
- Do NOT touch any API routes
- Do NOT change any backend logic
- Do NOT touch any /school-admin pages or /book pages
- Only rebuild `src/app/page.tsx` (the landing page)

---

## Reference: Current globals.css Design System
[See ~/Projects/the-driving-center-website/src/app/globals.css — design tokens, glass-card, btn-glow, btn-ghost, fade-up, eyebrow classes all already defined and working]

---

## Out of Scope
- No domain purchase
- No email verification setup
- No backend changes
- No new pages
- No CMS or blog

---

## Success Criteria
1. All 8 sections (Hero → Footer) present and visually cohesive
2. No hardcoded hex colors — all colors use CSS variables
3. Build passes with 0 TypeScript/ESLint errors
4. Responsive (mobile + desktop)
5. Scroll animations work on all sections
6. Booking section always stays dark (hardcoded `#0D1117`)
7. Dashboard mockup in hero is theme-aware (dark sidebar in dark mode, light in light mode)
8. No `.const T = {...}` color objects