'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Copy, CheckCheck, Gift } from 'lucide-react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'
import { urlFor } from '@/sanity/lib/image'

interface BankAccount {
  _id: string
  owner: string
  bankName: string
  accountNumber: string
  accountName: string
  qrCode?: { asset: { _ref: string } }
}

function AccountCard({ account, index }: { account: BankAccount; index: number }) {
  const [copied, setCopied] = useState(false)

  const copyAccount = () => {
    navigator.clipboard.writeText(account.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      className="bg-white border border-blush/20 px-6 sm:px-8 py-8 sm:py-10 text-center"
    >
      {account.qrCode && (
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-5 sm:mb-6">
          <Image
            src={urlFor(account.qrCode).width(352).height(352).url()}
            alt={`QR ${account.owner}`}
            fill
            className="object-contain"
            sizes="176px"
          />
        </div>
      )}

      <p className="font-sans text-[10px] tracking-widest uppercase text-gold mb-2">{account.bankName}</p>
      <p className="font-serif text-xl sm:text-2xl text-charcoal mb-1">{account.owner}</p>
      <p className="font-sans text-xs text-charcoal-light mb-5">{account.accountName}</p>

      {/* Copy button — full touch target */}
      <button
        onClick={copyAccount}
        className="flex items-center justify-center gap-3 bg-cream w-full py-3 min-h-[48px] hover:bg-blush/20 active:bg-blush/30 transition-colors"
        aria-label="Sao chép số tài khoản"
      >
        <span className="font-sans text-sm font-medium tracking-widest text-charcoal">
          {account.accountNumber}
        </span>
        {copied
          ? <CheckCheck size={15} className="text-sage flex-shrink-0" />
          : <Copy size={15} className="text-charcoal-light flex-shrink-0" />}
      </button>

      <AnimatedCopied show={copied} />
    </motion.div>
  )
}

function AnimatedCopied({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-sans text-xs text-sage mt-2"
    >
      Đã sao chép!
    </motion.p>
  )
}

export default function GiftSection({ accounts }: { accounts: BankAccount[] }) {
  return (
    <SectionWrapper id="gift" className="section-padding bg-blush/10">
      <SectionHeader eyebrow="Hộp quà cưới" title="Mừng cưới" ornament="♡" />

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center font-serif italic text-charcoal-light text-base sm:text-lg max-w-sm sm:max-w-lg mx-auto mb-12 sm:mb-16 leading-relaxed px-4"
      >
        Sự hiện diện của bạn là món quà ý nghĩa nhất. Nếu bạn muốn gửi thêm tình cảm,
        chúng tôi trân trọng đón nhận ♡
      </motion.p>

      {accounts.length === 0 ? (
        <div className="text-center py-8">
          <Gift size={40} className="text-blush mx-auto mb-4" strokeWidth={1} />
          <p className="font-serif italic text-charcoal-light">Thông tin sẽ được cập nhật sớm</p>
        </div>
      ) : (
        // 1 col mobile, 2 col md+. Nếu chỉ 1 tài khoản thì canh giữa
        <div className={`max-w-3xl mx-auto grid gap-6 sm:gap-8 ${accounts.length === 1 ? 'grid-cols-1 max-w-sm' : 'grid-cols-1 md:grid-cols-2'}`}>
          {accounts.map((acc, i) => (
            <AccountCard key={acc._id} account={acc} index={i} />
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
