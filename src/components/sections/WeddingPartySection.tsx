'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'
import { urlFor } from '@/sanity/lib/image'

interface PartyMember {
  _id: string
  name: string
  side: 'bride' | 'groom'
  role: string
  relationship?: string
  photo?: { asset: { _ref: string } }
}

function MemberCard({ member, index }: { member: PartyMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.08 }}
      className="text-center group"
    >
      {/* Photo — touch to scale on mobile via active state */}
      <div className="relative w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto mb-3 sm:mb-4 overflow-hidden rounded-full border-[2px] xs:border-[3px] border-blush/30 group-hover:border-gold/50 transition-colors duration-300">
        {member.photo ? (
          <Image
            src={urlFor(member.photo).width(288).height(288).url()}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110 group-active:scale-110"
            sizes="(max-width: 375px) 96px, (max-width: 640px) 112px, 144px"
          />
        ) : (
          <div className="w-full h-full bg-blush/20 flex items-center justify-center">
            <span className="text-blush text-3xl">♡</span>
          </div>
        )}
      </div>
      <p className="font-serif text-lg sm:text-xl text-charcoal mb-0.5 leading-snug">{member.name}</p>
      <p className="font-sans text-xs tracking-wider uppercase text-gold mb-1">{member.role}</p>
      {member.relationship && (
        <p className="font-sans text-xs text-charcoal-light italic px-2">{member.relationship}</p>
      )}
    </motion.div>
  )
}

export default function WeddingPartySection({ members }: { members: PartyMember[] }) {
  const brideTeam = members.filter((m) => m.side === 'bride')
  const groomTeam = members.filter((m) => m.side === 'groom')

  if (members.length === 0) return null

  return (
    <SectionWrapper id="party" className="section-padding bg-cream">
      <SectionHeader eyebrow="Những người bạn đồng hành" title="Đội hình cưới" />

      {groomTeam.length > 0 && (
        <div className="max-w-5xl mx-auto mb-16 sm:mb-20">
          <div className="flex items-center gap-4 mb-10 sm:mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-blush/40" />
            <p className="font-serif text-xl sm:text-2xl italic text-charcoal-light whitespace-nowrap">Phù rể</p>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-blush/40" />
          </div>
          {/* 2 col mobile, 3 col sm, 4 col md */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {groomTeam.map((m, i) => <MemberCard key={m._id} member={m} index={i} />)}
          </div>
        </div>
      )}

      {brideTeam.length > 0 && (
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-10 sm:mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-blush/40" />
            <p className="font-serif text-xl sm:text-2xl italic text-charcoal-light whitespace-nowrap">Phù dâu</p>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-blush/40" />
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {brideTeam.map((m, i) => <MemberCard key={m._id} member={m} index={i} />)}
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}
