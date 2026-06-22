'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader2 } from 'lucide-react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function RSVPSection() {
  const [attending, setAttending] = useState<boolean | null>(null)
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', guestCount: '1', note: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (attending === null) { setErrorMsg('Vui lòng chọn bạn có tham dự không'); return }
    setFormState('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, attending }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setFormState('success')
    } catch (err: unknown) {
      setFormState('error')
      setErrorMsg(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    }
  }

  return (
    <SectionWrapper id="rsvp" className="section-padding bg-cream">
      <SectionHeader eyebrow="Xác nhận tham dự" title="Bạn sẽ đến chứ?" />

      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {formState === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 sm:py-16"
            >
              <CheckCircle size={52} className="text-sage mx-auto mb-5" strokeWidth={1} />
              <h3 className="font-serif text-2xl sm:text-3xl text-charcoal mb-4">Cảm ơn bạn!</h3>
              <p className="font-sans text-sm text-charcoal-light leading-relaxed px-4">
                {attending
                  ? 'Chúng tôi rất vui khi được đón tiếp bạn. Hẹn gặp bạn sớm! ♡'
                  : 'Chúng tôi hiểu và trân trọng sự quan tâm của bạn!'}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-7 sm:space-y-8"
            >
              {/* Attending choice — stack trên xs, row trên sm+ */}
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-charcoal-light mb-4 text-center">
                  Bạn có tham dự không?
                </p>
                <div className="flex flex-col xs:flex-row gap-3">
                  {[
                    { label: '✅ Có, tôi sẽ đến', value: true },
                    { label: '❌ Tiếc quá, tôi bận', value: false },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setAttending(opt.value)}
                      className={`flex-1 py-3 min-h-[48px] font-sans text-sm border transition-all duration-200 ${
                        attending === opt.value
                          ? 'bg-charcoal text-cream border-charcoal'
                          : 'bg-transparent text-charcoal border-charcoal/30 hover:border-charcoal/60 active:bg-charcoal/5'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <input
                className="input-line"
                placeholder="Họ và tên *"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />

              <input
                className="input-line"
                placeholder="Số điện thoại *"
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
              />

              {attending && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="font-sans text-xs tracking-widest uppercase text-charcoal-light block mb-3">
                    Số người tham dự
                  </label>
                  {/* Touch-friendly số người — min 44px */}
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, guestCount: String(n) }))}
                        className={`w-11 h-11 border font-serif text-lg transition-all ${
                          form.guestCount === String(n)
                            ? 'bg-charcoal text-cream border-charcoal'
                            : 'border-charcoal/30 text-charcoal hover:border-charcoal/60 active:bg-charcoal/5'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <span className="font-sans text-xs text-charcoal-light ml-1">người</span>
                  </div>
                </motion.div>
              )}

              <textarea
                className="input-line resize-none"
                placeholder="Ghi chú (không bắt buộc)"
                rows={3}
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              />

              {errorMsg && (
                <p className="font-sans text-sm text-red-500 text-center">{errorMsg}</p>
              )}

              <div className="text-center pt-2">
                <button type="submit" disabled={formState === 'loading'} className="btn-primary w-full xs:w-auto px-10">
                  {formState === 'loading'
                    ? <><Loader2 size={14} className="animate-spin" /> Đang gửi...</>
                    : 'Xác nhận tham dự'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  )
}
