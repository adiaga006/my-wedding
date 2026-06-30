'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { Copy, CheckCheck, Gift, X, ZoomIn, ChevronDown } from 'lucide-react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { urlFor } from '@/sanity/lib/image'

interface BankAccount {
  _id: string
  label?: string
  owner: string
  bankName: string
  accountNumber: string
  accountName: string
  qrCode?: { asset: { _ref: string } }
}

/* ── Pháo hoa & pháo giấy ── */
const CONFETTI_COLORS = ['#FFD700', '#F9A8D4', '#82CC6A', '#FFFFFF', '#C8A84A', '#FFA500', '#FF6B9D', '#A78BFA']

type ConfettiPiece = {
  id: number
  x: number
  color: string
  size: number
  delay: number
  duration: number
  rotate: number
  shape: 'rect' | 'circle' | 'ribbon'
  drift: number
}

function ConfettiEffect({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (!active) { setPieces([]); return }
    setPieces(
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        x: 5 + Math.random() * 90,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 6 + Math.random() * 8,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.8,
        rotate: Math.random() * 720 - 360,
        shape: (['rect', 'circle', 'ribbon'] as const)[i % 3],
        drift: (Math.random() - 0.5) * 80,
      }))
    )
  }, [active])

  if (!active || pieces.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -p.size - 5,
            width: p.shape === 'ribbon' ? p.size * 0.4 : p.size,
            height: p.shape === 'ribbon' ? p.size * 2.5 : p.size,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'rect' ? '2px' : '1px',
            backgroundColor: p.color,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.drift],
            rotate: [0, p.rotate],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
            opacity: { times: [0, 0.1, 0.8, 1] },
          }}
        />
      ))}

      {/* Mini fireworks bursts */}
      {[
        { x: 20, y: 15 }, { x: 50, y: 10 }, { x: 80, y: 18 },
        { x: 35, y: 25 }, { x: 65, y: 12 },
      ].map((pos, fi) =>
        Array.from({ length: 10 }, (_, i) => {
          const angle = (i / 10) * 360
          const dist = 30 + Math.random() * 25
          const rad = (angle * Math.PI) / 180
          return (
            <motion.div
              key={`fw-${fi}-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${pos.x}%`, top: `${pos.y}%`,
                width: 4, height: 4,
                background: CONFETTI_COLORS[(fi * 3 + i) % CONFETTI_COLORS.length],
                marginLeft: -2, marginTop: -2,
              }}
              animate={{
                x: [0, Math.cos(rad) * dist],
                y: [0, Math.sin(rad) * dist + 15],
                opacity: [0, 1, 0],
                scale: [0, 1.4, 0],
              }}
              transition={{
                duration: 1.0,
                delay: 0.05 + fi * 0.12 + i * 0.02,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          )
        })
      )}
    </div>
  )
}

/* ── QR Zoom Modal ── */
function QrModal({ src, owner, onClose }: { src: string; owner: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-5 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.82, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative bg-white rounded-2xl shadow-2xl p-5 w-full max-w-[320px] sm:max-w-sm"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-cream hover:bg-blush/30 text-charcoal-light transition-colors"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>
        <p className="font-serif text-charcoal text-center text-lg mb-4 pr-8">{owner}</p>
        <div className="w-full aspect-square">
          <Image src={src} alt={`QR ${owner}`} width={600} height={600} className="w-full h-full object-contain" />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Account Card ── */
function AccountCard({
  account, index, compact, onZoom,
}: {
  account: BankAccount
  index: number
  compact?: boolean
  onZoom: (src: string, owner: string) => void
}) {
  const [copied, setCopied] = useState(false)

  const copyAccount = () => {
    navigator.clipboard.writeText(account.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const qrSrc = account.qrCode ? urlFor(account.qrCode).width(800).url() : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white border border-blush/20 text-center flex flex-col"
    >
      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className={`flex flex-col flex-1 ${compact ? 'px-3 xs:px-4 pt-5 pb-4' : 'px-5 xs:px-7 sm:px-10 pt-7 pb-6 sm:pt-10 sm:pb-8'}`}>
        {account.label && (
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold text-center mb-1">
            {account.label}
          </p>
        )}
        <p className={`font-serif text-charcoal text-center mb-4 ${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'}`}>
          {account.owner}
        </p>
        {qrSrc && (
          <div
            className="relative w-full aspect-square mb-4 bg-white cursor-zoom-in group/qr overflow-hidden"
            onClick={() => onZoom(qrSrc, account.owner)}
          >
            <Image
              src={qrSrc}
              alt={`QR ${account.owner}`}
              fill
              className="object-contain p-1 transition-transform duration-300 group-hover/qr:scale-[1.04]"
              sizes={compact ? '45vw' : '(max-width: 640px) 90vw, 320px'}
            />
            <div className="absolute inset-0 border-2 border-gold/0 group-hover/qr:border-gold/50 transition-colors duration-300 pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-black/30 backdrop-blur-[2px] rounded-full p-2.5">
                <ZoomIn size={18} className="text-white" />
              </div>
            </div>
          </div>
        )}
        <button
          onClick={copyAccount}
          className="flex items-center justify-center gap-2 bg-cream w-full py-3 min-h-[44px] hover:bg-blush/20 active:bg-blush/30 transition-colors"
          aria-label="Sao chép số tài khoản"
        >
          <span className={`font-sans font-medium tracking-widest text-charcoal tabular-nums ${compact ? 'text-xs' : 'text-sm'}`}>
            {account.accountNumber}
          </span>
          {copied
            ? <CheckCheck size={13} className="text-sage flex-shrink-0" />
            : <Copy size={13} className="text-charcoal-light flex-shrink-0" />}
        </button>
        {copied && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-xs text-sage text-center mt-1.5"
          >
            Đã sao chép!
          </motion.p>
        )}
        <div className="mt-3 text-center space-y-0.5">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold">{account.bankName}</p>
          <p className="font-sans text-xs text-charcoal-light">{account.accountName}</p>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Section ── */
export default function GiftSection({ accounts }: { accounts: BankAccount[] }) {
  const isPair = accounts.length === 2
  const [zoomed, setZoomed] = useState<{ src: string; owner: string } | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3500)
  }

  return (
    <SectionWrapper id="gift" className="overflow-hidden">
      <div className="bg-charcoal py-3 sm:py-5 px-4 sm:px-10">
        <SectionHeader eyebrow="Hộp quà cưới" title="Mừng cưới" ornament="♡" icon={<Gift size={36} strokeWidth={1.4} />} dark compact />
      </div>
      <div className="section-padding bg-blush/10 relative">

        <ConfettiEffect active={showConfetti} />

        <ScrollReveal from="up" delay={0} duration={1.5} className="text-center max-w-sm sm:max-w-lg mx-auto mb-10 sm:mb-12 px-4">
          <p className="font-serif italic text-charcoal-light text-base sm:text-lg leading-relaxed">
            Sự hiện diện của bạn là món quà ý nghĩa nhất. Nếu bạn muốn gửi thêm tình cảm,
            chúng mình xin trân trọng đón nhận ♡
          </p>
        </ScrollReveal>

        {/* Toggle button */}
        {!isOpen && (
          <ScrollReveal from="scale" delay={0.2} duration={1.2} className="flex justify-center mb-4">
            <motion.button
              onClick={handleOpen}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary px-10 py-3 flex items-center gap-3 text-sm tracking-widest"
            >
              <Gift size={16} />
              Gửi quà mừng cưới
              <ChevronDown size={16} />
            </motion.button>
          </ScrollReveal>
        )}

        {/* Gift content — ẩn cho đến khi mở */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {accounts.length === 0 ? (
                <div className="text-center py-8">
                  <Gift size={40} className="text-blush mx-auto mb-4" strokeWidth={1} />
                  <p className="font-serif italic text-charcoal-light">Thông tin sẽ được cập nhật sớm</p>
                </div>
              ) : isPair ? (
                <div className="max-w-2xl mx-auto">
                  <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
                    {accounts.map((acc, i) => (
                      <AccountCard
                        key={acc._id} account={acc} index={i} compact
                        onZoom={(src, owner) => setZoomed({ src, owner })}
                      />
                    ))}
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center font-serif italic text-charcoal-light text-sm sm:text-base mt-8"
                  >
                    Chú rể &amp; Cô dâu ♡
                  </motion.p>
                </div>
              ) : (
                <div className={`mx-auto grid gap-5 sm:gap-8 ${accounts.length === 1
                  ? 'max-w-xs grid-cols-1'
                  : 'max-w-3xl grid-cols-1 sm:grid-cols-2'
                }`}>
                  {accounts.map((acc, i) => (
                    <AccountCard
                      key={acc._id} account={acc} index={i}
                      onZoom={(src, owner) => setZoomed({ src, owner })}
                    />
                  ))}
                </div>
              )}

              {/* Nút ẩn lại */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setIsOpen(false)}
                  className="font-sans text-xs tracking-widest text-charcoal-light hover:text-charcoal transition-colors flex items-center gap-2"
                >
                  <ChevronDown size={14} className="rotate-180" />
                  Thu gọn
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Zoom Modal */}
        <AnimatePresence>
          {zoomed && (
            <QrModal
              src={zoomed.src}
              owner={zoomed.owner}
              onClose={() => setZoomed(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  )
}
