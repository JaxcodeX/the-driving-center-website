// Twilio client wrapper — stub mode when keys not configured

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_PHONE_NUMBER

function isConfigured() {
  return Boolean(accountSid && authToken && fromNumber)
}

export async function sendSMS(to: string, body: string): Promise<void> {
  if (!isConfigured()) {
    console.log(`[Twilio STUB] To: ${to} | Message: ${body}`)
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
      body: new URLSearchParams({
        To: to,
        From: fromNumber!,
        Body: body,
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Twilio SMS failed: ${error}`)
  }
}

export async function sendLessonReminderSMS(
  to: string,
  studentName: string,
  schoolName: string,
  date: string,
  time: string
): Promise<void> {
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const message = `Hi ${studentName} — driving lesson reminder for ${formattedDate} at ${time} with ${schoolName}. Reply C to confirm or R to reschedule.`

  await sendSMS(to, message)
}

export async function sendLessonConfirmationSMS(
  to: string,
  date: string,
  time: string,
  location: string
): Promise<void> {
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  const message = `Your lesson is confirmed for ${formattedDate} at ${time}. Location: ${location}. See you there!`

  await sendSMS(to, message)
}
