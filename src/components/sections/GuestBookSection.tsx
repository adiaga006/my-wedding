'use client'

import { useActionState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle, Loader2, Send } from 'lucide-react'
import { submitGuestbook } from '@/actions/guestbook'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'

interface GuestMessage {
  _id: string
  authorName: string
  message: string
  submittedAt: string
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
              <input
                className="input-line-dark"
                name="authorName"
                placeholder="Tên bạn *"
                required
              />
              <textarea
                className="input-line-dark resize-none"
                name="message"
                placeholder="Lời chúc gửi đến Duy & Chi *"
                rows={4}
                required
              />
              {state?.error && (
                <p className="text-red-400 text-xs font-sans">{state.error}</p>
              )}
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

      {/* Messages display section — cream */}
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

            {/* Masonry grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
              {initialMessages.map((msg, i) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                  className="break-inside-avoid mb-5"
                >
                  <div className="group relative bg-white border border-blush/20 p-7 sm:p-8 hover:border-blush/50 hover:shadow-lg transition-all duration-400">
                    {/* Decorative quote mark */}
                    <span
                      className="absolute top-4 right-5 text-5xl leading-none text-blush/20 select-none font-serif"
                      aria-hidden="true"
                    >
                      &ldquo;
                    </span>

                    {/* Message */}
                    <p className="font-serif italic text-charcoal/80 text-[15px] sm:text-base leading-relaxed mb-6 relative z-10">
                      {msg.message}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-3">
                      {/* Avatar initial */}
                      <div className="w-8 h-8 rounded-full bg-blush/30 flex items-center justify-center flex-shrink-0">
                        <span className="font-serif text-sm text-charcoal/60">
                          {msg.authorName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-sans text-xs font-medium tracking-wider text-charcoal uppercase">
                          {msg.authorName}
                        </p>
                        <p className="font-sans text-[10px] text-charcoal-light mt-0.5">
                          {new Date(msg.submittedAt).toLocaleDateString('vi-VN', {
                            day: 'numeric', month: 'long', year: 'numeric',
                            timeZone: 'Asia/Ho_Chi_Minh',
                          })}
                        </p>
                      </div>
                      {/* Gold accent line */}
                      <div className="ml-auto h-px w-8 bg-gold/40 group-hover:w-14 transition-all duration-400" />
                    </div>

                    {/* Bottom left corner accent */}
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blush/30 group-hover:border-gold/40 transition-colors duration-400" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom ornament */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-center mt-12"
            >
              <p className="font-serif italic text-charcoal-light text-sm">
                {initialMessages.length} lời chúc yêu thương ♡
              </p>
            </motion.div>
          </div>
        </section>
      )}
    </>
  )
}
