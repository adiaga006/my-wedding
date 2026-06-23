'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { VolumeX, Volume2, SkipForward } from 'lucide-react'
import { useMusicContext } from '@/contexts/MusicContext'

export default function MusicPlayer() {
  const { playing, hasTrack, toggle, skipNext } = useMusicContext()
  const [showControls, setShowControls] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowControls(true), 800)
    return () => clearTimeout(t)
  }, [])

  if (!hasTrack || !showControls) return null

  return (
    <>
      <div
        className="fixed right-4 sm:right-6 z-50 flex items-center gap-2"
        style={{ bottom: 'max(1.5rem, calc(1rem + env(safe-area-inset-bottom)))' }}
      >
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          onClick={skipNext}
          className="w-10 h-10 bg-charcoal/70 backdrop-blur text-cream/60 rounded-full flex items-center justify-center hover:text-cream hover:bg-charcoal transition-colors border border-white/10"
          aria-label="Bài tiếp theo"
        >
          <SkipForward size={14} />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          onClick={toggle}
          className="w-12 h-12 bg-charcoal/90 backdrop-blur text-cream rounded-full flex items-center justify-center shadow-lg hover:bg-charcoal transition-colors border border-white/10"
          aria-label={playing ? 'Tắt nhạc' : 'Bật nhạc'}
        >
          {playing ? (
            <div className="flex items-end gap-0.5 h-4">
              {[0.15, 0.05, 0.25, 0.1].map((delay, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 bg-blush rounded-full"
                  animate={{ height: ['4px', '14px', '6px', '12px', '4px'] }}
                  transition={{ duration: 1, repeat: Infinity, delay, ease: 'easeInOut' }}
                />
              ))}
            </div>
          ) : (
            <VolumeX size={18} className="text-cream/60" />
          )}
        </motion.button>
      </div>

      <AutoplayHint playing={playing} onPlay={toggle} />
    </>
  )
}

function AutoplayHint({ playing, onPlay }: { playing: boolean; onPlay: () => void }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => { if (!playing) setShow(true) }, 2500)
    return () => clearTimeout(t)
  }, [playing])

  useEffect(() => { if (playing) setShow(false) }, [playing])

  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-20 right-4 z-50 bg-charcoal/90 backdrop-blur text-cream px-4 py-3 text-xs font-sans max-w-[180px] text-center leading-relaxed border border-white/10"
    >
      <Volume2 size={14} className="mx-auto mb-1 text-blush" />
      Bấm để bật nhạc nền
      <button
        onClick={() => { onPlay(); setShow(false) }}
        className="block w-full mt-2 text-gold underline underline-offset-2"
      >
        Bật nhạc ♪
      </button>
    </motion.div>
  )
}
