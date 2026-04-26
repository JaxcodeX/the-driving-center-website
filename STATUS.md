# STATUS.md — The Driving Center SaaS
**Updated: 2026-04-26**

---

## Demo Site

**Live:** `the-driving-center-website.vercel.app`
**GitHub:** `github.com/JaxcodeX/the-driving-center-website`
**Branch:** `main` (auto-deploys to Vercel on push)

---

## What Works

### Auth & Multi-Tenancy
- ✅ Supabase Magic Links (no password auth)
- ✅ RLS policies — school_id injected on every query
- ✅ Session cookies via `@supabase/ssr`
- ✅ DEMO_MODE bypasses Stripe (demo keeps working without real payments)

### Core Flow (verified end-to-end)
- ✅ School signup → creates real record in Supabase
- ✅ Redirect to `/onboarding?school=<slug>`
- ✅ Onboarding 4-step wizard: school info → instructor → session type → done
- ✅ School admin dashboard
- ✅ Student CRUD (add, edit, search)
- ✅ Session CRUD (schedule, confirm/cancel)
- ✅ TCA compliance tracking (≥30h classroom + ≥6h driving → certificate)
- ✅ Email confirmations via Resend (live, real emails send)

### UI Pages
- ✅ `/` — Marketing homepage (dark, blue glow CTA, bento grid)
- ✅ `/login` — Magic link auth
- ✅ `/signup` — School registration
- ✅ `/onboarding` — 4-step setup wizard
- ✅ `/school-admin` — Dashboard home
- ✅ `/school-admin/students` — Table + add modal
- ✅ `/school-admin/instructors` — Card grid + invite modal
- ✅ `/school-admin/sessions` — List with date blocks + status toggle
- ✅ `/school-admin/calendar` — Monthly grid view
- ✅ `/school-admin/billing` — Status banner + Stripe portal link

### Infrastructure
- ✅ Subscription status middleware (redirects canceled/past_due to billing)
- ✅ Webhook idempotency (`processed_stripe_events` table)
- ✅ `safe_increment_seats()` (migration 007)

---

## What Needs Fixing

| Item | Impact | Fix |
|---|---|---|
| `/api/reminders` Prisma error | Cron sends 0 reminders | Fix raw SQL JOIN in reminders route |
| Zax hasn't tested full flow | Unknown broken paths | Day 2: full end-to-end test |
| Migrations 007+008 | Not confirmed run by Zax | Verify in Supabase SQL Editor |

---

## What Needs Building

| Item | Priority | Day |
|---|---|---|
| CSV import (`/school-admin/import`) | High | 4 |
| School profile editor (`/school-admin/profile`) | Medium | 4 |
| Instructor availability UI | Low | After demo |
| SMS reminders | Low | After demo (email MVP fine) |

---

## Sprint: Mark Martin Demo (7 Days)

See `SPEC_ONE_WEEK_SPRINT.md` for full day-by-day plan.

```
Day 1: Critical infrastructure (Everest)
Day 2: End-to-end test + fix (Zax + Everest)
Day 3: UI polish — one-shot coding agent build
Day 4: CSV import + profile editor
Day 5: Demo script + 5 dry runs
Day 6: Buffer
Day 7: DEMO TO MARK
```

---

## Stack (Locked)

| Component | Value |
|---|---|
| Supabase project | `evswdlsqlaztvajibgta` |
| Resend API key | `re_ZwCTERGk_8eesZtYHGkR32GPv6YAgEs2P` (live) |
| DeepSeek API key | `sk-7c4c86239406412ba3385f32db8b959d` ($5 credit) |
| Stripe account | `jaxcodewe@protonmail.com` (test mode) |
| Vercel project ID | `prj_V4Pu15pN58SyW7t86wwPkJUORizI` |
