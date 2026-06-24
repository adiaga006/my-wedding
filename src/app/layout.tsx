import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter, Great_Vibes, Playfair_Display } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
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

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Duy & Chi — Đám cưới của chúng mình',
  description: 'Chúng mình trân trọng kính mời bạn đến chung vui trong ngày trọng đại của Duy & Chi',
  openGraph: {
    title: 'Duy & Chi — Wedding',
    description: 'Chúng mình trân trọng kính mời bạn đến chung vui trong ngày trọng đại của chúng mình',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F7FCF4',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${cormorant.variable} ${inter.variable} ${greatVibes.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  )
}
