# SPEC — Full Website UI Redesign
**Project:** The Driving Center SaaS  
**Date:** 2026-04-26  
**Aesthetic:** TEDDY AI dark premium — true black, starfield, glassmorphism, gradient CTA glow

---

## Design Tokens (CSS Variables in globals.css)

```css
:root {
  --bg: #000000;
  --surface: #0a0a0a;
  --surface-2: #111111;
  --border: rgba(255,255,255,0.08);
  --text: #ffffff;
  --muted: #94A3B8;
  --subtle: #64748B;
  --accent: #0066FF;
  --accent-glow: 0 0 30px rgba(0,102,255,0.3);
  --gradient: linear-gradient(135deg, #7ED4FD, #707BFF);
  --gradient-text: linear-gradient(135deg, #7ED4FD, #707BFF);
  --card: rgba(255,255,255,0.05);
  --card-border: rgba(255,255,255,0.1);
  --input-bg: rgba(255,255,255,0.05);
}
```

---

## Pages to Build

### 1. `/login` — ✅ ALREADY DONE
Matches Ebolt screenshot. Dark glassmorphism card, starfield bg, demo PIN. No changes needed.
**Status:** Deployed and working.

---

### 2. `/signup` — ✅ ALREADY DONE
Matches login aesthetic. Dark glassmorphism card, school creation form, demo mode not required.
**Status:** Deployed and working.

---

### 3. `/school-admin/layout.tsx` — VERIFY + FIX
**Current state:** Has TEDDY AI dark sidebar but incomplete nav items  
**Required nav items:** Dashboard, Students, Sessions, Instructors, Calendar, Billing, Import  
**Required elements:**
- Logo: "DC" badge (gradient) + "The Driving Center" text, links to /
- Nav items: 40px height, px-5, text-sm, muted gray → white on hover
- Active state: white text, left border 2px #0066FF, bg rgba(0,102,255,0.1)
- Sidebar footer: school name display, settings link
- Mobile: hamburger toggle, overlay sidebar
- Preserved: demo_session cookie check, auth logic

**Read first:** `src/app/school-admin/layout.tsx`

---

### 4. `/school-admin/page.tsx` — DASHBOARD
**Reference:** Screenshot image 1 (bento dashboard) + image 4 (Shopeers admin)  
**Required elements:**
- Welcome: "Good [morning/afternoon/evening], [name]" — 24px bold white
- Date: formatted date, 14px muted
- 4 stat cards in bento grid: Active Students, Sessions This Week, Pending TCA, Revenue
  - Each card: glass-card class, 24px padding
  - Label: 11px uppercase muted
  - Value: 32px bold white
  - Change indicator: green pill with arrow up OR red pill with arrow down
- Recent Sessions table: glass-card, columns (Date, Student, Instructor, Type, Status)
- Quick Actions row: 3 buttons — "Add Student", "Schedule Session", "View Calendar"

**Read first:** `src/app/school-admin/page.tsx`

---

### 5. `/book/page.tsx` — BOOKING FLOW
**Reference:** Screenshot image 2 (Treva checkout/payment)  
**Required elements:**
- Background: true black with starfield
- Step indicator at top: "1 Select → 2 Info → 3 Pay" with active/completed states
- Step 1 — Session selection:
  - Cards with radio buttons, session type name + price
  - Selected state: border #0066FF, bg rgba(0,102,255,0.1)
  - Date/time inputs: dark styled, matching input design language
- Step 2 — Parent info form: name, email, phone (dark styled inputs)
- Step 3 — Payment:
  - Stripe Elements in dark mode (theme: 'night', colorPrimary: #0066FF)
  - Order summary sidebar: glass-card showing session details + total
  - "Confirm & Pay" button: full width, 52px, bg #0066FF, accent-glow
- TCA disclosure at bottom

**Read first:** `src/app/book/page.tsx`

---

## Build Order

1. Read existing file
2. Write new version preserving ALL existing functionality
3. `npm run build` — must pass 0 errors
4. Commit with message: "redesign: [page name]"
5. `vercel deploy --prod --yes`
6. Report URL

## If Error Persists 3 Times
Stop and report what was tried.

## Design Language for All Pages

**Inputs:** `height: 52px`, `border-radius: 12px`, `bg: rgba(255,255,255,0.05)`, `border: 1px solid rgba(255,255,255,0.1)`, focus: `border-color: rgba(0,102,255,0.6)`

**Buttons:** `height: 52px`, `border-radius: 12px`, primary: `bg: #0066FF`, white text, `box-shadow: 0 0 30px rgba(0,102,255,0.3)`

**Cards:** `bg: rgba(255,255,255,0.05)`, `border: 1px solid rgba(255,255,255,0.1)`, `border-radius: 16px`

**Starfield:** `background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)`, `background-size: 32px 32px`

**Typography:** Inter (already via next/font), white for headings, muted for secondary

---

## Files to Read Before Each Page

| Page | Read First |
|------|-----------|
| `/school-admin/layout.tsx` | current layout |
| `/school-admin/page.tsx` | current dashboard |
| `/book/page.tsx` | current booking page |
