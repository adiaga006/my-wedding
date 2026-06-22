import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wedding Studio',
  robots: { index: false },
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
