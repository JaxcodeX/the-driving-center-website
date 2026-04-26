import { Figtree } from 'next/font/google'
import './globals.css'

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-figtree',
  display: 'swap',
})

export const metadata = {
  title: 'The Driving Center — SaaS for Driving Schools',
  description: 'Built for Tennessee driving schools. Automate bookings, track student progress, and manage instructors in one place.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={figtree.className}>
      <body>{children}</body>
    </html>
  )
}
