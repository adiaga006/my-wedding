'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { Copy, CheckCheck, Gift } from 'lucide-react'
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

function AccountCard({ account, index, compact }: { account: BankAccount; index: number; compact?: boolean }) {
  const [copied, setCopied] = useState(false)

  const copyAccount = () => {
    navigator.clipboard.writeText(account.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
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

        {/* QR Code — container vuông cố định, object-contain để không crop */}
        {account.qrCode && (
          <div className="relative w-full aspect-square mb-4 bg-white">
            <Image
              src={urlFor(account.qrCode).width(800).url()}
              alt={`QR ${account.owner}`}
              fill
              className="object-contain p-1"
              sizes={compact ? '45vw' : '(max-width: 640px) 90vw, 320px'}
            />
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

        {/* Tên ngân hàng + tên tài khoản — dưới STK */}
        <div className="mt-3 text-center space-y-0.5">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold">{account.bankName}</p>
          <p className="font-sans text-xs text-charcoal-light">{account.accountName}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function GiftSection({ accounts }: { accounts: BankAccount[] }) {
  const isPair = accounts.length === 2

  return (
    <SectionWrapper id="gift" className="section-padding bg-blush/10">
      <SectionHeader eyebrow="Hộp quà cưới" title="Mừng cưới" ornament="♡" />

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
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
        /* 2 QR: cạnh nhau từ xs trở lên, mỗi card nhỏ gọn */
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
            {accounts.map((acc, i) => (
              <AccountCard key={acc._id} account={acc} index={i} compact />
            ))}
          </div>

          {/* Ornament giữa 2 QR — hiện trên desktop */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center font-serif italic text-charcoal-light text-sm sm:text-base mt-8"
          >
            Chú rể &amp; Cô dâu ♡
          </motion.p>
        </div>
      ) : (
        /* 1 hoặc 3+ tài khoản */
        <div className={`mx-auto grid gap-5 sm:gap-8 ${accounts.length === 1
            ? 'max-w-xs grid-cols-1'
            : 'max-w-3xl grid-cols-1 sm:grid-cols-2'
          }`}>
          {accounts.map((acc, i) => (
            <AccountCard key={acc._id} account={acc} index={i} />
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
