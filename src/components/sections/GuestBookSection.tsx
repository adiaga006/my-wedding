'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader2, Heart } from 'lucide-react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'

interface GuestMessage {
  _id: string
  authorName: string
  message: string
  submittedAt: string
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function GuestBookSection({ initialMessages }: { initialMessages: GuestMessage[] }) {
  const [messages, setMessages] = useState(initialMessages)
  const [formState, setFormState] = useState<FormState>('idle')
  const [form, setForm] = useState({ authorName: '', message: '' })
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessages((prev) => [{
        _id: Date.now().toString(),
        authorName: form.authorName,
        message: form.message,
        submittedAt: new Date().toISOString(),
      }, ...prev])
      setForm({ authorName: '', message: '' })
      setFormState('success')
      setTimeout(() => setFormState('idle'), 3000)
    } catch (err: unknown) {
      setFormState('error')
      setErrorMsg(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    }
  }

  return (
    <SectionWrapper id="guestbook" className="section-padding bg-charcoal">
      <SectionHeader eyebrow="Gửi lời yêu thương" title="Sổ lưu bút" />

      {/* Form */}
      <div className="max-w-lg mx-auto mb-16 sm:mb-20">
        <AnimatePresence mode="wait">
          {formState === 'success' ? (
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
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <input
                className="input-line-dark"
                placeholder="Tên bạn *"
                value={form.authorName}
                onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
                required
              />
              <textarea
                className="input-line-dark resize-none"
                placeholder="Lời chúc gửi đến Duy & Chi *"
                rows={4}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
              />
              {errorMsg && <p className="text-red-400 text-xs font-sans">{errorMsg}</p>}
              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={formState === 'loading'}
                  className="btn-primary bg-blush border-blush text-charcoal hover:bg-blush-dark hover:border-blush-dark w-full xs:w-auto px-10"
                >
                  {formState === 'loading'
                    ? <><Loader2 size={14} className="animate-spin" /> Đang gửi...</>
                    : <><Heart size={14} /> Gửi lời chúc</>}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Messages wall — 1 col mobile, 2 col sm, 3 col lg */}
      {messages.length > 0 && (
        <div className="max-w-5xl mx-auto [column-count:1] sm:[column-count:2] lg:[column-count:3] [column-gap:16px]">
          {messages.map((msg, i) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 9) * 0.04 }}
              className="break-inside-avoid mb-4 bg-white/5 border border-white/10 p-5 sm:p-6 hover:border-blush/25 transition-colors duration-300"
            >
              <p className="font-serif italic text-cream/80 text-sm sm:text-sm leading-relaxed mb-4">
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
