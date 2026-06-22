'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Câu chuyện', href: '#story' },
  { label: 'Hôn lễ', href: '#details' },
  { label: 'Hình ảnh', href: '#gallery' },
  { label: 'Xác nhận', href: '#rsvp' },
  { label: 'Lời chúc', href: '#guestbook' },
  { label: 'Mừng cưới', href: '#gift' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Khoá scroll body khi mobile menu mở
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleClick = (href: string) => {
    setMobileOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }, mobileOpen ? 300 : 0)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-blush/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 h-14 sm:h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleClick('#hero') }}
            className="font-serif text-xl sm:text-2xl md:text-3xl italic text-charcoal hover:text-gold transition-colors"
          >
            D &amp; C
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleClick(link.href) }}
                className="font-sans text-[11px] tracking-widest uppercase text-charcoal-light hover:text-gold transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button — 44px touch target */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 text-charcoal hover:text-gold transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            className="fixed inset-0 z-40 bg-cream flex flex-col items-center justify-center gap-8 sm:gap-10 px-8"
          >
            <p className="font-serif text-4xl italic text-gold mb-4">Duy &amp; Chi</p>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleClick(link.href) }}
                className="font-sans text-sm tracking-[0.3em] uppercase text-charcoal hover:text-gold transition-colors py-2 w-full text-center border-b border-blush/20"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
