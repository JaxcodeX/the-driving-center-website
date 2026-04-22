# Cron Setup — The Driving Center SaaS

**When to set up:** After first deployment to Vercel (you need the live URL for these to work)

---

## Jobs to Register

### Job 1: SMS Reminder Firing — Every Hour
Crons the `/api/reminders` endpoint. Fires 48h and 4h SMS reminders to students with upcoming bookings.

```bash
openclaw cron add \
  --name "tdc-sms-reminders" \
  --description "Fires 48h and 4h SMS reminders for upcoming bookings. Hits /api/reminders on the live deployment." \
  --cron "0 * * * *" \
  --tz "America/New_York" \
  --session isolated \
  --no-deliver \
  --timeout-seconds 90 \
  --model minimax/MiniMax-M2 \
  --message "Run the reminder cron job for The Driving Center SaaS.

1. Make an HTTP GET request to: https://[YOUR_VERCEL_DEPLOYMENT_URL]/api/reminders
   - If the request returns {skipped: true} or similar, reply SKIP
   - If it returns a count of reminders sent, reply: 'Reminders: [count] sent'
   - If the request fails (non-200), reply: 'Reminder cron failed: [error]'

Keep it simple. One curl, parse the response, short reply."
```

### Job 2: Daily Marketing / Operations Update — Every Monday 9 AM ET
Posts a brief ops update to Discord about the pipeline. Runs every Monday morning.

```bash
openclaw cron add \
  --name "tdc-monday-ops" \
  --description "Every Monday 9 AM ET — check OPERATIONS_LOG.md and post a brief status update to Discord." \
  --cron "0 9 * * 1" \
  --tz "America/New_York" \
  --session isolated \
  --no-deliver \
  --timeout-seconds 120 \
  --model minimax/MiniMax-M2 \
  --message "Read OPERATIONS_LOG.md in ~/projects/the-driving-center-website/ and summarize:
- New commits this week
- Pipeline status (any new school leads?)
- Blockers
- Next week's priorities

Keep it under 200 words. Post to Discord channel 1494134714716520468 (the driver-center-saas-business channel) using the message tool."
```

---

## Verification

After adding both jobs, verify they're registered:

```bash
openclaw cron list
```

Expected output:
```
NAME                SCHEDULE          TZ              LAST RUN   STATUS
tdc-sms-reminders   0 * * * *        America/New_York   —         active
tdc-monday-ops      0 9 * * 1        America/New_York   —         active
```

---

## If You Need to Edit or Remove

```bash
# Remove
openclaw cron rm tdc-sms-reminders
openclaw cron rm tdc-monday-ops

# Disable temporarily
openclaw cron disable tdc-sms-reminders

# Run manually (debug)
openclaw cron run tdc-sms-reminders
openclaw cron runs tdc-sms-reminders   # see history
```

---

## Prerequisites Before This Works

1. Deploy to Vercel (`vercel --prod`)
2. Get your deployment URL: `https://your-app.vercel.app`
3. Update the reminder URL in Job 1 above with the real URL
4. Supabase must be reachable from the cron job's network (Vercel serverless can reach Supabase)
5. Twilio keys must be in Vercel environment variables

## Monitoring

If the reminder job starts failing:
1. Check `openclaw cron runs tdc-sms-reminders` for error details
2. Check Vercel function logs in the Vercel dashboard
3. Common failure: Supabase RLS blocking the cron job's service role query
