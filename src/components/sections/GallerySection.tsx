'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import SectionWrapper from '@/components/ui/SectionWrapper'
import SectionHeader from '@/components/ui/SectionHeader'
import { urlFor } from '@/sanity/lib/image'

interface GalleryImage {
  _id: string
  image: { asset: { _ref: string } }
  caption?: string
}

export default function GallerySection({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const slides = images.map((img) => ({
    src: urlFor(img.image).width(1800).height(1200).url(),
    alt: img.caption || 'Wedding photo',
  }))

  return (
    <SectionWrapper id="gallery" className="section-padding bg-charcoal">
      <SectionHeader eyebrow="Pre-wedding" title="Khoảnh khắc của chúng mình" />

      {images.length === 0 ? (
        <p className="text-center text-cream/40 font-serif italic text-lg sm:text-xl py-16">
          Hình ảnh sẽ được cập nhật sớm...
        </p>
      ) : (
        // CSS columns masonry — xs:1 col, sm:2 col, lg:3 col
        <div
          className="max-w-6xl mx-auto"
          style={{ columnCount: undefined }} // handled by className below
        >
          <div className="[column-count:1] xs:[column-count:2] lg:[column-count:3] [column-gap:8px] xs:[column-gap:12px] sm:[column-gap:16px]">
            {images.map((img, i) => (
              <motion.div
                key={img._id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.04 }}
                className="relative cursor-pointer overflow-hidden group break-inside-avoid mb-3 sm:mb-4"
                onClick={() => setLightboxIndex(i)}
              >
                <Image
                  src={urlFor(img.image).width(700).url()}
                  alt={img.caption || 'Wedding photo'}
                  width={700}
                  height={0}
                  style={{ height: 'auto', width: '100%' }}
                  className="object-cover transition-transform duration-700 group-hover:scale-105 block"
                  sizes="(max-width: 375px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Hover overlay — desktop. On mobile: visible tap overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 active:bg-black/25 transition-colors duration-400" />

                {/* Caption on hover */}
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-serif italic text-cream text-xs sm:text-sm">{img.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <Lightbox
        slides={slides}
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        styles={{ container: { backgroundColor: 'rgba(0,0,0,0.96)' } }}
      />
    </SectionWrapper>
  )
}
