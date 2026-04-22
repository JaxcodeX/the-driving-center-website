// Twilio SMS client — stub mode when keys not configured
// Uses 48h + 4h two-touch strategy (proven: 40-70% no-show reduction)

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_PHONE_NUMBER

function isConfigured() {
  return Boolean(accountSid && authToken && fromNumber)
}

async function sendSMS(to: string, body: string): Promise<void> {
  if (!to || !isConfigured()) {
    console.log(`[Twilio STUB] To: ${to} | Body: ${body}`)
    return
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: fromNumber!, Body: body }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Twilio SMS failed: ${error}`)
  }
}

// 48h reminder — gives student time to reschedule if needed
export async function sendLessonReminderSMS(
  to: string,
  studentName: string,
  lessonType: string,
  date: string,
  time: string,
  location: string
): Promise<void> {
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const message = [
    `Hi ${studentName.split(' ')[0]}! 👋`,
    `Reminder: Your ${lessonType} is in 2 days.`,
    `📅 ${formattedDate} at ${time}`,
    location ? `📍 ${location}` : null,
    ``,
    `Reply C to confirm or R to reschedule.`,
    `Need to cancel? Reply with your reason.`,
  ]
    .filter(Boolean)
    .join('\n')

  await sendSMS(to, message)
}

// 4h reminder — final heads-up
export async function sendFinalReminderSMS(
  to: string,
  studentName: string,
  lessonType: string,
  date: string,
  time: string,
  location: string
): Promise<void> {
  const message = [
    `⏰ ${studentName.split(' ')[0]} — see you soon!`,
    `Today: ${lessonType}`,
    `🕐 ${time}`,
    location ? `📍 ${location}` : null,
    ``,
    `Drive safe! See your instructor then. 🚗`,
  ]
    .filter(Boolean)
    .join('\n')

  await sendSMS(to, message)
}

// Cancellation confirmation
export async function sendCancellationSMS(
  to: string,
  studentName: string,
  lessonType: string,
  date: string,
  time: string
): Promise<void> {
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  const message = [
    `Hi ${studentName.split(' ')[0]} — your ${lessonType} on ${formattedDate} at ${time} has been cancelled.`,
    `If you'd like to reschedule, visit your booking link.`,
  ].join('\n')

  await sendSMS(to, message)
}

// Booking confirmation (sent after Stripe deposit paid)
export async function sendBookingConfirmationSMS(
  to: string,
  studentName: string,
  lessonType: string,
  date: string,
  time: string,
  location: string
): Promise<void> {
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  const message = [
    `✅ Booking confirmed, ${studentName.split(' ')[0]}!`,
    `${lessonType} — ${formattedDate} at ${time}`,
    location ? `📍 ${location}` : null,
    ``,
    `You'll get a reminder 48 hours before. See you there! 🚗`,
  ]
    .filter(Boolean)
    .join('\n')

  await sendSMS(to, message)
}
