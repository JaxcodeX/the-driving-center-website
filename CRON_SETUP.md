# Cron Setup — The Driving Center SaaS

**Deployment URL:** `https://the-driving-center-website.vercel.app`

---

## Jobs to Register

### Job 1: SMS + Email Reminders — Every Hour
Hits `/api/reminders` on the live deployment. Fires 48h and 4h SMS + email reminders to students with upcoming bookings.

```bash
openclaw cron add \
  --name "tdc-reminders" \
  --description "Fires 48h and 4h SMS + email reminders for upcoming bookings. Calls GET /api/reminders on the live site." \
  --cron "0 * * * *" \
  --tz "America/New_York" \
  --session isolated \
  --no-deliver \
  --timeout-seconds 90 \
  --model minimax/MiniMax-M2 \
  --message "Run the reminder cron for The Driving Center SaaS.

Make an HTTP GET request to: https://the-driving-center-website.vercel.app/api/reminders

If the response contains sent_48h or sent_4h counts, reply: 'Reminders: [N] checked, [48h_sms] SMS + [48h_email] emails (48h), [4h_sms] SMS + [4h_email] emails (4h)'

If the request returns an error, reply: 'Reminder cron failed: [error]'

Keep it simple. One curl, parse the JSON response, short reply."
```

### Job 2: Monday Ops Update — Every Monday 9 AM ET
Posts a brief status update to Discord about the pipeline.

```bash
openclaw cron add \
  --name "tdc-monday-ops" \
  --description "Every Monday 9 AM ET — read WORKFLOW_LOG.md and post a brief status update to Discord." \
  --cron "0 9 * * 1" \
  --tz "America/New_York" \
  --session isolated \
  --no-deliver \
  --timeout-seconds 120 \
  --model minimax/MiniMax-M2 \
  --message "Read ~/projects/the-driving-center-website/WORKFLOW_LOG.md and summarize:
- What was built in the past week
- Current blockers
- Next priorities

Keep it under 200 words. Post to Discord channel 1494134714716520468 (#driver-center-saas-business)."
```

---

## Verification

```bash
openclaw cron list
```

Expected:
```
NAME           SCHEDULE      TZ                 LAST RUN   STATUS
tdc-reminders  0 * * * *    America/New_York   —          active
tdc-monday-ops 0 9 * * 1    America/New_York   —          active
```

---

## If You Need to Edit or Remove

```bash
openclaw cron rm tdc-reminders
openclaw cron rm tdc-monday-ops

openclaw cron disable tdc-reminders

# Run manually (debug)
openclaw cron run tdc-reminders
openclaw cron runs tdc-reminders
```

---

## What Each Job Does

### tdc-reminders
- **Endpoint:** `GET https://the-driving-center-website.vercel.app/api/reminders`
- **Frequency:** Every hour, on the hour
- **What fires:**
  - 48h before session → SMS + email to student
  - 4h before session → SMS + email to student
- **Emails** require `RESEND_API_KEY` in Vercel (stub mode logs when not set)
- **SMS** requires `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` in Vercel (stub mode logs when not set)
- **RLS note:** Cron uses service role client — not blocked by Supabase RLS

### tdc-monday-ops
- **Reads:** `WORKFLOW_LOG.md`
- **Posts to:** #driver-center-saas-business Discord channel
- **Content:** Pipeline status, what was built, blockers, next steps

---

## Keys Needed for Full Operation

| Key | Where to get it | Used for |
|---|---|---|
| `RESEND_API_KEY` | resend.com | 48h + 4h email reminders |
| `TWILIO_ACCOUNT_SID` | twilio.com | SMS reminders |
| `TWILIO_AUTH_TOKEN` | twilio.com | SMS reminders |
| `TWILIO_PHONE_NUMBER` | twilio.com | From number for SMS |

Add all four to **Vercel → Project Settings → Environment Variables** (Production).

Until keys are added, the reminder route runs in stub mode — logs what it would send, doesn't crash.

---

## Monitoring

```bash
# Check last run result
openclaw cron runs tdc-reminders

# Check Vercel function logs (if logged into Vercel CLI)
vercel logs the-driving-center-website --since 1h
```

Common failures:
- **Supabase RLS blocking query** → cron uses service role client, should be fine
- **Missing env vars** → stub mode logs `[Twilio STUB]` / `[Resend STUB]` — not a crash
- **Network timeout** → Vercel functions timeout at 10s, reminder query should be fast