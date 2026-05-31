import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'EchoBridge — Laptop Audio to Phone, Instantly',
    template: '%s | EchoBridge',
  },
  description:
    'Stream your laptop audio to your phone in real time. Use wired earphones from anywhere in the room. Browser-native, no install required.',
  keywords: ['audio relay', 'WebRTC', 'laptop to phone audio', 'wireless earphones', 'browser audio'],
  openGraph: {
    title: 'EchoBridge — Laptop Audio to Phone, Instantly',
    description:
      'Stream your laptop audio to your phone in real time. Browser-native WebRTC. No accounts.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
