'use client'

import { useState, useEffect, useRef, Fragment } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import VinylDisc from '@/components/ui/VinylDisc'
import { urlFor } from '@/sanity/lib/image'
import { formatDateTime } from '@/lib/utils'

interface HeroProps {
  groomName: string
  brideName: string
  groomTitle?: string
  brideTitle?: string
  weddingDate: string
  heroImage?: { asset: { _ref: string } }
  heroQuote?: string
}

/* ── God rays ── */
function GodRays() {
  const rays = [
    { angle: -40, opacity: 0.035, width: 90,  dur: 5.0, del: 0.0 },
    { angle: -22, opacity: 0.055, width: 70,  dur: 4.5, del: 0.6 },
    { angle:  -8, opacity: 0.065, width: 100, dur: 5.5, del: 0.2 },
    { angle:   5, opacity: 0.06,  width: 80,  dur: 4.8, del: 0.9 },
    { angle:  18, opacity: 0.05,  width: 90,  dur: 5.2, del: 0.4 },
    { angle:  35, opacity: 0.04,  width: 70,  dur: 4.6, del: 1.1 },
    { angle:  52, opacity: 0.03,  width: 60,  dur: 5.8, del: 0.7 },
  ]
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {rays.map((r, i) => (
        <motion.div key={i} className="absolute"
          style={{
            top: '-5%', left: '42%', width: r.width, height: '130%',
            transformOrigin: 'top left',
            transform: `rotate(${r.angle}deg)`,
            background: `linear-gradient(to bottom, rgba(255,240,190,${r.opacity * 4}) 0%, rgba(255,240,190,${r.opacity}) 25%, transparent 65%)`,
            filter: 'blur(14px)',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: r.dur, delay: r.del, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ── Aurora — dải màu hồng/vàng/tím chuyển động ── */
function AuroraGlow() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-2/3 pointer-events-none z-[1] overflow-hidden">
      <motion.div className="absolute rounded-full"
        style={{ left: '-10%', bottom: 0, width: '65%', height: '80%',
          background: 'radial-gradient(ellipse, rgba(255,182,193,0.12) 0%, transparent 70%)',
          filter: 'blur(45px)' }}
        animate={{ x: ['0%', '35%', '0%'], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="absolute rounded-full"
        style={{ right: '-5%', bottom: 0, width: '55%', height: '70%',
          background: 'radial-gradient(ellipse, rgba(200,168,74,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)' }}
        animate={{ x: ['0%', '-30%', '0%'], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div className="absolute rounded-full"
        style={{ left: '25%', bottom: 0, width: '50%', height: '60%',
          background: 'radial-gradient(ellipse, rgba(167,139,250,0.08) 0%, transparent 70%)',
          filter: 'blur(35px)' }}
        animate={{ y: ['0%', '-20%', '0%'], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
    </div>
  )
}

/* ── Hoa đào 5 cánh rơi ── */
type Petal = { id: number; left: number; size: number; delay: number; duration: number; rotate: number; drift: number; pink: boolean }

function FallingPetals() {
  const [petals, setPetals] = useState<Petal[]>([])
  useEffect(() => {
    setPetals(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 8 + Math.random() * 7,
      delay: Math.random() * 10,
      duration: 7 + Math.random() * 6,
      rotate: Math.random() * 360,
      drift: (Math.random() - 0.5) * 70,
      pink: i % 2 === 0,
    })))
  }, [])
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
      {petals.map((p) => (
        <motion.div key={p.id} className="absolute"
          style={{ left: `${p.left}%`, top: -p.size - 10 }}
          animate={{ y: '112vh', x: p.drift, rotate: p.rotate + 360, opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 20 26" width={p.size} height={p.size}>
            <ellipse cx="10" cy="13" rx="5.5" ry="11"
              fill={p.pink ? '#F9A8D4' : '#FFFFFF'}
              fillOpacity={p.pink ? 0.88 : 0.78}
              stroke={p.pink ? '#F472B6' : '#E5E7EB'}
              strokeWidth="0.8" strokeOpacity="0.6"
              transform="rotate(-15 10 13)"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}


/* ── Pháo hoa mini ── */
const FW_COLORS = ['#FFD700', '#FFE87C', '#FBCFE8', '#FFFFFF', '#C8A84A', '#F9A8D4', '#FFA500']

type FWParticle = { angle: number; dist: number; color: string; pDelay: number; rDelay: number }
type FWData = { x: number; y: number; particles: FWParticle[] }

function MiniFireworks() {
  const [fireworks, setFireworks] = useState<FWData[]>([])
  useEffect(() => {
    const positions = [
      { x: 18, y: 22, baseDelay: 2.0 },
      { x: 82, y: 18, baseDelay: 2.9 },
      { x: 50, y: 12, baseDelay: 3.7 },
    ]
    setFireworks(positions.map((pos) => ({
      x: pos.x,
      y: pos.y,
      particles: Array.from({ length: 14 }, (_, i) => ({
        angle: (i / 14) * 360,
        dist: 25 + Math.random() * 35,
        color: FW_COLORS[i % FW_COLORS.length],
        pDelay: pos.baseDelay + i * 0.025,
        rDelay: 8 + Math.random() * 6,
      })),
    })))
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[3]">
      {fireworks.map((fw, fi) => (
        <div key={fi} className="absolute" style={{ left: `${fw.x}%`, top: `${fw.y}%` }}>
          {fw.particles.map((p, i) => {
            const rad = (p.angle * Math.PI) / 180
            const tx = Math.cos(rad) * p.dist
            const ty = Math.sin(rad) * p.dist
            return (
              <motion.div key={i} className="absolute rounded-full"
                style={{ width: 3, height: 3, background: p.color, left: -1.5, top: -1.5 }}
                animate={{
                  x: [0, tx * 0.5, tx],
                  y: [0, ty * 0.5 - 10, ty + 18],
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.6, 1, 0],
                }}
                transition={{
                  duration: 1.4, delay: p.pDelay,
                  repeat: Infinity, repeatDelay: p.rDelay,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

/* ── Hạt sáng ── */
type Spark = { id: number; left: number; top: number; size: number; delay: number; duration: number }

function Sparkles() {
  const [sparks, setSparks] = useState<Spark[]>([])
  useEffect(() => {
    setSparks(Array.from({ length: 20 }, (_, i) => ({
      id: i, left: Math.random() * 100, top: Math.random() * 100,
      size: 1.5 + Math.random() * 3, delay: Math.random() * 5, duration: 2 + Math.random() * 3,
    })))
  }, [])
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
      {sparks.map((s) => (
        <motion.div key={s.id} className="absolute rounded-full bg-gold"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.3, 0.5] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ── Bokeh mờ ── */
type Bokeh = { id: number; left: number; top: number; size: number; delay: number; duration: number; dy: number }

function BokehFloating() {
  const [circles, setCircles] = useState<Bokeh[]>([])
  useEffect(() => {
    setCircles(Array.from({ length: 8 }, (_, i) => ({
      id: i, left: 5 + Math.random() * 90, top: 5 + Math.random() * 90,
      size: 50 + Math.random() * 100, delay: Math.random() * 6,
      duration: 5 + Math.random() * 6, dy: (Math.random() - 0.5) * 30,
    })))
  }, [])
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {circles.map((c) => (
        <motion.div key={c.id} className="absolute rounded-full"
          style={{
            left: `${c.left}%`, top: `${c.top}%`, width: c.size, height: c.size,
            background: 'radial-gradient(circle, rgba(200,168,74,0.14) 0%, transparent 70%)',
            filter: 'blur(12px)', transform: 'translate(-50%, -50%)',
          }}
          animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.85, 1.15, 0.85], y: [0, c.dy, 0] }}
          transition={{ duration: c.duration, delay: c.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ── Typewriter cho quote ── */
function TypewriterText({ text, startDelay = 0 }: { text: string; startDelay?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      let i = 0
      const iv = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) { clearInterval(iv); setDone(true) }
      }, 85)
      return () => clearInterval(iv)
    }, startDelay * 1000)
    return () => clearTimeout(t)
  }, [text, startDelay])

  return (
    <span>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="ml-px"
        >|</motion.span>
      )}
    </span>
  )
}

/* ── Reveal tên từng ký tự — mỗi từ xuống 1 dòng ── */
function RevealName({ text, delay = 0, style }: { text: string; delay?: number; style?: React.CSSProperties }) {
  const words = text.split(' ')
  let cursor = 0
  return (
    <h1 className="shimmer-name font-semibold italic text-center" style={{ lineHeight: 1.2, ...style }}>
      {words.map((word, wi) => {
        const wordStart = cursor
        cursor += word.length + 1
        return (
          <span key={wi} style={{ display: 'block' }}>
            {word.split('').map((char, ci) => (
              <motion.span key={ci}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: delay + (wordStart + ci) * 0.09, ease: 'easeOut' }}
                style={{ display: 'inline' }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        )
      })}
    </h1>
  )
}

export default function HeroSection({
  groomName, brideName, groomTitle, brideTitle,
  weddingDate, heroImage, heroQuote,
}: HeroProps) {
  const imageUrl = heroImage ? urlFor(heroImage).width(1400).url() : null
  const { datePart, timePart } = formatDateTime(weddingDate)


  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])

  const [animKey, setAnimKey] = useState(0)
  useEffect(() => {
    const handler = () => setAnimKey((k: number) => k + 1)
    window.addEventListener('intro-closed', handler)
    return () => window.removeEventListener('intro-closed', handler)
  }, [])

  const groomRevealEnd = 0.6 + groomName.length * 0.09 + 0.3
  const brideRevealDelay = groomRevealEnd
  const quoteDelay = brideRevealDelay + brideName.length * 0.09 + 0.7

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-[100svh] flex flex-col items-center overflow-hidden">

      <style>{`
        @keyframes shimmer-name {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .shimmer-name {
          background: linear-gradient(90deg, #F7F0E6 25%, #FFE87C 50%, #F7F0E6 75%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-name 5s linear infinite;
          filter: drop-shadow(2px 3px 5px rgba(0,0,0,0.5));
        }
      `}</style>

      <div className="absolute inset-0 bg-charcoal" />

      {/* Mobile: Ken Burns + Parallax + cover */}
      {imageUrl && (
        <motion.div className="absolute inset-0 md:hidden"
          initial={{ scale: 1.05 }} animate={{ scale: 1.0 }}
          transition={{ duration: 7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ y: bgY }}
        >
          <Image src={imageUrl} alt={`${groomName} & ${brideName}`}
            fill priority className="object-cover object-center" sizes="100vw" />
        </motion.div>
      )}
      {/* Desktop: blurred backdrop lấp đầy + ảnh sắc nét contain ở trên */}
      {imageUrl && (
        <div className="absolute inset-0 hidden md:block">
          {/* Backdrop mờ — lấp đầy vùng trống hai bên */}
          <Image src={imageUrl} alt="" fill aria-hidden
            className="object-cover object-center scale-110"
            style={{ filter: 'blur(24px) brightness(0.45)' }}
            sizes="100vw" />
          {/* Ảnh chính — hiện đầy đủ, không cắt */}
          <Image src={imageUrl} alt={`${groomName} & ${brideName}`}
            fill priority className="object-contain object-center" sizes="100vw" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/85 z-[1]" />

      <GodRays />
      <AuroraGlow />
      <BokehFloating />
      <Sparkles />
      <FallingPetals />

      <MiniFireworks />

      {/* Corner ornaments */}
      <svg className="absolute top-16 left-5 sm:top-20 sm:left-8 w-8 h-8 sm:w-12 sm:h-12 text-gold/50 pointer-events-none z-[3]" viewBox="0 0 48 48" fill="none">
        <line x1="1" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="1" y1="1" x2="1" y2="22" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="1" cy="1" r="2.2" fill="currentColor"/>
      </svg>
      <svg className="absolute top-16 right-5 sm:top-20 sm:right-8 w-8 h-8 sm:w-12 sm:h-12 text-gold/50 pointer-events-none z-[3]" viewBox="0 0 48 48" fill="none">
        <line x1="47" y1="1" x2="26" y2="1" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="47" y1="1" x2="47" y2="22" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="47" cy="1" r="2.2" fill="currentColor"/>
      </svg>
      <svg className="absolute bottom-16 left-5 sm:bottom-8 sm:left-8 w-8 h-8 sm:w-12 sm:h-12 text-gold/50 pointer-events-none z-[3]" viewBox="0 0 48 48" fill="none">
        <line x1="1" y1="47" x2="22" y2="47" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="1" y1="47" x2="1" y2="26" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="1" cy="47" r="2.2" fill="currentColor"/>
      </svg>
      <svg className="absolute bottom-16 right-5 sm:bottom-8 sm:right-8 w-8 h-8 sm:w-12 sm:h-12 text-gold/50 pointer-events-none z-[3]" viewBox="0 0 48 48" fill="none">
        <line x1="47" y1="47" x2="26" y2="47" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="47" y1="47" x2="47" y2="26" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="47" cy="47" r="2.2" fill="currentColor"/>
      </svg>

      {/* ===== NỘI DUNG TRÊN ===== */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 xs:px-6 w-full max-w-lg mx-auto pt-20 sm:pt-24 md:pt-28">

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-sans text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.4em] uppercase text-cream/70 mb-5 sm:mb-7"
        >
          Lễ thành hôn
        </motion.p>

        <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="flex items-center gap-2 mb-4 sm:mb-5 w-full max-w-[280px] xs:max-w-xs"
        >
          <div className="flex-1 h-px bg-gold/40" />
          <span className="text-gold/70 text-xs tracking-widest">✦ ❧ ✦</span>
          <div className="flex-1 h-px bg-gold/40" />
        </motion.div>

        {/* Tên đôi — 囍 là flex item giữa, luôn cách đều 2 tên */}
        <Fragment key={animKey}>
          <div className="flex flex-row items-center w-full mb-4 sm:mb-5">
            {/* Chú rể */}
            <div className="flex flex-col items-center flex-1 text-center">
              {groomTitle && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="font-sans text-[9px] xs:text-[10px] tracking-[0.3em] uppercase text-gold/80 mb-1.5 leading-none"
                >{groomTitle}</motion.p>
              )}
              <RevealName text={groomName} delay={0.6}
                style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.3rem, 7vw, 4rem)', letterSpacing: '0.06em' }} />
            </div>

            {/* 囍 — flex item ở giữa */}
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: brideRevealDelay - 0.15, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ fontSize: 'clamp(1.1rem, 5vw, 2.5rem)' }}
              className="flex-shrink-0 px-3 xs:px-4 text-gold leading-none select-none pointer-events-none"
            >囍</motion.span>

            {/* Cô dâu */}
            <div className="flex flex-col items-center flex-1 text-center">
              {brideTitle && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: brideRevealDelay }}
                  className="font-sans text-[9px] xs:text-[10px] tracking-[0.3em] uppercase text-gold/80 mb-1.5 leading-none"
                >{brideTitle}</motion.p>
              )}
              <RevealName text={brideName} delay={brideRevealDelay}
                style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.3rem, 7vw, 4rem)', letterSpacing: '0.06em' }} />
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.9, delay: brideRevealDelay + brideName.length * 0.09 + 0.2 }}
            className="flex items-center gap-2 mb-5 sm:mb-7 w-full max-w-[280px] xs:max-w-xs"
          >
            <div className="flex-1 h-px bg-gold/40" />
            <span className="text-gold/70 text-xs tracking-widest">✦ ❧ ✦</span>
            <div className="flex-1 h-px bg-gold/40" />
          </motion.div>

          {/* Quote — typewriter */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: quoteDelay - 0.2 }}
            className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-cream/60"
          >
            <TypewriterText text={heroQuote || 'Love never fails'} startDelay={quoteDelay} />
          </motion.p>
        </Fragment>
      </div>

      <div className="flex-1" />

      {/* ===== NỘI DUNG DƯỚI ===== */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full pb-14 sm:pb-18">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-col items-center gap-1 mb-4"
        >
          <p className="font-sans text-xs sm:text-sm tracking-widest text-cream/65">{datePart}</p>
          <p className="font-serif italic text-gold text-xl sm:text-2xl tracking-[0.2em]">{timePart}</p>
        </motion.div>
        <div className="scale-[0.78] origin-center"><VinylDisc /></div>
      </div>

          <motion.button
            onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.5 }}
            className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-cream/50 hover:text-cream transition-colors p-2 z-10"
            aria-label="Cuộn xuống"
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
              <ChevronDown size={28} className="sm:w-8 sm:h-8" />
            </motion.div>
          </motion.button>
    </section>
  )
}
