'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import Image from 'next/image'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'
import { urlFor } from '@/sanity/lib/image'

interface StoryItem {
  _id: string
  title: string
  date: string
  description: string
  image?: { asset: { _ref: string } }
}

function TimelineItem({ item, index }: { item: StoryItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-80px 0px' })
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative"
    >
      {/* Mobile: vertical timeline dot */}
      <div className="md:hidden flex items-center gap-4 mb-4">
        <div className="w-3 h-3 rounded-full bg-gold flex-shrink-0" />
        <p className="font-sans text-xs tracking-widest uppercase text-gold">{item.date}</p>
      </div>

      {/* Desktop: alternating layout — Mobile: single column */}
      <div className={`flex flex-col md:flex-row md:items-center gap-6 md:gap-12 lg:gap-16 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
        {/* Image */}
        <div className="w-full md:w-5/12">
          {item.image ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src={urlFor(item.image).width(700).height(525).url()}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
          ) : (
            <div className="aspect-[4/3] bg-blush/20 flex items-center justify-center rounded-sm">
              <span className="text-blush text-5xl">♡</span>
            </div>
          )}
        </div>

        {/* Center dot — desktop only */}
        <div className="hidden md:flex flex-col items-center gap-2 w-2/12 flex-shrink-0">
          <div className="w-4 h-4 rounded-full bg-gold border-4 border-cream shadow-md ring-1 ring-gold/30" />
        </div>

        {/* Text */}
        <div className={`w-full md:w-5/12 text-left ${!isEven ? 'md:text-right' : 'md:text-left'}`}>
          <p className="hidden md:block font-sans text-xs tracking-widest uppercase text-gold mb-2">{item.date}</p>
          <h3 className="font-serif text-2xl sm:text-3xl text-charcoal mb-3 leading-snug">{item.title}</h3>
          <p className="font-sans text-sm leading-relaxed text-charcoal-light">{item.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function StorySection({ items }: { items: StoryItem[] }) {
  if (items.length === 0) return null

  return (
    <SectionWrapper id="story" className="overflow-hidden">
      <div className="bg-charcoal py-3 sm:py-5 px-4 sm:px-10">
        <SectionHeader eyebrow="Câu chuyện của chúng mình" title="Hành trình tình yêu" dark  compact />
      </div>
      <div className="section-padding bg-cream">

      <div className="max-w-5xl mx-auto relative">
        {/* Vertical line — desktop only */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blush/20 via-blush/50 to-blush/20 -translate-x-1/2" />

        {/* Mobile: left border timeline */}
        <div className="md:hidden absolute left-1.5 top-0 bottom-0 w-px bg-gradient-to-b from-blush/20 via-blush/50 to-blush/20" />

        <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 pl-5 xs:pl-6 md:pl-0">
          {items.map((item, i) => (
            <TimelineItem key={item._id} item={item} index={i} />
          ))}
        </div>
      </div>
      </div>{/* end section-padding */}
    </SectionWrapper>
  )
}
