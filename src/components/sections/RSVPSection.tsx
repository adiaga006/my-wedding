'use client'

import { useState, useActionState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle, Loader2, Heart, HeartOff } from 'lucide-react'
import { submitRSVP } from '@/actions/rsvp'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'

export default function RSVPSection() {
  const [attending, setAttending] = useState<boolean | null>(null)
  const [state, action, isPending] = useActionState(submitRSVP, null)

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

              {/* Attending choice — elegant minimal */}
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-charcoal-light mb-4 text-center">
                  Bạn có tham dự không?
                </p>
                <div className="flex flex-col xs:flex-row gap-3">
                  {[
                    { label: 'Có, tôi sẽ đến', value: true,  Icon: Heart },
                    { label: 'Rất tiếc, tôi bận', value: false, Icon: HeartOff },
                  ].map(({ label, value, Icon }) => (
                    <button
                      key={String(value)}
                      type="button"
                      onClick={() => setAttending(value)}
                      className={`flex-1 flex flex-col items-center gap-2 py-5 min-h-[80px] font-sans text-[10px] tracking-widest uppercase border transition-all duration-300 ${
                        attending === value
                          ? 'bg-charcoal text-cream border-charcoal'
                          : 'bg-transparent text-charcoal-light border-charcoal/20 hover:border-charcoal/50 hover:text-charcoal'
                      }`}
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.25}
                        fill={attending === value ? 'currentColor' : 'none'}
                        className="transition-all duration-300"
                      />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <input className="input-line" name="name" placeholder="Họ và tên *" required />
              <input className="input-line" name="phone" placeholder="Số điện thoại" type="tel" inputMode="tel" />

              {attending && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="font-sans text-xs tracking-widest uppercase text-charcoal-light block mb-3">
                    Số người tham dự
                  </label>
                  <div className="flex items-center gap-3">
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
                  {isPending ? <><Loader2 size={14} className="animate-spin" /> Đang gửi...</> : 'Xác nhận tham dự'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  )
}
