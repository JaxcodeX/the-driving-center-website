# SPEC.md — P0-3: Booking Confirmation Email

## What it does
When a student completes a Stripe payment, the webhook fires a confirmation email to the student with their lesson details.

## How it works (current state)
The webhook already calls `/api/notify/booking` on `checkout.session.completed`. The endpoint already fetches session/school data and calls `sendBookingConfirmationEmail`. **The wiring already exists — we're just verifying it works end-to-end.**

## What needs to be verified/fixed

### 1. The `sendBookingConfirmationEmail` call
Current `email.ts` uses a hardcoded HTML template inside the function. The beautiful template in `email-templates/booking-confirmed.ts` exists but is NOT being called. **Fix: make `/api/notify/booking` use the proper template with reschedule/cancel URLs.**

### 2. Reschedule/cancel URLs
The email template has `rescheduleUrl` and `cancelUrl` params — these must come from the booking record. Currently the notify endpoint doesn't generate these.

### 3. Instructor name in email
The email shows "Your instructor will confirm via email" — we can do better. Look up the instructor from the booking's `instructor_id`.

### 4. `sendBookingConfirmationEmail` in `email.ts`
The current implementation in `email.ts` is a stub — it sends simple HTML. The `booking-confirmed.ts` template is the proper version. **Wire the notify endpoint to use `bookingConfirmationEmail()` from `email-templates/booking-confirmed.ts`.**

## API shape

**`POST /api/notify/booking`** (already exists, needs fixing)
```typescript
// Input
{ studentEmail: string, studentName: string, sessionId: string, schoolId: string }

// Output
{ success: true } | { error: string }
```

**Email sent:**
- To: studentEmail
- Subject: `Your lesson is confirmed — [date] at [time]`
- Body: booking details (date, time, location, lesson type) + reschedule/cancel links

## Edge cases
- No Resend API key → log to console, don't fail the webhook
- Session not found → return 404, don't crash
- Student email missing → return 400

## Success criteria
1. Student receives HTML email within seconds of completing payment
2. Email contains: lesson date, time, location, lesson type, instructor name
3. Email contains working reschedule + cancel links
4. If RESEND_API_KEY is missing, webhook still returns success (stub mode)

## Files to change
- `src/app/api/notify/booking/route.ts` — fix the email template usage
- `src/lib/email.ts` — ensure `sendBookingConfirmationEmail` calls the proper template

## Out of scope
- Twilio SMS reminders (P1-5)
- Instructor email (different feature)
- PDF attachment