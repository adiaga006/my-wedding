import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import {
  SITE_CONFIG_QUERY,
  STORIES_QUERY,
  GALLERY_QUERY,
  WEDDING_PARTY_QUERY,
  GUESTBOOK_QUERY,
  FAQ_QUERY,
  BANK_INFO_QUERY,
} from '@/sanity/queries'
import { urlFor } from '@/sanity/lib/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import StorySection from '@/components/sections/StorySection'
import DetailsSection from '@/components/sections/DetailsSection'
import GallerySection from '@/components/sections/GallerySection'
import WeddingPartySection from '@/components/sections/WeddingPartySection'
import RSVPSection from '@/components/sections/RSVPSection'
import GuestBookSection from '@/components/sections/GuestBookSection'
import GiftSection from '@/components/sections/GiftSection'
import FAQSection from '@/components/sections/FAQSection'
import MusicPlayer from '@/components/ui/MusicPlayer'
import InviteIntro from '@/components/ui/InviteIntro'
import { MusicProvider } from '@/contexts/MusicContext'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const config = await client.fetch(SITE_CONFIG_QUERY)
  const preview = config?.sharePreview

  const title       = preview?.ogTitle       || 'Duy & Chi — Đám cưới của chúng tôi'
  const description = preview?.ogDescription || 'Chúng tôi trân trọng kính mời bạn đến chung vui trong ngày trọng đại của Duy & Chi ♡'
  const imageUrl    = preview?.ogImage
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
  const [config, stories, gallery, party, guestbook, faqs, bankAccounts] = await Promise.all([
    client.fetch(SITE_CONFIG_QUERY),
    client.fetch(STORIES_QUERY),
    client.fetch(GALLERY_QUERY),
    client.fetch(WEDDING_PARTY_QUERY),
    client.fetch(GUESTBOOK_QUERY),
    client.fetch(FAQ_QUERY),
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
          weddingDate={weddingDate}
          heroImage={config?.heroImage}
          heroQuote={config?.heroQuote}
        />
        <StorySection items={stories || []} />
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
        <WeddingPartySection members={party || []} />
        <RSVPSection />
        <GuestBookSection initialMessages={guestbook || []} />
        <GiftSection accounts={bankAccounts || []} />
        <FAQSection items={faqs || []} />
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
