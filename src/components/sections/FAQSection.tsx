'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'

interface FAQItem { _id: string; question: string; answer: string }

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-blush/30 last:border-0">
      {/* Min 48px tap target */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 sm:py-6 text-left gap-4 group min-h-[56px]"
      >
        <span className="font-serif text-base sm:text-lg md:text-xl text-charcoal group-hover:text-gold transition-colors leading-snug">
          {item.question}
        </span>
        <span className="flex-shrink-0 text-gold w-5 h-5 flex items-center justify-center">
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="font-sans text-sm leading-relaxed text-charcoal-light pb-5 sm:pb-6 pr-8">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection({ items }: { items: FAQItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?._id || null)

  if (items.length === 0) return null

  return (
    <SectionWrapper id="faq" className="section-padding bg-cream">
      <SectionHeader eyebrow="Câu hỏi thường gặp" title="FAQ" ornament="?" />
      <div className="max-w-2xl mx-auto">
        {items.map((item) => (
          <AccordionItem
            key={item._id}
            item={item}
            isOpen={openId === item._id}
            onToggle={() => setOpenId(openId === item._id ? null : item._id)}
          />
        ))}
      </div>
    </SectionWrapper>
  )
}
