'use client'

import { useState, useActionState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle, Loader2, Heart, HeartOff, Sparkles } from 'lucide-react'
import { submitRSVP } from '@/actions/rsvp'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'

const YES_HOVER_LABEL = 'Thật tuyệt vời! ✨'
const NO_HOVER_LABEL  = 'Chúng tôi sẽ nhớ bạn...'

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
  const hoverLabel   = isYes ? YES_HOVER_LABEL : NO_HOVER_LABEL

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      className={`relative flex-1 flex flex-col items-center gap-3 py-6 min-h-[96px] overflow-hidden border transition-colors duration-300 ${
        selected
          ? isYes
            ? 'bg-gold/10 border-gold text-gold'
            : 'bg-charcoal text-cream border-charcoal'
          : 'bg-transparent border-charcoal/15 text-charcoal-light'
      }`}
    >
      {/* Shimmer on hover (yes only) */}
      {isYes && hovered && !selected && (
        <motion.div
          initial={{ opacity: 0, x: '-100%' }}
          animate={{ opacity: 1, x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/8 to-transparent pointer-events-none"
        />
      )}

      {/* Icon */}
      <AnimatePresence mode="wait">
        {hovered && !selected ? (
          <motion.span
            key="hovered"
            initial={{ scale: 0.5, opacity: 0, rotate: isYes ? -20 : 0 }}
            animate={{ scale: 1,   opacity: 1, rotate: 0 }}
            exit={{   scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            {isYes
              ? <Sparkles size={22} strokeWidth={1.25} className="text-gold" />
              : <HeartOff size={22} strokeWidth={1.25} className="text-charcoal-light" />
            }
          </motion.span>
        ) : (
          <motion.span
            key="default"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            exit={{   scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Heart
              size={22}
              strokeWidth={1.25}
              fill={selected ? (isYes ? '#C9A96E' : 'currentColor') : 'none'}
              className={selected && isYes ? 'text-gold' : ''}
            />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={hovered && !selected ? 'hover' : 'default'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{   opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="font-sans text-[10px] tracking-widest uppercase text-center leading-relaxed"
        >
          {hovered && !selected ? hoverLabel : defaultLabel}
        </motion.span>
      </AnimatePresence>

      {/* Selected underline */}
      {selected && (
        <motion.div
          layoutId="rsvp-selected"
          className={`absolute bottom-0 left-0 right-0 h-0.5 ${isYes ? 'bg-gold' : 'bg-cream/40'}`}
        />
      )}
    </motion.button>
  )
}

export default function RSVPSection() {
  const [attending, setAttending] = useState<boolean | null>(null)
  const [state, action, isPending] = useActionState(submitRSVP, null)

  const submitLabel = attending === false ? 'Xác nhận không tham dự' : 'Xác nhận tham dự'

  return (
    <SectionWrapper id="rsvp" className="section-padding bg-cream">
      <SectionHeader eyebrow="Xác nhận tham dự" title="Bạn sẽ đến chứ?" />

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
                  ? 'Chúng tôi rất vui khi được đón tiếp bạn. Hẹn gặp bạn sớm! ♡'
                  : 'Chúng tôi hiểu và trân trọng sự quan tâm của bạn!'}
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

              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-charcoal-light mb-4 text-center">
                  Bạn có tham dự không?
                </p>
                <div className="flex flex-col xs:flex-row gap-3">
                  <AttendanceButton value={true}  selected={attending === true}  onClick={() => setAttending(true)} />
                  <AttendanceButton value={false} selected={attending === false} onClick={() => setAttending(false)} />
                </div>
              </div>

              <input className="input-line" name="name" placeholder="Họ và tên *" required />
              <input className="input-line" name="phone" placeholder="Số điện thoại" type="tel" inputMode="tel" />

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

              <textarea className="input-line resize-none" name="note" placeholder="Ghi chú (không bắt buộc)" rows={3} />

              {state?.error && (
                <p className="font-sans text-sm text-red-500 text-center">{state.error}</p>
              )}

              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={isPending || attending === null}
                  className="btn-primary w-full xs:w-auto px-10 disabled:opacity-50"
                >
                  {isPending
                    ? <><Loader2 size={14} className="animate-spin" /> Đang gửi...</>
                    : submitLabel}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  )
}
