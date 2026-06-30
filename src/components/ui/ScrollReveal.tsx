'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import type { ReactNode, CSSProperties } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

type AnimState = { opacity: number; y?: number; x?: number; scale?: number }

const HIDDEN: Record<Direction, AnimState> = {
  up:    { opacity: 0, y: 60 },
  down:  { opacity: 0, y: -50 },
  left:  { opacity: 0, x: -60 },
  right: { opacity: 0, x: 60 },
  scale: { opacity: 0, scale: 0.82 },
  fade:  { opacity: 0 },
}

const VISIBLE: Record<Direction, AnimState> = {
  up:    { opacity: 1, y: 0 },
  down:  { opacity: 1, y: 0 },
  left:  { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  scale: { opacity: 1, scale: 1 },
  fade:  { opacity: 1 },
}

interface ScrollRevealProps {
  children: ReactNode
  from?: Direction
  delay?: number
  duration?: number
  className?: string
  style?: CSSProperties
  amount?: number
}

export default function ScrollReveal({
  children,
  from = 'up',
  delay = 0,
  duration = 1.4,
  className,
  style,
  amount = 0.12,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount })

  return (
    <motion.div
      ref={ref}
      initial={HIDDEN[from]}
      animate={inView ? VISIBLE[from] : HIDDEN[from]}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/* ─── Reveal từng chữ (word-by-word) ─── */
interface RevealWordsProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  from?: 'up' | 'down' | 'left' | 'right'
  duration?: number
  amount?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export function RevealWords({
  text,
  className,
  delay = 0,
  stagger = 0.10,
  from = 'up',
  duration = 1.3,
  amount = 0.3,
  as: Tag = 'span',
}: RevealWordsProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: false, amount })

  const wordHidden =
    from === 'up' ? { opacity: 0, y: 45 } :
    from === 'down' ? { opacity: 0, y: -35 } :
    from === 'left' ? { opacity: 0, x: -40 } :
    { opacity: 0, x: 40 }

  const wordVisible = { opacity: 1, y: 0, x: 0 }

  const words = text.split(' ')

  return (
    // @ts-ignore – dynamic tag
    <Tag ref={ref} className={className} style={{ display: 'block' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={wordHidden}
          animate={inView ? wordVisible : wordHidden}
          transition={{ duration, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'inline-block', marginRight: i < words.length - 1 ? '0.28em' : 0 }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}
