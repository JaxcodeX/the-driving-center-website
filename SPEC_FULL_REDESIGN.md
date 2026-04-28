# SPEC — Full Site Redesign (Design Reference System)

## Overview

Apply the best elements from the 5 reference screenshots across ALL pages of The Driving Center SaaS. Not a full rebuild — a systematic design upgrade that brings the site in line with premium SaaS standards.

**Design foundation:** Dark default (keeping our current dark mode) + light toggle. Keep our existing dark/light theme system — the redesign applies better aesthetics within it.

---

## Design System — Borrowed Elements

### Color Palette (dark mode)
- Background base: `#080809` (current)
- Surface/card: `#0F172A` (current) + glassmorphism (`rgba(255,255,255,0.04)`)
- Accent primary: `#1A56FF` (current blue — keep)
- Accent secondary (from FinPoint): `#F97316` (vibrant orange — for positive metrics, active states)
- Success: `#4ADE80` (keep)
- Text primary: `#FFFFFF`, secondary: `#94A3B8`, muted: `#64748B`
- Border: `rgba(255,255,255,0.07)`

### Light mode
- Background: `#F5F4F0` (bone/off-white — from 24Solar's warm neutral)
- Cards: `#FFFFFF`
- Text dark: `#0A0A0A`

### Typography (from Origin screenshot)
- Headlines: bold geometric sans (Inter 800-weight), large sizes, tight letter-spacing
- Subheadlines: Inter 400-500
- Accent word in headline: `gradient-text` with blue-to-purple shimmer (keep existing)
- Body: Inter 400, generous line-height (1.65)

### Card System (from Dashboard + Zentra)
- Rounded corners: `16px` (was `12px`)
- Soft shadows: `0 8px 32px rgba(0,0,0,0.3)` (dark) / `0 8px 32px rgba(0,0,0,0.08)` (light)
- Glassmorphism: `backdrop-filter: blur(12px)` + `background: rgba(255,255,255,0.04)` + `border: 1px solid rgba(255,255,255,0.08)`
- Card hover: subtle `translateY(-2px)` lift + shadow deepen

### Buttons (from Origin + 24Solar)
- Primary: pill-shaped (`border-radius: 999px`), solid accent fill, white text, small arrow icon `→`
- Secondary/ghost: pill-shaped, transparent with border, accent text
- All buttons: `padding: 12px 24px`, `font-size: 14px`, `font-weight: 600`
- Hover: slight glow effect (`box-shadow: 0 0 20px var(--accent-glow)`)

### Dashboard-Specific (from Dashboard + FinPoint)
- Sidebar: narrow (240px), dark `#0F172A`, icon + text nav items, active pill highlight
- KPI cards: white/dark cards with large bold number, label below, colored delta indicator (green up, red down)
- Data tables: clean rows, subtle hover highlight, rounded container
- Status pills: `border-radius: 999px`, small, colored backgrounds

### Section Layouts (from 24Solar)
- Bento grid: features section uses varied-size grid cards
- Trust bar: city names in a clean horizontal strip (keep existing)
- Booking section: always dark, decorative circles (keep existing)

---

## Page-by-Page Spec

### 1. Landing Page (`src/app/page.tsx`)

#### Hero Section
- Keep existing structure (eyebrow → badge → h1 → subhead → CTAs)
- **Upgrade:** Add atmospheric gradient backdrop (dark vignette) behind the hero
- Add small trust icons below CTAs (laurel/star icons like Origin)
- Dashboard mockup below — glassmorphism card with rounded corners + subtle shadow

#### Features Section
- **Upgrade to bento grid** (from 24Solar): 3-column asymmetric grid
  - Large feature card (spans 2 cols) with icon + title + description
  - Smaller metric cards (student count, schools, sessions)
  - Use glassmorphism cards with colored icon backgrounds (mesh gradient backgrounds)

#### How It Works
- Keep existing 3-step structure
- Upgrade cards: glassmorphism, numbered steps with accent circle, clean icons

#### Testimonials
- Upgrade: cards with avatar (initials), name, school, quote
- Glassmorphism cards, rounded corners, subtle border

#### Pricing Section
- Upgrade: larger cards, "Popular" badge on middle tier, all pill buttons
- Dark card for recommended tier, light cards for others

#### FAQ
- Clean accordion, glassmorphism panel styling

### 2. Signup Page (`src/app/signup/page.tsx`)
- Clean centered card on dark background
- Glassmorphism card container (`backdrop-filter: blur`)
- Step indicator at top (1 → 2 → 3)
- Form fields: pill-shaped inputs, dark surface
- Primary CTA: full-width pill button
- Subtle decorative gradient circles in background

### 3. Login Page (`src/app/login/page.tsx`)
- Same card layout as signup
- Demo login box: subtle, distinct — glassmorphism inner panel
- Magic link email input + "Send login link" button

### 4. School Admin Dashboard (`src/app/school-admin/page.tsx`)

#### KPI Row (from FinPoint/Dashboard)
- 4 cards: Total Students, Active Sessions, Monthly Revenue, Completion Rate
- Each card: large bold number, label, colored delta (e.g., "+12%")
- Glassmorphism card style

#### Quick Actions Strip
- 4 icon buttons: Add Student, Schedule Session, Send Reminder, View Calendar
- Pill-shaped, glassmorphism

#### Recent Activity Table
- Clean table: student name, session type, date, status pill, actions
- Row hover: subtle highlight
- Glassmorphism table container

#### Upcoming Sessions Strip (from FinPoint watchlist)
- Horizontal scrollable strip of session cards
- Each card: time, student name, instructor, status pill

### 5. Students Page (`src/app/school-admin/students/page.tsx`)
- Search + filter bar at top
- Table with avatar initials, name, email, progress bar, TCA status, actions
- Glassmorphism table container
- "Add Student" button in header

### 6. Sessions Page (`src/app/school-admin/sessions/page.tsx`)
- Calendar grid view (keep existing)
- Session cards: glassmorphism, color-coded by status
- Filter tabs: Upcoming / Completed / Cancelled

### 7. Booking Page (`src/app/book/page.tsx`)
- Clean, focused layout
- 2-column: form left, confirmation card right
- Progress indicator
- Glassmorphism form card

### 8. Global Styles (`src/app/globals.css`)

#### New classes to add:
```css
/* Bento grid */
.bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.bento-large { grid-column: span 2; }

/* Glassmorphism card */
.glass-card {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 24px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
}

/* KPI card */
.kpi-card { }
.kpi-value { font-size: 36px; font-weight: 800; letter-spacing: -0.02em; }
.kpi-delta { font-size: 13px; font-weight: 600; }
.kpi-delta.positive { color: var(--success); }
.kpi-delta.negative { color: #F87171; }

/* Status pill */
.status-pill {
  display: inline-flex; align-items: center;
  padding: 4px 12px; border-radius: 999px;
  font-size: 12px; font-weight: 600;
}
.status-active { background: rgba(74,222,128,0.15); color: #4ADE80; }
.status-pending { background: rgba(249,115,22,0.15); color: #F97316; }
.status-completed { background: rgba(26,86,255,0.15); color: #60A5FA; }

/* Nav pill (sidebar active state) */
.nav-pill {
  background: rgba(26,86,255,0.15);
  color: #60A5FA;
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: 600;
}

/* Decorative background circles */
.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}
```

---

## Implementation Order

1. **globals.css** — add all new design system classes
2. **Landing page** — hero upgrade, bento features, testimonial cards, pricing cards
3. **Auth pages** — signup + login redesign with glassmorphism cards
4. **School admin dashboard** — KPI cards, quick actions, activity table
5. **Students page** — table styling with glassmorphism
6. **Sessions page** — calendar and card styling
7. **Booking page** — form and confirmation card

---

## Build & Commit Rules
- Run `npm run build` after each agent task — must pass
- If build fails, agent self-corrects before reporting
- Commit each page as: `feat: redesign [pagename] [prov: everest] [prov: deepseek-claude]`
- Do NOT modify API routes, lib files, or database schemas — UI only