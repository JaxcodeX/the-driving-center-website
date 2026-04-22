import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = 'https://thedrivingcentersaas.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'The Driving Center SaaS — Booking, Reminders & Compliance for Driving Schools',
    template: '%s | The Driving Center SaaS',
  },
  description:
    'The all-in-one platform for driving schools. Online booking, automated 48h/4h SMS reminders, student tracking, TCA compliance, and payment collection. $99/month.',
  keywords: [
    'driving school software',
    'driving school scheduling',
    'driving school management',
    'TCA compliance Tennessee',
    'driving school booking system',
    'automated SMS reminders',
    'driving school SaaS',
  ],
  authors: [{ name: 'The Driving Center' }],
  creator: 'The Driving Center',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'The Driving Center SaaS',
    title: 'The Driving Center SaaS',
    description:
      'Online booking, automated reminders, student tracking, and TCA compliance — $99/month for driving schools.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'The Driving Center SaaS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Driving Center SaaS',
    description:
      'Online booking, automated reminders, student tracking, and TCA compliance for driving schools.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
