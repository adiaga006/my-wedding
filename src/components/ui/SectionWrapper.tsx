'use client'

import { useRef } from 'react'
import React from 'react'
import { motion, useInView } from 'motion/react'

interface SectionWrapperProps {
  id: string
  className?: string
  children: React.ReactNode
}

export default function SectionWrapper({ id, className = '', children }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.06 })

  const childArray = React.Children.toArray(children)

  return (
    <section id={id} ref={ref} className={className}>
      {childArray.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{
            duration: 1.4,
            delay: i * 0.22,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </section>
  )
}
