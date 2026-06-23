'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useMusicContext } from '@/contexts/MusicContext'

/* Lá trang trí góc — SVG đơn giản */
function CornerLeaves({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="180" height="180" viewBox="0 0 180 180" fill="none"
      style={{ transform: flip ? 'rotate(180deg)' : undefined }}
    >
      <path d="M10,170 C30,120 80,100 140,10 C90,70 40,90 10,170Z"
        fill="#A8DC98" fillOpacity="0.35" />
      <path d="M5,155 C20,115 55,95 95,20 C60,70 25,90 5,155Z"
        fill="#C2E8B0" fillOpacity="0.25" />
      <path d="M20,170 C50,135 100,120 170,60 C110,100 55,120 20,170Z"
        fill="#82CC6A" fillOpacity="0.15" />
      {/* Nhánh nhỏ */}
      <path d="M10,170 Q50,140 90,90" stroke="#5CB84A" strokeOpacity="0.2" strokeWidth="1" fill="none"/>
      <path d="M5,150 Q35,120 70,75" stroke="#5CB84A" strokeOpacity="0.15" strokeWidth="0.8" fill="none"/>
    </svg>
  )
}

/* Hoa nhỏ trang trí */
function FloralDivider() {
  return (
    <div className="flex items-center justify-center gap-3 w-full">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #C8A84A55)' }} />
      <span className="text-gold text-sm leading-none" style={{ letterSpacing: 4 }}>✦ ❧ ✦</span>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #C8A84A55)' }} />
    </div>
  )
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] as number[] },
})

export default function InviteIntro({
  groomName,
  brideName,
  weddingDate,
}: {
  groomName: string
  brideName: string
  weddingDate: string
}) {
  const [opening, setOpening] = useState(false)
  const [gone, setGone] = useState(false)
  const { playing, toggle } = useMusicContext()

  const dateStr = new Date(weddingDate).toLocaleDateString('vi-VN', {
    day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  })

  const handleOpen = () => {
    if (!playing) toggle()
    setOpening(true)
    setTimeout(() => setGone(true), 1000)
  }

  if (gone) return null

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
      animate={{ opacity: opening ? 0 : 1 }}
      transition={{ duration: 0.7, delay: opening ? 0.2 : 0 }}
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #E8F7E0 0%, #EFF9E8 35%, #F7FCF4 70%, #ECF8E4 100%)',
      }}
    >
      {/* Góc trang trí — lá cây (ẩn trên màn rất nhỏ) */}
      <div className="absolute top-0 left-0 pointer-events-none opacity-80 sm:opacity-100 scale-[0.65] xs:scale-75 sm:scale-100 origin-top-left">
        <CornerLeaves />
      </div>
      <div className="absolute bottom-0 right-0 pointer-events-none opacity-80 sm:opacity-100 scale-[0.65] xs:scale-75 sm:scale-100 origin-bottom-right">
        <CornerLeaves flip />
      </div>

      {/* Viền vàng 4 góc */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-10 h-10 sm:w-14 sm:h-14 border-t border-l border-gold/40 pointer-events-none" />
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-14 sm:h-14 border-t border-r border-gold/40 pointer-events-none" />
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-10 h-10 sm:w-14 sm:h-14 border-b border-l border-gold/40 pointer-events-none" />
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-14 sm:h-14 border-b border-r border-gold/40 pointer-events-none" />

      {/* Card nổi trung tâm */}
      <div
        className="relative z-10 flex flex-col items-center text-center mx-4 w-full max-w-xs xs:max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl px-6 xs:px-8 sm:px-12 py-8 sm:py-12"
        style={{
          background: 'rgba(247,252,244,0.92)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 40px rgba(28,46,20,0.18), 0 2px 12px rgba(28,46,20,0.10), 0 0 0 1px rgba(200,168,74,0.15)',
        }}
      >

        {/* Nhãn trên */}
        <motion.p {...fadeUp(0.3)}
          className="font-sans text-[9px] sm:text-[10px] tracking-[0.45em] uppercase text-charcoal-light mb-5 sm:mb-8"
        >
          Lễ thành hôn
        </motion.p>

        {/* Divider trên */}
        <motion.div {...fadeUp(0.45)} className="w-full mb-5 sm:mb-8">
          <FloralDivider />
        </motion.div>

        {/* Tên chú rể — Great Vibes */}
        <motion.h1
          {...fadeUp(0.6)}
          style={{ fontFamily: 'var(--font-display)', lineHeight: 1, fontSize: 'clamp(3rem, 12vw, 5.5rem)' }}
          className="text-charcoal mb-1"
        >
          {groomName}
        </motion.h1>

        {/* & */}
        <motion.p
          {...fadeUp(0.72)}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 7vw, 3.5rem)' }}
          className="text-gold leading-none my-1"
        >
          &amp;
        </motion.p>

        {/* Tên cô dâu */}
        <motion.h1
          {...fadeUp(0.84)}
          style={{ fontFamily: 'var(--font-display)', lineHeight: 1, fontSize: 'clamp(3rem, 12vw, 5.5rem)' }}
          className="text-charcoal mb-5 sm:mb-8"
        >
          {brideName}
        </motion.h1>

        {/* Divider dưới */}
        <motion.div {...fadeUp(0.96)} className="w-full mb-4 sm:mb-6">
          <FloralDivider />
        </motion.div>

        {/* Ngày cưới */}
        <motion.p {...fadeUp(1.05)}
          className="font-sans text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase text-charcoal-light mb-2 sm:mb-3"
        >
          {dateStr}
        </motion.p>

        {/* Lời mời */}
        <motion.p {...fadeUp(1.15)}
          className="font-serif italic text-charcoal-light text-sm sm:text-base mb-7 sm:mb-10"
        >
          Trân trọng kính mời
        </motion.p>

        {/* Nút mở thiệp */}
        <motion.div {...fadeUp(1.25)}>
          <motion.button
            onClick={handleOpen}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative px-10 sm:px-12 py-3.5 font-sans text-[10px] sm:text-xs tracking-[0.35em] uppercase overflow-hidden group min-h-[44px] rounded-sm"
            style={{ background: '#1C2E14', color: '#F7FCF4' }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, #C8A84A, #A6852E)' }}
            />
            <span className="relative">Mở thiệp ♡</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
