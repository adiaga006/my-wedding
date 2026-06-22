'use client'

import { useActionState, useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle, Loader2, Send, ChevronLeft, ChevronRight } from 'lucide-react'
import { submitGuestbook } from '@/actions/guestbook'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'

interface GuestMessage {
  _id: string
  authorName: string
  message: string
  submittedAt: string
}

const ITEMS_PER_PAGE = 6 // 2 hàng × 3 cột

function MessageCard({ msg, index }: { msg: GuestMessage; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group relative bg-white border border-blush/20 p-6 sm:p-7 hover:border-blush/50 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
    >
      {/* Quote decoration */}
      <span className="absolute top-4 right-5 text-5xl leading-none text-blush/20 select-none font-serif" aria-hidden>
        &ldquo;
      </span>

      {/* Message */}
      <p className="font-serif italic text-charcoal/80 text-sm sm:text-[15px] leading-relaxed flex-1 relative z-10 mb-5">
        {msg.message}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-3 pt-4 border-t border-blush/15">
        <div className="w-8 h-8 rounded-full bg-blush/25 flex items-center justify-center flex-shrink-0">
          <span className="font-serif text-sm text-charcoal/60">
            {msg.authorName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-sans text-xs font-semibold tracking-wide text-charcoal truncate">
            {msg.authorName}
          </p>
          <p className="font-sans text-[10px] text-charcoal-light mt-0.5">
            {new Date(msg.submittedAt).toLocaleDateString('vi-VN', {
              day: 'numeric', month: 'long', year: 'numeric',
              timeZone: 'Asia/Ho_Chi_Minh',
            })}
          </p>
        </div>
        <div className="ml-auto h-px w-6 bg-gold/40 group-hover:w-10 transition-all duration-300 flex-shrink-0" />
      </div>

      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-blush/25 group-hover:border-gold/40 transition-colors duration-300" />
    </motion.div>
  )
}

function MessageCarousel({ messages }: { messages: GuestMessage[] }) {
  const totalPages = Math.ceil(messages.length / ITEMS_PER_PAGE)
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragStartX = useRef(0)

  const goTo = useCallback((next: number, direction: number) => {
    setDir(direction)
    setPage(next)
  }, [])

  const next = useCallback(() => {
    goTo((page + 1) % totalPages, 1)
  }, [page, totalPages, goTo])

  const prev = useCallback(() => {
    goTo((page - 1 + totalPages) % totalPages, -1)
  }, [page, totalPages, goTo])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(next, 3000)
  }, [next])

  useEffect(() => {
    if (totalPages <= 1) return
    resetTimer()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [page, totalPages, resetTimer])

  const handleUserNav = (fn: () => void) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    fn()
  }

  const currentItems = messages.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <div className="relative">
      {/* Slide area */}
      <div className="overflow-hidden">
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={page}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            drag={totalPages > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragStart={(_, info) => { dragStartX.current = info.point.x }}
            onDragEnd={(_, info) => {
              const dx = info.point.x - dragStartX.current
              if (Math.abs(dx) > 50) {
                handleUserNav(dx < 0 ? next : prev)
              } else {
                resetTimer()
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 cursor-grab active:cursor-grabbing"
          >
            {currentItems.map((msg, i) => (
              <MessageCard key={msg._id} msg={msg} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-5 mt-10">
          {/* Prev */}
          <button
            onClick={() => handleUserNav(prev)}
            className="w-10 h-10 border border-charcoal/20 flex items-center justify-center text-charcoal-light hover:border-gold hover:text-gold transition-all duration-200"
            aria-label="Trang trước"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handleUserNav(() => goTo(i, i > page ? 1 : -1))}
                className={`transition-all duration-300 rounded-full ${
                  i === page ? 'w-6 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-charcoal/20 hover:bg-charcoal/40'
                }`}
                aria-label={`Trang ${i + 1}`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => handleUserNav(next)}
            className="w-10 h-10 border border-charcoal/20 flex items-center justify-center text-charcoal-light hover:border-gold hover:text-gold transition-all duration-200"
            aria-label="Trang tiếp"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Progress bar auto-play */}
      {totalPages > 1 && (
        <div className="mt-4 h-px bg-charcoal/10 overflow-hidden max-w-xs mx-auto">
          <motion.div
            key={page}
            className="h-full bg-gold/60"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: 'linear' }}
          />
        </div>
      )}
    </div>
  )
}

export default function GuestBookSection({ initialMessages }: { initialMessages: GuestMessage[] }) {
  const [state, action, isPending] = useActionState(submitGuestbook, null)

  return (
    <>
      {/* Form section — dark */}
      <SectionWrapper id="guestbook" className="section-padding bg-charcoal">
        <SectionHeader eyebrow="Gửi lời yêu thương" title="Sổ lưu bút" dark />

        <div className="max-w-lg mx-auto">
          {state?.success ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10"
            >
              <CheckCircle size={40} className="text-sage mx-auto mb-4" strokeWidth={1} />
              <p className="font-serif italic text-cream/80 text-lg mb-1">Cảm ơn lời chúc của bạn!</p>
              <p className="font-sans text-xs tracking-wider text-cream/40">Lời chúc sẽ được hiển thị sau khi được duyệt ♡</p>
            </motion.div>
          ) : (
            <form action={action} className="space-y-6">
              <input className="input-line-dark" name="authorName" placeholder="Tên bạn *" required />
              <textarea className="input-line-dark resize-none" name="message" placeholder="Lời chúc gửi đến Duy & Chi *" rows={4} required />
              {state?.error && <p className="text-red-400 text-xs font-sans">{state.error}</p>}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary bg-transparent border-blush/60 text-blush hover:bg-blush hover:text-charcoal hover:border-blush px-8"
                >
                  {isPending
                    ? <><Loader2 size={13} className="animate-spin" /> Đang gửi...</>
                    : <><Send size={13} /> Gửi lời chúc</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </SectionWrapper>

      {/* Messages section — cream */}
      {initialMessages.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-14 sm:mb-16"
            >
              <p className="font-sans text-[10px] sm:text-xs tracking-[0.35em] uppercase text-charcoal-light mb-3">
                Những lời từ trái tim
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal">
                Lời chúc yêu thương
              </h2>
              <div className="flex items-center justify-center gap-4 mt-5">
                <div className="h-px w-12 bg-blush" />
                <span className="text-gold text-lg">♡</span>
                <div className="h-px w-12 bg-blush" />
              </div>
            </motion.div>

            <MessageCarousel messages={initialMessages} />

            {/* Total count */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center font-serif italic text-charcoal text-base sm:text-xl mt-12"
            >
              {initialMessages.length} lời chúc yêu thương ♡
            </motion.p>
          </div>
        </section>
      )}
    </>
  )
}
