'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
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
  ceremonyVenue?: Venue
  receptionVenue?: Venue
  weddingDate: string
  groomName: string
  brideName: string
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
        {/* Map iframe — 56% ratio trên desktop, taller trên mobile */}
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

function VenueCard({ venue, label, delay }: { venue: Venue; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  const [showMap, setShowMap] = useState(false)

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay }}
        className="relative bg-white border border-blush/30 px-6 sm:px-10 py-10 sm:py-12 text-center group hover:shadow-xl transition-shadow duration-500"
      >
        {/* Top ornament */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-gold rotate-45" />
        </div>

        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-3 sm:mb-4">{label}</p>
        <h3 className="font-serif text-2xl sm:text-3xl text-charcoal mb-5 sm:mb-6 leading-snug">{venue.name}</h3>

        <div className="flex flex-col gap-3 items-center text-charcoal-light mb-7 sm:mb-8">
          <div className="flex items-center gap-2 font-sans text-sm">
            <Clock size={14} className="text-gold flex-shrink-0" />
            <span>{venue.time}</span>
          </div>
          <div className="flex items-start gap-2 font-sans text-sm max-w-xs text-center">
            <MapPin size={14} className="text-gold flex-shrink-0 mt-0.5" />
            <span className="text-left">{venue.address}</span>
          </div>
        </div>

        {/* Buttons — stack on mobile, row on sm+ */}
        <div className="flex flex-col xs:flex-row gap-3 justify-center items-center">
          {venue.mapEmbed && (
            <button onClick={() => setShowMap(true)} className="btn-primary text-[11px] w-full xs:w-auto">
              <Map size={12} />
              Xem bản đồ
            </button>
          )}
          {venue.mapUrl && (
            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-[11px] w-full xs:w-auto"
            >
              <MapPin size={12} />
              Mở Google Maps
            </a>
          )}
        </div>

        <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-blush/40" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-blush/40" />
      </motion.div>

      <AnimatePresence>
        {showMap && venue.mapEmbed && (
          <MapModal embedUrl={venue.mapEmbed} name={venue.name} onClose={() => setShowMap(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default function DetailsSection({ ceremonyVenue, receptionVenue, weddingDate, groomName, brideName }: DetailsProps) {
  const dateVi = new Date(weddingDate).toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <SectionWrapper id="details" className="section-padding bg-blush/10">
      <SectionHeader eyebrow="Ngày trọng đại" title="Thông tin hôn lễ" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex items-center justify-center gap-3 sm:gap-6 mb-12 sm:mb-16 flex-wrap"
      >
        <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-gold/60" />
        <div className="flex items-center gap-2 text-charcoal">
          <Calendar size={14} className="text-gold" />
          <span className="font-serif text-base sm:text-lg italic text-center">{dateVi}</span>
        </div>
        <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-gold/60" />
      </motion.div>

      {/* Cards — stack mobile, 2 col on md+ */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12">
        {ceremonyVenue && <VenueCard venue={ceremonyVenue} label="Lễ vu quy" delay={0.1} />}
        {receptionVenue && <VenueCard venue={receptionVenue} label="Tiệc cưới" delay={0.25} />}
        {!ceremonyVenue && !receptionVenue && (
          <div className="col-span-full text-center py-16 text-charcoal-light font-serif italic text-lg sm:text-xl">
            Thông tin hôn lễ sẽ được cập nhật sớm...
          </div>
        )}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="text-center font-serif italic text-charcoal-light text-base sm:text-lg mt-14 sm:mt-16 px-4"
      >
        Sự hiện diện của bạn là món quà quý giá nhất với {groomName} &amp; {brideName}
      </motion.p>
    </SectionWrapper>
  )
}
