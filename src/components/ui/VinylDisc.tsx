'use client'

import { useId, useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useMusicContext } from '@/contexts/MusicContext'

const W  = 134
const H  = 104
const CX = 47
const CY = 52
const R  = 40

const PX = 118
const PY = 14

const NX = CX + R * 0.56 * Math.cos((-54 * Math.PI) / 180)
const NY = CY + R * 0.56 * Math.sin((-54 * Math.PI) / 180)

const adx = NX - PX, ady = NY - PY
const aLen = Math.sqrt(adx * adx + ady * ady)
const ux = adx / aLen, uy = ady / aLen
const hx = -uy, hy = ux
const H1X = NX - hx * 6, H1Y = NY - hy * 6
const H2X = NX + hx * 6, H2Y = NY + hy * 6

/* Tạo path sector (hình quạt) trên nhãn đĩa để thấy rõ xoay */
const LABEL_R = 17
// Sector 130° bắt đầu từ góc 0 (phải)
const sA1 = 0
const sA2 = (130 * Math.PI) / 180
const sx1 = R + LABEL_R * Math.cos(sA1), sy1 = R + LABEL_R * Math.sin(sA1)
const sx2 = R + LABEL_R * Math.cos(sA2), sy2 = R + LABEL_R * Math.sin(sA2)
const SECTOR_PATH = `M ${R} ${R} L ${sx1.toFixed(2)} ${sy1.toFixed(2)} A ${LABEL_R} ${LABEL_R} 0 0 1 ${sx2.toFixed(2)} ${sy2.toFixed(2)} Z`

export default function VinylDisc() {
  const uid = useId().replace(/:/g, '')
  const { playing, currentTitle, hasTrack } = useMusicContext()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!hasTrack) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2 }}
      className="flex items-center justify-center gap-3"
    >
      <div className="relative flex-shrink-0" style={{ width: W, height: H }}>

        {/* Glow pulse khi đang phát */}
        {playing && (
          <motion.div
            animate={{ opacity: [0.25, 0.65, 0.25], scale: [1, 1.04, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left:   CX - R - 5,
              top:    CY - R - 5,
              width:  (R + 5) * 2,
              height: (R + 5) * 2,
              borderRadius: '50%',
              border: '2px solid rgba(200,168,74,0.6)',
              boxShadow: '0 0 12px rgba(200,168,74,0.3)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* ══ 1. Disc — HTML div xoay via animation-play-state ══ */}
        <div
          style={{
            position: 'absolute',
            left:   CX - R,
            top:    CY - R,
            width:  R * 2,
            height: R * 2,
            borderRadius: '50%',
            animationName:           'vinyl-spin',
            animationDuration:       '2.5s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationPlayState:      playing ? 'running' : 'paused',
            filter: playing
              ? 'drop-shadow(0 0 12px rgba(200,168,74,0.4)) drop-shadow(0 2px 8px rgba(0,0,0,0.5))'
              : 'drop-shadow(0 2px 10px rgba(0,0,0,0.6))',
            transition: 'filter 0.4s',
          }}
        >
          <svg width={R * 2} height={R * 2} viewBox={`0 0 ${R * 2} ${R * 2}`} fill="none">
            <defs>
              <radialGradient id={`${uid}-body`} cx="38%" cy="32%" r="66%">
                <stop offset="0%"   stopColor="#383838" />
                <stop offset="30%"  stopColor="#161616" />
                <stop offset="100%" stopColor="#050505" />
              </radialGradient>
              <radialGradient id={`${uid}-label`} cx="36%" cy="30%" r="70%">
                <stop offset="0%"   stopColor="#e8c458" />
                <stop offset="40%"  stopColor="#c8a030" />
                <stop offset="100%" stopColor="#6e480a" />
              </radialGradient>
              <radialGradient id={`${uid}-shine`} cx="25%" cy="20%" r="56%">
                <stop offset="0%"   stopColor="white" stopOpacity="0.22" />
                <stop offset="55%"  stopColor="white" stopOpacity="0.05" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Thân đĩa */}
            <circle cx={R} cy={R} r={R} fill={`url(#${uid}-body)`} />

            {/* Rãnh đĩa */}
            {[44,41,38,35,32,29,26,23,20].map((r, i) => (
              <circle key={i} cx={R} cy={R} r={r}
                fill="none" stroke="white"
                strokeOpacity={0.04 + i * 0.005} strokeWidth="0.9"
              />
            ))}

            {/* ── Marker to gần mép đĩa — rõ nhất khi xoay ── */}
            <circle cx={R + 36} cy={R}     r={4}   fill="white"   fillOpacity="0.88" />
            <circle cx={R - 28} cy={R + 24} r={2.2} fill="#C8A84A" fillOpacity="0.7" />

            {/* Label trung tâm */}
            <circle cx={R} cy={R} r={LABEL_R + 1} fill={`url(#${uid}-label)`} />

            {/* ── Sector bất đối xứng trên label — rõ khi xoay ── */}
            <path d={SECTOR_PATH} fill="rgba(0,0,0,0.38)" />

            {/* Vòng viền label */}
            <circle cx={R} cy={R} r={LABEL_R + 1} fill="none" stroke="white" strokeOpacity="0.18" strokeWidth="0.7" />
            <circle cx={R} cy={R} r={13}            fill="none" stroke="white" strokeOpacity="0.10" strokeWidth="0.4" />

            {/* Lỗ tâm */}
            <circle cx={R} cy={R} r={3.8} fill="#040404" />

            {/* Shine */}
            <circle cx={R} cy={R} r={R} fill={`url(#${uid}-shine)`} />

            {/* Viền ngoài */}
            <circle cx={R} cy={R} r={R - 0.5} fill="none" stroke="white" strokeOpacity="0.09" strokeWidth="1.2" />
          </svg>
        </div>

        {/* ══ 2. Tonearm — motion.div xoay quanh pivot ══ */}
        <motion.div
          animate={{ rotate: playing ? 0 : -30 }}
          transition={{
            duration: 0.8,
            ease: playing
              ? [0.34, 1.4, 0.64, 1]   /* bounce khi hạ xuống */
              : [0.76, 0, 0.24, 1],     /* smooth khi nhấc lên */
          }}
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: `${PX}px ${PY}px`,
          }}
        >
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" overflow="visible">
            {/* Bóng */}
            <line
              x1={PX} y1={PY + 10}
              x2={H1X + ux * 3 + 2} y2={H1Y + uy * 3 + 2}
              stroke="black" strokeOpacity="0.22" strokeWidth="4" strokeLinecap="round"
            />
            {/* Thân cần */}
            <line
              x1={PX} y1={PY + 10}
              x2={H1X + ux * 3} y2={H1Y + uy * 3}
              stroke="#C8A84A" strokeWidth="3.2" strokeLinecap="round"
            />
            {/* Sọc sáng */}
            <line
              x1={PX - 0.6} y1={PY + 10}
              x2={H1X + ux * 3 - 0.6} y2={H1Y + uy * 3 - 0.6}
              stroke="white" strokeOpacity="0.28" strokeWidth="1.1" strokeLinecap="round"
            />
            {/* Headshell */}
            <line x1={H1X} y1={H1Y} x2={H2X} y2={H2Y}
              stroke="#C8A84A" strokeWidth="3.2" strokeLinecap="round"
            />
            <line x1={H1X - 0.5} y1={H1Y - 0.5} x2={H2X - 0.5} y2={H2Y - 0.5}
              stroke="white" strokeOpacity="0.2" strokeWidth="1.1" strokeLinecap="round"
            />
            {/* Stylus */}
            <circle cx={H2X} cy={H2Y} r={3.2} fill="#1a1a1a" stroke="#C8A84A" strokeWidth="1.2" />
            <circle cx={H2X} cy={H2Y} r={1.4} fill="white" fillOpacity="0.95" />
          </svg>
        </motion.div>

        {/* ══ 3. Pivot base — static ══ */}
        <svg
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
          width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none"
        >
          <defs>
            <radialGradient id={`${uid}-pg`} cx="35%" cy="30%" r="68%">
              <stop offset="0%"   stopColor="#f0d068" />
              <stop offset="50%"  stopColor="#c8a030" />
              <stop offset="100%" stopColor="#6e480a" />
            </radialGradient>
            <radialGradient id={`${uid}-pt`} cx="35%" cy="30%" r="65%">
              <stop offset="0%"   stopColor="#ffe080" />
              <stop offset="100%" stopColor="#b88a20" />
            </radialGradient>
          </defs>
          <circle cx={PX} cy={PY} r={12}  fill="#111" />
          <circle cx={PX} cy={PY} r={10}  fill={`url(#${uid}-pg)`} />
          <circle cx={PX} cy={PY} r={7}   fill={`url(#${uid}-pt)`} />
          <circle cx={PX - 2} cy={PY - 2} r={3} fill="white" fillOpacity="0.3" />
          <circle cx={PX} cy={PY} r={2.8} fill="#111" />
          <circle cx={PX} cy={PY} r={1.3} fill="#2a2a2a" />
        </svg>
      </div>

      {/* Track info + soundwave */}
      <div className="flex items-center gap-2 min-w-0">
        {playing ? (
          <div className="flex items-end gap-[2px] h-3.5 flex-shrink-0">
            {[0.1, 0.3, 0, 0.2, 0.15].map((delay, i) => (
              <motion.div key={i}
                className="w-[2px] rounded-full bg-gold"
                animate={{ height: ['3px', '13px', '5px', '13px', '3px'] }}
                transition={{ duration: 0.85, repeat: Infinity, delay, ease: 'easeInOut' }}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-end gap-[2px] h-3.5 flex-shrink-0">
            {[0,0,0,0,0].map((_, i) => (
              <div key={i} className="w-[2px] h-[3px] rounded-full bg-cream/20" />
            ))}
          </div>
        )}
        <p className="font-sans text-[11px] sm:text-xs text-cream/55 tracking-wide leading-snug" suppressHydrationWarning>
          {mounted ? (currentTitle || '♪') : '♪'}
        </p>
      </div>
    </motion.div>
  )
}
