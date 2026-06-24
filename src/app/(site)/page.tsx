import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import {
  SITE_CONFIG_QUERY,
  GALLERY_QUERY,
  GUESTBOOK_QUERY,
  BANK_INFO_QUERY,
} from '@/sanity/queries'
import { urlFor } from '@/sanity/lib/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import DetailsSection from '@/components/sections/DetailsSection'
import GallerySection from '@/components/sections/GallerySection'
import RSVPSection from '@/components/sections/RSVPSection'
import GuestBookSection from '@/components/sections/GuestBookSection'
import GiftSection from '@/components/sections/GiftSection'
import MusicPlayer from '@/components/ui/MusicPlayer'
import InviteIntro from '@/components/ui/InviteIntro'
import { MusicProvider } from '@/contexts/MusicContext'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const config = await client.fetch(SITE_CONFIG_QUERY)
  const preview = config?.sharePreview

  const title = preview?.ogTitle || 'Duy & Chi — Đám cưới của chúng mình'
  const description = preview?.ogDescription || 'Chúng mình trân trọng kính mời bạn đến chung vui trong ngày trọng đại của Duy & Chi ♡'
  const imageUrl = preview?.ogImage
    ? urlFor(preview.ogImage).width(1200).height(630).fit('crop').url()
    : null

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

export default async function HomePage() {
  const [config, gallery, guestbook, bankAccounts] = await Promise.all([
    client.fetch(SITE_CONFIG_QUERY),
    client.fetch(GALLERY_QUERY),
    client.fetch(GUESTBOOK_QUERY),
    client.fetch(BANK_INFO_QUERY),
  ])

  const weddingDate = config?.weddingDate || process.env.NEXT_PUBLIC_WEDDING_DATE || new Date(Date.now() + 86400000 * 30).toISOString()

  return (
    <MusicProvider playlist={config?.musicPlaylist}>
      <Navbar />
      <main>
        <HeroSection
          groomName={config?.groomName || 'Duy'}
          brideName={config?.brideName || 'Chi'}
          groomTitle={config?.groomTitle}
          brideTitle={config?.brideTitle}
          weddingDate={weddingDate}
          heroImage={config?.heroImage}
          heroQuote={config?.heroQuote}
        />
        <DetailsSection
          venue={config?.ceremonyVenue}
          weddingDate={weddingDate}
          groomName={config?.groomName || 'Duy'}
          groomFullName={config?.groomFullName}
          groomTitle={config?.groomTitle}
          brideName={config?.brideName || 'Chi'}
          brideFullName={config?.brideFullName}
          brideTitle={config?.brideTitle}
          groomFamily={config?.groomFamily}
          brideFamily={config?.brideFamily}
        />
        <GallerySection images={gallery || []} />
        <RSVPSection />
        <GuestBookSection initialMessages={guestbook || []} />
        <GiftSection accounts={bankAccounts || []} />
      </main>
      <Footer />
      <MusicPlayer />
      <InviteIntro
        groomName={config?.groomName || 'Duy'}
        brideName={config?.brideName || 'Chi'}
        weddingDate={weddingDate}
      />
    </MusicProvider>
  )
}
