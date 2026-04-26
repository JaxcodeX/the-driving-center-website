# SPEC — One-Week Sprint to Mark Martin Demo

**Goal:** Working demo for Mark Martin in 7 days. Professional UI, sound architecture, end-to-end flow that doesn't break.

---

## ONE RULE

Every task follows FSO workflow:
```
SPEC.md written first → DeepSeek builds from spec → Build → Test → Log failures
```
No building from memory. No Discord-only plans. No "I'll figure it out as I go."

---

## SPRINT PLAN

### Day 1 — Critical Infrastructure (Everest, autonomous)

**Goal:** Close all security/infrastructure gaps. Zero data leakage risk.

- [ ] Run migration 007 (`safe_increment_seats`) in Supabase SQL Editor
- [ ] Run migration 008 (`processed_stripe_events`) in Supabase SQL Editor
- [ ] Verify RLS: run cross-school query test, confirm 0 rows returned
- [ ] Confirm subscription status middleware deployed and working
- [ ] Fix `/api/reminders` Prisma schema error (cron still broken)
- [ ] Update STATUS.md with clean pass/fail per item

**Deliverable:** STATUS.md showing all ✅ or remaining blockers.

---

### Day 2 — End-to-End Flow (Everest + Zax)

**Goal:** Zax clicks every path. Document what breaks.

- [ ] Zax runs: signup → onboarding → add student → schedule session → view TCA
- [ ] Everest documents every failure in WORKFLOW_LOG.md
- [ ] Everest fixes failures in priority order
- [ ] Repeat until basic flow works without errors

**Deliverable:** Zax can complete full student enrollment flow without a single error message.

---

### Day 3 — UI Polish (One-Shot Build)

**Goal:** All pages match design spec. Blue glow CTAs. Bento grid. Consistent tokens.

- [ ] Spawn coding agent with SPEC_ONE_SHOT_BUILD.md
- [ ] Agent builds/refines all pages in one shot
- [ ] Build → fix errors → commit → push
- [ ] Vercel deploys

**Deliverable:** `the-driving-center-website.vercel.app` with consistent premium dark design.

---

### Day 4 — CSV Import + Profile Page

**Goal:** School owner can add students via CSV. Can update school profile.

- [ ] CSV import (`/school-admin/import`) — drag-drop, parse, preview, bulk insert
- [ ] School profile editor (`/school-admin/profile`) — name, phone, address, logo

**Deliverable:** Both pages functional, tested.

---

### Day 5 — Demo Script + Dry Run

**Goal:** Demo script written. Zax practices 5 times.

- [ ] Write DEMO_SCRIPT.md — exact steps Zax walks through
- [ ] Zax does 5 dry runs
- [ ] Everest watches/listens, notes friction points
- [ ] Fix any friction points found

**Deliverable:** Zax can do the demo from memory without checking notes.

---

### Day 6 — Reserve Day

**Goal:** Fix anything found on Day 5. Buffer for unexpected problems.

- [ ] Fix demo script issues
- [ ] Final build if needed
- [ ] Verify all links work
- [ ] Test on mobile if possible

---

### Day 7 — DEMO TO MARK

**Goal:** Confident delivery. Collect feedback.

- [ ] Zax presents to Mark
- [ ] Collect honest feedback
- [ ] Document what Mark said in memory/MEMORY.md
- [ ] Update STATUS.md with demo outcome

---

## DESIGN TOKENS (Source of Truth)

These are locked. Every page uses these. No deviation.

| Token | Hex | Usage |
|---|---|---|
| bg | `#050505` | Page background |
| surface | `#0D0D0D` | Cards, panels |
| elevated | `#18181b` | Inputs, hover |
| border | `#1A1A1A` | Card borders |
| borderLt | `#27272a` | Hover borders |
| text | `#FFFFFF` | Primary text |
| secondary | `#94A3B8` | Secondary text |
| muted | `#52525b` | Placeholders |
| body | `#5C6370` | Body text |
| blue | `#006FFF` | Primary accent (marketing + dashboard) |
| cyan | `#38BDF8` | Secondary accent |
| purple | `#818CF8` | Gradient accent |
| green | `#10B981` | Success, progress |
| amber | `#f59e0b` | Warnings |

### Buttons
- Primary: `background: #006FFF`, `border-radius: 12px`, `box-shadow: 0 4px 30px rgba(0,111,255,0.25)`
- Secondary: `background: #18181b`, `border: 1px solid #1A1A1A`, `border-radius: 12px`
- Hover: `transform: scale(1.02)`, `150ms ease`

### Typography
- Font: **Inter** via `next/font/google`
- H1: 60-72px, weight 700, tracking -0.02em
- Body: 16-18px, weight 400, line-height 1.6

---

## OUT OF SCOPE (Until After Demo)

- Real Stripe payments (DEMO_MODE bypass is fine for demo)
- SMS reminders (email-only MVP)
- Parent portal
- Instructor self-service availability UI
- Marketing site blog/SEO
- Multi-school support
- Mobile app

---

## SUCCESS CRITERIA

- [ ] No data leakage between schools (RLS verified)
- [ ] Zax can complete full enrollment flow without errors
- [ ] All pages consistent dark design with blue glow CTAs
- [ ] CSV import works
- [ ] Demo script practiced 5x
- [ ] Mark sees a product that looks and works like $99/mo software
