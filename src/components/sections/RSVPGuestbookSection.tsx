'use client'

import { useState, useActionState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  CheckCircle, Loader2, Heart, HeartOff, Sparkles,
  Send, ChevronLeft, ChevronRight, ArrowRight,
} from 'lucide-react'
import { submitAll } from '@/actions/combined'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'
import ScrollReveal from '@/components/ui/ScrollReveal'

const YES_HOVER_LABEL = 'Thật tuyệt vời! ✨'
const NO_HOVER_LABEL = 'Chúng mình sẽ nhớ bạn...'

function AttendanceButton({
  value,
  selected,
  onClick,
}: {
  value: boolean
  selected: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const isYes = value
  const defaultLabel = isYes ? 'Có, tôi sẽ đến' : 'Rất tiếc, tôi bận'
  const hoverLabel = isYes ? YES_HOVER_LABEL : NO_HOVER_LABEL

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      className={`relative flex-1 flex flex-col items-center gap-3 py-6 min-h-[96px] overflow-hidden border transition-colors duration-300 ${selected
        ? isYes
          ? 'bg-gold/10 border-gold text-gold'
          : 'bg-charcoal text-cream border-charcoal'
        : 'bg-transparent border-charcoal/15 text-charcoal-light'
        }`}
    >
      {isYes && hovered && !selected && (
        <motion.div
          initial={{ opacity: 0, x: '-100%' }}
          animate={{ opacity: 1, x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/8 to-transparent pointer-events-none"
        />
      )}
      <AnimatePresence mode="wait">
        {hovered && !selected ? (
          <motion.span key="hovered"
            initial={{ scale: 0.5, opacity: 0, rotate: isYes ? -20 : 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            {isYes
              ? <Sparkles size={22} strokeWidth={1.25} className="text-gold" />
              : <HeartOff size={22} strokeWidth={1.25} className="text-charcoal-light" />
            }
          </motion.span>
        ) : (
          <motion.span key="default"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Heart size={22} strokeWidth={1.25}
              fill={selected ? (isYes ? '#C9A96E' : 'currentColor') : 'none'}
              className={selected && isYes ? 'text-gold' : ''}
            />
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.span
          key={hovered && !selected ? 'hover' : 'default'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="font-sans text-[10px] tracking-widest uppercase text-center leading-relaxed"
        >
          {hovered && !selected ? hoverLabel : defaultLabel}
        </motion.span>
      </AnimatePresence>
      {selected && (
        <motion.div
          layoutId="rsvp-selected"
          className={`absolute bottom-0 left-0 right-0 h-0.5 ${isYes ? 'bg-gold' : 'bg-cream/40'}`}
        />
      )}
    </motion.button>
  )
}

/* ── Message Carousel ── */

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
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col gap-4 bg-white p-4 xs:p-5 sm:p-7 shadow-sm hover:shadow-lg transition-all duration-300 border-l-2 border-blush hover:border-gold rounded-lg"
    >
      <span className="absolute -top-1 right-4 font-serif text-[80px] leading-none text-blush/10 select-none pointer-events-none">"</span>
      <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-blush/30 group-hover:bg-gold/40 transition-colors duration-300" />
      <p className="font-serif italic text-charcoal/75 text-sm sm:text-[15px] leading-[1.8] flex-1 pt-1">
        {msg.message}
      </p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-blush/30 group-hover:bg-gold/30 transition-colors duration-300" />
        <span className="text-blush/40 group-hover:text-gold/50 transition-colors text-xs leading-none">✦</span>
        <div className="flex-1 h-px bg-blush/30 group-hover:bg-gold/30 transition-colors duration-300" />
      </div>
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
              <ArrowRight size={13} />
              <span className="font-sans text-[11px] tracking-[0.15em] uppercase">Vuốt để xem thêm</span>
              <ArrowRight size={13} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button onClick={prev}
            className="w-10 h-10 sm:w-11 sm:h-11 border border-charcoal/15 rounded-full flex items-center justify-center text-charcoal-light hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-200"
            aria-label="Trang trước"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => goTo(i, i > page ? 1 : -1)}
                className={`transition-all duration-300 rounded-full ${i === page ? 'w-5 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-charcoal/15 hover:bg-charcoal/30'}`}
                aria-label={`Trang ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={next}
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

/* ── Main combined section ── */

export default function RSVPGuestbookSection({ initialMessages }: { initialMessages: GuestMessage[] }) {
  const [attending, setAttending] = useState<boolean | null>(null)
  const [state, action, isPending] = useActionState(submitAll, null)

  const submitLabel = attending === false ? 'Xác nhận không tham dự' : 'Xác nhận tham dự'

  return (
    <>
      <SectionWrapper id="rsvp" className="overflow-hidden">
        <div className="bg-charcoal py-3 sm:py-5 px-4 sm:px-10">
          <SectionHeader eyebrow="Xác nhận &amp; Lưu bút" title="Bạn sẽ đến chứ?" dark compact />
        </div>
        <div className="section-padding bg-cream">
          <div className="max-w-lg mx-auto">
            <AnimatePresence mode="wait">
              {state?.success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 sm:py-16"
                >
                  <CheckCircle size={52} className="text-sage mx-auto mb-5" strokeWidth={1} />
                  <h3 className="font-serif text-2xl sm:text-3xl text-charcoal mb-4">Cảm ơn bạn!</h3>
                  <p className="font-sans text-sm text-charcoal-light leading-relaxed px-4">
                    {state.attending
                      ? 'Chúng mình rất vui khi được đón tiếp bạn. Hẹn gặp bạn sớm! ♡'
                      : 'Chúng mình hiểu và trân trọng sự quan tâm của bạn!'}
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  action={action}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-7 sm:space-y-8"
                >
                  <input type="hidden" name="attending" value={String(attending ?? false)} />

                  {/* Attendance */}
                  <ScrollReveal from="down" delay={0} duration={1.2}>
                    <p className="font-sans text-xs tracking-widest uppercase text-charcoal-light mb-4 text-center">
                      Bạn có tham dự không?
                    </p>
                    <div className="flex flex-col xs:flex-row gap-3">
                      <AttendanceButton value={true} selected={attending === true} onClick={() => setAttending(true)} />
                      <AttendanceButton value={false} selected={attending === false} onClick={() => setAttending(false)} />
                    </div>
                  </ScrollReveal>

                  {/* Shared name & phone */}
                  <ScrollReveal from="left" delay={0.18} duration={1.3}>
                    <input className="input-line w-full" name="name" placeholder="Họ và tên" required />
                  </ScrollReveal>
                  <ScrollReveal from="right" delay={0.3} duration={1.3}>
                    <input className="input-line w-full" name="phone" placeholder="Số điện thoại" type="tel" inputMode="tel" />
                  </ScrollReveal>

                  {/* Guest count (RSVP) */}
                  {attending && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="font-sans text-xs tracking-widest uppercase text-charcoal-light block mb-3">
                        Số người tham dự
                      </label>
                      <div className="flex flex-wrap items-center gap-2 xs:gap-3">
                        {[1, 2, 3, 4].map((n) => (
                          <label key={n} className="relative cursor-pointer">
                            <input type="radio" name="guestCount" value={n} defaultChecked={n === 1} className="sr-only peer" />
                            <span className="flex items-center justify-center w-11 h-11 border font-serif text-lg transition-all border-charcoal/30 text-charcoal peer-checked:bg-charcoal peer-checked:text-cream peer-checked:border-charcoal">
                              {n}
                            </span>
                          </label>
                        ))}
                        <span className="font-sans text-xs text-charcoal-light">người</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Divider */}
                  <ScrollReveal from="scale" delay={0.42} duration={1.1}>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-blush/40" />
                      <Heart size={12} className="text-blush flex-shrink-0" fill="currentColor" />
                      <div className="flex-1 h-px bg-blush/40" />
                    </div>
                  </ScrollReveal>

                  {/* Guestbook message */}
                  <ScrollReveal from="up" delay={0.55} duration={1.4}>
                    <textarea
                      className="input-line resize-none w-full"
                      name="message"
                      placeholder="Lời chúc yêu thương"
                      rows={3}
                    />
                  </ScrollReveal>

                  {state?.error && (
                    <p className="font-sans text-sm text-red-500 text-center">{state.error}</p>
                  )}

                  <ScrollReveal from="up" delay={0.7} duration={1.3}>
                    <div className="text-center pt-2">
                      <button
                        type="submit"
                        disabled={isPending || attending === null}
                        className="btn-primary w-full xs:w-auto px-10 disabled:opacity-50"
                      >
                        {isPending
                          ? <><Loader2 size={14} className="animate-spin" /> Đang gửi...</>
                          : <><Send size={13} /> {submitLabel}</>
                        }
                      </button>
                    </div>
                  </ScrollReveal>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </SectionWrapper>

      {/* Hiển thị lời chúc */}
      {initialMessages.length > 0 && (
        <section
          className="relative section-padding overflow-hidden"
          id="guestbook"
          style={{ background: 'linear-gradient(160deg, #F7FCF4 0%, #edf7e8 50%, #F7FCF4 100%)' }}
        >
          {/* Background blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-blush/10 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-sage/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
          </div>

          {/* Corner ornaments */}
          <div className="pointer-events-none absolute top-8 left-8 opacity-15">
            <svg width="52" height="52" viewBox="0 0 60 60" fill="none">
              <path d="M30 5 C30 5 10 15 5 30 C10 45 30 55 30 55 C30 55 50 45 55 30 C50 15 30 5 30 5Z" stroke="#C8A84A" strokeWidth="1" fill="none" />
              <circle cx="30" cy="30" r="4" fill="#C8A84A" />
              <path d="M30 5 L30 55 M5 30 L55 30" stroke="#C8A84A" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="pointer-events-none absolute top-8 right-8 opacity-15 rotate-90">
            <svg width="52" height="52" viewBox="0 0 60 60" fill="none">
              <path d="M30 5 C30 5 10 15 5 30 C10 45 30 55 30 55 C30 55 50 45 55 30 C50 15 30 5 30 5Z" stroke="#C8A84A" strokeWidth="1" fill="none" />
              <circle cx="30" cy="30" r="4" fill="#C8A84A" />
              <path d="M30 5 L30 55 M5 30 L55 30" stroke="#C8A84A" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="pointer-events-none absolute bottom-8 left-8 opacity-15 -rotate-90">
            <svg width="52" height="52" viewBox="0 0 60 60" fill="none">
              <path d="M30 5 C30 5 10 15 5 30 C10 45 30 55 30 55 C30 55 50 45 55 30 C50 15 30 5 30 5Z" stroke="#C8A84A" strokeWidth="1" fill="none" />
              <circle cx="30" cy="30" r="4" fill="#C8A84A" />
              <path d="M30 5 L30 55 M5 30 L55 30" stroke="#C8A84A" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="pointer-events-none absolute bottom-8 right-8 opacity-15 rotate-180">
            <svg width="52" height="52" viewBox="0 0 60 60" fill="none">
              <path d="M30 5 C30 5 10 15 5 30 C10 45 30 55 30 55 C30 55 50 45 55 30 C50 15 30 5 30 5Z" stroke="#C8A84A" strokeWidth="1" fill="none" />
              <circle cx="30" cy="30" r="4" fill="#C8A84A" />
              <path d="M30 5 L30 55 M5 30 L55 30" stroke="#C8A84A" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="relative max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <ScrollReveal from="down" delay={0} duration={1.2}>
                <p className="font-sans text-[10px] sm:text-xs tracking-[0.35em] uppercase text-charcoal-light mb-3">
                  Những lời từ trái tim
                </p>
              </ScrollReveal>
              <ScrollReveal from="up" delay={0.15} duration={1.5}>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal">Lời chúc yêu thương</h2>
              </ScrollReveal>
              <ScrollReveal from="scale" delay={0.35} duration={1.1}>
                <div className="flex items-center justify-center gap-3 mt-5">
                  <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-blush-dark/50" />
                  <span className="text-blush-dark/60 text-xs">✦</span>
                  <span className="text-gold text-lg">♡</span>
                  <span className="text-blush-dark/60 text-xs">✦</span>
                  <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-blush-dark/50" />
                </div>
              </ScrollReveal>
              <ScrollReveal from="up" delay={0.5} duration={1.1}>
                <div className="inline-flex items-center gap-2 mt-5 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5">
                  <Heart size={11} className="text-gold" fill="currentColor" />
                  <span className="font-sans text-[11px] tracking-wider text-charcoal-light">
                    {initialMessages.length} lời chúc yêu thương
                  </span>
                  <Heart size={11} className="text-gold" fill="currentColor" />
                </div>
              </ScrollReveal>
            </div>

            <MessageCarousel messages={initialMessages} />
          </div>
        </section>
      )}
    </>
  )
}
