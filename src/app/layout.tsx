import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'The Driving Center — SaaS for Driving Schools',
  description: 'Built for Tennessee driving schools. Automate bookings, track student progress, and manage instructors in one place.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}