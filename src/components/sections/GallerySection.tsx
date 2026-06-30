'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { urlFor } from '@/sanity/lib/image'

interface GalleryPhoto {
  _key: string
  asset: { _ref: string }
  caption?: string
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

const SWIPE_THRESHOLD = 40

export default function GallerySection({ images: rawImages }: { images: GalleryPhoto[] }) {
  const images = rawImages.filter((img) => img?.asset?._ref)
  const [index, setIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (images.length < 2) return
      setIndex((i) => (i + dir + images.length) % images.length)
    },
    [images.length]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigate(1)
      if (e.key === 'ArrowLeft') navigate(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  const onTouchStart = (e: { targetTouches: { [n: number]: { clientX: number } } }) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
  }
  const onTouchMove = (e: { targetTouches: { [n: number]: { clientX: number } } }) => {
    touchEndX.current = e.targetTouches[0].clientX
  }
  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > SWIPE_THRESHOLD) navigate(diff > 0 ? 1 : -1)
    touchStartX.current = null
    touchEndX.current = null
  }

  if (images.length === 0) {
    return (
      <SectionWrapper id="gallery" className="overflow-hidden">
        <div className="bg-charcoal py-3 sm:py-5 px-4 sm:px-10">
          <SectionHeader eyebrow="Pre-wedding" title="Album Ảnh Cưới" dark  compact />
        </div>
        <div className="section-padding bg-blush/10">
          <p className="text-center text-charcoal/50 font-serif italic text-lg sm:text-xl py-16">
            Hình ảnh sẽ được cập nhật sớm...
          </p>
        </div>
      </SectionWrapper>
    )
  }

  const slides = images.map((img) => ({
    src: urlFor(img).width(1800).url(),
    alt: img.caption || 'Wedding photo',
  }))

  // Compute display offset, wrapping for circular feel
  const getOffset = (i: number) => {
    let off = i - index
    const half = Math.floor(images.length / 2)
    if (off > half) off -= images.length
    if (off < -half) off += images.length
    return off
  }

  // Card visual style based on offset from center
  const cardStyle = (offset: number) => {
    const abs = Math.abs(offset)
    const sign = Math.sign(offset)

    if (abs > 2) return { display: 'none' as const }

    // X shift capped on desktop so 5 cards stay compact
    // mobile ~375px: ±1→133px, ±2→240px
    // desktop ~1440px: ±1→200px, ±2→360px (capped)
    const xShifts = ['0', 'min(35vw, 200px)', 'min(64vw, 360px)']
    const tx = abs === 0
      ? 'translateX(-50%)'
      : `translateX(calc(-50% + ${sign < 0 ? '-1 * ' : ''}${xShifts[abs]}))`

    const rotateY = abs === 0 ? 0 : sign * -30
    const scale   = [1, 0.74, 0.56][abs]
    const opacity = [1, 0.82, 0.50][abs]
    const zIndex  = [10, 6, 3][abs]

    return {
      position:   'absolute' as const,
      top: 0, bottom: 0,
      left:       '50%',
      width:      'clamp(180px, 54vw, 460px)',
      transform:  `${tx} rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      transition: 'transform 0.52s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.52s ease',
      cursor:     abs > 0 ? 'pointer' : 'default',
      willChange: 'transform, opacity',
    }
  }

  return (
    <SectionWrapper id="gallery" className="overflow-hidden">
      {/* ── Dark title strip ── */}
      <div className="bg-charcoal py-3 sm:py-5 px-4 sm:px-10">
        <SectionHeader eyebrow="Pre-wedding" title="Album Ảnh Cưới" dark  compact />
      </div>

      {/* ── Light content ── */}
      <div className="section-padding bg-blush/10">
      <div className="relative">
        {/* ── Coverflow track ── */}
        <div
          className="relative overflow-hidden"
          style={{
            height: 'clamp(260px, 62vw, 560px)',
            perspective: '1100px',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {images.map((img, i) => {
            const offset = getOffset(i)
            const abs    = Math.abs(offset)
            if (abs > 2) return null

            const style  = cardStyle(offset)
            const src    = urlFor(img).width(900).url()

            return (
              <div
                key={img._key}
                style={style}
                onClick={() => abs > 0 && navigate(Math.sign(offset) as 1 | -1)}
              >
                {/* Shadow beneath card */}
                <div
                  style={{
                    position:  'absolute',
                    bottom:    -12,
                    left:      '8%',
                    right:     '8%',
                    height:    24,
                    background:'rgba(0,0,0,0.45)',
                    filter:    'blur(10px)',
                    borderRadius: '50%',
                  }}
                />

                {/* Photo */}
                <div
                  className="relative w-full h-full overflow-hidden"
                  style={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.55)' }}
                >
                  <Image
                    src={src}
                    alt={img.caption || 'Wedding photo'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 80vw, 50vw"
                    priority={abs === 0}
                  />

                  {/* Dark vignette on side cards */}
                  {abs > 0 && (
                    <div
                      className="absolute inset-0"
                      style={{ background: 'rgba(10,8,6,0.28)' }}
                    />
                  )}

                  {/* Center-card controls */}
                  {abs === 0 && (
                    <>
                      {img.caption && (
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-8">
                          <p className="font-serif italic text-cream/90 text-xs sm:text-sm text-center">
                            {img.caption}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={(e: { stopPropagation: () => void }) => { e.stopPropagation(); setLightboxIndex(index) }}
                        className="absolute top-2 right-2 z-20
                                   bg-black/50 hover:bg-black/80
                                   text-white/70 hover:text-white
                                   rounded-full p-1.5 transition-all backdrop-blur-sm"
                        aria-label="Xem toàn màn hình"
                      >
                        <Maximize2 size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Arrows ── */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => navigate(-1)}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20
                         w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center
                         rounded-full bg-charcoal/10 hover:bg-charcoal/25
                         border border-charcoal/20 text-charcoal/60 hover:text-charcoal
                         transition-all duration-200"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => navigate(1)}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20
                         w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center
                         rounded-full bg-charcoal/10 hover:bg-charcoal/25
                         border border-charcoal/20 text-charcoal/60 hover:text-charcoal
                         transition-all duration-200"
              aria-label="Ảnh tiếp"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* ── Counter ── */}
      <ScrollReveal from="up" delay={0.05} duration={1.2} className="text-center mt-5">
        <p
          className="font-serif text-xs tracking-[0.3em]"
          style={{ color: 'rgba(140,100,15,0.65)' }}
        >
          {index + 1} / {images.length}
        </p>
      </ScrollReveal>

      {/* ── Dot indicators ── */}
      {images.length > 1 && images.length <= 30 && (
        <ScrollReveal from="up" delay={0.12} duration={1.2} className="flex justify-center gap-2 mt-2 flex-wrap">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="h-[3px] rounded-full transition-all duration-300"
              style={{
                width:      i === index ? 24 : 6,
                background: i === index ? 'rgba(140,100,15,0.75)' : 'rgba(28,46,20,0.18)',
              }}
              aria-label={`Ảnh ${i + 1}`}
            />
          ))}
        </ScrollReveal>
      )}

      {/* ── Mobile hint ── */}
      <ScrollReveal from="fade" delay={0.2} duration={1.3} className="text-center mt-3 sm:hidden">
        <p
          className="text-[10px] font-serif italic tracking-wide"
          style={{ color: 'rgba(140,100,15,0.55)' }}
        >
          Vuốt trái / phải để xem ảnh tiếp theo
        </p>
      </ScrollReveal>

      {/* ── Caption ── */}
      <ScrollReveal from="up" delay={0.25} duration={1.5} className="text-center mt-5 sm:mt-6 px-4">
        <p
          className="font-serif italic"
          style={{
            fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
            color: 'rgba(140,100,15,0.6)',
            letterSpacing: '0.02em',
          }}
        >
          Những khoảnh khắc tuyệt vời của chúng mình
        </p>
      </ScrollReveal>

      {/* ── Lightbox ── */}
      <Lightbox
        slides={slides}
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => { setIndex(lightboxIndex); setLightboxIndex(-1) }}
        on={{ view: ({ index: i }: { index: number }) => setLightboxIndex(i) }}
        styles={{ container: { backgroundColor: 'rgba(0,0,0,0.97)' } }}
      />
      </div>{/* end section-padding */}
    </SectionWrapper>
  )
}
