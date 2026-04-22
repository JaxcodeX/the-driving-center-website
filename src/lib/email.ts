// Resend email client — stub mode when key not configured

const apiKey = process.env.RESEND_API_KEY

export function isEmailConfigured() {
  return Boolean(apiKey)
}

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  if (!apiKey) {
    console.log(`[Resend STUB] To: ${to} | Subject: ${subject}`)
    return
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: 'The Driving Center <onboarding@resend.dev>', to, subject, html }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend failed: ${error}`)
  }
}

export async function sendWelcomeEmail(
  to: string,
  schoolName: string,
  schoolId: string
): Promise<void> {
  await sendEmail({
    to,
    subject: 'Welcome to The Driving Center — Your school is ready!',
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #0a0a0f;">Welcome, ${schoolName}!</h1>
        <p style="color: #374151; line-height: 1.6;">
          Your school is set up on The Driving Center. Here's what you can do right now:
        </p>
        <ul style="color: #374151; line-height: 1.8;">
          <li><strong>Add instructors</strong> — set up your teaching team</li>
          <li><strong>Create sessions</strong> — use the calendar to block off lesson times</li>
          <li><strong>Share your booking link</strong> — let students book and pay online</li>
          <li><strong>Track students</strong> — manage permits, hours, and certification</li>
        </ul>
        <p style="color: #374151;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/school-admin?school=${schoolId}" style="background: #06b6d4; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 16px;">
            Open Your Dashboard →
          </a>
        </p>
        <p style="color: #9ca3af; font-size: 14px; margin-top: 32px;">
          Questions? Reply to this email — we're here to help.
        </p>
      </div>
    `,
  })
}

export async function sendBookingConfirmationEmail(
  to: string,
  studentName: string,
  schoolName: string,
  sessionDate: string,
  sessionTime: string,
  location: string
): Promise<void> {
  const formattedDate = new Date(`${sessionDate}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  await sendEmail({
    to,
    subject: `Your lesson is booked — ${formattedDate} at ${sessionTime}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #0a0a0f;">Lesson Confirmed ✅</h1>
        <p style="color: #374151; line-height: 1.6;">
          Hi ${studentName}, your driving lesson is booked!
        </p>
        <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <div style="font-size: 18px; font-weight: 600; color: #0a0a0f;">${formattedDate}</div>
          <div style="color: #6b7280; margin-top: 4px;">${sessionTime}</div>
          <div style="color: #6b7280; margin-top: 4px;">📍 ${location}</div>
          <div style="color: #6b7280; margin-top: 4px;">with ${schoolName}</div>
        </div>
        <p style="color: #9ca3af; font-size: 14px;">
          You'll receive an SMS reminder 72 hours before your lesson.
          Reply C to confirm or R to reschedule.
        </p>
      </div>
    `,
  })
}