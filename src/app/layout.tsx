import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter, Great_Vibes } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Duy & Chi — Đám cưới của chúng tôi',
  description: 'Chúng tôi trân trọng kính mời bạn đến chung vui trong ngày trọng đại của Duy & Chi',
  openGraph: {
    title: 'Duy & Chi — Wedding',
    description: 'Chúng tôi trân trọng kính mời bạn đến chung vui trong ngày trọng đại của chúng tôi',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FAF8F5',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${cormorant.variable} ${inter.variable} ${greatVibes.variable}`}>
      <body>{children}</body>
    </html>
  )
}
