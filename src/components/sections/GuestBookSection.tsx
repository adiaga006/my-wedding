'use client'

import { useActionState, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle, Loader2, Send, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { submitGuestbook } from '@/actions/guestbook'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'

interface GuestMessage {
  _id: string
  authorName: string
  message: string
  submittedAt: string
}

const ITEMS_PER_PAGE = 6

function MessageCard({ msg, index }: { msg: GuestMessage; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative flex flex-col gap-4 bg-white p-4 xs:p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow duration-300 border-l-2 border-blush hover:border-gold rounded-lg"
    >
      {/* Faint giant quote */}
      <span className="absolute -top-1 right-4 font-serif text-[80px] leading-none text-blush/10 select-none pointer-events-none">
        "
      </span>

      {/* Message */}
      <p className="font-serif italic text-charcoal/75 text-sm sm:text-[15px] leading-[1.8] flex-1">
        {msg.message}
      </p>

      {/* Divider */}
      <div className="h-px bg-blush/30 group-hover:bg-gold/30 transition-colors duration-300" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blush to-blush-dark flex items-center justify-center flex-shrink-0">
          <span className="font-serif text-xs text-white font-medium">
            {msg.authorName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-sans text-xs font-semibold text-charcoal tracking-wide">
            {msg.authorName}
          </p>
          <p className="font-sans text-[10px] text-charcoal-light leading-none mt-0.5">
            {new Date(msg.submittedAt).toLocaleDateString('vi-VN', {
              day: 'numeric', month: 'long', year: 'numeric',
              timeZone: 'Asia/Ho_Chi_Minh',
            })}
          </p>
        </div>
        <span className="ml-auto text-blush/40 group-hover:text-gold/50 transition-colors text-base leading-none">♡</span>
      </div>
    </motion.div>
  )
}

function MessageCarousel({ messages }: { messages: GuestMessage[] }) {
  const totalPages = Math.ceil(messages.length / ITEMS_PER_PAGE)
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)
  const dragStartX = useRef(0)

  const goTo = useCallback((next: number, direction: number) => {
    setDir(direction)
    setPage(next)
  }, [])

  const next = useCallback(() => goTo((page + 1) % totalPages, 1), [page, totalPages, goTo])
  const prev = useCallback(() => goTo((page - 1 + totalPages) % totalPages, -1), [page, totalPages, goTo])

  const currentItems = messages.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

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
            dragElastic={0.1}
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="w-11 h-11 border border-charcoal/15 flex items-center justify-center text-charcoal-light hover:border-gold hover:text-gold transition-all duration-200"
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
            className="w-11 h-11 border border-charcoal/15 flex items-center justify-center text-charcoal-light hover:border-gold hover:text-gold transition-all duration-200"
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
          <SectionHeader eyebrow="Gửi lời yêu thương" title="Sổ lưu bút" dark icon={<Heart size={36} strokeWidth={1.4} />}  compact />
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
        </div>{/* end section-padding */}
      </SectionWrapper>

      {initialMessages.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              className="text-center mb-14"
            >
              <p className="font-sans text-[10px] sm:text-xs tracking-[0.35em] uppercase text-charcoal-light mb-3">
                Những lời từ trái tim
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal">Lời chúc yêu thương</h2>
              <div className="flex items-center justify-center gap-4 mt-5">
                <div className="h-px w-12 bg-blush" />
                <span className="text-gold text-lg">♡</span>
                <div className="h-px w-12 bg-blush" />
              </div>
            </motion.div>

            <MessageCarousel messages={initialMessages} />

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              className="text-center font-serif italic text-charcoal text-lg sm:text-2xl mt-12"
            >
              {initialMessages.length} lời chúc yêu thương ♡
            </motion.p>
          </div>
        </section>
      )}
    </>
  )
}
