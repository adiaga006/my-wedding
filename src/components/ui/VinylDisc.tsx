'use client'

import { motion } from 'motion/react'
import { useMusicContext } from '@/contexts/MusicContext'

/* Toạ độ đĩa trong SVG */
const CX = 54   // tâm đĩa X
const CY = 62   // tâm đĩa Y
const R  = 46   // bán kính đĩa

/* Điểm kim chạm đĩa (ở rãnh, ~60% bán kính, góc ~315°) */
const NX = CX + R * 0.58 * Math.cos(-Math.PI * 0.28)   // ≈ 74
const NY = CY + R * 0.58 * Math.sin(-Math.PI * 0.28)   // ≈ 45

/* Trục xoay cần (pivot) */
const PX = 128
const PY = 16

/* Hướng của cần đĩa (pivot → kim) */
const dx = NX - PX
const dy = NY - PY
const len = Math.sqrt(dx * dx + dy * dy)
const ux = dx / len  // unit vector
const uy = dy / len

/* Headshell: vuông góc với cần, dài 10px */
const hx = -uy
const hy =  ux
const H1X = NX - hx * 5
const H1Y = NY - hy * 5
const H2X = NX + hx * 5
const H2Y = NY + hy * 5

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
      <div
        style={{
          filter: playing
            ? 'drop-shadow(0 0 10px rgba(200,168,74,0.4)) drop-shadow(0 2px 8px rgba(0,0,0,0.5))'
            : 'drop-shadow(0 2px 10px rgba(0,0,0,0.55))',
          transition: 'filter 0.5s',
        }}
      >
        <svg width="148" height="118" viewBox="0 0 148 118" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="vd-body" cx="38%" cy="33%" r="68%">
              <stop offset="0%"   stopColor="#303030" />
              <stop offset="35%"  stopColor="#141414" />
              <stop offset="100%" stopColor="#060606" />
            </radialGradient>
            <radialGradient id="vd-label" cx="38%" cy="32%" r="72%">
              <stop offset="0%"   stopColor="#e0b84a" />
              <stop offset="45%"  stopColor="#c8a030" />
              <stop offset="100%" stopColor="#7a5510" />
            </radialGradient>
            <radialGradient id="vd-shine" cx="28%" cy="22%" r="52%">
              <stop offset="0%"   stopColor="white" stopOpacity="0.14" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── Đĩa than (xoay) ── */}
          <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: playing ? 'vinyl-spin 3s linear infinite' : 'none' }}>
            {/* Thân đĩa */}
            <circle cx={CX} cy={CY} r={R} fill="url(#vd-body)" />

            {/* Rãnh đĩa — vòng tròn đồng tâm */}
            {[40,37,34,31,28,25,22,19].map((r, i) => (
              <circle key={i} cx={CX} cy={CY} r={r}
                fill="none" stroke="white"
                strokeOpacity={0.036 + i * 0.003}
                strokeWidth="0.65"
              />
            ))}

            {/* Nhãn trung tâm (label) */}
            <circle cx={CX} cy={CY} r={17} fill="url(#vd-label)" />
            <circle cx={CX} cy={CY} r={17} fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="0.5" />
            <circle cx={CX} cy={CY} r={13} fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="0.4" />

            {/* Lỗ tâm */}
            <circle cx={CX} cy={CY} r={3.5} fill="#050505" />

            {/* Phản chiếu bóng */}
            <circle cx={CX} cy={CY} r={R} fill="url(#vd-shine)" />

            {/* Viền mỏng */}
            <circle cx={CX} cy={CY} r={R - 0.5} fill="none" stroke="white" strokeOpacity="0.07" strokeWidth="1" />
          </g>

          {/* ── Cần đĩa (tonearm) — đứng yên ── */}

          {/* Đế trục (pivot base) */}
          <circle cx={PX} cy={PY} r={7} fill="#A6852E" />
          <circle cx={PX} cy={PY} r={5} fill="url(#vd-label)" />
          <circle cx={PX} cy={PY} r={2} fill="#1C2E14" />

          {/* Thân cần — từ pivot đến gần kim */}
          <line
            x1={PX} y1={PY + 7}
            x2={NX - ux * 4} y2={NY - uy * 4}
            stroke="#C8A84A" strokeWidth="2.8" strokeLinecap="round"
          />
          {/* Bóng cần — tạo chiều sâu */}
          <line
            x1={PX + 1} y1={PY + 8}
            x2={NX - ux * 3 + 1} y2={NY - uy * 3 + 1}
            stroke="black" strokeOpacity="0.25" strokeWidth="2.8" strokeLinecap="round"
          />

          {/* Headshell (đầu cần — vuông góc) */}
          <line
            x1={H1X} y1={H1Y} x2={H2X} y2={H2Y}
            stroke="#C8A84A" strokeWidth="2.2" strokeLinecap="round"
          />

          {/* Kim (stylus) */}
          <circle cx={NX} cy={NY} r={2} fill="#fff" fillOpacity="0.9" />
          <circle cx={NX} cy={NY} r={1} fill="#C8A84A" />
        </svg>
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
        <p className="font-sans text-[11px] sm:text-xs text-cream/55 tracking-wide max-w-[140px] sm:max-w-[200px] truncate">
          {currentTitle || '♪'}
        </p>
      </div>
    </motion.div>
  )
}
