import './globals.css'

export const metadata = {
  title: 'The Driving Center — SaaS for Driving Schools',
  description: 'Built for Tennessee driving schools. Automate bookings, track student progress, and manage instructors in one place.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  )
}
