'use client'

import { motion } from 'motion/react'
import { useMusicContext } from '@/contexts/MusicContext'

function VinylSVG({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        {/* Gradient bóng đĩa than */}
        <radialGradient id="vinyl-body" cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#2a2a2a" />
          <stop offset="40%"  stopColor="#111111" />
          <stop offset="100%" stopColor="#080808" />
        </radialGradient>

        {/* Gradient nhãn trung tâm */}
        <radialGradient id="vinyl-label" cx="40%" cy="35%" r="70%">
          <stop offset="0%"   stopColor="#d4a840" />
          <stop offset="50%"  stopColor="#b8861c" />
          <stop offset="100%" stopColor="#7a5510" />
        </radialGradient>

        {/* Phản chiếu bóng trên đĩa */}
        <radialGradient id="vinyl-shine" cx="30%" cy="25%" r="55%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.12" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        <clipPath id="vinyl-clip">
          <circle cx="50" cy="50" r="49" />
        </clipPath>
      </defs>

      {/* Thân đĩa */}
      <circle cx="50" cy="50" r="49" fill="url(#vinyl-body)" />

      {/* Rãnh đĩa — vòng tròn đồng tâm */}
      {[44, 40, 36, 33, 30, 27, 25, 23].map((r, i) => (
        <circle key={i} cx="50" cy="50" r={r}
          fill="none"
          stroke="white"
          strokeOpacity={0.035 + i * 0.004}
          strokeWidth={0.6}
        />
      ))}

      {/* Nhãn trung tâm (label) */}
      <circle cx="50" cy="50" r="19" fill="url(#vinyl-label)" />
      {/* Vòng viền nhãn */}
      <circle cx="50" cy="50" r="19" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="0.5" />
      {/* Vòng trang trí bên trong nhãn */}
      <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeOpacity="0.12" strokeWidth="0.4" />

      {/* Lỗ tâm */}
      <circle cx="50" cy="50" r="3.5" fill="#000" />
      <circle cx="50" cy="50" r="2.5" fill="#1a1a1a" />

      {/* Phản chiếu bóng (shine) */}
      <circle cx="50" cy="50" r="49" fill="url(#vinyl-shine)" clipPath="url(#vinyl-clip)" />

      {/* Viền ngoài mỏng */}
      <circle cx="50" cy="50" r="48.5" fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
    </svg>
  )
}

export default function VinylDisc() {
  const { playing, currentTitle, hasTrack } = useMusicContext()

  if (!hasTrack) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2 }}
      className="flex items-center justify-center gap-3"
    >
      {/* Đĩa quay */}
      <div
        style={{
          borderRadius: '50%',
          flexShrink: 0,
          animation: playing ? 'vinyl-spin 4s linear infinite' : 'none',
          filter: playing
            ? 'drop-shadow(0 0 8px rgba(200,168,74,0.4))'
            : 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))',
          transition: 'filter 0.5s',
        }}
      >
        <VinylSVG size={52} />
      </div>

      {/* Tên bài + sóng âm */}
      <div className="flex items-center gap-2">
        {playing && (
          <div className="flex items-end gap-[2px] h-3 flex-shrink-0">
            {[0.1, 0.3, 0, 0.2].map((delay, i) => (
              <motion.div
                key={i}
                className="w-[2px] rounded-full bg-gold/70"
                animate={{ height: ['3px', '11px', '4px', '11px', '3px'] }}
                transition={{ duration: 0.9, repeat: Infinity, delay, ease: 'easeInOut' }}
              />
            ))}
          </div>
        )}
        <p className="font-sans text-[11px] sm:text-xs text-cream/55 tracking-wide max-w-[160px] sm:max-w-[220px] truncate">
          {currentTitle || '♪'}
        </p>
      </div>
    </motion.div>
  )
}
