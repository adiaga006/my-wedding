'use client'

import { useActionState, useOptimistic } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle, Loader2, Heart } from 'lucide-react'
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
  const [optimisticMessages, addOptimistic] = useOptimistic(
    initialMessages,
    (current, newMsg: GuestMessage) => [newMsg, ...current]
  )

  const [state, action, isPending] = useActionState(
    async (prevState: Awaited<ReturnType<typeof submitGuestbook>>, formData: FormData) => {
      const authorName = formData.get('authorName') as string
      const message = formData.get('message') as string
      // Hiển thị optimistic ngay lập tức
      addOptimistic({ _id: `temp-${Date.now()}`, authorName, message, submittedAt: new Date().toISOString() })
      return submitGuestbook(prevState, formData)
    },
    null
  )

  return (
    <SectionWrapper id="guestbook" className="section-padding bg-charcoal">
      <SectionHeader eyebrow="Gửi lời yêu thương" title="Sổ lưu bút" />

      {/* Form */}
      <div className="max-w-lg mx-auto mb-16 sm:mb-20">
        <AnimatePresence mode="wait">
          {state?.success ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10"
            >
              <CheckCircle size={40} className="text-sage mx-auto mb-4" strokeWidth={1} />
              <p className="font-serif italic text-cream/70 text-lg">Cảm ơn lời chúc của bạn! ♡</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              action={action}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
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
              {state?.error && <p className="text-red-400 text-xs font-sans">{state.error}</p>}
              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary bg-blush border-blush text-charcoal hover:bg-blush-dark hover:border-blush-dark w-full xs:w-auto px-10"
                >
                  {isPending
                    ? <><Loader2 size={14} className="animate-spin" /> Đang gửi...</>
                    : <><Heart size={14} /> Gửi lời chúc</>}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Messages wall */}
      {optimisticMessages.length > 0 && (
        <div className="max-w-5xl mx-auto [column-count:1] sm:[column-count:2] lg:[column-count:3] [column-gap:16px]">
          {optimisticMessages.map((msg, i) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i < 3 ? i * 0.06 : 0 }}
              className="break-inside-avoid mb-4 bg-white/5 border border-white/10 p-5 sm:p-6 hover:border-blush/25 transition-colors duration-300"
            >
              <p className="font-serif italic text-cream/80 text-sm leading-relaxed mb-4">
                &ldquo;{msg.message}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <p className="font-sans text-xs tracking-wider text-gold">{msg.authorName}</p>
                <Heart size={11} className="text-blush/40 flex-shrink-0" fill="currentColor" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
