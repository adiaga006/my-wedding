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
  const inView = useInView(ref, { once: false, amount: 0.04 })

  const childArray = React.Children.toArray(children)

  return (
    <section id={id} ref={ref} className={className}>
      {/* Header bar (child 0) — trượt từ trên xuống */}
      {childArray[0] && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -40 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          {childArray[0]}
        </motion.div>
      )}

      {/* Content (child 1+) — mỗi thành phần tự animate riêng */}
      {childArray.slice(1)}
    </section>
  )
}
