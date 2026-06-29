'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { Copy, CheckCheck, Gift, X, ZoomIn } from 'lucide-react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'
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
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-cream hover:bg-blush/30 text-charcoal-light transition-colors"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        {/* Tên */}
        <p className="font-serif text-charcoal text-center text-lg mb-4 pr-8">{owner}</p>

        {/* QR full size */}
        <div className="w-full aspect-square">
          <Image
            src={src}
            alt={`QR ${owner}`}
            width={600}
            height={600}
            className="w-full h-full object-contain"
          />
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white border border-blush/20 text-center flex flex-col"
    >
      {/* Gold top accent */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className={`flex flex-col flex-1 ${compact ? 'px-3 xs:px-4 pt-5 pb-4' : 'px-5 xs:px-7 sm:px-10 pt-7 pb-6 sm:pt-10 sm:pb-8'}`}>

        {/* Nhãn: Chú rể / Cô dâu */}
        {account.label && (
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold text-center mb-1">
            {account.label}
          </p>
        )}

        {/* Tên chủ tài khoản */}
        <p className={`font-serif text-charcoal text-center mb-4 ${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'}`}>
          {account.owner}
        </p>

        {/* QR Code — hover effect + click to zoom */}
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
            {/* Gold border on hover */}
            <div className="absolute inset-0 border-2 border-gold/0 group-hover/qr:border-gold/50 transition-colors duration-300 pointer-events-none" />
            {/* Zoom hint overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-black/30 backdrop-blur-[2px] rounded-full p-2.5">
                <ZoomIn size={18} className="text-white" />
              </div>
            </div>
          </div>
        )}

        {/* STK + copy */}
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

        {/* Tên ngân hàng + tên tài khoản */}
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

  return (
    <SectionWrapper id="gift" className="overflow-hidden">
      <div className="bg-charcoal py-3 sm:py-5 px-4 sm:px-10">
        <SectionHeader eyebrow="Hộp quà cưới" title="Mừng cưới" ornament="♡" icon={<Gift size={36} strokeWidth={1.4} />} dark  compact />
      </div>
      <div className="section-padding bg-blush/10">

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        className="text-center font-serif italic text-charcoal-light text-base sm:text-lg max-w-sm sm:max-w-lg mx-auto mb-10 sm:mb-14 leading-relaxed px-4"
      >
        Sự hiện diện của bạn là món quà ý nghĩa nhất. Nếu bạn muốn gửi thêm tình cảm,
        chúng mình xin trân trọng đón nhận ♡
      </motion.p>

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
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
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
      </div>{/* end section-padding */}
    </SectionWrapper>
  )
}
