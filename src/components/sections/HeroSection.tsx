'use client'

import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import CountdownTimer from '@/components/ui/CountdownTimer'
import VinylDisc from '@/components/ui/VinylDisc'
import { urlFor } from '@/sanity/lib/image'
import { formatDate, formatDateTime } from '@/lib/utils'

interface HeroProps {
  groomName: string
  brideName: string
  weddingDate: string
  heroImage?: { asset: { _ref: string } }
  heroQuote?: string
}

export default function HeroSection({ groomName, brideName, weddingDate, heroImage, heroQuote }: HeroProps) {
  const imageUrl = heroImage
    ? urlFor(heroImage).width(1920).height(1080).fit('crop').url()
    : null

  const { datePart, timePart } = formatDateTime(weddingDate)

  return (
    <section id="hero" className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${groomName} & ${brideName}`}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal" />
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/45 to-black/70" />

      {/* Corner ornaments */}
      <div className="absolute top-5 left-5 sm:top-8 sm:left-8 w-10 h-10 sm:w-16 sm:h-16 border-t-2 border-l-2 border-cream/30" />
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8 w-10 h-10 sm:w-16 sm:h-16 border-t-2 border-r-2 border-cream/30" />
      <div className="absolute bottom-16 left-5 sm:bottom-8 sm:left-8 w-10 h-10 sm:w-16 sm:h-16 border-b-2 border-l-2 border-cream/30" />
      <div className="absolute bottom-16 right-5 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-16 sm:h-16 border-b-2 border-r-2 border-cream/30" />

      {/* Content — pt đẩy khỏi navbar (h-14 sm:h-16 md:h-20) */}
      <div className="relative z-10 text-center px-4 xs:px-6 w-full max-w-4xl mx-auto pt-20 sm:pt-24 md:pt-28 pb-24 sm:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-sans text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.4em] uppercase text-cream/70 mb-6 sm:mb-8"
        >
          Lễ thành hôn
        </motion.p>

        {/* Tên chú rể — Great Vibes calligraphy */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] xl:text-[10rem] text-cream leading-none mb-3 sm:mb-4"
        >
          {groomName}
        </motion.h1>

        {/* Divider & */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex items-center justify-center gap-4 sm:gap-6 mb-3 sm:mb-4"
        >
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold/70" />
          <span
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-gold text-4xl sm:text-5xl leading-none"
          >
            &amp;
          </span>
          <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold/70" />
        </motion.div>

        {/* Tên cô dâu */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] xl:text-[10rem] text-cream leading-none mb-6 sm:mb-10"
        >
          {brideName}
        </motion.h1>

        {/* Ngày và giờ cưới */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mb-8 sm:mb-12 flex flex-col items-center gap-1.5"
        >
          <p className="font-sans text-xs sm:text-sm tracking-widest text-cream/70">
            {datePart}
          </p>
          <p className="font-serif italic text-gold text-xl sm:text-2xl md:text-3xl tracking-[0.2em]">
            {timePart}
          </p>
        </motion.div>

        {/* Quote */}
        {heroQuote && (
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="font-serif text-base sm:text-lg italic text-cream/55 mb-8 sm:mb-12 max-w-sm sm:max-w-lg mx-auto leading-relaxed px-4"
          >
            &ldquo;{heroQuote}&rdquo;
          </motion.blockquote>
        )}

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex justify-center"
        >
          <CountdownTimer targetDate={weddingDate} />
        </motion.div>

        {/* Đĩa vinyl + tên bài đang phát */}
        <div className="mt-8">
          <VinylDisc />
        </div>
      </div>

      {/* Scroll down */}
      <motion.button
        onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 text-cream/50 hover:text-cream transition-colors p-2"
        aria-label="Cuộn xuống"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={28} className="sm:w-8 sm:h-8" />
        </motion.div>
      </motion.button>
    </section>
  )
}
