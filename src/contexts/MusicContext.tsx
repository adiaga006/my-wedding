'use client'

import {
  createContext, useContext, useState, useRef,
  useEffect, useCallback, useMemo, type ReactNode,
} from 'react'

/* ── Types ── */
interface PlaylistItem {
  title?: string
  url?: string
  audioFile?: { asset?: { url?: string } }
}

type ResolvedTrack =
  | { type: 'file'; src: string; title?: string }
  | { type: 'youtube'; id: string; title?: string }

interface MusicContextValue {
  playing: boolean
  currentTitle: string | undefined
  hasTrack: boolean
  toggle: () => void
  skipNext: () => void
}

/* ── Helpers ── */
function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]{11})/)
  return m ? m[1] : null
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function resolveTrack(item: PlaylistItem): ResolvedTrack | null {
  const fileSrc = item.audioFile?.asset?.url
  if (fileSrc) return { type: 'file', src: fileSrc, title: item.title }
  if (item.url) {
    const id = extractYouTubeId(item.url)
    if (id) return { type: 'youtube', id, title: item.title }
  }
  return null
}

const YT_STATE = { ENDED: 0, PLAYING: 1, PAUSED: 2 }

/* ── Context ── */
const MusicContext = createContext<MusicContextValue | null>(null)

export function useMusicContext() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusicContext phải dùng bên trong MusicProvider')
  return ctx
}

/* ── Provider ── */
export function MusicProvider({ children, playlist }: { children: ReactNode; playlist?: PlaylistItem[] }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const ytRef    = useRef<HTMLIFrameElement>(null)

  /* Resolve + shuffle đồng bộ — không cần render cycle thêm */
  const tracks = useMemo<ResolvedTrack[]>(() => {
    if (!playlist?.length) return []
    const resolved = playlist.map(resolveTrack).filter(Boolean) as ResolvedTrack[]
    return shuffle(resolved)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist?.length])

  const track = tracks[index] ?? null

  /* Load + autoplay khi đổi bài — unlock on first gesture nếu browser chặn */
  useEffect(() => {
    const el = audioRef.current
    if (!el || track?.type !== 'file') return
    el.src = track.src
    el.load()

    el.play().then(() => setPlaying(true)).catch(() => {
      /* Browser chặn autoplay → đăng ký unlock khi người dùng tương tác lần đầu */
      const unlock = () => {
        el.play().then(() => setPlaying(true)).catch(() => {})
        document.removeEventListener('touchstart', unlock)
        document.removeEventListener('pointerdown', unlock)
      }
      document.addEventListener('touchstart', unlock, { once: true, passive: true })
      document.addEventListener('pointerdown', unlock, { once: true })
    })
  }, [track]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Play/pause khi toggle — không reset src */
  useEffect(() => {
    const el = audioRef.current
    if (!el || track?.type !== 'file') return
    if (playing) el.play().catch(() => {})
    else el.pause()
  }, [playing]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Bài kết thúc → chuyển bài tiếp */
  const onAudioEnded = useCallback(() => {
    setIndex(i => (i + 1) % tracks.length)
  }, [tracks.length])

  /* YouTube postMessage */
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        const state = data?.info?.playerState
        if (state === YT_STATE.PLAYING) setPlaying(true)
        else if (state === YT_STATE.PAUSED) setPlaying(false)
        else if (state === YT_STATE.ENDED) setIndex(i => (i + 1) % tracks.length)
      } catch { /* ignore */ }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [tracks.length])

  const sendYT = useCallback((func: string) => {
    ytRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }), '*'
    )
  }, [])

  /* Controls */
  const toggle = useCallback(() => {
    if (!track) return
    if (track.type === 'file') {
      const el = audioRef.current
      if (!el) return
      if (playing) { el.pause(); setPlaying(false) }
      else { el.play().catch(() => {}); setPlaying(true) }
    } else {
      if (playing) { sendYT('pauseVideo'); setPlaying(false) }
      else { sendYT('playVideo'); setPlaying(true) }
    }
  }, [track, playing, sendYT])

  const skipNext = useCallback(() => {
    if (track?.type === 'file') audioRef.current?.pause()
    setIndex(i => (i + 1) % tracks.length)
  }, [track, tracks.length])

  /* YouTube params */
  const ytTracks = tracks.filter((t): t is Extract<ResolvedTrack, { type: 'youtube' }> => t.type === 'youtube')
  const ytPlaylistParam = ytTracks.length > 1
    ? ytTracks.map(t => t.id).filter(id => track?.type !== 'youtube' || id !== track.id).join(',')
    : track?.type === 'youtube' ? track.id : ''

  return (
    <MusicContext.Provider value={{
      playing,
      currentTitle: track?.title,
      hasTrack: !!track,
      toggle,
      skipNext,
    }}>
      {/* Hidden audio element */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} onEnded={onAudioEnded} preload="auto" className="hidden" />

      {/* YouTube iframe — chỉ khi track là YouTube */}
      {track?.type === 'youtube' && (
        <iframe
          key={track.id}
          ref={ytRef}
          src={`https://www.youtube.com/embed/${track.id}?enablejsapi=1&autoplay=1&loop=${ytTracks.length === 1 ? 1 : 0}&playlist=${ytPlaylistParam}&controls=0&mute=0&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
          allow="autoplay; encrypted-media"
          className="absolute w-0 h-0 pointer-events-none opacity-0"
          aria-hidden="true"
          title="background music"
        />
      )}

      {children}
    </MusicContext.Provider>
  )
}
