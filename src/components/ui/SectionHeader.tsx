'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  ornament?: string
  dark?: boolean
  icon?: ReactNode
  compact?: boolean
}

export default function SectionHeader({
  eyebrow,
  title,
  ornament = '❧',
  dark = false,
  icon,
  compact = false,
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.3 })

  const words = title.split(' ')
  const wordDelay = (i: number) => 0.22 + i * 0.13

  return (
    <div ref={ref} className={`text-center ${compact ? 'mb-0' : 'mb-10 sm:mb-14 md:mb-16'}`}>

      {/* Icon — bật lên từ dưới */}
      {icon && (
        <motion.div
          className={`flex justify-center mb-3 ${dark ? 'text-gold/70' : 'text-gold/80'}`}
          initial={{ opacity: 0, y: 30, scale: 0.6 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.6 }}
          transition={{ duration: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {icon}
        </motion.div>
      )}

      {/* Eyebrow — trượt từ trên xuống */}
      <motion.p
        className={`section-subtitle ${dark ? '!text-cream/40' : ''}`}
        initial={{ opacity: 0, y: -28, letterSpacing: '0.5em' }}
        animate={inView
          ? { opacity: 1, y: 0, letterSpacing: '0.35em' }
          : { opacity: 0, y: -28, letterSpacing: '0.5em' }}
        transition={{ duration: 1.1, delay: icon ? 0.18 : 0, ease: [0.16, 1, 0.3, 1] }}
      >
        {eyebrow}
      </motion.p>

      {/* Title — từng chữ hiện từ dưới */}
      <h2 className={`section-title ${dark ? '!text-cream' : ''}`}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{
              duration: 1.3,
              delay: wordDelay(i),
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ display: 'inline-block', marginRight: i < words.length - 1 ? '0.3em' : 0 }}
          >
            {word}
          </motion.span>
        ))}
      </h2>

      {/* Ornament — mở rộng từ giữa */}
      <motion.div
        className={`divider-ornament ${compact ? 'mt-3' : 'mt-6'}`}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={inView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
        transition={{
          duration: 1.0,
          delay: wordDelay(words.length),
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <span className="text-gold text-xl">{ornament}</span>
      </motion.div>
    </div>
  )
}
