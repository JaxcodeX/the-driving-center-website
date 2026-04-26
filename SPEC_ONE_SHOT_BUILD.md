# SPEC — Website Overhaul (One-Shot Build)

**Goal:** Professional B2B SaaS landing page + dashboard that can be demoed to Mark Martin at $99/mo. Built in one session, no iteration.

**Stack:** Next.js 16, TailwindCSS 4, Inter font, Supabase, Stripe (DEMO_MODE bypass)

---

## DESIGN SYSTEM

### Colors
| Token | Hex | Usage |
|---|---|---|
| `bg` | `#050505` | Page background |
| `surface` | `#0D0D0D` | Cards, panels |
| `elevated` | `#18181b` | Hover states, inputs |
| `border` | `#1A1A1A` | Card borders |
| `borderLt` | `#27272a` | Hover borders |
| `text` | `#FFFFFF` | Primary text |
| `secondary` | `#94A3B8` | Secondary text |
| `muted` | `#52525b` | Placeholders, disabled |
| `body` | `#5C6370` | Body text (Jack Roberts spec) |
| `cyan` | `#38BDF8` | Primary accent (dashboard) |
| `blue` | `#006FFF` | Primary accent (marketing) — Jack Roberts |
| `purple` | `#818CF8` | Secondary accent |
| `green` | `#10B981` | Success, progress |
| `amber` | `#f59e0b` | Warnings |

### Typography
- Font: **Inter** via `next/font/google`
- H1: 60-72px, font-weight 700, letter-spacing -0.02em
- H2: 36-48px, font-weight 600, letter-spacing -0.01em
- Body: 16-18px, font-weight 400, line-height 1.6-1.7
- Labels: 12-14px, font-weight 500-600, uppercase, tracking wide

### Buttons
- Primary: `background: #006FFF`, `border-radius: 12px`, `box-shadow: 0 4px 30px rgba(0,111,255,0.25)`
- Secondary: `background: #18181b`, `border: 1px solid #1A1A1A`, `border-radius: 12px`
- Hover: `transform: scale(1.02)`, `150ms ease transition`

### Spacing
- Section padding: 80-120px vertical
- Card padding: 24-32px
- Grid gap: 16-24px
- Border radius: 12px (cards), 8-12px (buttons)

---

## MARKETING PAGES

### 1. Homepage (`/`) — FULL REDESIGN

**Already built. Verify and refine:**
- Hero H1: "Run your driving school without the chaos." ✅
- Blue glow CTA: `#006FFF`, `box-shadow: 0 4px 30px rgba(0,111,255,0.25)`, `border-radius: 12px` ✅
- Stats bar: "240+ Students | 1,400+ Sessions booked | 98% Retention rate" ✅
- Bento grid features section ✅

**If any of these are missing or broken, fix them.**

#### Hero (must be pixel-perfect)
```
Background: #050505 full page
Eyebrow: "Driving School Software" — small pill badge, #006FFF border, #006FFF text
H1: "Run your driving school without the chaos." — 60-72px, bold, #FFFFFF
Subheadline: "The all-in-one platform for booking, student tracking, TCA compliance, and payments." — 18px, #5C6370, max-width 520px
CTA: "Start free — no credit card" (primary) + "Watch demo" (ghost)
  Primary: background #006FFF, color white, border-radius 12px, box-shadow blue glow
  Ghost: background transparent, border 1px #27272a, color #94A3B8, border-radius 12px
Stats bar (below CTAs): 3 stats — "240+ Students | 1,400+ Sessions | 98% Retention" — large bold numbers, small muted labels
Hero visual (right side): Browser mockup with real dashboard screenshot, slight perspective tilt
```

#### Features Bento Grid
```
Layout: asymmetric grid
Card style: background #0D0D0D, border 1px solid #1A1A1A, border-radius 12px, padding 24px
Hover: border-color #27272a, translateY(-2px), shadow

Tile 1 (wide): "Online Booking" — icon + headline + 1-line description
Tile 2: "Automated Reminders" — icon + headline + 1-line
Tile 3: "TCA Compliance" — with "Trusted by 40+ TN schools" badge
Tile 4: "Student Management" — icon + headline + 1-line
Tile 5: "Stripe Payments" — with "Stripe Certified" badge
Tile 6 (wide): "Progress Dashboard" — spans 2 columns if possible, icon + description
```

#### Pricing Section
```
3-column layout
Middle plan: "Professional" — elevated, subtle blue border, "Most Popular" badge
Plan: $99/mo — feature bullets (4-6 max), CTA button
Trust signals below: "No credit card required • Cancel anytime • SOC2 compliant"
```

#### Social Proof / Testimonials
```
Logo bar directly below hero: "Used by driving schools across Tennessee"
Testimonial: 1-2 quotes with specific metrics — "I went from 40 to 65 students per week"
Real faces preferred (stock ok if needed), name + school + city
```

#### FAQ
```
details/summary accordion, 5-7 questions
Rotate chevron 90deg on open
```

#### Footer
```
Logo | Links | Copyright
Minimal — 3 columns max
```

---

### 2. Login (`/login`) — Already done. Verify:
- Dark card centered on #050505 bg
- Email input → magic link → "Check your email" confirmation state
- "Don't have an account? Sign up" link
- Blue glow sign in button

### 3. Signup (`/signup`) — Already done. Verify:
- School name, email, password fields
- Creates school → redirects to `/onboarding?school=<slug>`
- Blue glow CTA

### 4. Onboarding (`/onboarding`) — Already done. Verify:
- 4-step wizard: School info → Instructor → Session type → Done
- Progress indicator with icons
- Skip option on each step
- Redirects to `/school-admin` on completion

---

## DASHBOARD PAGES

All dashboard pages share: sticky sidebar nav + topbar. Dark theme throughout.

### Shared Layout (`/school-admin/layout.tsx`)
```
Sidebar (64px collapsed, 240px expanded):
  - Logo at top
  - Nav links: Dashboard, Students, Sessions, Calendar, Instructors, Billing
  - Active state: #006FFF text + left border accent
  - Collapse toggle at bottom

Topbar:
  - School name (left)
  - Bell icon (notifications) — right
  - Avatar + logout — right

Mobile: hamburger → full-screen overlay nav
```

### 5. Dashboard Home (`/school-admin`) — Already done. Verify:
- Stat cards: Active Students, Sessions, Instructors, Pending TCA
- Recent sessions list
- "Add Student" CTA

### 6. Students (`/school-admin/students`) — Already done. Verify:
- Search bar (name/email)
- Table: Name, Contact, Status, Actions
- TCA hours badge per student
- Add Student modal (name, email, phone)

### 7. Instructors (`/school-admin/instructors`) — Already done. Verify:
- Card grid layout
- Invite modal (name, email)
- "Set schedule" link per instructor
- Status badge (active/pending)

### 8. Sessions (`/school-admin/sessions`) — Already done. Verify:
- List view with date blocks
- Status toggle (confirm/cancel)
- Add Session modal (student, instructor, type, date/time)

### 9. Calendar (`/school-admin/calendar`) — Already done. Verify:
- Monthly grid view
- Sessions shown as colored pills per day
- Month navigation (prev/next arrows)

### 10. Billing (`/school-admin/billing`) — Already done. Verify:
- Subscription status banner (green = active)
- Plan card: Starter, $99/mo
- Feature list
- "Manage subscription" → opens Stripe billing portal

---

## PAGES NOT YET BUILT (lower priority — do after above)

### 11. School Profile (`/school-admin/profile`)
- Edit school name, phone, address, logo
- Save → updates Supabase `schools` table

### 12. CSV Import (`/school-admin/import`)
- File upload dropzone (drag & drop CSV)
- Parse CSV → show preview table
- "Import X students" button → bulk insert
- Error report if any rows fail

### 13. Instructor Availability (`/school-admin/availability`)
- Weekly time grid (Mon-Sat, 8am-6pm)
- Click to toggle available/unavailable
- Save → `instructor_availability` table

---

## TECHNICAL NOTES

### Auth
- Supabase Magic Links only (no password auth for school owners)
- Session cookies via `@supabase/ssr`
- Middleware checks `subscription_status` on all `/school-admin/*` routes
- DEMO_MODE=true bypasses Stripe

### Database
- Multi-tenant: all queries filter by `school_id`
- RLS policies enforce tenant isolation
- Key tables: schools, students, instructors, sessions, session_types, bookings

### Build
- Run `npm run build` after changes
- Commit + push → Vercel auto-deploys
- Live URL: `the-driving-center-website.vercel.app`

---

## EXECUTION ORDER

1. Verify/fix homepage (hero, bento grid, pricing, FAQ, footer)
2. Verify/fix login, signup, onboarding
3. Verify/fix all /school-admin pages (layout, dashboard, students, instructors, sessions, calendar, billing)
4. Build missing pages (profile, import, availability) — if time allows
5. Run `npm run build` → fix any errors
6. Commit everything
7. Push to main → Vercel deploys
8. Report "done"

---

## SUCCESS CRITERIA

- All pages load without errors
- Login → signup → onboarding → dashboard flow works end-to-end
- Design is consistent across all pages (same tokens, same spacing, same button styles)
- Website looks like a premium B2B SaaS product (good enough for Mark Martin demo at $99/mo)
