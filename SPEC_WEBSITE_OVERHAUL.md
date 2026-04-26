# SPEC.md — The Driving Center Website Overhaul

**Date:** 2026-04-26
**Goal:** Full premium dark redesign + working end-to-end demo flow
**Stack:** Next.js 15 + Tailwind CSS v4 + TypeScript + Lucide React + Inter font

---

## Context

The homepage is done (SPEC_PREMIUM_HOMEPAGE.md). Now we need:
1. Every other page updated to the same premium dark design system
2. Login → onboarding → dashboard flow that works end-to-end in DEMO_MODE

**Design tokens (from SPEC_PREMIUM_HOMEPAGE.md):**
```
bg:         #050505
surface:    #0D0D0D
elevated:   #18181b
border:     #1A1A1A
borderLt:   #27272a
text:       #ffffff
secondary:  #94A3B8
muted:      #52525b
cyan:       #38BDF8
purple:     #818CF8
green:      #10B981
grad:       linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)
```

---

## Pages to Update

### 1. `/login` — Magic Link Login
**Current state:** Old design
**Goal:** Clean centered card matching premium dark system

Layout:
- Logo centered at top
- Single card centered on page: "Sign in to your school" headline + email input + "Send magic link" gradient button
- Check inbox confirmation state (replace form with checkmark + "Check your inbox" message)
- Link to signup below card
- Background: solid #050505

Specs:
- Card: bg #0D0D0D, border #1A1A1A, rounded-2xl, p-8
- Email input: bg #18181b, border #27272a, rounded-xl, px-4 py-3, text-sm, placeholder #52525b
- Button: bg gradient, white text, rounded-xl, full-width, py-3.5
- Focus state: border cyan with subtle glow

### 2. `/signup` — School Registration
**Current state:** Old design
**Goal:** Clean centered form + premium dark

Layout:
- Logo at top
- Card: "Start your free trial" headline + school name input + owner name input + email input + "Create school" button
- Already have account? Log in link below
- DEMO_MODE: creates real school in Supabase, redirects to /onboarding

Specs: same card/input/button tokens as login

### 3. `/onboarding` — School Setup Wizard
**Current state:** Old design
**Goal:** Step-by-step wizard with progress indicator

Layout:
- Stepped form: Step 1 (school info) → Step 2 (instructor) → Step 3 (session type) → Done
- Progress indicator at top: dots or step numbers
- Each step in a card
- "Continue" button (gradient) + "Skip for now" link
- DEMO_MODE: skip Stripe, allow profile saves

Steps:
1. School name (pre-filled from signup), phone, address
2. Add first instructor (name + email)
3. Add session type (name, price, duration)
4. Done → redirect to /school-admin

### 4. `/school-admin` — Dashboard Shell
**Current state:** Old design, functional
**Goal:** Clean dark dashboard matching premium system

Layout:
- Left sidebar: logo + nav links (Dashboard, Students, Sessions, Calendar, Instructors, Billing, Settings)
- Top bar: school name + user avatar + logout
- Main content: page-specific

Sidebar specs:
- Width: w-56
- bg: #0D0D0D, border-right: 1px #1A1A1A
- Nav items: flex gap-3 px-4 py-2.5 rounded-xl, active: bg #18181b + cyan text
- Icons: Lucide, w-5 h-5, text #52525b (active: #38BDF8)

Top bar specs:
- h-16, border-bottom #1A1A1A, bg #0D0D0D
- School name left, user right

### 5. `/school-admin/students` — Student List
- Table with columns: Name, Email, Phone, Status, Enrolled, Actions
- "Add Student" button top right (gradient)
- Student rows: bg #0D0D0D, hover bg #18181b
- Actions: Edit (pencil icon), View TCA (shield icon)
- Pagination or infinite scroll

### 6. `/school-admin/instructors` — Instructor List
- Instructor cards in grid (not table)
- Each card: avatar circle + name + email + status badge
- "Invite Instructor" button (gradient outline)
- Link to `/school-admin/instructors/[id]/schedule`

### 7. `/login/page.tsx` — Already written, needs rebuild check
Verify current file matches design system. If not, rebuild to spec.

---

## Demo Flow (Must Work End-to-End)

```
/signup → POST /api/schools → creates school in Supabase → redirect to /onboarding
/onboarding → POST /api/schools/[slug] → updates school → redirect to /school-admin
/school-admin → Dashboard with sidebar, stats, recent sessions
```

**DEMO_MODE=true:** Skip Stripe, allow profile saves, allow session creation

---

## Implementation Order

1. `/login` page → rebuild
2. `/signup` page → rebuild
3. `/onboarding` page → rebuild
4. `/school-admin` layout (sidebar + topbar) → rebuild shell
5. `/school-admin/students` → rebuild
6. `/school-admin/instructors` → rebuild
7. End-to-end test: signup → onboarding → dashboard

---

## Design Rules

- NO framer-motion — vanilla JS only
- Lucide React icons throughout
- Inter font from next/font/google
- IntersectionObserver for any scroll animations
- All spacing/padding from design tokens
- No emoji as icons

---

## Anti-Patterns

- Rounded-lg on cards (use rounded-2xl minimum)
- bg-black (use #050505)
- Flat #000 borders (use #1A1A1A)
- Vivid accent on large areas (use muted, accent as highlight only)
- Rounded-full on inputs (use rounded-xl)
