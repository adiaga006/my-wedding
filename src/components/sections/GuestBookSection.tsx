'use client'

import { useActionState, useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle, Loader2, Send, ChevronLeft, ChevronRight, Heart, ArrowRight } from 'lucide-react'
import { submitGuestbook } from '@/actions/guestbook'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'

interface GuestMessage {
  _id: string
  authorName: string
  message: string
  submittedAt: string
}

const ITEMS_DESKTOP = 6
const ITEMS_MOBILE = 3

function useItemsPerPage() {
  const [items, setItems] = useState(ITEMS_DESKTOP)
  useEffect(() => {
    const check = () => setItems(window.innerWidth < 640 ? ITEMS_MOBILE : ITEMS_DESKTOP)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return items
}

// Cards enter from different directions based on index
const cardDirections = [
  { x: -40, y: 0 },
  { x: 0, y: -30 },
  { x: 40, y: 0 },
  { x: 0, y: 30 },
  { x: -30, y: -20 },
  { x: 30, y: 20 },
]

function MessageCard({ msg, index }: { msg: GuestMessage; index: number }) {
  const dir = cardDirections[index % cardDirections.length]
  return (
    <motion.div
      initial={{ opacity: 0, x: dir.x, y: dir.y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col gap-4 bg-white p-4 xs:p-5 sm:p-7 shadow-sm hover:shadow-lg transition-all duration-300 border-l-2 border-blush hover:border-gold rounded-lg"
    >
      {/* Faint corner accent */}
      <span className="absolute -top-1 right-4 font-serif text-[80px] leading-none text-blush/10 select-none pointer-events-none">"</span>
      <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-blush/30 group-hover:bg-gold/40 transition-colors duration-300" />

      {/* Message */}
      <p className="font-serif italic text-charcoal/75 text-sm sm:text-[15px] leading-[1.8] flex-1 pt-1">
        {msg.message}
      </p>

      {/* Divider with ornament */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-blush/30 group-hover:bg-gold/30 transition-colors duration-300" />
        <span className="text-blush/40 group-hover:text-gold/50 transition-colors text-xs leading-none">✦</span>
        <div className="flex-1 h-px bg-blush/30 group-hover:bg-gold/30 transition-colors duration-300" />
      </div>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blush to-blush-dark flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="font-serif text-xs text-white font-medium">
            {msg.authorName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-sans text-xs font-semibold text-charcoal tracking-wide">{msg.authorName}</p>
          <p className="font-sans text-[10px] text-charcoal-light leading-none mt-0.5">
            {new Date(msg.submittedAt).toLocaleDateString('vi-VN', {
              day: 'numeric', month: 'long', year: 'numeric',
              timeZone: 'Asia/Ho_Chi_Minh',
            })}
          </p>
        </div>
        <span className="ml-auto text-blush/40 group-hover:text-gold/60 transition-colors text-base leading-none">♡</span>
      </div>
    </motion.div>
  )
}

function MessageCarousel({ messages }: { messages: GuestMessage[] }) {
  const itemsPerPage = useItemsPerPage()
  const totalPages = Math.ceil(messages.length / itemsPerPage)
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)
  const dragStartX = useRef(0)
  const [showHint, setShowHint] = useState(true)

  useEffect(() => { setPage(0) }, [itemsPerPage])

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3500)
    return () => clearTimeout(t)
  }, [])

  const goTo = useCallback((next: number, direction: number) => {
    setDir(direction)
    setPage(next)
    setShowHint(false)
  }, [])

  const next = useCallback(() => goTo((page + 1) % totalPages, 1), [page, totalPages, goTo])
  const prev = useCallback(() => goTo((page - 1 + totalPages) % totalPages, -1), [page, totalPages, goTo])

  const currentItems = messages.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '60%' : '-60%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-60%' : '60%', opacity: 0 }),
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={page}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            drag={totalPages > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragStart={(_, info) => { dragStartX.current = info.point.x }}
            onDragEnd={(_, info) => {
              const dx = info.point.x - dragStartX.current
              if (dx < -50) next()
              else if (dx > 50) prev()
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 cursor-grab active:cursor-grabbing"
          >
            {currentItems.map((msg, i) => (
              <MessageCard key={msg._id} msg={msg} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile swipe hint */}
      {totalPages > 1 && (
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8 }}
              className="flex sm:hidden items-center justify-center gap-2 mt-5 text-charcoal-light/70"
            >
              <ArrowRight size={13} className="animate-bounce-x" />
              <span className="font-sans text-[11px] tracking-[0.15em] uppercase">Vuốt để xem thêm</span>
              <ArrowRight size={13} className="animate-bounce-x" />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 sm:w-11 sm:h-11 border border-charcoal/15 rounded-full flex items-center justify-center text-charcoal-light hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-200"
            aria-label="Trang trước"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > page ? 1 : -1)}
                className={`transition-all duration-300 rounded-full ${
                  i === page ? 'w-5 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-charcoal/15 hover:bg-charcoal/30'
                }`}
                aria-label={`Trang ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 sm:w-11 sm:h-11 border border-charcoal/15 rounded-full flex items-center justify-center text-charcoal-light hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-200"
            aria-label="Trang tiếp"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default function GuestBookSection({ initialMessages }: { initialMessages: GuestMessage[] }) {
  const [state, action, isPending] = useActionState(submitGuestbook, null)

  return (
    <>
      <SectionWrapper id="guestbook" className="overflow-hidden">
        <div className="bg-charcoal py-3 sm:py-5 px-4 sm:px-10">
          <SectionHeader eyebrow="Gửi lời yêu thương" title="Sổ lưu bút" dark icon={<Heart size={36} strokeWidth={1.4} />} compact />
        </div>
        <div className="section-padding bg-blush/10">
          <div className="max-w-lg mx-auto">
            {state?.success ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-10"
              >
                <CheckCircle size={40} className="text-sage mx-auto mb-4" strokeWidth={1} />
                <p className="font-serif italic text-charcoal/80 text-lg mb-1">Cảm ơn lời chúc của bạn!</p>
                <p className="font-sans text-xs tracking-wider text-charcoal/50">Lời chúc sẽ hiển thị sau khi được duyệt ♡</p>
              </motion.div>
            ) : (
              <form action={action} className="space-y-6">
                <input className="input-line" name="authorName" placeholder="Tên bạn *" required />
                <textarea className="input-line resize-none" name="message" placeholder="Lời chúc gửi đến Duy & Chi *" rows={4} required />
                {state?.error && <p className="text-red-600 text-xs font-sans">{state.error}</p>}
                <div className="flex justify-end pt-1">
                  <button type="submit" disabled={isPending} className="btn-primary px-8">
                    {isPending ? <><Loader2 size={13} className="animate-spin" /> Đang gửi...</> : <><Send size={13} /> Gửi lời chúc</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </SectionWrapper>

      {initialMessages.length > 0 && (
        <section className="relative section-padding overflow-hidden" style={{ background: 'linear-gradient(160deg, #F7FCF4 0%, #edf7e8 50%, #F7FCF4 100%)' }}>
          {/* Background decorative blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-blush/10 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-sage/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
          </div>

          {/* Corner decorations */}
          <div className="pointer-events-none absolute top-8 left-8 opacity-15">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M30 5 C30 5 10 15 5 30 C10 45 30 55 30 55 C30 55 50 45 55 30 C50 15 30 5 30 5Z" stroke="#C8A84A" strokeWidth="1" fill="none" />
              <circle cx="30" cy="30" r="4" fill="#C8A84A" />
              <path d="M30 5 L30 55 M5 30 L55 30" stroke="#C8A84A" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="pointer-events-none absolute top-8 right-8 opacity-15 rotate-90">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M30 5 C30 5 10 15 5 30 C10 45 30 55 30 55 C30 55 50 45 55 30 C50 15 30 5 30 5Z" stroke="#C8A84A" strokeWidth="1" fill="none" />
              <circle cx="30" cy="30" r="4" fill="#C8A84A" />
              <path d="M30 5 L30 55 M5 30 L55 30" stroke="#C8A84A" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="pointer-events-none absolute bottom-8 left-8 opacity-15 -rotate-90">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M30 5 C30 5 10 15 5 30 C10 45 30 55 30 55 C30 55 50 45 55 30 C50 15 30 5 30 5Z" stroke="#C8A84A" strokeWidth="1" fill="none" />
              <circle cx="30" cy="30" r="4" fill="#C8A84A" />
              <path d="M30 5 L30 55 M5 30 L55 30" stroke="#C8A84A" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="pointer-events-none absolute bottom-8 right-8 opacity-15 rotate-180">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M30 5 C30 5 10 15 5 30 C10 45 30 55 30 55 C30 55 50 45 55 30 C50 15 30 5 30 5Z" stroke="#C8A84A" strokeWidth="1" fill="none" />
              <circle cx="30" cy="30" r="4" fill="#C8A84A" />
              <path d="M30 5 L30 55 M5 30 L55 30" stroke="#C8A84A" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="relative max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-14"
            >
              <p className="font-sans text-[10px] sm:text-xs tracking-[0.35em] uppercase text-charcoal-light mb-3">
                Những lời từ trái tim
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal">Lời chúc yêu thương</h2>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-3 mt-5">
                <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-blush-dark/50" />
                <span className="text-blush-dark/60 text-xs">✦</span>
                <span className="text-gold text-lg">♡</span>
                <span className="text-blush-dark/60 text-xs">✦</span>
                <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-blush-dark/50" />
              </div>

              {/* Message count badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-flex items-center gap-2 mt-5 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5"
              >
                <Heart size={11} className="text-gold" fill="currentColor" />
                <span className="font-sans text-[11px] tracking-wider text-charcoal-light">
                  {initialMessages.length} lời chúc yêu thương
                </span>
                <Heart size={11} className="text-gold" fill="currentColor" />
              </motion.div>
            </motion.div>

            <MessageCarousel messages={initialMessages} />
          </div>
        </section>
      )}
    </>
  )
}
