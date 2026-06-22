'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

interface SectionWrapperProps {
  id: string
  className?: string
  children: React.ReactNode
}

export default function SectionWrapper({ id, className = '', children }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.section>
  )
}
