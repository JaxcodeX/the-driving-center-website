# SPEC.md — P1-C: Email Reminders Wired to OpenClaw Cron

## What it does
Wire up 48h and 4h email reminders to the existing reminder cron job. Add school ownership checks to the reminder API. Update CRON_SETUP.md with actual deployment URL.

## What exists

**`/api/reminders`** (GET + POST):
- Queries confirmed bookings in next 72h
- Fires SMS via `sendLessonReminderSMS` (48h) and `sendFinalReminderSMS` (4h)
- Marks `reminder_48h_sent` / `reminder_4h_sent` in DB
- Works in stub mode (logs when Twilio not configured)

**`/lib/email-templates/reminder-48h.ts`**:
- Beautiful HTML template for 48h email
- Has confirmUrl + rescheduleUrl params

**`/lib/email-templates/reminder-4h.ts`**:
- Beautiful HTML template for 4h email

**`/lib/email.ts`**:
- `sendEmail()` — Resend client, stub mode when no API key
- `isEmailConfigured()` — checks for RESEND_API_KEY
- `sendBookingConfirmationEmail()` — uses template

## What's missing

### 1. `/api/reminders` doesn't send emails — only SMS
The reminder route calls `sendLessonReminderSMS` but never sends 48h/4h emails via Resend. Need to add email calls alongside SMS.

### 2. No school ownership check on reminder API
The GET endpoint (used by cron) queries ALL bookings across ALL schools. Should scope to a school when `school_id` param is passed.

### 3. No 48h email template wired to reminder route
`reminder48hEmail()` exists but isn't called from `/api/reminders`. Need to wire it.

### 4. Cron registration uses placeholder URL
`CRON_SETUP.md` has `[YOUR_VERCEL_DEPLOYMENT_URL]` — needs the real URL.

## What to build

### API change: `/api/reminders`
Add email sending alongside SMS:
```
48h reminder:
  - sendLessonReminderSMS (existing)
  - reminder48hEmail via Resend

4h reminder:
  - sendFinalReminderSMS (existing)
  - reminder4hEmail via Resend
```

Email needs: `student_email`, `schoolName`, `schoolPhone` from the booking/session relationship.

### Fix school ownership on GET
When `?school_id=X` is passed, scope the query to that school. When called by cron with no school_id, query all schools (cron runs as service role).

### Update CRON_SETUP.md
Replace placeholder with real Vercel deployment URL. Add email reminder cron job.

## API: What needs to change

### `GET /api/reminders?school_id=X`
- If `school_id` provided: scope to that school only (for admin testing)
- If no `school_id`: query all schools (for cron)

### Cron job message
The cron job fires `GET /api/reminders` (no school_id = all schools). Cron uses service role so it's not blocked by RLS.

### Email data requirements
To send emails, we need:
- `student_email` from booking record ✅ (already in bookings table)
- `schoolName` — from `schools.name` via session→school join
- `schoolPhone` — from `schools.phone` via session→school join
- `confirmUrl` — `https://the-driving-center-website.vercel.app/book/confirmation?token=BOOKING_TOKEN`
- `rescheduleUrl` — `https://the-driving-center-website.vercel.app/book?session=SESSION_ID`

### Update reminder route to include email
Import `reminder48hEmail` and `reminder4hEmail` templates. Call `sendEmail()` with the rendered template.

## Out of scope
- Reply handling (C to confirm, R to reschedule) — not implemented yet
- Twilio/Resend API key setup — keys need to be added to Vercel by Zax
- Parent notification emails — future feature

## Success criteria
1. `/api/reminders` sends both SMS + email when Resend API key is set
2. 48h email has reschedule link, 4h email has school phone
3. Cron registration updated with real deployment URL
4. Stub mode: logs email content when no Resend key, doesn't crash

## Files to change
- `src/app/api/reminders/route.ts` — add email sending, school_id scoping
- `CRON_SETUP.md` — update with real Vercel URL, add second cron job