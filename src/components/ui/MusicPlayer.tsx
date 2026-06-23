'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import { VolumeX, Volume2, SkipForward } from 'lucide-react'

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]{11})/,
    /youtube\.com\/shorts\/([^&?/\s]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const YT_STATE = { ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3 }

interface Track { url: string; title?: string }

interface MusicPlayerProps {
  playlist?: Track[]
}

export default function MusicPlayer({ playlist }: MusicPlayerProps) {
  const [playing, setPlaying] = useState(true)
  const [visible, setVisible] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [shuffled, setShuffled] = useState<string[]>([])
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Xây danh sách ID đã shuffle 1 lần lúc mount
  useEffect(() => {
    if (!playlist?.length) return
    const ids = playlist.map((t) => extractYouTubeId(t.url)).filter(Boolean) as string[]
    setShuffled(shuffle(ids))
  }, [playlist])

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  // Lắng nghe state YouTube để phát bài tiếp khi hết
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        const state = data?.info?.playerState
        if (state === undefined) return
        if (state === YT_STATE.PLAYING || state === YT_STATE.BUFFERING) {
          setPlaying(true)
        } else if (state === YT_STATE.PAUSED) {
          setPlaying(false)
        } else if (state === YT_STATE.ENDED) {
          // Chuyển bài tiếp, hoặc quay lại đầu
          setTrackIndex((i) => (i + 1) % (shuffled.length || 1))
        }
      } catch { /* ignore */ }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [shuffled])

  const sendCommand = useCallback((func: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }),
      '*'
    )
  }, [])

  const toggle = () => {
    if (playing) {
      sendCommand('pauseVideo')
      setPlaying(false)
    } else {
      sendCommand('playVideo')
      setPlaying(true)
    }
  }

  const skipNext = () => {
    setPlaying(true)
    setTrackIndex((i) => (i + 1) % (shuffled.length || 1))
  }

  const currentId = shuffled[trackIndex]
  // playlist param: tất cả ID còn lại để YouTube tự loop
  const playlistParam = shuffled.length > 1
    ? shuffled.filter((_, i) => i !== trackIndex).join(',')
    : currentId

  if (!currentId || !visible) return null

  return (
    <>
      {/* Hidden YouTube iframe */}
      <iframe
        key={currentId} // re-mount khi đổi bài
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${currentId}?enablejsapi=1&autoplay=1&loop=${shuffled.length === 1 ? 1 : 0}&playlist=${playlistParam}&controls=0&mute=0&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
        allow="autoplay; encrypted-media"
        className="absolute w-0 h-0 pointer-events-none opacity-0"
        aria-hidden="true"
        title="background music"
      />

      {/* Controls — bottom-safe-area cho iPhone notch */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* Skip next — chỉ hiện khi có nhiều bài */}
        {shuffled.length > 1 && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            onClick={skipNext}
            className="w-10 h-10 bg-charcoal/70 backdrop-blur text-cream/60 rounded-full flex items-center justify-center hover:text-cream hover:bg-charcoal transition-colors border border-white/10"
            aria-label="Bài tiếp theo"
            title="Bài tiếp theo"
          >
            <SkipForward size={14} />
          </motion.button>
        )}

        {/* Play/Pause */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          onClick={toggle}
          className="w-12 h-12 bg-charcoal/90 backdrop-blur text-cream rounded-full flex items-center justify-center shadow-lg hover:bg-charcoal transition-colors border border-white/10"
          aria-label={playing ? 'Tắt nhạc' : 'Bật nhạc'}
          title={playing ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
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

      <AutoplayHint playing={playing} onPlay={() => { sendCommand('playVideo'); setPlaying(true) }} />
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
