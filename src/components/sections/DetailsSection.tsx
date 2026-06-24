'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin, Clock, Map, X } from 'lucide-react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function WeddingCalendar({ date }: { date: Date }) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const weddingDay = date.getDate()

  const firstDow = new Date(year, month, 1).getDay()
  const startOffset = (firstDow + 6) % 7 // Mon-first offset
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthLabel = date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' })
  const dayHeaders = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="inline-block bg-white border border-blush/30 p-4 xs:p-5 w-full max-w-[272px] xs:max-w-[300px] sm:max-w-xs mx-auto">
      <p className="font-sans text-[10px] xs:text-xs tracking-[0.3em] uppercase text-charcoal-light text-center mb-4">
        {monthLabel}
      </p>
      <div className="grid grid-cols-7 mb-1.5">
        {dayHeaders.map((d, i) => (
          <div key={d} className={`text-center font-sans text-[9px] xs:text-[10px] tracking-wide uppercase pb-2 ${i === 6 ? 'text-rose-400' : 'text-charcoal-light'}`}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => {
          const isWedding = day === weddingDay
          const isSun = idx % 7 === 6
          return (
            <div key={idx} className="flex items-center justify-center h-7 xs:h-8">
              {day !== null && (
                isWedding ? (
                  <span className="relative flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9">
                    <svg className="absolute inset-0 w-full h-full text-pink-400" viewBox="0 0 36 34" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
                      <path d="M18 30C18 30 3 20.5 3 11.5C3 7.36 6.36 4 10.5 4C13.24 4 15.65 5.48 17 7.7C18.35 5.48 20.76 4 23.5 4C27.64 4 31 7.36 31 11.5C31 20.5 18 30 18 30Z"/>
                    </svg>
                    <span className="relative font-sans text-[10px] xs:text-[11px] font-semibold text-pink-500 leading-none z-10 mt-0.5">
                      {day}
                    </span>
                  </span>
                ) : (
                  <span className={`w-6 h-6 xs:w-7 xs:h-7 flex items-center justify-center text-[10px] xs:text-[11px] font-sans rounded-full
                    ${isSun ? 'text-rose-400' : 'text-charcoal'}`}>
                    {day}
                  </span>
                )
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeddingCountdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate))
    const t = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(t)
  }, [targetDate])

  if (!timeLeft) return null

  if (new Date(targetDate).getTime() <= Date.now()) {
    return (
      <p className="font-serif italic text-charcoal/60 text-center mt-6 text-lg">
        Hôm nay là ngày trọng đại của chúng mình 🎊
      </p>
    )
  }

  const units = [
    { label: 'Ngày', value: timeLeft.days },
    { label: 'Giờ', value: timeLeft.hours },
    { label: 'Phút', value: timeLeft.minutes },
    { label: 'Giây', value: timeLeft.seconds },
  ]

  return (
    <div className="mt-6 sm:mt-8">
      <p className="font-sans text-[9px] xs:text-[10px] tracking-[0.35em] uppercase text-charcoal-light text-center mb-4">
        Đếm ngược
      </p>
      <div className="flex items-center justify-center">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center">
            <div className="text-center px-2 xs:px-3 sm:px-4">
              <div className="font-serif text-gold font-light leading-none tabular-nums"
                style={{ fontSize: 'clamp(1.5rem, 5.5vw, 2.6rem)', textShadow: '0 1px 4px rgba(180,140,60,0.25)' }}>
                {String(unit.value).padStart(2, '0')}
              </div>
              <div className="font-sans text-[9px] xs:text-[10px] tracking-widest uppercase text-charcoal-light mt-1.5">
                {unit.label}
              </div>
            </div>
            {i < 3 && (
              <span className="font-serif text-xl xs:text-2xl text-gold/40 mb-4 select-none">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="relative w-full sm:max-w-3xl bg-white shadow-2xl rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{ height: '82svh', maxHeight: '82svh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-blush/20 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-gold rounded-full" />
            <p className="font-serif text-base sm:text-lg text-charcoal">{name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blush/20 text-charcoal-light hover:text-charcoal transition-colors"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>
        {/* Map — fills remaining height */}
        <div className="flex-1 min-h-0">
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Bản đồ ${name}`}
          />
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
      <p className="font-sans text-[10px] xs:text-xs tracking-[0.35em] uppercase text-gold mb-3">{label}</p>
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
            <div className="border border-blush/30 bg-white rounded-sm px-4 xs:px-7 sm:px-10 py-8 sm:py-10">
              {/* Two families — shared grid so each row aligns across both sides */}
              <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 mb-6 sm:mb-8">
                {/* Labels */}
                <p className="font-sans text-[10px] xs:text-xs tracking-[0.35em] uppercase text-gold text-center pb-3">Nhà Trai</p>
                <p className="font-sans text-[10px] xs:text-xs tracking-[0.35em] uppercase text-gold text-center pb-3">Nhà Gái</p>

                {/* Father names */}
                {(groomFamily?.fatherName || brideFamily?.fatherName) && (
                  <>
                    <div className="text-center">
                      {groomFamily?.fatherName ? <>
                        <p className="font-sans text-[9px] xs:text-[10px] text-charcoal-light uppercase tracking-widest leading-none mb-0.5">Ông</p>
                        <p className="font-sans text-[11px] xs:text-xs text-charcoal font-medium leading-snug">{groomFamily.fatherName}</p>
                      </> : null}
                    </div>
                    <div className="text-center">
                      {brideFamily?.fatherName ? <>
                        <p className="font-sans text-[9px] xs:text-[10px] text-charcoal-light uppercase tracking-widest leading-none mb-0.5">Ông</p>
                        <p className="font-sans text-[11px] xs:text-xs text-charcoal font-medium leading-snug">{brideFamily.fatherName}</p>
                      </> : null}
                    </div>
                  </>
                )}

                {/* Mother names */}
                {(groomFamily?.motherName || brideFamily?.motherName) && (
                  <>
                    <div className="text-center mt-2">
                      {groomFamily?.motherName ? <>
                        <p className="font-sans text-[9px] xs:text-[10px] text-charcoal-light uppercase tracking-widest leading-none mb-0.5">Bà</p>
                        <p className="font-sans text-[11px] xs:text-xs text-charcoal font-medium leading-snug">{groomFamily.motherName}</p>
                      </> : null}
                    </div>
                    <div className="text-center mt-2">
                      {brideFamily?.motherName ? <>
                        <p className="font-sans text-[9px] xs:text-[10px] text-charcoal-light uppercase tracking-widest leading-none mb-0.5">Bà</p>
                        <p className="font-sans text-[11px] xs:text-xs text-charcoal font-medium leading-snug">{brideFamily.motherName}</p>
                      </> : null}
                    </div>
                  </>
                )}

                {/* Addresses */}
                {(groomFamily?.address || brideFamily?.address) && (
                  <>
                    <p className="font-sans text-[10px] xs:text-[11px] text-charcoal-light leading-relaxed mt-1.5 italic text-center">
                      {groomFamily?.address}
                    </p>
                    <p className="font-sans text-[10px] xs:text-[11px] text-charcoal-light leading-relaxed mt-1.5 italic text-center">
                      {brideFamily?.address}
                    </p>
                  </>
                )}
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

        {/* Calendar + date + countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14 flex flex-col items-center"
        >
          {/* Thứ + ngày */}
          <p className="font-sans text-sm sm:text-base tracking-[0.45em] uppercase text-charcoal-light mb-2">
            {weekday}
          </p>
          <p
            className="font-serif font-light text-charcoal leading-none mb-2"
            style={{ fontSize: 'clamp(2.2rem, 9vw, 4.5rem)', letterSpacing: 'clamp(0.02em, 0.8vw, 0.08em)' }}
          >
            {dateNum}
          </p>
          {venue?.lunarDate && (
            <p className="font-sans text-xs sm:text-sm text-charcoal-light italic tracking-wide px-4 mb-0">
              ({venue.lunarDate})
            </p>
          )}

          {/* Lịch tháng */}
          <div className="mt-6">
            <WeddingCalendar date={date} />
          </div>

          {/* Đếm ngược */}
          <WeddingCountdown targetDate={weddingDate} />
        </motion.div>

        {/* Venue card */}
        {venue ? (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative bg-white shadow-sm hover:shadow-lg transition-shadow duration-500"
          >
            <div className="px-6 xs:px-10 sm:px-14 md:px-16 pt-8 sm:pt-10 pb-10 sm:pb-12 text-center">

              {/* Top ornament: line ◇ line */}
              <div className="flex items-center gap-4 mb-8 sm:mb-10">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/70" />
                <div className="w-4 h-4 border border-gold rotate-45 flex-shrink-0" />
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/70" />
              </div>

              {/* Venue name + hall */}
              {venue.name && (
                <h3 className="font-serif text-4xl sm:text-5xl md:text-6xl text-charcoal leading-none mb-2">
                  {venue.name}
                </h3>
              )}
              {venue.hall && (
                <p className="font-sans text-[10px] xs:text-xs tracking-[0.4em] uppercase text-gold mb-6">{venue.hall}</p>
              )}

              {/* Ornament divider */}
              <div className="flex items-center justify-center gap-4 mb-7">
                <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-blush/60" />
                <span className="text-gold/70 text-base leading-none">❧</span>
                <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-blush/60" />
              </div>

              {/* Address — full center */}
              {venue.address && (
                <div className="mb-8">
                  <div className="inline-flex items-start gap-2 text-left">
                    <MapPin size={13} className="text-gold flex-shrink-0 mt-[3px]" />
                    <p className="font-sans text-sm sm:text-[15px] text-charcoal-light leading-relaxed">
                      {venue.address}
                    </p>
                  </div>
                </div>
              )}

              {/* Times */}
              {(venue.welcomeTime || venue.startTime) && (() => {
                const times = [
                  venue.welcomeTime && { label: 'Đón khách', value: venue.welcomeTime },
                  venue.startTime   && { label: 'Khai tiệc', value: venue.startTime },
                ].filter(Boolean) as { label: string; value: string }[]

                return (
                  <div className="mb-9 mx-auto max-w-[18rem] xs:max-w-xs sm:max-w-sm">
                    <div className={`grid border border-blush/30 divide-x divide-blush/30 ${times.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {times.map((t) => (
                        <div key={t.label} className="flex flex-col items-center gap-2 py-4 px-3">
                          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal-light">{t.label}</p>
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-gold" />
                            <p className="font-sans font-light text-2xl sm:text-3xl text-charcoal leading-none tracking-widest tabular-nums">{t.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* Inline map */}
              {venue.mapEmbed && extractMapSrc(venue.mapEmbed) && (
                <div className="mb-7 overflow-hidden relative -mx-6 xs:-mx-10 sm:-mx-14 md:-mx-16" style={{ paddingBottom: '52%' }}>
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
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {venue.mapEmbed && extractMapSrc(venue.mapEmbed) && (
                  <button onClick={() => setShowMap(true)} className="btn-primary w-full sm:w-auto px-10">
                    <Map size={13} /> Xem to hơn
                  </button>
                )}
                {venue.mapUrl && (
                  <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-outline w-full sm:w-auto px-10">
                    <MapPin size={13} /> Mở Google Maps
                  </a>
                )}
              </div>
            </div>

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
