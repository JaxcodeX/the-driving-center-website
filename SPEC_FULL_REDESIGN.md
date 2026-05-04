# SPEC — Landing Page Redesign
# DesignJoy Reference Implementation

## Reference Screens Analyzed
- `design1.png` — SaaS split-screen login/signup (EASY-O dashboard)
- `design2.png` — SaaS split-screen login/signup (EASY-O dashboard)
- `design3.png` — Dark landing page (Calendr.com, dark mode)
- `design4.png` — Dark calendar dashboard (beatgig)
- `design5.png` — DesignJoy landing page (light, mesh gradients)
- `design6.png` — DesignJoy hero section (warm off-white)
- `design7.png` — DesignJoy membership benefits (mesh gradient cards)
- `design8.png` — DesignJoy testimonials (editorial serif typography)
- `design9.png` — DesignJoy booking page (dark with candy color accents)

## Design Direction: "Warm Premium Dark-Light Hybrid"
Take DesignJoy's premium warmth + generous whitespace, adapt for a driving school SaaS.
Not a dark-only site. Not flat corporate blue. Warm, confident, premium.

---

## Global Design Tokens

### Colors — Warm Mode (default for landing)
```css
--bg-base: #F5F4F0;           /* Warm off-white (DesignJoy "paper" background) */
--bg-surface: #FFFFFF;         /* Pure white for cards */
--bg-dark: #0B0B0E;            /* Near-black for dark sections */
--text-primary: #0A0A0A;       /* Deep charcoal (not pure black) */
--text-secondary: #6B6B6B;      /* Muted gray */
--text-muted: #9B9B9B;         /* Light gray */
--border: rgba(0,0,0,0.08);     /* Very subtle borders */
--accent: #1A56FF;              /* Keep blue accent */
--accent-secondary: #F97316;   /* Vibrant orange */
--success: #16A34A;
```

### Dark Sections (for contrast blocks)
```css
--dark-bg: #0B0B0E;
--dark-surface: #131316;
--dark-border: rgba(255,255,255,0.07);
--dark-text: #FFFFFF;
--dark-text-secondary: #8A8F98;
```

### Typography
- **Display:** Inter 800 weight, massive size (clamp 56px–96px), tight letter-spacing (-0.03em)
- **Headlines:** Inter 700, large, tight letter-spacing
- **Emphasis words:** Inter italic or serif italic for accent words in headlines (like DesignJoy)
- **Body:** Inter 400, generous line-height (1.7), comfortable size (16-17px)
- **Labels:** Inter 500-600, small, uppercase, wide letter-spacing (0.08em)

### Spacing System
- Section padding: 100px–140px vertical (massive whitespace)
- Container max-width: 1100px (centered)
- Card gap: 24px
- Generous margins between elements within sections

### Border Radius
- Cards: 20px (DesignJoy "squircle" feel)
- Buttons: 999px (pill)
- Inputs: 999px (pill)
- Feature cards: 20px

### Shadows
- Cards: `0 8px 40px rgba(0,0,0,0.08)` (light), `0 8px 40px rgba(0,0,0,0.3)` (dark bg)
- Soft, large radius, low opacity — not harsh

---

## Section-by-Section Implementation

### 1. Navbar (transparent, sticky)
- Logo left: "The Driving Center" text mark or small icon + wordmark
- Nav center (desktop): Features, Pricing, FAQ (text links, no background)
- Right: "Login" (text link) + "Start free trial" (pill button, dark fill)
- On scroll: add subtle backdrop blur or border-bottom
- Height: 64px

### 2. Hero Section (light/warm bg)
- **Layout**: Asymmetric — headline left, feature card right (like DesignJoy hero)
- **Eyebrow**: Small pill badge "Scheduling Software for Driving Schools"
- **Headline**: Two-line massive headline (80px+) using gradient-text for key word
  - "The simplest way to run your driving school"
- **Subheadline**: 1-2 lines, text-secondary color, 18px
- **CTA row**: Primary "Start free trial" (dark pill) + Secondary "See demo" (outlined pill)
- **Trust line**: Small gray text below CTAs — "Trusted by 50+ driving schools"
- **Right side**: Feature highlight card (bento-style) with mesh gradient background showing dashboard preview or abstract graphic
- **Spacing**: Massive — top 120px padding, bottom 80px

### 3. Features Section (bento grid, light bg)
- **Layout**: Bento asymmetric grid — 2 large cards + 3 small metric cards
- **Background**: Warm off-white (--bg-base)
- **Section label**: Small eyebrow text "EVERYTHING YOUR SCHOOL NEEDS"
- **Feature cards**: 
  - Glassmorphism with warm tint + subtle shadow
  - Icon at top (Lucide icon, 24px)
  - Bold title + description
  - Feature 1 (large): Online Booking
  - Feature 2 (large): Automated Reminders
  - Features 3-6 (small): Student Tracking, Stripe Billing, Instructor Management, Multi-tenant Security
- **Small metric cards**: Show "50+ schools", "10,000+ sessions booked" with large bold numbers

### 4. How It Works (dark bg section)
- **Background**: Dark (#0B0B0E) for contrast
- **Layout**: Centered, 3 steps horizontal
- **Step cards**: Dark glassmorphism card per step
  - Large step number (muted, huge 80px)
  - Step title
  - Step description
- **Visual style**: Clean, minimal, high contrast white text on dark
- **Spacing**: 100px+ vertical padding

### 5. Testimonials / Social Proof (light bg, editorial)
- **Background**: Warm off-white
- **Layout**: Large quote centered, editorial serif italic typography
- **Quote**: Huge serif italic quote text
- **Attribution**: Name + school below in small caps
- **Style**: Magazine editorial layout, not card-based grid

### 6. Pricing (light bg)
- **Background**: Warm off-white
- **Layout**: 3-column grid, center tier highlighted
- **Cards**: White cards with soft shadow, large rounded corners (20px)
- **Middle card**: Dark fill, white text, "Most Popular" pill badge
- **Cards should look like DesignJoy pricing**: large numbers, clear feature lists, pill CTAs

### 7. CTA Section (dark bg)
- **Background**: Dark (#0B0B0E)
- **Layout**: Centered, single headline + subheadline + CTAs
- **Text**: Large, white, centered
- **CTAs**: Primary pill (white fill, dark text) + Secondary pill (outlined white)

### 8. Footer
- **Background**: Dark border top on warm off-white
- **Layout**: Simple centered footer with logo + links

---

## Animation & Micro-interactions
- Cards: subtle translateY(-4px) + shadow deepen on hover
- Buttons: scale(0.98) on press, slight glow on hover
- Scroll: fade-up animation on sections entering viewport (IntersectionObserver)
- FAQ accordion: smooth height transition

## Implementation Order
1. Design tokens in globals.css (warm palette + dark palette)
2. Navbar component
3. Hero section (with bento card right side)
4. Features bento grid
5. How It Works (dark section)
6. Testimonials (editorial)
7. Pricing cards
8. CTA section (dark)
9. Footer

## Build Rules
- `npm run build` must pass after each section
- Use existing design system classes where possible (`glass-card`, `btn-glow`, etc.)
- Do NOT modify API routes or database schemas
- Font: Inter is already loaded via next/font in layout.tsx — use it
- For serif: import Playfair Display from Google Fonts for editorial quotes
