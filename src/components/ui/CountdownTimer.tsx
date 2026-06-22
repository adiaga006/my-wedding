'use client'

import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate))
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  if (!timeLeft) return null

  const isPast = new Date(targetDate).getTime() <= Date.now()
  if (isPast) {
    return (
      <p className="font-serif text-xl sm:text-2xl italic text-cream/80 text-center">
        Hôm nay là ngày trọng đại của chúng tôi 🎊
      </p>
    )
  }

  const units = [
    { label: 'Ngày', value: timeLeft.days },
    { label: 'Giờ', value: timeLeft.hours },
    { label: 'Phút', value: timeLeft.minutes },
    { label: 'Giây', value: timeLeft.seconds },
  ]

  return (
    // 2×2 trên mobile nhỏ, 1 hàng từ sm trở lên
    <div className="grid grid-cols-2 xs:grid-cols-4 gap-4 xs:gap-0 xs:flex xs:items-center">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center">
          <div className="text-center px-2 xs:px-3 sm:px-5">
            <div className="font-serif text-4xl xs:text-5xl sm:text-6xl md:text-7xl text-cream font-light leading-none tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="font-sans text-[9px] xs:text-[10px] tracking-widest uppercase text-cream/50 mt-2">
              {unit.label}
            </div>
          </div>
          {/* Separator — chỉ hiện giữa các unit, ẩn trên 2×2 grid */}
          {i < 3 && (
            <span className="hidden xs:block font-serif text-2xl sm:text-3xl text-cream/30 mb-4 select-none">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
