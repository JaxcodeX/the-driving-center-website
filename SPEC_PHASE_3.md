# B.L.A.S.T. Phase 3 — Booking Calendar + Notifications

## Goal
Ship the visual booking calendar and automated notifications (email + SMS) that make the SaaS feel real to school operators.

---

## 1. Booking Calendar

### What
Visual weekly calendar where school operators create sessions by clicking/selecting time slots. Drag-to-create session blocks.

### Pages
- `src/app/school-admin/calendar/page.tsx` — Full visual calendar (React component, no external library)

### API additions
- `PUT /api/sessions/[id]` — update session after calendar edit

### Behavior
- Week view (Mon–Sun), scroll to next week
- Click empty slot → "Create session" popover (date, time, instructor, max_seats, price)
- Click existing session → edit/delete popover
- Sessions color-coded by instructor
- Shows seats filled vs max (e.g., "6/10")

### Design
- Dark theme (matches rest of app)
- Time slots from 7am–8pm, 1hr blocks
- Session cards show time + instructor name + seats
- Cancel flow asks for confirmation before soft-delete

---

## 2. Email Notifications (OpenClaw Agent)

### What
OpenClaw marketing/cron agent sends transactional emails via Resend API.

### Emails to send
- **Welcome email** — when school completes profile, sent immediately
- **Booking confirmation** — to student when lesson is booked
- **Reminder 72h before** — lesson reminder to student/parent
- **Reminder 24h before** — final reminder
- **Cancellation notice** — if school cancels session

### Resend setup
- Add `RESEND_API_KEY` to `.env.local`
- Domain verification (resend.com → DNS records)
- Create reusable " transactional" template or send raw HTML

### Implementation
- `src/lib/email.ts` — Resend client wrapper
- `src/app/api/notify/welcome/route.ts` — POST, called by OpenClaw agent
- `src/app/api/notify/booking/route.ts` — POST, called when student books
- OpenClaw cron job triggers reminder emails via `/api/notify/reminder`

---

## 3. SMS Reminders (OpenClaw + Twilio)

### What
OpenClaw agent polls `/api/reminders` every hour. Twilio delivers SMS.

### Behavior
- 72h before session: "Hi [Name] — lesson at [Time] with [School]. Reply C to confirm."
- 24h before: final reminder
- Configurable via `TWILIO_REMINDER_HOURS` env var (default: 72, 24)

### Cron setup (OpenClaw skill)
```
Every 60 min: GET /api/reminders
```

---

## 4. Cron Job Setup

### OpenClaw cron skill
Use `cron-setup` skill to register periodic checks.

```
Every hour: GET /api/reminders → send SMS if due
Every day 8am: GET /api/school-health → check for expired licenses, missing payments
```

### Frequency
- SMS reminders: every hour (check due sessions)
- School health: once/day
- NOT too frequent — avoid spam/overload

---

## 5. Phase 3 File Inventory

### New files to create
- `src/app/school-admin/calendar/page.tsx` — calendar UI
- `src/lib/email.ts` — Resend client
- `src/app/api/notify/welcome/route.ts` — welcome email trigger
- `src/app/api/notify/booking/route.ts` — booking confirmation email
- `src/lib/cron/school-health.ts` — daily health check (expired licenses, etc.)
- `src/app/api/health/route.ts` — school health check endpoint

### Modify existing
- `src/app/api/reminders/route.ts` — integrate with Twilio sendSMS
- `src/app/school-admin/page.tsx` — add "Calendar" link
- `src/lib/twilio.ts` — add confirmation SMS function

---

## Priority Order
1. **Calendar** — operators need to create sessions visually
2. **Email welcome + booking** — first touchpoints after signup
3. **SMS reminders** — core value (reduce no-shows)
4. **Daily health check** — proactive alerts for expired licenses

---

## Env vars needed
```
RESEND_API_KEY=re_xxxxx
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1xxxxx
```