'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin, Clock, Calendar, Map, X } from 'lucide-react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'

interface Venue {
  name: string
  address: string
  time: string
  mapUrl?: string
  mapEmbed?: string
}

interface DetailsProps {
  venue?: Venue
  weddingDate: string
  groomName: string
  brideName: string
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
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-charcoal-light hover:text-charcoal transition-colors rounded-full hover:bg-black/5"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>
        <div className="relative w-full" style={{ paddingBottom: '62%' }}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0"
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

export default function DetailsSection({ venue, weddingDate, groomName, brideName }: DetailsProps) {
  const [showMap, setShowMap] = useState(false)

  const dateVi = new Date(weddingDate).toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  })

  return (
    <SectionWrapper id="details" className="section-padding bg-blush/10">
      <SectionHeader eyebrow="Ngày trọng đại" title="Thông tin hôn lễ" />

      {/* Ngày */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex items-center justify-center gap-3 sm:gap-5 mb-12 sm:mb-16 flex-wrap"
      >
        <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-gold/60" />
        <div className="flex items-center gap-2 text-charcoal">
          <Calendar size={15} className="text-gold" />
          <span className="font-serif text-lg sm:text-xl italic">{dateVi}</span>
        </div>
        <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-gold/60" />
      </motion.div>

      {venue ? (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative bg-white border border-blush/30 px-8 sm:px-16 py-12 sm:py-16 text-center hover:shadow-xl transition-shadow duration-500">
            {/* Top diamond ornament */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3">
              <div className="w-7 h-7 border-2 border-gold rotate-45" />
            </div>

            {/* Venue name */}
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal mb-6 leading-tight">
              {venue.name}
            </h3>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3 mb-7">
              <div className="h-px w-10 bg-blush/60" />
              <span className="text-gold text-sm">✦</span>
              <div className="h-px w-10 bg-blush/60" />
            </div>

            {/* Time & Address */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10">
              {venue.time && (
                <div className="flex items-center gap-2.5 text-charcoal">
                  <Clock size={16} className="text-gold flex-shrink-0" />
                  <span className="font-sans text-base sm:text-lg">{venue.time}</span>
                </div>
              )}
              {venue.time && venue.address && (
                <div className="hidden sm:block w-px h-5 bg-blush/40" />
              )}
              {venue.address && (
                <div className="flex items-start gap-2.5 text-charcoal max-w-xs">
                  <MapPin size={16} className="text-gold flex-shrink-0 mt-0.5" />
                  <span className="font-sans text-base sm:text-lg text-left">{venue.address}</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col xs:flex-row gap-3 justify-center items-center">
              {venue.mapEmbed && extractMapSrc(venue.mapEmbed) && (
                <button onClick={() => setShowMap(true)} className="btn-primary text-[11px] sm:text-xs w-full xs:w-auto px-8">
                  <Map size={13} /> Xem bản đồ
                </button>
              )}
              {venue.mapUrl && (
                <a
                  href={venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-[11px] sm:text-xs w-full xs:w-auto px-8"
                >
                  <MapPin size={13} /> Mở Google Maps
                </a>
              )}
            </div>

            {/* Corner accents */}
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-blush/40" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-blush/40" />
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
        className="text-center font-serif italic text-charcoal-light text-base sm:text-lg mt-12 sm:mt-14 px-4"
      >
        Sự hiện diện của bạn là món quà quý giá nhất với {groomName} &amp; {brideName}
      </motion.p>

      <AnimatePresence>
        {showMap && venue?.mapEmbed && (
          <MapModal embedUrl={extractMapSrc(venue.mapEmbed)} name={venue.name} onClose={() => setShowMap(false)} />
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
