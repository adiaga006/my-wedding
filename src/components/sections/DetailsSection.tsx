'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin, Clock, Map, X } from 'lucide-react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'

interface Venue {
  name?: string
  hall?: string
  address?: string
  lunarDate?: string
  welcomeTime?: string
  startTime?: string
  mapUrl?: string
  mapEmbed?: string
}

interface Family {
  fatherName?: string
  motherName?: string
  address?: string
}

interface DetailsProps {
  venue?: Venue
  weddingDate: string
  groomName: string
  groomFullName?: string
  groomTitle?: string
  brideName: string
  brideFullName?: string
  brideTitle?: string
  groomFamily?: Family
  brideFamily?: Family
}

function extractMapSrc(value: string): string {
  const match = value.match(/src=["']([^"']+)["']/)
  return match ? match[1] : value
}

function MapModal({ embedUrl, name, onClose }: { embedUrl: string; name: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className="relative w-full sm:max-w-3xl bg-white shadow-2xl rounded-t-2xl sm:rounded-none overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-blush/20">
          <p className="font-serif text-base sm:text-lg text-charcoal">{name}</p>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-charcoal-light hover:text-charcoal transition-colors" aria-label="Đóng">
            <X size={20} />
          </button>
        </div>
        <div className="relative w-full" style={{ paddingBottom: '62%' }}>
          <iframe src={embedUrl} className="absolute inset-0 w-full h-full border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Bản đồ ${name}`} />
        </div>
      </motion.div>
    </motion.div>
  )
}

function FamilyBlock({ label, family, fullName, title }: { label: string; family?: Family; fullName?: string; title?: string }) {
  const hasInfo = family?.fatherName || family?.motherName || family?.address
  if (!hasInfo && !fullName) return null
  return (
    <div className="text-center">
      <p className="font-sans text-[9px] xs:text-[10px] tracking-[0.35em] uppercase text-gold mb-3">{label}</p>
      {family?.fatherName && (
        <p className="font-sans text-[11px] xs:text-xs text-charcoal leading-relaxed">
          <span className="text-charcoal-light">Ông:</span> <span className="font-medium">{family.fatherName}</span>
        </p>
      )}
      {family?.motherName && (
        <p className="font-sans text-[11px] xs:text-xs text-charcoal leading-relaxed">
          <span className="text-charcoal-light">Bà:</span> <span className="font-medium">{family.motherName}</span>
        </p>
      )}
      {family?.address && (
        <p className="font-sans text-[10px] xs:text-[11px] text-charcoal-light leading-relaxed mt-1.5 italic">
          {family.address}
        </p>
      )}
    </div>
  )
}

export default function DetailsSection({
  venue, weddingDate,
  groomName, groomFullName, groomTitle,
  brideName, brideFullName, brideTitle,
  groomFamily, brideFamily,
}: DetailsProps) {
  const [showMap, setShowMap] = useState(false)

  const date = new Date(weddingDate)
  const weekday = date.toLocaleDateString('vi-VN', { weekday: 'long', timeZone: 'Asia/Ho_Chi_Minh' }).toUpperCase()
  const dateNum = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' }).replace(/\//g, '.')

  const hasFamilyInfo = groomFamily?.fatherName || groomFamily?.motherName || brideFamily?.fatherName || brideFamily?.motherName

  return (
    <SectionWrapper id="details" className="section-padding bg-blush/10">
      <SectionHeader eyebrow="Ngày trọng đại" title="Thông tin hôn lễ" />

      <div className="max-w-2xl mx-auto">

        {/* Family announcement block */}
        {hasFamilyInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 sm:mb-14"
          >
            <div className="border border-blush/30 bg-white rounded-sm px-5 xs:px-8 sm:px-10 py-8 sm:py-10">
              {/* Two families */}
              <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
                <FamilyBlock label="Nhà Trai" family={groomFamily} fullName={groomFullName} title={groomTitle} />
                <FamilyBlock label="Nhà Gái" family={brideFamily} fullName={brideFullName} title={brideTitle} />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="flex-1 h-px bg-blush/40" />
                <span className="text-gold text-xs">✦</span>
                <div className="flex-1 h-px bg-blush/40" />
              </div>

              {/* Announcement */}
              <p className="font-sans text-[10px] xs:text-[11px] sm:text-xs tracking-[0.15em] text-charcoal-light text-center uppercase mb-6 sm:mb-8 leading-relaxed">
                Trân trọng báo tin <span className="text-charcoal font-medium">Lễ Thành Hôn</span> của con chúng tôi
              </p>

              {/* Couple names with titles */}
              <div className="flex flex-col items-center gap-4">
                <div className="text-center">
                  <p
                    className="text-charcoal leading-none mb-1"
                    style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 7vw, 2.5rem)' }}
                  >
                    {groomFullName || groomName}
                  </p>
                  {groomTitle && (
                    <p className="font-sans text-[10px] tracking-widest uppercase text-charcoal-light">{groomTitle}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full max-w-[160px]">
                  <div className="flex-1 h-px bg-blush/50" />
                  <span style={{ fontFamily: 'var(--font-display)' }} className="text-gold text-xl leading-none">và</span>
                  <div className="flex-1 h-px bg-blush/50" />
                </div>

                <div className="text-center">
                  <p
                    className="text-charcoal leading-none mb-1"
                    style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 7vw, 2.5rem)' }}
                  >
                    {brideFullName || brideName}
                  </p>
                  {brideTitle && (
                    <p className="font-sans text-[10px] tracking-widest uppercase text-charcoal-light">{brideTitle}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Big date block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="font-sans text-[10px] sm:text-xs tracking-[0.45em] uppercase text-charcoal-light mb-4">
            {weekday}
          </p>
          <p
            className="font-serif font-light text-charcoal leading-none mb-4"
            style={{ fontSize: 'clamp(2.5rem, 11vw, 5rem)', letterSpacing: 'clamp(0.02em, 1vw, 0.1em)' }}
          >
            {dateNum}
          </p>
          {venue?.lunarDate && (
            <p className="font-sans text-[11px] sm:text-xs text-charcoal-light italic tracking-wide px-4">
              ({venue.lunarDate})
            </p>
          )}
        </motion.div>

        {/* Venue card */}
        {venue ? (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative bg-white border border-blush/30 rounded-sm hover:shadow-xl transition-shadow duration-500"
          >
            {/* Top diamond */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3">
              <div className="w-6 h-6 border-2 border-gold rotate-45" />
            </div>

            <div className="px-5 xs:px-8 sm:px-12 md:px-14 pt-10 sm:pt-12 pb-8 sm:pb-10 text-center">
              {venue.name && (
                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal leading-tight mb-1">
                  {venue.name}
                </h3>
              )}
              {venue.hall && (
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-5">{venue.hall}</p>
              )}

              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-10 bg-blush/60" />
                <span className="text-gold text-xs">✦</span>
                <div className="h-px w-10 bg-blush/60" />
              </div>

              {venue.address && (
                <div className="flex items-start justify-center gap-2 mb-7">
                  <MapPin size={14} className="text-gold flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-sm sm:text-base text-charcoal-light leading-relaxed text-left max-w-xs">
                    {venue.address}
                  </p>
                </div>
              )}

              {/* Times */}
              {(venue.welcomeTime || venue.startTime) && (() => {
                const times = [
                  venue.welcomeTime && { label: 'Đón khách', value: venue.welcomeTime },
                  venue.startTime   && { label: 'Khai tiệc', value: venue.startTime },
                ].filter(Boolean) as { label: string; value: string }[]

                return (
                  <div className={`mb-8 grid divide-x divide-blush/20 ${times.length === 1 ? 'grid-cols-1' : times.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {times.map((t) => (
                      <div key={t.label} className="flex flex-col items-center gap-1.5 px-2 sm:px-4">
                        <p className="font-sans text-[9px] sm:text-[10px] tracking-widest uppercase text-charcoal-light">{t.label}</p>
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-gold flex-shrink-0" />
                          <p className="font-serif text-lg sm:text-xl md:text-2xl text-charcoal">{t.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}

              {/* Inline map */}
              {venue.mapEmbed && extractMapSrc(venue.mapEmbed) && (
                <div className="mb-6 overflow-hidden rounded-sm relative" style={{ paddingBottom: '50%' }}>
                  <iframe
                    src={extractMapSrc(venue.mapEmbed)}
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Bản đồ ${venue.name}`}
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col xs:flex-row gap-3 justify-center">
                {venue.mapEmbed && extractMapSrc(venue.mapEmbed) && (
                  <button onClick={() => setShowMap(true)} className="btn-primary text-[11px] sm:text-xs w-full xs:w-auto px-8">
                    <Map size={13} /> Xem to hơn
                  </button>
                )}
                {venue.mapUrl && (
                  <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-[11px] sm:text-xs w-full xs:w-auto px-8">
                    <MapPin size={13} /> Mở Google Maps
                  </a>
                )}
              </div>
            </div>

            <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-blush/40" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-blush/40" />
          </motion.div>
        ) : (
          <p className="text-center font-serif italic text-charcoal-light text-xl sm:text-2xl py-16">
            Thông tin hôn lễ sẽ được cập nhật sớm...
          </p>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center font-serif italic text-charcoal-light text-base sm:text-lg mt-10 sm:mt-12 px-4"
        >
          Sự hiện diện của bạn là món quà quý giá nhất với {groomName} &amp; {brideName}
        </motion.p>
      </div>

      <AnimatePresence>
        {showMap && venue?.mapEmbed && (
          <MapModal embedUrl={extractMapSrc(venue.mapEmbed)} name={venue.name || ''} onClose={() => setShowMap(false)} />
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
