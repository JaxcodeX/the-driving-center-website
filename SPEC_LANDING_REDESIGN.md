# SPEC — Landing Page Redesign (DesignJoy Edition)

## Status
Ready to execute — dark mode default, light mode via toggle

---

## 0. Theme System — Light / Dark Toggle

**Default: Dark mode** (Zax's preference)
Toggle switch in navbar lets users flip between dark and light.

### Color Tokens (CSS custom properties)

```css
/* Dark mode (default) */
:root,
[data-theme="dark"] {
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
  --card-shadow: 0 0 80px rgba(0,102,255,0.12);
  --section-alt: #0F172A;
}

/* Light mode */
[data-theme="light"] {
  --bg-base: #F5F4F0;
  --bg-surface: #FFFFFF;
  --bg-elevated: #FFFFFF;
  --text-primary: #0A0A0A;
  --text-secondary: #6B6B6B;
  --text-muted: #9B9B9B;
  --border: rgba(0,0,0,0.08);
  --accent: #1A56FF;
  --accent-glow: rgba(26,86,255,0.12);
  --success: #16A34A;
  --card-bg: #FFFFFF;
  --card-border: rgba(0,0,0,0.06);
  --card-shadow: 0 4px 24px rgba(0,0,0,0.06);
  --section-alt: #EEEEEA;
}
```

### Toggle Implementation
- Toggle button: sun/moon SVG icon in navbar, 40px hit area
- On click: toggle `data-theme="dark"` / `data-theme="light"` on `<html>`
- Persist to `localStorage` so it survives page reload
- All color transitions: `transition: background 0.3s, color 0.3s, border-color 0.3s` on `<body>` and cards
- On load: read `localStorage` → apply saved theme (default dark if none)

### What Changes Per Theme

| Element | Dark | Light |
|---|---|---|
| Page background | #080809 | #F5F4F0 |
| Navbar | Semi-transparent blur | White with shadow |
| Cards | Blur + glass border | White, subtle shadow |
| Dashboard mockup | Dark #0F172A sidebar | Light #F5F4F0 sidebar |
| Body text | #FFF | #0A0A0A |
| Booking section | Deep navy #0D1117 | #0A0A0A |
| Stat cards | Blur glass | White fill |

---

## 1. Concept & Vision

Stop selling features. Start selling *outcome* + *credibility*.

The redesigned landing page follows the DesignJoy editorial pattern:
- Dark mode default (premium SaaS feel), light mode toggle available
- One idea per section — no clutter
- Big typography creates authority
- Visual proof > wall of text
- Booking widget at the end creates the conversion moment

**Core feeling:** "This is a real company with real customers. Book a call."

---

## 2. Design Language

### Typography
```
Display:  "Inter", weight 800, tight tracking (-0.03em)
Body:     "Inter", weight 400-500, generous line-height (1.7)
Labels:   Uppercase, 0.1em letter-spacing, 12px, weight 600
```

### Spatial System
```
Section padding:   120px top/bottom (desktop), 80px (tablet)
Card padding:     40px
Card gap:         24px
Card radius:      16px (large), 12px (medium)
```

### Motion
- Scroll-triggered fade-up (opacity 0→1, translateY 24px→0, 600ms ease-out)
- Stagger: 80ms between cards
- No bouncing, no parallax — clean, professional

### Icons
- Gradient mesh backgrounds per card (each card gets a unique gradient)
- Icon color: white
- Size: 48x48px icon blocks

---

## 3. Layout & Structure

### Sections (top to bottom):

**A. Navbar (sticky)**
- Logo left | nav links center | theme toggle (icon) + "Sign in" + "See pricing" button right
- Dark mode: `background: rgba(8,8,9,0.85)`, `backdrop-filter: blur(16px)`
- Light mode: `background: rgba(245,244,240,0.95)`, subtle shadow
- Theme toggle: sun/moon SVG, 40px click target

**B. Hero** (uses --bg-base)
- Eyebrow pill badge: "Trusted by driving schools in Tennessee"
- Headline: 64px, weight 800, tight tracking
  - Line 1: "The simplest way to run"
  - Line 2: "your driving school."
- Subheadline: 18px, --text-secondary, max 480px wide
- Two CTAs: "Book a call" (primary) + "Start free trial" (ghost)
- Right side: dashboard mockup (dark glassmorphism in dark mode, clean white in light mode — match the theme)
- Trust line below CTAs: --text-muted
- Layout: 55% text / 45% mockup on desktop

**C. Logo Bar** (--bg-surface)
- "Trusted by schools in:" + city names in --text-muted
- Simple text list — no fake logos

**D. Problem section** (--bg-base)
- Centered headline: "Running a driving school shouldn't feel like this"
- 3 pain point cards, text-based, --card-bg background

**E. Features** (--bg-surface)
- 3 cards with gradient icon blocks (blue→purple, purple→pink, orange→yellow)
- Cards: Track students | Schedule sessions | Get paid

**F. How It Works** (--bg-base)
- 3 numbered steps, clean spacing

**G. Social Proof** (--bg-surface)
- 2 large testimonial cards, side by side
- Quote in large text, name + role below

**H. Pricing** (--bg-base)
- 3 tiers, middle highlighted with blue border + "Most popular" badge

**I. Booking Widget** (deep dark — always dark regardless of toggle)
- Background: #0D1117 (this section is always dark — it's the conversion moment)
- Left: "Let's talk." headline + 3 benefit bullets + decorative vibrant circles
- Right: calendar grid with date picker + time slots + "Confirm booking" CTA

**J. FAQ** (--bg-surface)
- Accordion, centered, 640px max-width

**K. Footer** (--bg-base)
- Logo + copyright + privacy/terms links

---

## 4. Component Inventory

### Navbar
- Sticky, z-index 50
- Height: 64px
- Logo: "DC" icon + "The Driving Center" text
- Theme toggle: moon icon (dark) / sun icon (light), 40px
- "Sign in" link, "See pricing" filled button

### Eyebrow Badge
- Pill shape, --card-bg background, --border border
- Green pulse dot + "Trusted by driving schools in Tennessee"
- Font: 12px, weight 600

### Primary Button
- Background: var(--accent)
- Color: white
- Padding: 14px 28px, radius: 10px
- Font: 15px, weight 600
- Glow: `box-shadow: 0 0 30px var(--accent-glow)`

### Ghost Button
- Background: transparent
- Border: 1.5px solid var(--border)
- Color: var(--text-primary)
- Padding: 14px 28px, radius: 10px

### Card
- Background: var(--card-bg)
- Border: 1px solid var(--card-border)
- Radius: 16px, padding: 32px
- Backdrop-filter: blur(12px) in dark mode, none in light mode
- Hover: translateY -2px, border brightens

### Gradient Icon Block
- 48x48px, radius 12px
- Background: linear-gradient mesh (unique per card)
- Icon: white SVG, 24px

### Pricing Card
- Padding: 40px
- Feature list with green check SVGs
- CTA at bottom
- Highlighted: border 1.5px var(--accent), soft glow shadow

### FAQ Accordion
- Background: var(--card-bg)
- Border: 1px solid var(--border)
- Radius: 12px
- Chevron rotates 180° when open

---

## 5. Booking Section Detail (Always Dark)

**Background:** #0D1117 (never changes with theme toggle)

**Layout:** Split — 45% text / 55% calendar widget

**Left:**
- Headline: "Let's talk." (48px, white, weight 800)
- Sub: "30 minutes. No pitch. Just a real walkthrough." (--text-secondary)
- 3 bullets with green check icons
- Decorative: cluster of overlapping circles in vibrant colors (lime, hot pink, orange, royal blue, yellow) — DesignJoy style

**Right:**
- Month navigation (← month →)
- Calendar grid (7 columns, dates)
- Selected date: blue pill background
- Time slots: row of pill buttons below calendar
- "Confirm booking" primary CTA

---

## 6. Animations

```css
.fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
.fade-up.visible { opacity: 1; transform: translateY(0); }
.fade-up:nth-child(1) { transition-delay: 0ms; }
.fade-up:nth-child(2) { transition-delay: 80ms; }
.fade-up:nth-child(3) { transition-delay: 160ms; }
```

### Scroll Observer
- Single IntersectionObserver watches all `.fade-up` elements
- Adds `.visible` class when in viewport
- Disconnect after first trigger (one-shot animation)

---

## 7. Technical Approach

- **Framework:** Next.js App Router (existing)
- **Styling:** CSS custom properties in globals.css + inline style arrays in page.tsx
- **Theme state:** `localStorage` + `data-theme` on `<html>` — no flash on load
- **Animation:** CSS + single IntersectionObserver script
- **Fonts:** Inter via next/font (existing)
- **Icons:** Lucide React + inline SVG for gradient blocks
- **No breaking changes:** All existing routes stay intact

### Implementation Order
1. globals.css — add theme CSS variables + fade-up animation classes
2. page.tsx — rewrite all sections using CSS variables + theme toggle
3. Fade-up observer script
4. Deploy and verify

---

## 8. Dark vs Current

| Current | New |
|---|---|
| Pure black (#000) | Dark #080809 default |
| Particle starfield | Clean, no particles |
| No theme toggle | Dark/light toggle, dark default |
| Dense feature sections | One idea per section |
| "STAT STAT STAT" bar | "Trusted by schools in:" city list |
| No testimonials | 2 testimonial cards |
| Booking placeholder | Full booking widget |
| No scroll animation | Fade-up on all sections |
| macOS chrome on mockup | Clean frameless card |

---

## 9. Out of Scope
- Domain purchase
- Email infrastructure
- Backend changes
- New pages

**Only touch:** Landing page (page.tsx) + globals.css + root layout (for theme script)