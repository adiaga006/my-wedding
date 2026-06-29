'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'
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
      <SectionWrapper id="gallery" className="section-padding bg-charcoal">
        <SectionHeader eyebrow="Pre-wedding" title="Album Ảnh Cưới" dark />
        <p className="text-center text-cream/40 font-serif italic text-lg sm:text-xl py-16">
          Hình ảnh sẽ được cập nhật sớm...
        </p>
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

    if (abs > 3) return { display: 'none' as const }

    // X shift: min(vw, px) so it's proportional on mobile but capped on wide desktop
    // mobile ~375px: ±1→135px, ±2→235px, ±3→320px
    // desktop ~1440px: ±1→210px, ±2→370px, ±3→520px (capped)
    const xShifts = ['0', 'min(36vw, 210px)', 'min(64vw, 370px)', 'min(88vw, 520px)']
    const tx = abs === 0
      ? 'translateX(-50%)'
      : `translateX(calc(-50% + ${sign < 0 ? '-1 * ' : ''}${xShifts[abs]}))`

    const rotateY = abs === 0 ? 0 : sign * -30
    const scale   = [1, 0.78, 0.62, 0.50][abs]
    const opacity = [1, 0.85, 0.55, 0.28][abs]
    const zIndex  = [10, 7, 4, 1][abs]

    return {
      position:   'absolute' as const,
      top: 0, bottom: 0,
      left:       '50%',
      width:      'clamp(160px, 46vw, 400px)',
      transform:  `${tx} rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      transition: 'transform 0.52s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.52s ease',
      cursor:     abs > 0 ? 'pointer' : 'default',
      willChange: 'transform, opacity',
    }
  }

  return (
    <SectionWrapper id="gallery" className="section-padding bg-charcoal">
      {/* Custom header — gold metallic on dark bg */}
      <div className="text-center mb-10 sm:mb-14">
        <p
          className="font-sans text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: 'rgba(200,168,74,0.65)' }}
        >
          Pre-wedding
        </p>
        <h2
          className="font-serif leading-tight"
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            background:
              'linear-gradient(135deg, #d4a84b 0%, #f0c96a 40%, #c8971e 70%, #e8b84a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Album Ảnh Cưới
        </h2>
        <div className="flex items-center justify-center gap-4 mt-5">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
          <span style={{ color: 'rgba(200,168,74,0.6)', fontSize: '1.1rem' }}>❧</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
        </div>
      </div>

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
            if (abs > 3) return null

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
                         rounded-full bg-black/30 hover:bg-black/60
                         border border-white/12 text-white/70 hover:text-white
                         transition-all duration-200 backdrop-blur-sm"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => navigate(1)}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20
                         w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center
                         rounded-full bg-black/30 hover:bg-black/60
                         border border-white/12 text-white/70 hover:text-white
                         transition-all duration-200 backdrop-blur-sm"
              aria-label="Ảnh tiếp"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* ── Counter ── */}
      <p
        className="text-center font-serif text-xs mt-5 tracking-[0.3em]"
        style={{ color: 'rgba(200,168,74,0.75)' }}
      >
        {index + 1} / {images.length}
      </p>

      {/* ── Dot indicators ── */}
      {images.length > 1 && images.length <= 30 && (
        <div className="flex justify-center gap-2 mt-2 flex-wrap">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="h-[3px] rounded-full transition-all duration-300"
              style={{
                width:      i === index ? 24 : 6,
                background: i === index ? 'rgba(200,168,74,0.85)' : 'rgba(255,255,255,0.20)',
              }}
              aria-label={`Ảnh ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Mobile hint ── */}
      <p
        className="text-center text-[10px] mt-3 sm:hidden font-serif italic tracking-wide"
        style={{ color: 'rgba(200,168,74,0.55)' }}
      >
        Vuốt trái / phải để xem ảnh tiếp theo
      </p>

      {/* ── Caption ── */}
      <p
        className="text-center font-serif italic mt-5 sm:mt-6 px-4"
        style={{
          fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
          color: 'rgba(200,168,74,0.6)',
          letterSpacing: '0.02em',
        }}
      >
        Những khoảnh khắc tuyệt vời của chúng mình
      </p>

      {/* ── Lightbox ── */}
      <Lightbox
        slides={slides}
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        on={{ view: ({ index: i }: { index: number }) => setLightboxIndex(i) }}
        styles={{ container: { backgroundColor: 'rgba(0,0,0,0.97)' } }}
      />
    </SectionWrapper>
  )
}
